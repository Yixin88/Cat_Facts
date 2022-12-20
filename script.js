const userName = document.querySelector(".user");
const loginName = localStorage.getItem('name').trim();
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const overlay = document.getElementById('overlay');
const popUp = document.querySelector(".popUp");
const searchBar = document.querySelector("#search");
const searchBtn = document.querySelector(".searchIcon");

loginName === "" ? userName.innerText = `Welcome Back!` : userName.innerText = `Hello ${capitalizeFirstLetter(loginName)}`
let totalItems = 0;
let totalPrice = 0;

const fetchListCategories = (() => {
    fetch("https://dummyjson.com/products/categories")
    .then(response => response.json())
    .then(data => {
        const toUpperCase = data.map(catagory => {return catagory.toUpperCase()});
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
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

const getProductId = (item) => item.getAttribute("id");

const createCard = (title, image, category, rating, price, des, id) => {
    const container = document.createElement("div");
    container.classList.add("productCard");
    container.setAttribute("id", id);
    container.setAttribute("data-popup-target", "#popUp");
    container.innerHTML = `<div class="productImageContainer">
                                <img class="thumbnail" id="${id}" onclick="loadProductDetailsForPopup(getProductId(this))" src="${image}">
                            </div>
                            <h2 class="title" id="${id}" onclick="loadProductDetailsForPopup(getProductId(this))">${title}</h2>
                            <h3>${capitalizeFirstLetter(category)}</h3>
                            <span hidden class="productId">${id}</span>
                            <span class="rating">${rating}/5 ⭐️</span>
                            <span class="price">£${price}</span>
                            <button id='${id}' class="addToCartBtn" onclick="updateNumberOfItemsInCart(); loadCartProduct(getProductId(this))">Add to cart</button>`
    document.querySelector(".selection").appendChild(container);
}

const updatePopUpCard = (title, image, brand, stock, rating, price, des) => {
    const popUpContainer = document.querySelector('.popUp');
    popUpContainer.innerHTML = `
        <div class="clostBtnHeader">
            <button class="closeBtn">&times;</button>
        </div>
        <div class="popUpLeft">
            <button class="prevImg">&#10094;</button>
            <div class="popUpLeftImg">
                <img class="productImg src="${image}">
            </div>
            <button class="nextImg">&#10095;</button>
        </div>
        <div class="popUpRight">
            <h2 class="productTitle">${title}</h2>
            <h3 class="productBrand">${brand}</h3>
            <p class="productDes">${des}</p>
            <p class="productStock">Stocks Remaining: ${stock}</p>
            <span class="productRating">Rating: ${rating}/5⭐️</span>
            <p class="productPrice">£${price}</p>
            <button class="popUpAddToCartBtn" onclick="updateNumberOfItemsInCart()">Add To Cart</button>
        </div>`

    const productImg = document.querySelector(".productImg");
    productImg.setAttribute("src", image);
}


const loadProductDetailsForPopup = (id) => {
    fetch(`https://dummyjson.com/products/${id}`)
    .then(response => response.json())
    .then(data => {
        updatePopUpCard(data.title, data.images[0], data.brand, data.stock, data.rating, data.price, data.description);
        const nextImgBtn = document.querySelector(".nextImg");
        const prevImgBtn = document.querySelector(".prevImg");
        const productImg = document.querySelector(".productImg");
        const imageArray = Object.assign([], data.images);
        let arrayNum = 0
        console.log('clicks')

        nextImgBtn.addEventListener('click', () => {
            if (arrayNum < imageArray.length -1) arrayNum++
            else arrayNum = 0
            productImg.setAttribute("src", "");
            productImg.setAttribute("src", imageArray[arrayNum]);
        })

        prevImgBtn.addEventListener('click', () => {
            if (arrayNum < imageArray.length && arrayNum > 0) arrayNum--
            else arrayNum = imageArray.length -1
            productImg.setAttribute("src", "");
            productImg.setAttribute("src", imageArray[arrayNum]);
        })

        document.querySelector(".popUp").classList.add("active");
        overlay.classList.add('active');
        closePopup();
        arrayNum = 0;
    })
}

const clearPage = () => {
    document.querySelector(".selection").innerHTML = "";
}

const closePopup = () => {
    const closeBtn = document.querySelector(".closeBtn");
    closeBtn.addEventListener('click', () => {
        popUp.classList.remove('active');
        overlay.classList.remove('active');
    })

    overlay.addEventListener('click', () => {
        popUp.classList.remove('active');
        overlay.classList.remove('active');
    })
}

const updateNumberOfItemsInCart = (event) => {
    const cartNumber = document.querySelector(".cartNumber");
    totalItems++;
    cartNumber.innerText = totalItems;
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
    })
};

loadDefault();

const fetchCategory = (category) => {
    fetch(`https://dummyjson.com/products/category/${category}`)
    .then(response => response.json())
    .then(data => {
        data.products.forEach(item => {
            createCard(item.title, item.images[0], item.category, item.rating, item.price, item.description, item.id)
        });
    })
}

const getCategory = (category) => {
    let categoryName = category.innerText;
    clearPage();
    fetchCategory(categoryName);
}

const searchProduct = (product) => {
    fetch(`https://dummyjson.com/products/search?q=${product}`)
        .then(res => res.json())
        .then(item => {
            clearPage();
            const productsArray = item.products;
            productsArray.forEach(item => {
                createCard(item.title, item.images[0], item.category, item.rating, item.price, item.description, item.id)
            })
        }); 
}

const createCartCard = (title, image, price) => {
    const cartContainer = document.querySelector('.cartItemSection')
    const cartCard = document.createElement('div')
    const increaseBtn = document.querySelector('.quantityPlus')
    cartCard.classList.add('cartCard')



    cartCard.innerHTML = `<div class="cartCardImg">
                            <img src="${image}">
                          </div>
                          <div class="cartCardDetail">
                            <h3>${title}</h3>
                            <span class="cartPrice">£${price} / Unit</span>
                            <div class="quantityContainer">
                                <button class="quantityBtn quantityMinus">-</button>
                                <span class="quantity">1</span>
                                <button class="quantityBtn quantityPlus">+</button>
                                <img src="./assets/trash-bin.png" alt="delete icon" width="30px">
                            </div>
                          </div>`
    cartContainer.appendChild(cartCard);
}

const getQuantity = (num) => {
    console.log(num);
}

const loadCartProduct = (id) => {
    fetch(`https://dummyjson.com/products/${id}`)
    .then(response => response.json())
    .then(data => {
        const finalPrice = document.querySelector('.finalPrice');
        createCartCard(data.title, data.images[0], data.price)
        totalPrice += data.price;
        finalPrice.innerText = totalPrice;
        console.log()
    })
}

const increaseQuantity = (num) => {
    let quantity = num;

}

// function onClick(yes) {
//     var li = e.currentTarget;
//     var span = li.querySelector('.price');
//     console.log(span.innerText);
// }

searchBtn.addEventListener('click', () => {
    if (searchBar.value == "") {
        loadDefault();
    }
    searchProduct(searchBar.value);
});

searchBar.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        searchBtn.click();
        if(event.which==13||event.keyCode==13){
            this.blur();
        }
    }
});


//Removes Animation on loading the page
setTimeout(function(){
    document.body.className="";
},500);