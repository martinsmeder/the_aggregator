export function stripHtmlTags(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}

export function getUniqueItems(existingItems, newItems) {
  // Copy the existing items to a new array
  const uniqueItems = [...existingItems];

  // Loop through the new items
  newItems.forEach((newItem) => {
    // Check if the new item's ID already exists in the unique items array
    if (!uniqueItems.find((item) => item.rssId === newItem.rssId)) {
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

export function sortFeedItems(arr) {
  return arr.sort((a, b) => {
    const dateA = new Date(a.published);
    const dateB = new Date(b.published);
    return dateB - dateA;
  });
}

export function sortJobItems(arr) {
  return arr.sort((a, b) => {
    const dateA = new Date(`${a.year}-${a.month}-01`);
    const dateB = new Date(`${b.year}-${b.month}-01`);
    return dateA - dateB;
  });
}

export function getChartData(arr) {
  // Use the reduce method to transform the array into an object
  return arr.reduce((acc, item) => {
    // Generate a unique key for each combination of month and year
    const key = `${item.month}-${item.year}`;

    // Initialize the entry for the key in the accumulator or use an existing
    // entry
    acc[key] = acc[key] || { name: key };

    // Store the count of each item name within its respective month-year
    // entry
    acc[key][item.name] = item.count;

    // Return the updated accumulator
    return acc;
  }, {});
}
