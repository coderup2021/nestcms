import { Article as ArticleEntity } from './article.entity';
import { Cate as CateEntity } from 'src/modules/cate/cate.entity';
import { IArticle } from 'src/interface';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly model: Repository<ArticleEntity>,
    @InjectRepository(CateEntity)
    private readonly cateModel: Repository<CateEntity>,
  ) {}

  // save
  async create(param: IArticle) {
    const { picture, content, title, description, editorType, cateId } = param;
    const article = new ArticleEntity();
    article.content = content;
    article.title = title;
    article.description = description;
    article.editorType = editorType;
    article.picture = picture;

    const cate = await this.cateModel.findOne({ where: { id: cateId } });
    if (!cate) {
      throw new HttpException('cateNotExsit', 400);
    }
    article.cate = cate;

    const { id } = await this.model.save(article);
    return { id };
  }

  async update(param: IArticle) {
    const article = await this.model.findOne({
      where: { id: param.id },
      relations: ['cate'],
    });
    Object.keys(param).forEach((k) => {
      if (k !== 'cateId') article[k] = param[k];
    });
    if (article.cate.id !== param.cateId) {
      const cate = await this.cateModel.findOne({
        where: { id: param.cateId },
      });

      if (!cate) {
        throw new HttpException('cateNotExsit', 400);
      }
      article.cate = cate;
    }
    return await this.model.update(param.id, article);
  }

  async delete(ids: number[]) {
    return await this.model.delete(ids);
  }

  async findOne(
    attrs: FindOptionsWhere<ArticleEntity> | FindOptionsWhere<ArticleEntity>[],
  ) {
    return await this.model.findOne({
      where: attrs,
      relations: ['cate'],
    });
  }

  async findMany(attrs: FindManyOptions<ArticleEntity>) {
    const count = await this.model.count({ ...attrs, relations: ['cate'] });
    const list = await this.model.find({ ...attrs, relations: ['cate'] });
    return { list, count };
  }
}
