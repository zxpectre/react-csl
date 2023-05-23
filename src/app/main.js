import _CardanoWasm from 'app/services/cardanoWasm';


const main=({logger})=>{
    const CardanoWasm=_CardanoWasm();
    // logger("log"     ,"Hello world!");
    // logger("info"    ,"Hello world!");
    // logger("warning" ,"Hello world!");
    // logger("error"   ,"Hello world!");
    logger("info","Replicating 'RuntimeError: unreachable executed' ");
    
    const protocolParams={
        "poolDeposit": 500000000,
        "keyDeposit": 2000000,
        "minUTxOValue": 1000000,
        "minFeeA": 44,
        "minFeeB": 155381,
        "maxTxSize": 16384,
        "maxValueSize": 5000,
        "lovelacePerUTxOWord": 34482,
        "lovelacePerUTxOByte": 4310,
        "executionPrices": {
            "prSteps": {
                "numerator": 721,
                "denominator": 10000000
            },
            "prMem": {
                "numerator": 577,
                "denominator": 10000
            }
        },
        "maxTxExUnits": {
            "exUnitsMem": 10000000,
            "exUnitsSteps": 10000000000
        },
        "maxBlockExUnits": {
            "exUnitsMem": 50000000,
            "exUnitsSteps": 40000000000
        },
        "collateralPercentage": 150,
        "maxCollateralInputs": 3
    };

    const txBuilder =  CardanoWasm.TransactionBuilder.new(
		CardanoWasm.TransactionBuilderConfigBuilder.new()			
			.fee_algo			(CardanoWasm.LinearFee.new(
									CardanoWasm.BigNum.from_str(String(protocolParams.minFeeA)), 
									CardanoWasm.BigNum.from_str(String(protocolParams.minFeeB)))
								)
			.pool_deposit		(CardanoWasm.BigNum.from_str(String(protocolParams.poolDeposit)))
			.key_deposit		(CardanoWasm.BigNum.from_str(String(protocolParams.keyDeposit)))
			.coins_per_utxo_byte(CardanoWasm.BigNum.from_str(String(protocolParams.lovelacePerUTxOByte)))			
			.max_value_size		(protocolParams.maxValueSize)
			.max_tx_size		(protocolParams.maxTxSize)
			.prefer_pure_change	(true)
			.build()
    );
    logger("log"    ,"txBuilder ok");

    const scriptHash    ="4658726c25d0b50454c143647a2d138a1f1727fa5ee8c3a6c75f6098";
    const poolKeyHash   ="7facad662e180ce45e5c504957cd1341940c72a708728f7ecfc6e349";
    let allCertificatesObj = CardanoWasm.Certificates.new();
    let certificateObj  = CardanoWasm.Certificate.new_stake_delegation(
        CardanoWasm.StakeDelegation.new(
            CardanoWasm.StakeCredential.from_scripthash	(CardanoWasm.ScriptHash		.from_hex(scriptHash) ),
            CardanoWasm.Ed25519KeyHash.from_hex(poolKeyHash)
        ),
    );
    logger("log"    ,"certificateObj ok");

    allCertificatesObj.add(certificateObj);
    logger("log"    ,"allCertificatesObj ok");
    logger("log",JSON.parse(allCertificatesObj.to_json(1)));

    txBuilder.set_certs(allCertificatesObj);

  }
  
export default main;