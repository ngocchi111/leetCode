const formidable=require('formidable');
const fs= require('fs');

const { ObjectId } = require('mongodb');
const { use } = require('passport');
const userModel = require('../models/userModel');
const nodeMailer = require('nodeMailer');
const { render } = require('../app');
const co = require('co');

exports.signin=(req,res,next) =>
{
    const message = req.query.error;
    res.render('users/signin', {message});
}
exports.signup= async (req,res,next) =>
{
    const users=await userModel.users();
    res.render('users/signup', {users});
}

exports.infor= async (req,res,next) =>
{
    if (req.user)
    {
        const username = req.user.username;
        res.render('users/infor', await userModel.user(username));
    }
    else 
        res.redirect('/users/signin');
}

exports.add= async (req,res,next)=>
{
    const newUser = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };
    await userModel.add(newUser);
    res.redirect('/users/signin');
}


exports.updateInfor= async (req,res,next) =>
{
    if (req.user)
    {
        const username = req.user.username;
        res.render('users/updateInfor', await userModel.user(username));
    }
    else 
        res.redirect('/users/signin');
}

exports.postInfor =async (req, res, next) =>
{
    
    const id = req.user._id;
    const obj={$set: {name: req.body.name, address: req.body.address, birthday: req.body.birthday}};
    await userModel.updata(id,obj);
    res.redirect('/users/infor');
    /*
   const form = formidable({multiples: true});
   form.parse(req, (err, fields, files)=>{
       if (err) {
           next(err);
           return;
       }
       var obj={}; 
       const image = files.image;
       if (image && image.size >0)
       {
            const filename= image.path.split("_").pop() + '.'+ image.name.split('.').pop();
            console.log(filename);
            fs.renameSync(image.path, process.env.FILE_IMAGE_USER+'/'+filename);
            obj={$set: {name: fields.name,cover: '/images/users'+filename , address: fields.address, birthday: fields.birthday}};
       }
       else
            obj={$set: {name: fields.name, address: fields.address, birthday: fields.birthday}};
      userModel.updata(req.user._id,obj).then(()=>{res.redirect('users/infor')});
   })
   */
}

exports.rePassword= (req, res) => {
    const message = req.query.error;
    if (!req.user)
        res.redirect('/users/signin');
    res.render('users/rePassword', {message});

}

exports.postPassword = async (req, res) =>
{
    const password = req.body.oldPassword;
    const newUser= {id: req.user._id,
        password: req.body.password};
    if (await userModel.checksPass(password, req.user.password))
    {
        await userModel.rePassword(newUser);
        res.redirect('/');
    }
    else
    {
        res.redirect('/users/rePassword?error=error');
    }
}

