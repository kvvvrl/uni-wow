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

module.exports = serviceRouter;