import React from "react";
import RNFS from 'react-native-fs';
import { AddressType } from "../Repositories/WalletType";

export async function SaveWalletDetails(walletID: string, walletDetails: AddressType): Promise<boolean>{

  return await RNFS.writeFile(RNFS.DocumentDirectoryPath + '/' + walletID + '_details.crypto', JSON.stringify(walletDetails)).then(async (status) => {
    return true;
  }).catch(() => {
    return false;
  })

}
