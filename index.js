var stream = require('stream');
var Transform = stream.Transform;
var AES_CBC = require('./src/cbc');

var SUPPORTED_CHUNK_TYPE = [Uint8Array, ArrayBuffer, Buffer];

function toArrayBuffer(buffer) {
    "use asm";

    var ab = new ArrayBuffer(buffer.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}

function toBuffer(ab) {
    "use asm";

    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}

function toTransform(instance) {

    function __Transform() {
        if(!(this instanceof __Transform)) {
            return new __Transform();
        }
        Transform.call(this, {});
    }

    __Transform.prototype = new Transform();

    __Transform.prototype._transform = function(chunk, encoding, cb) {
        var buffer;
        try {
            buffer = instance.process(chunk).result;
        } catch (err) {
            this.emit('error', err);
            return;
        }
        if (buffer instanceof Buffer) {
            this.push(buffer);
        } else if (buffer instanceof Uint8Array) {
            this.push(toBuffer(buffer.buffer));
        } else if (buffer instanceof ArrayBuffer) {
            this.push(toBuffer(buffer));
        } else {
            this.emit('error', new Error('buffer is not instanceof Buffer'));
            return;
        }
        cb();
    }

    __Transform.prototype._flush = function(cb) {
        var buffer;
        try {
            buffer = instance.finish().result;
        } catch (err) {
            this.emit('error', err);
            return;
        }
        if (buffer instanceof Buffer) {
            this.push(buffer);
        } else if (buffer instanceof Uint8Array) {
            this.push(toBuffer(buffer.buffer));
        } else if (buffer instanceof ArrayBuffer) {
            this.push(toBuffer(buffer));
        } else {
            this.emit('error', new Error('buffer is not instanceof Buffer'));
            return;
        }
        cb();
    }

    return new __Transform();
}

module.exports = {
    toTransform: toTransform,
    toBuffer: toBuffer,
    toArrayBuffer: toArrayBuffer,
    AES_CBC: AES_CBC
}