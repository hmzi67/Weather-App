export function convertKelvinToCelcius(tempInKelvin: number): number {
  const celsiusTemp = tempInKelvin - 273.15;
  return Math.round(celsiusTemp)
}
