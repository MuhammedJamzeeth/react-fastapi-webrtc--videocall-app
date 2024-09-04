// src/utils/timeUtils.js

/**
 * Extracts time from an ISO string and formats it as HH:MM AM/PM.
 * @param {string} isoString - The ISO date string.
 * @returns {string} - The formatted time string.
 */

export const extractTime = (isoString) => {
    const date = new Date(isoString);
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12; // If hour is 0, set it to 12
    hours = String(hours).padStart(2, "0");

    // Return in HH:MM AM/PM format
    return `${hours}:${minutes} ${amPm}`;
};
