const { getAllMeetings } = require("../crudFunctions/functions")

exports.handler = async(eventId) => {
    try{
        return await getAllMeetings(eventId)
    }catch(err){
        console.log(err)
        throw err;
    }
};