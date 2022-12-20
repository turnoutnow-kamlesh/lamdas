const { createhandler } = require("../queries/createUser");
const { faker } = require("@faker-js/faker");

(async () => {
    const eventData = {
        arguments: {
            eventId: "pJVrg0Ko72vvRjWlsxouW",
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            jobTitle: faker.name.jobTitle(),
            company: faker.company.name(),
            country: faker.address.country(),
            profileImageUrl: faker.image.avatar()
        }
    };
    const response = await createhandler(eventData);
    console.log(response)
})();
