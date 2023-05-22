import { User } from 'src/modules/user/user.entity';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as bcrypt from 'bcrypt';

export default class CreateUser implements Seeder {
  async existUserName(userName: string, connection: Connection) {
    return await connection
      .createQueryBuilder()
      .select('admin')
      .from(User, 'admin')
      .where('admin.userName = :name', { name: userName })
      .getOne();
  }

  public async run(factory: Factory, connection: Connection): Promise<any> {
    if (!(await this.existUserName('admin', connection)))
      await factory(User)().createMany(1);

    if (!(await this.existUserName('jason', connection))) {
      const salt = bcrypt.genSaltSync();
      /**
       * only use factory to generat data can trigger setPassword@beforeInsert hooks
       * here we need hash password manually
       */
      const password = bcrypt.hashSync('123456', salt);

      await connection
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            name: `jason`,
            password,
            userName: 'jason',
            email: 'yyy@qq.com',
            avator: '',
            phoneNum: '18030831235',
            salt,
            countryCode: '',
            comments: '',
            enable: true,
            groupId: 0,
            editorId: 1,
            roles: [],
          },
        ])
        .execute();
    }
  }
}
