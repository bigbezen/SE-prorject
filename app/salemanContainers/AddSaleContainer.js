/**
 * Created by lihiverchik on 19/01/2017.
 */

var React                   = require('react');
var ReactBsTable            = require("react-bootstrap-table");
var BootstrapTable          = ReactBsTable.BootstrapTable;
var TableHeaderColumn       = ReactBsTable.TableHeaderColumn;

var constantStrings         = require('../utils/ConstantStrings');
var paths                   = require('../utils/Paths');
var styles                  = require('../styles/salesmanStyles/addSaleStyles');

var salesmanServices        = require('../communication/salesmanServices');

var PlusIcon                = require('react-icons/lib/fa/plus');


var AddSaleContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return{
            shift: this.props.location.state.newShift,
            products: this.props.location.state.newShift.salesReport,
            soldProducts: []
        }
    },
    onRowClick(row){
        var sold = this.state.soldProducts;
        var p2 = row;
        p2.sold =1;
        sold.push(p2);
        var prods = this.state.products;
        var newProds =[];
        prods.forEach(function(prod) {
            if (!(prod.productId == row.productId)) {
                newProds.push(prod);
            }
        });
        this.setState({soldProducts:sold, saleStarted:true, products:newProds})
    },
    onRowClickRevert(row){
        var prods = this.state.products;
        var p2 = row;
        prods.push(p2);
        var soldProds = this.state.soldProducts;
        var newSoldProds =[];
        soldProds.forEach(function(prod) {
            if (!(prod.productId == row.productId)) {
                newSoldProds.push(prod);
            }
        });
        this.setState({soldProducts:newSoldProds, saleStarted:true, products:prods})
    },
    increaseNum(cell, row, enumObject, rowIndex){
        var newSoldProds =[];
        this.state.soldProducts.forEach(function(prod) {
            if (prod.productId == row.productId) {
                var p2 = prod;
                p2.sold = p2.sold + 1;
                newSoldProds.push(p2);
            } else {
                newSoldProds.push(prod);
            }
        });
        this.setState({soldProducts:newSoldProds})
   },
    decreaseNum(cell, row, enumObject, rowIndex){
        var isZero = false;
        var newSoldProds =[];
        this.state.soldProducts.forEach(function(prod) {
            if (prod.productId == row.productId) {
                var p2 = prod;
                p2.sold = p2.sold - 1;
                if(p2.sold==0){
                    isZero = true;
                }
                newSoldProds.push(p2);
            } else {
                newSoldProds.push(prod);
            }
        });
        if (isZero) {
            this.onRowClickRevert(row);
        } else {
            this.setState({soldProducts:newSoldProds})
        }
    },
    setAmountButton: function(cell, row, enumObject, rowIndex) {
        return (
            <div>
                <table>
                    <tr>
                        <td>
                            <span className="input-group-btn ">
                                <button type="button" className="w3-xxlarge btn btn-default btn-number" disabled={row.sold == 0}  onClick={() =>
                                    this.decreaseNum(cell, row, enumObject, rowIndex)}> - </button>
                            </span>
                        </td>
                        <td>
                            <input type="text" className="form-control w3-xxlarge input-number" value={row.sold} min="0" ref={rowIndex}/>
                        </td>
                        <td>
                            <span className="input-group-btn">
                                <button type="button" className="btn w3-xxlarge btn-default btn-number" onClick={() =>
                                    this.increaseNum(cell, row, enumObject, rowIndex)}> + </button>
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
        )
    },
    handleAddSale(){
        var shiftId = this.state.shift._id;
        this.state.soldProducts.forEach(function(prod){
            salesmanServices.reportSale(shiftId, prod.productId,prod.sold); //TODO: add wait
            }
        );
        this.setState({products: this.state.shift.salesReport, soldProducts: []})
    },
    handleOpenBottle(){
    },
    handleFinishShift: function(){
        this.context.router.push({
            pathname: paths.salesman_endShift_path,
            state:{newShift:this.state.shift}
        });
    },
    tablePlusIcon: function(cell, row, enumObject, rowIndex){
        return (
            <div className="w3-jumbo">
                <PlusIcon/>
            </div>
        )
    },
    generateSearchField: function(onKeyUp){
        return (
            <input type="text" className="w3-xxxlarge"/>
        )
    },
    renderStartedSale(){
        var selectRowProp = {
            onRowClick: this.onRowClick
        };
        return(
            <div className='main-container'>

                <div style={styles.reportTopContainer}>
                    <div style={styles.reportButtonsContainer}>
                        <button onClick={this.handleAddSale} className="w3-round-large w3-theme-d5 w3-jumbo" > {constantStrings.reportSale_string}</button>
                    </div>
                    <div style={styles.reportButtonsContainer}>
                        <button onClick={this.handleOpenBottle} className="w3-round-large w3-theme-d5 w3-jumbo">{constantStrings.reportOpen_string}</button>
                    </div>
                </div>
                <div className="w3-card-8 col-sm-offset-1 col-sm-10" style={styles.products_table_container}>
                    <div className="w3-margin-top">
                        <BootstrapTable data={this.state.soldProducts} hover bordered={false}>
                            <TableHeaderColumn
                                dataField = 'name'
                                dataAlign = 'right'
                                tdStyle = {styles.products_table_body}
                                isKey = {true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign = 'right'
                                dataField = 'button'
                                width = '180'
                                dataFormat = {this.setAmountButton}/>
                        </BootstrapTable>
                    </div>
                </div>

                <div style={styles.space}></div>

                <div className="w3-card-8 col-sm-offset-1 col-sm-10" style={styles.products_table_container}>
                    <div className="w3-margin-top">
                        <BootstrapTable data={this.state.products} options={selectRowProp}
                                        bordered={false} hover search
                                        searchPlaceholder={constantStrings.search_string}>
                            <TableHeaderColumn
                                dataField = 'name'
                                dataAlign = 'right'
                                tdStyle = {styles.products_table_body}
                                dataSort
                                isKey = {true}>
                                <h1><b>{constantStrings.select_product_for_sale}</b></h1>
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField = 'button'
                                dataAlign = 'left'
                                dataFormat = {this.tablePlusIcon}>
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
                <button onClick={this.handleFinishShift}> {constantStrings.endShift_string} </button>
            </div>
            )

    },
    renderNotStartedSale(){
        var selectRowProp = {
            onRowClick: this.onRowClick
        };
        return(
            <div>

                <div className="w3-card-8 col-sm-offset-1 col-sm-10" style={styles.products_table_container}>
                    <div className="w3-margin-top">
                        <BootstrapTable data={this.state.products} options={selectRowProp}
                                        bordered={false} hover search
                                        searchPlaceholder={constantStrings.search_string}>
                            <TableHeaderColumn
                                dataField = 'name'
                                dataAlign = 'right'
                                tdStyle = {styles.products_table_body}
                                dataSort
                                isKey = {true}>
                                <h1><b>{constantStrings.select_product_for_sale}</b></h1>
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                dataField = 'button'
                                dataAlign = 'left'
                                dataFormat = {this.tablePlusIcon}>
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
                <button onClick={this.handleFinishShift}> {constantStrings.endShift_string} </button>
            </div>
            )

    },
    render: function () {
            if(this.state.soldProducts.length!=0){
                return this.renderStartedSale();
            }
            else
                {
                return this.renderNotStartedSale();
            }
    }
});

module.exports = AddSaleContainer;