/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class LikeCommentRepository {
  async likeComment(comment, owner) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikedComment(comment, owner) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async commentLikeNumberByThreadId(thread) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlikeComment(comment, owner) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeCommentRepository;
