const helper = require('../helper.js');

class DozentDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Dozent WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Dozent) found by id=' + id);

        return result;
    }
 
    toString() {
        console.log('dozentDao [_conn=' + this._conn + ']');
    }
}

module.exports = DozentDao;