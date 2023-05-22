import { UserService } from './user.service';
import { buildPageQuery } from 'src/util';
import { FindManyOptions, Like } from 'typeorm';
import { IUser } from 'src/interface';
import {
  Controller,
  Inject,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';

@Controller('/api/admin')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly service: UserService,
  ) {}

  @Get('/:id')
  async getUser(@Param('id') id: number) {
    const data = await this.service.findOne({ id });
    return {
      status: 0,
      data,
      message: 'ok',
    };
  }

  async buildQuery(option: FindManyOptions, fields: IUser) {
    const where = {};
    Object.keys(fields).forEach((k) => {
      const value = fields[k];
      if (k === 'name') {
        where[k] = Like(`%${value}%`);
      }
      if (k === 'userName') {
        where[k] = Like(`%${value}%`);
      }
      if (k === 'phoneNum') {
        where[k] = Like(`%${value}%`);
      }
      if (k === 'email') {
        where[k] = Like(`%${value}%`);
      }
    });
    option.where = where;
    return option;
  }
  @Get('/')
  async list(@Query() query) {
    const queryAttr = await this.buildQuery(...buildPageQuery(query));
    const { list, count } = await this.service.findMany(queryAttr);
    return {
      status: 0,
      data: list,
      message: 'ok',
      total: count,
      current: query.current,
      pageSize: query.pageSize,
    };
  }

  @Post('/')
  async createUser(@Body() param: IUser) {
    const { id } = await this.service.create(param);
    return {
      status: 0,
      data: { id },
    };
  }

  @Put('/:id')
  async updateUser(@Body() param: IUser, @Param('id') id: number) {
    const res = await this.service.update({ ...param, id });
    return {
      status: 0,
      data: res,
      message: 'ok',
    };
  }

  @Delete('/:ids')
  async DeleteUser(@Param('ids') ids: string) {
    await this.service.delete(ids.split(',').map((id) => Number(id)));
    return { status: 0 };
  }
}
