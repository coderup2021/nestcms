import * as path from 'path';

export default () => {
  console.log('app');
  return {
    upload: {
      // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
      mode: 'file',
      // fileSize: string, 最大上传文件大小，默认为 10mb
      fileSize: '10mb',
      // whitelist: string[]，文件扩展名白名单
      // whitelist: uploadWhiteList.filter((ext) => ext !== '.pdf'),
      // tmpdir: string，上传的文件临时存储路径
      // tmpdir: path.join(tmpdir(), 'midway-upload-files'),
      // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
      cleanTimeout: 5 * 60 * 1000,
      // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
      base64: false,
      storage: {
        self: {
          path: `/uploads`,
        },
      },
    },
    staticFile: {
      dirs: {
        default: {
          prefix: '/assets',
          dir: path.join(__dirname, './view/assets'),
        },
        uploads: {
          prefix: '/static',
          dir: path.join(__dirname, './uploads'),
        },
      },
    },
  };
};