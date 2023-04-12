/* eslint-disable camelcase */
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');
const PostThreadUseCase = require('../../../../Applications/use_case/PostThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const postThreadUseCase = this._container.getInstance(PostThreadUseCase.name);
    const addedThread = await postThreadUseCase.execute(owner, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadHandler(request, h) {
    const { threadId: thread } = request.params;
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);
    const threads = await getDetailThreadUseCase.execute({ thread });

    const response = h.response({
      status: 'success',
      data: {
        thread: threads,
      },
    });

    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
