export default function meterToKiloMeter(meters: number): string {
    const kiloMeter = meters / 1000;
    return `${kiloMeter.toFixed(0)}km`;
}
