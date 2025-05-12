const helper = require('../helper.js');

class ModulDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Modul WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Modul) found by id=' + id);

        return result;
    }
 
    toString() {
        console.log('modulDao [_conn=' + this._conn + ']');
    }
}

module.exports = ModulDao;