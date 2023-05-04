const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostComment = require('../../../Domains/comments/entities/PostComment');
const PostedComment = require('../../../Domains/comments/entities/PostedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRespositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // thread owner
    await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding2' }); // for comment
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist post comment and return posted comment corectly', async () => {
      // Arrange
      const postComment = new PostComment({
        content: 'comment',
        thread: 'thread-123',
      });

      const owner = 'user-456';

      const fakeIdGenerator = () => '123'; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(owner, postComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return posted comment correctly', async () => {
      // Arrange
      const postComment = new PostComment({
        content: 'comment',
        thread: 'thread-123',
      });

      const owner = 'user-456';

      const fakeIdGenerator = () => '123'; // stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedComment = await commentRepositoryPostgres.addComment(owner, postComment);

      // Assert
      expect(postedComment).toStrictEqual(new PostedComment({
        id: 'comment-123',
        content: 'comment',
        owner: 'user-456',
      }));
    });
  });

  describe('findCommentById', () => {
    it('should throw NotFoundError when comment id not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456', is_delete: false });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.findCommentById('wrong-id')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456', is_delete: false });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.findCommentById('comment-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should return the comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456', is_delete: false });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.findCommentById('comment-123');

      // Assert
      console.log(comments);
      expect(comments).toStrictEqual(
        {
          id: 'comment-123',
          content: 'comment',
          date: '20 jan 2023',
          owner: 'user-456',
          is_delete: false,
          thread: 'thread-123',
        },
      );
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return the detail comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread: 'thread-123',
        owner: 'user-456',
        content: 'comment 1',
        date: '31 february 2100',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        thread: 'thread-123',
        owner: 'user-123',
        content: 'comment 2',
        date: '32 february 2100',
      });
      await CommentsTableTestHelper.deleteComment('comment-456');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(comments).toStrictEqual(
        [
          {
            id: 'comment-123',
            username: 'dicoding2',
            date: '31 february 2100',
            content: 'comment 1',
            is_delete: false,
          },
          {
            id: 'comment-456',
            username: 'dicoding',
            date: '32 february 2100',
            content: 'comment 2',
            is_delete: true,
          },
        ],
      );
    });

    it('should return no comment properly and not throw any error if thread has no comments', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentByThreadId('thread-123dawda');

      // Assert
      expect(comments).toStrictEqual(
        [],
      );
    });
  });

  describe('verifyCommentOwner', () => {
    it('should throw NotFoundError when comment id not found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456', is_delete: false });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('wrong-id', 'user-456')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError if the accessor is not the owner', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456', is_delete: false });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'wrong-user')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError and AuthorizationError if id and owner of comment are valid', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456', is_delete: false });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')).resolves.not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentDeletion function', () => {
    it('should throw NotFoundError when comment is already deleted', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', is_delete: true });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.verifyCommentDeletion('comment-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.verifyCommentDeletion('comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentBelongToThread', () => {
    it('should throw NotFoundError when comment id does not belong to thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-456', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123', owner: 'user-456', thread: 'thread-123', is_delete: false,
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.verifyCommentBelongToThread('comment-123', 'thread-456')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if comment belongs to valid thread', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-456', is_delete: false });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(commentRepositoryPostgres.verifyCommentBelongToThread('comment-123', 'thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should not truly delete comment from database, but only set is_delete column to true', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', is_delete: false });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toEqual(true);
    });
  });
});
