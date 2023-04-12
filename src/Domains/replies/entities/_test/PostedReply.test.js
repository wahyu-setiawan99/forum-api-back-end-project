const PostedReply = require('../PostedReply');

describe('a PostedReply entities', () => {
  it('should throw an error when payload do not contain needed propery', () => {
    // Arrange
    const payload = {
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 123,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostedReply(payload)).toThrowError('POSTED_REPLY.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create PostedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'replies',
      owner: 'user-123',
    };

    // Action
    const { id, content, owner } = new PostedReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
