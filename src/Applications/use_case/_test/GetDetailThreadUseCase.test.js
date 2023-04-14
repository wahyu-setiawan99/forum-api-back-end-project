const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should throw error if parameter does not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action and assert
    await expect(getDetailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if parameters are not string', async () => {
    // Arrange
    const useCasePayload = {
      thread: 123,
    };

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({});

    // Action and assert
    await expect(getDetailThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should show comment deleted indicator if its already deleted or is_delete is true', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    const mockDetailThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockDetailComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'content',
        is_delete: true,
      },
    ];

    const mockDetailReplies = [];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailReplies));

    /* creating use case instance */
    const getDetailThreaduseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getDetailThread = await getDetailThreaduseCase.execute(useCasePayload);

    // Assert
    expect(getDetailThread)
      .toEqual({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            replies: [],
            content: '**komentar telah dihapus**',
          },
        ],
      });

    expect(getDetailThread.comments[0].content)
      .toStrictEqual('**komentar telah dihapus**');

    expect(mockThreadRepository.getDetailThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);
  });

  it('should result reply deleted indicator if its already deleted or is_delete is true', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    const mockDetailThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockDetailComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
    ];

    const mockDetailReplies = [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: 'reply 1',
        date: '2021-08-08T07:59:48.766Z',
        username: 'dicoding',
        is_delete: true,
      },
      {
        id: 'reply-dawUSefwda1Z10Iadawk',
        content: 'new reply',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        is_delete: false,
      },
    ];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailReplies));
    /* creating use case instance */
    const getDetailThreaduseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getDetailThread = await getDetailThreaduseCase.execute(useCasePayload);

    // Assert
    expect(getDetailThread)
      .toEqual({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            replies: [
              {
                id: 'reply-BErOXUSefjwWGW1Z10Ihk',
                content: '**balasan telah dihapus**',
                date: '2021-08-08T07:59:48.766Z',
                username: 'dicoding',
              },
              {
                id: 'reply-dawUSefwda1Z10Iadawk',
                content: 'new reply',
                date: '2021-08-08T07:59:48.766Z',
                username: 'johndoe',
              },
            ],
            content: 'sebuah comment',
          },
        ],
      });

    expect(getDetailThread.comments[0].replies[0].content)
      .toStrictEqual('**balasan telah dihapus**');

    expect(mockThreadRepository.getDetailThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);
  });

  it('should orchestrate the getting detail threads correctly, for both found and deleted content', async () => {
  // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    const mockDetailThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockDetailComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
    ];

    const mockDetailReplies = [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: 'sebuah balasan',
        date: '2021-08-08T07:59:48.766Z',
        username: 'dicoding',
        is_delete: true,
      },
      {
        id: 'reply-dawUSefwda1Z10Iadawk',
        content: 'new reply',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        is_delete: false,
      },
    ];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailReplies));
    /* creating use case instance */
    const getDetailThreaduseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getDetailThread = await getDetailThreaduseCase.execute(useCasePayload);

    // Assert
    expect(getDetailThread)
      .toEqual({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            replies: [
              {
                id: 'reply-BErOXUSefjwWGW1Z10Ihk',
                content: '**balasan telah dihapus**',
                date: '2021-08-08T07:59:48.766Z',
                username: 'dicoding',
              },
              {
                id: 'reply-dawUSefwda1Z10Iadawk',
                content: 'new reply',
                date: '2021-08-08T07:59:48.766Z',
                username: 'johndoe',
              },
            ],
            content: 'sebuah comment',
          },
        ],
      });

    expect(mockThreadRepository.getDetailThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);
  });

  it('should orchestrate the geting detail threads even without comments and replies', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    const mockDetailThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockDetailComments = [];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    /* creating use case instance */
    const getDetailThreaduseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getDetailThread = await getDetailThreaduseCase.execute(useCasePayload);

    // Assert
    expect(getDetailThread)
      .toStrictEqual({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [],
      });

    expect(mockThreadRepository.getDetailThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);
  });

  it('should orchestrate the geting detail threads even without replies', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    const mockDetailThread = {
      id: 'thread-h_2FkLZhtgBKY2kh4CC02',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockDetailComments = [
      {
        id: 'comment-_pby2_tmXV6bcvcdev8xk',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
    ];

    const mockDetailReplies = [];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailReplies));
    /* creating use case instance */
    const getDetailThreaduseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const getDetailThread = await getDetailThreaduseCase.execute(useCasePayload);

    // Assert
    expect(getDetailThread)
      .toEqual({
        id: 'thread-h_2FkLZhtgBKY2kh4CC02',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2021-08-08T07:19:09.775Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-_pby2_tmXV6bcvcdev8xk',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            replies: [],
            content: 'sebuah comment',
          },
        ],
      });

    expect(mockThreadRepository.getDetailThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);
  });
});
