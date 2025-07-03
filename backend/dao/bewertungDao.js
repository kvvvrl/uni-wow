const helper = require('../helper.js');
const {toJSON} = require("lodash/seq");

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

    loadByMatnrAndModule(matnr, modul_id){
        let sql = 'SELECT Bewertung.Inhalt,Bewertung.Score FROM Bewertung WHERE Bewertung.User_Matnr=? AND Bewertung.Modul_id = ?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(matnr, modul_id);

        if (helper.isUndefined(result))
            return null;

        return result;
    }

    loadByMatnr(id){
        let sql = 'SELECT Bewertung.Inhalt, Modul.Name, Modul.id,Bewertung.Score FROM Bewertung LEFT JOIN Modul ON Bewertung.Modul_id = Modul.id WHERE Bewertung.User_Matnr=?';
        let statement = this._conn.prepare(sql);
        let result = statement.all(id);

        if (helper.isUndefined(result))
            return null;

        console.log(result)

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

    insert(User_Matnr, Score, Inhalt, Modul_id) {
        let sql = 'INSERT INTO Bewertung (User_Matnr, Score, Inhalt, Modul_id) VALUES (?, ?, ?, ?)';
        let statement = this._conn.prepare(sql);
        let params = [User_Matnr, Score, Inhalt, Modul_id];
        console.log(params);
        let result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Insert failed for Bewertung with User_Matnr=' + User_Matnr + ', Modul_id=' + Modul_id);

        return true;
    }

    update(User_Matnr, Score, Inhalt, Modul_id) {
        let sql = 'UPDATE Bewertung SET Score=?, Inhalt=? WHERE User_Matnr=? AND Modul_id=?';
        let statement = this._conn.prepare(sql);
        let params = [Score, Inhalt, User_Matnr, Modul_id];
        let result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Update failed for Bewertung with User_Matnr=' + User_Matnr + ', Modul_id=' + Modul_id);

        return true;
    }

    exists(matnr, modul_id) {
        console.log('existance check')
        let sql = 'SELECT COUNT(1) as val FROM Bewertung WHERE User_Matnr=? AND Modul_id=?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(matnr, modul_id);
        return result.val != 0;
    }
 
    toString() {
        console.log('bewertungDao [_conn=' + this._conn + ']');
    }
}

module.exports = BewertungDao;