const helper = require('../helper.js');

class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM User WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (User) found by id=' + id);

        return result;
    }
 
    toString() {
        console.log('userDao [_conn=' + this._conn + ']');
    }
}

module.exports = UserDao;