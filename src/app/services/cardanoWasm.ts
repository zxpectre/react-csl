const debugMe=false;

let _CardanoWasm:typeof import ('@emurgo/cardano-serialization-lib-browser');

export const loadModule=async (cb?:Function)=>{
    if(_CardanoWasm)
        return;
    if(debugMe) console.log("[CardanoWasm] Loading...")
    _CardanoWasm = await import ('@emurgo/cardano-serialization-lib-browser'); 
    if(debugMe) console.log("[CardanoWasm] Ready")
    if(cb)
        cb(_CardanoWasm);
    return _CardanoWasm;
}
const moduleGetter=()=>_CardanoWasm;

loadModule();

export default moduleGetter;
