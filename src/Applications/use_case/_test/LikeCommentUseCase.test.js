const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeCommentRepository = require('../../../Domains/like_comments/LikeCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommenttUseCase', () => {
  /*
  Orchestrate steps in liking and unliking the comment
  */
  it('should orchestrate the process of liking a comment correctly', async () => {
  // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };

    const owner = 'user-123';

    const mockComments = {
      id: useCasePayload.comment,
      content: 'this is a comment',
      owner,
      thread: useCasePayload.thread,
    };

    const mockLikedComment = [];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    /* moking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    mockLikeCommentRepository.verifyLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockLikedComment));

    mockLikeCommentRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Action
    await likeCommentUseCase.execute(owner, useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadById)
      .toBeCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.findCommentById)
      .toBeCalledWith(useCasePayload.comment);

    expect(mockLikeCommentRepository.verifyLikedComment)
      .toBeCalledWith(owner, useCasePayload.comment);

    expect(mockCommentRepository.likeComment)
      .toBeCalledWith(owner, useCasePayload.comment);
  });

  it('should orchestrate the process of unliking a comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };

    const owner = 'user-123';

    const mockComments = {
      id: useCasePayload.comment,
      content: 'this is a comment',
      owner,
      thread: useCasePayload.thread,
    };

    const mockLikedComment = [{
      id: 'like-123',
      owner: 'user-123',
      comment: 'comment-123',
    }];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    /* moking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    mockLikeCommentRepository.verifyLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockLikedComment));

    mockLikeCommentRepository.unlikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Action
    await likeCommentUseCase.execute(owner, useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadById)
      .toBeCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.findCommentById)
      .toBeCalledWith(useCasePayload.comment);

    expect(mockLikeCommentRepository.verifyLikedComment)
      .toBeCalledWith(owner, useCasePayload.comment);

    expect(mockCommentRepository.unlikeComment)
      .toBeCalledWith(owner, useCasePayload.comment);
  });
});
