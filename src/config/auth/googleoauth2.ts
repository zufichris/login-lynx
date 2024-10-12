import {
  Strategy,
  StrategyOptionsWithRequest,
  VerifyCallback,
} from "passport-google-oauth2";
import { env } from "../env";
export const googleAuth = new Strategy(
  {
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_callback_url,
    scope: ["profile"],
  },
  function (accessToken, refreshToken, profile, cb) {
    cb(accessToken, refreshToken, profile);
  }
);

// function googleStrategy(getInfo: (user: IUser) => void) {
//   const googleAuth = new Strategy(
//     {
//       clientID: env.google_client_id,
//       clientSecret: env.google_client_secret,
//       callbackURL: env.google_callback_url,
//       scope: ["profile"],
//     },
//     function verify(error, user) {
//       if (error)
//         throw new AppError({
//           message: "Google Authentication Failed",
//           description: error,
//         });
//       console.log(user);
//     }
//   );
// }
