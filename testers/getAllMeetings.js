const {handler} = require("../queries/getAllMeetings")


const getAllMeetings = async()=>{
    try{
        let resp = await handler("olVYX2q4SOBUScjFVCGhx")
        console.log(resp)
    }catch(err){
        console.log(err)
      }
};
getAllMeetings();

