import React from "react";
import RNFS from 'react-native-fs';
import { AddressType } from "../Repositories/WalletType";

export async function ReadWalletDetails(walletID: string): Promise<AddressType | false> {

  return await RNFS.exists(RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto').then(async (status) => {

    if(status){
      return await ReadWallet(walletID);
    }else{
      return false;
    }

  });

}


export async function ReadWallet(walletID: string): Promise<AddressType | false> {

  return await RNFS.readFile(RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto').then((data) => {
      return JSON.parse(data);
  }).catch(() => {
    return false;
  })

}
