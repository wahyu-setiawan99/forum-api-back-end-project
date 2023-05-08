const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikeCommentsHandler {
  constructor(container) {
    this._container = container;

    this.likeCommentHandler = this.likeCommentHandler.bind(this);
  }

  async likeCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const { threadId: thread, commentId: comment } = request.params;

    const likeCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);

    await likeCommentUseCase.execute(owner, {
      thread, comment,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikeCommentsHandler;
