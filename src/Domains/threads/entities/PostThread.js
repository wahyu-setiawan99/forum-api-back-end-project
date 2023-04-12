/* eslint-disable class-methods-use-this */
class PostThread {
  constructor(payload) {
    this._verificationPayload(payload);

    const { title, body } = payload;

    this.title = title;
    this.body = body;
  }

  _verificationPayload({ title, body }) {
    if (!title || !body) {
      throw new Error('POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new Error('POST_THREAD.NOT_MEET_DATA_SPECIFICATION');
    }

    if (title.length > 70) {
      throw new Error('POST_THREAD.TITLE_LIMIT_CHAR');
    }

    if (body.length > 250) {
      throw new Error('POST_THREAD.BODY_LIMIT_CHAR');
    }
  }
}

module.exports = PostThread;
