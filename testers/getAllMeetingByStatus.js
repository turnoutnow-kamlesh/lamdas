const {handler} = require("../queries/getAllMeetingByStatus")


const getAllMeetingsByStatus = async()=>{
    try{
        let resp = await handler("olVYX2q4SOBUScjFVCGhx",'ACCEPTED')
        console.log(resp)
    }catch(err){
        console.log(err)
      }
};
getAllMeetingsByStatus();

