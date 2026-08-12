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
};
export default resolvers;
