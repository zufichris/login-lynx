//Adding Custom Properties in Express Namespace

import * as express from "express"; //This makes sure you're extending  existing interfaces rather than defining a new ones
import { IUser } from "../../data/entities/user";

declare global {
  namespace Express {
    interface Request {
      authUser: IUser;
    }
    //Add More Properties
  }
}
