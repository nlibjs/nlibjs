import test from 'ava';
import {fromString} from './4.6.Strings';
import {getNextLineHead} from './getNextLineHead';

test('getNextLineHead("AAA   CCC\\nBBB", 4)', (t) => {
    t.is(
        getNextLineHead(fromString('AAA   CCC\nBBB'), 4),
        10,
    );
});

test('getNextLineHead("AAA   CCC\\n\\rBBB", 4)', (t) => {
    t.is(
        getNextLineHead(fromString('AAA   CCC\n\rBBB'), 4),
        10,
    );
});

test('getNextLineHead("AAA   CCC\\r\\nBBB", 4)', (t) => {
    t.is(
        getNextLineHead(fromString('AAA   CCC\r\nBBB'), 4),
        11,
    );
});
