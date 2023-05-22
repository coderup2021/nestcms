import config from './config';
import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import * as childProcess from 'child_process';
dotenv.config();

const database = process.env.DB;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);

const creatDB = async () => {
  const createDBSql = `mysql -u${user} -p${password} -e create database if not exists ${database} default character set utf8mb4 collate utf8mb4_unicode_ci;`;
  console.log('createDBSql', createDBSql);
  childProcess.execSync(createDBSql);
};

const initUsers = async () => {
  const connection = await createConnection({
    database,
    user,
    password,
    host,
    port,
    dateStrings: false,
  });

  const userExist = async (userName: string) => {
    const [res] = await connection.query(
      'select * from user where username=?',
      [userName],
    );
    return (res as []).length > 0;
  };

  if (!(await userExist('admin'))) {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt);
    //prettier-ignore
    const [res] = await connection.query(
      `INSERT INTO USER (name, password, userName, email, avator, phoneNum, salt, countryCode, comments, enable, groupId, editorId) 
                VALUES ('jason', '${password}', 'admin', '', '', '18030876543', '${salt}', '+86', '超级管理员', 1, 0, 1)`,
    );
    console.log('res', (res as any).insertId);
  }

  connection.end();
  connection.destroy();
};

const initDB = async () => {
  await initUsers();
};

(async () => {
  //   creatDB();
  initDB();
})();
