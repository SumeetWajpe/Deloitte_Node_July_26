import { usersModel } from "../model/users.js";
const resolvers = {
  Query: {
    users: () => {
      return usersModel;
    },
    user: (_, { id }) => {
      return usersModel.find(u => u.id == id);
    },
  },
  Mutation: {
    addUser: (_, { newUser }) => {
      let newUserToBeadded = newUser;
      usersModel.push(newUserToBeadded);
      return newUserToBeadded;
    },
  },
};
export default resolvers;
