const {Router, response}=require("express");
const {BlogModel}=require("../models/Blog.model");
const {UserModel}=require("../models/User.model");

const blogRouter=Router();

//get request for blogs
blogRouter.get("/",async (req,res)=>{
    const blog=await BlogModel.find();
    res.send({responseData:blog});
})

//post a blog or create a blog

blogRouter.post("/create",async(req,res)=>{
    const{title,category,content,image}=req.body;
    const author_id=req.user_id;
    console.log(author_id);
    const user=await UserModel.findOne({_id:author_id});
    console.log(user);

    const new_blog=new BlogModel({
        title,
        category,
        content,
        image,
        author:user.name
    })
    try{
        await new_blog.save();
        res.send({msg:"blog created"});
    }catch(err){
        res.send("error in creating blog")
        console.log(err)
    }
})

blogRouter.put("/edit/:blogID",async (req,res)=>{
    const blogID=req.params.blogID;
    const payload=req.body;

    const user_id=req.user_id;
    const user=await UserModel.findOne({_id:user_id});
    const user_email=user.email;


    const blog=await BlogModel.findOne({_id:blogID});
    const blog_author_email=user.email;

    if(user_email!==blog_author_email){
        res.send("you are not authorised")
    }else{
        await BlogModel.findByIdAndUpdate(blogID,payload);
        res.send(`blog ${blogID} edited`)
    }
})

blogRouter.delete("/delete/:blogID",async (req,res)=>{
    const blogID=req.params.blogID;
    // const payload=req.body;

    const user_id=req.user_id;
    const user=await UserModel.findOne({_id:user_id});
    const user_email=user.email;


    const blog=await BlogModel.findOne({_id:blogID});
    const blog_author_email=user.email;

    if(user_email!==blog_author_email){
        res.send("you are not authorised")
    }else{
        await BlogModel.findByIdAndDelete(blogID);
        res.send(`blog ${blogID} deleted`)
    }
})

module.exports={blogRouter}