import { usersModel } from "../model/users.js";
const resolvers = {
  Query: {
    users: () => {
      return usersModel;
    },
  },
};
export default resolvers;
