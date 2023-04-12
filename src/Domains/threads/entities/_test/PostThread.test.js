const PostThread = require('../PostThread');

describe('a PostThread entities', () => {
  it('should throw an error when payload do not contain needed propery', () => {
    // Arrange
    const payload = {
      title: 'title of thread',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when payload did not meet the data type specification', () => {
    // Arrange
    const payload = {
      title: 12345,
      body: 'this is the thread body',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.NOT_MEET_DATA_SPECIFICATION');
  });

  it('should throw error when title is more than 70 characters', () => {
    // Arrange
    const payload = {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi risus lorem, vulputate at egestas hendrerit ',
      body: 'this is the body',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should throw error when body is more than 250 characters', () => {
    // Arrange
    const payload = {
      title: 'this is the title',
      body: 'this is the bodyLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam auctor, lorem a convallis accumsan, nibh eros sagittis elit, vel molestie lacus velit a urna. Ut at tellus sapien. Maecenas vitae scelerisque est. Nam condimentum mauris vel tellus iaculis pellentesque. Donec malesuada risus sed enim ullamcorper mollis sed id magna. Cras sodales eleifend felis, varius volutpat elit facilisis ut. Praesent tellus lacus, bibendum vitae ullamcorper eget, molestie a enim. Fusce magna nunc, mattis lacinia tincidunt eu, sodales a ligula. Nulla quis ligula non justo cursus luctus. Pellentesque sit amet sodales tortor. Suspendisse hendrerit dictum arcu, non luctus tellus ornare id',
    };

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError('POST_THREAD.BODY_LIMIT_CHAR');
  });

  it('should create postThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'title of thread',
      body: 'this is the body of thread',
    };

    // Action
    const { title, body } = new PostThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
