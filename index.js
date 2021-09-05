const tools = require('./lib');
const { validator, transactions, cryptography } = require('@liskhq/lisk-client');
const testkey= require('./secret/keys.json');
const { publicKey, address } = cryptography.getAddressAndPublicKeyFromPassphrase(testkey.passphrase1);
console.log(address);