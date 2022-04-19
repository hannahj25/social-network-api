const connection = require('../config/connection');
const User = require('../models/User');
const {faker} = require('@faker-js/faker');
 
connection.once('open', async () => {
    console.log('connected');
    await User.deleteMany({});
    for (let index = 0; index < 10; index++) {
        User.create({username: faker.internet.userName(), email: faker.internet.email(), friends: []})
        // const users = [];
    }
})

