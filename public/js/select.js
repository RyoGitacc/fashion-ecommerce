export let selectedCategory="";
export let selectedType=""
const selects = document.querySelectorAll(".select")

export function resetSelect(){
  selectedCategory="";
  selectedType="";

  selects.forEach((s,index)=>{
    s.querySelector(".selected-value").innerText= index === 0 ? "All categories" : "Any type"
  })
}


function openSelect(dOption, list, num){
  //children 1,2 are down and up arrow
  dOption.children[1].style.display="none";
  dOption.children[2].style.display="block";
  list.style.height=`${num * 30}px`;
  list.style.borderBottom="1.5px solid #999994"
  dOption.style.borderBottom="none";
  list.classList.add("open");
}

function closeSelect(dOption,list){
  list.style.height="0px";
  setTimeout(()=>{
    dOption.children[1].style.display="block";
    dOption.children[2].style.display="none";
    list.style.borderBottom="none"
    dOption.style.borderBottom="1.5px solid #999994";
  },200)
  list.classList.remove("open");

}


function handleSelect(e, index){
  const selectedValue = selects[index].querySelector(".selected-value");
  const defaultOption = selects[index].querySelector(".default-option");
  const optionList = defaultOption.nextElementSibling;

  if(e.target.matches(".default-option")){
    const numOfOption = optionList.children.length;

    if(optionList.classList.contains("open")){
        closeSelect(defaultOption,optionList)
    }else{
        openSelect(defaultOption,optionList, numOfOption)
    }
    
  }else if(e.target.matches(".option")){
     const value = e.target.innerText;
     selectedValue.innerText= value;

     if(index === 0){
       
      selectedCategory = value === "All" ? "" : value;
     }else{
      selectedType = value === "Any" ? "" : value;
     }
     closeSelect(defaultOption,optionList)
     
  }
}



selects.forEach((s,index) => {
  s.addEventListener('click',(e)=>handleSelect(e, index))
});






