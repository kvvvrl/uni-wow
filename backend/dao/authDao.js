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

    exists(Matnr) {
        let sql = 'SELECT COUNT(Matnr) AS cnt FROM User WHERE Matnr=?';
        let statement = this._conn.prepare(sql);
        let result = statement.get(Matnr);

        if (result.cnt == 1)
            return true;

        return false;
    }


    hasaccess(Matnr, Passwort) {
        let sql = 'SELECT Matnr FROM User WHERE Matnr=? AND Passwort=?';
        let statement = this._conn.prepare(sql);
        let params = [Matnr, Passwort];
        let result = statement.get(params);

        if (helper.isUndefined(result)) 
            throw new Error('User has no access');

        return this.loadById(result.Matnr);
    }

    create(Matnr = null, Vorname = '', Nachname = '', Passwort = '',Salt='') {
        //TODO:
        //hashpasswort and store in db
        let sql = 'INSERT INTO User (Matnr,Vorname,Nachname,Passwort,Salt) VALUES (?,?,?,?,?)';
        let statement = this._conn.prepare(sql);
        let params = [Matnr, Vorname, Nachname, Passwort,Salt];
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

    toString() {
        console.log('UserDao [_conn=' + this._conn + ']');
    }

}

module.exports = UserDao;