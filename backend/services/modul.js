const helper = require('../helper.js');
const ModulDao = require('../dao/modulDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service modul');

serviceRouter.get('/modul/gib/:id', function(request, response) {
    console.log('Service modul: Client requested one record, id=' + request.params.id);

    const modulDao = new ModulDao(request.app.locals.dbConnection);
    try {
        var obj = modulDao.loadById(request.params.id);
        console.log('Service modul: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service modul: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;