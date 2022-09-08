import dotenv from "dotenv";
import algosdk from "algosdk";
dotenv.config();
let API_KEY = "DzrHeKXtca11LTbU5efGL89p3Hj0Ud6L7bkSkfxf"
let ACCOUNT_MNEMONIC = "shrimp hire return twice ice catch way girl middle wink satisfy poet desk stand stable bamboo kid weapon brisk ozone refuse wide subject above dragon"

//let myaccount = algosdk.mnemonicToSecretKey(process.env.ACCOUNT_MNEMONIC);

let myaccount = algosdk.mnemonicToSecretKey(ACCOUNT_MNEMONIC);


const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
    'X-API-Key': API_KEY
    //'X-API-Key': process.env.API_KEY
}

const algodClient = new algosdk.Algodv2(token, baseServer, port); 
// This variable is our client. It is the link between our code and the blockchain


//making a transaction function
(async () => {
    try {
        let params = await algodClient.getTransactionParams().do();

        // reciever will be some random address.
        const receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA";
        const enc = new TextEncoder(); //text encoding here from text
        const note = enc.encode("My first transaction on Algo!");
        let amount = 100000; // equals .1 ALGO
        let sender = myaccount.addr;

        //object for transaction
        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: sender, 
            to: receiver, 
            amount: amount, 
            node: note, 
            suggestedParams: params
        });

        console.log("HERE3");

        let accountInfo = await algodClient.accountInformation(myaccount.addr).do();
        console.log("Account balance: %d microAlgos", accountInfo.amount);

        // sign transaction 

        let signedTxn = txn.signTxn(myaccount.sk);
        let txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);

        await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation
        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
        accountInfo = await algodClient.accountInformation(myaccount.addr).do();
        console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);        
        console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
        console.log("Account balance: %d microAlgos", accountInfo.amount);

    } catch (err) {
      console.error("Failed to get apps from the sdk", err);
      process.exit(1);
    }
  })()