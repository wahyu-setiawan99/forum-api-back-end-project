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
      .mockImplementation(() => Promise.resolve());

    mockLikeCommentRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

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
      .toBeCalledWith(useCasePayload.comment, owner);
  });
});
