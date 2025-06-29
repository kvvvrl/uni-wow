const helper = require('../helper.js');

class BewertungDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(id) {
        let sql = 'SELECT * FROM Bewertung WHERE id=?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }

    loadByModule(id){
        let sql = 'SELECT Bewertung.Inhalt, User.Vorname, User.Nachname,Bewertung.Score FROM Bewertung LEFT JOIN User on Bewertung.User_Matnr = User.Matnr WHERE Modul_id = ?';
        let statement = this._conn.prepare(sql);
        let result = statement.all(id);

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }

    loadByMatnr(id){
        let sql = 'SELECT Bewertung.Inhalt, Modul.Name, Modul.id,Bewertung.Score FROM Bewertung LEFT JOIN Modul ON Bewertung.Modul_id = Modul.id WHERE Bewertung.User_Matnr=?';
        let statement = this._conn.prepare(sql);
        let result = statement.all(id);

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);

        return result;
    }

    loadScoreById(id) {
        let sql = 'SELECT AVG(Score) AS Score FROM Bewertung WHERE Modul_id=?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(id); 

        if (helper.isUndefined(result))
            throw new Error('No Record (Bewertung) found by id=' + id);
        
        return result.Score;
    }

    insert(User_Matnr,Score,Inhalt,Modul_id) {
        let sql = 'INSERT INTO Bewertung (User_Matnr, Score, Inhalt, Modul_id) VALUES (?, ?, ?, ?)';
        let statement = this._conn.prepare(sql);
        let params = [User_Matnr, Score, Inhalt, Modul_id];
        let result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Insert failed for Bewertung with User_Matnr=' + User_Matnr + ', Modul_id=' + Modul_id);

        return this.loadById(result.lastInsertRowid);

    }
 
    toString() {
        console.log('bewertungDao [_conn=' + this._conn + ']');
    }
}

module.exports = BewertungDao;