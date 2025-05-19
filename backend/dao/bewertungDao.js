const helper = require('../helper.js');

class BewertungDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        var sql = 'SELECT * FROM Bewertung WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }

    loadByModule(id){
        var sql = 'SELECT * FROM Bewertung WHERE Modul_id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }
 
    toString() {
        console.log('bewertungDao [_conn=' + this._conn + ']');
    }
}

module.exports = BewertungDao;