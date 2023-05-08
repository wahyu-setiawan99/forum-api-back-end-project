const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should throw error if parameter does not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};

    const owner = 'user-456';

    /* creating use case instance */
    const deleteCommentuseCase = new DeleteCommentUseCase({});

    // Action and assert
    await expect(deleteCommentuseCase.execute(owner, useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if parameters are not string', async () => {
    // Arrange
    const useCasePayload = {
      thread: 123,
      comment: 'comment-123',
    };

    const owner = 'user-456';

    /* creating use case instance */
    const deleteCommentuseCase = new DeleteCommentUseCase({});

    // Action and assert
    await expect(deleteCommentuseCase.execute(owner, useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate the delete comment correctly', async () => {
  // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };

    const owner = 'user-456';

    const mockComments = {
      id: 'comment-123',
      content: 'this is a comment',
      owner: 'user-456',
      thread: 'thread-123',
    };

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /* moking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const deleteCommentuseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentuseCase.execute(owner, useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.findCommentById)
      .toHaveBeenCalledWith(useCasePayload.comment);

    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.comment);
  });

  it('should throw Authorization error if not a comment owner', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };

    const owner = 'user-456';

    const mockComments = {
      id: 'comment-123',
      content: 'this is a comment',
      owner: 'user-xxx',
      thread: 'thread-123',
    };

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /* moking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const deleteCommentuseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentuseCase.execute(owner, useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.findCommentById)
      .toHaveBeenCalledWith(useCasePayload.comment);
  });
});
