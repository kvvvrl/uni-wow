const helper = require('../helper.js');
const BewertungDao = require('../dao/bewertungDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service bewertung');

serviceRouter.get('/bewertung/gib/:id', function(request, response) {
    console.log('Service bewertung: Client requested one record, id=' + request.params.id);

    const bewertungDao = new BewertungDao(request.app.locals.dbConnection);
    try {
        var obj = bewertungDao.loadById(request.params.id);
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
    try {
        const id = parseInt(request.params.modul_id);
        var obj = bewertungDao.loadByModule(id);
        console.log('Service bewertung: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service bewertung: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
    }
);

serviceRouter.get('/bewertungen/user/gib/:matnr', function (request, response){
    const bewertungDao = new BewertungDao(request.app.locals.dbConnection);
    try {
        const id = parseInt(request.params.matnr);
        var obj = bewertungDao.loadByMatnr(id);
        console.log('Service bewertung: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service bewertung: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
})
module.exports = serviceRouter;