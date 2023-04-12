/* eslint-disable class-methods-use-this */
class PostedThread {
  constructor(payload) {
    this._verificationPayload(payload);

    const {
      id, title, owner,
    } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verificationPayload({
    id, title, owner,
  }) {
    if (!id || !title || !owner) {
      throw new Error('POSTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('POSTED_THREAD.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = PostedThread;
