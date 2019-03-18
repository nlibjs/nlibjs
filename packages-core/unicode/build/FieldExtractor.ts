import {Transform} from 'stream';
import {
    collectCodePointSequence,
    splitOn,
} from '@nlib/infra';
const SEMICOLON = 0x3B;
const NUMBER_SIGN = 0x23;

export class FieldExtractor extends Transform {

    public constructor() {
        super({objectMode: true});
    }

    public _transform(line: Uint32Array, _: string, callback: () => void): void {
        const lineWithoutComment = collectCodePointSequence(line, 0, (codePoint) => codePoint !== NUMBER_SIGN);
        if (0 < lineWithoutComment.length) {
            this.push([...splitOn(lineWithoutComment, (codePoint) => codePoint === SEMICOLON)]);
        }
        callback();
    }

}
