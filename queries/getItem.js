const { getItemById } = require("../crudFunctions/functions")

exports.handler = async(eventId,userId,type) => {
    try{
        return await getItemById(eventId,userId,type)
    }catch(err){
        console.log(err)
        throw err;
    }
};