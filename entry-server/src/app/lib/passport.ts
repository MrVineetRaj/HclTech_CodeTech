import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Patient, HealthProvider } from "../models";
import { validateUserPassword } from "../routes/auth/utils";

// Patient Local Strategy
passport.use(
  "patient-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      console.log("Patient login attempt:", { email });
      try {
        const patient = await Patient.findOne({ email }).select("+password");

        if (!patient) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isMatchedPassword = await validateUserPassword({
          originalPassword: patient.password,
          password,
        });

        if (!isMatchedPassword) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Remove password from user object before returning
        const patientObj = patient.toObject();
        const id: string = patientObj._id.toString();

        return done(null, { id: id, userType: "patient" });
      } catch (err) {
        console.error("Patient authentication error:", err);
        return done(err);
      }
    }
  )
);

// Health Provider Local Strategy
passport.use(
  "provider-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      console.log("Provider login attempt:", { email });
      try {
        const provider = await HealthProvider.findOne({ email }).select(
          "+password"
        );

        if (!provider) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isMatchedPassword = await validateUserPassword({
          originalPassword: provider.password,
          password,
        });

        if (!isMatchedPassword) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Remove password from user object before returning
        const providerObj = provider.toObject();
        const id: string = providerObj._id.toString();

        return done(null, { id: id, userType: "provider" });
      } catch (err) {
        console.error("Provider authentication error:", err);
        return done(err);
      }
    }
  )
);

// Serialize user for session storage
passport.serializeUser((user: any, done) => {
  done(null, { id: user._id, userType: user.userType });
});

// Deserialize user from session
passport.deserializeUser(async function (sessionData: any, done) {
  try {
    const { id, userType } = sessionData;
    let user;

    if (userType === "patient") {
      user = await Patient.findById(id);
    } else if (userType === "provider") {
      user = await HealthProvider.findById(id);
    }

    if (!user) {
      return done(null, false);
    }

    done(null, { id, userType });
  } catch (error) {
    console.error("Deserialization error:", error);
    done(error, null);
  }
});

export default passport;
