/**
 * Created by lihiverchik on 17/12/2016.
 */
var React = require('react');
var constantStrings = require('../utils/ConstantStrings');
var paths = require('../utils/Paths');
var styles = require('../styles/managerStyles/styles');
var managerServices = require('../communication/managerServices');

var moment = require('moment');
var NotificationSystem = require('react-notification-system');
var userServices = require('../communication/userServices');



var options = {
    noDataText: constantStrings.NoDataText_string
};

var ReportsMonthlyAnalysis = React.createClass({
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
    componentWillMount() {
    },

    onClickExportReport: function() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var chosenYear = this.refs.datepicker.value;
        managerServices.exportMonthlyAnalysisReport(chosenYear)
            .then(function(data){
                notificationSystem.addNotification({
                    message: constantStrings.mailSentSuccess_string,
                    level: 'success',
                    autoDismiss: 2,
                    position: 'tc',
                });
            })
            .catch(function(err){
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
            });
    },

    onClickGetReport: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        var chosenYear = this.refs.datepicker.value;
        managerServices.getMonthlyAnalysisReportData(chosenYear)
            .then(function(data){
                var report = data;
                self.setState({
                    report: report
                })
            })
            .catch(function(err){
                notificationSystem.addNotification({
                    message: err,
                    level: 'error',
                    autoDismiss: 1,
                    position: 'tc',
                });
                self.setState({
                    report: undefined
                })
            })

    },

    onClickEditReport: function(){
        var self = this;
        var notificationSystem = this.refs.notificationSystem;
        if(this.state.report != undefined) {
            managerServices.updateMonthlyAnalysisReport(this.state.report.year, this.state.report)
                .then(function (data) {
                    notificationSystem.addNotification({
                        message: constantStrings.editSuccessMessage_string,
                        level: 'success',
                        autoDismiss: 1,
                        position: 'tc',
                    });
                })
                .catch(function (err) {
                    notificationSystem.addNotification({
                        message: err,
                        level: 'error',
                        autoDismiss: 1,
                        position: 'tc',
                    });
                });
        }
    },

    onChangeValue: function(month, section, channel) {
        var report = this.state.report;
        var newVal = this.refs[month + "#" + section + "#" + channel].value;
        report.monthData[month-1][section][channel] = newVal;
    },

    onChangeEncValue: function(month, index){
        var report = this.state.report;
        var newVal = this.refs[month + "#" + index].value;
        report.monthData[month-1]["monthlyEncoragement"][index]["amount"] = newVal;
        console.log(this.state.report.monthData[month-1]["monthlyEncoragement"][index]["amount"] = newVal);
    },

    renderMonthSections: function(sectionData, index){
        return (
            <div style={styles.col} className="w3-theme-l5 w3-round-large ">
                <p>{constantStrings.dictionary[sectionData['section']]}</p>
                <div className="col-sm-10" style={{padding: '0'}}>
                    <p className="col-sm-6">{constantStrings.dictionary["traditionalHot"]}</p>
                    <input type="number" min="0" className="w3-round-large col-sm-6"
                        defaultValue={sectionData.traditionalHot} ref={sectionData.month + "#" + sectionData.section + "#traditionalHot"}
                        onChange={() => this.onChangeValue(sectionData.month,sectionData.section, "traditionalHot")}/>
                </div>
                <div className="col-sm-10" style={{padding: '0'}}>
                    <p className="col-sm-6">{constantStrings.dictionary["traditionalOrganized"]}</p>
                    <input type="number" min="0" className="w3-round-large col-sm-6"
                        defaultValue={sectionData.traditionalOrganized} ref={sectionData.month + "#" + sectionData.section + "#traditionalOrganized"}
                        onChange={() => this.onChangeValue(sectionData.month,sectionData.section, "traditionalOrganized")}/>
                </div>
                <div className="col-sm-10" style={{padding: '0'}}>
                    <p className="col-sm-6">{constantStrings.dictionary["organized"]}</p>
                    <input type="number" min="0" className="w3-round-large col-sm-6"
                        defaultValue={sectionData.organized} ref={sectionData.month + "#" + sectionData.section + "#organized"}
                        onChange={() => this.onChangeValue(sectionData.month,sectionData.section, "organized")}/>
                </div>

            </div>
        )
    },

    renderEncouragements: function(encouragement, index){
        return (
            <div style={styles.col} className="w3-theme-l5 w3-round-large">
                <p>{encouragement.encouragement.name}</p>
                <input type="number" min="0" className="w3-round-large col-sm-8" defaultValue={encouragement.amount}
                    ref={encouragement.month + "#" + index} onChange={() => this.onChangeEncValue(encouragement.month, index)}/>
            </div>
        )
    },

    renderMonthData: function(monthData, index){
        var dataAsArray = [];
        for(var key in monthData){
            if(key != 'month' && key != '_id' && key != 'monthlyEncoragement') {
                var value = monthData[key];
                value['section'] = key;
                value['month'] = monthData.month;
                dataAsArray.push(value)
            }
        }
        for(var i in monthData.monthlyEncoragement){
            monthData.monthlyEncoragement[i]["month"] = monthData.month;
        }
        return (
            <div className="w3-container w3-theme-d3 w3-round-large w3-card-4" style={styles.marginTop}>
                <h3 className="col-sm-1">{constantStrings.numberToMonth[monthData.month]}</h3>
                <div className="row">
                    {dataAsArray.map(this.renderMonthSections)}
                </div>
                <div className="row col-sm-offset-1">
                    {monthData.monthlyEncoragement.map(this.renderEncouragements)}
                </div>
            </div>
        )
    },

    renderReport: function(){
        if(this.state.report == undefined){
            return (
                <div></div>
            )
        }
        else {
            var report = this.state.report;
            return (
                <div className="w3-container">
                    {report.monthData.map(this.renderMonthData)}
                </div>
            )
        }
    },

    render: function () {
        var year = (new Date).getFullYear();
        return (
            <div className="w3-container">
                <div className="col=sm-12">
                    <div className="row text-center">
                        <h2>{constantStrings.monthlyAnalysisReportTitle_string}</h2>
                    </div>
                    <div className="row">
                        <input className="col-sm-1 w3-card-4 w3-round-xlarge" ref="datepicker" type="number" min="2000" max="2099"
                               defaultValue={year}/>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickGetReport}>{constantStrings.reportsShowReport_string}</button>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickEditReport}>{constantStrings.editReport_string}</button>
                        <button className="col-sm-1 w3-round-xlarge w3-btn w3-theme-d5 w3-card-4" style={{width: '100px', marginRight: '20px'}} onClick={this.onClickExportReport}>{constantStrings.getReport_string}</button>

                    </div>
                    {this.renderReport()}
                </div>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    }

});

module.exports = ReportsMonthlyAnalysis;