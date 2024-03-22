

export default function convertWindSpeed(speedInMeterPerSecond: number): string {
    const speedInKMperHour = speedInMeterPerSecond * 3.6;
  return `${speedInKMperHour.toFixed(0)}km/h`;
}