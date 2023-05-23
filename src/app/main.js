import _CardanoWasm from 'app/services/cardanoWasm';


const main=({logger})=>{
    const CardanoWasm=_CardanoWasm();
    // logger("log"     ,"Hello world!");
    // logger("info"    ,"Hello world!");
    // logger("warning" ,"Hello world!");
    // logger("error"   ,"Hello world!");
    logger("log","Building a Cardano transaction...");

    // instantiate the tx builder with the Cardano protocol parameters - these may change later on
    const linearFee = CardanoWasm.LinearFee.new(
        CardanoWasm.BigNum.from_str('44'),
        CardanoWasm.BigNum.from_str('155381')
    );
    const txBuilderCfg = CardanoWasm.TransactionBuilderConfigBuilder.new()
        .fee_algo(linearFee)
        .pool_deposit(CardanoWasm.BigNum.from_str('500000000'))
        .key_deposit(CardanoWasm.BigNum.from_str('2000000'))
        .max_value_size(4000)
        .max_tx_size(8000)
        .coins_per_utxo_word(CardanoWasm.BigNum.from_str('34482'))
        .build();
    const txBuilder = CardanoWasm.TransactionBuilder.new(txBuilderCfg);

    // add a keyhash input - for ADA held in a Shelley-era normal address (Base, Enterprise, Pointer)
    const prvKey = CardanoWasm.PrivateKey.from_bech32("ed25519e_sk16rl5fqqf4mg27syjzjrq8h3vq44jnnv52mvyzdttldszjj7a64xtmjwgjtfy25lu0xmv40306lj9pcqpa6slry9eh3mtlqvfjz93vuq0grl80");
    txBuilder.add_key_input(
        prvKey.to_public().hash(),
        CardanoWasm.TransactionInput.new(
            CardanoWasm.TransactionHash.from_bytes(
                Buffer.from("8561258e210352fba2ac0488afed67b3427a27ccf1d41ec030c98a8199bc22ec", "hex")
            ), // tx hash
            0, // index
        ),
        CardanoWasm.Value.new(CardanoWasm.BigNum.from_str('3000000'))
    );

    // add a bootstrap input - for ADA held in a Byron-era address
    const byronAddress = CardanoWasm.ByronAddress.from_base58("Ae2tdPwUPEZLs4HtbuNey7tK4hTKrwNwYtGqp7bDfCy2WdR3P6735W5Yfpe");
    txBuilder.add_bootstrap_input(
        byronAddress,
        CardanoWasm.TransactionInput.new(
        CardanoWasm.TransactionHash.from_bytes(
            Buffer.from("488afed67b342d41ec08561258e210352fba2ac030c98a8199bc22ec7a27ccf1", "hex"),
        ), // tx hash
        0, // index
        ),
        CardanoWasm.Value.new(CardanoWasm.BigNum.from_str('3000000'))
    );

    // base address
    const shelleyOutputAddress = CardanoWasm.Address.from_bech32("addr_test1qpu5vlrf4xkxv2qpwngf6cjhtw542ayty80v8dyr49rf5ewvxwdrt70qlcpeeagscasafhffqsxy36t90ldv06wqrk2qum8x5w");
    // pointer address
    const shelleyChangeAddress = CardanoWasm.Address.from_bech32("addr_test1gz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzerspqgpsqe70et");

    // add output to the tx
    txBuilder.add_output(
        CardanoWasm.TransactionOutput.new(
        shelleyOutputAddress,
        CardanoWasm.Value.new(CardanoWasm.BigNum.from_str('1000000'))    
        ),
    );

    // set the time to live - the absolute slot value before the tx becomes invalid
    txBuilder.set_ttl(410021);

    // calculate the min fee required and send any change to an address
    txBuilder.add_change_if_needed(shelleyChangeAddress);

    // once the transaction is ready, we build it to get the tx body without witnesses
    const txBody = txBuilder.build();
    const txHash = CardanoWasm.hash_transaction(txBody);
    const witnesses = CardanoWasm.TransactionWitnessSet.new();

    // add keyhash witnesses
    const vkeyWitnesses = CardanoWasm.Vkeywitnesses.new();
    const vkeyWitness = CardanoWasm.make_vkey_witness(txHash, prvKey);
    vkeyWitnesses.add(vkeyWitness);
    witnesses.set_vkeys(vkeyWitnesses);

    // add bootstrap (Byron-era) witnesses
    const cip1852Account = CardanoWasm.Bip32PrivateKey.from_bech32('xprv1hretan5mml3tq2p0twkhq4tz4jvka7m2l94kfr6yghkyfar6m9wppc7h9unw6p65y23kakzct3695rs32z7vaw3r2lg9scmfj8ec5du3ufydu5yuquxcz24jlkjhsc9vsa4ufzge9s00fn398svhacse5su2awrw');
    const bootstrapWitnesses = CardanoWasm.BootstrapWitnesses.new();
    const bootstrapWitness = CardanoWasm.make_icarus_bootstrap_witness(
        txHash,
        byronAddress,
        cip1852Account,
    );
    bootstrapWitnesses.add(bootstrapWitness);
    witnesses.set_bootstraps(bootstrapWitnesses);

    // create the finalized transaction with witnesses
    const transaction = CardanoWasm.Transaction.new(
        txBody,
        witnesses,
        undefined, // transaction metadata
    );
    logger("log","Ready!");
    logger("info",{
        txHex:transaction.to_hex(),
        txhash: txHash.to_hex(),
    });
    throw new Error("This is a test")

  }
  
export default main;