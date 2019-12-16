#!/usr/bin/env node
const {indexen} = require('../lib/indexen');
const {parseIndexenCLIArgs} = require('../lib/parseIndexenCLIArgs');

indexen(parseIndexenCLIArgs(process.argv.slice(2)))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
