const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/comments endpoint', () => {
  beforeEach(async () => jest.setTimeout(30000));

  beforeAll(async () => jest.setTimeout(30000));

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and create comments', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment',
      };

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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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

      // Action: add comment to thread by user 2
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should respond 404 when thread to be commented does not exists', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment',
      };

      const server = await createServer(container);

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

      // Action: add comment to thread by user 2
      const response = await server.inject({
        method: 'POST',
        url: '/threads/12345/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread id tidak valid');
    });

    it('should respond 400 when request payload not contain needed properties', async () => {
      // Arrange
      const requestPayload = { };

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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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

      // Action: add comment to thread by user 2
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena tidak terdapat content');
    });

    it('should respond 400 when payload did not meet the data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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

      // Action: add comment to thread by user 2
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena tipe data content tidak sesuai');
    });

    it('should respond 400 when content is more than 250 characters', async () => {
      // Arrange
      const requestPayload = {
        content: 'this is the bodyLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam auctor, lorem a convallis accumsan, nibh eros sagittis elit, vel molestie lacus velit a urna. Ut at tellus sapien. Maecenas vitae scelerisque est. Nam condimentum mauris vel tellus iaculis pellentesque. Donec malesuada risus sed enim ullamcorper mollis sed id magna. Cras sodales eleifend felis, varius volutpat elit facilisis ut. Praesent tellus lacus, bibendum vitae ullamcorper eget, molestie a enim. Fusce magna nunc, mattis lacinia tincidunt eu, sodales a ligula. Nulla quis ligula non justo cursus luctus. Pellentesque sit amet sodales tortor. Suspendisse hendrerit dictum arcu, non luctus tellus ornare idcomment',
      };

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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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

      // Action: add comment to thread by user 2
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena panjang content lebih dari 250 karakter');
    });

    it('should respond 401 when not authorized', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment',
      };

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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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
      await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'wahyu',
          password: 'secret',
        },
      });

      // Action: add comment to thread by user 2
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: 'wrong-authentication',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should respond 200 if successfully deleted', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment',
      };

      const server = await createServer(container);

      // add user 1 as thread owner
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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });
      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // delete comment by user 2
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
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
        content: 'comment',
      };

      const server = await createServer(container);

      // add user 1 as thread owner
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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });
      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // logout by user 2
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser2Json.data.accessToken,
        },
      });

      // add user 3
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'algi',
          password: 'secret',
          fullname: 'Alghifari',
        },
      });

      // login to user 3
      const authenticationsUser3 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'algi',
          password: 'secret',
        },
      });
      const authenticationsUser3Json = JSON.parse(authenticationsUser3.payload);

      // delete comment by user 3
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser3Json.data.accessToken}`,
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
        content: 'comment',
      };

      const server = await createServer(container);

      // add user 1 as thread owner
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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });
      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // delete comment by user 2
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/xxx/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
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
        content: 'comment',
      };

      const server = await createServer(container);

      // add user 1 as thread owner
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

      // logout by user 1
      await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: authenticationsUser1Json.data.refreshToken,
        },
      });

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
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // delete comment by user 2
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/xxx`,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan');
    });

    it('should respond 404 if comment does not belong to the thread', async () => {
      // Arrange
      const requestPayload = {
        content: 'comment',
      };

      const server = await createServer(container);

      // add user 1 as thread owner
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

      // add thread by user 1
      const threads2 = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'thread title2',
          body: 'this is the body of thread2',
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
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      const commentsJson = JSON.parse(comments.payload);
      const commentId = commentsJson.data.addedComment.id;

      // delete comment by user 2
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId2}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
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
