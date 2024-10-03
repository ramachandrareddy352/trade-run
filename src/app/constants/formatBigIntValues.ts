export function formatBigInt(bigIntValue: BigInt, decimals: number) {
    const strValue = bigIntValue.toString();
    if (strValue.length <= decimals) {
      return "0";
    }
    const result = strValue.slice(0, -decimals); // Gets all but the last 18 digits
    return result;
  }
  
export function formatBigIntForPrice(bigIntValue: bigint) {
    const divisor = BigInt(100000000); // To divide by 100,000,000
    const integerPart = bigIntValue / divisor; // Integer part
    const fractionalPart = bigIntValue % divisor; // Remainder
  
    // Format the fractional part to 2 decimal places
    const fractionalStr = fractionalPart.toString().padStart(8, "0").slice(0, 2);
  
    return `${integerPart.toString()}.${fractionalStr}`;
}
  