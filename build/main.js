function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

var logger = require('./src/Utils/Logger/logger');

var storeService = require('./src/Services/store/index');
var userService = require('./src/Services/user/index');

var app = express();

app.set('view engine', 'ejs');
var port = 3000;
app.use(bodyparser.json());
app.listen(port);
app.locals.baseurl = "http://localhost:" + port;
app.locals.mongourl = 'mongodb://localhost/IBBLS';

_connectToDb();
_setapApiEndpoints();

logger.info('server is now running on port: ', { 'port': port });

function _connectToDb() {
    mongoose.Promise = global.Promise;
    mongoose.connect(app.locals.mongourl);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('connected to db successfuly');
    });
}

function _setapApiEndpoints() {

    app.use('/scripts', express.static(path.join(__dirname, '/../scripts')));

    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../index.html'));
    });

    //User Services
    app.post('/user/login', (() => {
        var _ref = _asyncToGenerator(function* (req, res) {
            var result = yield userService.login(req.body.username, req.body.password);
            if (result.sessionId != null) {
                res.status(200).send(result);
            } else {
                res.status(401).send();
            }
        });

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    })());

    app.post('/user/logout', function (req, res) {
        res.status(200).send('logout');
    });

    app.post('/user/retrievePassword', function (req, res) {
        res.status(200).send('retrievePassword');
    });

    app.post('/user/changePassword', function (req, res) {
        res.status(200).send('changePassword');
    });

    app.get('/user/getProfile', function (req, res) {
        res.status(200).send('get profile');
    });

    //Salesman Services
    app.post('/salesman/enterShift', function (req, res) {
        res.status(200).send('enter shift');
    });

    app.post('/salesman/exitShift', function (req, res) {
        res.status(200).send('exit shift');
    });

    app.post('/salesman/addSale', function (req, res) {
        res.status(200).send('add new sale');
    });

    app.post('/salesman/addShiftNote', function (req, res) {
        res.status(200).send('add shift note');
    });

    app.get('/salesman/encouragements', function (req, res) {
        res.status(200).send('get encouragements list');
    });

    app.get('/salesman/shifts', function (req, res) {
        res.status(200).send('get shifts list');
    });

    app.post('/salesman/addShiftsConstraints', function (req, res) {
        res.status(200).send('add shifts constraints');
    });

    app.get('/salesman/salesHistory', function (req, res) {
        res.status(200).send('get sales history');
    });

    app.get('/salesman/getBroadcastMessages', function (req, res) {
        res.status(200).send('get broadcast messages');
    });

    app.post('/salesman/enterShift', function (req, res) {
        res.status(200).send('enter shift');
    });

    app.post('/salesman/shiftRegister', function (req, res) {
        res.status(200).send('registration to shift');
    });

    //Management Services

    app.post('/management/addUser', function (req, res) {
        userService.addUser();
        res.status(200).send('add new user');
    });

    app.post('/management/editUser', function (req, res) {
        res.status(200).send('edit user');
    });

    app.post('/management/deleteUser', function (req, res) {
        res.status(200).send('delete user');
    });

    app.post('/management/addStore', function (req, res) {
        storeService.addStore(req.param('session-id'), req.param('store'), function (err) {
            if (err != null) {
                res.status(200).send(err);
            } else {
                res.status(200).send('store added successfully');
            }
        });
    });

    app.post('/management/editStore', function (req, res) {
        res.status(200).send('edit user');
    });

    app.post('/management/deleteStore', function (req, res) {
        res.status(200).send('delete user');
    });

    app.post('/management/addProduct', function (req, res) {
        res.status(200).send('add new user');
    });

    app.post('/management/editProduct', function (req, res) {
        res.status(200).send('edit user');
    });

    app.post('/management/deleteProduct', function (req, res) {
        res.status(200).send('delete user');
    });

    app.post('/management/addEncouragement', function (req, res) {
        res.status(200).send('add new user');
    });

    app.post('/management/editEncouragement', function (req, res) {
        res.status(200).send('edit user');
    });

    app.post('/management/deleteEncouragement', function (req, res) {
        res.status(200).send('delete user');
    });

    app.post('/management/addShift', function (req, res) {
        res.status(200).send('add new user');
    });

    app.post('/management/editShift', function (req, res) {
        res.status(200).send('edit user');
    });

    app.post('/management/deleteShift', function (req, res) {
        res.status(200).send('delete user');
    });

    //Manager Services

    app.post('/manager/addNotificationRule', function (req, res) {
        res.status(200).send('add new notification rule');
    });

    app.post('/manager/removeNotificationRule', function (req, res) {
        res.status(200).send('remove notification rule');
    });

    app.post('/manager/setNotificationRule', function (req, res) {
        res.status(200).send('set new notification rule');
    });

    app.post('/manager/sendBroadcastMessage', function (req, res) {
        res.status(200).send('send a broadcast message');
    });

    app.get('/manager/getShiftNotes', function (req, res) {
        res.status(200).send('get shift notes');
    });

    app.post('/manager/editSalesReport', function (req, res) {
        res.status(200).send('edit sales report');
    });

    app.get('/manager/getRecommendations', function (req, res) {
        res.status(200).send('TODO - not yet implemented');
    });

    app.get('/manager/getShiftDetails', function (req, res) {
        res.status(200).send('get a specific shift details');
    });

    app.get('/manager/getShortages', function (req, res) {
        res.status(200).send('get shortages');
    });

    app.post('/manager/publishShifts', function (req, res) {
        res.status(200).send('publish shifts');
    });

    app.get('/manager/getReports', function (req, res) {
        res.status(200).send('get reports of some kind');
    });
}