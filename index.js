const tools = require('./lib');
const config = require('./config.json');
const request = require('request-promise');
const { transactionSchema, transferAssetSchema } = require('./schema');
const { validator, transactions, cryptography } = require('@liskhq/lisk-client');
const testkey= require('./secret/keys.json');
const { publicKey, address } = cryptography.getAddressAndPublicKeyFromPassphrase(testkey.passphrase1);
tools.getClient().then(async client => {
	  const account = await client.account.get(address);
	  let nonce = Number(account.sequence.nonce);
	  console.log(account);
});
