import create from 'zustand';
import { DogePriceType } from "../Repositories/DogePriceType";

type DogePricesStateType = {
  prices: DogePriceType | null;
  setPrices: (prices: DogePriceType) => void;
};

export const useDogePrices = create<DogePricesStateType>(set => ({
  prices: null,
  setPrices: prices => set({prices}),
}));
