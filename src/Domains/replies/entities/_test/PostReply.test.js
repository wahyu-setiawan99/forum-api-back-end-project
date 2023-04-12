const PostReply = require('../PostReply');

describe('a PostReply entities', () => {
  it('should throw an error when payload do not contain needed propery', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet the data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      comment: 'comment-123',
      thread: 'thread-123',
    };

    // Action and Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should throw error when content is more than 250 characters', () => {
    // Arrange
    const payload = {
      content: 'this is the bodyLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam auctor, lorem a convallis accumsan, nibh eros sagittis elit, vel molestie lacus velit a urna. Ut at tellus sapien. Maecenas vitae scelerisque est. Nam condimentum mauris vel tellus iaculis pellentesque. Donec malesuada risus sed enim ullamcorper mollis sed id magna. Cras sodales eleifend felis, varius volutpat elit facilisis ut. Praesent tellus lacus, bibendum vitae ullamcorper eget, molestie a enim. Fusce magna nunc, mattis lacinia tincidunt eu, sodales a ligula. Nulla quis ligula non justo cursus luctus. Pellentesque sit amet sodales tortor. Suspendisse hendrerit dictum arcu, non luctus tellus ornare id',
      comment: 'comment-123',
      thread: 'thread-123',
    };

    // Action and Assert
    expect(() => new PostReply(payload)).toThrowError('POST_REPLY.CONTENT_LIMIT_CHAR');
  });

  it('should create PostReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'reply',
      comment: 'comment-123',
      thread: 'thread-123',
    };

    // Action
    const {
      content, comment, thread,
    } = new PostReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(comment).toEqual(payload.comment);
    expect(thread).toEqual(payload.thread);
  });
});
