require('dotenv').config()
const {
    DynamoDBClient,
    GetItemCommand,
    QueryCommand,
    PutItemCommand,
    UpdateItemCommand,
    BatchGetItemCommand
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");



let dynamoDbclient;
const initDynamoDBClient = () => {
    // Initialize DynamoDB client if existing one is not available for reuse
    if (!dynamoDbclient) {
        dynamoDbclient = new DynamoDBClient({ region: process.env.AWS_REGION });
    };
};
exports.getItemById = async(eventId,userId,type) =>{
    initDynamoDBClient();
    const input = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: type=="event"?marshall({
            "PK": `EVENT#${eventId}#USER#${userId}`,
            "SK": `EVENT#${eventId}#USER#${userId}`
        }):marshall({
            "PK": `MEETING#${eventId}`,
            "SK": `MEETING#${eventId}`
        })
    };
    const result = await dynamoDbclient.send(new GetItemCommand(input));
    console.log(result)
    if (result && result.Item) {
        return unmarshall(result.Item);
    };
};

exports.getAllMeetings = async(eventId) => {
    initDynamoDBClient()
    const input = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        IndexName: "GSI1PK-GSI1SK-index",
        ScanIndexForward: true,
        KeyConditionExpression: "#GSI1PK = :GSI1PK",
        ExpressionAttributeNames: {
            "#GSI1PK": "GSI1PK",
        },
        ExpressionAttributeValues: marshall({
            ":GSI1PK": `EVENT#${eventId}#MEETING`,
        })
    };
    const result = await dynamoDbclient.send(new QueryCommand(input));
    if (result && result.Items?.length > 0) {
        return result.Items.map(Item => unmarshall(Item));
    };
};

exports.getAllMeetingsByStatus = async(eventId,type) => {
    console.log(eventId,type)
    initDynamoDBClient()
    const input = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        IndexName: "GSI1PK-GSI1SK-index",
        ScanIndexForward: true,
        KeyConditionExpression: "#GSI1PK = :GSI1PK AND begins_with(#GSI1SK, :GSI1SK)",
        ExpressionAttributeNames: {
            "#GSI1PK": "GSI1PK",
            "#GSI1SK": "GSI1SK",
            
        },
        ExpressionAttributeValues: marshall({
            ":GSI1PK": `EVENT#${eventId}#MEETING`,
            ":GSI1SK": `${type}`
        })
    };
    const result = await dynamoDbclient.send(new QueryCommand(input));
    if (result && result.Items?.length > 0) {
        return result.Items.map(Item => unmarshall(Item));
    };
};


exports.batchGetParticipants = async(eventId,ids) =>{
    initDynamoDBClient();

    if (ids && Array.isArray(ids) && ids.length > 0) {
        const allUsers = [];        // Store list of all users
        const batchSize = 100;      // DynamoDB can only return up to 100 items with BatchGetItemCommand
        do {
            // Create a batch of 100 ids and remove this batch from the original list of ids
            // With each iteration, the original list of ids will be reduced by 100, until no more ids are left
            const batch = ids.splice(0, batchSize);

            // Set the input parameters
            const input = {
                RequestItems: {
                    [process.env.DYNAMODB_TABLE_NAME]: {
                        Keys: batch.map(id => marshall({
                            "PK": `EVENT#${eventId}#USER#${id}`,
                            "SK": `EVENT#${eventId}#USER#${id}`
                        })),
                        ProjectionExpression: "id, firstName, lastName, jobTitle, company, profileImageUrl"
                    }
                }
            };
            // Retrieve the item from DynamoDB
            const result = await dynamoDbclient.send(new BatchGetItemCommand(input));
            const users = result?.Responses && result.Responses[process.env.DYNAMODB_TABLE_NAME];
            if (users && users.length > 0) {
                // Add user from this batch to the list of all users
                allUsers.push(...users.map(user => unmarshall(user)));
            };
        }
        while (ids.length > 0);     // Loop through the list of original ids until none are left to fetch

        // Return the list of all users to the caller
        return allUsers;
    };

};
    


    exports.updateUser = async (eventId, userId,data) => {
        // Initialize DynamoDB client if existing one is not available for reuse
        initDynamoDBClient();
    
        let str = "SET"
        let attrNames = {}
        for(let j of Object.keys(data)){
            str+= ` #${j} = :${j},`
            attrNames[`#${j}`] = j
        }
        let attrValues = {}
        for(let x in data){
            attrValues[`:${x}`] = data[x]
        }
        // Set the input parameters
        const input = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({
                "PK": `EVENT#${eventId}#USER#${userId}`,
                "SK": `EVENT#${eventId}#USER#${userId}`
            }),
            UpdateExpression:str.slice(0,-1),
            ExpressionAttributeNames: attrNames,
            ExpressionAttributeValues:marshall(attrValues)
        };
    
        return await dynamoDbclient.send(new UpdateItemCommand(input));
    }


    exports.updateMeetingCheckIns = async (meetingId,data) => {
        // Initialize DynamoDB client if existing one is not available for reuse
        initDynamoDBClient();
    
        // Set the input parameters
        const input = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({
                "PK": `MEETING#${meetingId}`,
                "SK": `MEETING#${meetingId}`
            }),
            // UpdateExpression: "SET #firstName = :firstName, #lastName = :lastName, #jobTitle = :jobTitle, #company = :company, #country = :country, #profileImageUrl = :profileImageUrl, #updatedAt = :updatedAt",
            UpdateExpression: "SET #checkIns = :checkIns, #createdAt = if_not_exists(#createdAt, :createdAt) ADD #count :count",
            ExpressionAttributeNames: {
                "#checkIns": "checkIns",
                "#count": "count",
                "#createdAt":"createdAt",
            },
            ExpressionAttributeValues: marshall({
                ":checkIns": data,
                ":count" : 1,
                ":createdAt":new Date().toISOString()
                // ":company": company,
                // ":country": country,
                // ":profileImageUrl": profileImageUrl,
                // ":updatedAt": new Date().toISOString()
            })
        };
    
        return await dynamoDbclient.send(new UpdateItemCommand(input));
    }

    exports.createUser = async (eventId, userId, firstName, lastName, jobTitle, company, country, profileImageUrl) => {
        // Initialize DynamoDB client if existing one is not available for reuse
        initDynamoDBClient();
        // Set the input parameters
        const input = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            // Create user record
            Item: marshall({
                "PK": `EVENT#${eventId}#USER#${userId}`,
                "SK": `EVENT#${eventId}#USER#${userId}`,
                "type": "User", // Hard-coded type for "user" entity
                "GSI1PK": `EVENT#${eventId}#USERS`,
                "GSI1SK": `USER#${lastName}#${firstName}#${userId}`,
                "eventId": eventId,
                "id": userId,
                "firstName": firstName,
                "lastName": lastName,
                "jobTitle": jobTitle,
                "company": company,
                "country": country,
                "profileImageUrl": profileImageUrl,
                "createdAt": new Date().toISOString(),
                "updatedAt": new Date().toISOString()
            }),
            ConditionExpression: "attribute_not_exists(id)"
        };
        return await dynamoDbclient.send(new PutItemCommand(input));
    };