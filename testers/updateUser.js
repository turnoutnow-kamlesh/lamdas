const { handler }  = require( "../queries/updateUser");
const updateUser = async()=>{
    try{
        let resp = await handler("olVYX2q4SOBUScjFVCGhx", "8177219",{
            email: "william.james@turnoutnow.com",
            firstName: "William",
            lastName: "James",
            jobTitle:"Tech Lead"
        })
        console.log(resp)
    }catch(err){
        console.log(err)
      }
};
updateUser();

