// const CryptoJS = require("crypto-js");
const bcrypt=require('bcrypt')
var getDateArray = function(start, end) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        // console.log(dt)
        arr.push((new Date(dt)).toISOString().substring(0, 10));
        dt.setDate(dt.getDate() + 1);
    }
    // console.log(arr)
    return arr;
}

var isValidDate=function (dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; 
    return d.toISOString().slice(0,10) === dateString;
}

// var base64urlEncode= function (source) {
//     encodedSource = CryptoJS.enc.Base64.stringify(source);
//     encodedSource = encodedSource.replace(/=+$/, '');  
//     encodedSource = encodedSource.replace(/\+/g, '-');
//     encodedSource = encodedSource.replace(/\//g, '_');
//     return encodedSource;
//   }

var comparePassword= function (hashPassword,password){
    return bcrypt.compareSync(password, hashPassword);
}

module.exports = {
    getDateArray,
    isValidDate,
    comparePassword
}
