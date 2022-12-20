const {handler} = require("../queries/getItem")
const getData = async()=>{
    try{
        let resp = await handler("oVLKRLmv2aGt0Kj9KPSO8","meeting")
        console.log(resp)
    }catch(err){
        console.log(err)
      }
};

getData();
