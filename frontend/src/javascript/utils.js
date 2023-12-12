export function sortItems(arr) {
  return arr.sort((a, b) => {
    const dateA = new Date(a.published);
    const dateB = new Date(b.published);
    return dateB - dateA;
  });
}

export function stripHtmlTags(htmlString) {
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}

export function getUniqueItems(existingItems, newItems) {
  const uniqueItems = [...existingItems];

  newItems.forEach((newItem) => {
    if (!uniqueItems.find((item) => item.rssId === newItem.rssId)) {
      uniqueItems.push(newItem);
    }
  });

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
