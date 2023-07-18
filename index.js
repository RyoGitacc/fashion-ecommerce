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


let currentItems;
let currentFilteredItems;

app.get('/',(req,res)=>{
    res.render('home',{categories:CATEGORIES, Type:TYPE})
})

app.get('/data',(req,res)=>{
    currentItems = [...data];
    currentFilteredItems = [...data]
    res.status(200).json(data);
})

app.post('/gender',(req,res)=>{
    const filteredItems = data.filter(d=>d.gender === req.body.gender);
    currentItems = filteredItems;
    currentFilteredItems = filteredItems
    res.status(200).json(filteredItems);
})

app.post('/filter',(req,res)=>{
    const {category,type,min,max}=req.body;

    let filteredItems= currentItems.filter(d=> d.price >= min && d.price <= max)      

    if(category){
     filteredItems= filteredItems.filter(f=>f.category === category);
    }

    if(type){
        filteredItems = filteredItems.filter(f=>f.type === type)
    }


    currentFilteredItems=filteredItems;
    res.status(200).json(filteredItems)
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
    currentFilteredItems= searchedItems
    res.status(200).json(searchedItems)
})





app.listen(process.env.PORT || 8080,()=>{
    console.log("server running")
})