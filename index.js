var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http, {
  allowRequest: (req, next) => next(null, true)  // allow everything! 🎉
});

io.eio.verify = function(req, upgrade, fn) {
  // … and we ignore session validation, plus a few other catastrophic issues 🤯
  fn(null, true);
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("user connected", socket.id);
  io.emit("user connected", socket.id);

  socket.on("chat message", function(msg) {
    console.log("message: ", msg, 'from: ', socket.id);
    io.emit('chat message', msg);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected", socket.id);
    io.emit("user disconnected", socket.id);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
