//makes sure that the document is loaded before we could try and access every functions of it
if(document.readyState == 'loading'){ 
    document.addEventListener('DOMContentLoaded',ready); //if ga load pa ang page it will wait here before e call ang ready() function
}else{ 
    ready(); //if humana loading ang page
}
//we need to find the class name and use it in a variable to be manipulated
//we set up our event listeners to all items that are already loaded at the very beginning of our document load
function ready() { 
    //for removing the entire row
    var removeCartItemButtons = document.getElementsByClassName('btn-danger');
    console.log(removeCartItemButtons);
    console.log("Number of Cart Item is "+removeCartItemButtons.length);
    for(var i = 0; i < removeCartItemButtons.length; i++){
        var button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem); //remove cart item is the function below, this way the code is much cleaner and is done by just calling the function name
    }
    //for updating the total value per changes
    var quantityInput = document.getElementsByClassName('cart-quantity-input');
    console.log(quantityInput);
    console.log("Number of quantity input is "+quantityInput.length);
    for(var i = 0; i < quantityInput.length; i++){
        var input = quantityInput[i];
        input.addEventListener('change', quantityChanged);
    }
    //for adding an item into the cart
    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    console.log(addToCartButtons);
    console.log("The number of items in the shop is "+addToCartButtons.length);
    for(var i = 0; i < addToCartButtons.length; i++){
        var addButton = addToCartButtons[i];
        addButton.addEventListener('click', addToCartClicked);
    }

    //for making a function for the purchase button ..... [0] means we want to get the first one
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
}

//purchase function
function purchaseClicked(){
    alert('Thank you for your purchase');
    //we want to get into the cart items container
    var cartItems = document.getElementsByClassName('cart-items')[0];
    //while container has children or items within it.. it will continue removing those children starting from the first node
    while(cartItems.hasChildNodes){
        cartItems.removeChild(cartItems.firstChild);
        updateCartTotal(); // i put inside because we want to update everytime a child or item has been removed
    }
}

//removing an entire row along with the remove button
function removeCartItem(event){
    var buttonClicked = event.target; //a function that removes a value.
    buttonClicked.parentElement.parentElement.remove();  //meaning that it goes from the first parent element which is 'class="cart-quantity cart-column"' then goes to that parent element again 'class="cart-item cart-column"' and removes the entire row
    updateCartTotal();
}

//input value does not go below 0 and the minimum input is 1 once the item is on cart
function quantityChanged(event){
    var input = event.target; // since we know that the target of our event is going to be the actual input element that we need
    if(isNaN(input.value) || input.value <= 0){ //NaN is "Not a Number" -- if input is NaN or less than 0
        input.value = 1; // since naa siyas cart the least it could be is 1 for the customer to purchase it!
    }
    updateCartTotal();
}

//add item (title,price,image) into the cart by clicking
function addToCartClicked(event){
    var button = event.target;
    //we only need the image, name of item, price since the quantity is minimum to 1 and remove button will always be there
    var shopItem = button.parentElement.parentElement; // meaning this will be based on the parent of the parent class of the button which is "shop-item" .. shop-item-button > shop-item-details > shop-item
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    addItemToCart(title,price,imageSrc); //function that adds the item into the cart and display it
    updateCartTotal(); // to update the total value
}

function addItemToCart(title,price,imageSrc){
    //we want to add this to the 'cart-items' class which will display the items in a row
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    //this is to make sure that the same item will not occur or not have duplicates in the shopping cart
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for(var i = 0; i < cartItemNames.length; i++){
        if(cartItemNames[i].innerText == title){
            alert('This item is already in the cart!');
            return; // so it will return addToCartClicked() and stop executing the functions down below meaning it will not display the entire row with same title
        }
    }
    //manipulating the entire html data and replacing the cart title,price,image in it
    var cartRowContents = `
    <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${imageSrc}" alt="Cart Item" width="100" height="100">
                    <span class="cart-item-title">${title}</span>
                </div>
                <span class="cart-price cart-column">${price}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" type="number" value="1">
                    <button class="btn btn-danger" role="button">REMOVE</button>
                </div>
    `
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow); //it makes us add it on the last row of the cart-items
    //WE NEED TO HOOK THESE EVENT LISTENERS SINCE THEY WERENT AROUND WHEN WE FIRST LOAD THE PAGE 
    //notice that after we add an item the remove button doesnt work its because function ready() only work as sooon as the document loaded and wala pang new items sa cart
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',removeCartItem);
    //we do the same thing to the quantity input so that once the item is in the cart we can update the total value
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChanged);
}

function updateCartTotal() { // will display total value thru cart-rows meaning per item in a row
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]; // to get inside cart-items container
    var cartRows = cartItemContainer.getElementsByClassName('cart-row'); // to get each row inside cart-items container
    var total = 0;
    for(var i = 0; i < cartRows.length; i++){
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]; // to get the price inside the cart-row container
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]; // getting the quantity value inside cart-row container
        var price = parseFloat(priceElement.innerText.replace("$"," ")); // replacing the $ to empty and parseFloat so that it will turn into a number instead of a string
        var quantity = quantityElement.value; // not inner text because we are getting the value attribute that is inside input element
        total = total + (quantity * price); // use to compute the total value
    }
    //if we want to round it to 2 decimal places Math.round(total * 100) / 100 ...... if 1 decimal place Math.round(total * 10) / 10
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = "$" + total; // displaying total value in the element
}