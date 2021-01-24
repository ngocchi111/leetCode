const problemModel = require('../models/problemModel');
const cmtModel = require('../models/cmtModel');
const { param } = require('../routes/users');
const { ObjectId } = require('mongodb');

exports.index = async (req, res, next) => {
    // Get problems from model
    const pageNumber = +req.query.page || 1;
    const itemPerPage = +req.query.item || 10;
    const filter={};
    const q= req.query.q;
    var link ="";
    if (q)
    {
        filter.question= new RegExp(q, 'i');
        link=link+"&q="+q;
    }
    const problemTotal = await problemModel.count(filter);
    const problems =  await problemModel.list(filter, pageNumber, itemPerPage);
    res.render('problems/list', {problems, 
         hasNextPage: itemPerPage*pageNumber < problemTotal,
         hasPrevPage: pageNumber > 1,
         hasPage: (itemPerPage*pageNumber < problemTotal) || pageNumber > 1,
         nextPage: pageNumber+1,
         prevPage: pageNumber-1,
         lastPage: Math.floor((problemTotal+itemPerPage)/itemPerPage),
         itemPerPage,
         pageNumber,
         link,
    });
};

exports.details = async (req, res, next) => {
    const problem = await problemModel.get(req.params.id);
    const id = new RegExp(problem._id, 'i');
    const pageNumber = + req.query.page|| 1;
    const itemPerPage = 10;
    const cmtTotal = await cmtModel.count(id);
    const comments = await cmtModel.comments(id, pageNumber, itemPerPage);
    res.render('problems/detail', {problem, comments, 
        hasNextPage: itemPerPage*pageNumber < cmtTotal,
        hasPrevPage: pageNumber > 1,
        hasPage: (itemPerPage*pageNumber < cmtTotal) || pageNumber > 1,
        nextPage: pageNumber+1,
        prevPage: pageNumber-1,
        lastPage: Math.floor((cmtTotal+itemPerPage)/itemPerPage),
        itemPerPage,
        pageNumber,
    });
}

exports.addCmt = async (req, res, next)=>
{
    const cmt ={
    };
    if (req.user)
        cmt.name= req.user.name;
    cmt.comment = req.body.comment;
    cmt.id_problem= req.body.id;
    cmt.title= req.body.title;
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    cmt.dateTime = time+' '+date;
    await cmtModel.addCmt(cmt);
    res.redirect('back');
}