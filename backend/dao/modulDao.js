const helper = require('../helper.js');
const DozentDao = require('../dao/dozentDao.js');

class ModulDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        const dozentDao = new DozentDao(this._conn);

        var sql = 'SELECT * FROM Modul WHERE id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Modul) found by id=' + id);

        result.Verantwortlicher = dozentDao.loadById(result.Verantwortlicher);
        return result;
    }

    loadByVerantwortlicher(id) {
        var sql = 'SELECT * FROM Modul WHERE verantwortlicher=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Modul) found by id=' + id);

        return result;
    }

    loadAll() {
        const dozentDao = new DozentDao(this._conn);
        var sql = 'SELECT * FROM Modul';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        result.forEach(item => {
            item.Verantwortlicher = dozentDao.loadById(item.Verantwortlicher);
        });

        return result;
    }
 
    toString() {
        console.log('modulDao [_conn=' + this._conn + ']');
    }
}

module.exports = ModulDao;