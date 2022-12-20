const { checkInshandler }  = require( "../queries/updateMeetingCheckins");
const { handler } = require("../queries/getItem")
const updateMeetingCheckins = async()=>{
    try{
        let resp = await handler("5pzQIClszCuxhMXU7UbhP", "meeting")
        const meetingCheckins = resp.checkIns ? resp.checkIns : []
    
        let obj = {}
        let values = [
            {
                userId: 8177199,
                participantType: 'User',
                checkInStatus: 'Not_Came',
                checkInAt: '2022-12-19T13:11:50.825Z'},
            {   
                userId: 8140810,
                participantType: 'User',
                checkInStatus: 'CheckedOut',
                checkInAt: '2022-12-19T23:27:50.705Z'
            },
            {
                userId: 12884602,
                participantType: 'User',
                checkInStatus: 'CheckedIn',
                checkInAt: '2022-12-19T13:11:50.825Z'
            }
        ]
        let updatedData = []
        if(meetingCheckins.length){
            for(let j of meetingCheckins){
                obj[j.userId] = j
            }
            if(values.length){
            for(let k of values){
                if(obj[k.userId]){
                    obj[k.userId].checkInStatus!=k.checkInStatus ? obj[k.userId]=k:null;
                }else{
                    obj[k.userId] = k
                    }
                }
            }
            updatedData = Object.values(obj)
        }else{
            updatedData = values
        }

        let resp2 = await checkInshandler('5pzQIClszCuxhMXU7UbhP',updatedData)
        console.log(resp2)
    }catch(err){
        console.log(err)
      }
};
updateMeetingCheckins();
