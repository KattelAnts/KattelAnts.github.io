//Selectors
const itemInput = document.querySelector("#item-input");
const amount = document.querySelector("#amount-input");
const price = document.querySelector("#price-input");
const shoppingList = document.querySelector(".shopping-list");
const addButton = document.querySelector("#add-btn");
const totalPar = document.querySelector('#total-par');

//Event Listener
document.addEventListener("DOMContentLoaded", getLocalSave);
addButton.addEventListener("click", addItem);
shoppingList.addEventListener("click", deleteCheck);


//Functions

function addItem(event) {
    event.preventDefault();
    if (itemInput.value != "" & amount.value != "" & price.value != "") {
    //Shopping DIV
    const shoppingDiv = document.createElement("div");
    shoppingDiv.classList.add('shopping');
    //Create LI
    const newItem = document.createElement("li");
    newItem.innerText = itemInput.value + " x " + amount.value;
    newItem.classList.add("shopping-item");
    shoppingDiv.appendChild(newItem);
    //ADD PRICE
    const itemPrice = document.createElement("p");
    itemPrice.innerText = price.value * amount.value + " €";
    itemPrice.classList.add("item-price");
    shoppingDiv.appendChild(itemPrice);
    //CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
    completedButton.className += "btn btn-success";
    completedButton.setAttribute('id', "complete-btn");
    shoppingDiv.appendChild(completedButton);
    //REMOVE BUTTON
    const removeButton = document.createElement("button");
    removeButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    removeButton.className += "btn btn-danger";
    removeButton.setAttribute('id', "remove-btn");
    shoppingDiv.appendChild(removeButton);
    //APPEND TO LIST
    shoppingList.appendChild(shoppingDiv);
    //Update TOTAL
    updateTotal();
    //Save to local storage
        saveLocalShopping(itemInput.value, 'Items');
        saveLocalShopping(amount.value, 'Amounts');
        saveLocalShopping(price.value, 'Prices');
    //Clear input values
    itemInput.value = "";
    amount.value = "";
    price.value = "";
    }
}

function updateTotal() {
    var prices = document.getElementsByClassName("item-price");
    var total = 0;
    for (var i=0; i < prices.length; i++) {
        total += parseFloat(prices[i].innerText);
    }
    total = Math.round((total + Number.EPSILON) * 100) / 100;

    totalPar.innerHTML = 'Total = ' + total + ' €';
}

function deleteCheck(event) {
    const item = event.target;
    //DELETE item
    if(item.className === "btn btn-danger") {
        const toDel = item.parentElement;
        toDel.classList.add("fall");
        removeLocalSave(toDel);
        toDel.addEventListener('transitionend', function(){
            toDel.remove();
            updateTotal();
        });
        
    }
    //Toggle item completed
    if(item.className === "btn btn-success") {
        const toCompl = item.parentElement;
        toCompl.classList.toggle('completed');
    }
}

function saveLocalShopping(Item, Arrayname) {
    //CHECK
    let Items;
    if(localStorage.getItem(Arrayname) === null) {
        Items = [];
    }else{
        Items = JSON.parse(localStorage.getItem(Arrayname));
    }
    Items.push(Item);
    localStorage.setItem(Arrayname, JSON.stringify(Items));
}

function getLocalSave(){
    let items;
    let amounts;
    let prices;
    if(localStorage.getItem('Items') === null) {
        items = [];
    }else{
        items = JSON.parse(localStorage.getItem('Items'));
    }
    if(localStorage.getItem('Amounts') === null) {
        amounts = [];
    }else{
        amounts = JSON.parse(localStorage.getItem('Amounts'));
    }
    if(localStorage.getItem('Prices') === null) {
        prices = [];
    }else{
        prices = JSON.parse(localStorage.getItem('Prices'));
    }
    console.log('hello')
    for (var i=0; i < items.length; i++) {
        //Shopping DIV
    const shoppingDiv = document.createElement("div");
    shoppingDiv.classList.add('shopping');
    //Create LI
    const newItem = document.createElement("li");
    newItem.innerText = items[i] + " x " + amounts[i];
    newItem.classList.add("shopping-item");
    shoppingDiv.appendChild(newItem);
    //ADD PRICE
    const itemPrice = document.createElement("p");
    itemPrice.innerText = prices[i] * amounts[i] + " €";
    itemPrice.classList.add("item-price");
    shoppingDiv.appendChild(itemPrice);
    //CHECK MARK BUTTON
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
    completedButton.className += "btn btn-success";
    completedButton.setAttribute('id', "complete-btn");
    shoppingDiv.appendChild(completedButton);
    //REMOVE BUTTON
    const removeButton = document.createElement("button");
    removeButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    removeButton.className += "btn btn-danger";
    removeButton.setAttribute('id', "remove-btn");
    shoppingDiv.appendChild(removeButton);
    //APPEND TO LIST
    shoppingList.appendChild(shoppingDiv);
    }
    updateTotal();
}

function removeLocalSave(Item) {
    let Items;
    if(localStorage.getItem('Items') === null) {
        Items = [];
    }else{
        Items = JSON.parse(localStorage.getItem('Items'));
    }
    if(localStorage.getItem('Amounts') === null) {
        Amounts = [];
    }else{
        Amounts = JSON.parse(localStorage.getItem('Amounts'));
    }
    if(localStorage.getItem('Prices') === null) {
        Prices = [];
    }else{
        Prices = JSON.parse(localStorage.getItem('Prices'));
    }
    const itemIndex = Items.indexOf(Item.children[0].innerText.split(" ")[0]);
    Items.splice(itemIndex, 1);
    Amounts.splice(itemIndex, 1);
    Prices.splice(itemIndex, 1);
    localStorage.setItem("Items", JSON.stringify(Items))
    localStorage.setItem("Amounts", JSON.stringify(Amounts))
    localStorage.setItem("Prices", JSON.stringify(Prices))
}