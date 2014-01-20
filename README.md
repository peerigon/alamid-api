Abstracting different transports (http/websockets) and libraries to a unite them all.

## Usage

```javascript
var alamidRequest = require("alamid-request"),

var router = alamidRequest.router();

//attach your universal routes
router.get("/hello", function(req, res, next) {
    res.end("You can use me via ws and http!");
});

var app = express(),
    server = http.createServer(app),
    io = socketIO.listen(server);

//with connect/express app
alamidRequest.use(require("alamid-request/plugins/connect"), { app: app });

//with http.Server
alamidRequest.use(require("alamid-request/plugins/http"), { server: server });

//with socket.io
alamidRequest.use(require("alamid-request/plugins/socket.io"), { io: io });
```
