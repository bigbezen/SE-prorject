/**
 * Created by lihiverchik on 17/12/2016.
 */

var React               = require('react');
var NotificationSystem  = require('react-notification-system');
var constantsStrings    = require('../utils/ConstantStrings');
var styles              = require('../styles/managerStyles/styles');
var paths               = require('../utils/Paths');
var managementServices  = require('../communication/managementServices');
var userServices        = require('../communication/userServices');
var DeleteIcon          = require('react-icons/lib/fa/close');
var moment              = require('moment');

var IncentiveDetails = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function () {
        this.setSessionId();
        this.setUserType();
        this.setShiftsStartDate();
        this.setShiftsEndDate();
        return {
            productsForIncentive: [1],
            products: [],
            editedIncentive: undefined,
            subCategories: [],
            productsOfSubCategory: []
        }
    },
    setShiftsStartDate: function() {
        var shiftStartDate = localStorage.getItem('shiftStartDate');
        if (!shiftStartDate) {
            shiftStartDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftStartDate', shiftStartDate);
    },
    setUserType: function() {
        var userType = localStorage.getItem('userType');
        if (!userType) {
            userType = 0;
        }
        localStorage.setItem('userType', userType);
        userServices.setUserType(userType);
    },
    setShiftsEndDate: function() {
        var shiftEndDate = localStorage.getItem('shiftEndDate');
        if (!shiftEndDate) {
            shiftEndDate = moment().format('YYYY-MM-DD');
        }
        localStorage.setItem('shiftEndDate', shiftEndDate);
    },

    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
    },

    componentDidMount() {
        this.updateProducts();
        var query = this.props.location.query;
        var incentive = Object.keys(query).map(function(key){
            return query[key];
        });
        if(incentive.length > 0){
            incentive = JSON.parse(incentive.join(''));
            this.state.editedIncentive = incentive;
            this.fillIncentiveFields(incentive);
        }
    },

    fillIncentiveFields: function(incentive){
        this.refs.nameBox.value = incentive.name;
        this.setState({
            productsForIncentive: incentive.products
        });
        this.refs.numOfProductsBox.value = incentive.numOfProducts;
        this.refs.rateBox.value = incentive.rate;
    },

    updateProducts: function() {
        var self = this;
        var notificationSystem = this.refs.notificationSystem;

        managementServices.getAllProducts().then(function (result) {
            let subCategories = new Set(result.map((product) => product.subCategory));
            self.setState({
                products: result,
                subCategories: Array.from(subCategories)
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
    },

    getOptions: function(arrayOfObjects, index) {
        var selectedProductName = "";
        if(this.state.editedIncentive != undefined){
            // this means that the page is on edit mode and there are already selected products to display
            selectedProductName = this.state.editedIncentive.products[index].name;
        }
        else if(this.state.productsOfSubCategory.length > 0){
            selectedProductName = this.state.productsOfSubCategory[index].name;
        }
        var optionsForDropDown = [];
        if(selectedProductName == "")
            optionsForDropDown.push(<option selected>{constantsStrings.dropDownChooseString}</option>);
        else
            optionsForDropDown.push(<option>{constantsStrings.dropDownChooseString}</option>);

        for (var i = 0; i < arrayOfObjects.length; i++) {
            var currOption = arrayOfObjects[i];
            if(currOption.name == selectedProductName)
                optionsForDropDown.push(<option key={i + (index*10)} selected value={currOption.name + " - " + currOption.subCategory}>
                    {currOption.name + " - " + currOption.subCategory}
                </option>);
            else
                optionsForDropDown.push(<option key={i + (index*10)} value={currOption.name + " - " + currOption.subCategory}>
                    {currOption.name+ " - " + currOption.subCategory}
                </option>);
        }
        return optionsForDropDown;
    },

    getCategoriesOptions: function(){
        var optionsForDropDown = [];
        optionsForDropDown.push(<option disabled selected>{constantsStrings.dropDownChooseString}</option>);

        for (let currOption of this.state.subCategories) {
            optionsForDropDown.push(<option key={currOption} value={currOption}>
                {currOption}
            </option>);
        }
        return optionsForDropDown;
    },

    addProduct: function(){
        var newProducts = this.state.productsForIncentive;
        newProducts.push(1);
        this.setState({
            productsForIncentive: newProducts,
            productsOfSubCategory: newProducts
        });
        this.refs.subCategory.value = constantsStrings.dropDownChooseString;
    },

    deleteProduct: function(i){
        var newProducts = this.state.productsForIncentive;
        if(i == undefined)
            newProducts = newProducts.slice(0, -1);
        else
            newProducts.splice(i, 1);

        this.setState({
            productsForIncentive: newProducts,
            productsOfSubCategory: newProducts
        });
        this.refs.subCategory.value = constantsStrings.dropDownChooseString;
    },

    onChangeSubCategory: function() {
        let subCategory = this.refs.subCategory.value;
        let productsOfSubCategory = this.state.products.filter((product) => product.subCategory == subCategory);
        this.setState({
            productsOfSubCategory: productsOfSubCategory,
            productsForIncentive: productsOfSubCategory
        });
    },

    onChangeProduct: function(){
        this.refs.subCategory.value = constantsStrings.dropDownChooseString;
    },

    renderProductChoice: function(product, i){
        return (
            <div className="row" style={styles.productSelect}>
                <span className="col-sm-1 col-sm-offset-1"><a onClick={() => this.deleteProduct(i)}><DeleteIcon/></a></span>
                <select key={i} className="col-xs-6" onChange={this.onChangeProduct}
                    ref={"product" + i} data="" >
                    {this.getOptions(this.state.products, i)}
                </select>
            </div>
        )
    },

    renderEditOrAddString: function(){
        if(this.state.editedIncentive == undefined)
            return constantsStrings.add_string;
        else
            return constantsStrings.save_string;
    },

    handleSubmitIncentive: function () {
        var incentiveName = this.refs.nameBox.value;
        var notificationSystem = this.refs.notificationSystem;
        var numOfProducts = this.state.productsForIncentive.length;
        var context = this.context;
        var selectedProducts = [];
        var productsAsObjects = this.state.products;
        var productsAsDict = {};

        for(var productIndex in productsAsObjects)
            productsAsDict[productsAsObjects[productIndex].name] = productsAsObjects[productIndex]._id;
        for(var i=0; i<numOfProducts; i++) {
            var chosenProduct = this.refs["product" + i].value.split(" - ")[0];
            if(chosenProduct != constantsStrings.dropDownChooseString)
                selectedProducts.push(productsAsDict[chosenProduct]);
        }
        if(selectedProducts.length == 0){
            notificationSystem.clearNotifications();
            notificationSystem.addNotification({
                message: constantsStrings.incentiveMissingProducts_string,
                level: 'error',
                autoDismiss: 2,
                position: 'tc',
            });
            return;
        }

        var numOfChosenProducts = parseInt(this.refs.numOfProductsBox.value);
        var rate = parseInt(this.refs.rateBox.value);

        if(this.state.editedIncentive == undefined){
            var newIncentive = {
                name: incentiveName,
                products: selectedProducts,
                numOfProducts: numOfChosenProducts,
                rate: rate,
                active: true
            };

            managementServices.addIncentive(newIncentive)
                .then(function(result) {
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: constantsStrings.addSuccessMessage_string,
                        level: 'success',
                        autoDismiss: 1,
                        position: 'tc',
                        onRemove: function (notification) {
                            context.router.push({
                                pathname: paths.manager_incentives_path
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
        else {
            var editedIncentive = this.state.editedIncentive;
            editedIncentive.name = incentiveName;
            editedIncentive.products = selectedProducts;
            editedIncentive.numOfProducts = numOfChosenProducts;
            editedIncentive.rate = rate;

            managementServices.editIncentive(editedIncentive)
                .then(function(result){
                    notificationSystem.clearNotifications();
                    notificationSystem.addNotification({
                        message: constantsStrings.editSuccessMessage_string,
                        level: 'success',
                        autoDismiss: 1,
                        position: 'tc',
                        onRemove: function (notification) {
                            context.router.push({
                                pathname: paths.manager_incentives_path
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

    addNewIncentive: function() {
        return (
            <div className="jumbotron col-xs-offset-3 col-xs-6 w3-card-4" style={styles.editBodyStyle}>
                <form className="form-horizontal text-right w3-text-black" onSubmit={function(e){
                    e.preventDefault();
                }}>
                    <div className="form-group">
                        <h1 className="col-xs-offset-1 col-xs-9 w3-xxlarge">
                            <b>{(this.state.editedIncentive == undefined) ? constantsStrings.addIncentive_string : constantsStrings.editIncentive_string}</b>
                        </h1>
                    </div>

                    <div className="form-group">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentiveName_string}:</label>
                    </div>
                    <div className="form-group">
                        <input type="text"
                               className="col-xs-6 col-xs-offset-2"
                               ref="nameBox"
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentivePickProducts_string}:</label>
                    </div>
                    <div className="form-group " ref="productsBox">
                        {this.state.productsForIncentive.map(this.renderProductChoice)}
                    </div>

                    <div className="form-group">
                        <label className="col-xs-4 col-xs-offset-2">Sub Category:</label>
                    </div>
                    <div className="form-group" ref="subCategoryBox">
                        <div className="row" style={styles.productSelect}>
                            <select className="col-xs-6 col-xs-offset-2" onChange={this.onChangeSubCategory}
                                    ref="subCategory" data="" >
                                {this.getCategoriesOptions()}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <button className="w3-card-4 w3-circle w3-button col-xs-offset-2" style={styles.addBottleButtonStyle} onClick={this.addProduct}>+</button>
                        </div>
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentiveNumOfProducts_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0}
                               className="col-xs-6 col-xs-offset-2"
                               ref="numOfProductsBox"
                               required
                        />
                    </div>

                    <div className="form-group ">
                        <label className="col-xs-4 col-xs-offset-2">{constantsStrings.incentiveRate_string}:</label>
                    </div>
                    <div className="form-group ">
                        <input type="number" min={0}
                               className="col-xs-6 col-xs-offset-2"
                               ref="rateBox"
                               required
                        />
                    </div>

                    <div className="form-group">
                        <button
                            className="w3-button w3-card-4 btn col-xs-6 col-xs-offset-2"
                            type="submit"
                            style={styles.saveButtonStyle}
                        onClick={this.handleSubmitIncentive}>
                            {this.renderEditOrAddString()}
                        </button>
                    </div>
                </form>
                <NotificationSystem style={styles.notificationStyle} ref="notificationSystem"/>
            </div>
        )
    },

    render: function () {
        return this.addNewIncentive();
    }
});

module.exports = IncentiveDetails;