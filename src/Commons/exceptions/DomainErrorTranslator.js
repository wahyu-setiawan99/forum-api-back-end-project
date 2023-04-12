const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread karena tidak terdapat title atau body'),
  'POST_THREAD.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tidak dapat membuat thread karena tipe data title atau body tidak sesuai'),
  'POST_THREAD.TITLE_LIMIT_CHAR': new InvariantError('tidak dapat membuat thread karena panjang title lebih dari 70 karakter'),
  'POST_THREAD.BODY_LIMIT_CHAR': new InvariantError('tidak dapat membuat thread karena panjang body lebih dari 250 karakter'),
  'POST_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment karena tidak terdapat content'),
  'POST_COMMENT.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tidak dapat membuat comment karena tipe data content tidak sesuai'),
  'POST_COMMENT.CONTENT_LIMIT_CHAR': new InvariantError('tidak dapat membuat comment karena panjang content lebih dari 250 karakter'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan thread i atau comment id atau owner'),
  'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tipe data untuk menghapus komentar tidak sesuai'),
  'POST_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat reply karena tidak terdapat content'),
  'POST_REPLY.NOT_MEET_DATA_SPECIFICATION': new InvariantError('tidak dapat membuat reply karena tipe data content tidak sesuai'),
  'POST_REPLY.CONTENT_LIMIT_CHAR': new InvariantError('tidak dapat membuat reply karena panjang content lebih dari 250 karakter'),

};

module.exports = DomainErrorTranslator;
