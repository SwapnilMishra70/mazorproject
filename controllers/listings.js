const Listing = require("../models/listing.js");


module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs",{allListing});
};

module.exports.renderNewForm = (req,res)=>{
   res.render("./listings/new.ejs");
};

module.exports.showForm = async(req,res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id)
   .populate({
    path:"reviews",
    populate: {
        path: "author",
    }
   })
   .populate("owner");
   if(!listing){
      req.flash("error","Requested listing does not exist!");
      return res.redirect("/listings");
   }
   res.render("listings/showe.ejs",{listing})

};

module.exports.createNewForm = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing =  new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  

}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id); 
   if(!listing){
      req.flash("error","Requested listing does not exist!");
      return res.redirect("/listings");
   }

   let originalImageUrl = listing.image?.url || "";
   if (originalImageUrl) {
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
}
   res.render("./listings/edit.ejs",{listing, originalImageUrl})
}

module.exports.updateListings = async(req,res)=>{
    let {id} = req.params; 
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }
   

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings = async(req,res)=>{
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}

module.exports.searchByLocation = async(req,res) => {
    const {location} = req.query;

    if(!location  || location.trim() === ""){
        return res.redirect("/listings");
    }
    try{
       const regex = new RegExp(location.trim(),'i');
       const listings = await Listing.find({
        $or: [
        {location: regex},
        {title: regex},
        {country: regex},
        ]
       
    });

       res.render("listings/index",{allListing:listings})
    } catch(e) {
        console.error("Search Error",e);
        req.flash("error","search failed");
        res.redirect("/listings");
    }
    

};