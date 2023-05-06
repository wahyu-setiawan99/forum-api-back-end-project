/* eslint-disable class-methods-use-this */
class LikeComment {
  constructor(payload) {
    this._verificationPayload(payload);

    const { content, thread } = payload;

    this.content = content;
    this.thread = thread;
  }

  _verificationPayload({ content, thread }) {
    if (!content || !thread) {
      throw new Error('POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof thread !== 'string') {
      throw new Error('POST_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }

    if (content.length > 250) {
      throw new Error('POST_COMMENT.CONTENT_LIMIT_CHAR');
    }
  }
}

module.exports = LikeComment;
