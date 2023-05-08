const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

/* eslint-disable class-methods-use-this */
class DeleteReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(owner, useCasePayload) {
    this._validatePayload(useCasePayload);
    const {
      thread, comment, reply,
    } = useCasePayload;

    await this._threadRepository.findThreadById(thread);

    const checkComment = await this._commentRepository.findCommentById(comment);

    if (checkComment.thread !== thread) {
      throw new NotFoundError('komentar tidak ditemukan pada thread yang dimaksud');
    }

    const checkReply = await this._replyRepository.findReplyById(reply);

    if (checkReply.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini!');
    }

    if (checkReply.comment !== comment) {
      throw new NotFoundError('reply tidak terdapat pada komentar yang dimaksud');
    }

    if (checkReply.is_delete) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    await this._replyRepository.deleteReply(reply);
  }

  _validatePayload(payload) {
    const {
      thread, comment, reply,
    } = payload;
    if (!thread || !comment || !reply) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string' || typeof reply !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
