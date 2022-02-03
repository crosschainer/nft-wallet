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
        $( "#nft-masonry" ).empty();
        $("#connect_wallet").hide();
        $("#not_logged_in").hide();
        $("#logged_in").show();
        $("#logged_in_nav").show();
        
        address = response.detail.wallets[0];
        $("#address").html($.trim(address).substring(0, 10)
        .trim(this) + "...");
        //Load NFT Collections
        $.getJSON( "nft-collection-lists/main.json", function( collections ) {      
            $.each( collections, function( key, val ) {
                var contract = val.contract;
                //Load NFTs
                $.getJSON( "https://blockservice.nebulamden.finance/current/all/"+contract+"/collection_balances/", function( data_balances ) {
                    var items = [];
                    var con = (Object.keys(data_balances)[0]);
                    $.each( data_balances[con], function( key, val ) {
                        try{
                            var nfts = Object.keys(val[address]);
                            $.each( nfts, function( index, nft_name ) {
                                var nft_amount = val[address][nft_name]
                                if(nft_amount != 0){
                                $.getJSON( "https://masternode-01.lamden.io/contracts/"+contract+"/collection_nfts?key=" + nft_name, function( nft_data ) {

                                    $( "#nft-masonry" ).append(  '<div class="col-sm-6 col-lg-4 mb-4"> <div class="card"> <img class="bd-placeholder-img card-img-top" style="width:100%" src="'+nft_data.value["ipfs_image_url"]+'"/> <div class="card-body"> <h5 class="card-title">'+nft_name+'</h5> <p class="card-text">'+nft_data.value["description"]+'</p> <p class="card-text">You own: <b>'+nft_amount+'</b></p> <button data-id="'+nft_name+'" data-contract="'+contract+'" id="transfer_button" class="btn btn-primary">Transfer</button> </div> </div> </div>'  );
                                });
                            }
                            }); 
                            
                        }
                        catch{
                            
                        }    
                    });
                });
            });
        })
    } 
});

// Bind Click on Transfer
$(document).on("click", "#transfer_button", function () {
    var nftId = $(this).data('id');
    var collection = $(this).data('contract');
    $(".modal-body #nft_to_send").text( nftId );
    $(".modal-body #contract_collection").text( collection );
    $('#transferModal').modal('show');
});

// Bind Click on Send
$(document).on("click", "#send_nft", function () {
    var nftId = $("#nft_to_send").text();
    var amount = $("#amount_input").val();
    var to_address = $("#to_input").val();
    var contract = $("#contract_collection").text();
    $('#send_nft').text('Waiting for Approval TX..');
    const detail = JSON.stringify({
        contractName: contract,
        methodName: 'approve',
        networkType: 'mainnet',
        kwargs: {
            name: nftId,
            amount: parseInt(amount),
            to: to_address
            
        },
    
        stampLimit: 100,
    });
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', {detail}));
    

});


// 2. TX Event Listener
document.addEventListener('lamdenWalletTxStatus', (response) => {
    //Listens to Transactions
    console.log(response);
    if (response.detail.data.resultInfo.title=="Transaction Successful" && response.detail.data.txInfo.methodName == "approve"){ 
        $('#send_nft').text('Waiting for Transfer TX..');
        const detail = JSON.stringify({
            contractName: response.detail.data.txInfo.contractName,
            methodName: 'transfer_from',
            networkType: 'mainnet',
            kwargs: {
                name: response.detail.data.txInfo.kwargs.name,
                amount: response.detail.data.txInfo.kwargs.amount,
                to: response.detail.data.txInfo.kwargs.to,
                main_account: response.detail.data.txInfo.senderVk
                
            },
        
            stampLimit: 200,
        });
        document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', {detail}));
    }
    if (response.detail.data.resultInfo.title=="Transaction Successful" && response.detail.data.txInfo.methodName == "transfer_from"){ 
        $('#send_nft').text('Send');
        $('#transferModal').modal('hide');
        document.dispatchEvent(new CustomEvent('lamdenWalletInfo'));
    }
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

