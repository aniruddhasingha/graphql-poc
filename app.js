require('dotenv').config()
const express = require('express');
const bodyParser= require('body-parser');
const {graphqlHTTP} = require('express-graphql');
const {graphql,buildSchema} = require ('graphql');
const morgan = require('morgan');
const mongoose = require('mongoose')
const app = express();
const PORT=1000;
const Events = [];
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
            return Events;
        },
        // createEvent resolver function recieves arguments 
        createEvent:(args)=>{
            console.log(args);
            const event ={
                _id:Math.random().toString(),
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date:args.eventInput.date
            }

            Events.push(event);
            return event
        }
    },
    graphiql: true,
}));

mongoose.connect('');
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});

