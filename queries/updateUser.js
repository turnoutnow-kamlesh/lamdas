const { updateUser } = require("../crudFunctions/functions")

exports.handler = async(eventId,userId,data) => {
    try{
        return await updateUser(eventId,userId,data)
    }catch(err){
        console.log(err)
        throw err;
    }
};