/**
 * Created by lihiverchik on 31/03/2017.
 */

var React                   = require('react');
var constantStrings         = require('../utils/ConstantStrings');
var salesmanServices        = require('../communication/salesmanServices');
var userServices            = require('../communication/userServices');


var ShiftEncouragementsContainer = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    getInitialState(){
        this.setSessionId();
        return{
            shift: null,
        }
    },
    componentDidMount() {
        this.updateShift();
    },
    setSessionId: function() {
        var sessId = localStorage.getItem('sessionId');
        if (!sessId) {
            sessId = 0;
        }
        localStorage.setItem('sessionId', sessId);
        userServices.setSessionId(sessId);
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
                <h1>Coming Soon...</h1>
            </div>
        )
    }
});

module.exports = ShiftEncouragementsContainer;