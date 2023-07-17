
const checkoutBtn = document.querySelector(".checkout-btn");


export const shoppingCartBody=document.querySelector(".cart-body");
export const numOfItemNode = document.querySelector('.cart-total-num');
export const totalPaymentNode= document.querySelector(".total-payment");

export let cartItems=[];
let numOfItem=0;
let totalPrice=0;



//update num of items and total price in a cart
export function calculateCart(cartBody,numOfItemNode,totalPaymentNode){
    numOfItem=0;
    totalPrice=0;
    cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.forEach(c=>{
        numOfItem +=c.quantity;
        totalPrice +=c.price * c.quantity;
        cartBody.appendChild(createItemNode(c))
    })
    numOfItemNode.innerHTML=numOfItem;
    totalPaymentNode.innerHTML=totalPrice;
}

//convert string into node
export function stringToNode(str){
    var template=document.createElement('div');
    template.innerHTML=str.trim();
    return template.firstChild
}

//create cartItem node 
export function createItemNode(item){
    var itemString=`
    <div class="cart-item" id=${item.id}>
      <ul class="cart-item-wrapper">
        <li class="cart-item-left">
            <img src="../assets/images/${item.img}" alt="" class="cart-item-img">
        </li>
        <li class="cart-item-middle">
           <p class="cart-item-name">${item.name}</p>
           $${item.price}
           <div class="cart-quantity-btns">
             <button class="minus-btn">-</button>
             <span class="cart-item-quantity">${item.quantity}</span>
             <button class="plus-btn">+</button>
           </div>
        </li>
        <li class="cart-item-right">
            $<span class="cart-item-total">${item.price * item.quantity}</span>
            <button class="cart-remove-btn">X</button>
        </li>
    </ul>
    </div>`

    return stringToNode(itemString)
}

//update numbers in a shopping cart
function updateNumbers(cartItem,quantity,price){
    const cartItemTotalPrice = cartItem.querySelector(".cart-item-total");
    const cartItemQuantity = cartItem.querySelector(".cart-item-quantity");

    cartItemQuantity.innerText=quantity;
    cartItemTotalPrice.innerText=quantity * price;
    numOfItemNode.innerText=numOfItem;
    totalPaymentNode.innerText=totalPrice;
}

//remove node from DOM 
function removeCartItem(cartItem,id){
    const targetItem = cartItems.find(c=>c.id==id);
    if(targetItem){
        numOfItem -= targetItem.quantity;
        totalPrice -= targetItem.quantity * targetItem.price;
        updateNumbers(cartItem,0 ,0)
        const updatedCartItems = cartItems.filter(c=>c.id != id);
        cartItems = updatedCartItems;
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems))
        cartItem.remove();
    }
}

// when dom loaded, add cartItems to shopping cart
window.addEventListener('load',
                        ()=>calculateCart(shoppingCartBody,numOfItemNode,totalPaymentNode))

// increment or decrement item quantity
shoppingCartBody.addEventListener('click',(e)=>{
    if(e.target.matches(".plus-btn") || e.target.matches(".minus-btn")){
      
        const cartItem = e.target.closest('.cart-item'); 
        const itemId = cartItem.getAttribute('id');
       
        cartItems.forEach(c=>{
        if(c.id == itemId){
             if(e.target.className === "plus-btn"){
                    c.quantity +=1;
                    numOfItem++;
                    totalPrice += c.price;
                }else if(e.target.className === "minus-btn"){
                    c.quantity -=1;
                    numOfItem--;
                    totalPrice -= c.price;
                }
                if(c.quantity === 0){
                    removeCartItem(cartItem,itemId)
                    return;
                }
                updateNumbers(cartItem,c.quantity,c.price)
        }
       })
                localStorage.setItem('cartItems',JSON.stringify(cartItems));
    } else if(e.target.matches(".cart-remove-btn")){
        const cartItem = e.target.closest('.cart-item');
        const itemId = cartItem.getAttribute('id');
        removeCartItem(cartItem,itemId)
    }
})

checkoutBtn.addEventListener('click',()=>alert( `Payment due is $${totalPrice}`))

