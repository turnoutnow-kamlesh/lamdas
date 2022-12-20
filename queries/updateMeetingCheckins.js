const { updateMeetingCheckIns } = require("../crudFunctions/functions")

exports.checkInshandler = async(meetingId,data) => {
    try{
        return await updateMeetingCheckIns(meetingId,data)
    }catch(err){
        console.log(err)
        throw err;
    }
};