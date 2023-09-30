function renderItems(querySnapshot) {
  const itemContainer = document.getElementById("itemContainer");
  itemContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const item = doc.data();
    const itemElement = document.createElement("div");
    itemElement.innerHTML = `
        <div>
          <h3>${item.title}</h3>
          <p>Date: ${item.date}</p>
          <p>${item.description}</p>
          <p>Source: ${item.source}</p>
          <a href="${item.url}" target="_blank">Read more</a>
        </div>
        <hr>
      `;

    itemContainer.appendChild(itemElement);
  });
}

export default renderItems;
