// https://infra.spec.whatwg.org/#bytes
import {Brand} from '@nlib/global';
import {inin, intersectionZ} from '@nlib/real-number';
export const Bytes = intersectionZ(inin(0, 255));
export type Byte = Brand<number, 'Byts'>;
export const isByte = (x: number): boolean => Bytes.has(x);
