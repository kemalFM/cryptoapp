/**
 *
 * @param basePrice
 * @param convertTo
 * @param rates
 * This function changes currency of the number
 * The base currency is United States Dollars
 * Currently only supports changing to EUR
 *
 */

export default function PriceConverter(
  basePrice: number,
  convertTo: 'USD' | 'EUR',
  rates: ExRateType[],
) {
  if (rates.length === 0 || convertTo === 'USD') {
    return basePrice;
  }

  // @ts-ignore
  const eurPrice = rates[0]['2'].buying;
  // @ts-ignore
  const usdPrice = rates[0]['1'].buying;

  const exchangeRate = eurPrice / usdPrice;

  if (exchangeRate > 1) {
    return basePrice / exchangeRate;
  } else {
    return basePrice * exchangeRate;
  }
}

export type ExRateType = {
  [key: number]: {
    [key: string]: {
      key: number;
      text: string;
      code: string;
      buying: number;
      selling: number;
    }[];
  };
};
