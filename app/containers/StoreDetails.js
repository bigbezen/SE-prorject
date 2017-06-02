/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var managerServices     = require('../communication/managementServices');
var constantsStrings    = require('../utils/ConstantStrings');
var storeInfo           = require('../models/store');
var paths               = require('../utils/Paths');
var styles              = require('../styles/managerStyles/styles');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');

var StoreDetails = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        return {
            editing: false,
            area:'',
            channel:''
        }
    },

    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },

    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },

    handleAreaChange(event) {
        this.setState({area: event.target.value});
    },

    handleChannelChange(event) {
        this.setState({channel: event.target.value});
    },

    componentDidMount() {
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        this.state.editing = isEmptyVar;
        if (this.state.editing) {
            this.setFields();
        }
    },

    checkDropDowns: function() {
        return (this.state.area!='' && this.state.channel!='');
    },

    getOptions: function(arrayOfObjects) {
        var optionsForDropDown = [];
        optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);
        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            optionsForDropDown.push(<option value={currOption}>{currOption}</option>);
        }
        return optionsForDropDown;
    },

    isEmpty: function(obj) {
        for(var i in obj) { return false; }
        return true;
    },

    handleSubmitUser: function (e) {
        e.preventDefault();
       /* if (!this.checkDropDowns()) {
            alert('Invalid values. please make sure that you filled all of the fields');
            return;
        }*/
        var newStore = new storeInfo();
        newStore.name = this.refs.nameBox.value;
        newStore.managerName = this.refs.managerNameBox.value;
        newStore.phone = this.refs.phoneBox.value;
        newStore.managerEmail = this.refs.emailBox.value;
        newStore.city = this.refs.cityBox.value;
        newStore.address = this.refs.addressBox.value;
        newStore.area = this.state.area;
        newStore.channel = this.state.channel;
        var context = this.context;
        var notificationSystem = this.refs.notificationSystem;
        if (this.state.editing) {
            newStore._id = this.props.location.query._id;
            managerServices.editStore(newStore).then(function (n) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.editSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                    onRemove: function (notification) {
                        context.router.push({
                            pathname: paths.manager_stores_path
                        })
                    }
                });
            }).catch(function (errMess) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: errMess,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc'
                });
            })
        }else {
            managerServices.addStore(newStore).then(function (n) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantsStrings.addSuccessMessage_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                    onRemove: function (notification) {
                        context.router.push({
                            pathname: paths.manager_stores_path
                        })
                    }
                });
            }).catch(function (errMess) {
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: errMess,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc'
                });
            })
        }
    },

    getTitle: function() {
        if (this.state.editing) {
            return constantsStrings.editStore_string;
        }
        return constantsStrings.addStore_string;
    },

    getButtonString: function() {
        if (this.state.editing) {
            return constantsStrings.edit_string;
        }
        return constantsStrings.add_string;
    },

    addNewStore: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-theme-d4 w3-card-8">
                <form onSubmit={this.handleSubmitUser} className="form-horizontal text-right w3-text-black">
                    <div className="form-group">
                        <h1 className="col-xs-offset-1 col-xs-9 w3-xxlarge">
                            <b>{this.getTitle()}</b>
                        </h1>
                    </div>
                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.storeName_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text"
                               className="col-xs-4 col-xs-offset-2"
                               ref="nameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.managerName_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="managerNameBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.phone_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="phoneBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.email_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text" min={0}
                               className="col-xs-4 col-xs-offset-2"
                               ref="emailBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.city_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text"
                               className="col-xs-4 col-xs-offset-2"
                               ref="cityBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.address_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="text"
                               className="col-xs-4 col-xs-offset-2"
                               ref="addressBox"
                        />
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.area_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleAreaChange} ref="areaBox">
                            {this.getOptions(constantsStrings.areaForDropdown)}
                        </select>
                    </div>


                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.channel_string}:</label>
                    </div>
                    <div className="form-group ">
                        <select className="col-xs-4 col-xs-offset-2" onChange={this.handleChannelChange} ref="channelBox">
                            {this.getOptions(constantsStrings.channelForDropdown)}
                        </select>
                    </div>


                    <div className="form-group">
                        <button
                            className="w3-btn w3-card-4 w3-theme-d5 col-xs-4 col-xs-offset-2"
                            type="submit">
                            {this.getButtonString()}
                        </button>
                    </div>
                </form>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    setFields: function () {
        let currStore = this.props.location.query;
        this.state.area =  currStore.area;
        this.state.channel = currStore.channel;
        this.refs.nameBox.value = currStore.name;
        this.refs.managerNameBox.value = currStore.managerName;
        this.refs.phoneBox.value = currStore.phone;
        this.refs.emailBox.value = currStore.managerEmail;
        this.refs.cityBox.value = currStore.city;
        this.refs.addressBox.value = currStore.address;
        this.refs.areaBox.value = currStore.area;
        this.refs.channelBox.value = currStore.channel;
    },

    render: function () {
        return this.addNewStore();
    }

});

module.exports = StoreDetails;