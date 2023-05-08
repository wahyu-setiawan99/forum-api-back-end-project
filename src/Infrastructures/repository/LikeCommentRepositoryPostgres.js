const LikeCommentRepository = require('../../Domains/like_comments/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(owner, comment) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_likes VALUES($1, $2, $3)',
      values: [id, owner, comment],
    };

    await this._pool.query(query);
  }

  async unlikeComment(owner, comment) {
    const query = {
      text: 'DELETE FROM comment_likes where owner = $1 AND comment = $2',
      values: [owner, comment],
    };

    await this._pool.query(query);
  }

  async verifyLikedComment(owner, comment) {
    const query = {
      text: 'SELECT * FROM comment_likes where owner = $1 AND comment = $2',
      values: [owner, comment],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async commentLikeNumberByThreadId(thread) {
    const query = {
      text: 'SELECT comment_likes.* FROM comment_likes INNER JOIN comments on comment_likes.comment = comments.id WHERE comments.thread = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeCommentRepositoryPostgres;
