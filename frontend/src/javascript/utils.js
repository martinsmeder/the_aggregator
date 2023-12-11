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
