const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');
const PostReplyUseCase = require('../../../../Applications/use_case/PostReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId: thread, commentId: comment } = request.params;

    const postReplyUseCase = this._container.getInstance(PostReplyUseCase.name);
    const addedReply = await postReplyUseCase.execute(owner, {
      content, comment, thread,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request) {
    const { id: owner } = request.auth.credentials;

    const { threadId: thread, commentId: comment, replyId: reply } = request.params;

    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

    await deleteReplyUseCase.execute(owner, {
      thread, comment, reply,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = RepliesHandler;
