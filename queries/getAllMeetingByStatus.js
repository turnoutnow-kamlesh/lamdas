const { getAllMeetingsByStatus } = require("../crudFunctions/functions")

exports.handler = async(eventId,type) => {
    try{
        return await getAllMeetingsByStatus(eventId,type)
    }catch(err){
        console.log(err)
        throw err;
    }
};