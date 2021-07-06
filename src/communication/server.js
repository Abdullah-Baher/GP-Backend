var express = require('express');
const cors =  require('cors')
var app = express();
app.use(cors())
var ExpressPeerServer = require('peer').ExpressPeerServer;
 
app.get('/', function(req, res, next) { res.send('Hello world!'); });
 
var server = app.listen(9000);
 
var options = {
    debug: true
}
 
app.use('/', ExpressPeerServer(server, options));
 
