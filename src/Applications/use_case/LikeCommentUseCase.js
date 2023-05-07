/* eslint-disable class-methods-use-this */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeCommentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeCommentRepository = likeCommentRepository;
  }

  async execute(owner, useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread, comment } = useCasePayload;

    await this._threadRepository.findThreadById(thread);

    const checkComment = await this._commentRepository.findCommentById(comment);

    // verify the ownership of comment
    if (checkComment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini!');
    }

    // verify comment belongs to thread
    if (checkComment.thread !== thread) {
      throw new NotFoundError('komentar tidak ditemukan pada thread yang dimaksud');
    }

    // verify if deleted
    if (checkComment.is_delete) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    await this._likeCommentRepository.verifyLikedComment(comment, owner);
  }

  _validatePayload(payload) {
    const { thread, comment } = payload;
    if (!thread || !comment) {
      throw new Error('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string') {
      throw new Error('LIKE_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = LikeCommentUseCase;
