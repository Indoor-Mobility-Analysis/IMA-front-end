function Color(_r, _g, _b) {
    this.r = undefined;
    this.g = undefined;
    this.b = undefined;
    let _this = this
    var setColors = function(_r, _g, _b) {
        _this.r = _r;
        _this.g = _g;
        _this.b = _b;
    };

    setColors(_r, _g, _b);
}

Color.prototype.getColors = function() {
    return {
        r: this.r,
        g: this.g,
        b: this.b
    }
}

export default Color

