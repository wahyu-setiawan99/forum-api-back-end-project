const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123', title = 'title of thread', body = 'this is the content of thread', date = '29 february 2023', owner = 'wahyu',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, owner],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'select * from threads where id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('delete from threads where 1 = 1');
  },
};

module.exports = ThreadsTableTestHelper;
