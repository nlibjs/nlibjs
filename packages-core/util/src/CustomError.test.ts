import test from 'ava';
import {JSON} from '@nlib/global';
import {CustomError, ICustomErrorParameters, isCustomError} from './CustomError';

([
    {
        code: 123,
        message: 'foo',
        data: 'bar',
    },
] as Array<ICustomErrorParameters>).forEach((parameters) => {
    test(`new CustomError(${JSON.stringify(parameters)})`, (t) => {
        const error = new CustomError(parameters);
        t.true(isCustomError(error));
        t.is(error.code, parameters.code);
        t.is(error.message, parameters.message);
        t.deepEqual(error.data, parameters.data);
    });
});
