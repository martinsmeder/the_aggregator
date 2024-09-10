export function getUniqueItems(existingItems, newItems) {
  // Copy the existing items to a new array
  const uniqueItems = [...existingItems];

  // Loop through the new items
  newItems.forEach((newItem) => {
    // Check if the new item's ID already exists in the unique items array
    if (!uniqueItems.find((item) => item.url === newItem.url)) {
      // If not found, add the new item to the unique items array
      uniqueItems.push(newItem);
    }
  });

  // Return the array containing unique items
  return uniqueItems;
}

export function getTimeDifference(publishedDate) {
  const currentDate = new Date();
  const timeDifference = Math.abs(currentDate - new Date(publishedDate));
  const hoursDifference = Math.floor(timeDifference / 3600000);
  const daysDifference = Math.floor(hoursDifference / 24);

  if (hoursDifference < 24) {
    return `${hoursDifference}hr`;
  } else {
    return `${daysDifference} days`;
  }
}

export function sortItems(arr) {
  return arr.sort((a, b) => {
    const dateA = new Date(a.published);
    const dateB = new Date(b.published);
    return dateB - dateA;
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
