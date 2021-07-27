export default function DogePriceFixer(price: number, number = false): string | number {
  const lengthOfPrice = price.toFixed().length;

  const newPrice = Number(
    price.toString().slice(0, lengthOfPrice - 8) +
      '.' +
      price.toString().slice(lengthOfPrice - 8),
  );

  if(number){
    return newPrice;
  }

  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(newPrice));
}
