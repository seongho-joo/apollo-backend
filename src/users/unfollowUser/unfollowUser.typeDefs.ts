const { gql } = require('apollo-server');

export default gql`
  type UnfollowUserResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    unfollowUser(username: String!): UnfollowUserResult!
  }
`;
