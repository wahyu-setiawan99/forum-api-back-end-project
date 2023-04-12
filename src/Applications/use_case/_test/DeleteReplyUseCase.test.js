const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};

    const owner = 'user-123';

    /* creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action and assert
    await expect(deleteReplyUseCase.execute(owner, useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if parameters are not string', async () => {
    // Arrange
    const useCasePayload = {
      thread: 123,
      comment: 'comment-123',
      reply: 'reply-123',
    };

    const owner = 'user-123';

    /* creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action and assert
    await expect(deleteReplyUseCase.execute(owner, useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrate the delete reply correctly', async () => {
  // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      reply: 'reply-123',
    };

    const owner = 'user-123';

    /* creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /* moking needed function */
    mockThreadRepository.findThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.findCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentBelongToThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyBelongToComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyDeletion = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(owner, useCasePayload);

    // Assert
    expect(mockThreadRepository.findThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.findCommentById)
      .toHaveBeenCalledWith(useCasePayload.comment);

    expect(mockCommentRepository.verifyCommentBelongToThread)
      .toHaveBeenCalledWith(useCasePayload.comment, useCasePayload.thread);

    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith(useCasePayload.reply, owner);

    expect(mockReplyRepository.verifyReplyBelongToComment)
      .toHaveBeenCalledWith(useCasePayload.reply, useCasePayload.comment);

    expect(mockReplyRepository.verifyReplyDeletion)
      .toHaveBeenCalledWith(useCasePayload.reply);

    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCasePayload.reply);
  });
});
