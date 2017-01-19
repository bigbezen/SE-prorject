/**
 * Created by lihiverchik on 17/01/2017.
 */
var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var helpers = require('../utils/Helpers');
var paths = require('../utils/Paths');
var moment = require('moment');

var options = {
    noDataText: constantStrings.NoDataText_string
};

function dateFormatter(cell, row) {
    return moment(cell).format('YYYY-MM-DD HH:MM');
}

var shifts = [
    {
        'storeId': '1',
        'startTime': new Date("2015-03-25 12:00"),
        'endTime': new Date("2015-03-25 13:00"),
        'status': 'not started',
        'type': 'store',
        'salesmanId': '1',
        'constraints': [],
        'salesReport': [],
        'sales': []
    },
    {
        'storeId': '2',
        'startTime': new Date("2015-04-25T12:00:00-06:30"),
        'endTime': new Date("2015-04-25T12:00:00-06:30"),
        'status': 'not started',
        'type': 'store',
        'salesmanId': '2',
        'constraints': [],
        'salesReport': [],
        'sales': []
    }
];

var ShiftsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return{
            shifts: shifts

    }
    },
    componentWillMount() {
        this.updateShifts();
    },
    updateShifts() {
        /*var self = this;
        managementServices.getAllShifts().then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.setState({
                        shifts: result.info
                    });
                    console.log("works!!");
                } else {
                    console.log("error in getAllShifts: " + result.info);
                    alert("Error while retrieving all shifts from the server: "+ result.info);
                }
            } else {
                console.log("error in shiftsContainer: " + n);
            }
        })*/
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('Shift #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: paths.manager_shiftDetails_path,
            query: row
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        this.setState({
            shifts: null
        });
        var self = this;
        managementServices.deleteShift(row).then(function (n) {
            if (n) {
                var result = n;
                if (result.success) {
                    self.updateShifts();
                    console.log("works!!");
                } else {
                    console.log("error in deleteShift: " + result.info);
                    alert("Error while deleting shift from the server: "+ result.info);
                }
            } else {
                console.log("error in deleteShift: " + n);
            }
        })
    },
    onClickAddButton: function(){
        this.context.router.push({
            pathname: paths.manager_shiftDetails_path
        })
    },
    onClickAddShiftsButton: function(){
        this.context.router.push({
            pathname: paths.manager_createShifts_path
        })
    },
    editButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                type="button"
                onClick={() =>
                    this.onClickEditButton(cell, row, rowIndex)}>
                {constantStrings.edit_string}
            </button>
        )
    },
    deleteButton: function(cell, row, enumObject, rowIndex) {
        return (
            <button
                type="button"
                onClick={() =>
                    this.onClickDeleteButton(cell, row, rowIndex)}>
                {constantStrings.delete_string}
            </button>
        )
    },
    renderTable: function () {
        return (
            <div className="col-sm-offset-1 col-sm-10">
                <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={this.onClickAddButton}> + </button>
                <button className="w3-btn w3-theme-d5 w3-margin-top w3-round-xxlarge" onClick={this.onClickAddShiftsButton}> +++ </button>
                <BootstrapTable data={this.state.shifts} options={options} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'storeId'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterStoreName_string} }
                        isKey = {true}>
                        {constantStrings.storeName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'startTime'
                        dataAlign = 'right'
                        dataFormat={ dateFormatter }
                        filter={ { type: 'DateFilter' ,placeholder:constantStrings.selectStartDate_string} }>
                        {constantStrings.startDate_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'endTime'
                        dataAlign = 'right'
                        dataFormat={ dateFormatter }
                        filter={ { type: 'DateFilter' ,placeholder:constantStrings.selectStartDate_string} }>
                        {constantStrings.endDate_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'status'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter={ { type: 'TextFilter', placeholder:constantStrings.enterManagerName_string} }>
                        {constantStrings.status_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'type'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterPhone_string} }>
                        {constantStrings.type_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'salesmanId'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterCity_string} }>
                        {constantStrings.salesman_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataAlign = 'right'
                        dataField = 'button'
                        width = '50'
                        dataFormat = {this.editButton}/>
                    <TableHeaderColumn
                        dataAlign = 'right'
                        dataField = 'button'
                        width = '50'
                        dataFormat = {this.deleteButton}/>
                </BootstrapTable>
            </div>
        )
    },
    renderLoading:function () {
        return(
            <div>
                <h1>loading...</h1>
            </div>
        )
    },
    render: function () {
        if(this.state.shifts != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = ShiftsContainer;