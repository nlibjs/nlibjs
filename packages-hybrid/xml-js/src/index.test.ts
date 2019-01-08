import test from 'ava';
import * as _xmljs from 'xml-js';
import * as xmljs from './index';

test('should be a superset of xml-js', (t) => {
    for (const key of Object.keys(_xmljs)) {
        t.is((xmljs as any)[key], (_xmljs as any)[key], `${key} is not equal`);
    }
});
