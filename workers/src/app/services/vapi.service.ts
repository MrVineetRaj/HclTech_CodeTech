import axios, { AxiosInstance } from "axios";
import { envConf } from "../lib/envConf";

// VAPI Service for making AI voice calls
class VAPIService {
  private apiKey: string;
  private phoneNumberId: string;
  private apiClient: AxiosInstance;
  private baseURL: string = "https://api.vapi.ai";

  constructor() {
    this.apiKey = envConf.VAPI_API_KEY;
    this.phoneNumberId = envConf.VAPI_PHONE_NUMBER_ID;

    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  async makeCall(
    phoneNumber: string,
    message: string,
    patientName: string
  ): Promise<{
    success: boolean;
    callId?: string;
    error?: string;
  }> {
    try {
      console.log(`📞 Initiating VAPI call to ${patientName} (${phoneNumber})`);

      const callPayload = {
        assistant: {
          name: "MediTech AI Assistant",
          firstMessage: message,
          model: {
            provider: "openai",
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful medical assistant reminding patients about their medications and health goals. Be friendly, professional, and clear. Ask the patient to confirm they have taken their medication. Keep responses brief.",
              },
            ],
          },
          voice: {
            provider: "vapi",
            voiceId: "Lily",
          },
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en",
          },
          endCallMessage: "Thank you! Stay healthy and take care.",
          endCallPhrases: [
            "goodbye",
            "bye",
            "thank you bye",
            "that's all",
            "thanks",
          ],
          recordingEnabled: true,
          silenceTimeoutSeconds: 30,
          maxDurationSeconds: 300,
        },
        phoneNumberId: this.phoneNumberId,
        customer: {
          number: phoneNumber,
        },
      };

      const response = await this.apiClient.post("/call", callPayload);

      console.log(
        `✅ VAPI call initiated successfully. Call ID: ${response.data.id}`
      );

      return {
        success: true,
        callId: response.data.id,
      };
    } catch (error: any) {
      console.error(
        "❌ VAPI call failed:",
        error.response?.data || error.message
      );

      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get call status
   * @param callId - ID of the call
   * @returns Call status information
   */
  async getCallStatus(callId: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/call/${callId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to get call status:", error.message);
      throw error;
    }
  }

  /**
   * Generate medication reminder message
   * @param patientName - Patient's name
   * @param medications - List of medications
   * @returns Formatted reminder message
   */
  generateMedicationReminder(
    patientName: string,
    medications: string[]
  ): string {
    const medList = medications.join(", ");
    return `Hi ${patientName}, this is your medication reminder. It's time to take your ${medList}. Please confirm when you've taken your medication. Have you taken it?`;
  }

  /**
   * Generate goal reminder message
   * @param patientName - Patient's name
   * @param goal - Goal description
   * @returns Formatted reminder message
   */
  generateGoalReminder(patientName: string, goal: string): string {
    return `Hi ${patientName}, this is a reminder about your health goal: ${goal}. Have you completed this goal today?`;
  }
}

export const vapiService = new VAPIService();
