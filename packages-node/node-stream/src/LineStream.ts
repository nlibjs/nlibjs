import {Transform} from 'stream';
import {NodeStringDecoder, StringDecoder} from 'string_decoder';
import {getCodePoints, ScalarValueString, CodePoint} from '@nlib/infra';
const LF = 0x000A as CodePoint;
const CR = 0x000D as CodePoint;

export class LineStream extends Transform {

    private decoder: NodeStringDecoder

    private buffer: Uint32Array

    private lineLength: number

    private previousCodePoint: CodePoint

    public constructor(encoding: string = 'utf8') {
        super({objectMode: true});
        this.decoder = new StringDecoder(encoding);
        this.buffer = new Uint32Array(0x100);
        this.lineLength = 0;
        this.previousCodePoint = 0 as CodePoint;
    }

    public _transform(chunk: Buffer, _: string, callback: () => void): void {
        this._parse(this.decoder.write(chunk));
        callback();
    }

    public _flush(callback: () => void): void {
        this._parse(this.decoder.end());
        if (0 < this.lineLength) {
            this.push(new ScalarValueString(this.buffer.slice(0, this.lineLength)));
        }
        callback();
    }

    private _parse(string: string): void {
        for (const codePoint of getCodePoints(string)) {
            const currentBuffer = this.buffer;
            if (codePoint === LF && this.previousCodePoint === CR) {
                // do nothing
            } else if (codePoint === LF || codePoint === CR) {
                this.push(new ScalarValueString(currentBuffer.slice(0, this.lineLength)));
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
