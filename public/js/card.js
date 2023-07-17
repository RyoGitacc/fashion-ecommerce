import { cartItems, calculateCart, stringToNode, shoppingCartBody,numOfItemNode, totalPaymentNode} from "./shoppingCart.js";
const productContainer=document.querySelector(".product-container");
const url = "https://fashion-site2023-b1bf572760a8.herokuapp.com/"

// create card element from string.
export function createCard(card){
  var cardText=`  
  <div class="card">
    <img src="../assets/images/heart-plus.svg" alt="" class="heart-plus">
    <img src="../assets/images/${card.img}" alt="" class="card-img">
    <div class="card-body">
      <p class="card-name">${card.name}</p>
      $${card.price}
      <p class="review">
          <span class="stars-container"></span>
          <span class="review-num">
           (${card.reviews.length})
          </span>
      </p>
    </div>
    <div class="card-footer">
      <button class="add-cart-btn" data='${JSON.stringify(card)}' %>
          <span class="plus-icon">+</span> 
          ADD TO CART
      </button>
    </div>
  </div>`
  
  const template=document.createElement('div');
  template.innerHTML=cardText.trim();
  const cardNode = template.firstChild;
  
  //when no reviews for the item, remove reviews element
  if(card.reviews.length === 0){
      const cardReview = cardNode.querySelector(".review");
      cardReview.remove();
      return  cardNode;
    }
    
    // add stars 
    let sum= card.reviews.reduce((accum, cr)=>{
        return accum + cr.stars
    },0)
    
    const starsContainer = cardNode.querySelector(".stars-container")
    const avarage = sum / card.reviews.length;
    const quotient = Math.floor(avarage);
    const remainder = Math.floor((avarage % quotient) * 10) / 10;
    console.log(avarage, quotient, remainder)
    
    for(var i=0;i<quotient;i++){
        const star = document.createElement('img');
        star.src="../assets/images/star.svg";
        star.classList="star"
        
        starsContainer.appendChild(star);
    }

  if(remainder > 0.2){
    const halfStar=document.createElement('img');
    halfStar.src="../assets/images/half-star.svg";
    halfStar.classList="half-star"
    starsContainer.appendChild(halfStar)
  }

  return cardNode;
}


//remove all children from parent
export function removeChildren(parent){
     while(parent.firstChild){
        parent.removeChild(parent.lastChild)
     }
}


// add item to cart when add to cart butoon is clicked
function addToCart(e){
    if(e.target.matches(".add-cart-btn")){
        removeChildren(shoppingCartBody);
        const clickedItem=JSON.parse(e.target.getAttribute('data'));
         console.log(clickedItem)
        
        if(cartItems.length > 0){
            if(cartItems.find(c=>c.id === clickedItem.id) === undefined){
                cartItems.push(clickedItem);
            }
            else{
                cartItems.forEach(c => {
                    if(c.id === clickedItem.id){
                        c.quantity += 1;
                    }
                });
            }
        }
        else{
            cartItems.push(clickedItem)
        }

        localStorage.setItem('cartItems',JSON.stringify(cartItems))
        
        calculateCart(shoppingCartBody,numOfItemNode,totalPaymentNode);
        alert(`${clickedItem.name} is added to shopping cart!`)
    }
}

// when dom loaded, initialize cards to fetched data
function fetchData(){
    console.log("loaded")
    fetch(url + "data", {
        'Content-Type':'application/json'
    }).then(response=>{
        if(response.status === 200) return response.json();
        else throw new Error('Request fail. Error code is ' + response.status)
    }).then(items=>{
        items.forEach(c=>{
           productContainer.appendChild(createCard(c))
        })
    }).catch(err=>{
        console.log(err)
    })
}


document.addEventListener("DOMContentLoaded",fetchData);
productContainer.addEventListener('click',addToCart);