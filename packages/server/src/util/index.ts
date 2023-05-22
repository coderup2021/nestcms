import { IArticle, QueryOption } from 'src/interface';
import { FindManyOptions } from 'typeorm';

export function buildPageQuery(
  query: QueryOption,
): [FindManyOptions, IArticle & QueryOption] {
  const { current = 1, pageSize = 10, ...rest } = query;
  const obj = {
    take: pageSize,
    skip: (current - 1) * pageSize,
  };

  return [obj, rest];
}
