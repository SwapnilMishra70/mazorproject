const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

const MONGOURL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGOURL);
} 

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, 
        owner: '684dd6d97c3e04b4c78718b8'
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

};

initDB();