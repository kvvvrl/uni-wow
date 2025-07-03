const helper = require('../helper.js');

class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(Matnr) {
        let sql = 'SELECT * FROM User WHERE Matnr=?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(Matnr);

        if (helper.isUndefined(result))
            throw new Error('No Record (User) found by Matnr=' + Matnr);

        return result;
    }
 
    loadAll() {
        let sql = 'SELECT * FROM User';
        let statement = this._conn.prepare(sql);
        let result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        return result;
    }

    loadProfile(matnr) {
        let sql = 'SELECT UserToModul.Note, Modul.Name, Modul.Credits FROM UserToModul ' +
            'LEFT JOIN Modul ON UserToModul.Modul_id = Modul.id ' +
            'WHERE UserToModul.User_Matnr=?'

        let statement = this._conn.prepare(sql);
        let result = {}
        result.grades = statement.all(matnr);

        sql = 'SELECT AVG(UserToModul.Note) AS Durchschnitt, SUM(Modul.Credits) AS Creditsumme FROM UserToModul ' +
            'LEFT JOIN Modul ON UserToModul.Modul_id = Modul.id ' +
            'WHERE UserToModul.User_Matnr=?'

        statement = this._conn.prepare(sql);
        result.avg_sum = statement.get(matnr);
        result.user = this.loadById(matnr);

        //TODO Fehlerbehandlung evtl

        console.log(result)

        return result;
    }

    updateProfil(Matnr, Vorname, Nachname, Passwort) {
        let sql = 'UPDATE User SET Vorname=?, Nachname=?, Passwort=? WHERE Matnr=?';
        let statement = this._conn.prepare(sql);
        let params = [Vorname, Nachname, Passwort, Matnr];
        let result = statement.run(params);

        console.log(statement)

        if (result.changes != 1)
            throw new Error('Update failed for User with Matnr=' + Matnr);

        return true;
    }

    exists(Matnr) {
        let sql = 'SELECT COUNT(Matnr) AS cnt FROM User WHERE Matnr=?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(Matnr);

        if (result.cnt == 1)
            return true;

        return false;
    }


    hasaccess(Matnr, Passwort) {
        console.log('Service User: Client requested hasacces');
        let sql = 'SELECT Matnr FROM User WHERE Matnr=? AND Passwort=?';
        let statement = this._conn.prepare(sql);
        let params = [Matnr, Passwort];
        let result = statement.get(params);

        if (helper.isUndefined(result)) 
            throw new Error('User has no access');

        return this.loadById(result.Matnr);
    }

    create(Matnr = null, Vorname = '', Nachname = '', Passwort = '') {
        //TODO:
        //hashpasswort and store in db
        let sql = 'INSERT INTO User (Matnr,Vorname,Nachname,Passwort) VALUES (?,?,?,?)';
        let statement = this._conn.prepare(sql);
        let params = [Matnr, Vorname, Nachname, Passwort];
        let result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    update(Matnr, Vorname = '', Nachname = '', neuespasswort = null) {
        //TODO:
        //hashpasswort and store in db
        if (helper.isNull(neuespasswort)) {
            let sql = 'UPDATE User SET Vorname=?, Nachname=? WHERE Matnr=?';
            let statement = this._conn.prepare(sql);
            let params = [Vorname, Nachname, Matnr];
        } else {
            let sql = 'UPDATE User SET Vorname=?, Nachname=?, Passwort=? WHERE Matnr=?';
            let statement = this._conn.prepare(sql);
            let params = [Vorname, Nachname, neuespasswort, Matnr];
        }
        let result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(Matnr) {
        try {
            let sql = 'DELETE FROM User WHERE Matnr=?';
            let statement = this._conn.prepare(sql);
            let result = statement.run(Matnr);

            if (result.changes != 1)
                throw new Error('Could not delete Record by Matnr=' + Matnr);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by Matnr=' + Matnr + '. Reason: ' + ex.message);
        }
    }

    loadGrade(modul_id, matnr) {
        console.log("GRADE")
        let sql ='SELECT Note FROM UserToModul ' +
            'WHERE User_Matnr = ? ' +
            'AND Modul_id = ?';

        let statement = this._conn.prepare(sql);

        let result = statement.get(parseInt(matnr), parseInt(modul_id));

        if (helper.isUndefined(result))
            return null

        console.log(result)

        return result.Note
    }

    saveGrade(modul_id, matnr, grade) {

        let sql = 'INSERT INTO UserToModul (User_Matnr,Modul_id,Note) VALUES (?,?,?)';
        let statement = this._conn.prepare(sql);
        let params = [matnr, modul_id, grade];
        let result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Could not insert new Record. Data: ' + params);

        return true;
    }
    updateGrade(modul_id, matnr, grade) {
        let sql = 'UPDATE UserToModul SET Note=? WHERE User_Matnr=? AND Modul_id=?';
        let statement = this._conn.prepare(sql);
        let params = [grade, matnr, modul_id];
        let result = statement.run(params);

        if (result.changes != 1)
            throw new Error('Update failed for Grade with User_Matnr=' + matnr + ', Modul_id=' + modul_id);

        return true;
    }

    toString() {
        console.log('UserDao [_conn=' + this._conn + ']');
    }

}

module.exports = UserDao;