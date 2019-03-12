// https://infra.spec.whatwg.org/#byte-sequences
import {isASCIIUpperAlpha, isASCIILowerAlpha} from './4.5.CodePoints';
import {fromIterable} from './4.6.Strings';

export const toLowerCaseBytes = (byteSequence: Uint8Array): Uint8Array => {
    const result = byteSequence.slice();
    const {length} = result;
    for (let i = 0; i < length; i++) {
        const byte = result[i];
        if (isASCIIUpperAlpha(byte)) {
            result[i] = byte + 0x20;
        }
    }
    return result;
};

export const toUpperCaseBytes = (byteSequence: Uint8Array): Uint8Array => {
    const result = byteSequence.slice();
    const {length} = result;
    for (let i = 0; i < length; i++) {
        const byte = result[i];
        if (isASCIILowerAlpha(byte)) {
            result[i] = byte - 0x20;
        }
    }
    return result;
};

export const caseInsensitiveMatchBytes = (byteSequence1: Uint8Array, byteSequence2: Uint8Array): boolean => {
    const {length} = byteSequence1;
    if (length !== byteSequence2.length) {
        return false;
    }
    const caseInsensitiveByteSequence1 = toLowerCaseBytes(byteSequence1);
    const caseInsensitiveByteSequence2 = toLowerCaseBytes(byteSequence2);
    for (let i = 0; i < length; i++) {
        if (caseInsensitiveByteSequence1[i] !== caseInsensitiveByteSequence2[i]) {
            return false;
        }
    }
    return true;
};

export const isomorphicDecode = (byteSequence: Uint8Array): Uint32Array => fromIterable(byteSequence);
