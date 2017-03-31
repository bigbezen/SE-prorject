/**
 * Created by lihiverchik on 31/03/2017.
 */
/**
 * Created by lihiverchik on 19/01/2017.
 */

var React                   = require('react');
var constantStrings         = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');

var EditSaleContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        return{
            shift: null,
        }
    },
    componentDidMount() {
        this.updateShift();
    },
    updateShift(){
        var self = this;
        salesmanServices.getCurrentShift().then(function (n) {
            if (n) {
                var val = n;
                if (val.success) {
                    var currShift = val.info;
                    self.setState(
                        {shift: currShift,
                            products: currShift.salesReport
                        });
                }
                else {
                }
            }
            else {
            }
        })
    },

    render: function () {
        return(
            <div>
                TO DO!!
            </div>
        )
    }
});

module.exports = EditSaleContainer;