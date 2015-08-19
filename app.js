require("babel/register")({
    stage: 1
});

var _ = require('lodash');

var optionsFilename = process.argv[2] || './defaults/options.js';

var options = require(optionsFilename);

var OCPeer = require('./lib/peer'),
    p1 = new OCPeer.Peer(_.merge(options, {port: 65533})),
    p2 = new OCPeer.Peer(_.merge(options, {port: 65534}));

var c1 = p1.connect().then(function () {
    console.log('Peer 1 connected');
    var c2 = p2.connect().then(function () {
        console.log('Peer 2 connected');
        p1._dht.put('hey', 'ya', {}, function (err) {
            console.log('Peer 1 put stuff');
            p1._dht.get('hey', function (err, ya) {
                console.log(ya);
            })
        })
    });
}).catch(function (err) {
    console.trace(err);
});