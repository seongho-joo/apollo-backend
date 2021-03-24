import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    edtitProfile(
      firstName: String
      lastName: String
      username: String
      email: String
      password: String
      bio: String
      avatar: Upload
    ): MutationResponse!
  }
`;
