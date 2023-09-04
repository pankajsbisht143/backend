const mongoose=require("mongoose");

const BlogSchema=new mongoose.Schema({
    title:{type :String,required:true},
    category:{type :String,required:true},
    author:{type :String,required:true},
    content:{type :String,required:true},
    image:{type :String}
},{
    timestamps:true,
})

const BlogModel=mongoose.model("blogs",BlogSchema);
module.exports={BlogModel};