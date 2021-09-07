const config = require('./config.json');
const request = require('request-promise');
const { validator, transactions, cryptography } = require('@liskhq/lisk-client');
const { getClient, lskAsBeddows } = require('./libs/helpers');
const { transactionSchema, transferAssetSchema } = require('./libs/schemas');
const testkey= require('./secret/keys.json');
const { publicKey, address } = cryptography.getAddressAndPublicKeyFromPassphrase(testkey.passphrase1);
