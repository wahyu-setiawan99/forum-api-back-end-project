class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

   // verify comment belongs to thread

    // verify the ownership of comment

    // for  delete reply also refactor
  async execute(owner, useCasePayload) {
    const postReply = new PostReply(useCasePayload);
    await this._threadRepository.findThreadById(postReply.thread);
    await this._commentRepository.findCommentById(postReply.comment);
    await this._commentRepository
.verifyCommentBelongToThread(postReply.comment, postReply.thread);
    return this._replyRepository.addReply(owner, postReply);
  }
}

module.exports = LikeCommentUseCase;
