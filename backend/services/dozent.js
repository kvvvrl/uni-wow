const helper = require('../helper.js');
const DozentDao = require('../dao/dozentDao.js');
const express = require('express');
var serviceRouter = express.Router();

console.log('- Service dozent');

serviceRouter.get('/dozent/gib/:id', function(request, response) {
    console.log('Service dozent: Client requested one record, id=' + request.params.id);

    const dozentDao = new DozentDao(request.app.locals.dbConnection);
    try {
        var obj = dozentDao.loadById(request.params.id);
        console.log('Service dozent: Record loaded');
        response.status(200).json(obj);
    } catch (ex) {
        console.error('Service dozent: Error loading record by id. Exception occured: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': ex.message });
    }
});

module.exports = serviceRouter;