module.exports.isUndefined = function(val) {
    return (val === undefined);
}
const SECRET = "DasIstSicher";
const jwt = require('jsonwebtoken');

module.exports.authUser = function(token) {
    try{
        const decoded = jwt.verify(token.split(" ")[1], SECRET);
        return true;
    }catch(err){
        return false;
    }
}

module.exports.getUser = function(token) {
    try{
        const decoded = jwt.verify(token.split(" ")[1], SECRET);
        return decoded.id;
    }catch(err){
        return null;
    }
}

module.exports.getJWT = function(matnr, name){
    return jwt.sign(
        { id: matnr, username: name},
        SECRET,
        { expiresIn: '1h' }
    );
}

