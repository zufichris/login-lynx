import { Request, Response } from "express";
import { CreateUser } from "../../../domain/useCases/CreateUser";
import { UserRepositoryImpl } from "../../../data/orm/repository/UserRepositoryImpl";
import { UserModel } from "../../../data/orm/models/user";
import { IResponseData } from "../../../global/entities";
import { StatusCodes } from "../../../global/enums";
import { CreateUserDto } from "../../../data/dto/user";
import { AppError } from "../../../global/error";

class Controllers {
  private readonly createUserUseCase: CreateUser;

  constructor(private readonly userRepositoryImpl: UserRepositoryImpl) {
    this.createUserUseCase = new CreateUser(userRepositoryImpl);
  }

  async createUser(req: Request, res: Response) {
    try {
      const body = req.body;
      const userData: CreateUserDto = {
        email: body.email,
        firstName: body.firstName,
      };
      const error = new AppError({
        message: "Data Validation Failed Invalid Data",
        errors: [],
        type: "create user",
        status: StatusCodes.badRequest,
      });
      if (!userData.firstName)
        error.error.errors?.push({ firstName: "FirstName is Required" });
      if (!userData.email)
        error.error.errors?.push({ email: "Email is Required" });

      if (error.error.errors?.length) throw error;

      const result = await this.createUserUseCase.execute(userData);
      res.status(result.status).json(result);
    } catch (err: any) {
      const error: IResponseData<null> = {
        message: "Error Creating User",
        status: err?.error?.status ?? StatusCodes.badGateway,
        type: "create user",
        data: null,
        ...err,
      };
      res.status(error.status).json(error);
    }
  }
}

export const userControllers = new Controllers(
  new UserRepositoryImpl(UserModel)
);
