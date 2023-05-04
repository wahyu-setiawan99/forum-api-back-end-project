const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const PostReply = require('../../../Domains/replies/entities/PostReply');
const PostedReply = require('../../../Domains/replies/entities/PostedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRespositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // thread owner and reply
    await UsersTableTestHelper.addUser({ id: 'user-456', username: 'dicoding2' }); // for comment

    await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

    await CommentsTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-456' });

    await CommentsTableTestHelper.addComment({ id: 'comment-999', thread: 'thread-123', owner: 'user-123' });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist post reply and return posted reply corectly', async () => {
      // Arrange
      const postReply = new PostReply({
        content: 'reply',
        comment: 'comment-123',
        thread: 'thread-123',
      });

      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(owner, postReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return posted reply correctly', async () => {
      // Arrange
      const postReply = new PostReply({
        content: 'reply',
        comment: 'comment-123',
        thread: 'thread-123',
      });

      const owner = 'user-123';

      const fakeIdGenerator = () => '123'; // stub!

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const postedReply = await replyRepositoryPostgres.addReply(owner, postReply);

      // Assert
      expect(postedReply).toStrictEqual(new PostedReply({
        id: 'reply-123',
        content: 'reply',
        owner: 'user-123',
      }));
    });
  });

  describe('getReplytByCommentIds function', () => {
    it('should return the detail reply correctly from more than one comment at once', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        content: 'reply 1',
        date: '31 february 2200',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-456',
        content: 'reply 2',
        date: '32 february 2200',
      });

      await RepliesTableTestHelper.deleteReply('reply-456');

      await RepliesTableTestHelper.addReply({
        id: 'reply-789',
        thread: 'thread-123',
        comment: 'comment-999',
        owner: 'user-456',
        content: 'reply for comment 2',
        date: '32 february 2211',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getReplyByCommentIds(['comment-123', 'comment-999']);

      // Assert
      expect(replies).toStrictEqual(
        [
          {
            id: 'reply-123',
            content: 'reply 1',
            date: '31 february 2200',
            comment: 'comment-123',
            owner: 'user-123',
            is_delete: false,
            username: 'dicoding',
          },
          {
            id: 'reply-456',
            content: 'reply 2',
            date: '32 february 2200',
            comment: 'comment-123',
            owner: 'user-456',
            is_delete: true,
            username: 'dicoding2',
          },
          {
            id: 'reply-789',
            content: 'reply for comment 2',
            date: '32 february 2211',
            comment: 'comment-999',
            owner: 'user-456',
            is_delete: false,
            username: 'dicoding2',
          },
        ],
      );
    });

    it('should return no reply for comment with no replies', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-123',
        content: 'reply 1',
        date: '31 february 2200',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-456',
        thread: 'thread-123',
        comment: 'comment-123',
        owner: 'user-456',
        content: 'reply 2',
        date: '32 february 2200',
      });

      await RepliesTableTestHelper.deleteReply('reply-456');

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies = await replyRepositoryPostgres.getReplyByCommentIds(['comment-123', 'comment-999']); // comment 999 has no reply, but comment123 does

      // Assert
      expect(replies).toStrictEqual(
        [
          {
            id: 'reply-123',
            content: 'reply 1',
            date: '31 february 2200',
            comment: 'comment-123',
            owner: 'user-123',
            is_delete: false,
            username: 'dicoding',
          },
          {
            id: 'reply-456',
            content: 'reply 2',
            date: '32 february 2200',
            comment: 'comment-123',
            owner: 'user-456',
            is_delete: true,
            username: 'dicoding2',
          },
        ],
      );
    });
  });

  describe('verifyReplyOwner', () => {
    it('should throw NotFoundError when reply id not found', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('wrong-id', 'user-123')).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError if the reply accessor is not the owner', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', is_delete: false, comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'wrong-user')).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw NotFoundError and AuthorizationError if id and owner of comment are valid', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', is_delete: false, comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(NotFoundError);
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyReplyDeletion function', () => {
    it('should throw NotFoundError when reply is already deleted', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', is_delete: true, comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action

      await
      // Assert
      await expect(replyRepositoryPostgres.verifyReplyDeletion('reply-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', is_delete: false, comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(replyRepositoryPostgres.verifyReplyDeletion('reply-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyBelongToComment', () => {
    it('should throw NotFoundError when reply id does not belong to right comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-456', owner: 'user-456', thread: 'thread-123' });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', is_delete: false, comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(replyRepositoryPostgres.verifyReplyBelongToComment('reply-123', 'comment-456')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError if reply belongs to valid comment', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', is_delete: false, comment: 'comment-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Act and assert
      await expect(replyRepositoryPostgres.verifyReplyBelongToComment('reply-123', 'comment-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('deleteReply function', () => {
    it('should not truly delete reply from database, but only set is_delete column to be true', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: 'reply-123', owner: 'user-123', is_delete: false, comment: 'comment-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toEqual(true);
    });
  });
});
