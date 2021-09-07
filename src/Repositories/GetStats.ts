import axios from 'axios';
import {BLOCK_CHAIR_API} from './RepositoryConstants';
import {StatsType} from './StatsType';
import {DogePriceType} from './DogePriceType';

export async function GetStats(): Promise<StatsType | false> {
  return await axios
    .get<StatsType>(BLOCK_CHAIR_API + '/stats')
    .then(response => {
      return response.data;
    })
    .catch(() => {
      return false;
    });
}

export async function GetPrices(): Promise<DogePriceType | false> {
  const today = new Date().toISOString().replace('T', ' ').split('.')[0];
  const oneWeekAgo = new Date(
    new Date().setDate(new Date().getDate() - 7),
  ).toISOString().replace('T', ' ').split('.')[0];



  return await axios
    .get<DogePriceType>(BLOCK_CHAIR_API + '/blocks', {
      params: {
        a: 'date,price(doge_usd)',
        q: `time(${oneWeekAgo}..${today})`,
      },
    })
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(today, oneWeekAgo);
      console.log(err, "price chart error", err.response.data);
      return false;
    });
}
//https://api.blockchair.com/dogecoin/blocks?a=date,price(doge_usd)&q=time(2021-07-20%2007:45:20..2021-07-27%2007:45:20)
//2021-07-27 08:07:31 2021-07-20 08:07:31
