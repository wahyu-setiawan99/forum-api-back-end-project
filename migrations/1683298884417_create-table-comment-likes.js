/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // add constraint foreign key to  comment referenced to comments.id
  pgm.addConstraint('comment_likes', 'fk_comment_likes.comment_comments.id', 'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE');

  // add constraint foreign key to owner referenced to users.id
  pgm.addConstraint('comment_likes', 'fk_comment_likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comment_likes', 'fk_comment_likes.comment_comments.id');
  pgm.dropConstraint('comment_likes', 'fk_comment_likes.owner_users.id');
  pgm.dropTable('comment_likes');
};
