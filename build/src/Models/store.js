var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storeSchema = new Schema({
    'name': String,
    'managerName': String,
    'phone': String,
    'city': String,
    'address': String,
    'area': String,
    'channel': String
});

var store = mongoose.model('store', storeSchema);

module.exports = store;