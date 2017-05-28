/**
 * Created by lihiverchik on 17/12/2016.
 */
var React               = require('react');
var constantStrings     = require('../utils/ConstantStrings');
var styles              = require('../styles/managerStyles/styles');
var managerServices     = require('../communication/managerServices');
var moment              = require('moment');
var NotificationSystem  = require('react-notification-system');
var userServices        = require('../communication/userServices');

var ReportHumanResources = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },

    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },

    getInitialState() {
        this.setSessionId();
        this.setUserType();
        return{
            report: undefined
        }
    },

    onClickExportReport: function() {
        var notificationSystem = this.refs.notificationSystem;
        var datepickerVal = this.refs.datepicker.value.split('-');
        managerServices.exportSalaryForHumanResourceReport(parseInt(datepickerVal[0]), parseInt(datepickerVal[1]) - 1)
            .then(function(data){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 1,
                    position: 'tc',
                });
            })
            .catch(function(err){
                notificationSystem.clearNotifications();
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 0,
                    position: 'tc',
                });
            });
    },

    render: function () {
        var year = (new Date).getFullYear();
        return (
            <div className="w3-container">
                <div className="col=sm-12">
                    <div className="row text-center">
                        <h2>{constantStrings.reportsHumanResourcesReportTitle_string}</h2>
                    </div>
                    <div className="row">
                        <input className="col-sm-2 w3-card-4 w3-round-xlarge" ref="datepicker" type="month"/>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickExportReport}>{constantStrings.getReport_string}</button>
                    </div>
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }
});

module.exports = ReportHumanResources;