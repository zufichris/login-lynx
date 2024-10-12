import { ID, IResponseData, IResponseDataPaginated } from "../entities";

export interface IBaseRepository<TData> {
  create?(data: TData | TData[]): Promise<TData[]>;
  update?(data: Partial<TData> | TData[]): Promise<TData[]>;
  delete?(id: ID): Promise<boolean>;
  query?(
    filter: qs.ParsedQs,
    options: qs.IParseOptions
  ): Promise<IResponseDataPaginated>;
}
