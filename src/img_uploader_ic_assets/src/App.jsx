import React, { useState, useEffect } from 'react';

import Connect from './components/Connect';
import TitleImg from '../assets/title-image.png';
import {
  img_uploader_ic,
  canisterId,
  idlFactory,
} from "../../declarations/img_uploader_ic";

const App = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [actor, setActor] = useState('');

  const doGreet = async () => {
    const greeting = await img_uploader_ic.greet(name);
    setMessage(greeting);
  }

  const handleConnect = async () => {
    setConnected(true);

    if (!window.ic.plug.agent) {
      const whitelist = [canisterId];
      await window.ic?.plug?.createAgent(whitelist);
    }

    // Create an actor to interact with the basckend Canister
    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    setActor(actor);
  }

  return (
    <>
    <div className='app'>
      <div className="content">
        <img className='title-image' src={TitleImg} />
        {connected ? 'Connected to plug' : (
          <Connect handleConnect={handleConnect} />
        )}
        <div style={{ margin: "30px" }}>
          <input
            id="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          ></input>
          <button onClick={doGreet}>Upload</button>
        </div>
        <div>
          Your Image: "
          <span style={{ color: "blue" }}>{message}</span>"
        </div>
      </div>
    </div>
    </ >
  );
};

export default App;
