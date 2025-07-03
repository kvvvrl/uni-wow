const helper = require('../helper.js');

class UserDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadById(Matnr) {
        var sql = 'SELECT * FROM User WHERE Matnr=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(Matnr);

        if (helper.isUndefined(result))
            throw new Error('No Record (User) found by Matnr=' + Matnr);

        return result;
    }
 
    loadAll() {
        var sql = 'SELECT * FROM User';
        var statement = this._conn.prepare(sql);
        var result = statement.all();

        if (helper.isArrayEmpty(result)) 
            return [];

        return result;
    }

    exists(Matnr) {
        var sql = 'SELECT COUNT(Matnr) AS cnt FROM User WHERE Matnr=?';
        var statement = this._conn.prepare(sql);
        var result = statement.get(Matnr);

        if (result.cnt == 1)
            return true;

        return false;
    }


    hasaccess(Matnr, Passwort) {
        var sql = 'SELECT Matnr FROM User WHERE Matnr=? AND Passwort=?';
        var statement = this._conn.prepare(sql);
        var params = [Matnr, Passwort];
        var result = statement.get(params);

        if (helper.isUndefined(result)) 
            throw new Error('User has no access');

        return this.loadById(result.Matnr);
    }

    create(Matnr = null, Vorname = '', Nachname = '', Passwort = '',Salt='') {
        //TODO:
        //hashpasswort and store in db
        var sql = 'INSERT INTO User (Matnr,Vorname,Nachname,PasswdHash,Salt) VALUES (?,?,?,?,?)';
        var statement = this._conn.prepare(sql);
        var params = [Matnr, Vorname, Nachname, Passwort,Salt];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not insert new Record. Data: ' + params);

        return this.loadById(result.lastInsertRowid);
    }

    update(Matnr, Vorname = '', Nachname = '', neuespasswort = null) {
        //TODO:
        //hashpasswort and store in db
        if (helper.isNull(neuespasswort)) {
            var sql = 'UPDATE User SET Vorname=?, Nachname=? WHERE Matnr=?';
            var statement = this._conn.prepare(sql);
            var params = [Vorname, Nachname, Matnr];
        } else {
            var sql = 'UPDATE User SET Vorname=?, Nachname=?, Passwort=? WHERE Matnr=?';
            var statement = this._conn.prepare(sql);
            var params = [Vorname, Nachname, neuespasswort, Matnr];
        }
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error('Could not update existing Record. Data: ' + params);

        return this.loadById(id);
    }

    delete(Matnr) {
        try {
            var sql = 'DELETE FROM User WHERE Matnr=?';
            var statement = this._conn.prepare(sql);
            var result = statement.run(Matnr);

            if (result.changes != 1)
                throw new Error('Could not delete Record by Matnr=' + Matnr);

            return true;
        } catch (ex) {
            throw new Error('Could not delete Record by Matnr=' + Matnr + '. Reason: ' + ex.message);
        }
    }

    toString() {
        console.log('UserDao [_conn=' + this._conn + ']');
    }

}

module.exports = UserDao;