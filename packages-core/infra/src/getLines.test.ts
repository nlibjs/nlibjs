import test from 'ava';
import {getLines, getTrimmedLines} from './getLines';
import {fromString} from './4.6.Strings';

test('getLines("\\r\\n A A \\r b b \\n\\n C C \\n\\r dd \\r \\n ee   ")', (t) => {
    t.deepEqual(
        [...getLines(fromString('\r\n A A \r b b \n\n C C \n\r d d \r \n E E  \n '))],
        [
            fromString(''),
            fromString(' A A '),
            fromString(' b b '),
            fromString(''),
            fromString(' C C '),
            fromString(''),
            fromString(' d d '),
            fromString(' '),
            fromString(' E E  '),
            fromString(' '),
        ],
    );
});

test('getTrimmedLines("\\r\\n A A \\r b b \\n\\n C C \\n\\r dd \\r \\n ee   ")', (t) => {
    t.deepEqual(
        [...getTrimmedLines(fromString('\r\n A A \r b b \n\n C C \n\r d d \r \n E E  \n '))],
        [
            fromString(''),
            fromString('A A'),
            fromString('b b'),
            fromString(''),
            fromString('C C'),
            fromString(''),
            fromString('d d'),
            fromString(''),
            fromString('E E'),
            fromString(''),
        ],
    );
});
