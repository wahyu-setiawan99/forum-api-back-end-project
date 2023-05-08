const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeCommentRepository = require('../../../Domains/like_comments/LikeCommentRepository');
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
      {
        id: 'comment-3413ersfesf23dvc232132',
        username: 'anue',
        date: '2021-09-08T07:22:33.555Z',
        content: 'komen comment2',
        is_delete: false,
      },
      {
        id: 'comment-hdgrgesfafawawda421awd',
        username: 'fredy',
        date: '2020-09-08T07:22:33.555Z',
        content: 'komen comment3',
        is_delete: true,
      },
    ];

    const mockCommentLikes = [
      {
        id: 'like-fsf3ffs5_tmXV6bcvcdev8xk',
        owner: 'anue',
        comment: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        id: 'like-jgjj43fesfse4tgrgsgesesfs',
        owner: 'fredy',
        comment: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        id: 'like-hrge34342fesf23dvc232132',
        owner: 'fredy',
        comment: 'comment-3413ersfesf23dvc232132',
      },
    ];

    const mockDetailReplies = [
      {
        id: 'reply-BErOXUSefjwWGW1Z10Ihk',
        content: 'reply 1',
        date: '2021-08-08T07:59:48.766Z',
        username: 'dicoding',
        is_delete: true,
        comment: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        id: 'reply-dawUSefwda1Z10Iadawk',
        content: 'new reply',
        date: '2021-08-08T07:59:48.766Z',
        username: 'johndoe',
        is_delete: false,
        comment: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        id: 'reply-dwdwadwafwafawfwawea',
        content: 'new reply for comment 2',
        date: '2022-08-08T07:59:48.766Z',
        username: 'amiruddin',
        is_delete: false,
        comment: 'comment-3413ersfesf23dvc232132',
      },
    ];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailReplies));
    mockLikeCommentRepository.commentLikeNumberByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentLikes));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Action
    const getDetailThread = await getDetailThreadUseCase.execute(useCasePayload);

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
            likeCount: 2,
          },
          {
            id: 'comment-3413ersfesf23dvc232132',
            username: 'anue',
            date: '2021-09-08T07:22:33.555Z',
            replies: [
              {
                id: 'reply-dwdwadwafwafawfwawea',
                content: 'new reply for comment 2',
                date: '2022-08-08T07:59:48.766Z',
                username: 'amiruddin',
              },
            ],
            content: 'komen comment2',
            likeCount: 1,
          },
          {
            id: 'comment-hdgrgesfafawawda421awd',
            username: 'fredy',
            date: '2020-09-08T07:22:33.555Z',
            replies: [],
            content: '**komentar telah dihapus**',
            likeCount: 0,
          },
        ],
      });

    expect(getDetailThread.comments[2].content)
      .toStrictEqual('**komentar telah dihapus**');

    expect(getDetailThread.comments[0].replies[0].content)
      .toStrictEqual('**balasan telah dihapus**');

    expect(mockThreadRepository.getDetailThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.getCommentByThreadId)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockLikeCommentRepository.commentLikeNumberByThreadId)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockReplyRepository.getReplyByCommentIds)
      .toHaveBeenCalledWith(getDetailThread.comments.map((comment) => comment.id));
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

    const mockCommentLikes = [];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeCommentRepository.commentLikeNumberByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentLikes));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Action
    const getDetailThread = await getDetailThreadUseCase.execute(useCasePayload);

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

    expect(mockCommentRepository.getCommentByThreadId)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockLikeCommentRepository.commentLikeNumberByThreadId)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockReplyRepository.getReplyByCommentIds)
      .toHaveBeenCalledWith([]);
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

    const mockCommentLikes = [
      {
        id: 'like-fsf3ffs5_tmXV6bcvcdev8xk',
        owner: 'anue',
        comment: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        id: 'like-jgjj43fesfse4tgrgsgesesfs',
        owner: 'fredy',
        comment: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
      {
        id: 'like-hrge34342fesf23dvc232132',
        owner: 'monty',
        comment: 'comment-_pby2_tmXV6bcvcdev8xk',
      },
    ];

    const mockDetailReplies = [];

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    /* moking needed function */
    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailComments));
    mockReplyRepository.getReplyByCommentIds = jest.fn()
      .mockImplementation(() => Promise.resolve(mockDetailReplies));
    mockLikeCommentRepository.commentLikeNumberByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockCommentLikes));

    /* creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    // Action
    const getDetailThread = await getDetailThreadUseCase.execute(useCasePayload);

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
            likeCount: 3,
          },
        ],
      });

    expect(mockThreadRepository.getDetailThreadById)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockCommentRepository.getCommentByThreadId)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockLikeCommentRepository.commentLikeNumberByThreadId)
      .toHaveBeenCalledWith(useCasePayload.thread);

    expect(mockReplyRepository.getReplyByCommentIds)
      .toHaveBeenCalledWith(getDetailThread.comments.map((comment) => comment.id));
  });
});
