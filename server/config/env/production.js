var  moment = require('moment');


module.exports = {
    port: process.env.PORT || 4000,
    cluster: {
        use: false
    },
    app: {
        title: 'Web Mail',
        serverlogger: {
            use: true,
            logDirectory: process.cwd() + '/logs',
            logFilename: 'server.log',
            interval: '1h'
        },
        fileSize: '10mb',
        globalHash: true
    },
    session: {
        secret: 'i3ctawebmail',
        key:    'i3ctawebmail.sid',
        maxAge: 1500000 // 60 * 1000 * 25
    },
    pop: {
        port: 110,
        host: 'mail.i3cta.com',
        option: {
            tlserrs: false,
            enabletls: false,
            debug: false

        }
    },
    imap: {
        port: 143,
        host: 'mail.i3cta.com',
        tls: false
    },
    winstonLog: {
        debug: {
            name: 'debug',
            options: {
                filename: process.cwd() + '/logs/debug.log',
                maxsize: 1024 * 1024 * 10,
                maxFiles: 30,
                timestamp: function(){return moment().format('YYYYMMDDHHmmss')},
                formatter: function(options) {
                    return options.timestamp()         + ' ' + 
                           options.level.toUpperCase() + ' ' + 
                           (options.message ? options.message : '') +
                           (options.meta && Object.keys(options.meta).length ? '\n\t' + 
                            JSON.stringify(options.meta) : '' );
                },
                json: false
            }
        }
    }
};
