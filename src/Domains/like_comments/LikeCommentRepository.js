/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class LikeCommentRepository {
  async likeComment(likeComment, owner) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikedComment(comment, owner) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async commentLikeNumber(comment) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async unlikeComment(comment, owner) {
    throw new Error('LIKECOMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = LikeCommentRepository;
