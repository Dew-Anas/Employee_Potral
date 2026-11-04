const Category = require("../models/Category");

const getCategories =async(req,res)=>{
    try{
        const categories = await Category.find({status:"Active"})
        .select("name")
        .sort("name");

        return res.status(200).json({ success:true, categories });

    } catch(err){
        console.error("Get Categories error:",err.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports={getCategories}


