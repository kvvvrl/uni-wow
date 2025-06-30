const helper = require('../helper.js');
const DozentDao = require('../dao/dozentDao.js');
const BewertungDao = require('./bewertungDao.js');

class ModulDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id, matnr) {
        const dozentDao = new DozentDao(this._conn);
        const bewertungDao = new BewertungDao(this._conn);

        let sql = 'SELECT * FROM Modul WHERE id=?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Modul) found by id=' + id);

        result.UserData = {
            Note: this.loadGrade(id, matnr).Note,
            Bewertung: bewertungDao.loadByMatnr(matnr)
        }

        result.Verantwortlicher = dozentDao.loadById(result.Verantwortlicher);
        result.Score = bewertungDao.loadScoreById(result.id) || 0;
        return result;
    }

    loadByVerantwortlicher(id) {
        const bewertungDao = new BewertungDao(this._conn);
        let sql = 'SELECT * FROM Modul WHERE verantwortlicher=?';
        let statement = this._conn.prepare(sql);
        let result = statement.all(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Modul) found by id=' + id);

        result.forEach(item => {
            item.Score = bewertungDao.loadScoreById(item.id) || 0;
        });

        return result;
    }

    loadAll(matNr) {
        const dozentDao = new DozentDao(this._conn);
        const bewertungDao = new BewertungDao(this._conn);
        let sql =    'SELECT Modul.*, Note FROM Modul ' +
            'LEFT JOIN (' +
            'SELECT * from UserToModul WHERE User_Matnr = ?)' +
            'UserToModul ON Modul.id = UserToModul.Modul_id';

        let statement = this._conn.prepare(sql);
        let result = statement.all(matNr);

        if (helper.isArrayEmpty(result)) 
            return [];

        result.forEach(item => {
            item.Verantwortlicher = dozentDao.loadById(item.Verantwortlicher);
        });
        result.forEach(item => {
            item.Score = bewertungDao.loadScoreById(item.id) || 0;
        });

        return result;
    }

    loadGrade(modul_id, matnr) {
        console.log("GRADE")
        let sql ='SELECT Note FROM UserToModul ' +
                        'WHERE User_Matnr = ? ' +
                        'AND Modul_id = ?';

        let statement = this._conn.prepare(sql);

        let result = statement.get(parseInt(matnr), parseInt(modul_id));

        if (helper.isUndefined(result))
            return null;

        console.log(result)

        return result
    }

    toString() {
        console.log('modulDao [_conn=' + this._conn + ']');
    }
}

module.exports = ModulDao;