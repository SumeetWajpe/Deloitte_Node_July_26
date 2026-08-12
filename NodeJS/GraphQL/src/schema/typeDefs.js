const typeDefs = `#graphql
type Query{
    users:[User]
}

type User{
    id:ID
    name:String
    age:Int 
    email:String
}


`;

export default typeDefs;
