import * as stream from 'stream';
import {StringDecoder} from 'string_decoder';
import {getCodePoints} from '@nlib/infra';

export class CodePointStream extends stream.Transform {

    private readonly decoder: StringDecoder;

    public constructor(encoding = 'utf8') {
        super({objectMode: true});
        this.decoder = new StringDecoder(encoding);
    }

    public _transform(buffer: Buffer, _: string, callback: () => void): void {
        this._parse(this.decoder.write(buffer));
        callback();
    }

    public _flush(callback: () => void): void {
        this._parse(this.decoder.end());
        callback();
    }

    private _parse(string: string): void {
        for (const codePoint of getCodePoints(string)) {
            this.push(codePoint);
        }
    }

}
