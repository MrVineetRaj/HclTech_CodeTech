// src/config/passport.ts
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { envConf } from "./envConf";

// this to serialize user data while authenticating
passport.serializeUser(function (user, done) {
  done(null, user);
});

// this is passport utility to deserialize user data when sending it back to user
passport.deserializeUser(function (obj: any, done) {
  done(null, obj);
});

// setting up github strategy for github OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: envConf.GOOGLE_CLIENT_ID,
      clientSecret: envConf.GOOGLE_CLIENT_SECRET,
      callbackURL: `${envConf.BASE_URL}/api/v1/auth/google/callback`,
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: Function
    ) {
      if (profile) {
        console.log(profile);
        return done(null, profile);
      }
      return done(new Error("No profile found"), null);
    }
  )
);

export default passport;
