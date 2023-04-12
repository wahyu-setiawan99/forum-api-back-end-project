const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentssHandler = new CommentsHandler(container);
    server.route(routes(commentssHandler));
  },
};
