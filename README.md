Abstracting different transports (http/websockets) and libraries to a unite them all.

[![browser support](https://ci.testling.com/peerigon/alamid-class.png)

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


