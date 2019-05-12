// Logic to decide whether we are in development mode or production
// depending on our environment return the appropiate keys

if (process.env.NODE_ENV === 'production'){
    // We are in production - return the prod set of keys
    module.exports = require('./prod');
}
else{
    //We are in development - return the dev set of keys
    module.exports = require('./dev');
}