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
    const problem = await problemsCollection.findOne({_id: ObjectId(id)})
    return problem;
}
