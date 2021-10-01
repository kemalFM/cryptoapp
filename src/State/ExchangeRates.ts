import create from 'zustand';
import {ExRateType} from '../AppComponents/Components/PriceConverter';

type ExchangeRatesStateType = {
  rates: ExRateType[];
  setRates: (rates: ExRateType[]) => void;
  setCurrency: (currency: 'USD' | 'EUR') => void;
  currency: 'USD' | 'EUR'
};

export const useExchangeRates = create<ExchangeRatesStateType>(set => ({
  rates: [],
  currency: 'EUR',
  setRates: rates => set({rates}),
  setCurrency: currency => set({currency})
}));
