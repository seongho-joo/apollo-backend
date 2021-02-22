import client from '../client';

export default {
  Mutation: {
    createMovie: (_, { title, year, genre }) =>
      client.movies.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    deleteMovie: (_, { id }) => client.movies.delete({ where: { id } }),
    updateMovie: (_, { id, title, year, genre }) =>
      client.movies.update({
        where: {
          id,
        },
        data: {
          title,
          year,
          genre,
        },
      }),
  },
};
