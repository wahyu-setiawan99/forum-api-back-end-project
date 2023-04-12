const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const PostCommentUseCase = require('../../../../Applications/use_case/PostCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId: thread } = request.params;
    const postCommentUseCase = this._container.getInstance(PostCommentUseCase.name);
    const addedComment = await postCommentUseCase.execute(owner, { content, thread });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const { id: owner } = request.auth.credentials;

    const { threadId: thread, commentId: comment } = request.params;

    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

    await deleteCommentUseCase.execute(owner, { thread, comment });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
