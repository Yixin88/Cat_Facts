const userName = document.querySelector(".user");
const loginName = localStorage.getItem('name');
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
userName.innerText = `Hello ${capitalizeFirstLetter(loginName)}`;
let totalItems = 0;

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

const shuffleArray = (array) => {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

const createCard = (title, image, category, rating, price, des, id) => {
    const container = document.createElement("div");
    container.classList.add("productCard");
    container.innerHTML = `<div class="productImageContainer">
                                <img src="${image}">
                            </div>
                            <h2>${title}</h2>
                            <h3>${category}</h3>
                            <p hidden>${des}</p>
                            <span hidden class="productId">${id}</span>
                            <span class="rating">${rating}/5 ⭐️</span>
                            <span class="price">£${price}</span>
                            <button class="addToCartBtn">Add to cart</button>`
    document.querySelector(".selection").appendChild(container);
}

const clearPage = () => {
    document.querySelector(".selection").innerHTML = "";
}

const loadDefault = () => {
    fetch(`https://dummyjson.com/products?limit=100`)
    .then(response => response.json())
    .then(data => {
        clearPage();
        const productsArray = data.products;
        const numberOfItems = 24;
        const shuffledArray = shuffleArray(productsArray).slice(0, numberOfItems);
        shuffledArray.forEach(item => {
            createCard(item.title, item.images[0], item.category, item.rating, item.price, item.description, item.id)
        })
    });
};

loadDefault();

const updateNumberOfItemsInCart = () => {
    const cartNumber = document.querySelector(".cartNumber");
    const addToCartBtn = document.querySelectorAll(".addToCartBtn");
    addToCartBtn.forEach(button => {
        button.addEventListener('click', () => {
            totalItems++;
            cartNumber.innerText = totalItems;
        })
    })
}

setTimeout(updateNumberOfItemsInCart, 1000);

const fetchCategory = (category) => {
    fetch(`https://dummyjson.com/products/category/${category}`)
    .then(response => response.json())
    .then(data => {
        data.products.forEach(item => {
            createCard(item.title, item.images[0], item.category, item.rating, item.price, item.description, item.id)
        });
        setTimeout(updateNumberOfItemsInCart, 500);
    });
}

const getCategory = (category) => {
    let categoryName = category.innerText;
    clearPage();
    fetchCategory(categoryName);
}

