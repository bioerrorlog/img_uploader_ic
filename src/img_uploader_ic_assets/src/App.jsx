import React, { useState, useEffect } from 'react';
import { HttpAgent } from "@dfinity/agent";
import PlugConnect from '@psychedelic/plug-connect';

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
  const [actor, setActor] = useState(false);

  const whitelist = [canisterId];
  const network = `http://${canisterId}.localhost:8000`;

  const doGreet = async () => {
    // const greeting = await actor.greet(name);
    const greeting = await img_uploader_ic.greet(name);
    setMessage(`${greeting} and ${principalId}`);
  }

  const handleConnect = async () => {

    if (!window.ic.plug.agent) {
      await window.ic?.plug?.createAgent({whitelist, network});
    }

    // Create an actor to interact with the basckend Canister
    const actor = await window.ic.plug.createActor({
      canisterId: canisterId,
      interfaceFactory: idlFactory,
    });

    setActor(actor);
    setConnected(true);
  }

  useEffect(async () => {
    if (!window.ic?.plug?.agent) {
      setActor(false);
      setConnected(false);
      window.location.hash = '/connect';
    }
  }, []);

  useEffect(async () => {
    if (connected) {
      const principal = await window.ic.plug.agent.getPrincipal();

      if (principal) {
        setPrincipalId(principal.toText());
      }
    } else {
      window.location.hash = '/connect';
    }
  }, [connected]);

  useEffect(async () => {
      if (process.env.DFX_NETWORK == "local") {
        await window.ic.plug.agent.fetchRootKey();
      };
  }, []);

  return (
    <>
    <div className='app'>
      <div className="content">
        <img className='title-image' src={TitleImg} />
        {connected ? `Connected to plug: ${principalId} / ${canisterId}`: (
          <PlugConnect
            host={network}
            whitelist={whitelist}
            dark
            onConnectCallback={handleConnect}
          />
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
          <span>{message}</span>"
        </div>
      </div>
    </div>
    </ >
  );
};

export default App;
