const fetchListCategories = (() => {
    fetch("https://dummyjson.com/products/categories")
    .then(response => response.json())
    .then(data => {
        const toUpperCase = data.map(catagory => {return catagory.toUpperCase()});
        console.log(toUpperCase)
        toUpperCase.forEach(catagory => {
            const catagoryBar = document.querySelector(".catagoryNav");
            const linkTag = document.createElement("a");
            linkTag.href = "#";
            linkTag.setAttribute("onclick", "getCategory(this)")
            linkTag.innerText = catagory;
            catagoryBar.appendChild(linkTag);
        });
    });
})();

const loadDefault = () => {
    fetch(`https://dummyjson.com/products`)
    .then(response => response.json())
    .then(data => {
        data.products.forEach(item => {
            createCard(item.title, item.images[0], item.category, item.rating, item.price, item.description)
        })
    });
};

loadDefault();

const createCard = (title, image, category, rating, price, des) => {
    const container = document.createElement("div");
    container.classList.add("productCard");
    container.innerHTML = `<div class="productImageContainer">
                                <img src="${image}">
                            </div>
                            <h2>${title}</h2>
                            <h3>${category}</h3>
                            <p hidden>${des}</p>
                            <span class="rating">${rating}/5 ⭐️</span>
                            <span class="price">£${price}</span>
                            <button>Add to cart</button>`
    document.querySelector(".selection").appendChild(container);
}

const clearPage = () => {
    document.querySelector(".selection").innerHTML = "";
}


const fetchCategory = (category) => {
    fetch(`https://dummyjson.com/products/category/${category}`)
    .then(response => response.json())
    .then(data => {
        data.products.forEach(item => {
            createCard(item.title, item.images[0], item.category, item.rating, item.price, item.description)
        })
    });
}

const getCategory = (category) => {
    let categoryName = category.innerText;
    clearPage();
    fetchCategory(categoryName);
}

