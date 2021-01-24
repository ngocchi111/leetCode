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
    const id = new RegExp(problem.ID, 'i');
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
        cmt.name= req.user.username;
    cmt.comment = req.body.comment;
    cmt.id_problem= req.body.id;
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    cmt.dateTime = time+' '+date;
    await cmtModel.addCmt(cmt);
    res.redirect('back');
}

exports.submit = async (req, res, next) =>
{
    const problem = await problemModel.get(req.params.id);
    res.render('problems/submit', {problem});
}

exports.postSubmit = async (req, res, next) =>
{
    const code = {};
    code.ID = req.body.ID;
    code.name = req.body.name;
    code.point = 100;
    code.username = req.user.username;
    code.language = "C/C++";
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    code.dateTime = time+' '+date;
    await problemModel.addCode(code);
    res.redirect('/problems/status');
}

exports.status = async (req, res) => 
{
    const pageNumber = +req.query.page || 1;
    const itemPerPage = +req.query.item || 20;
    const filter={};
    const codeTotal = await problemModel.countCode(filter);
    var pageTotal = Math.floor((codeTotal+itemPerPage)/itemPerPage);
    if  (pageTotal > 5) 
        pageTotal = 5;
    const code_s =  await problemModel.listCode(filter, pageNumber, itemPerPage, codeTotal);
    const codes =[];
    for (var j = 20; j > 0; j--)
    {
        var t= 0;
        for (i in code_s)
        {
            t++;
            if (t==j)
                codes.push(code_s[i]);
        }
    }

    res.render('problems/status', {codes, 
         hasNextPage: pageNumber < pageTotal,
         hasPrevPage: pageNumber > 1,
         hasPage: pageNumber > 1,
         nextPage: pageNumber+1,
         prevPage: pageNumber-1,
         lastPage: pageTotal,
         itemPerPage,
         pageNumber,
    });
}

exports.addTest = async (req, res, next) =>
{
    if (req.user && String(req.user.job)=="Giáo Viên")
    {
    const problem = await problemModel.get(req.params.id);
    const noti = req.query.noti;
    var notis ="";
    if (noti)
        notis = "Đã thêm";
    res.render('problems/testCase', {problem, notis});
    }
    else
    res.redirect("/users/signin");
}

exports.postTest = async (req, res, next) =>
{
    const test = {};
    test.ID = req.body.ID;
    test.name = req.body.name;
    test.input = req.body.input;
    test.output = req.body.output;
    test.username = req.user.username;
    await problemModel.addTest(test);
    res.redirect('/problems/addtest/'+test.ID+'?noti=true');
}
