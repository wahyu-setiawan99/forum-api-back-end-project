const PostedComment = require('../PostedComment');

describe('a PostedComment entities', () => {
  it('should throw an error when payload do not contain needed propery', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostedComment(payload)).toThrowError('POSTED_COMMENT.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create PostedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'comments',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new PostedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
