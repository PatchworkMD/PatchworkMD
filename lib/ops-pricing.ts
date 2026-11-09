export const opsPricing = { pilot: 750, deposit: 375, care: 500 } as const;

export const balanceOnDelivery = opsPricing.pilot - opsPricing.deposit;

export const usd = (amount: number) => '$' + amount.toLocaleString('en-US');
