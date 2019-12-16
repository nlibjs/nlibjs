import test from 'ava';
import {JSON} from '@nlib/global';
import {NlibError, INlibErrorParameters, isNlibError} from './NlibError';

([
    {
        code: 123,
        message: 'foo',
        data: 'bar',
    },
] as Array<INlibErrorParameters<string>>).forEach((parameters) => {
    test(`new NlibError(${JSON.stringify(parameters)})`, (t) => {
        const error = new NlibError(parameters);
        t.true(isNlibError(error));
        t.is(error.code, parameters.code);
        t.is(error.message, parameters.message);
        t.deepEqual(error.data, parameters.data);
    });
});
