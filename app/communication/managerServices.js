/**
 * Created by lihiverchik on 14/12/2016.
 */
var connection = require('../communication/connectionHandler')

var helpers = {
    addNotificationRule: function(){
        console.log('userServices- Login ');
        return connection.managerRequests.addNotificationRule();
    },

    removeNotificationRule: function(){
        console.log('managerServices- Login ');
        return connection.managerRequests.removeNotificationRule();
    },

    setNotificationRule: function(){
        console.log('managerServices- setNotificationRule');
        return connection.managerRequests.setNotificationRule();
    },

    sendBroadcastMessage: function(){
        console.log('managerServices- sendBroadcastMessage');
        return connection.managerRequests.sendBroadcastMessage();
    },

    getShiftNotes: function(){
        console.log('managerServices- getShiftNotes');
        return connection.managerRequests.getShiftNotes();
    },

    editSalesReport: function(){
        console.log('managerServices- editSalesReport');
        return connection.managerRequests.editSalesReport();
    },

    getRecommendations: function(){
        console.log('managerServices- getRecommendations');
        return connection.managerRequests.getRecommendations();
    },

    getShiftDetails: function(){
        console.log('managerServices- getShiftDetails');
        return connection.managerRequests.getShiftDetails();
    },

    getShortages: function(){
        console.log('managerServices- getShortages');
        return connection.managerRequests.getShortages();
    },

    getSaleReportXl: function(shift){
        console.log('managerServices- getReports');
        return connection.managerRequests.getSaleReportXl(shift);
    },

    getSalesmanListXL: function () {
        console.log('managerServices- getSalesmanReports');
        return connection.managerRequests.getSalesmanListXL();
    },

    getMonthlyAnalysisReportData: function(year) {
        console.log('managerServices - getMonthlyAnalysisReport');
        return connection.managerRequests.getMonthlyAnalysisReport(year);
    },

    updateMonthlyAnalysisReport: function(year, report){
        console.log('managerService - updateMonthlyAnalysisReport');
        return connection.managerRequests.updateMonthlyAnalysisReport(year, report);
    },

    exportMonthlyAnalysisReport: function(year){
        console.log('managerService - exportMonthlyAnalysisReport');
        return connection.managerRequests.exportMonthlyAnalysisReport(year);
    },

    getMonthlyHoursReportData: function(year, month) {
        console.log('managerService - getMonthlyHoursReportData');
        return connection.managerRequests.getMonthlyHoursReport(year, month);
    },

    updateMonthlyHoursReport: function(year, month, report){
        console.log('managerService - updateMonthlyHoursReport');
        return connection.managerRequests.updateMonthlyHoursReport(year, month, report);
    },

    exportMonthlyHoursReport: function(year, month){
        console.log('managerService - updateMonthlyHoursReport');
        return connection.managerRequests.exportMonthlyHoursReport(year, month);
    },

    exportSalaryForHumanResourceReport: function(year, month) {
        console.log('managerService - exportSalaryForHumanResourceReport');
        return connection.managerRequests.exportSalaryForHumanResourceReport(year, month)
    },

    managerFinishShift: function(shiftId) {
        console.log('managerService - managerFinishShift');
        return connection.managerRequests.managerFinishShift(shiftId)
    },

    exportOrderEventsReport: function(year, month) {
        console.log('managerService - exportSalaryForHumanResourceReport');
        return connection.managerRequests.exportOrderEventsReport(year, month)
    }
};

module.exports = helpers;