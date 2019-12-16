#!/usr/bin/env ts-node
import {indexen} from '../src/indexen';
import {parseIndexenCLIArgs} from '../src/parseIndexenCLIArgs';

indexen(parseIndexenCLIArgs(process.argv.slice(2)))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
