import React, { useState, useEffect } from 'react';

import { Connect } from './components';
import TitleImg from '../assets/title-image.png';
import { img_uploader_ic } from "../../declarations/img_uploader_ic";

const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [actor, setActor] = useState(false);

  const doGreet = async () => {
    const greeting = await img_uploader_ic.greet(name);
    setMessage(greeting);
  }

  const handleConnect = async () => {
    setConnected(true);

    if (!window.ic.plug.agent) {
      const whitelist = [process.env.PLUG_COIN_FLIP_CANISTER_ID];
      await window.ic?.plug?.createAgent(whitelist);
    }

    // Create an actor to interact with the NNS Canister
    // we pass the NNS Canister id and the interface factory
    const NNSUiActor = await window.ic.plug.createActor({
      canisterId: process.env.PLUG_COIN_FLIP_CANISTER_ID,
      interfaceFactory: idlFactory,
    });

    setActor(NNSUiActor);
  }

  return (
    <>
    <div className='app'>
      <div className="content">
        <img className='title-image' src={TitleImg} />
        <Connect handleConnect={handleConnect} />
        <div style={{ margin: "30px" }}>
          <input
            id="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          ></input>
          <button onClick={doGreet}>Get Greeting!</button>
        </div>
        <div>
          Greeting is: "
          <span style={{ color: "blue" }}>{message}</span>"
        </div>
      </div>
    </div>
    </ >
  );
};

export default App;
