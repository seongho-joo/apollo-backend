import { gql } from 'apollo-server-core';

export default gql`
  type edtidPhotoResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    editPhoto(id: Int!, caption: String!): edtidPhotoResult!
  }
`;
