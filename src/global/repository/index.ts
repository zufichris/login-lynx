import mongoose from "mongoose";
import { ID } from "../entities";
import { IUser } from "../../data/entities/user";

export interface IBaseRepository<TData> {
  create?(data: TData): Promise<TData>;
  update?(data: Partial<TData> | TData[]): Promise<TData[]>;
  delete?(id: ID): Promise<boolean>;
  findById?(id: ID): Promise<TData>;
  query?(
    filter?: mongoose.FilterQuery<TData>,
    projection?: mongoose.ProjectionType<IUser>,
    options?: mongoose.QueryOptions<mongoose.Model<TData>>
  ): Promise<TData[]>;
  count?(filter?: mongoose.FilterQuery<TData>): Promise<number>;
}
