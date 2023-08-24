const express = require("express");

const app = express()
app.use(app.vhost( '/auth', require("./authServer.js").app))
.use(app.vhost( '/table', require("./tableServer.js").app))
.use(app.vhost( '/', require("./server.js").app))
.use(app.vhost( '/reports', require("./reportsService.js").app))
.listen(4000)
