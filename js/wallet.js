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
        $("#not_logged_in").hide();
        $("#logged_in").show();
        $("#logged_in_nav").show();

        //Load NFTs
        $.getJSON( "https://blockservice.nebulamden.finance/current/all/con_nft_collection_4/collection_balances/", function( data_balances ) {
            var items = [];
            $.each( data_balances, function( key, val ) {
                $.getJSON( "https://masternode-01.lamden.io/contracts/con_nft_collection_4/collection_nfts?key=" + key, function( data_balances ) {
                    items.push( "<li id='" + key + "'>" + val + "</li>" );
                });
                console.log(val.collection_balances);
            });
           
            /*$( "<ul/>", {
              "class": "my-new-list",
              html: items.join( "" )
            }).appendTo( "body" );*/
          });
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

