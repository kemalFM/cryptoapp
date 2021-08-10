/**
 * This file gets latest exchange rates.
 */

import axios from 'axios';
import {ExRateType} from '../AppComponents/Components/PriceConverter';

export default async function GetExchangeRates(): Promise<
  false | ExRateType[]
> {
  return await axios
    .get('https://kur.doviz.com/api/v5/converterItems')
    .then<ExRateType[]>(response => {
      return response.data;
    })
    .catch(() => {
      return false;
    });
}
