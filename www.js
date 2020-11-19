var processmode   = process.env.NODE_ENV || 'development';
    config        = require('./server/config/config'),
    env           = require('./server/config/env/' + processmode),
    http          = require('http'),
    express       = require('express'),
    fs            = require('fs'),
    path          = require('path'),
    morgan        = require('morgan'),
    bodyParser    = require('body-parser'),
    cookie        = require('cookie'),
    cookieParser  = require('cookie-parser'),
    chalk         = require('chalk'),
    session       = require('express-session'),
    proxy         = require('express-http-proxy')
    sqlite3       = require('sqlite3').verbose(),
    db            = new sqlite3.Database('./dachshund.db'),
    JsonResponse = require('./server/config/jsonresponse'),
    redisStore    = null;
  


require('events').EventEmitter.defaultMaxListeners = Infinity;


var app           = express();


app.use(morgan('dev'));

app.use(bodyParser.json({limit: env.app.fileSize}));
app.use(bodyParser.urlencoded({
    limit: env.app.fileSize,
    extended: true
}));



var sessionStore  = null;
sessionStore = session({ 
    saveUninitialized : true,
    resave            : false,
    secret            : env.session.secret,
    key               : env.session.key,   
    cookie            : { maxAge  : new Date(Date.now() + env.session.maxAge) },
});
app.use(sessionStore);





app.all('/api/*', function(req, res, next) {
    let user = req.session.user

    if (req.session.user) {
        next()
    }
    else {
        req.session.destroy(function(){
            try { 
                req.session = null
                res.clearCookie(env.session.key)
             
                JsonResponse.sendJsonResponse(res, 401)
            }
            catch (e) {
                JsonResponse.sendJsonResponse(res, 401)
            }
            
            return
        })
    }
})


app.use(express.static(path.join(__dirname, 'client')));



require('./server/controllers/UserController')(app, db)
require('./server/controllers/BoardController')(app, db)
require('./server/controllers/ContentController')(app, db)
require('./server/controllers/ContentRotationController')(app, db)
require('./server/controllers/WindowController')(app, db)
require('./server/controllers/BeforeWindowController')(app, db)





app.use(function(req, res, next) {
    res.status(404);

    res.json({
        "status": 404,
        "message": "Not Found (Invalid URL)"
    });

    return;
});
app.disable('etag');




app.use(function(req, res, next) {
    res.header('Cache-Control', 
               'private, no-cache, no-store, must-revalidate')
    res.header('Pragma', 'no-cache')

    next();
})



var httpServer = http.Server(app);
httpServer.listen(env.port, '0.0.0.0', function() {
    console.log('server listening on port', env.port);
});



exports = module.exports = app;
