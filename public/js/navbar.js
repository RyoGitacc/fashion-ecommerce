const myOffcanvas = document.getElementById('cart');
const navList=document.querySelector('.nav-list')
const bootstrapOffcanvas = new bootstrap.Offcanvas(myOffcanvas);
const searchbarContainer= document.querySelector('.searchbar-container');
const mobileOnly = document.querySelector('.mobile-only');
let previosOffsetY=0

function handleEvent(e){
  if(e.target.classList[1] === 'cart-icon'){
    bootstrapOffcanvas.show();
  }
  else if(e.target.classList[1] === 'search-icon'){
    searchbarContainer.style.display="flex";
    searchbarContainer.querySelector(".search-input").focus();
  }
  else if(e.target.classList[0] === 'search-close-container'){
    searchbarContainer.style.display="none";
  }
}

function moveMobileGenderArea(){

    if((window.scrollY - previosOffsetY) > 0){
        mobileOnly.classList.add("hide")
    }
    else{
        mobileOnly.classList.remove("hide")
    }
    previosOffsetY = window.scrollY
}

window.addEventListener('scroll',moveMobileGenderArea)
navList.addEventListener('click',(e)=>handleEvent(e));

