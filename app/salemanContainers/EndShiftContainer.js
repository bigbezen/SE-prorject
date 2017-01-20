/**
 * Created by lihiverchik on 11/01/2017.
 */

var React = require('react');
var constantsStrings = require('../utils/ConstantStrings');
var salesmanServices = require('../communication/salesmanServices');
var paths = require('../utils/Paths');
var startShiftStyles = require('../styles/startShiftStyles');

var EndShiftContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState()
    {
        return{
            shift:null,
            shiftId:this.props.location.state.newShiftId
        }
    },
    componentDidMount() {
        var self = this;
        salesmanServices.getActiveShift(this.state.shift).then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var currShift = val.info;
                    self.setState({shift: currShift});
                }
                else {
                }
            }
            else {
            }
        })
    },
    handleSubmitReport: function (e) {
        e.preventDefault();
        var self = this;
        salesmanServices.endShift(this.state.shift).then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    alert('edit succeed');
                    self.context.router.push({
                        pathname: '/salesman/Shift',
                        state: {newShift: self.state.shift}
                    })
                }
                else {
                    alert('edit failed');
                }
            }
            else {
                alert('edit failed');
            }
        })
    },
    onUpdateProduct:function(event) {
        var currProductId = event.target.value;
        var isSelected = event.target.checked;
        for (var product of this.state.shift.salesReport) {
            if (currProductId == product.productId) {
                if (isSelected) {
                    product.stockStartShift = 1;
                } else {
                    product.stockStartShift = 0;
                }
            }
        }
    },
    renderEachProduct: function(text, i){
        return (
            <div style={startShiftStyles.product} key={i} height={'100%'}>
                <div style={startShiftStyles.product__detail}>
                    <input type="checkbox" onChange={this.onUpdateProduct} style={startShiftStyles.product__selector} selected={text.stockStartShift} value={text.productId}/>
                </div>
                <div style={startShiftStyles.product__detail}>
                    <h1> {text.name} </h1>
                </div>
                <div style={startShiftStyles.product__detail}>
                    <h1> picture</h1>
                </div>
            </div>
        );
    },
    renderStartShift: function () {

        return (

            <div>
                <div className="w3-theme-d5">
                    <h1>{constantsStrings.storeStatus_string}</h1>
                </div>

                <div className="w3-theme-l5">
                    {this.props.location.state.newShift.salesReport.map(this.renderEachProduct)}
                </div>

                <div className="">
                    <button className="w3-theme-d5"
                            onClick={this.handleSubmitReport} type="submit"> {constantsStrings.startShift_string}
                    </button>
                </div>

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
        if(this.state.shift != null)
        {
            return this.renderStartShift();
        }
        else
        {
            return this.renderLoading();
        }
    }
});

module.exports = EndShiftContainer;