import { IUser } from "../../entities/user";
import { IBaseRepository } from "../../../global/repository";
import { UserModel } from "../models/user";
import { toArray } from "../../../utils/functions";
import { AppError } from "../../../global/error";
import { StatusCodes } from "../../../global/enums";

export class UserRepositoryImpl implements IBaseRepository<IUser> {
  constructor(private readonly model: typeof UserModel) {}
  async create(data: IUser | IUser[]): Promise<IUser[]> {
    try {
      const newUsers = await this.model.insertMany(toArray<IUser>(data));
      return toArray<IUser>(newUsers);
    } catch (error: any) {
      throw new AppError({
        message: "Error creating user",
        type: "Insert users",
        description: error.message,
        fieldsModified: 0,
        status: StatusCodes.notModified,
      });
    }
  }
}
