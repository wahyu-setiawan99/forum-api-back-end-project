const CommentRepository = require('../../../Domains/comments/CommentRepository');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PostCommentUseCase = require('../PostCommentUseCase');

describe('PostCommentUseCase', () => {
  /*
  Orchestrate steps in posting a comment
  */
  it('should orchestrate the post comment correctly', async () => {
  // Arrange
    const useCasePayload = {
      content: 'comment',
      thread: 'thread-123',
    };

    const owner = 'user-123';

    const mockPostedComment = new PostedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    /* creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /* moking needed function */
    mockThreadRepository.findThreadById = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockPostedComment));

    /* creating use case instance */
    const postCommentuseCase = new PostCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const postedComment = await postCommentuseCase.execute(owner, useCasePayload);

    // Assert
    expect(postedComment).toStrictEqual(new PostedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123',
    }));

    expect(mockThreadRepository.findThreadById).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment).toBeCalledWith(owner, new PostComment({
      content: useCasePayload.content,
      thread: useCasePayload.thread,
    }));
  });
});
