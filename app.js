const express = require('express');
const bodyParser= require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {graphql,buildSchema} = require ('graphql');
const morgan = require('morgan');
const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/graphql',graphqlHTTP({
    // we should name our query and mutation unique
    schema: buildSchema(`
    type Event {
        _id: ID!
        title:String!
        description:String!
        price:Float!
        date:String!
    }

    input EventInput{
        title:String!
        description:String!
        price:Float!
        date:String!
    }
    type RootQuery{
        events:[Event!]!
    }
    type RootMutation{
        createEvent(eventInput:EventInput): Event
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }
    `),
// the function in rootValue just like here a resolver event here is a function
// this function will be called for us by the express-graphql when the incoming request targets the events property

    rootValue:{
        events:()=>{
            return['Romantic, Cooking, Coding']
        },
        // createEvent resolver function recieves arguments 
        createEvent:(args)=>{
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true,
}));

app.get('/',(req,res)=>{
    res.send("hello");
})
app.listen(1000,()=>{
    console.log(`server running on port 1000`)
});

