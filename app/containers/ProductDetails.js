/**
 * Created by lihiverchik on 17/12/2016.
 */

var React = require('react');
var managerServices = require('../communication/managementServices');
var constantsStrings = require('../utils/ConstantStrings');
var productInfo = require('../models/product');

var ProductDetails = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            editing: false,
        }
    },

    componentDidMount() {
        console.log('check props');
        var isEmptyVar = !(this.isEmpty(this.props.location.query));
        console.log(!(this.isEmpty(this.props.location.query)));
       // this.setState({
        this.state.editing = isEmptyVar;
            //editing: {isEmptyVar}
    //    });
        console.log(this.state.editing);
        if (this.state.editing) {
            this.setFields();
        }
    },

    isEmpty: function(obj) {
            for(var i in obj) { return false; }
            return true;
    },

    handleSubmitUser: function (e) {
        e.preventDefault();
        console.log('we are here');
        var newProduct = new productInfo();
        newProduct.name = this.refs.nameBox.value;
        newProduct.retailPrice = this.refs.retailBox.value;
        newProduct.salePrice = this.refs.saleBox.value;
        newProduct.category = this.refs.categoryBox.value;
        newProduct.subCategory = this.refs.subCategoryBox.value;
        newProduct.minRequiredAmount = this.refs.minAmountBox.value;
        newProduct.notifyManager = this.refs.notifyBox.checked;
        var context = this.context;
        if (this.state.editing) {
            newProduct._id = this.props.location.query._id;
            managerServices.editProduct(newProduct).then(function (n) {
                if(n){
                    alert('edit succeed');
                    context.router.push({
                        pathname: '/LoggedIn/Home'
                    })
                }
                else{
                    alert('edit failed');
                    console.log("error");
                }
            })
        }else {
            managerServices.addProduct(newProduct).then(function (n) {
                if(n){
                    alert('add succeed');
                    context.router.push({
                        pathname: '/LoggedIn/Home'
                    })
                }
                else{
                    alert('add failed');
                    console.log("error");
                }
            })
        }
    },
    addNewProduct: function() {
        return (
            <div className="jumbotron col-sm-offset-3 col-sm-6 text-center">
                <h1>מוצר</h1>
                <form onSubmit={this.handleSubmitUser} className="form-horizontal">
                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.productName_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="nameBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.retailPrice_string}</label>
                        <input type="number" min={0}
                               className="col-sm-4"
                               ref="retailBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.salePrice_string}</label>
                        <input type="number" min={0}
                               className="col-sm-4"
                               ref="saleBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.category_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="categoryBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.subCategory_string}</label>
                        <input type="text"
                               className="col-sm-4"
                               ref="subCategoryBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.minRequiredAmount_string}</label>
                        <input type="number" min={0}
                               className="col-sm-4"
                               ref="minAmountBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="control-label col-sm-3 col-sm-offset-2">{constantsStrings.notifyManager_string}</label>
                        <input type="checkbox"
                               className="col-sm-4"
                               ref="notifyBox"
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-btn w3-theme-d5 col-sm-4 col-sm-offset-5"
                            type="submit">
                            {constantsStrings.edit_string}
                        </button>
                    </div>
                </form>
            </div>
        )
    },

    setFields: function () {
        this.currProduct = this.props.location.query;
        this.refs.nameBox.value = this.currProduct.name;
        this.refs.retailBox.value = this.currProduct.retailPrice;
        this.refs.saleBox.value = this.currProduct.salePrice;
        this.refs.categoryBox.value = this.currProduct.category;
        this.refs.subCategoryBox.value = this.currProduct.subCategory;
        this.refs.minAmountBox.value = this.currProduct.minRequiredAmount;
        this.refs.notifyBox.checked = this.currProduct.notifyManager;
    },
    render: function () {
        return this.addNewProduct();
    }
});

module.exports = ProductDetails;