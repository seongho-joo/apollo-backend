import { gql } from 'apollo-server-core';

export default gql`
  type Message {
    id: Int!
    message: String!
    read: Boolean!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }
  type Room {
    id: Int!
    unreadTotal: Int!
    users: [User]
    messages: [Message]
    createdAt: String!
    updatedAt: String!
  }
`;
