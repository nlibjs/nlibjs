import {tmpdir} from 'os';
import {join} from 'path';
import anyTest, {TestInterface} from 'ava';
import {
    mkdtemp,
    readFile,
    rmrf,
    deploy,
    stat,
} from '.';

const test = anyTest as TestInterface<{
    directory: string
}>;

test.beforeEach(async (t) => {
    t.context.directory = await mkdtemp(tmpdir());
});

test.afterEach(async (t) => {
    await rmrf(t.context.directory);
});

test('deploy files', async (t) => {
    const {context: {directory}} = t;
    await deploy(directory, {
        foo: {
            bar: 'bar',
            baz: {
                hoo: 'hoo',
            },
        },
    });
    t.true((await stat(join(directory, 'foo'))).isDirectory());
    t.true((await stat(join(directory, 'foo', 'bar'))).isFile());
    t.is(await readFile(join(directory, 'foo', 'bar'), 'utf8'), 'bar');
    t.true((await stat(join(directory, 'foo', 'baz'))).isDirectory());
    t.true((await stat(join(directory, 'foo', 'baz', 'hoo'))).isFile());
    t.is(await readFile(join(directory, 'foo', 'baz', 'hoo'), 'utf8'), 'hoo');
});
