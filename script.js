console.log("Welcome to Tommy's Beauty Essentials");

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =====================================
// DISCOUNT SYSTEM
// =====================================

let appliedDiscount = 0;
let appliedDiscountCode = "";

const discountCodes = {

    TOMMY10: {
        type: "percentage",
        value: 10,
        minimum: 4500
    },

    GLOW500: {
        type: "fixed",
        value: 500,
        minimum: 0
    },

    WELCOME15: {
        type: "percentage",
        value: 15,
        minimum: 8000
    },

    CLASSIC_GOLD10: {
        type: "percentage",
        value: 15,
        minimum: 4000
    },

    QUEENHELLEN16: {
        type: "percentage",
        value: 15,
        minimum: 4000
    }

};


// =====================================
// FORMAT CURRENCY
// =====================================

function formatCurrency(amount) {
    return "₦" + Number(amount).toLocaleString("en-NG");
}


// =====================================
// ADD TO CART
// =====================================

function addToCart(productName, productPrice) {

    const existingProduct = cart.find(
        item => item.name === productName
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: productName,
            price: Number(productPrice),
            quantity: 1
        });

    }

    saveCart();

   showCartToast(productName); 

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

}


// =====================================
// SAVE CART
// =====================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// =====================================
// DISPLAY CART
// =====================================

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");

    const checkoutBtn =
        document.getElementById("checkoutBtn");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-item">
                <h2>Your cart is empty 🛒</h2>
                <p>Add some beauty essentials to get started.</p>
            </div>
        `;

        if (cartTotal) {
            cartTotal.textContent = "₦0";
        }

        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }

        return;
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }

    let total = 0;

    cart.forEach((item, index) => {

        const subtotal =
            Number(item.price) * Number(item.quantity);

        total += subtotal;

        cartItems.innerHTML += `
            <div class="cart-item">

                <h3>${item.name}</h3>

                <p>
                    Price: ${formatCurrency(item.price)}
                </p>

                <div class="quantity-controls">

                    <button
                        onclick="decreaseQuantity(${index})"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="increaseQuantity(${index})"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>

                <p>
                    <strong>Subtotal:</strong>
                    ${formatCurrency(subtotal)}
                </p>

                <button
                    onclick="removeItem(${index})"
                >
                    🗑 Remove
                </button>

                <hr>

            </div>
        `;

    });

    if (cartTotal) {
        cartTotal.textContent = formatCurrency(total);
    }

}


// =====================================
// CHECKOUT ORDER SUMMARY
// =====================================

function displayCheckoutSummary() {

    const summary =
        document.getElementById("checkout-summary");

    if (!summary) return;

    if (cart.length === 0) {

        summary.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        return;
    }

    let subtotal = 0;
    let summaryHTML = "";

    cart.forEach(item => {

        const itemSubtotal =
            Number(item.price) * Number(item.quantity);

        subtotal += itemSubtotal;

        summaryHTML += `
            <div class="checkout-summary-item">

                <span>
                    ${item.name} × ${item.quantity}
                </span>

                <strong>
                    ${formatCurrency(itemSubtotal)}
                </strong>

            </div>
        `;

    });

    const discount =
        Math.min(appliedDiscount, subtotal);

    const total =
        subtotal - discount;

    summaryHTML += `

        <hr>

        <div class="checkout-summary-item">

            <span>
                Subtotal
            </span>

            <strong>
                ${formatCurrency(subtotal)}
            </strong>

        </div>

    `;

    if (discount > 0) {

        summaryHTML += `

            <div class="checkout-summary-item">

                <span>
                    Discount ${
                        appliedDiscountCode
                            ? `(${appliedDiscountCode})`
                            : ""
                    }
                </span>

                <strong>
                    -${formatCurrency(discount)}
                </strong>

            </div>

        `;

    }

    summaryHTML += `

        <div class="checkout-summary-total">

            <strong>
                Total
            </strong>

            <strong>
                ${formatCurrency(total)}
            </strong>

        </div>

    `;

    summary.innerHTML = summaryHTML;

}


// =====================================
// INCREASE QUANTITY
// =====================================

function increaseQuantity(index) {

    if (!cart[index]) return;

    cart[index].quantity++;

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

}


// =====================================
// DECREASE QUANTITY
// =====================================

function decreaseQuantity(index) {

    if (!cart[index]) return;

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

}


// =====================================
// REMOVE ITEM
// =====================================

function removeItem(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();

}


// =====================================
// CLEAR CART
// =====================================

function clearCart() {

    if (
        confirm(
            "Are you sure you want to clear your cart?"
        )
    ) {

        cart = [];

        appliedDiscount = 0;
        appliedDiscountCode = "";

        saveCart();

        displayCart();
        displayCheckoutSummary();
        updateCartCount();

    }

}


// =====================================
// UPDATE CART COUNT
// =====================================

function updateCartCount() {

    const cartLink =
        document.getElementById("cart-link");

    if (!cartLink) return;

    let count = 0;

    cart.forEach(item => {
        count += Number(item.quantity);
    });

    cartLink.innerHTML =
        `🛒 Cart (${count})`;

}


// =====================================
// CREATE ORDER NUMBER
// =====================================

function generateOrderNumber() {

    const randomNumber =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return (
        "TBE-" +
        new Date().getFullYear() +
        "-" +
        randomNumber
    );

}


// =====================================
// APPLY DISCOUNT
// =====================================

function applyDiscount() {

    const input =
        document.getElementById("discountCode");

    const message =
        document.getElementById("discountMessage");

    if (!input || !message) return;

    const code =
        input.value.trim().toUpperCase();

    if (!code) {

        appliedDiscount = 0;
        appliedDiscountCode = "";

        message.textContent =
            "Please enter a discount code.";

        displayCheckoutSummary();

        return;
    }

    const discount =
        discountCodes[code];

    if (!discount) {

        appliedDiscount = 0;
        appliedDiscountCode = "";

        message.textContent =
            "❌ Invalid discount code.";

        displayCheckoutSummary();

        return;
    }

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            Number(item.price) * Number(item.quantity);

    });

    if (subtotal < discount.minimum) {

        appliedDiscount = 0;
        appliedDiscountCode = "";

        message.textContent =
            `❌ ${code} requires a minimum order of ${formatCurrency(discount.minimum)}.`;

        displayCheckoutSummary();

        return;
    }

    if (discount.type === "percentage") {

        appliedDiscount =
            subtotal * (discount.value / 100);

    } else {

        appliedDiscount =
            discount.value;

    }

    appliedDiscount =
        Math.min(appliedDiscount, subtotal);

    appliedDiscountCode = code;

    message.textContent =
        `✅ ${code} applied! You saved ${formatCurrency(appliedDiscount)}.`;

    displayCheckoutSummary();

}


// =====================================
// PLACE ORDER
// =====================================

function placeOrder(event) {

    event.preventDefault();

    if (cart.length === 0) {

        alert(
            "Your cart is empty. Please add a product before placing an order."
        );

        window.location.href = "cart.html";

        return;
    }


    // CUSTOMER INFORMATION

    const nameInput =
        document.querySelector('input[type="text"]');

    const emailInput =
        document.querySelector('input[type="email"]');

    const phoneInput =
        document.querySelector('input[type="tel"]');

    const textareas =
        document.querySelectorAll("textarea");


    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const email =
        emailInput
            ? emailInput.value.trim()
            : "";

    const phone =
        phoneInput
            ? phoneInput.value.trim()
            : "";

    const address =
        textareas[0]
            ? textareas[0].value.trim()
            : "";

    const notes =
        textareas[1]
            ? textareas[1].value.trim()
            : "";


    // VALIDATION

    if (
        !name ||
        !email ||
        !phone ||
        !address
    ) {

        alert(
            "Please fill in your name, email, phone number and delivery address."
        );

        return;
    }


    // ORDER NUMBER

    const orderNumber =
        generateOrderNumber();


    // CALCULATE ORDER

    let subtotal = 0;

    let orderDetails = "";

    cart.forEach(item => {

        const itemSubtotal =
            Number(item.price) * Number(item.quantity);

        subtotal += itemSubtotal;

        orderDetails +=
            `${item.name} x${item.quantity} - ${formatCurrency(itemSubtotal)}\n`;

    });


    const discountAmount =
        Math.min(
            appliedDiscount,
            subtotal
        );

    const total =
        subtotal - discountAmount;


    // WHATSAPP MESSAGE

    const whatsappMessage =
`🛍️ NEW ORDER - TOMMY'S BEAUTY ESSENTIALS

Order Number: ${orderNumber}

Name: ${name}

Email: ${email}

Phone: ${phone}

Delivery Address:
${address}

Order Notes:
${notes || "None"}

--------------------

ORDER DETAILS:

${orderDetails}
--------------------

SUBTOTAL: ${formatCurrency(subtotal)}

DISCOUNT:
${
    appliedDiscountCode
        ? `${appliedDiscountCode} -${formatCurrency(discountAmount)}`
        : "None"
}

TOTAL: ${formatCurrency(total)}

PAYMENT STATUS: AWAITING PAYMENT

Please confirm payment before processing the order.

Thank you!
`;


    // OPEN WHATSAPP

    const phoneNumber =
        "2349115180053";

    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(
        whatsappURL,
        "_blank"
    );


    // CLEAR CART

    cart = [];

    appliedDiscount = 0;
    appliedDiscountCode = "";

    saveCart();

    displayCart();
    displayCheckoutSummary();
    updateCartCount();


    // SUCCESS MESSAGE

    alert(
        `Order ${orderNumber} has been submitted successfully!`
    );

}


// =====================================
// SEARCH PRODUCTS
// =====================================

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const filter =
        input.value.trim().toLowerCase();

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(product => {

        const title =
            product.querySelector("h3");

        if (!title) return;

        const name =
            title.textContent.toLowerCase();

        product.style.display =
            name.includes(filter)
                ? ""
                : "none";

    });

}


// =====================================
// SORT PRODUCTS
// =====================================

function sortProducts() {

    const sort =
        document.getElementById("sort");

    if (!sort) return;

    const container =
        document.querySelector(".product-container");

    if (!container) return;

    const cards =
        Array.from(
            container.querySelectorAll(".product-card")
        );

    cards.sort((a, b) => {

        const priceElementA =
            a.querySelector(".price");

        const priceElementB =
            b.querySelector(".price");

        const priceA =
            priceElementA
                ? parseInt(
                    priceElementA.textContent
                        .replace(/[₦,A-Za-z ]/g, "")
                )
                : 0;

        const priceB =
            priceElementB
                ? parseInt(
                    priceElementB.textContent
                        .replace(/[₦,A-Za-z ]/g, "")
                )
                : 0;

        const nameA =
            a.querySelector("h3")
                ? a.querySelector("h3").textContent.trim()
                : "";

        const nameB =
            b.querySelector("h3")
                ? b.querySelector("h3").textContent.trim()
                : "";

        switch (sort.value) {

            case "low-high":
                return priceA - priceB;

            case "high-low":
                return priceB - priceA;

            case "a-z":
                return nameA.localeCompare(nameB);

            case "z-a":
                return nameB.localeCompare(nameA);

            default:
                return 0;
        }

    });

    cards.forEach(card => {
        container.appendChild(card);
    });

}


// =====================================
// CONTACT FORM → WHATSAPP
// =====================================

function sendContactMessage(event) {

    event.preventDefault();

    const nameElement =
        document.getElementById("contactName");

    const emailElement =
        document.getElementById("contactEmail");

    const messageElement =
        document.getElementById("contactMessage");

    if (
        !nameElement ||
        !emailElement ||
        !messageElement
    ) {
        return;
    }

    const name =
        nameElement.value.trim();

    const email =
        emailElement.value.trim();

    const message =
        messageElement.value.trim();


    if (!name || !email || !message) {

        alert(
            "Please fill in your name, email and message."
        );

        return;
    }


    const whatsappMessage =
`💬 NEW WEBSITE MESSAGE

Name: ${name}

Email: ${email}

Message:
${message}

--------------------
Sent from Tommy's Beauty Essentials website.
`;


    const phoneNumber =
        "2349115180053";

    const whatsappURL =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(
        whatsappURL,
        "_blank"
    );

}


// =====================================
// MOBILE NAVIGATION
// =====================================

function toggleMenu() {

    const nav =
        document.getElementById("mainNav");

    const overlay =
        document.querySelector(".menu-overlay");

    if (!nav) return;

    nav.classList.toggle("mobile-menu-open");

    if (overlay) {
        overlay.classList.toggle("mobile-menu-open");
    }

}


// =====================================
// LOAD WHEN PAGE OPENS
// =====================================

displayCart();
displayCheckoutSummary();
updateCartCount();
// =====================================
// PREMIUM CART TOAST
// =====================================

function showCartToast(productName) {

    let toast = document.getElementById("cartToast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "cartToast";

        toast.innerHTML = `
            <div class="cart-toast-icon">✓</div>

            <div class="cart-toast-content">
                <strong>Added to cart</strong>
                <span></span>
            </div>

            <a href="cart.html" class="cart-toast-link">
                View cart
            </a>
        `;

        document.body.appendChild(toast);
    }

    toast.querySelector("span").textContent =
        productName;

    toast.classList.remove("show");

    // Restart animation cleanly
    void toast.offsetWidth;

    toast.classList.add("show");

    clearTimeout(window.cartToastTimer);

    window.cartToastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);
}