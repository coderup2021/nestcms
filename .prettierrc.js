module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
  bracketSpacing: true,
  endOfLine: 'lf',
  overrides: [
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
}
