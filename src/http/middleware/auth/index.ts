import { genSalt, hash } from "bcrypt";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { AppError } from "../../../global/error";
import { StatusCodes } from "../../../global/enums";
import { decode, verify, sign } from "jsonwebtoken";
import { env } from "../../../config/env";
import qs from "qs";
import { IUser } from "../../../data/entities/user";
import { AuthTypes, OAuthProviders } from "../../../data/enums/auth";
export class Auth {
  static authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies["session"];
    if (!token)
      next(
        new AppError({
          description: "Not Authenticated",
          status: StatusCodes.badRequest,
          redirect: {
            path: "/",
          },
        })
      );
    else {
      const decoded = verify(token, env.jwt_secret);
      const userId = decode(decoded as string);
      if (userId) {
        // req['userId'] = userId as string;
        next();
      } else
        next(
          new AppError({
            type: "Auth",
            message: "Invalid Token",
            redirect: {
              path: "/",
            },
          })
        );
    }
  }

  //googleAuth
  static async googleAuthRequest(req: Request, res: Response) {
    const options = qs.stringify({
      client_id: env.google_client_id,
      redirect_uri: env.google_callback_url,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${options}`;
    res.redirect(url);
  }
  static async getGoogleTokens(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const options = qs.stringify({
        code: req.query.code,
        client_id: env.google_client_id,
        client_secret: env.google_client_secret,
        redirect_uri: env.google_callback_url,
        grant_type: "authorization_code",
      });
      if (!req.query.code)
        throw new AppError({
          message: "Invalid Google Code",
          type: "Auth Error",
        });
      const url = `https://oauth2.googleapis.com/token?${options}`;
      const response = await fetch(url, {
        method: "POST",
      });
      const data = await response.json();
      req.body = data;
      next();
    } catch (error) {
      next(error);
    }
  }
  static async getGoogleUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { access_token, refresh_token, expires_in, id_token, token_type } =
        req.body;
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `${token_type} ${id_token}`,
          },
        }
      );
      const profile = await response.json();
      const userData: IUser = {
        name: profile.name,
        email: profile.email,
        authType: AuthTypes.OAuth,
        avatar: profile.picture,
        oAuthId: profile.id,
        oAuthProvider: OAuthProviders.Google,
        userName: profile.name,
        verified: profile?.verified,
      };
      const { accessToken, refreshToken } = this.setCookies(res, userData);
      req.body = {
        ...userData,
        accessToken,
        refreshToken,
      };
      next();
    } catch (error) {
      next(error);
    }
  }

  //Password Management
  static async hashPassWord(password: string | Buffer): Promise<string> {
    if (password === "") return "";
    const salt = await genSalt(10);
    const hashed = hash(password, salt);
    return hashed;
  }

  //JWT
  private static signJWT(payload: object, expiresIn: number) {
    const token = sign(payload, env.jwt_secret, {
      expiresIn: expiresIn,
    });
    return token;
  }
  static decodeJWT(token: string) {
    const user = verify(token, env.jwt_secret);
    return JSON.stringify(user);
  }
  static setCookies(res: Response, payload: object) {
    const accessTokenOptions: CookieOptions = {
      maxAge: 24 * 60 * 60,
      sameSite: "strict",
      httpOnly: true,
      secure: env.in_prod,
      path: "/",
    };
    const refreshTokenOptions: CookieOptions = {
      maxAge: 24 * 365 * 60 * 60 * 60,
      sameSite: "strict",
      httpOnly: true,
      secure: env.in_prod,
      path: "/",
    };
    const refreshToken = this.signJWT(payload, refreshTokenOptions.maxAge!);
    const accessToken = this.signJWT(payload, accessTokenOptions.maxAge!);
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    return { refreshToken, accessToken };
  }
}
