// https://infra.spec.whatwg.org/#bytes
import {inin, fromIntervalZ} from '@nlib/real-number';

export const Byte = fromIntervalZ(inin(0x00, 0xFF));
export const isByte = (x: number): boolean => Byte.has(x);

export const ASCIIByte = fromIntervalZ(inin(0x00, 0x7F));
export const isASCIIByte = (x: number): boolean => ASCIIByte.has(x);
