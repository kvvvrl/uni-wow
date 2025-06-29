const helper = require('../helper.js');
const BewertungDao = require('../dao/bewertungDao.js');
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

serviceRouter.post('/bewertung', function(request, response) {
    console.log('Service bewertung: Client requested creation of new record');

    let errorMsgs=[];
    if (helper.isUndefined(request.body.User_Matnr))
        errorMsgs.push('User_Matnr fehlt');
    if (helper.isUndefined(request.body.Score))
        errorMsgs.push('Score fehlt');
    if (helper.isUndefined(request.body.Inhalt))
        errorMsgs.push('Inhalt fehlt');
    if (helper.isUndefined(request.body.Modul_id)) {
        errorMsgs.push('Modul_id fehlt');
    }

    if (errorMsgs.length > 0) {
        console.log('Service bewertung: Creation not possible, data missing');
        response.status(400).json({ 'fehler': true, 'nachricht': 'Funktion nicht möglich. Fehlende Daten: ' + helper.concatArray(errorMsgs) });
        return;
    }

    const bewertungDao = new BewertungDao(request.app.locals.dbConnection);
    try {
        let obj = bewertungDao.insert(request.body.User_Matnr, request.body.Score, request.body.Inhalt, request.body.Modul_id);
        console.log('Service bewertung: Record inserted');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service bewertung: Error creating new record. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
   // Beispiel: POST /bewertung mit JSON-Body
    //{
    //    "User_Matnr": "123456",
    //    "Score": 5,
    //    "Inhalt": "Tolle Veranstaltung!",
    //    "Modul_id": "1"
   // }
});

module.exports = serviceRouter;