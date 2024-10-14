import passport, { Authenticator } from "passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { env } from "../env";
import { IUser } from "../../data/entities/user";
import { AuthTypes, OAuthProviders } from "../../data/enums/auth";

export const GoogleStrategy = new Strategy(
  {
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    scope: ["profile", "email"],
    callbackURL: env.google_callback_url,
  },
  function verify(accessToken, refreshToken, profile, done) {
    const user = processUser(accessToken, refreshToken, profile, done);
    return done(null, user);
  }
);

function processUser(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
): IUser {
  const user = {
    id: profile.id,
    email: profile?.emails![0]?.value,
    firstName: `${profile.name?.familyName! ?? ""} ${
      profile.name?.givenName ?? ""
    }`,
    lastName: profile.name?.middleName,
    userName: profile.username,
    oAuthId: profile.provider,
    authType: AuthTypes.OAuth,
    avatar: profile.photos![0]?.value,
    accessToken,
    refreshToken,
    oAuthProvider: OAuthProviders.Google,
  };

  return user;
}
