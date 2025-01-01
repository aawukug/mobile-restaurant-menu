// IMPORTS
import menuArray from './data.js'


// INITIALIZTION
const checkoutSection = document.getElementById('checkout-section')
const paymentModal = document.getElementById('payment-modal')
const reviewModal = document.getElementById('review-modal')
const reviewForm = document.getElementById('review-form')
const reviewTextarea = document.getElementById('review-textarea');
let orderArray = [];


// EVENTLISTNERS
reviewForm.addEventListener('submit', handleReviewSubmitClick)
reviewTextarea.addEventListener('input', disableSubmitBtn)
document.addEventListener('click', function(e){
    if(e.target.dataset.id){
        handleAddClick(e.target.dataset.id)
    } else if(e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove) 
    } else if(e.target.id === 'complete-order-btn'){
        handleCompleteOrderClick()
    } else if (e.target.id === 'pay-btn'){
        handlePaymentClick(e)
    } else{
        closePaymentModal(e) 
        closeReviewModal(e);   
    }
})



// FUNCTION TO HANDLE review SUBMIT CLICK
function handleReviewSubmitClick(e){
    e.preventDefault()

    // DISPLAYING MODAL INNER MESSAGE AFTER USER HAS SUBMITTED THE FORM
    document.getElementById('review-modal-inner').innerHTML = `
    <img class="modal-inner-img" src="images/modal-inner-img.jpg" alt="sandwiches on a plate">
    <p>Thanks for your feedback!</p>
    <h3 id="discount">Get 50% off your next order</h3>`


    // SET TIMEOUT TO AUTOMATICALLY CLASE THE REVIEW MODAL AND RE-RENDER THE MENU
    setTimeout(function(){
        reviewModal.style.display = 'none'

        checkoutSection.innerHTML = ``

        // ENABLE ADD BUTTON AFTER FINAL MESSAGE
        renderMenu()
    }, 1500)
    
}


// FUNCTION TO DISABLE SUBMIT BTN SO USER WRITES A REVIEW
function disableSubmitBtn() {

    // ENABLE BUTTON ONLY IF THERE'S TEXT IN THE TEXTAREA
    if (reviewTextarea.value.trim()) {
        document.getElementById('review-submit-btn').disabled = false; // ENABLE THE BUTTON
    } else {
        document.getElementById('review-submit-btn').disabled = true; // DISABLE THE BUTTON
    }
}


// FUNCTION TO HANDLE ADD CLICK
function handleAddClick(menuId){
    // LOOP THROUGH MENU ARRAY TO GET THE OBJECT THAT MATCHES THE MENU ID. MENU ID IS CONVERTED TO NUMBER BECAUSE IT'S A STRING IN ORDER TO PASS THE TEST
    const targetMenuObj = menuArray.filter(function(menu){
        return Number(menuId) === menu.id
    })[0]

    // CHECK IF TARGET MENU ARRAY IS EMPTY TO LEAVE THE FUNCTION IN ORDER NOT TO THROW AN ERROR
    if(!targetMenuObj){
        return;
    } else {
        orderArray.push(targetMenuObj)
    }
    
    // UPDATE CHECKOUT
    updateCheckout()
}



// FUNCTION TO REMOVE ITEM IN THE ORDER ARRAY 
function handleRemoveClick(menuId){
    // FIND THE INDEX OF THE TARGETED OBJ
    let index = orderArray.findIndex(function(menu){
        return Number(menuId) === menu.id
    })

    // CHECK IF THE INDEX OF ORDER ARRAY IS NOT EQUAL TO -1(NO MATCH) AND REMOVE ONE ITEM STARTING FROM THE INDEX
    if( index !== -1 ){
        orderArray.splice(index, 1)
    } 

    // UPDATEING CHECKOUT
    updateCheckout()

    // CHECK IF THERE IS NO OBJECT IN ORDER ARRAY AND SET THE CHECKOUT CONTAINER TO NONE
    if( orderArray.length === 0 ){
        document.getElementById('checkout-container').style.display = 'none'
    }

}



// FUNCTION TO COMPLETE ORDER CLICK
function handleCompleteOrderClick(){
    // DISPLAY PAYMENT MODAL
    paymentModal.style.display = 'flex'

    // DISABLE ADD BUTTON
    disableAddButton()

}




// FUNCTION TO HANDLE PAYMENT CLICK
function handlePaymentClick(e){
   
    const paymentForm = document.getElementById('payment-form')

    if (!paymentForm.checkValidity()) {
        return;
    }

    e.preventDefault()

    const paymentFormData = new FormData(paymentForm)

    
    // GET PAYMENT FORM NAME
    const paymentFormName = paymentFormData.get('creditCardName')


    // SET MODAL DISPLAY TO NONE AFTER PAYMENT IS COMPLETE
    paymentModal.style.display = 'none'


    // SET CHECKOUT SECTION INNER HTML
    checkoutSection.innerHTML = `<p class="payment-message">Thanks, ${paymentFormName}! Your order is on it's way!</p>`


    // SET TIMEOUT TO DISPLAY REVIEW MODAL AFTER 1.5 SECONDS
    setTimeout(function(){
        reviewModal.style.display = 'flex'


        // SET CHECKOUT SECTION INNER HTML 
        checkoutSection.innerHTML = ''
    }, 1500)


}



// FUNCTION TO CLOSE review MODAL AFTER USER HAS GIVEN FEED BACK
function closeReviewModal(e){
    // RUN ONLY IF THE PAYMENT MODAL IS VISIBLE
    if (reviewModal.style.display === 'flex') {
        // CHECK IF THE CLICK IS OUTSIDE THE PAYMENT MODAL
        if (!reviewModal.contains(e.target) && e.target !== reviewModal) {
            reviewModal.style.display = 'none';

            //RE-ENABLE ADD BUTTON
            enableAddButtom();
        }
    }
}


// FUNCTION TO CLOSE PAYMENT MODAL
function closePaymentModal(e) {
    // RUN ONLY IF THE PAYMENT MODAL IS VISIBLE
    if (paymentModal.style.display === 'flex') {
        // CHECK IF THE CLICK IS OUTSIDE THE PAYMENT MODAL
        if (!paymentModal.contains(e.target) && e.target !== paymentModal) {
            paymentModal.style.display = 'none';

            //RE-ENABLE ADD BUTTON
            enableAddButtom();
        }
    }
}



// FUNCTION TO ENABLE ADD BUTTON
function enableAddButtom(){
    // ENABLE ADD BUTTON
    document.querySelectorAll('.add-btn').forEach(function(button) {
        button.disabled = false;
    });
}


// FUNCTION TO DISABLE ADD BUTTON
function disableAddButton(){
    // DISABLE ADD BUTTON
    document.querySelectorAll('.add-btn').forEach(function(button) {
        button.disabled = true;
    });
}




// FUNCTION TO UPDATE CHECKOUT
function updateCheckout(){
    // DISCOUNT PERCENTAGE
    const discountPercentage = 0.30 //30%
    // GET THE TOTAL PRICE OF THE MENU IN ORDER ARRAY 
    const totalPrice = orderArray.reduce(function(total, curretMenu){
        return total + curretMenu.price
    }, 0)
    
    // DSISCOUNT PRICE
    const discountPrice = totalPrice - (totalPrice * discountPercentage)
    
    // SET INNER HTML OF CHECK OUT SECTION
    checkoutSection.innerHTML = `
     <div class="checkout-container" id="checkout-container">
            <h2>Your order</h2>
            <div class="order-desc">
                ${orderArray.map(menu => `
                <div class="order-name">
                    <h2>${menu.name}</h2>
                    <p data-remove="${menu.id}">remove</p>
                    <h3>GH¢${menu.price}</h3>
                </div>
                    `).join('')}
                
                <div class="total-price-container">
                    <h2>Total price:</h2>
                     <div class="discount-container">
                        <p>30% Discount</p>
                     </div>
                    <h3>GH¢${discountPrice.toFixed(2)}</h3>
                </div>
            </div>
            <button class="complete-order-btn" id="complete-order-btn">Complete order</button>
    </div>`
}




// FUNCTION TO GET MENU ARRAY
function getMenuArr(){
    // LOOPING THROUGH MENU ARRAY TO GET MENU OBJ
    const menuHtml = menuArray.map(function(menu){
        return `
        <div class="menu-container">
            <p class="restaurant-item">${menu.emoji}</p>
            <div class="item-desc">
                <h2>${menu.name}</h2>
                <p>${menu.ingredients}</p>
                <h3>GH¢${menu.price}</h3>
            </div>
            <button class="add-btn" data-id="${menu.id}">+</button>
        </div>` 
    }).join('')

    return menuHtml
}


// FUNCTION TO RENDER MENUS IN SECTION DIV
function renderMenu(){
    document.getElementById('menu-section').innerHTML = getMenuArr()

}

renderMenu()