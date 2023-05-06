// class LikeCommentReplyUseCase {
//   constructor({ threadRepository, commentRepository, replyRepository }) {
//     this._threadRepository = threadRepository;
//     this._commentRepository = commentRepository;
//     this._replyRepository = replyRepository;
//   }

//   async execute(owner, useCasePayload) {
//     const postReply = new PostReply(useCasePayload);
//     await this._threadRepository.findThreadById(postReply.thread);
//     await this._commentRepository.findCommentById(postReply.comment);
//     await this._commentRepository
// .verifyCommentBelongToThread(postReply.comment, postReply.thread);
//     return this._replyRepository.addReply(owner, postReply);
//   }
// }

// module.exports = LikeCommentReplyUseCase;
