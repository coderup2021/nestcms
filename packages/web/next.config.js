/** @type {import('next').NextConfig} */
// import nextRemoveImports from 'next-remove-imports'

const removeImports = require('next-remove-imports')()

const nextConfig = removeImports({
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  rewrites : () => {
    return [
      {
        source: "/:api*",
        destination: "http://127.0.0.1:8001/:api*",
      },
    ];
  }

})

module.exports = nextConfig
