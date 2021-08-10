/**
 * @param price number
 * @param number boolean
 *
 * This function calculates actual dogecoins in human readable way,
 * The api provides dogecoin information without splitting decimal places with dot
 * For example for 50 doge coins the number is 5000000000
 * If the requested dogecoin is in number this function returns as Number,
 * if the number is not provided or set to false returns Number formatted string
 *
 */

export default function DogePriceFixer(
  price: number,
  number = false,
): string | number {
  const lengthOfPrice = price.toFixed().length;

  const newPrice = Number(
    price.toString().slice(0, lengthOfPrice - 8) +
      '.' +
      price.toString().slice(lengthOfPrice - 8),
  );

  if (number) {
    return newPrice;
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(newPrice));
}
