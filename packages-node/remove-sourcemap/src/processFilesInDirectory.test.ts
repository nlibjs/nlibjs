import * as path from 'path';
import anyTest, {TestInterface} from 'ava';
import * as afs from '@nlib/afs';
import {processFilesInDirectory} from './processFilesInDirectory';
import {IProcessorList} from './types';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await afs.mktempdir();
});

const noop = () => {
    // noop
};

interface IResultMap {
    [key: string]: string | null,
}

interface ITest {
    files: afs.DeployData,
    processors: IProcessorList,
    expected: IResultMap,
}

([
    {
        files: {
            'aaa.css': '',
            'aaa.js': '',
            'aaa.test.js': '',
            'foo': {
                'bbb.css': '',
                'bbb.js': '',
                'bbb.test.js': '',
                'bar': {
                    'ccc.css': '',
                    'ccc.js': '',
                    'ccc.test.js': '',
                },
            },
        },
        processors: [
            {name: 'testjs', pattern: ['.test.js'], process: noop},
            {name: 'js', pattern: ['.js'], process: noop},
            {name: 'css', pattern: ['.css'], process: noop},
        ],
        expected: {
            'aaa.css': 'css',
            'aaa.js': 'js',
            'aaa.test.js': 'testjs',
            'foo/bbb.css': 'css',
            'foo/bbb.js': 'js',
            'foo/bbb.test.js': 'testjs',
            'foo/bar/ccc.css': 'css',
            'foo/bar/ccc.js': 'js',
            'foo/bar/ccc.test.js': 'testjs',
        },
    },
] as Array<ITest>).forEach(({files, processors, expected}, index) => {
    test(`#${index}`, async (t) => {
        await afs.deploy(t.context.directory, files);
        t.deepEqual(
            await processFilesInDirectory(t.context.directory, processors),
            Object.entries(expected)
            .reduce<IResultMap>((map, [key, value]) => {
                map[path.join(t.context.directory, key)] = value;
                return map;
            }, {}),
        );
    });
});
