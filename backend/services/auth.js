const helper = require('../helper.js');
const AuthDao = require('../dao/authDao.js');
const UserDao = require('../dao/userDao.js');
const express = require('express');
const authHelper = require('../authHelper.js');
let serviceRouter = express.Router();
const SECRET = "DasIstSicher"

console.log('- Service auth');

serviceRouter.post('/auth/login', function (request, response) {
    console.log('body:' + request.body.Matnr);
    console.log('body:' + request.body.Passwd);

    const userDao = new UserDao(request.app.locals.dbConnection);
    try {
        let user = userDao.hasaccess(request.body.Matnr, request.body.Passwd);

        const token = authHelper.getJWT(user.Matnr, user.Vorname + user.Nachname);

        response.status(200).json({token});

    } catch (ex) {
        console.error('Service auth: Error while finding authenticating user: ' + ex.message);
        response.status(400).json({ 'fehler': true, 'nachricht': 'Benutzer konnte nicht gefunden werden!'});
    }
});

module.exports = serviceRouter;