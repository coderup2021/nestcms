import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as randomString from 'randomstring';
import * as fse from 'fs-extra';
import { File as FileEntity } from './file.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IFile, IStoragePath } from 'src/interface';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

export interface FileObj {
  storage: 'self';
  fieldname: string; // 表单 field 名
  file: Express.Multer.File;
  //Express.Multer.File;
  // fieldname: 'file',
  // originalname: '666666666666.png',
  // encoding: '7bit',
  // mimetype: 'image/png',
  // buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 09 c3 00 00 04 2f 08 02 00 00 00 5e 99 f3 92 00 00 00 01 73 52 47 42 00 ae ce 1c e9 00 00 00 04 ... 81259 more bytes>,
  // size: 81309
}

@Injectable()
export class FileService {
  exists: (
    attrs: FindOptionsWhere<FileEntity> | FindOptionsWhere<FileEntity>[],
  ) => Promise<FileEntity> | null;

  constructor(
    @InjectRepository(FileEntity)
    private readonly model: Repository<FileEntity>,
    private configService: ConfigService,
  ) {
    this.exists = this.findOne;
  }

  // save
  async create(param: IFile) {
    const { name, storage, alt, url } = param;
    const file = new FileEntity();
    file.name = name;
    file.storage = storage;
    file.alt = alt;
    file.url = url;
    const res = await this.model.save(file);
    return res;
  }

  async update(param: IFile) {
    const file = await this.model.findOne({
      where: { id: param.id },
    });
    Object.keys(param).forEach((k) => {
      file[k] = param[k];
    });
    return await this.model.save(file);
  }

  async delete(ids: number[]) {
    return await this.model.delete(ids);
  }

  async findOne(
    attrs: FindOptionsWhere<FileEntity> | FindOptionsWhere<FileEntity>[],
  ) {
    return await this.model.findOne({
      where: attrs,
    });
  }

  async findMany(attrs?: FindManyOptions<FileEntity>) {
    const count = await this.model.count(attrs || undefined);
    const list = await this.model.find(attrs || undefined);
    return { list, count };
  }

  async clear() {
    if (process.env.NODE_ENV === 'test') {
      return this.model.clear();
    }
  }

  _addRandomToFilename(filename: string) {
    const arr = filename.split('.');
    const r = randomString.generate({ length: 6, charset: 'numeric' });
    const t = dayjs().format('YYYYMMDDHHmmss');
    let tail = '';
    if (arr[1]) {
      tail = `.${arr[1]}`;
    }
    return `${arr[0]}@${t}_${r}${tail}`;
  }

  _getDistFilenameObj(files: FileObj[]): IStoragePath[] {
    const arr: IStoragePath[] = [];
    const storagePath = this.configService.get('upload.storage.self.path');
    files.forEach((file) => {
      console.log('file', file);
      const filename = `${this._addRandomToFilename(file.file.originalname)}`;
      const relativePath = `${filename}`;
      const obj: IStoragePath = {
        filename,
        relativePath,
        absolutePath: `${storagePath}/${relativePath}`,
      };
      arr.push(obj);
    });
    console.log('arr', arr);
    return arr;
  }

  async storage(files: FileObj[]) {
    /**
     * FileObj
     */
    const ret: IFile[] = [];
    const storagePath = this.configService.get('upload.storage.self.path');
    const dateDir = dayjs().format('YYYYMMDD');
    const appDir = path.resolve(__dirname, '../../');
    console.log('appDir', appDir);
    const targetDir = `${storagePath}/${dateDir}`;
    fse.ensureDirSync(targetDir);
    const distFileArr = this._getDistFilenameObj(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fse.writeFileSync(
        `${targetDir}/${distFileArr[i].relativePath}`,
        file.file.buffer,
        {},
      );
      const fileObj: IFile = {
        name: file.fieldname,
        url: `${dateDir}/${distFileArr[i].relativePath}`,
        storage: file.storage,
      };
      const { id, url, alt, storage, name } = await this.create(fileObj);
      //   const prefix = this.configService.get('staticFile.dirs.uploads.prefix');
      //   console.log('prefix', prefix);
      const targetUrl = `static/${url}`;
      console.log('targetUrl', targetUrl);

      ret.push({ id, url: targetUrl, alt, storage, name });
    }
    return ret;
  }
}
