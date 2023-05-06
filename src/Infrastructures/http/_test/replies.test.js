const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  jest.useRealTimers();

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and create reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should respond 404 when thread of comment to be replied does not exists', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const response = await server.inject({
        method: 'POST',
        url: `/threads/nonono/comments/${commentId}/replies`,
        payload: requestPayload,
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

    it('should respond 404 when comment to be replied itself does not exists', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/nonono/replies`,
        payload: requestPayload,
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
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId2}/comments/${commentId}/replies`,
        payload: requestPayload,
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

    it('should respond 400 when request payload not contain needed properties', async () => {
      // Arrange
      const requestPayload = { };

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

      // add reply to comment by user 1
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply karena tidak terdapat content');
    });

    it('should respond 400 when payload did not meet the data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

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

      // add reply to comment by user 1
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply karena tipe data content tidak sesuai');
    });

    it('should respond 400 when content is more than 250 characters', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is the bodyLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam auctor, lorem a convallis accumsan, nibh eros sagittis elit, vel molestie lacus velit a urna. Ut at tellus sapien. Maecenas vitae scelerisque est. Nam condimentum mauris vel tellus iaculis pellentesque. Donec malesuada risus sed enim ullamcorper mollis sed id magna. Cras sodales eleifend felis, varius volutpat elit facilisis ut. Praesent tellus lacus, bibendum vitae ullamcorper eget, molestie a enim. Fusce magna nunc, mattis lacinia tincidunt eu, sodales a ligula. Nulla quis ligula non justo cursus luctus. Pellentesque sit amet sodales tortor. Suspendisse hendrerit dictum arcu, non luctus tellus ornare idcomment',
      };

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

      // add reply to comment by user 1
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply karena panjang content lebih dari 250 karakter');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond 200 if reply successfully deleted', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const repliesJson = JSON.parse(replies.payload);
      const replyId = repliesJson.data.addedReply.id;

      // delete replies by user 1
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should respond 403 if user not authorized to delete comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const repliesJson = JSON.parse(replies.payload);
      const replyId = repliesJson.data.addedReply.id;

      // delete replies by user 2
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini!');
    });

    it('should respond 404 if thread is not valid', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const repliesJson = JSON.parse(replies.payload);
      const replyId = repliesJson.data.addedReply.id;

      // delete replies by user 1
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/xxx/comments/${commentId}/replies/${replyId}`,
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

    it('should respond 404 if comment is not valid', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const repliesJson = JSON.parse(replies.payload);
      const replyId = repliesJson.data.addedReply.id;

      // delete replies by user 1
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxxx/replies/${replyId}`,
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

    it('should respond 404 if replies is not valid', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add reply to comment by user 1
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // delete replies by user 1
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/xxxx`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply tidak ditemukan');
    });

    it('should respond 404 if comment not belong to correct thread', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add thread2 by user 1
      const threads2 = await server.inject({
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

      // add comment to thread1 by user 2
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

      // add reply to comment1 by user 1
      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const repliesJson = JSON.parse(replies.payload);
      const replyId = repliesJson.data.addedReply.id;

      // delete replies by user 1
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId2}/comments/${commentId}/replies/${replyId}`,
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

    it('should respond 404 if reply not belong to correct comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'reply',
      };

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

      // add comment1 to thread by user 2
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

      // add comment2 to thread by user 2
      const comments2 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'some comments',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      const commentsJson2 = JSON.parse(comments2.payload);
      const commentId2 = commentsJson2.data.addedComment.id;

      // add reply to comment1 by user 1
      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      const repliesJson = JSON.parse(replies.payload);
      const replyId = repliesJson.data.addedReply.id;

      // delete replies by user 1
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId2}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply tidak terdapat pada komentar yang dimaksud');
    });
  });
});
