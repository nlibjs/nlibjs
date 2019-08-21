import {Transform} from 'stream';
import {StringDecoder} from 'string_decoder';
import {
    getCodePoints,
    LINE_FEED,
    CARRIAGE_RETURN,
} from '@nlib/infra';

export class LineStream extends Transform {

    private readonly decoder: StringDecoder;

    private buffer: Uint32Array;

    private lineLength: number;

    private previousCodePoint: number;

    public constructor(encoding = 'utf8') {
        super({objectMode: true});
        this.decoder = new StringDecoder(encoding);
        this.buffer = new Uint32Array(0x100);
        this.lineLength = 0;
        this.previousCodePoint = 0;
    }

    public _transform(chunk: Buffer, _: string, callback: () => void): void {
        this._parse(this.decoder.write(chunk));
        callback();
    }

    public _flush(callback: () => void): void {
        this._parse(this.decoder.end());
        if (0 < this.lineLength) {
            this.push(this.buffer.slice(0, this.lineLength));
        }
        callback();
    }

    private _parse(string: string): void {
        for (const codePoint of getCodePoints(string)) {
            const currentBuffer = this.buffer;
            if (codePoint === LINE_FEED && this.previousCodePoint === CARRIAGE_RETURN) {
                // do nothing
            } else if (codePoint === LINE_FEED || codePoint === CARRIAGE_RETURN) {
                this.push(currentBuffer.slice(0, this.lineLength));
                this.lineLength = 0;
            } else {
                currentBuffer[this.lineLength++] = codePoint;
                const currentBufferSize = currentBuffer.length;
                if (currentBufferSize < this.lineLength) {
                    const newBufferSize = currentBufferSize * 2;
                    const newBuffer = new Uint32Array(newBufferSize);
                    for (let i = 0; i < currentBufferSize; i++) {
                        newBuffer[i] = currentBuffer[i];
                    }
                    this.buffer = newBuffer;
                }
            }
            this.previousCodePoint = codePoint;
        }
    }

}
