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
        var sql = 'SELECT Bewertung.Inhalt, User.Vorname, User.Nachname,Bewertung.Score FROM Bewertung LEFT JOIN User on Bewertung.User_Matnr = User.Matnr WHERE Modul_id = ?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }

    loadByMatnr(id){
        var sql = 'SELECT Bewertung.Inhalt, Modul.Name, Modul.id,Bewertung.Score FROM Bewertung LEFT JOIN Modul ON Bewertung.Modul_id = Modul.id WHERE Bewertung.User_Matnr=?';
        var statement = this._conn.prepare(sql);
        var result = statement.all(id);

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }

    loadScoreById(id) {
        var sql = 'SELECT AVG(Score) AS Score FROM Bewertung WHERE Modul_id=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(id); 

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);
        
        return result.Score;
    }

    insert(User_Matnr,Score,Inhalt,Modul_id) {
        var sql = 'INSERT INTO Bewertung (User_Matnr, Score, Inhalt, Modul_id) VALUES (?, ?, ?, ?)';
        var statement = this._conn.prepare(sql);
        var params = [User_Matnr, Score, Inhalt, Modul_id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Insert failed for Bewertung with User_Matnr=' + User_Matnr + ', Modul_id=' + Modul_id);

        return this.loadById(result.lastInsertRowid);

    }
 
    toString() {
        console.log('bewertungDao [_conn=' + this._conn + ']');
    }
}

module.exports = BewertungDao;