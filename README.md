Abstracting different transports (http/websockets) and libraries to a unite them all.

![browser support](https://ci.testling.com/peerigon/alamid-api.png)
![Build Status](https://travis-ci.org/peerigon/alamid-api.svg?branch=master)
![Dependency Status](https://david-dm.org/peerigon/alamid-api.svg)

## Usage

```javascript
var api = require("alamid-api"),

var router = api.router();

//attach your universal routes
router.get("/hello", function(req, res, next) {
    res.end("You can use me via ws and http!");
});

var app = express(),
    server = http.createServer(app),
    io = socketIO.listen(server);

//with connect/express app
alamidRequest.use(require("alamid-api/plugins/connect"), { app: app });

//with http.Server
alamidRequest.use(require("alamid-api/plugins/http"), { server: server });

//with socket.io
alamidRequest.use(require("alamid-api/plugins/socket.io"), { io: io });
```

## Plugins

### Enhanced Response

```javascript

api.use(require("alamid-api/plugins/enhancedResponse"));

```

__API__

- res.send(statusCode?, response)
- res.success(data)
- res.fail(code)
- res.error(code)

## Browser Integration Tests

Use [testling](https://github.com/substack/testling) to run the integration test in your favourite browser. 

__Examples__ 
- Google Chrome on OSX `./node_modules/.bin/testling -x /usr/bin/open -a "/Applications/Google Chrome.app"`
- Default browser on OSX`./node_modules/.bin/testling -u`



