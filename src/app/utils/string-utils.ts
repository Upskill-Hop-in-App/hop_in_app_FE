export class StringUtils {
  /**
   * Converts a string to Pascal Case.
   * Example: "united states" -> "United States"
   * @param input - The string to convert
   * @returns The string in Pascal Case
   */
  static toPascalCase(input: string): string {
    if (!input) return '';
    return input
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Converts a string to uppercase.
   * Example: "z3" -> "Z3"
   * @param input - The string to convert
   * @returns The string in uppercase
   */
  static toUpperCase(input: string): string {
    return input?.toUpperCase() || '';
  }

  /**
   * Extracts only the date from an ISO 8601 string in the format "YYYY/MM/DD".
   * Example: "2024-11-27T15:57:27.077Z" -> "2024/11/27"
   * @param input - The ISO 8601 string
   * @returns The date as a string in the format "YYYY/MM/DD"
   */
  static extractDate(input: string): string {
    if (!input) return '';
    const date = input.split('T')[0]; // Get the "YYYY-MM-DD" part
    return date.replace(/-/g, '/'); // Replace dashes with slashes to get "YYYY/MM/DD"
  }

  /**
   * Extracts the date with time (hours and minutes) from an ISO 8601 string in the format "MM/DD/YY, HH:mm AM/PM".
   * Example: "2024-11-27T15:57:27.077Z" -> "11/27/24, 3:57 PM"
   * @param input - The ISO 8601 string
   * @returns The date with time as a string in the format "MM/DD/YY, HH:mm AM/PM"
   */
  static extractDateWithTime(input: string): string {
    if (!input) return '';

    // Convert the ISO 8601 string to a Date object
    const dateObj = new Date(input);

    // Format the date and time as per the desired format
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // MM
    const day = dateObj.getDate().toString().padStart(2, '0'); // DD
    const year = dateObj.getFullYear().toString().slice(-2); // YY
    let hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // MM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Adjust if hour is 0 (midnight)

    // Return the formatted string
    return `${month}/${day}/${year}, ${hours}:${minutes} ${ampm}`;
  }
}
