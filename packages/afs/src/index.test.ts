import test from 'ava';

test('my passing test', (t) => {
    t.pass();
});

test('my passing async test', async (t) => {
    await 0;
    await new Promise((resolve) => {
        setTimeout(resolve, 100);
    });
    t.pass();
});
