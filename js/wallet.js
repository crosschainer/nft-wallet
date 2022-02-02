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
        address = response.detail.wallets[0];
        //Load NFTs
        $.getJSON( "https://blockservice.nebulamden.finance/current/all/con_nft_collection_4/collection_balances/", function( data_balances ) {
            var items = [];
            var con = (Object.keys(data_balances)[0]);
            $.each( data_balances[con], function( key, val ) {
                var nfts = Object.keys(val[address]);
                $.each( nfts, function( index, nft_name ) {
                    var nft_amount = val[address][nft_name]
                    $.getJSON( "https://masternode-01.lamden.io/contracts/con_nft_collection_4/collection_nfts?key=" + nft_name, function( nft_data ) {
                        items.push( '<div class="col-sm-6 col-lg-4 mb-4"> <div class="card"> <img class="bd-placeholder-img card-img-top" style="width:100%" src="'+nft_data.value["ipfs_image_url"]+'"/> <div class="card-body"> <h5 class="card-title">'+nft_name+'</h5> <p class="card-text">'+nft_data.value["description"]+'</p> <p class="card-text">You own: <b>'+nft_amount+'</b></p> <a href="#" class="btn btn-primary">Transfer</a> </div> </div> </div>' );
                        $( "#nft-masonry" ).append( items.toString() );
                    });
                });     
            });
            console.log(items);
            
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

