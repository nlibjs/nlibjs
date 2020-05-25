export interface ErrorWithCode<TCode = string> extends Error {
    code: TCode,
}

export const hasCode = (error: any): error is ErrorWithCode => typeof error === 'object'
&& typeof (error as {code: any}).code === 'string';

export const isENOENT = (error: any): error is ErrorWithCode<'ENOENT'> => hasCode(error)
&& error.code === 'ENOENT';

export const isEEXIST = (error: any): error is ErrorWithCode<'EEXIST'> => hasCode(error)
&& error.code === 'EEXIST';
