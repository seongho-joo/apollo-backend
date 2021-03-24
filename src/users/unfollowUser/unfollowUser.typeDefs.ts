const { gql } = require('apollo-server');

export default gql`
  type Mutation {
    unfollowUser(username: String!): MutationResponse!
  }
`;
