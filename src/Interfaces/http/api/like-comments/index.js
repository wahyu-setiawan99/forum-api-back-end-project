const LikeCommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likeComments',
  register: async (server, { container }) => {
    const likeCommentsHandler = new LikeCommentsHandler(container);
    server.route(routes(likeCommentsHandler));
  },
};
