const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const Blog = require('../Models/BlogSchema');
const jwt = require('jsonwebtoken')
const errorHandler = require('../Middleware/errorMiddleware');
const authTokenHandler = require('../Middleware/checkAuthToken')

router.use(authTokenHandler)

router.get('/test',authTokenHandler, async(req,res) =>{
    res.json({
        message :"Blog api is working !!",
        userId : req.userId
    });
})

// crud operations
router.post('/createBlog',authTokenHandler, async(req,res,next) => {
    try {
        const { title, description , image , content } = req.body;
        const blog = new Blog({title, description, image, content, owner: req.userId});
        await blog.save();
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(401).json({message:"User not found"});
        }
        user.blogs.push(blog._id);
        await user.save();
        res.status(200).json({message:"Blog created successfully !!"})
    }
    catch(err){
        next(err);
    }
});

router.get('/getBlog/:id',authTokenHandler, async(req,res,next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message:"Blog not found"});
        }
        res.status(200).json(blog);
    }
    catch(err){
        next(err);
    }
});
// authentication for the user to change the blog is yet to be implemented
router.put('/updateBlog/:id',authTokenHandler, async(req,res,next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message:"Blog not found"});
        }
        // if(blog.owner.toString() !== req.userId){
        //     return res.status(401).json({
        //         message:"You are not authorized to update this blog",
        //         owner: blog.owner.toString(),  
        //         userId: req.userId
        //     });
        // }
        const { title, description , image , content } = req.body;
        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.image = image || blog.image;
        blog.content = content || blog.content;
        await blog.save();
        res.status(200).json({message:"Blog updated successfully !!"});
    }
    catch(err){
        next(err);
    }
});
// removing the blog id from the user is yet to be implemented
router.delete('/deleteBlog/:id',authTokenHandler, async(req,res,next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if(!blog){
            return res.status(404).json({message:"Blog not found"});
        }
        // if(blog.owner.toString() !== req.userId){
        //     return res.status(401).json({message:"You are not authorized to delete this blog"});
        // }
        await blog.deleteOne({_id:req.params.id});
        res.status(200).json({message:"Blog deleted successfully !!"});
    }
    catch(err){
        next(err);
    }
});


// search opertaion
router.get('/searchBlog',authTokenHandler, async(req,res,next) => {
    try {
        const search = req.body.search || "";
        const page = parseInt(req.body.page) || 1;
        const perPage = 3;
        const searchQuery = new RegExp(search, 'i');
        const totalBlogs = await Blog.countDocuments({title: searchQuery});
        const totalPages = Math.ceil(totalBlogs/perPage);
        if(page<1 || page > totalPages){
            return res.status(404).json({message:"Page not found"});
        }
        const skip = (page-1)*perPage;
        const blogs = await Blog.find({title: searchQuery})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(perPage);
        res.status(200).json({
            blogs,totalPages,currentPage: page
        });
    }
    catch(err){
        next(err);
    }
});

router.use(errorHandler);

module.exports = router;