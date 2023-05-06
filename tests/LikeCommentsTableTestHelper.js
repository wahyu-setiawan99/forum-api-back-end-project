/* eslint-disable camelcase */
/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const LikeCommentsTableTestHelper = {

  async likeComment({
    id = 'like-123',
    comment = 'comment-123',
    owner = 'user-456',
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, comment, owner],
    };

    await pool.query(query);
  },

  async unlikeComment(id) {
    const query = {
      text: 'DELETE comment_likes WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = LikeCommentsTableTestHelper;