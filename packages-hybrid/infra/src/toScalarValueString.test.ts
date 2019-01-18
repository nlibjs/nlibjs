import test from 'ava';
import {toScalaValueString} from './toScalarValueString';
import * as index from './index';

test('index.toScalaValueString', (t) => {
    t.is(index.toScalaValueString, toScalaValueString);
});

test('toScalaValueString("AbC")', (t) => {
    t.deepEqual(
        toScalaValueString('AbC'),
        [0x41, 0x62, 0x43],
    );
});

test('toScalaValueString(toScalaValueString("AbC"))', (t) => {
    t.deepEqual(
        toScalaValueString(toScalaValueString('AbC')),
        [0x41, 0x62, 0x43],
    );
});
