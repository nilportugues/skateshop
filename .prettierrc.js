const fs = require('fs');

const featureDirs = fs
    .readdirSync(__dirname + '/src/features', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dir) => {
        return '^@/features/' + dir.name + '/(.*)$';
    });

module.exports = {
    printWidth: 80,
    tabWidth: 4,
    trailingComma: 'all',
    singleQuote: true,
    semi: true,
    plugins: [
        require.resolve('@trivago/prettier-plugin-sort-imports'),
        require.resolve('prettier-plugin-tailwindcss'),
        require.resolve('prettier-plugin-packagejson'),
        require.resolve('prettier-plugin-organize-attributes'),
    ],
    importOrder: [...featureDirs, '^@/lib/(.*)$', '^@/(.*)$', '^[./]'],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderCaseInsensitive: true,
    attributeGroups: ['$DEFAULT', '^data-'],
    attributeSort: 'ASC',
};
