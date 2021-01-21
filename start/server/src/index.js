require('dotenv').config();

const {ApolloServer} = require("apollo-server");
const LaunchAPI = require("./datasources/launch");
const UserAPI = require('./datasources/user')
const typeDefs = require("./schema")
const {createStore} = require('./utils')
const resolvers = require('./resolvers');
const IsEmail = require("isemail");

const store = createStore()

const server = new ApolloServer(
    {   context: async ({req}) => {
            //const auth = req.headers.authorizaton
            const email = Buffer.from(req.headers.authorization || "", 'base64').toString('ascii')
            if(!IsEmail.validate(email)) return {user: null}
            const users = await store.users.findOrCreate({where: {email}})
            const user = users && users[0] || null
            //user.token = req.headers.authorization
            return {user: {...user.dataValues}}
        },
        typeDefs,
        resolvers,
        dataSources: () => ({
            launchAPI: new LaunchAPI(),
            userAPI: new UserAPI({store})
        })
    }
)

server.listen().then(() => {
    console.log(
        `Server is running! 
        Listening to port 4000
    `); 
})