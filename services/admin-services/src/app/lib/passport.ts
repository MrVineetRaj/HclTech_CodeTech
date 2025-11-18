import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { HealthProvider } from "../models";
import bcrypt from "bcryptjs";

/**
 * Validate user password
 */
async function validateUserPassword({
  originalPassword,
  password,
}: {
  originalPassword: string;
  password: string;
}): Promise<boolean> {
  try {
    return await bcrypt.compare(password, originalPassword);
  } catch (error) {
    console.error("Password validation error:", error);
    return false;
  }
}

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
  done(null, { id: user.id || user._id, userType: user.userType });
});

// Deserialize user from session
passport.deserializeUser(async function (sessionData: any, done) {
  try {
    const { id, userType } = sessionData;
    let user;

    if (userType === "provider") {
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
