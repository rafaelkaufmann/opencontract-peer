#OpenContract Peer for Node.js

This project implements an [OpenContract](https://github.com/rafaelkaufmann/opencontract) peer. It uses:

* [Kademlia](https://github.com/gordonwritescode/kad) for the DHT logic.
* UDP as the Kademlia transport, with [node-nat-upnp](https://github.com/indutny/node-nat-upnp) for NAT traversal and hole punching.
* (LevelUP)[https://www.npmjs.com/package/levelup] for storage.

As with the main OpenContract lib, we use ES6/7 extensively through [Babel](https://babeljs.io).

##Usage

###CLI

`node app [options-file]`

This sample app instantiates the peer, connects it to the network and logs all incoming and outgoing messages. The options file should export an object. Check the  example options file (`defaults/options.js`).

###Library

```
var OCPeer = require('opencontract-peer'),
	peer = new OCPeer(options);
```

###Available options

* `registry : String` (default 'local') - hex UUID for the registry, effectively defines the namespace for the database. Connections from peers running other registries will not be rejected, however STORE messages will. TODO
* `party : String` (no default) - party UUID that will be linked to your peer. TODO
* `partyPrivateKey : PrivateKey` (no default) - private key used to sign your party identification request. You must have already published your Party UUID to this registry before linking it to the peer. TODO
* `oracle : OracleQuery -> Promise<OracleResponse>` (no default) - function defining the behavior of your peer as an oracle. TODO
* `logLevel : Integer<0..4>` (default 0)

##TODO

* Oracle service, including OracleStrategy interface and some example implementations.
* Contract versioning (notion that "contract A is an update to contract B").
* Be runnable in the browser as well. Needs to:
  * Change to WebRTC as transport (needs changing underlying Kademlia lib). Possibly overkill, but automatically gives us NAT, etc. A switchboard seems inevitable no matter what.
  * Support LocalStorage through level.js.