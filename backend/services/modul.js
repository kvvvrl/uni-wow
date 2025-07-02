const helper = require('../helper.js');
const ModulDao = require('../dao/modulDao.js');
const express = require('express');
const authHelper = require('../authHelper.js');
let serviceRouter = express.Router();

console.log('- Service modul');

//loadById get Modul by id
serviceRouter.get('/modul/gib/:id', function(request, response) {
    console.log('Service modul: Client requested one record, id=' + request.params.id);

    const modulDao = new ModulDao(request.app.locals.dbConnection);
    const token = request.header('authorization')

    if(authHelper.authUser(token)) {
        try {
            let obj = modulDao.loadById(request.params.id, authHelper.getUser(token));
            console.log('Service modul: Record loaded');
            response.status(200).json(obj);
        } catch (ex) {
            console.error('Service modul: Error loading record by id. Exception occured: ' + ex.message);
            response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
        }
    } else {
        response.status(401).json({'fehler': true, 'nachricht': 'Nicht Authentifiziert'});
    }
});


//loadAll get all Modul
serviceRouter.get('/modul/alle', function(request, response) {
    console.log('Service modul: Client requested all records');

    const modulDao = new ModulDao(request.app.locals.dbConnection);

    const token = request.header('authorization')

    if(authHelper.authUser(token)) {
        try {
            const matnr = authHelper.getUser(token)
            let arr = modulDao.loadAll(matnr);
            console.log('Service modul: Records loaded, count=' + arr.length);
            response.status(200).json(arr);
        } catch (ex) {
            console.error('Service modul: Error loading record by id. Exception occured: ' + ex.message);
            response.status(400).json({'fehler': true, 'nachricht': ex.message});
        }
    } else {
        response.status(401).json({'fehler': true, 'nachricht': 'Nicht Authentifiziert'});
    }
});

//loadByVerantwortlicher get Modul by Verantwortlicher
serviceRouter.get('/modul/verantwortlicher/:id', function(request, response) {
    console.log('Service modul: Client requested all records by Verantwortlicher, id=' + request.params.id);

    const modulDao = new ModulDao(request.app.locals.dbConnection);

    const token = request.header('authorization')

    if(authHelper.authUser(token)) {
        try {
            let arr = modulDao.loadByVerantwortlicher(request.params.id);
            console.log('Service modul: Records loaded, count=' + arr.length);
            response.status(200).json(arr);
        } catch (ex) {
            console.error('Service modul: Error loading records by Verantwortlicher. Exception occured: ' + ex.message);
            response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
        }
    } else {
        response.status(401).json({'fehler': true, 'nachricht': 'Nicht Authentifiziert'});
    }
});


module.exports = serviceRouter;