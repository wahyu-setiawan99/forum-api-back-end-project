const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const PostedReply = require('../../Domains/replies/entities/PostedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(owner, postReply) {
    const { content, comment } = postReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, date, comment, owner],
    };

    const result = await this._pool.query(query);
    return new PostedReply({ ...result.rows[0] });
  }

  async getReplyByCommentId(comment) {
    const query = {
      text: 'SELECT replies.id, replies.content, replies.date, users.username, replies.is_delete FROM replies INNER JOIN users ON replies.owner = users.id WHERE replies.comment = $1 ORDER BY replies.date ASC',
      values: [comment],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    const reply = result.rows[0];

    if (reply.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini!');
    }
  }

  async verifyReplyDeletion(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND is_delete = false',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyBelongToComment(id, comment) {
    const query = {
      text: 'SELECT * FROM replies where id = $1 AND comment = $2',
      values: [id, comment],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('reply tidak terdapat pada komentar yang dimaksud');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
