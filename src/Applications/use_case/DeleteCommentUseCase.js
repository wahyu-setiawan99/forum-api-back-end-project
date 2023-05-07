const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

/* eslint-disable class-methods-use-this */
class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread, comment } = useCasePayload;

    await this._threadRepository.findThreadById(thread);

    const checkComment = await this._commentRepository.findCommentById(comment);

    if (checkComment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini!');
    }

    if (checkComment.thread !== thread) {
      throw new NotFoundError('komentar tidak ditemukan pada thread yang dimaksud');
    }

    if (checkComment.is_delete) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    await this._commentRepository.deleteComment(comment);
  }

  _validatePayload(payload) {
    const { thread, comment } = payload;
    if (!thread || !comment) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
