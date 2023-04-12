const PostComment = require('../../Domains/comments/entities/PostComment');

class PostCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, useCasePayload) {
    const postComment = new PostComment(useCasePayload);
    await this._threadRepository.findThreadById(postComment.thread);
    return this._commentRepository.addComment(owner, postComment);
  }
}

module.exports = PostCommentUseCase;
