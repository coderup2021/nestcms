#!/usr/bin/env node

const cp = require('child_process')
console.log('process.env.EXPORT_PATH', process.env.EXPORT_PATH)

cp.execSync(`pnpm --filter @cms/web export -o ${process.env.EXPORT_PATH}`, {
  stdio: 'pipe',
})
