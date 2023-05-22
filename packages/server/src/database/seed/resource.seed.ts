import { Connection } from 'typeorm';
import { Resource } from 'src/modules/resource/resource.entity';
import { IResource } from 'src/interface';
import { Seeder } from 'typeorm-seeding';

export default class CreateResource implements Seeder {
  connection: Connection | null;

  async exist(resourceName: string) {
    return await this.connection
      .createQueryBuilder()
      .select('resource')
      .from(Resource, 'resource')
      .where('resource.name = :name', { name: resourceName })
      .getOne();
  }

  public async runModule(moduleName: string, langKey: string) {
    const {
      identifiers: [{ id: moduleId }],
    } = await this.connection
      .createQueryBuilder()
      .insert()
      .into(Resource)
      .values({
        name: moduleName,
        langKey,
        url: '',
        parentId: 0,
        path: '/0/',
        type: 1,
        order: 1,
        show: true,
      })
      .execute();
    return moduleId;
  }

  public async runPage({
    name,
    langKey,
    url,
    parentId,
    path,
    order,
    show = true,
  }: Partial<IResource>) {
    const {
      identifiers: [{ id }],
    } = await this.connection
      .createQueryBuilder()
      .insert()
      .into(Resource)
      .values({
        name,
        langKey,
        url,
        parentId,
        path,
        order,
        show,
        type: 1,
      })
      .execute();
    return id;
  }

  public async runOperation({
    name,
    langKey,
    url,
    parentId,
    path,
  }: Partial<IResource>) {
    const {
      identifiers: [{ id }],
    } = await this.connection
      .createQueryBuilder()
      .insert()
      .into(Resource)
      .values({
        name,
        langKey,
        url,
        parentId,
        path,
        order: 1,
        show: false,
        type: 2,
      })
      .execute();
    return id;
  }

  public async runArticle(parentId: number) {
    const articleId = await this.runPage({
      name: `文章管理`,
      langKey: `articleManage`,
      url: '/article',
      parentId: parentId,
      path: `/0/${parentId}/`,
      order: 1,
      show: true,
    });

    await this.runOperation({
      name: `文章列表`,
      langKey: 'articleList',
      url: '/article',
      method: 'GET',
      parentId: articleId,
      path: `/0/${parentId}/${articleId}/`,
    });
    await this.runOperation({
      name: `文章详情`,
      langKey: 'articleDetail',
      url: '/article/:id',
      method: 'GET',
      parentId: articleId,
      path: `/0/${parentId}/${articleId}/`,
    });
    await this.runOperation({
      name: `文章新增`,
      langKey: 'articleAdd',
      url: '/article',
      method: 'POST',
      parentId: articleId,
      path: `/0/${parentId}/${articleId}/`,
    });
    await this.runOperation({
      name: `文章修改`,
      langKey: 'articleEdit',
      url: '/article/:id',
      method: 'PUT',
      parentId: articleId,
      path: `/0/${parentId}/${articleId}/`,
    });
    await this.runOperation({
      name: `文章删除`,
      langKey: 'articleDel',
      url: '/article/:id',
      method: 'DELETE',
      parentId: articleId,
      path: `/0/${parentId}/${articleId}/`,
    });
  }

  public async runCate(parentId: number) {
    const cateId = await this.runPage({
      name: `分类管理`,
      langKey: `cateManage`,
      url: '/cate',
      parentId,
      path: `/0/${parentId}/`,
      order: 2,
    });

    await this.runOperation({
      name: `分类列表`,
      langKey: 'cateList',
      url: '/cate',
      method: 'GET',
      parentId: cateId,
      path: `/0/${parentId}/${cateId}/`,
    });
    await this.runOperation({
      name: `分类详情`,
      langKey: 'cateDetail',
      url: '/cate/:id',
      method: 'GET',
      parentId: cateId,
      path: `/0/${parentId}/${cateId}/`,
    });
    await this.runOperation({
      name: `分类新增`,
      langKey: 'cateAdd',
      url: '/cate',
      method: 'POST',
      parentId: cateId,
      path: `/0/${parentId}/${cateId}/`,
    });
    await this.runOperation({
      name: `分类修改`,
      langKey: 'cateEdit',
      url: '/cate/:id',
      method: 'PUT',
      parentId: cateId,
      path: `/0/${parentId}/${cateId}/`,
    });
    await this.runOperation({
      name: `分类删除`,
      langKey: 'cateDel',
      url: '/cate/:id',
      method: 'DELETE',
      parentId: cateId,
      path: `/0/${parentId}/${cateId}/`,
    });
  }

  public async runUser(parentId: number) {
    const userManageId = await this.runPage({
      name: `用户管理`,
      langKey: `userManage`,
      url: '/user',
      parentId,
      path: `/0/${parentId}/`,
      order: 3,
    });

    await this.runOperation({
      name: `用户列表`,
      langKey: 'userList',
      url: '/user',
      method: 'GET',
      parentId: userManageId,
      path: `/0/${parentId}/${userManageId}/`,
    });
    await this.runOperation({
      name: `用户详情`,
      langKey: 'userDetail',
      url: '/user/:id',
      method: 'GET',
      parentId: userManageId,
      path: `/0/${parentId}/${userManageId}/`,
    });
    await this.runOperation({
      name: `用户新增`,
      langKey: 'userAdd',
      url: '/user',
      method: 'POST',
      parentId: userManageId,
      path: `/0/${parentId}/${userManageId}/`,
    });
    await this.runOperation({
      name: `用户修改`,
      langKey: 'userEdit',
      url: '/user/:id',
      method: 'PUT',
      parentId: userManageId,
      path: `/0/${parentId}/${userManageId}/`,
    });
    await this.runOperation({
      name: `用户删除`,
      langKey: 'userDel',
      url: '/user/:id',
      method: 'DELETE',
      parentId: userManageId,
      path: `/0/${parentId}/${userManageId}/`,
    });
  }

  public async runRole(parentId: number) {
    const roleManageId = await this.runPage({
      name: `角色管理`,
      langKey: `roleManage`,
      url: '/role',
      parentId,
      path: `/0/${parentId}/`,
      order: 3,
    });

    await this.runOperation({
      name: `角色列表`,
      langKey: 'roleList',
      url: '/role',
      method: 'GET',
      parentId: roleManageId,
      path: `/0/${parentId}/${roleManageId}/`,
    });
    await this.runOperation({
      name: `角色详情`,
      langKey: 'roleDetail',
      url: '/role/:id',
      method: 'GET',
      parentId: roleManageId,
      path: `/0/${parentId}/${roleManageId}/`,
    });
    await this.runOperation({
      name: `角色新增`,
      langKey: 'roleAdd',
      url: '/role',
      method: 'POST',
      parentId: roleManageId,
      path: `/0/${parentId}/${roleManageId}/`,
    });
    await this.runOperation({
      name: `角色修改`,
      langKey: 'roleEdit',
      url: '/role/:id',
      method: 'PUT',
      parentId: roleManageId,
      path: `/0/${parentId}/${roleManageId}/`,
    });
    await this.runOperation({
      name: `角色删除`,
      langKey: 'roleDel',
      url: '/role/:id',
      method: 'DELETE',
      parentId: roleManageId,
      path: `/0/${parentId}/${roleManageId}/`,
    });
  }

  public async run(factory: any, connection: Connection): Promise<any> {
    this.connection = connection;

    if (!(await this.exist('文章模块'))) {
      const articleModuleId = await this.runModule('文章模块', 'articleModule');
      await this.runArticle(articleModuleId);
      await this.runCate(articleModuleId);
    }

    if (!(await this.exist('用户模块'))) {
      const userModuleId = await this.runModule('用户模块', 'userModule');
      await this.runUser(userModuleId);
      await this.runRole(userModuleId);
    }
  }
}
