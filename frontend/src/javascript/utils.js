export function getTimeDifference(publishedDate) {
  // Calculate the time difference between the current date and the published date
  const currentDate = new Date();  // Get the current date
  const timeDifference = Math.abs(currentDate - new Date(publishedDate));  // Time difference in milliseconds
  const hoursDifference = Math.floor(timeDifference / 3600000);  // Convert to hours
  const daysDifference = Math.floor(hoursDifference / 24);  // Convert to days

  // Return the difference in hours if less than 24 hours, otherwise return days
  if (hoursDifference < 24) {
    return `${hoursDifference}hr`;
  } else {
    return `${daysDifference} days`;
  }
}

export function sortItems(arr) {
  // Sort items in descending order by their 'published' date
  return arr.sort((a, b) => {
    const dateA = new Date(a.published);  // Parse published date of item A
    const dateB = new Date(b.published);  // Parse published date of item B
    return dateB - dateA;  // Sort in descending order (newest first)
  });
}

export function sortJobItems(items) {
  // Convert month names to numbers (in order to sort the data correctly
  // across different platforms)
  const monthToNumber = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Sort based on year and month
  return items.sort((a, b) => {
    const dateA = new Date(a.year, monthToNumber[a.month]);
    const dateB = new Date(b.year, monthToNumber[b.month]);
    return dateA - dateB;
  });
}
