const { handler }  = require( "../queries/updateUser");
const updateUser = async()=>{
    try{
        let resp = await handler("olVYX2q4SOBUScjFVCGhx", "8177219",{
            email: "james.may@turnoutnow.com",
            firstName: "James",
            lastName: "May",
            jobTitle:"Tester"
        })
        console.log(resp)
    }catch(err){
        console.log(err)
      }
};
updateUser();

