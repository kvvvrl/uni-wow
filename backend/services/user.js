const helper = require('../helper.js');
const UserDao = require('../dao/userDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service user');

serviceRouter.get('/user/gib/:id', function(request, response) {
    console.log('Service user: Client requested one record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var obj = userDao.loadById(request.params.id);
        console.log('Service user: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service user: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/user/alle', function(request, response) {
    console.log('Service User: Client requested all records');

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var arr = userDao.loadAll();
        console.log('Service User: Records loaded, count=' + arr.length);
        response.status(200).json(arr);
    } catch (ex) {
        console.error('Service User: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/user/existiert/:id', function(request, response) {
    console.log('Service User: Client requested check, if record exists, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var exists = userDao.exists(request.params.id);
        console.log('Service User: Check if record exists by id=' + request.params.id + ', exists=' + exists);
        response.status(200).json({ 'id': request.params.id, 'existiert': exists });
    } catch (ex) {
        console.error('Service User: Error checking if record exists. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});


serviceRouter.get('/user/check/:matnr/:passwort', function(request, response) {
    console.log('Service User: Client requested check, if user has access for/with', request.params.matnr, request.params.passwort);

    var errorMsgs=[];
    if (helper.isUndefined(request.params.matnr)) 
        errorMsgs.push('matnr fehlt');
    if (helper.isUndefined(request.params.passwort)) 
        errorMsgs.push('passwort fehlt');

    if (errorMsgs.length > 0) {
        console.log('Service User: check not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var hasaccess = userDao.hasaccess(request.params.matnr, request.params.passwort);
        console.log('Service User: Check if user has access, hasaccess=' + hasaccess);
        response.status(200).json(hasaccess);
    } catch (ex) {
        console.error('Service User: Error checking if user has access. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/user', function(request, response) {
    console.log('Service User: Client requested creation of new record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.Matnr))
        errorMsgs.push('Matnr fehlt');
    if (helper.isUndefined(request.body.Vorname))
        errorMsgs.push('Vorname fehlt');
    if (helper.isUndefined(request.body.Nachname))
        errorMsgs.push('Nachname fehlt');
    if (helper.isUndefined(request.body.Passwort)) {
        errorMsgs.push('Passwort fehlt');
    }

    if (errorMsgs.length > 0) {
        console.log('Service User: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var obj = userDao.create(request.body.Matnr, request.body.Vorname, request.body.Nachname, request.body.Passwort);
        console.log('Service User: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service User: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
   // Beispiel: POST /user mit JSON-Body
    //{
    //    "Matnr": "123456",
    //    "Vorname": "Max",
    //    "Nachname": "Mustermann",
    //    "Passwort": "passwort123"
});




serviceRouter.put('/user', function(request, response) {
    console.log('Service User: Client requested update of existing record');

    var errorMsgs=[];
    if (helper.isUndefined(request.body.Matnr)) 
        errorMsgs.push('Matnr fehlt');
    if (helper.isUndefined(request.body.Vorname))
        errorMsgs.push('Vorname fehlt');
    if (helper.isUndefined(request.body.Nachname))
        errorMsgs.push('Nachname fehlt');
    if (helper.isUndefined(request.body.neuespasswort))
        errorMsgs.push('Neues Passwort fehlt');
    
    if (errorMsgs.length > 0) {
        console.log('Service User: Update not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var obj = userDao.update(request.body.Matnr, request.body.Vorname, request.body.Nachname, request.body.neuespasswort);
        console.log('Service User: Record updated, id=' + request.body.Matnr);
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service User: Error updating record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }    
});

serviceRouter.delete('/user/:id', function(request, response) {
    console.log('Service User: Client requested deletion of record, id=' + request.params.id);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        var obj = userDao.loadById(request.params.id);
        userDao.delete(request.params.id);
        console.log('Service User: Deletion of record successfull, id=' + request.params.id);
        response.status(200).json({ 'gelöscht': true, 'eintrag': obj });
    } catch (ex) {
        console.error('Service User: Error deleting record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;