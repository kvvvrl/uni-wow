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

    //TODO: Typo bei Verantworlicher beheben, soblad in DB behoben
    loadByVerantwortlicher(id) {
        var sql = 'SELECT * FROM Modul WHERE Verantworlicher=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Modul) found by id=' + id);

        return result;
    }

    loadAll() {
        var sql = 'SELECT * FROM Modul';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        return result;
    }
 
    toString() {
        console.log('modulDao [_conn=' + this._conn + ']');
    }
}

module.exports = ModulDao;