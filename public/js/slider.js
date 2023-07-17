const sliders = document.querySelectorAll('.slider');
const progress = document.querySelector('.progress');
const numbers = document.querySelectorAll('.indicator .number');
const gap = 20;
export let min=0;
export let max=1000;
numbers[0].innerHTML='$0';
numbers[1].innerHTML='$1000'

sliders.forEach((s, index)=>{
    s.addEventListener('input',()=>{
        console.log("dd")
        min = parseInt(sliders[0].value);
        max = parseInt(sliders[1].value);

        if(min > max){
            min = parseInt(sliders[1].value);
            max = parseInt(sliders[0].value);
        }

         
        let percentMin = (min / 1000) * 100;
        let percentMax = ((1000 - max) / 1000) * 100;
        progress.style.left=`${percentMin}%`;
        progress.style.right=`${percentMax}%`;

        numbers[0].innerHTML = "$" + min.toString();
        numbers[1].innerHTML = "$" + max.toString();
       
    })
})