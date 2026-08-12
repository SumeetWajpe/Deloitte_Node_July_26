const typeDefs = `#graphql
type Query{
    users:[User]
    user(id:ID!):User
}

type Mutation{
    addUser(newUser:UserInput!):User
}

type User{
    id:ID
    name:String
    age:Int 
    email:String
}
input UserInput{
    id:ID
    name:String
    age:Int 
    email:String
}

`;

export default typeDefs;
