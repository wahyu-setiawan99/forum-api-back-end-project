const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  beforeEach(async () => jest.setTimeout(30000));

  beforeAll(async () => jest.setTimeout(30000));

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST/threads', () => {
    it('should response 201 and create thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'thread title',
        body: 'this is the body of thread',
      };

      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should respond 400 when request payload not contain needed properties', async () => {
      // Arrange
      const requestPayload = {
        body: 'this is the body of thread',
      };

      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena tidak terdapat title atau body');
    });

    it('should respond 400 when payload did not meet the data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: 'this is the body of thread',
      };

      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena tipe data title atau body tidak sesuai');
    });

    it('should respond 400 when title is more than 70 characters', async () => {
      // Arrange
      const requestPayload = {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi risus lorem, vulputate at egestas hendrerit ',
        body: 'this is the body of thread',
      };

      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena panjang title lebih dari 70 karakter');
    });

    it('should respond 400 when body is more than 250 characters', async () => {
      // Arrange
      const requestPayload = {
        title: 'this is the title',
        body: 'this is the bodyLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam auctor, lorem a convallis accumsan, nibh eros sagittis elit, vel molestie lacus velit a urna. Ut at tellus sapien. Maecenas vitae scelerisque est. Nam condimentum mauris vel tellus iaculis pellentesque. Donec malesuada risus sed enim ullamcorper mollis sed id magna. Cras sodales eleifend felis, varius volutpat elit facilisis ut. Praesent tellus lacus, bibendum vitae ullamcorper eget, molestie a enim. Fusce magna nunc, mattis lacinia tincidunt eu, sodales a ligula. Nulla quis ligula non justo cursus luctus. Pellentesque sit amet sodales tortor. Suspendisse hendrerit dictum arcu, non luctus tellus ornare id',
      };

      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const authentications = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const authenticationsJson = JSON.parse(authentications.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authenticationsJson.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread karena panjang body lebih dari 250 karakter');
    });
  });

  describe('when GET/threads/{threadId}', () => {
    it('should response 200 and return detail thread', async () => {
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
      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment 1',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });
      const commentJson = JSON.parse(comment.payload);
      const commentId = commentJson.data.addedComment.id;

      // add another comment2 to thread by user 1
      const comment2 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment 2',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });
      const comment2Json = JSON.parse(comment2.payload);
      const commentId2 = comment2Json.data.addedComment.id;

      // delete comment2 by user 1
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId2}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // add reply1 to comment1 by user 1
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'reply1',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });
      const replyJson = JSON.parse(reply.payload);
      const replyId = replyJson.data.addedReply.id;

      // add reply2 to comment1 by user 2
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: 'reply2',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // delete reply1 by user 1
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toEqual(
        {
          id: expect.any(String),
          title: 'thread title',
          body: 'this is the body of thread',
          date: expect.any(String),
          username: 'dicoding',
          comments: expect.arrayContaining([
            {
              id: expect.any(String),
              username: 'wahyu',
              date: expect.any(String),
              replies: expect.arrayContaining([
                {
                  id: expect.any(String),
                  content: '**balasan telah dihapus**',
                  date: expect.any(String),
                  username: 'dicoding',
                },
                {
                  id: expect.any(String),
                  content: 'reply2',
                  date: expect.any(String),
                  username: 'wahyu',
                },
              ]),
              content: 'comment 1',
            },
            {
              id: expect.any(String),
              username: 'dicoding',
              date: expect.any(String),
              replies: [],
              content: '**komentar telah dihapus**',
            },
          ]),
        },
      );
    });

    it('should still response 200 and return detail thread even without comments', async () => {
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

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toEqual(
        {
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          date: expect.any(String),
          username: expect.any(String),
          comments: [],
        },
      );
    });

    it('should still response 200 and return detail thread even without replies', async () => {
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
      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment 1',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser2Json.data.accessToken}`,
        },
      });

      // add another comment2 to thread by user 1
      const comment2 = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'comment 2',
        },
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });
      const comment2Json = JSON.parse(comment2.payload);
      const commentId2 = comment2Json.data.addedComment.id;

      // delete comment2 by user 1
      await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId2}`,
        headers: {
          Authorization: `Bearer ${authenticationsUser1Json.data.accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toEqual(
        {
          id: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          date: expect.any(String),
          username: expect.any(String),
          comments: expect.arrayContaining([
            {
              id: expect.any(String),
              username: expect.any(String),
              date: expect.any(String),
              replies: [],
              content: expect.any(String),
            },
            {
              id: expect.any(String),
              username: expect.any(String),
              date: expect.any(String),
              replies: [],
              content: '**komentar telah dihapus**',
            },
          ]),
        },
      );
    });

    it('should respond 404 if thread is not valid', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});
