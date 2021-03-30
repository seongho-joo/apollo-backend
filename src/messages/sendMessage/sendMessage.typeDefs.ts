import { gql } from 'apollo-server-core';

export default gql`
  type Mutation {
    sendMessage(message: String!, roomId: Int, userId: Int): MutationResponse!
  }
`;
