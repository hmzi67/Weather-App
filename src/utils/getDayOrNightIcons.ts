import React from 'react'

export default function getDayOrNightIcons(
    iconName: string,
    dateTimeString: string
): string {
    // getting hours
    const hours = new Date(dateTimeString).getHours();

    const isDayTime = hours >= 6 && hours < 18;

    // replacing icons according to the time
  return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
}
