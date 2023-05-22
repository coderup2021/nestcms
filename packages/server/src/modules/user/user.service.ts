import { User as UserEntity } from './user.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { IUser } from 'src/interface';
import { genSaltSync } from 'bcrypt';
import { RoleService } from 'src/modules/role/role.service';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly model: Repository<UserEntity>,
    @Inject(RoleService)
    private readonly roleService: RoleService,
  ) {}

  // save
  async create(param: IUser) {
    const {
      name,
      userName,
      password,
      email,
      phoneNum,
      countryCode,
      comments,
      avator,
      enable,
      roleIds,
    } = param;
    const user = new UserEntity();
    user.name = name;
    user.userName = userName;
    user.password = password;
    user.email = email;
    user.phoneNum = phoneNum;
    user.countryCode = countryCode;
    user.comments = comments;
    user.avator = avator;
    user.enable = enable;
    user.salt = genSaltSync();

    let roles = [];
    if (roleIds && roleIds instanceof Array && roleIds.length > 0) {
      roles = await this.roleService.getRolesByIds(roleIds);
    }
    user.roles = roles;

    const { id } = await this.model.save(user);
    return { id };
  }
  async update(param: IUser) {
    const user = await this.model.findOne({
      where: { id: param.id },
    });
    const keys = Object.keys(param);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const value = param[k];
      if (k === 'salt') continue;
      if (k === 'password' && !value.trim()) continue;
      if (k === 'roleIds') {
        let roles = user.roles;
        if (value && value instanceof Array && value.length > 0) {
          roles = await this.roleService.getRolesByIds(value);
        }
        user.roles = roles;
        continue;
      }

      user[k] = value;
    }

    return await this.model.update(param.id, user);
  }

  async delete(ids: number[]) {
    return await this.model.delete(ids);
  }

  async findOne(
    attrs: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
    clearPassword = true,
  ) {
    const user = await this.model.findOne({
      where: attrs,
    });
    if (clearPassword) {
      user.password = '';
    }
    return user;
  }

  async findMany(attrs?: FindManyOptions<UserEntity>, clearPassword = true) {
    const users = await this.model.find({ ...attrs, relations: ['roles'] });
    const count = await this.model.count({ ...attrs, relations: ['roles'] });
    if (clearPassword) {
      users.forEach((user) => {
        user.password = '';
      });
    }
    return { list: users, count };
  }

  async clear() {
    if (process.env.NODE_ENV === 'test') {
      return this.model.clear();
    }
  }
}
