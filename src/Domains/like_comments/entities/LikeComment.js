/* eslint-disable class-methods-use-this */
class LikeComment {
  constructor(payload) {
    this._verificationPayload(payload);

    const { thread, comment } = payload;

    this.thread = thread;
    this.comment = comment;
  }

  _verificationPayload({ thread, comment }) {
    if (!thread || !comment) {
      throw new Error('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'string' || typeof comment !== 'string') {
      throw new Error('LIKE_COMMENT.NOT_MEET_DATA_SPECIFICATION');
    }
  }
}

module.exports = LikeComment;
