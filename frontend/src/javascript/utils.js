export default function sortItems(arr) {
  return arr.sort((a, b) => {
    const dateA = new Date(a.published);
    const dateB = new Date(b.published);
    return dateB - dateA;
  });
}
