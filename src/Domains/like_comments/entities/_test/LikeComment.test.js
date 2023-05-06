const LikeComment = require('../LikeComment');

describe('a LikeComment entities', () => {
  it('should throw an error when payload do not contain needed propery', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new LikeComment(payload)).toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet the data type specification', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 123,
    };

    // Action and Assert
    expect(() => new LikeComment(payload)).toThrowError('LIKE_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create LikeComment object correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
    };

    // Action
    const { thread, comment } = new LikeComment(payload);

    // Assert
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
  });
});
