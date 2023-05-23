import React,{useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App.js';
import { loadModule } from 'app/services/cardanoWasm';


const AppWrapperReady=()=>{
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    (async()=>{
      loadModule().then(setReady(true));
    })()
  })
  if(!ready)
    return <h3 className="centered" >Loading Cardano Serialization Lib...</h3>
  return <App/>;
}


ReactDOM.render(<AppWrapperReady/>, document.getElementById('root'));

