//Selectors
const itemInput = document.querySelector("#item-input");
const amount = document.querySelector("#amount-input");
const price = document.querySelector("#price-input");
const shoppingList = document.querySelector(".shopping-list");
const addButton = document.querySelector("#add-btn");
const totalPar = document.querySelector('#total-par');
const lang = document.querySelectorAll('.lang');
const langDiv = document.querySelector('.languageDiv');
const title = document.querySelector('.title');
const homeLink = document.querySelector('#home');


//Event Listener
window.addEventListener("load", getLocalSave);
addButton.addEventListener("click", addItem);
shoppingList.addEventListener("click", deleteCheck);
lang.forEach(el => {
    el.addEventListener('click', changeLanguage);
})

//Variables
var data = {
    "english":
    {
        "home": "Home",
        "title": "Shopping List",
        "item": "Item",
        "amount": "Amount",
        "ppi": "Price per item",
        "total": "Total"
    },
    "estonian":
    {
        "home": "Kodu",
        "title": "Ostunimekiri",
        "item": "Kaup",
        "amount": "Kogus",
        "ppi": "Tükihind",
        "total": "Kogusumma"
    }
}

var curTotalText = "Total"

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
    const itemPrice = document.createElement("span");
    tempPrice = Math.round((price.value * amount.value + Number.EPSILON) * 100) / 100;
    itemPrice.innerText =  tempPrice + " €";
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
        saveLocalShopping("uncompleted", 'Statuses');
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

    totalPar.innerHTML = curTotalText + ' = ' + total + ' €';
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
        if (toCompl.classList.contains('completed')) {
            changeLocalStatus(toCompl, 'uncompleted');
            toCompl.classList.remove('completed');
        } else {
            changeLocalStatus(toCompl, 'completed');
            toCompl.classList.add('completed');
        }
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
    let statuses;
    let selectedLanguage;
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
    if(localStorage.getItem('Statuses') === null) {
        statuses = [];
    }else{
        statuses = JSON.parse(localStorage.getItem('Statuses'));
    }
    if(localStorage.getItem('Language') === null) {
        selectedLanguage = "english";
    }else{
        selectedLanguage = localStorage.getItem('Language');
    }
    updateLanguage(selectedLanguage);
    document.querySelector("[language=" + selectedLanguage+ "]").classList.add("selected");
    for (var i=0; i < items.length; i++) {
        //Shopping DIV
    const shoppingDiv = document.createElement("div");
    shoppingDiv.classList.add('shopping');
    if (statuses[i] === 'completed') {
        shoppingDiv.classList.add('completed');
    }
    //Create LI
    const newItem = document.createElement("li");
    newItem.innerText = items[i] + " x " + amounts[i];
    newItem.classList.add("shopping-item");
    shoppingDiv.appendChild(newItem);
    //ADD PRICE
    const itemPrice = document.createElement("span");
    tempPrice = Math.round((prices[i] * amounts[i] + Number.EPSILON) * 100) / 100;
    itemPrice.innerText =  tempPrice + " €";
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
    if(localStorage.getItem('Statuses') === null) {
        Statuses = [];
    }else{
        Statuses = JSON.parse(localStorage.getItem('Statuses'));
    }
    const itemIndex = Items.indexOf(Item.children[0].innerText.split(" ")[0]);
    Items.splice(itemIndex, 1);
    Amounts.splice(itemIndex, 1);
    Prices.splice(itemIndex, 1);
    Statuses.splice(itemIndex, 1);
    localStorage.setItem("Items", JSON.stringify(Items));
    localStorage.setItem("Amounts", JSON.stringify(Amounts));
    localStorage.setItem("Prices", JSON.stringify(Prices));
    localStorage.setItem("Statuses", JSON.stringify(Statuses));
}

function changeLocalStatus(Item, status) {
    let Items;
    if(localStorage.getItem('Items') === null) {
        Items = [];
    }else{
        Items = JSON.parse(localStorage.getItem('Items'));
    }
    if(localStorage.getItem('Statuses') === null) {
        Statuses = [];
    }else{
        Statuses = JSON.parse(localStorage.getItem('Statuses'));
    }
    const itemIndex = Items.indexOf(Item.children[0].innerText.split(" ")[0]);
    Statuses.splice(itemIndex, 1, status);
    localStorage.setItem("Statuses", JSON.stringify(Statuses));
}

function changeLanguage(event) {
    const item = event.target;
    langDiv.querySelector('.selected').classList.remove('selected');
    item.classList.add('selected');
    console.log(homeLink);
    const attr = item.getAttribute('language');
    updateLanguage(attr);
    localStorage.setItem("Language", attr);
}

function updateLanguage(attr) {
    homeLink.textContent = data[attr].home;
    title.textContent = data[attr].title;
    itemInput.setAttribute('placeholder', data[attr].item);
    amount.setAttribute('placeholder', data[attr].amount);
    price.setAttribute('placeholder', data[attr].ppi);
    curTotalText = data[attr].total
    updateTotal();
}