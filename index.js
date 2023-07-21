import express from 'express';
import {data} from './data.js'
const app = express();


app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.json())

const CATEGORIES={
   label:"Category",
   values:["All","Tops", "Bottoms", "Outerwear","Innerwear", "Skirt", "Shues", ]
}
const TYPE={
    label:"Type",
    values:["Any","New Arrival", "Featured", "Sale", "Limited Offer"]
}
const FEATURES=['New Arrivals', 'Summer Sale', "Sneaker love"]



let tempItems;
let filteredItemsByCondition;
let currentFilteredItems;
let loadCount=1;

app.get('/',(req,res)=>{
    res.render('home',{categories:CATEGORIES, type:TYPE, features: FEATURES})
})

app.get('/data',(req,res)=>{
    tempItems = [...data];
    filteredItemsByCondition = [...data];
    currentFilteredItems = data.slice(0,4);
    loadCount=1;
    res.status(200).json(currentFilteredItems);
})

app.get('/loadMore',(req,res)=>{
    if(filteredItemsByCondition){
        const moreItems = filteredItemsByCondition.slice((loadCount * 4), (loadCount * 4 + 4) );
        currentFilteredItems.push(...moreItems);
        loadCount++;
        res.status(200).json(moreItems)
    }
});


app.post('/gender',(req,res)=>{
    console.log(req.body,"gender")
    const filteredItems = data.filter(d=>d.gender === req.body.gender);
    tempItems = filteredItems;
    filteredItemsByCondition = filteredItems;
    currentFilteredItems=filteredItems.slice(0,4);
    loadCount=1;
    res.status(200).json(currentFilteredItems);
})

app.post('/filter',(req,res)=>{
    const {category,type,min,max}=req.body;

    let filteredItems= tempItems.filter(d=> d.price >= min && d.price <= max)      

    if(category){
     filteredItems= filteredItems.filter(f=>f.category === category);
    }

    if(type){
        filteredItems = filteredItems.filter(f=>f.type === type)
    }


    filteredItemsByCondition=filteredItems;
    currentFilteredItems = filteredItems.slice(0,4)
    loadCount=1;
    res.status(200).json(currentFilteredItems)
})

app.post("/sort",(req,res)=>{
    switch(req.body.sortBy){
        case "price":
            currentFilteredItems.sort((a,b)=>a.price - b.price); break;
        case "date":
            currentFilteredItems.sort((a,b)=> new Date(b.date) - new Date(a.date)); break;
        case "highRating": 
            currentFilteredItems.sort((a,b)=>{
                const aveRating1= 
                 a.reviews.length !== 0 ? a.reviews.reduce((acm,r)=>{ return acm + r.stars},0) / a.reviews.length : 0;
                const aveRating2= 
                 b.reviews.length !== 0 ? b.reviews.reduce((acm,r)=>{ return acm + r.stars},0) / b.reviews.length : 0;
              
                return aveRating2 - aveRating1;
            }); break;
            
        default:currentFilteredItems.sort((a,b)=>a.id - b.id);break;
    }
  
    res.status(200).json(currentFilteredItems)
})

app.post("/search",(req,res)=>{
    console.log(req.body)
    const keyword = req.body.keyword;
    const regx=new RegExp("[a-zA-Z]*" + keyword + "+",'i')
    const searchedItems=data.filter(d=>regx.test(d.name));
    tempItems= searchedItems;
    filteredItemsByCondition = searchedItems;
    currentFilteredItems = searchedItems.slice(0,4);
    loadCount=1;
    res.status(200).json(currentFilteredItems)
})





app.listen(process.env.PORT || 8080,()=>{
    console.log("server running")
})