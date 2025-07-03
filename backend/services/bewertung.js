const helper = require('../helper.js');
const BewertungDao = require('../dao/bewertungDao.js');
const UserDao = require("../dao/userDao");
const express = require('express');
const authHelper = require("../authHelper");
let serviceRouter = express.Router();

console.log('- Service bewertung');

serviceRouter.get('/bewertung/gib/:id', function(request, response) {
    console.log('Service bewertung: Client requested one record, id=' + request.params.id);

    const bewertungDao = new BewertungDao(request.app.locals.dbConnection);
    try {
        let obj = bewertungDao.loadById(request.params.id);
        console.log('Service bewertung: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service bewertung: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.get('/bewertungen/modul/gib/:modul_id', function (request, response){
    console.log('Service bewertung: Client requested one record, id=' + request.params.modul_id);
    const bewertungDao = new BewertungDao(request.app.locals.dbConnection);

    const token = request.header('authorization')
    if(authHelper.authUser(token)) {
        try {
            const id = parseInt(request.params.modul_id);
            let obj = bewertungDao.loadByModule(id);
            console.log('Service bewertung: Record loaded');
            response.status(200).json(obj);
        } catch (ex) {
            console.error('Service bewertung: Error loading record by id. Exception occured: ' + ex.message);
            response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
        }
    } else {
        response.status(401).json({'fehler': true, 'nachricht': 'Nicht Authentifiziert'});
    }
});

serviceRouter.get('/bewertungen/user/gib', function (request, response){
    const bewertungDao = new BewertungDao(request.app.locals.dbConnection);

    const token = request.header('authorization')
    if(authHelper.authUser(token)) {
        try {
            const matnr = authHelper.getUser(token);
            let obj = bewertungDao.loadByMatnr(matnr);
            console.log('Service bewertung: Record loaded');
            response.status(200).json(obj);
        } catch (ex) {
            console.error('Service bewertung: Error loading record by id. Exception occured: ' + ex.message);
            response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
        }
    } else {
        response.status(401).json({'fehler': true, 'nachricht': 'Nicht Authentifiziert'});
    }
})

serviceRouter.get('/bewertungen/alle', function (request, response) {
    const bewertungDao = new BewertungDao(request.app.locals.dbConnection);
    try {
        let obj = bewertungDao.loadAll(); 
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service bewertung: Error loading all records. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

serviceRouter.post('/bewertung', function(request, response) {
    console.log('Service bewertung: Client requested creation of new record');

    const token = request.header('authorization')

    if(authHelper.authUser(token)) {

        let errorMsgs=[];
        if (helper.isUndefined(request.body.Note))
            errorMsgs.push('User_Matnr fehlt');
        if (helper.isUndefined(request.body.Score))
            errorMsgs.push('Score fehlt');
        if (helper.isUndefined(request.body.Inhalt))
            errorMsgs.push('Inhalt fehlt');
        if (helper.isUndefined(request.body.Modul_id)) {
            errorMsgs.push('Modul_id fehlt');
        }

        const matnr = authHelper.getUser(token);

        if (errorMsgs.length > 0) {
            console.log('Service bewertung: Creation not possible, data missing');
            response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
            return;
        }

        const bewertungDao = new BewertungDao(request.app.locals.dbConnection);
        const userDao = new UserDao(request.app.locals.dbConnection);

        try {

            if(bewertungDao.exists(matnr, request.body.Modul_id)){
                let obj = bewertungDao.update(matnr, request.body.Score, request.body.Inhalt, request.body.Modul_id);
                let obj2 = userDao.updateGrade(request.body.Modul_id, matnr, request.body.Note);
                console.log('Service bewertung and grade: Records updated');
            } else {
                let obj = bewertungDao.insert(matnr, request.body.Score, request.body.Inhalt, request.body.Modul_id);
                console.log('Service bewertung: Record inserted');
                let obj2 = userDao.saveGrade(request.body.Modul_id, matnr, request.body.Note);
            }
            response.status(200);
        } catch (ex) {
            console.error('Service bewertung: Error creating new record. Exception occured: ' + ex.message);
            response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
        }
    } else {
        response.status(401).json({'fehler': true, 'nachricht': 'Nicht Authentifiziert'});
    }
});

module.exports = serviceRouter;