String.prototype.getHashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
hash |= 0; // Convert to 32bit integer
}
return hash;
};

stringToRGB = function(s) {
    var hash = s.getHashCode();
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return {r: r,
            g: g,
            b: b};
};

stringToCSSRGB = function(s) {
    var t = stringToRGB(s);
    return ['rgb(', t.r, ',', t.g, ',', t.b, ')'].join('');
};

scaleGoodnessColor = function(lo, hi, val) {
    var percentage = val / (hi - lo);
    // #9cc...#c99

    var r = parseInt(percentage * 3 + 9),
        g = parseInt(12 - percentage * 3),
        b = parseInt(12 - percentage * 3);



    // var out = ['#', (r), (g), (b)];
    var out = ['#', (r).toString(16), (g).toString(16), (b).toString(16)];
    // console.log(out);
    return out.join('');
}
