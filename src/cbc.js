/**
 * Cipher Block Chaining Mode (CBC)
 */

var AESModule = require('./aes');
var AES = AESModule.AES;
var AES_asm = require('./aes_asm');

function AES_CBC ( options ) {
    this.padding = true;
    this.iv = null;

    AES.call( this, options );

    this.mode = 'CBC';
}

var AES_CBC_prototype = AES_CBC.prototype;
AES_CBC_prototype.BLOCK_SIZE = 16;
AES_CBC_prototype.reset = AESModule.AES_reset;
AES_CBC_prototype.encrypt = AESModule.AES_Encrypt_finish;
AES_CBC_prototype.decrypt = AESModule.AES_Decrypt_finish;

function AES_CBC_Encrypt ( options ) {
    AES_CBC.call( this, options );
}

var AES_CBC_Encrypt_prototype = AES_CBC_Encrypt.prototype;
AES_CBC_Encrypt_prototype.BLOCK_SIZE = 16;
AES_CBC_Encrypt_prototype.reset = AESModule.AES_reset;
AES_CBC_Encrypt_prototype.process = AESModule.AES_Encrypt_process;
AES_CBC_Encrypt_prototype.finish = AESModule.AES_Encrypt_finish;

function AES_CBC_Decrypt ( options ) {
    AES_CBC.call( this, options );
}

var AES_CBC_Decrypt_prototype = AES_CBC_Decrypt.prototype;
AES_CBC_Decrypt_prototype.BLOCK_SIZE = 16;
AES_CBC_Decrypt_prototype.reset = AESModule.AES_reset;
AES_CBC_Decrypt_prototype.process = AESModule.AES_Decrypt_process;
AES_CBC_Decrypt_prototype.finish = AESModule.AES_Decrypt_finish;

function createEncryptionInstance(options) {
    if ( options.key === undefined ) throw new SyntaxError("key required");
    if ( options.chunkSize === undefined ) {
        options.chunkSize = 0x5000 + chunkSize;
    } 
    var _AES_heap_instance = new Buffer(options.chunkSize);
    var _AES_asm_instance  = AES_asm( global, null, _AES_heap_instance.buffer );
    return new AES_CBC_Encrypt( { heap: _AES_heap_instance, asm: _AES_asm_instance, key: options.key, padding: options.padding, iv: options.iv } );
}

function createDecryptionInstance(options) {
    if ( options.key === undefined ) throw new SyntaxError("key required");
    if ( options.chunkSize === undefined ) {
        options.chunkSize = 0x5000 + chunkSize;
    } 
    var _AES_heap_instance = new Buffer(options.chunkSize);
    var _AES_asm_instance  = AES_asm( global, null, _AES_heap_instance.buffer );
    return new AES_CBC_Decrypt( { heap: _AES_heap_instance, asm: _AES_asm_instance, key: options.key, padding: options.padding, iv: options.iv } ); 
}

module.exports = {
    createEncryptionInstance: createEncryptionInstance,
    createDecryptionInstance: createDecryptionInstance
}