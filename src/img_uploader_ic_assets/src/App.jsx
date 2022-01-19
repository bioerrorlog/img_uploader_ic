import React, { useState, useEffect } from 'react';
// import { HttpAgent } from "@dfinity/agent";
import PlugConnect from '@psychedelic/plug-connect';

import TitleImg from '../assets/title-image.png';
import {
  img_uploader_ic,
  canisterId,
  idlFactory,
} from "../../declarations/img_uploader_ic";
import { img_uploader_ic_asset } from "../../declarations/img_uploader_ic_asset";

const App = () => {
  const [image, setImage] = useState(null);

  const [name, setName] = useState('');  // For debug
  const [message, setMessage] = useState('');  // For debug

  const [connected, setConnected] = useState(false);
  const [principalId, setPrincipalId] = useState('');
  const [actor, setActor] = useState(false);

  const whitelist = [canisterId];
  const network = `http://${canisterId}.localhost:8000`;

  const createChunkDefault = async ({batch_id, chunk}) => img_uploader_ic_asset.create_chunk({
    batch_id,
    content: [...new Uint8Array(await chunk.arrayBuffer())]
  })

  const uploadDefault = async () => {
    // Assets writable only by canister owner - assets readable by anyone
    // https://github.com/dfinity/sdk/blob/master/docs/design/asset-canister.adoc
    console.log('start uploadByOwner');
    if (!image) {
      console.error('No image selected');
      return;
    }
  
    const {batch_id} = await img_uploader_ic_asset.create_batch();
    console.log(batch_id);
  
    const promises = [];
    const chunkSize = 700000;
    for (let start = 0; start < image.size; start += chunkSize) {
      const chunk = image.slice(start, start + chunkSize);
      promises.push(createChunkDefault({
        batch_id,
        chunk
      }));
    }
  
    const chunkIds = await Promise.all(promises);
    console.log(chunkIds);
  
    await img_uploader_ic_asset.commit_batch({
      batch_id,
      chunk_ids: chunkIds.map(({chunk_id}) => chunk_id),
      content_type: image.type
    })
  
    // TODO: register to backend canister
  
    console.log('uploaded');
  }
  
  const doGreet = async () => {
    // For debug

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

        {/* Greet func for Debug */}
        <div style={{ margin: "30px" }}>
          <input
            id="name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          ></input>
          <button onClick={doGreet}>Greet</button>
        </div>
        <div>
          Greet response: "
          <span>{message}</span>"
        </div>
        
        {/* Image uploader */}
        <div style={{ margin: "30px" }}>
          <div>
            Default asset canister upload: writable only by canister owner, readable by anyone.
          </div>
          <input 
            type="file"
            accept="image/*"
            onChange={(ev) => setImage(ev.target.value)}
          />
          <button onClick={uploadDefault}>Upload</button>
        </div>
      </div>
    </div>
    </ >
  );
};

export default App;
