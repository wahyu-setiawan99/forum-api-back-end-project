/* eslint-disable class-methods-use-this */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { thread } = useCasePayload;
    const threads = await this._threadRepository.getDetailThreadById(thread);
    const comments = await this._commentRepository.getCommentByThreadId(thread);
    const replies = await this._replyRepository.getReplyByCommentIds(comments
      .map((comment) => comment.id));

    threads.comments = comments.map((comment) => ({
      ...comment,
      is_delete: undefined,
      replies: replies
        .map((reply) => (reply.comment === comment.id ? {
          id: reply.id,
          content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
          date: reply.date,
          username: reply.username,
        } : undefined))
        .filter((reply) => reply !== undefined),
      content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
    }));

    return threads;
  }

  _validatePayload(payload) {
    const { thread } = payload;
    if (!thread) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetDetailThreadUseCase;
