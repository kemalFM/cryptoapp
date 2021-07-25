import create from 'zustand';

type WalletStateType = {
  id: string;
  setWallet: (id: string) => void;
};

export const useWallet = create<WalletStateType>(set => ({
  id: '',
  setWallet: id => set({id}),
}));
