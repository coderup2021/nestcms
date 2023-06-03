import { Controller, Get, Res } from '@nestjs/common';

import { Response } from 'express';
import * as ejs from 'ejs';
import { ArticleService } from '../../article/article.service';

@Controller('/')
export class HomeController {
  constructor(readonly articleService: ArticleService) {}

  @Get()
  async index(@Res() res: Response) {
    const { list: articleList } = await this.articleService.findMany({});
    console.log('articleList', articleList);
    res.render('index', { articleList });
  }
}
