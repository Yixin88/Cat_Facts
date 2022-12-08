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