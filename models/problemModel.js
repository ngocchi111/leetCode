const {db} = require('../dal/db');
const { ObjectId, Int32} = require('mongodb');
const { authenticate } = require('passport');

exports.list = async (filter, pageNumber, itemPerPage) => {
    const problemsCollection = db().collection('problems');
    const problems = await problemsCollection.find(filter).limit(itemPerPage).skip(itemPerPage*(pageNumber-1)).toArray();
    return problems;
}

exports.count= async (filter) =>{
    const problemsCollection = db().collection('problems');
    const count = await problemsCollection.count(filter);
    return count;
}

exports.get = async (id) => {
    const problemsCollection = db().collection('problems');
    const problem = await problemsCollection.findOne({ID: id});
    return problem;
}

exports.addTest=async(obj)=>{
    const testCollection = db().collection('testCase');
    await testCollection.insertOne(obj);
    return testCollection;
}

exports.addCode=async(obj)=>{
    const codeCollection = db().collection('codes');
    await codeCollection.insertOne(obj);
    return codeCollection;
}

exports.listCode = async (filter, pageNumber, itemPerPage, total) => {
    const codesCollection = db().collection('codes');
    var t = 1;
    var n_itemPerPage = itemPerPage;
    if (parseInt(total) >= parseInt(pageNumber)*parseInt(itemPerPage))
    {
        t = parseInt(total) - parseInt(pageNumber)*parseInt(itemPerPage) + 1;
    }
    else 
        n_itemPerPage = - parseInt(total) + parseInt(pageNumber)*parseInt(itemPerPage)
    const codes = await codesCollection.find(filter).limit(n_itemPerPage).skip(t).toArray();
    return codes;
}

exports.countCode= async (filter) =>{
    const codesCollection = db().collection('codes');
    const count = await codesCollection.count(filter);
    return count;
}
