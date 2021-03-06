var React = require('react');
var ReactBsTable = require("react-bootstrap-table");
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var constantStrings = require('../utils/ConstantStrings');
var managementServices = require('../communication/managementServices');
var helpers = require('../utils/Helpers');

var StoresContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return{
            stores: null
        }
    },
    componentWillMount() {
        this.updateStores();
    },
    updateStores() {
        this.setState({
            stores: managementServices.getAllStores()
        });
    },
    onClickEditButton: function(cell, row, rowIndex){
        console.log('Store #', rowIndex);
        console.log(row);
        this.context.router.push({
            pathname: '/LoggedIn/Store',
            query: row
        })
    },
    onClickDeleteButton: function(cell, row, rowIndex){
        console.log('Store #', rowIndex);
        console.log(row);
    },
    onClickAddButton: function(){
        this.context.router.push({
            pathname: '/LoggedIn/Store'
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
                <button className="w3-btn-floating" onClick={this.onClickAddButton}> + </button>
                <BootstrapTable data={this.state.stores} bordered={false} hover striped search searchPlaceholder={constantStrings.search_string}>
                    <TableHeaderColumn
                        dataField = 'name'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter = { {type: 'TextFilter', placeholder:constantStrings.enterStoreName_string} }
                        isKey = {true}>
                        {constantStrings.storeName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'managerName'
                        dataAlign = 'right'
                        dataSort = {true}
                        filter={ { type: 'TextFilter', placeholder:constantStrings.enterManagerName_string} }>
                        {constantStrings.managerName_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'phone'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterPhone_string} }>
                        {constantStrings.phone_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'city'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterCity_string} }>
                        {constantStrings.city_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'address'
                        dataAlign = 'right'
                        filter = { { type: 'TextFilter', placeholder:constantStrings.enterAddress_string} }>
                        {constantStrings.address_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'area'
                        dataAlign = 'right'
                        filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.store_area }
                        filter={ { type: 'SelectFilter', placeholder:constantStrings.selectArea_string, options: constantStrings.store_area } }>
                        {constantStrings.area_string}
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField = 'channel'
                        dataAlign = 'right'
                        filterFormatted dataFormat={ helpers.enumFormatter } formatExtraData={ constantStrings.store_channel }
                        filter={ { type: 'SelectFilter', placeholder:constantStrings.selectChannel_string, options: constantStrings.store_channel } }>
                    {constantStrings.channel_string}
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
        if(this.state.stores != null)
        {
            return this.renderTable();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = StoresContainer;