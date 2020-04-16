const { GraphQLServer } = require('graphql-yoga');
const models  = require('./models');



const typeDefs = `
  scalar DateTime
  type Query {
    allUsers: [User!]
    getUser(userId: ID!): User
    allTeams(owner: ID!): [Team!]
    getTeam(teamId: ID!): Team
    userIsMemberOf(userId: ID!): [Team!]
    getTeamMembers(teamId: ID!): [User!]
    allChannels(teamId: ID!): [Channel!]
    getChannel(channelId: ID!): Channel
    getUserMessagesInChannel(userId: ID!, channelId: ID!): [Message!]
    getMessagesOfChannel(channelId: ID!): [Message!]
  }
  type Mutation {
      createUser(username: String!,password: String!,email: String!): Boolean!
      updateUser(id: ID!,username: String, password: String, email: String): Boolean!
      deleteUser(id: ID!): Boolean!
      joinTeam(userId: ID!,teamId: ID!): Boolean
      createTeam(name: String!, owner: ID!) : Boolean!
      updateTeam(id: ID!,name: String!, owner: ID!) : Boolean!
      deleteTeam(id: ID!) : Boolean!
      createChannel(name: String!, teamId: ID!, public: Boolean!) : Boolean!
      updateChannel(id: ID!,name: String!, teamId: ID!, public: Boolean!) : Boolean!
      deleteChannel(id: ID!) : Boolean!
      createMessage(text: String!, userId: ID!, channelId: ID!) : Boolean!
      updateMessage(id: ID!,text: String!, userId: ID!, channelId: ID!) : Boolean!
      deleteMessage(id: ID!) : Boolean!
  }
  type User {
      id: ID!
      username: String!
      password: String!
      email: String!
      createdAt: DateTime!
      updatedAt: DateTime!
  }
  type Team {
    id: ID!
    name: String!
    owner: User!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type Channel {
    id: ID!
    name: String!
    teamId: Team!
    public: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type Message {
    id: ID!
    text: String!
    userId: User!
    channelId: Channel!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  type Member {
      teamId: Team!
      userId: User!
      createdAt: DateTime!
      updatedAt: DateTime!
  }
`

const resolvers = {
  Query: {
    allUsers: async(root,args)=> await models.User.findAll(),
    getUser: async(root,args)=> await models.User.findOne({where:{id:args.userId}}),
    allTeams: async(root,args)=> await models.Team.findAll({where:{owner:args.owner}}),
    userIsMemberOf: async(root,args)=> {
            const teams=await models.Team.findAll({
            includeIgnoreAttributes: false,
            include: [{
                model: models.User,
                required: true,
                where: {id: args.userId}
             }]
            });
            let teamsArray= teams.map((team)=>{
                return team.dataValues;
            });
            return teamsArray;
    },
    getTeamMembers: async (root,args)=>{
            const members=await models.User.findAll({
            includeIgnoreAttributes: false,
            include: [{
                model: models.Team,
                required: true,
                where: {id: args.teamId}
             }]
            });
            let membersArray= members.map((member)=>{
                return member.dataValues;
            });
            return membersArray;
    },
    getTeam:async(root,args)=>{
        try{
            const team=await models.Team.findOne({where:{id:args.teamId}});
            const usr=await models.User.findOne({where:{id:team.dataValues.owner}});
            return {...team.dataValues,owner: usr.dataValues}
        }catch(err){
            return null;
        }
    },
    allChannels: async(root,args)=>{
        let channels=await models.Channel.findAll({where:{teamId:args.teamId}});
        let channelsArray= channels.map((channel)=>{
            return channel.dataValues;
        });
        return channelsArray;
    },
    getChannel: async(root,args)=>{
        const channel=await models.Channel.findOne({ where:{id:args.channelId}});
        return channel.dataValues;
    },
    getUserMessagesInChannel: async(root,args)=>{
        const messages=await models.Message.findAll({ where:{userId:args.userId,channelId:args.channelId}});
        let messagesArray= messages.map((message)=>{
            return message.dataValues;
        });
        return messagesArray;
    },
    getMessagesOfChannel: async(root,args)=>{
        const messages=await models.Message.findAll({ where:{channelId:args.channelId}});
        let messagesArray= messages.map((message)=>{
            return message.dataValues;
        });
        return messagesArray;
    }
  },
  Mutation: {
      createUser:async (root,args)=> {
          try{
            await models.User.create({ username: args.username, password: args.password, email: args.email});
            return true;
          }catch(err){
            console.log(err);
            return false;
          }
      },
      joinTeam: async(root,args)=>{
        try{
            await models.Member.create({ userId: args.userId, teamId:args.teamId });
            return true;
          }catch(err){
            console.log(err);
            return false;
          }
      }
      ,
      updateUser: async (root,args)=> {
         try{
             await models.User.update({ username: args.username, password: args.password, email: args.email},{where:{id:args.id}});
             return true;
         }catch(err){
             console.log(err);
             return false;
         }
        
      },
      deleteUser: async (root,args)=> {
          try{
             await models.User.destroy({where:{id:args.id}});
             return true;
          }catch(err){
                console.log(err);
                return false;
          }
      },
      createTeam: async(root,args)=>{
            try{
                await models.Team.create({...args});
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
      },
      updateTeam: async(root,args)=>{
            try{
                await models.Team.update({...args},{where:{id:args.id}});
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
      },
      deleteTeam: async (root,args)=> {
          try{
             await models.Team.destroy({where:{id:args.id}});
             return true;
          }catch(err){
                console.log(err);
            return false;
          }
      },
      createChannel: async(root,args)=>{
            try{
                await models.Channel.create({...args});
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
      },
      updateChannel: async(root,args)=>{
            try{
                await models.Channel.update({...args},{where:{id:args.id}});
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
      },
      deleteChannel: async (root,args)=> {
          try{
             await models.Channel.destroy({where:{id:args.id}});
             return true;
          }catch(err){
                console.log(err);
            return false;
          }
      },
      createMessage: async(root,args)=>{
            try{
                await models.Message.create({...args});
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
      },
      updateMessage: async(root,args)=>{
            try{
                await models.Message.update({...args},{where:{id:args.id}});
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
      },
      deleteMessage: async (root,args)=> {
          try{
             await models.Message.destroy({where:{id:args.id}});
             return true;
          }catch(err){
                console.log(err);
            return false;
          }
      },
  },
  Channel:{
      teamId:async (root,args)=>{
            const team=await models.Team.findOne({where:{id: root.teamId}});
            return {...team.dataValues}
      }
  },
  Message:{
    userId:async (root,args)=>{
        const usr=await models.User.findOne({where:{id:root.userId}});
        console.log(usr.dataValues);
        return {...usr.dataValues}
    },
    channelId: async(root,args)=>{
        const channel=await models.Channel.findOne({where:{id:root.channelId}});
        return {...channel.dataValues}
    }
  },
  Team:{
      owner: async(root,args)=>{
        const usr=await models.User.findOne({where:{id:root.owner}});
        return {...usr.dataValues}
      }
    },
    Member:{
        teamId: async(root,args)=>{
            const team=await models.Team.findOne({where:{id: root.teamId}});
            return {...team.dataValues}
        },
        userId: async(root,args)=>{
            const usr=await models.User.findOne({where:{id:root.userId}});
            return {...usr.dataValues}
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers })

// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function () {
    server.start(() => console.log('Server is running on localhost:4000'))
});







// const teams=await models.Team.findAll({
//     includeIgnoreAttributes: false,
//     include: [{
//         model: models.User,
//         required: true,
//         where: {id: args.userId}
//      }]
//     });
//     let teamsArray= teams.map((team)=>{
//         return team.dataValues;
//     });
//     let completeArray= teamsArray.map(async team=>{
//         const usr=await models.User.findOne({where:{id:team.owner}});
//         return {...team,owner: usr.dataValues}                
//     })
//     const results = await Promise.all(completeArray)
//     return results;