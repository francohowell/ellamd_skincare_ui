export namespace CurrencyHelper {
  export const formatCents = (amountInCents: number): string => {
    const dollarsPart = Math.trunc(amountInCents / 100);
    const centsPart = amountInCents % 100;

    if (centsPart > 0) {
      return `$${dollarsPart}.${centsPart}`;
    } else {
      return `$${dollarsPart}`;
    }
  };
}
