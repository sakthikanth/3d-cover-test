/*
 *  Optimized version of PerspectiveTransform.js
 *  by Edan Kwan
 *  website: http://www.edankwan.com/
 *  twitter: https://twitter.com/#!/edankwan
 *  Lab: www.edankwan.com/lab
 *
 *  The original PerspectiveTransform.js is created by  Israel Pastrana
 *  http://www.is-real.net/experiments/css3/wonder-webkit/js/real/display/PerspectiveTransform.js
 *
 *  Matrix Libraries from a Java port of JAMA: A Java Matrix Package, http://math.nist.gov/javanumerics/jama/
 *  Developed by Dr Peter Coxhead: http://www.cs.bham.ac.uk/~pxc/
 *  Available here: http://www.cs.bham.ac.uk/~pxc/js/
 *
 *  I simply removed some irrelevant variables and functions and merge everything into a smaller function. I also added some error checking functions and bug fixing things.
 */
(function (define) {
    define(function(){

function PerspectiveTransform(element, width, height, useBackFacing){

    this.element = element;
    this.style = element.style;
    this.computedStyle = window.getComputedStyle(element);
    this.width = width;
    this.height = height;
    this.useBackFacing = !!useBackFacing;

    this.topLeft = {x: 0, y: 0};
    this.topRight = {x: width, y: 0};
    this.bottomLeft = {x: 0, y: height};
    this.bottomRight = {x: width, y: height};
}

PerspectiveTransform.useDPRFix = false;
PerspectiveTransform.dpr = 1;

PerspectiveTransform.prototype = (function(){

    var app = {
        stylePrefix: ''
    };

    var _transformStyleName;
    var _transformDomStyleName;
    var _transformOriginDomStyleName;

    var aM = [[0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0]];
    var bM = [0, 0, 0, 0, 0, 0, 0, 0];

    function _setTransformStyleName(){
        var testStyle = document.createElement('div').style;
        app.stylePrefix =
            'webkitTransform' in testStyle ? 'webkit' :
            'MozTransform' in testStyle ? 'Moz' :
            'msTransform' in testStyle ? 'ms' :
            '';
        _transformStyleName = app.stylePrefix + (app.stylePrefix.length>0?'Transform':'transform');
        _transformOriginDomStyleName = '-'+app.stylePrefix.toLowerCase()+'-transform-origin';
    }


    // Check the distances between each points and if there is some points with the distance lequal to or less than 1 pixel, then return true. Otherwise return false;
    function _hasDistancesError(){
        var lenX = this.topLeft.x - this.topRight.x;
        var lenY = this.topLeft.y - this.topRight.y;
        if(Math.sqrt(lenX * lenX +  lenY * lenY)<=1) return true;
        lenX = this.bottomLeft.x - this.bottomRight.x;
        lenY = this.bottomLeft.y - this.bottomRight.y;
        if(Math.sqrt(lenX * lenX +  lenY * lenY)<=1) return true;
        lenX = this.topLeft.x - this.bottomLeft.x;
        lenY = this.topLeft.y - this.bottomLeft.y;
        if(Math.sqrt(lenX * lenX +  lenY * lenY)<=1) return true;
        lenX = this.topRight.x - this.bottomRight.x;
        lenY = this.topRight.y - this.bottomRight.y;
        if( Math.sqrt(lenX * lenX +  lenY * lenY)<=1) return true;
        lenX = this.topLeft.x - this.bottomRight.x;
        lenY = this.topLeft.y - this.bottomRight.y;
        if( Math.sqrt(lenX * lenX +  lenY * lenY)<=1) return true;
        lenX = this.topRight.x - this.bottomLeft.x;
        lenY = this.topRight.y - this.bottomLeft.y;
        if( Math.sqrt(lenX * lenX +  lenY * lenY)<=1) return true;

        return false;
    }

    // Get the determinant of given 3 points
    function _getDeterminant(p0, p1, p2){
        return p0.x * p1.y + p1.x * p2.y + p2.x * p0.y - p0.y * p1.x - p1.y * p2.x - p2.y * p0.x;
    }

    // Return true if it is a concave polygon or if it is backfacing when the useBackFacing property is false. Otehrwise return true;
    function _hasPolyonError(){
        var det1 = _getDeterminant(this.topLeft, this.topRight, this.bottomRight);
        var det2 = _getDeterminant(this.bottomRight, this.bottomLeft, this.topLeft);
        if(this.useBackFacing){
            if(det1*det2<=0) return true;
        }else{
            if(det1<=0||det2<=0) return true;
        }
        var det1 = _getDeterminant(this.topRight, this.bottomRight, this.bottomLeft);
        var det2 = _getDeterminant(this.bottomLeft, this.topLeft, this.topRight);
        if(this.useBackFacing){
            if(det1*det2<=0) return true;
        }else{
            if(det1<=0||det2<=0) return true;
        }
        return false;
    }

    function checkError(){
        if(_hasDistancesError.apply(this)) return 1; // Points are too close to each other.
        if(_hasPolyonError.apply(this)) return 2; // Concave or backfacing if the useBackFacing property is false
        return 0; // no error
    }

    function update() {
        var width = this.width;
        var height = this.height;

        var style = 'transform: matrix3d(0.743722, 0.128503, 0, -0.000156476, 0.00160477, 0.887945, 0, -4.4176e-05, 0, 0, 1, 0, -47.7963, -6.83803, 0, 1);';

        // use toFixed() just in case the Number became something like 3.10000001234e-9
        return this.style[_transformStyleName] = style;

    }

    _setTransformStyleName();

    app.update = update;
    app.checkError = checkError;

    return app;


})();


        return PerspectiveTransform;
    });
}(typeof define === "function" && define.amd ? define : function (app) {
    window["PerspectiveTransform"] = app();
}));
