const fetchCatagories = () => {
    fetch("https://dummyjson.com/products/categories")
    .then(response => response.json())
    .then(data => {
        const toUpperCase = data.map(catagory => {return catagory.toUpperCase()});
        console.log(toUpperCase)
        toUpperCase.forEach(catagory => {
            const catagoryBar = document.querySelector(".catagoryNav");
            const linkTag = document.createElement("a");
            linkTag.href = "#";
            linkTag.innerText = catagory;
            catagoryBar.appendChild(linkTag);
        });
    });
}

fetchCatagories();

const createCard = (title, image, catagory, rating, price) => {
    const container = document.createElement("div");
    container.classList.add("productCard");
    container.innerHTML = `<img src="${image}">
                            <h2>${title}</h2>
                            <h3>${catagory}</h3>
                            <span class="rating">${rating}/5 ⭐️</span>
                            <span class="price">£${price}</span>
                            <button>Add to cart</button>`
}