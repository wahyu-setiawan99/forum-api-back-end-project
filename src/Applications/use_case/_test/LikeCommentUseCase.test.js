const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostReplyUseCase = require('../PostReplyUseCase');

describe('PostReplytUseCase', () => {
  /*
  Orchestrate steps in posting a reply of comment
  */
  it('should orchestrate the post reply for a comment correctly', async () => {
  // Arrange
    const useCasePayload = {
      content: 'reply',
      comment: 'comment-123',
      thread: 'thread-123',
    };

    const owner = 'user-123';

    const mockPostedReply = new PostedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

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
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockPostedReply));

    /* creating use case instance */
    const postReplyUseCase = new PostReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const postedReply = await postReplyUseCase.execute(owner, useCasePayload);

    // Assert
    expect(postedReply).toStrictEqual(new PostedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.findCommentById).toBeCalledWith(useCasePayload.comment);

    expect(mockCommentRepository.verifyCommentBelongToThread)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.thread);

    expect(mockReplyRepository.addReply).toBeCalledWith(owner, new PostReply({
      content: useCasePayload.content,
      thread: useCasePayload.thread,
      comment: useCasePayload.comment,
    }));
  });
});
