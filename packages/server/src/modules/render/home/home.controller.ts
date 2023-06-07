import { Controller, Get, Res, Param } from '@nestjs/common';

import { Response } from 'express';
import * as ejs from 'ejs';
import { ArticleService } from '../../article/article.service';
import { Converter } from 'showdown';

@Controller('/')
export class HomeController {
  constructor(readonly articleService: ArticleService) {}

  @Get()
  async index(@Res() res: Response) {
    const { list: articleList } = await this.articleService.findMany({});
    console.log('articleList', articleList);
    res.render('index', { articleList });
  }

  @Get('article/:id')
    async articleDetail(@Param('id') id, @Res() res: Response) {
       const article = await this.articleService.findOne({ id });
       const converter = new Converter();
       converter.setFlavor('github');
       article.content = converter.makeHtml(article.content);
       res.render('article', {
	  article: article || {},
       });
    }

}
