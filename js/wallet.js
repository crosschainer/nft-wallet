// Requires jQuery
var address = "";


// 1. Defining dApp Connection
const detail = JSON.stringify({
    appName: 'NFT Wallet',
    version: '0.0.1',
    logo: 'logo.png',
    contractName: 'con_mintorburn',
    networkType: 'mainnet',
})

// 2. Wallet Event Listener
document.addEventListener('lamdenWalletInfo', (response) => {
    if (response.detail.errors === undefined) {
        //Wallet is connected
        $("#connect_wallet").hide();
    }
});

// 2. TX Event Listener
document.addEventListener('lamdenWalletTxStatus', (response) => {
    //Listens to Transactions
});

// 3. Dispatch Event on Page Load
$(document).ready(function () {
    // Get Wallet if already connected
    document.dispatchEvent(new CustomEvent('lamdenWalletGetInfo'));
});

// 4. Connect a Wallet Function
$("#connect_wallet").click(function () {
    console.log("Connect your wallet has been triggered.");
    document.dispatchEvent(new CustomEvent('lamdenWalletConnect', { detail }));
});

