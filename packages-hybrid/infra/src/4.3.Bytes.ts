// https://infra.spec.whatwg.org/#bytes
import {SetZ, hasSetZ} from '@nlib/real-number';

export const Byte: SetZ = [[0x00, 0xFF]];
export const isByte = (x: number): boolean => hasSetZ(Byte, x);

export const ASCIIByte: SetZ = [[0x00, 0x7F]];
export const isASCIIByte = (x: number): boolean => hasSetZ(ASCIIByte, x);
