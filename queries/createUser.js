const {createUser} = require("../crudFunctions/functions");
const ULID = require("ulid");

exports.createhandler = async(event, context)=>{
    try {
        // Fetch user properties that are available in event object
        const {eventId, firstName, lastName, jobTitle, company, country, profileImageUrl} = event.arguments;

        // const userId = ULID.ulid();

        // For testing conditional statement demo id is used.
        const userId = "01GMQJY6K2H8Q4N62VVRYHZGGR"

        // Attempt user creation
        return await createUser(eventId, userId, firstName, lastName, jobTitle, company, country, profileImageUrl);
    } catch (error) {
        console.error(error);
        throw error;
    }
};