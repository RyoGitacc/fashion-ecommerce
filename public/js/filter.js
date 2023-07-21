import { selectedCategory, selectedType, resetSelect } from "./select.js";
import {min,max,resetSlider} from "./slider.js"
import { createCard, removeChildren} from "./card.js";
import { stringToNode } from "./shoppingCart.js";
const productContainer=document.querySelector(".product-container");
const filterSubmitBtn = document.querySelector(".submit-btn");
const genderArea=document.querySelector(".gender-area");
const genderAreaMobile=document.querySelector(".mobile-gender-area");
const sort = document.querySelector(".sort");
const contentsTitle=document.querySelector(".contents-title");
const searchbar= document.querySelector('.searchbar')

// const URL = "https://fashion-site2023-b1bf572760a8.herokuapp.com/"
const URL = "http://localhost:8080/"

const spinnerText = `<div class="spinner-container">
                      <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                   </div>`;

const spinner = stringToNode(spinnerText)

let isMoreItems=true;
let isLoading=false;

function fetchPostRequest(url,data){
  return new Promise((resolve,reject)=>{
    fetch(url,{
    method:"POST",
    headers:{
      'Content-Type':"application/json"
    },
    body:JSON.stringify(data)
  }).then(response=>{
    if(response.status !== 200) throw new Error("something went wrong" + response.status);
    else resolve(response.json()); return;
  }).catch(err=>{
    console.log(err)
    reject(err); return;
  })
})
}

function fetchFilterdItems(url,data,isSort){
  isMoreItems=true;
  isLoading=true;
  removeChildren(productContainer);
  productContainer.appendChild(spinner)
  scrollTo(0, 0);
  // contentsTitle.scrollIntoView({behavior:'smooth', block:'start'});

  fetchPostRequest(url,data).then(items=>{
    setTimeout(()=>{
          spinner.remove();
          isLoading=false;
          items.forEach(f=>{
              productContainer.appendChild(createCard(f))
          })
        },1000)
        if(!isSort) sort.value="all" 
  }).catch(err=>{
    spinner.remove()
    isLoading=false;
    alert("something went wrong. Please try again" + err)
  })
}

//submit data to filter items
function handleSubmit(e){
  if(e) e.preventDefault();

  if(min > max){
    const temp = min;
    min = max;
    max = temp
  }

  const condition={
    category:selectedCategory,
    type:selectedType,
    min,
    max,
  }
  fetchFilterdItems(URL + 'filter',condition)
  
}


//filter items by gender
function selectGender(e){
  if(e.target.tagName === 'LABEL'){
    // contentsTitle.scrollIntoView({behavior:'smooth', block:'start'});
    resetSelect();
    resetSlider();
    const gender = e.target.innerText;
    fetchFilterdItems(URL + "gender", {gender})
  }
}

//sort items
function sortItems(){
 if(sort.value){
   const sortBy = sort.value;
   fetchFilterdItems(URL + "sort", {sortBy}, true)
 }
}

function searchItem(e){
  e.preventDefault();
  const keyword=e.target.keyword.value;
  fetchFilterdItems(URL + "search",{keyword})
}

function loadMoreItems(){
   isLoading = true;
   fetch(URL+ "loadMore").then(response=>{
    if (!response.ok) {
      throw new Error('Something went wrong' + response.status);
    }
    return response.json(); // Parse the response body as JSON
   }).then(items=>{
       productContainer.appendChild(spinner)
       if(items.length === 0){
        spinner.remove();
        isLoading=false;
        isMoreItems=false;
       }else{
         setTimeout(()=>{
          spinner.remove();
          items.forEach(f=>{
              productContainer.appendChild(createCard(f))
         })
         isLoading=false;
         },1000)
       }
   }).catch(err=>{
    console.log(err);
    spinner.remove()
   })
}


window.addEventListener('scroll', () => {
    // window.scrollY is not supported in IE
    const currentScroll = window.scrollY || window.pageYOffset;
    // get position of the bottom of the window in pixel
    const offsetY = currentScroll + window.innerHeight;
    // console.log(offsetY, "offset")
     if(offsetY >= document.body.offsetHeight - 50  && isMoreItems && !isLoading){
      loadMoreItems()
      console.log('bottom')
      // isScrolledToBottom = true;
     }
     
    //  if(offsetY <= document.body.offsetHeight) isScrolledToBottom = false;

});

genderArea.addEventListener('click',selectGender)
genderAreaMobile.addEventListener('click',selectGender)
sort.addEventListener('change', sortItems);
searchbar.addEventListener('submit', searchItem)

// submit form and send the data to backend
filterSubmitBtn.addEventListener('click',handleSubmit)
  