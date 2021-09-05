const { apiClient } = require('@liskhq/lisk-client');
const config = require('./config.json');
const network = config.network.testnet; // or config.network.mainnet
function getAPI(url){
	return network.serviceAPI+url;
}

function getExplorer(url){
	return network.explorer+url;
}

//Convert lsk to beddows
function lskAsBeddows(num){
    return Number(num * Math.pow(10, 8));
}
//Convert beddows to lsk
function beddowsAsLsk(num, flag){ // flag = false return string; flag=true return number  shinekami's logic :P
  if(!flag){
    return (num * Math.pow(10, -8)).toLocaleString();
  } else {
    return Number(num * Math.pow(10, -8));    
  }
}

const getClient = async() => {
    return  await apiClient.createIPCClient(config.ipc); 
}

module.exports={getAPI,getExplorer,lskAsBeddows,beddowsAsLsk,getClient}