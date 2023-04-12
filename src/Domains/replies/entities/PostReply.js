/* eslint-disable class-methods-use-this */
class PostReply {
  constructor(payload) {
    this._verificationPayload(payload);

    const {
      content, comment, thread,
    } = payload;

    this.content = content;
    this.comment = comment;
    this.thread = thread;
  }

  _verificationPayload({
    content, comment, thread,
  }) {
    if (!content || !comment || !thread) {
      throw new Error('POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof comment !== 'string' || typeof thread !== 'string') {
      throw new Error('POST_REPLY.NOT_MEET_DATA_SPECIFICATION');
    }

    if (content.length > 250) {
      throw new Error('POST_REPLY.CONTENT_LIMIT_CHAR');
    }
  }
}

module.exports = PostReply;
