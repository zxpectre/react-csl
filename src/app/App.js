import React,{useState} from 'react';
import logo from '../logo.png';
import main from './main';

function App() {
  const [ui,setUi]=useState({
    log:[],
  });
  const logger=(type,msg)=>{
    setUi(oldUi=>({...oldUi,log:[...oldUi.log,{type,msg}]}))
  }
  const handleClear=(e)=>{
    e && e.preventDefault();
    setUi(oldUi=>({...oldUi,log:[]}))
  }
  const handleMain=(e)=>{
    e && e.preventDefault();
    try{
      main({logger});
    }catch(err){
      logger("error",`main(): critical: ${err||"Unknown error"}`);
    }
  }
  return (
    <div className="App centered">
      <header className="App-header">
        
        
        <a
          className="App-link"
          href="https://github.com/Emurgo/cardano-serialization-lib/issues/623"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h1>Replicating "RuntimeError: unreachable executed" error</h1>
        </a>
        <h3>React + 
        <a
          className="App-link"
          href="https://github.com/Emurgo/cardano-serialization-lib"
          target="_blank"
          rel="noopener noreferrer"
        > Cardano Serialization Lib 
        </a>
         + Typescript</h3>
        <button className="btn-lg" onClick={handleMain}>Run</button>
        <button className="btn-lg" onClick={handleClear}>Clear</button>
        <div className="console">
          {ui.log.map(({msg,type},index)=>{
            const key=`console_msg_${type}_${index}`
            try{
              return <pre title={type} key={key} className={`${type}-text`}>{JSON.stringify(msg,null,2)}</pre>;
            }catch(err){
              return <pre title={type} key={key} className={`error-text`}>{`console(): unable to serialize as JSON: ${err||"Unknown error"}`}</pre>;
            }
          })}
        </div>
        <p>
          Edit <code>src/app/main.js</code> and save to reload.
        </p>
        <p>
          <a title="Fork on Github" className="github-button" href="https://github.com/zxpectre/react-csl/fork" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-size="large" data-show-count="true" aria-label="Fork zxpectre/react-csl on GitHub">Fork</a>
        </p>

        <div>
          with ❤️ by
          <br/> 
          <a
          title="GameChanger Finance"
          className="App-link"
          href="https://gamechanger.finance/"
          target="_blank"
          rel="noopener noreferrer"
        >
        <img src={logo} className="logo" alt="GameChanger Finance" />
        </a>
        </div>
      </header>
    </div>
  );
}

export default App;