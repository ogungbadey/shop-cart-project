if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  // get all the remove buttons from the cart
  // add eventlistener
  let cartItemBtns = document.querySelectorAll(".btn-danger");
  cartItemBtns.forEach(button => {
    button.addEventListener("click", removeCartItem);
  });

  // adding eventlisteners to the quantity input
  let quantityInputs = document.querySelectorAll(".cart-quantity-input");
  quantityInputs.forEach(input => {
    input.addEventListener("change", quantityChanged);
  });

  // get all the add to cart buttons
  // add eventlistener
  let addItemToCartBtns = document.querySelectorAll(".shop-item-button");
  addItemToCartBtns.forEach(button => {
    button.addEventListener("click", addToCartClicked);
  });

  // event listener for click purchase
  let purchaseButton = document.querySelector(".btn-purchase");
  purchaseButton.addEventListener("click", makePurchase);

  let searchBar = document.getElementById("search-bar");
  searchBar.addEventListener("keyup", filterItems);

  // close modal
  let closeBtn = document.querySelector(".closeBtn");
  let modal = document.getElementById("simpleModal");
  closeBtn.addEventListener("click", closeModal);

  function closeModal() {
    modal.style.display = "none";
  }

  // close modal on click outside modal content
  window.addEventListener("click", e => {
    if (e.target.classList.contains("modal")) {
      modal.style.display = "none";
    }
  });
}

// makes the final purchase
function makePurchase() {
  let cartItems = document.querySelector(".cart-items");
  let cartRows = cartItems.querySelectorAll(".cart-row");
  let cartTotal = document.querySelector(".cart-total-price").textContent;
  console.log(cartTotal);

  let cartArray = [];
  cartRows.forEach(item => cartArray.push(item));
  // check if cart is empty
  if (cartItems.innerHTML == "") {
    alert("empty cart");
    return;
  }

  // check if cart has items that can be purchased
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }

  updateCartTotal();
  displayModal(cartArray, cartTotal);
}

function displayModal(array, total) {
  let modal = document.getElementById("simpleModal");
  modal.style.display = "block";
  let modalItems = modal.querySelector(".modal-items");
  let modalTotal = modal.querySelector(".total");
  modalTotal.nextSibling.textContent = total;
  for (let index = 0; index < array.length; index++) {
    let div = document.createElement("div");
    div.classList.add("modal-item");
    item = array[index];
    let image = item.querySelector(".cart-item-image").src;
    let price = item.querySelector(".cart-price").textContent;
    let quantity = item.querySelector(".cart-quantity-input").value;
    console.log(price, quantity, image);
    let content = `
      <img class="cart-item-image" src="${image}" width="100" height="100" />
      <div class="modal-body">
        <p class="">Price: ${price}</p>
        <p class="">Quantity: ${quantity}</p>
      </div>`;
    div.innerHTML = content;
    modalItems.append(div);
  }
}
// function for handling click event on add to cart buttons
function addToCartClicked(e) {
  let target = e.target;
  let shopItem = target.parentElement.parentElement;
  let title = shopItem.querySelector(".shop-item-title").textContent;
  let price = shopItem.querySelector(".shop-item-price").textContent;
  let image = shopItem.querySelector(".shop-item-image").src;

  //add items to the cart
  addItemToCart(price, title, image);
  updateCartTotal();
}

// Function responsible for populating cart with selected items
function addItemToCart(price, title, image) {
  let cartItemContainer = document.querySelector(".cart-items");
  let cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  let cartItemNames = document.getElementsByClassName("cart-item-title");
  for (let index = 0; index < cartItemNames.length; index++) {
    if (cartItemNames[index].textContent == title) {
      alert("Item has been added to the cart");
      return;
    }
  }

  let cartRowContent = `
  <div class="cart-item cart-column">
    <img class="cart-item-image" src="${image}" width="100" height="100" />
    <span class="cart-item-title">${title}</span>
  </div>
  <span class="cart-price cart-column">${price}</span>
  <div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1" />
    <button class="btn btn-danger" type="button">REMOVE</button>
  </div>`;
  cartRow.innerHTML = cartRowContent;
  cartItemContainer.append(cartRow);
  cartRow.querySelector(".btn-danger").addEventListener("click", removeCartItem);
  cartRow.querySelector(".cart-quantity-input").addEventListener("change", quantityChanged);
}

// handles changes to the quantity input elelment
function quantityChanged(e) {
  let target = e.target;
  if (isNaN(target.value) || target.value <= 0) {
    target.value = 1;
  }
  updateCartTotal();
}

function removeCartItem(e) {
  let target = e.target;
  target.parentElement.parentElement.remove();
  updateCartTotal();
}

// this function is responsible for updating the total price of items in the cart
function updateCartTotal() {
  let cartItemContainer = document.querySelector(".cart-items");
  let cartRows = cartItemContainer.querySelectorAll(".cart-row");
  let total = 0;
  cartRows.forEach(row => {
    let priceElement = row.querySelector(".cart-price");
    let quantityElement = row.querySelector(".cart-quantity-input");
    let price = parseFloat(priceElement.textContent.slice(1));
    let quantity = parseInt(quantityElement.value);
    total = total + price * quantity;
    // console.log(price, typeof quantity, total);
  });
  total = Math.round(total * 100) / 100;
  document.querySelector(".cart-total-price").textContent = `$${total}`;
}

// used to search the shop items
function filterItems(e) {
  let itemArrays = [];
  let filterInput = e.target.value.toUpperCase();
  // console.log(filterInput);
  let shopItems = document.querySelectorAll(".shop-items");
  let musicitems = shopItems[0].querySelectorAll(".shop-item-title");
  let merchitems = shopItems[1].querySelectorAll(".shop-item-title");

  for (let index = 0; index < musicitems.length; index++) {
    let musicTitles = musicitems[index];
    if (musicTitles.textContent.toUpperCase().indexOf(filterInput) > -1) {
      musicTitles.parentElement.style.display = "block";
    } else {
      musicTitles.parentElement.style.display = "none";
    }
  }

  for (let index = 0; index < merchitems.length; index++) {
    let merchTitles = merchitems[index];
    if (merchTitles.textContent.toUpperCase().indexOf(filterInput) > -1) {
      merchTitles.parentElement.style.display = "block";
    } else {
      merchTitles.parentElement.style.display = "none";
    }
  }

  // let shopItem = shopItems.querySelectorAll(".shop-item");
  // console.log(shopItem);

  // let itemTitle = shopItems.querySelectorAll(".shop-item-title");
  // console.log(itemTitle[1]);
}
