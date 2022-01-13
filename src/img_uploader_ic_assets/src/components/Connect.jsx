import React from 'react';
import PlugConnect from '@psychedelic/plug-connect';

import { canisterId } from "../../../declarations/img_uploader_ic";

const Connect = ({ handleConnect }) => {
  const network = "https://mainnet.dfinity.network/";
  const whitelist = [canisterId];

  return (
    <>
      <PlugConnect
        host={network}
        whitelist={whitelist}
        dark
        onConnectCallback={handleConnect}
      />
    </>
  );
};

export default Connect;
