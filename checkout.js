const shippingRate = 15.0;
const taxRate = 0.18;
const discountRate = 0.7;

let products = [];

renderAllProducts();
calculateCardTotal();

document.querySelector("form").addEventListener("submit", addProduct);

function addProduct(e) {
    e.preventDefault();
    const prodName = document.querySelector("#add-name").value;
    const prodPrice = document.querySelector("#add-price").value;
    const prodQty = document.querySelector("#add-quantity").value;
    const prodImg = document.querySelector("#add-image").value;

    const newProd = {
        name: prodName,
        price: Number(prodPrice),
        qty: Number(prodQty),
        img: prodImg,
    };

    products.push(newProd);

    document.querySelector("form").reset();

    renderProduct(newProd);
    calculateCardTotal();

}

function renderProduct(product) {
    
    const productList = document.querySelector("#product-panel");

    const {name, price, qty, img} = product;

    const div = document.createElement("div");

    div.className = "card shadow mb-3";
    div.innerHTML = `
        <div class="row">
            <div class="col-md-4">
                <img src="${img}" alt="" class="w-100 h-100 rounded-start">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title"> ${name} </h5>
                    <div class="product-price">
                        <p class="text-warning h4" >$ 
                            <span class="discount-price"> ${(
                            price * discountRate
                            ).toFixed(2)}</span>
                            <span class="text-dark text-decoration-line-through">${price.toFixed(
                            2
                            )}</span>
                        </p>
                    </div>
                    <div class="border border-1 border-dark shadow d-flex justify-content-center p-2">
                    <div class="quantity-controller">
                        <button class="btn btn-secondary btn-sm">
                            <i class="fa-solid fa-minus"></i>
                        </button>

                        <p class="d-inline mx-4 h6" id="product-quantity">${qty} </p>
                        <button class="btn btn-secondary btn-sm">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    </div>

                    <div class="product-removal mt-4">
                        <button class="btn btn-danger btn-sm w-100 remove-product">
                            <i class="fa-solid fa-trash-can"></i>
                            Remove
                        </button>
                    </div>

                    <div class="mt-2">
                        Product Total: $ <span class="product-line-price">
                        ${(price * discountRate * qty).toFixed(2)} 
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;

    productList.appendChild(div);
    createEventsRemoveBtns();
    createEventsQuantityBtns();
};

function renderAllProducts() {

    products.forEach((product) => {
        renderProduct(product);
    });

    createEventsRemoveBtns();
    createEventsQuantityBtns();
};

function remove(btn) {
    btn.closest('.card').remove();

    const productName = btn.closest('.card').querySelector('.card-title').textContent;

    products = products.filter(prod => prod.name != productName);
    calculateCardTotal();
}

function createEventsRemoveBtns() {
    console.log('Attach event listeners');
    const removeBtns = document.querySelectorAll('.remove-product');
    console.log(removeBtns);
    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            remove(btn)
        })
    })
};

function calculateCardTotal() {
    const productTotal = document.querySelectorAll('.product-line-price');

    const subtotal = Array.from(productTotal).reduce((acc, item) => acc + Number(item.textContent), 0);
    const taxPrice = subtotal * taxRate;
    const shipping = subtotal > 0 ? shippingRate : 0;
    const total = subtotal + taxPrice + shipping;

    document.querySelector('.subtotal').textContent = subtotal.toFixed(2);
    document.querySelector('.tax').textContent = taxPrice.toFixed(2);
    document.querySelector('.shipping').textContent = shipping.toFixed(2);
    document.querySelector('.total').textContent = total.toFixed(2);

};

function createEventsQuantityBtns() {
    const qtyDivs = document.querySelectorAll('.quantity-controller');
    qtyDivs.forEach(div => {
        const minusBtn = div.firstElementChild;
        let amount = div.querySelector('#product-quantity');
        minusBtn.addEventListener('click', () => {
            amount.textContent = Number(amount.textContent) - 1;
            if(amount.textContent == '0') {
                alert('Product will be removed');
                remove(minusBtn);
            };
            updateTotal(amount);
        });

        const plusBtn = div.lastElementChild;
        plusBtn.addEventListener('click', () => {
            amount.textContent = Number(amount.textContent) + 1;
            updateTotal(amount);
        });
    });
};

function updateTotal(amount) {
    const name = amount.closest('.row').querySelector('.card-title');
    products.forEach(product => {
        if(product.name === name.textContent) {
            product.amount = Number(amount.textContent);
        };
    });

    const price = amount.closest('.row').querySelector('.discount-price');
    const productTotal = amount.closest('.row').querySelector('.product-line-price');
    productTotal.textContent = (number(price.textContent) * Number(amount.textContent)).toFixed(2);

    calculateCardTotal();
};