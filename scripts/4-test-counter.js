import dotenv from "dotenv";
import algosdk from "algosdk";
dotenv.config();

let API_KEY = "DzrHeKXtca11LTbU5efGL89p3Hj0Ud6L7bkSkfxf"
let ACCOUNT_MNEMONIC = "shrimp hire return twice ice catch way girl middle wink satisfy poet desk stand stable bamboo kid weapon brisk ozone refuse wide subject above dragon"


async function readGlobalState(client, index){
    let applicationInfoResponse = await client.getApplicationByID(index).do();
    let globalState = []
    globalState = applicationInfoResponse['params']['global-state']
    for (let n = 0; n < globalState.length; n++) {
        console.log(applicationInfoResponse['params']['global-state'][n]);
    }
}

let myaccount = algosdk.mnemonicToSecretKey(ACCOUNT_MNEMONIC);
//let myaccount = algosdk.mnemonicToSecretKey(process.env.ACCOUNT_MNEMONIC);
let sender = myaccount.addr;

const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
   // 'X-API-Key': process.env.API_KEY
    'X-API-Key': API_KEY
}

const algodClient = new algosdk.Algodv2(token, baseServer, port); 

let index = 108732913;

let appArgs1 = [];
let add = "Add";
let deduct = "Deduct";
let appArgs2 = [];

appArgs1.push(new Uint8Array(Buffer.from(add)));
appArgs2.push(new Uint8Array(Buffer.from(deduct)));

(async () => {
    try {
                console.log("Intial Global State")
        await readGlobalState(algodClient, index);

                let params = await algodClient.getTransactionParams().do();
        // create a transaction to add
        console.log("Adding!")
        let txn = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs1)
        let txId = txn.txID().toString();

        // sign, send, await
        let signedTxn = txn.signTxn(myaccount.sk);
        console.log("Signed transaction with txID: %s", txId);
        await algodClient.sendRawTransaction(signedTxn).do();
        await algosdk.waitForConfirmation(algodClient, txId, 2);

        // display results
        let transactionResponse = await algodClient.pendingTransactionInformation(txId).do();
        console.log("Called app-id:",transactionResponse['txn']['txn']['apid'])
        if (transactionResponse['global-state-delta'] !== undefined ) {
        console.log("Global State updated:",transactionResponse['global-state-delta']);
        }

        // create a transaction to deduct
        console.log("Deducting!")
        let txn2 = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs2)
        let txId2 = txn2.txID().toString();
        // sign, send, await
        let signedTxn2 = txn2.signTxn(myaccount.sk);
        console.log("Signed transaction with txID: %s", txId2);
        await algodClient.sendRawTransaction(signedTxn2).do();
        await algosdk.waitForConfirmation(algodClient, txId2, 2);
        // display results
        let transactionResponse2 = await algodClient.pendingTransactionInformation(txId2).do();
        console.log("Called app-id:",transactionResponse2['txn']['txn']['apid'])
        if (transactionResponse2['global-state-delta'] !== undefined ) {
        console.log("Global State updated:",transactionResponse2['global-state-delta']);
        }

    } catch (err) {
      console.error("Tests failed!", err);
      process.exit(1);
    }
  })()