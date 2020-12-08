const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();

const schema = buildSchema(
  `
  type Query {
    pet(id: Int!): Pet
  },
  type Mutation {
    updatePetName(id: Int!, newName: String!): Pet
  },
  type Pet {
    id: Int
    name: String
    animalType: String
    breed: String
    age: Int
    favoriteTreat: String
  },
  `
);

var pets = [
  {
    id: 1,
    name: 'Foo',
    animalType: 'Doge',
    breed: 'supermutt',
    age: 3,
    favoriteTreat: 'rawhides'
  }
];

var getPet = (arguments) => {
  let id = arguments.id;
  return pets.filter((pet) => {
    return pet.id == id;
  })[0]
};

var changePetName = (id, newName) => {
  pets.map((pet) => {
    if(pet.id === id) {
      pet.name = newName;
      return pet;
    }
  })
  return pets.filter((pet) => {
    pet.id === id
  })[0]
};


const root_resolver = {
  pet: getPet,
  updatePetName: changePetName
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root_resolver,
  graphiql: true
}));

app.listen(3000, () => console.log('Express and GraphQL running on localhost:3000/graphql'));
