const PostedThread = require('../PostedThread');

describe('a PostedThread entities', () => {
  it('should throw an error when payload do not contain needed propery', () => {
    // Arrange
    const payload = {
      title: 'title of thread',
    };

    // Action and Assert
    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 1234,
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new PostedThread(payload)).toThrowError('POSTED_THREAD.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should create postedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'title of thread',
      owner: 'user-123',
    };

    // Action
    const postedThread = new PostedThread(payload);

    // Assert
    expect(postedThread.id).toEqual(payload.id);
    expect(postedThread.title).toEqual(payload.title);
    expect(postedThread.owner).toEqual(payload.owner);
  });
});
