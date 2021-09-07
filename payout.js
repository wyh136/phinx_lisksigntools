const config = require('./config.json');
const request = require('request-promise');
const { validator, transactions, cryptography } = require('@liskhq/lisk-client');
const { getClient, lskAsBeddows } = require('./libs/helpers');
const { transactionSchema, transferAssetSchema } = require('./libs/schema');
const testkey= require('./secret/keys.json');
const { publicKey, address } = cryptography.getAddressAndPublicKeyFromPassphrase(testkey.passphrase1);
const network = config.blockchainApp.network;

function createTX(data){
	var network = config.blockchainApp.network;

	//Asset data
	var transferAsset = {
		amount: BigInt(data.amount),
		recipientAddress: Buffer.from(data.recipientAddress,'hex'),
		data: data.message
	};

	//TX data
	var unsignedTransaction = {
		moduleID: Number(2),
		assetID: Number(0),
		fee: BigInt(10000000),
		nonce: BigInt(data.nonce),
		senderPublicKey: Buffer.from(data.senderPublicKey,'hex'),
		asset: Buffer.alloc(0),
		signatures: [],
	};

	//Add asset to TX
	unsignedTransaction.asset = transferAsset;

	//Set TX fee
	var option = { numberOfSignatures: 1 };
	if(testkey.passphrase2){
		option = { numberOfSignatures: 2 };
	}
	unsignedTransaction.fee = transactions.computeMinFee(transferAssetSchema, unsignedTransaction, option);

	//Sign TX
	var signedTransaction = {};
	signedTransaction = transactions.signTransaction(
		transferAssetSchema,
		unsignedTransaction,
		Buffer.from(network.exist[network.active].networkID, 'hex'),
		testkey.passphrase1
	);

	if(testkey.passphrase2){
		var keys = {
			mandatoryKeys: [Buffer.from(cryptography.getAddressAndPublicKeyFromPassphrase(testkey.passphrase1).publicKey,'hex'), Buffer.from(cryptography.getAddressAndPublicKeyFromPassphrase(testkey.passphrase2).publicKey,'hex')],
		  	optionalKeys: [],
		  	numberOfSignatures: 2
		}
		signedTransaction = transactions.signMultiSignatureTransaction(
		  	transferAssetSchema,
		  	signedTransaction,
		  	Buffer.from(network.exist[network.active].networkID, 'hex'),
		  	testkey.passphrase2,
		  	keys
		);
	}

	return signedTransaction;
}

function payout(toAddress,_amount,callback)
{
    getClient().then(async client => 
        {
            const account = await client.account.get(address);
            let nonce = Number(account.sequence.nonce);
            const recipientAddress = cryptography.getAddressFromBase32Address(toAddress, 'lsk');
	  				const jsonTX = createTX({
						"amount": _amount,
						"recipientAddress": recipientAddress,
						"senderPublicKey": publicKey,
						"passphrase1": testkey.passphrase1,
						"message": "just a test",
						"nonce": nonce
					});

	  				//Send TX to node
	  				const sendTX = await client.transaction.send(jsonTX);

	  				//Check postin TX
					const newtworkTX = await client.transaction.getFromPool(sendTX.transactionId);
                    if(newtworkTX.length)
                    {
                        callback(sendTX.transactionId,newtworkTX);
                    }else{
                        callback(false);
                    }
        });
		  		
}

payout('lskw5qbqfcv7ggq4567uftt97shc3sjgcwmhvjnww',100000,(data)=>{console.log(data)})