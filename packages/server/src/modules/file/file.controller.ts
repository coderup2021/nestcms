import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/api/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (body.storage && body.storage !== 'self') {
      throw new HttpException('unknow storage type', 400);
    }
    const res = await this.fileService.storage([
      { storage: body.storage, fieldname: body.name, file },
    ]);
    return { status: 0, payload: res };
  }
}
