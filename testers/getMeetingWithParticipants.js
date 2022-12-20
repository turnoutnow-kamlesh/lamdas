const {handlerBatchGetParticipants} = require("../queries/batchGetParticipants")
const {handler} = require("../queries/getItem")


const getAllMeetingsByStatus = async()=>{
    try{
        let resp = await handler("5pzQIClszCuxhMXU7UbhP",'meeting')
        let ids = Object.keys(resp.participants)
        let participantsData = await handlerBatchGetParticipants(resp.eventId,ids)
        let objs = {}
        for(let j of participantsData){
            console.log(j)
            objs[j.id] = j
        }
        resp.organizerId = objs[resp.organizerId]
        resp.requiredParticipant = objs[resp.requiredParticipant.id]
        if(resp.optionalParticipantIds.length){
            let arr = []
            for(let j of resp.optionalParticipantIds){
                if(objs[j]){
                    arr.push(objs[j])
                }
            }
            resp.optionalParticipants = arr
        }
       console.log(resp)
    }catch(err){
        console.log(err)
      }
};
getAllMeetingsByStatus();

