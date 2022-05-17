import dotenv from "dotenv";
import algosdk from "algosdk";
dotenv.config();

async function readGlobalState(client, index){
    let applicationInfoResponse = await client.getApplicationByID(index).do();
    let globalState = []
    globalState = applicationInfoResponse['params']['global-state']
    for (let n = 0; n < globalState.length; n++) {
        console.log(applicationInfoResponse['params']['global-state'][n]);
    }
}

let myaccount = algosdk.mnemonicToSecretKey(process.env.ACCOUNT_MNEMONIC);
let sender = myaccount.addr;

const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
    'X-API-Key': process.env.API_KEY
}

const algodClient = new algosdk.Algodv2(token, baseServer, port); 