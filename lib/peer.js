let KNode = require('kad'),
    ReadableStream = require('stream').Readable,
    _ = require('lodash');

class Storage {
    constructor ({registry}) {
        this.registry = registry;
        this.docs = {};
    }

    async getKey (key) {
        let value = this.docs[key];
        if (value === undefined)
            throw new Error('Key not found');
        return value;
    }

    async putKey (key, value) {
        this.docs[key] = value;
        return true;
    }

    async delKey (key) {
        this.docs[key] = undefined;
        return true;
    }

    async getStream () {
        var s = new ReadableStream();
        s._read = function noop() {}; // redundant? see update below
        _(this.docs).each((value, key) => s.push({key, value}));
        s.push(null);
        return s;
    }
}

function makeStorage({registry}) {
    let storage = new Storage({registry});

    return {
        get: makeCBFunction(storage.getKey.bind(storage)),
        put: makeCBFunction(storage.putKey.bind(storage)),
        del: makeCBFunction(storage.delKey.bind(storage)),
        createReadStream: storage.getStream.bind(storage)
    };

    /*
    function makeCBFunction1 (asyncFn) {
        return function (p1, callback) {
            (async () => {
                try {
                    let value = await asyncFn(p1);
                    callback(null, value);
                } catch (e) {
                    callback(e, null);
                }
            })();
        }
    }

    function makeCBFunction2 (asyncFn) {
        return function (p1, p2, callback) {
            (async () => {
                try {
                    let value = await asyncFn(p1, p2);
                    callback(null, value);
                } catch (e) {
                    callback(e, null);
                }
            })();
        }
    }
    */

    function makeCBFunction (asyncFn) {
        return function (...params) {
            let callback = params.pop();
            (async () => {
                try {
                    let value = await asyncFn(...params);
                    callback(null, value);
                } catch (e) {
                    callback(e, null);
                }
            })();
        }
    }
}

export class Peer {
    constructor ({registry, logLevel, address, port}) {
        this.kOptions = {
            address: address,
            port: port,
            seeds: [{ address, port: port + 1 }],
            storage: makeStorage({registry}),
            logLevel: logLevel
        };
    }

    async connect () {
        return new Promise((resolve, reject) => {
            this._dht = KNode(this.kOptions);
            this._dht.on('connect', resolve);
            this._dht.on('error', reject);
        });
    }
}