const userName = document.querySelector(".user");
const loginName = localStorage.getItem('name').trim();
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const overlay = document.getElementById('overlay');
const popUp = document.querySelector(".popUp");
const searchBar = document.querySelector("#search");
const searchBtn = document.querySelector(".searchIcon");
const cartIcon = document.querySelector(".cartDetail");
const cartNumber = document.querySelector(".cartNumber");
const cartPopup = document.querySelector(".cartContainer");
const addedToCartNotification = document.querySelector(".addedToCart");
const checkoutBtn = document.querySelector(".checkoutBtn");
const cartContainer = document.querySelector('.cartItemSection');
const finalPrice = document.querySelector('.finalPrice');
const thankYouPopUp = document.querySelector('.thankYouPopUp');
const thankYouPopUpDetail = document.querySelector('.orderDetail');
const keepBrowsingBtn = document.querySelector('.keepBrowsingBtn');
const mobileNavBar = document.querySelector('.mobile-catagoryNav');
const hamburgerBtn = document.querySelector('.hamburger-btn');
const mobileNavCloseBtn = document.querySelector('.closeNavBtn');

loginName === "" ? userName.innerText = `Welcome Back!` : userName.innerText = `Hello ${capitalizeFirstLetter(loginName)}`
checkoutBtn.classList.add('disable');
let totalItems = 0;
let totalPrice = null;

const fetchListCategories = (() => {
    fetch("https://dummyjson.com/products/categories")
    .then(response => response.json())
    .then(data => {
        const toUpperCase = data.map(catagory => {return catagory.toUpperCase()});
        toUpperCase.forEach(catagory => {
            const catagoryBar = document.querySelector(".catagoryNav");
            const catagoryMobileBar = document.querySelector(".mobileNavCategoryContainer");
            const linkTag = document.createElement("a");
            linkTag.href = "#";
            linkTag.setAttribute("onclick", "getCategory(this)")
            linkTag.innerText = catagory;
            const mobileLinkTag = document.createElement("a");
            mobileLinkTag.href = "#";
            mobileLinkTag.setAttribute("onclick", "getCategory(this)")
            mobileLinkTag.innerText = catagory;
            mobileLinkTag.classList.add('mobile-nav-btn')
            catagoryBar.appendChild(linkTag);
            catagoryMobileBar.appendChild(mobileLinkTag);
        });
    });
})();

const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      console.log(currentIndex)
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

const updatePopUpCard = (title, image, brand, stock, rating, price, des, id) => {
    const popUpContainer = document.querySelector('.popUp');
    popUpContainer.innerHTML = `
        <div class="clostBtnHeader">
            <button class="closeBtn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="popUpLeft">
            <button class="prevImg"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="popUpLeftImg">
                <img class="productImg src="${image}">
            </div>
            <button class="nextImg"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div class="popUpRight">
            <h2 class="productTitle">${title}</h2>
            <h3 class="productBrand">${brand}</h3>
            <p class="productDes">${des}</p>
            <p class="productStock">Stocks Remaining: ${stock}</p>
            <span class="productRating">Rating: ${rating}/5⭐️</span>
            <p class="productPrice">£${price}</p>
            <button id='${id}' class="popUpAddToCartBtn" onclick="updateNumberOfItemsInCart(); loadCartProduct(getProductId(this))">Add To Cart</button>
        </div>`

    const productImg = document.querySelector(".productImg");
    productImg.setAttribute("src", image);
}


const loadProductDetailsForPopup = (id) => {
    fetch(`https://dummyjson.com/products/${id}`)
    .then(response => response.json())
    .then(data => {
        updatePopUpCard(data.title, data.images[0], data.brand, data.stock, data.rating, data.price, data.description, data.id);
        const nextImgBtn = document.querySelector(".nextImg");
        const prevImgBtn = document.querySelector(".prevImg");
        const productImg = document.querySelector(".productImg");
        const imageArray = Object.assign([], data.images);
        let arrayNum = 0

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
    checkoutBtn.classList.remove('disable');
    checkoutBtn.classList.add('active');
    totalItems++;
    cartNumber.innerText = totalItems;
    addedToCartNotification.classList.add('active');
    setTimeout(() => {
        addedToCartNotification.classList.remove('active');
    }, 1000);
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
    overlay.classList.remove('active');
    mobileNavBar.classList.remove('is-active');
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

const createCartCard = (title, image, price, id) => {
    const cartCard = document.createElement('div')
    
    cartCard.classList.add('cartCard')

    cartCard.innerHTML = `<div class="cartCardId" hidden>${id}</div>
                          <div class="cartCardImg">
                            <img class="cartProductsImg" src="${image}">
                          </div>
                          <div class="cartCardDetail">
                            <h3 class="cartCartProduct">${title}</h3>
                            <span class="cartPrice">£<span>${price}</span>/ Unit</span>
                            <div class="quantityContainer">
                                <button class="quantityBtn quantityMinus">-</button>
                                <span class="quantity">1</span>
                                <button class="quantityBtn quantityPlus">+</button>
                                <a class="deleteBtn"><img src="./assets/trash-bin.png" alt="delete icon" width="30px"></a>
                            </div>
                          </div>`
    cartContainer.appendChild(cartCard);
}

const loadProductDetailFromCart = (porductSet) => {
    porductSet.forEach(product => {
        product.addEventListener('click', () => {
            cartPopup.classList.remove('active')
            loadProductDetailsForPopup(parseInt(product.parentElement.parentElement.children[0].innerText))
        })
    })
}

const loadCartProduct = (id) => {
    fetch(`https://dummyjson.com/products/${id}`)
    .then(response => response.json())
    .then(data => {
        let allCartCardContainer = document.querySelectorAll('.cartCardId')
        let renderCard = false;
        if (allCartCardContainer.length === 0) {
            createCartCard(data.title, data.images[0], data.price, data.id)
        } else {
            for (let container of allCartCardContainer) {
                if (container.innerText == id) {
                    let elementQuantity = parseInt(container.parentElement.children[2].children[2].children[1].innerText)
                    container.parentElement.children[2].children[2].children[1].innerText = elementQuantity += 1;
                    renderCard = false;
                    break
                } else {
                    renderCard = true;
                }
                
            }
        }

        if (renderCard) createCartCard(data.title, data.images[0], data.price, data.id)

        allCartCardContainer = document.querySelectorAll('.cartCardId')
        totalPrice = 0;
        allCartCardContainer.forEach(container => {
            let itemPrice = parseInt(container.parentElement.children[2].children[1].children[0].innerText)
            let elementQuantity = parseInt(container.parentElement.children[2].children[2].children[1].innerText)
            totalPrice += itemPrice * elementQuantity;
            finalPrice.innerText = totalPrice;
        })
        
        let increaseBtn = document.querySelectorAll('.quantityPlus');

        increaseBtn.forEach((increase) => {
            increase.onclick = () => {
                let quantity = parseInt(increase.parentElement.parentElement.children[2].children[1].innerText);
                totalItems += 1
                cartNumber.innerText = totalItems;
                increase.parentElement.parentElement.children[2].children[1].innerText = quantity += 1
                let increaseCardPrice = parseInt(increase.parentElement.parentElement.children[1].children[0].innerText)
                totalPrice += increaseCardPrice;
                finalPrice.innerText = totalPrice;
            }
        })

        let decreaseBtn = document.querySelectorAll('.quantityMinus');

        decreaseBtn.forEach((decrease) => {
            decrease.onclick = () => {
                let quantity = parseInt(decrease.parentElement.parentElement.children[2].children[1].innerText);
                if (quantity > 1) {
                    totalItems -= 1
                    cartNumber.innerText = totalItems;
                    decrease.parentElement.parentElement.children[2].children[1].innerText = quantity -= 1
                    let decreaseCardPrice = parseInt(decrease.parentElement.parentElement.children[1].children[0].innerText)
                    totalPrice -= decreaseCardPrice;
                    finalPrice.innerText = totalPrice;
                }
            }
        })

        let deleteBtns = document.querySelectorAll('.deleteBtn');

        deleteBtns.forEach((oneDeleteBtn) => {
        oneDeleteBtn.onclick = () => {
            let quantity = parseInt(oneDeleteBtn.parentElement.parentElement.children[2].children[1].innerText);
            let cardItemPrice = parseInt(oneDeleteBtn.parentElement.parentElement.children[1].children[0].innerText)
            totalItems -= quantity
            cartNumber.innerText = totalItems;
            oneDeleteBtn.parentElement.parentElement.parentElement.remove() 
            totalPrice -= cardItemPrice * quantity;
            finalPrice.innerText = totalPrice;
            if (totalPrice === 0 || totalPrice === null) {
                checkoutBtn.classList.remove('active');
                checkoutBtn.classList.add('disable');
            }
        }
        })

        const cartProducts = document.querySelectorAll(".cartCartProduct")
        loadProductDetailFromCart(cartProducts)

        const cartProductsImg = document.querySelectorAll(".cartProductsImg")
        loadProductDetailFromCart(cartProductsImg)
    })
}

const clearCart = () => {
    if (totalPrice === 0 || totalPrice === null) {
        checkoutBtn.classList.remove('active');
        checkoutBtn.classList.add('disable');
    } else {
        thankYouPopUpDetail.innerText = `Your order of ${totalItems} ${(totalItems > 1 ? "items":"item")} with total of £${totalPrice}`
        totalItems = 0;
        cartContainer.innerHTML = "";
        cartNumber.innerText = totalItems;
        totalPrice = 0;
        finalPrice.innerText = totalPrice;
        cartPopup.classList.remove('active');
        thankYouPopUp.classList.add('active');
        checkoutBtn.classList.remove('active');
        checkoutBtn.classList.add('disable');
    }
    
}

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

cartIcon.addEventListener('click', () => {
    cartPopup.classList.add('active');
    overlay.classList.add('active');

    const closeCartBtn = document.querySelector(".closeCartBtn");
    closeCartBtn.addEventListener('click', () => {
        cartPopup.classList.remove('active');
        overlay.classList.remove('active');
    })

    overlay.addEventListener('click', () => {
        cartPopup.classList.remove('active');
        overlay.classList.remove('active');
        thankYouPopUp.classList.remove('active');
    })
})

checkoutBtn.addEventListener('click', () => {
    clearCart()
})

keepBrowsingBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    thankYouPopUp.classList.remove('active');
    loadDefault();
})

hamburgerBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    mobileNavBar.classList.add('is-active');
})

mobileNavCloseBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    mobileNavBar.classList.remove('is-active');
})

overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
    mobileNavBar.classList.remove('is-active');
})


//Removes Animation on loading the page
setTimeout(function(){
    document.body.className="";
},500);