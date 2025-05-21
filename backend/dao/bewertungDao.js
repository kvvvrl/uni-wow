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
        var sql = 'SELECT Bewertung.Inhalt, User.Vorname, User.Nachname FROM Bewertung LEFT JOIN User on Bewertung.User_Matnr = User.Matnr WHERE Modul_id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }

    loadByMatnr(id){
        var sql = 'SELECT Bewertung.Inhalt, Modul.Name FROM Bewertung LEFT JOIN Modul ON Bewertung.Modul_id = Modul.id WHERE Bewertung.User_Matnr=?';
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