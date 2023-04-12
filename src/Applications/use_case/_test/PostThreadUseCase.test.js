const PostedThread = require('../../../Domains/threads/entities/PostedThread');
const PostThread = require('../../../Domains/threads/entities/PostThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostThreadUseCase = require('../PostThreadUseCase');

describe('PostThreadUseCase', () => {
  /*
  Orchestrate steps in posting a thread
  */
  it('should orchestrate the post thread correctly', async () => {
  // Arrange
    const useCasePayload = {
      title: 'title of thread',
      body: 'this is the body of thread',
    };

    const owner = 'user-123';

    const mockPostedThread = new PostedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /* moking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockPostedThread));

    /* creating use case instance */
    const postThreadUseCase = new PostThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const postedThread = await postThreadUseCase.execute(owner, useCasePayload);

    // Assert
    expect(postedThread).toStrictEqual(new PostedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.addThread).toBeCalledWith(owner, new PostThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }));
  });
});
