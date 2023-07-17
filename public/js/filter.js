import { selectedCategory, selectedType } from "./select.js";
import {min,max} from "./slider.js"
import { createCard, removeChildren} from "./card.js";
const productContainer=document.querySelector(".product-container");
const form = document.querySelector(".filter-form");
const genderArea=document.querySelector(".gender-area");
const genderAreaMobile=document.querySelector(".mobile-gender-area");
const sort = document.querySelector(".sort");
const contentsTitle=document.querySelector(".contents-title");
const spinnerContainer=document.querySelector(".spinner-container")


function fetchFilterdItems(url,data,isSort){
  removeChildren(productContainer);
  spinnerContainer.style.display="flex";
  contentsTitle.scrollIntoView({behavior:'smooth', block:'start'});

  fetch(url,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(data)
  }).then(response=>{
       if(response.status !== 200) throw new Error("something wrong " + response.status)
       else return response.json()
  })
  .then(filteredData =>{
    setTimeout(()=>{
      spinnerContainer.style.display="none";
      filteredData.forEach(f=>{
          productContainer.appendChild(createCard(f))
      })
    },1000)
    if(!isSort) sort.value="all" 
  })
  .catch(err=>{
    spinnerContainer.style.display="none";
    alert("something went wrong. Please try again")
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
  fetchFilterdItems('http://localhost:8080/filter',condition)
  
}


//filter items by gender
function selectGender(e){
  if(e.target.tagName === 'LABEL'){
    contentsTitle.scrollIntoView({behavior:'smooth', block:'start'});
    const gender = e.target.innerText;
    fetchFilterdItems("http://localhost:8080/gender", {gender})
  }
}

//sort items
function sortItems(){
 if(sort.value){
   const sortBy = sort.value;
   fetchFilterdItems("http://localhost:8080/sort", {sortBy}, true)
 }
}

genderArea.addEventListener('click',selectGender)
genderAreaMobile.addEventListener('click',selectGender)
sort.addEventListener('change', sortItems);

// submit form and send the data to backend
form.addEventListener('submit',handleSubmit)
  