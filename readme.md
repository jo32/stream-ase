# Stream-AES

Totally based on [asmCrypto](https://github.com/vibornoff/asmcrypto.js/)

# Usage

    var StreamAES = require('stream-aes');
    var fs = require('fs');

    // 256 bits key encoded as base64
    var key = "wxVgc7kuqR03n8aDtIZ4HnPHmeZO7ZNuRadGZm1Svf4=";
    // 128 bit iv encoded as base64
    var iv = "AAAAAAAAAAAAAAAAAAAAAA==";

    fs.createReadStream('./test.txt').pipe(StreamAES.toTransform(StreamAES.AES_CBC.createEncryptionInstance({
        key: new Buffer(key, 'base64'),
        iv: new Buffer(iv, 'base64')
    }))).pipe(fs.createWriteStream('./out2.hex'))

    fs.createReadStream('./out2.hex').pipe(StreamAES.toTransform(StreamAES.AES_CBC.createDecryptionInstance({
        key: new Buffer(key, 'base64'),
        iv: new Buffer(iv, 'base64')
    }))).pipe(fs.createWriteStream('./test2.txt'))