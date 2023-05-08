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

    await this._replyRepository.verifyReplyOwner(reply, owner);
    await this._replyRepository.verifyReplyBelongToComment(reply, comment);
    await this._replyRepository.verifyReplyDeletion(reply);
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
