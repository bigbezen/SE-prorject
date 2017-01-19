var checkParams = function(params, param_arr, type_arr){
    for(var i=0; i<param_arr.length; i++){
        if(!(param_arr[i] in params && typeof(params[param_arr[i]]) == type_arr[i]))
            return false;
        if(type_arr[i] == stringT && param_arr[i] == "")
            return false;
    }
    return true;
};

let stringT = typeof(stringT);
let numberT = typeof(1);
let objectT = typeof({'key': 'value'});
let boolT = typeof(true);

module.exports = {


    login: function(params){
        return checkParams(params, ['username', 'password'],
            [stringT, stringT]);
    },

    sessionId: function(params){
        return checkParams(params, ['sessionId'], [stringT]);
    },

    changePassword: function(params){
        return checkParams(params, ['sessionId', 'newPass', 'oldPass'],
            [stringT, stringT, stringT]);
    },

    addUser: function(params){
        return checkParams(params, ['sessionId', 'userDetails'],
                    [stringT, objectT]) &&
                checkParams(params.userDetails, ['username', 'startDate', 'personal', 'contact', 'jobDetails'],
                    [stringT, stringT, objectT, objectT, objectT,]) &&
                checkParams(params.userDetails.personal, ['id', 'firstName', 'lastName', 'sex', 'birthday'],
                    [stringT, stringT, stringT, stringT, stringT]) &&
                checkParams(params.userDetails.contact, ['address', 'phone', 'email'],
                    [objectT, stringT, stringT,]) &&
                checkParams(params.userDetails.contact.address, ['street', 'number', 'city', 'zip'],
                    [stringT, stringT, stringT, stringT,]) &&
                checkParams(params.userDetails.jobDetails, ['userType'],
                    [stringT]);
    },

    editUser: function(params){
        return checkParams(params, ['sessionId', 'username', 'userDetails'],
                [stringT, stringT, objectT]) &&
            checkParams(params.userDetails, ['username', 'startDate', 'personal', 'contact', 'jobDetails'],
                [stringT, stringT, objectT, objectT, objectT,]) &&
            checkParams(params.userDetails.personal, ['id', 'firstName', 'lastName', 'sex', 'birthday'],
                [stringT, stringT, stringT, stringT, stringT]) &&
            checkParams(params.userDetails.contact, ['address', 'phone', 'email'],
                [objectT, stringT, stringT,]) &&
            checkParams(params.userDetails.contact.address, ['street', 'number', 'city', 'zip'],
                [stringT, stringT, stringT, stringT,]) &&
            checkParams(params.userDetails.jobDetails, ['userType'],
                [stringT]);
    },

    deleteUser: function(params){
        return checkParams(params, ['sessionId', 'username'],
            [stringT, stringT]);
    },

    addOrEditOrDeleteStore: function(params){
        return checkParams(params, ['sessionId', 'storeDetails'],
            [stringT, objectT]) &&
            checkParams(params.storeDetails, ['name', 'managerName', 'phone', 'city', 'address', 'area', 'channel'],
                [stringT, stringT, stringT, stringT, stringT, stringT, stringT]);
    },

    deleteStore: function(params){
        return checkParams(params, ['sessionId', 'storeId'],
            [stringT, stringT]);
    },

    addOrEditProduct: function(params){
        return checkParams(params, ['sessionId', 'productDetails'],
                [stringT, objectT]) &&
                checkParams(params.productDetails, ['name', 'retailPrice', 'salePrice', 'category', 'subCategory', 'minRequiredAmount', 'notifyManager'],
                    [stringT, numberT, numberT, stringT, stringT, numberT, boolT]);
    },

    deleteProduct: function(params){
        return checkParams(params, ['sessionId', 'productId'],
            [stringT, stringT]);
    },

    addOrEditEncouragement: function(params){
        return checkParams(params, ['sessionId', 'encouragementDetails'],
                [stringT, objectT]) &&
            checkParams(params.encouragementDetails, ['active', 'numOfProducts', 'rate', 'products'],
                [boolT, numberT, numberT, objectT]);
    },

    deleteEncouragement: function(params){
        return checkParams(params, ['sessionId', 'encuragementId'], [stringT, stringT]);
    },

    sendBroadcastMessage: function(params){
        return checkParams(params, ['sessionId', 'content', 'date'], [stringT, stringT, stringT])
    },

    addOrPublishShifts: function(params){
        var res = checkParams(params, ['sessionId', 'shiftsArr'], [stringT, objectT]);
        for(shift of params.shiftsArr){
            if(res)
                res = res && checkParams(shift, ['storeId', 'startTime', 'endTime', 'type'], [stringT, stringT, stringT, stringT])
        }
        return res;
    },

    generateShifts: function(params){
        return checkParams(params, ['sessionId', 'startTime', 'endTime'], [stringT, stringT, stringT]);
    },

    startOrEndShift: function(params){

    },

    reportSaleOrOpened: function(params){

    }



};