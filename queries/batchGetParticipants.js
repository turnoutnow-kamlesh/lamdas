const { batchGetParticipants } = require("../crudFunctions/functions")

exports.handlerBatchGetParticipants = async(eventId,ids) => {
    try{
        return await batchGetParticipants(eventId,ids)
    }catch(err){
        console.log(err)
        throw err;
    }
};