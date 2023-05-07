const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/likes endpoint', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('should response 201 and like the comment if has not been liked', async () => {
      // Arrange
      const server = await createServer(container);

      // add user 1 for thread owner and  as comment liker
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login by user 1
      const authenticationsUser1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsUser1Json = JSON.parse(authenticationsUser1.payload);

      // add thread by user 1
      const threads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'this is the body of thread',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const threadsJson = JSON.parse(threads.payload);
      const threadId = threadsJson.data.addedThread.id;

      // add user 2 as a comment owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wahyu',
          password: 'secret',
          fullname: 'Wahyu Setiawan',
        },
      });

      // login by user 2
      const authenticationsUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'wahyu',
          password: 'secret',
        },
      });
      const authenticationsUser2Json = JSON.parse(authenticationsUser2.payload);

      // add comment to thread by user 2
      const comments = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comments',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // like the comment by user 1
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 201 and unlike the comment if its liked before', async () => {
      // Arrange
      const server = await createServer(container);

      // add user 1 for thread owner and  as comment liker
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login by user 1
      const authenticationsUser1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsUser1Json = JSON.parse(authenticationsUser1.payload);

      // add thread by user 1
      const threads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'this is the body of thread',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const threadsJson = JSON.parse(threads.payload);
      const threadId = threadsJson.data.addedThread.id;

      // add user 2 as a comment owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wahyu',
          password: 'secret',
          fullname: 'Wahyu Setiawan',
        },
      });

      // login by user 2
      const authenticationsUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'wahyu',
          password: 'secret',
        },
      });
      const authenticationsUser2Json = JSON.parse(authenticationsUser2.payload);

      // add comment to thread by user 2
      const comments = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comments',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // like the comment by user 1
      await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // unlike the comment by user 1
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond 404 when thread of comment to be replied does not exists', async () => {
      // Arrange
      const server = await createServer(container);

      // add user 1 for thread owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login by user 1
      const authenticationsUser1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsUser1Json = JSON.parse(authenticationsUser1.payload);

      // add thread by user 1
      const threads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'this is the body of thread',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const threadsJson = JSON.parse(threads.payload);
      const threadId = threadsJson.data.addedThread.id;

      // add user 2 for comment owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wahyu',
          password: 'secret',
          fullname: 'Wahyu Setiawan',
        },
      });

      // login by user 2
      const authenticationsUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'wahyu',
          password: 'secret',
        },
      });
      const authenticationsUser2Json = JSON.parse(authenticationsUser2.payload);

      // add comment to thread by user 2
      const comments = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comments',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // like the comment by user 1
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/xxxxxx/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread id tidak valid');
    });

    it('should respond 404 when comment does not exists', async () => {
      // Arrange
      const server = await createServer(container);

      // add user 1 for thread owner and reply owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login by user 1
      const authenticationsUser1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsUser1Json = JSON.parse(authenticationsUser1.payload);

      // add thread by user 1
      const threads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'this is the body of thread',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const threadsJson = JSON.parse(threads.payload);
      const threadId = threadsJson.data.addedThread.id;

      // add user 2 for comment owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wahyu',
          password: 'secret',
          fullname: 'Wahyu Setiawan',
        },
      });

      // login by user 2
      const authenticationsUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'wahyu',
          password: 'secret',
        },
      });
      const authenticationsUser2Json = JSON.parse(authenticationsUser2.payload);

      // add comment to thread by user 2
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comments',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // like the comment by user 1
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId}/comments/xxxx/likes`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should respond 404 when comment does not belong to correct thread', async () => {
      // Arrange
      const server = await createServer(container);

      // add user 1 for thread owner and reply owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login by user 1
      const authenticationsUser1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsUser1Json = JSON.parse(authenticationsUser1.payload);

      // add thread by user 1
      const threads = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title',
          body: 'this is the body of thread',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const threadsJson = JSON.parse(threads.payload);
      const threadId = threadsJson.data.addedThread.id;

      // add thread 2 by user 1
      const threads2 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title 2',
          body: 'this is the body of thread 2',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const threadsJson2 = JSON.parse(threads2.payload);
      const threadId2 = threadsJson2.data.addedThread.id;

      // add user 2 for comment owner
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'wahyu',
          password: 'secret',
          fullname: 'Wahyu Setiawan',
        },
      });

      // login by user 2
      const authenticationsUser2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'wahyu',
          password: 'secret',
        },
      });
      const authenticationsUser2Json = JSON.parse(authenticationsUser2.payload);

      // add comment to thread by user 2
      const comments = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comments',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // like the comment by user 1
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${threadId2}/comments/${commentId}/likes`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan pada thread yang dimaksud');
    });
  });
});
