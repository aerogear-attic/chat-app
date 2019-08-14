import { app } from "./app";
import { origin, port } from "./env";
import http from "http";
import { server } from "./server";
import express from 'express'
import path from 'path'

// enabling server to receive and set cookies and use of credentials sent in http get header
server.applyMiddleware({
  app,
  path: "/graphql",
  cors: { credentials: true, origin }
});

// once middleware was applied to the apollo server ( app and graphql ) applying http server for express app
const httpServer = http.createServer(app);

// installing subscription handlers on httpServer
server.installSubscriptionHandlers(httpServer);

app.use(express.static(path.join(__dirname, '/../client/build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
