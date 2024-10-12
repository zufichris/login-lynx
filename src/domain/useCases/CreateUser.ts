import { CreateUserDto } from "../../data/dto/user";
import { IUser } from "../../data/entities/user";
import { UserRepositoryImpl } from "../../data/orm/repository/UserRepositoryImpl";
import { IResponseData } from "../../global/entities";
import { StatusCodes } from "../../global/enums";
import { AppError } from "../../global/error";
import { BaseUseCase } from "../../global/useCase";

export class CreateUser
  implements BaseUseCase<Partial<IUser>, IResponseData<IUser[]>>
{
  constructor(private readonly userRepositoryImpl: UserRepositoryImpl) {}

  async execute(input: CreateUserDto): Promise<IResponseData<IUser[]>> {
    try {
      const newUsers = await this.userRepositoryImpl.create({
        ...input,
        userName: input.email.split("@")[0],
      });
      return {
        data: newUsers,
        message: "User Created",
        status: StatusCodes.created,
        documentsModified: newUsers.length,
        type: "create user",
      };
    } catch (error: any) {
      throw new AppError(error);
    }
  }
}
