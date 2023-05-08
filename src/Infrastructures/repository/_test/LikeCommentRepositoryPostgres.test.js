const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikeCommentsTableTestHelper = require('../../../../tests/LikeCommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');

describe('LikeCommentRespositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // thread owner and liker
    await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding2' }); // comment owner
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' }); // add thread
    await CommentsTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-456' }); // add comment
    await CommentsTableTestHelper.addComment({ id: 'comment-456', thread: 'thread-123', owner: 'user-456' }); // add comment 2
  });

  afterEach(async () => {
    await LikeCommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('likeComment function', () => {
    it('should like comment corectly', async () => {
      // Arrange
      const likeComment = {
        comment: 'comment-123',
        thread: 'thread-123',
      };

      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeCommentRepositoryPostgres.likeComment(owner, likeComment.comment);

      // Assert
      const likeComments = await LikeCommentsTableTestHelper.findLikedCommentById('like-123');

      expect(likeComments).toStrictEqual([
        {
          comment: 'comment-123',
          id: 'like-123',
          owner: 'user-123',
        },
      ]);
      await expect(likeComments).toHaveLength(1);
    });
  });

  describe('unlikeComment function', () => {
    it('should unlike comment corectly', async () => {
      // Arrange
      await LikeCommentsTableTestHelper.likeComment({
        id: 'like-123',
        comment: 'comment-123',
        owner: 'user-123',
      });

      const unlikeComment = {
        comment: 'comment-123',
        thread: 'thread-123',
      };

      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeCommentRepositoryPostgres.unlikeComment(owner, unlikeComment.comment);

      // Assert
      const unlikeComments = await LikeCommentsTableTestHelper.findLikedCommentById('like-123');
      expect(unlikeComments).toHaveLength(0);
    });
  });

  describe('verifyLikedComment function', () => {
    it('should tell if comment has not been liked', async () => {
      // Arrange
      const likeComment = {
        comment: 'comment-123',
        thread: 'thread-123',
      };

      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action and assert
      const checkLike = await likeCommentRepositoryPostgres.verifyLikedComment(
        owner,
        likeComment.comment,
      );

      expect(checkLike).toHaveLength(0);
    });

    it('should tell if comment has been liked', async () => {
      // Arrange
      await LikeCommentsTableTestHelper.likeComment({
        id: 'like-123',
        comment: 'comment-123',
        owner: 'user-123',
      });

      const likeComment = {
        comment: 'comment-123',
        thread: 'thread-123',
      };

      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action and assert
      const checkLike = await likeCommentRepositoryPostgres.verifyLikedComment(
        owner,
        likeComment.comment,
      );

      expect(checkLike).toHaveLength(1);
    });
  });

  describe('commentLikeNumber function', () => {
    it('should return number of likes and comments for a certain thread', async () => {
      // Arrange
      await LikeCommentsTableTestHelper.likeComment({
        id: 'like-123',
        comment: 'comment-123',
        owner: 'user-123',
      });

      await LikeCommentsTableTestHelper.likeComment({
        id: 'like-456',
        comment: 'comment-123',
        owner: 'user-456',
      });

      await LikeCommentsTableTestHelper.likeComment({
        id: 'like-789',
        comment: 'comment-456',
        owner: 'user-123',
      });

      const detailThread = {
        thread: 'thread-123',
      };

      const fakeIdGenerator = () => '123'; // stub!

      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action and assert
      const likeNumber = await likeCommentRepositoryPostgres.commentLikeNumberByThreadId(
        detailThread.thread,
      );

      expect(likeNumber).toStrictEqual([
        {
          id: 'like-123',
          owner: 'user-123',
          comment: 'comment-123',
        },
        {
          id: 'like-456',
          owner: 'user-456',
          comment: 'comment-123',
        },
        {
          id: 'like-789',
          owner: 'user-123',
          comment: 'comment-456',
        },
      ]);

      expect(likeNumber).toHaveLength(3);
    });
  });
});
