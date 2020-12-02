var http = require("http")
var fs = require('fs');
var url = require('url');

var server = http.createServer();

server.on("connection", function(socket) {
	console.log("%s connected", socket.remoteAddress)
	server.on("close", function() {
		console.log("disconnected")
	})
})

var awaitArr = [];

server.on("request", function(req,res) {
	var payload = url.parse(req.url, true).query;
	if (payload.Type == 0) {
		console.log(awaitArr.length);
		for (var i = awaitArr.length-1; i >= 0; i--) {
			awaitArr[i].writeHead(200,{"Content-type" : "text"});
			awaitArr[i].write('["' + payload.Content + '",' + payload.Type + ']');
			awaitArr[i].end();
			awaitArr.splice(i,1);
		}
		res.end();
	} else if (payload.Type == 1) {
		awaitArr.push(res);
		console.log("awaiting..");
	} else {
		fs.readFile("Desktop/Scripts and shite/Chat Client.html", function(err, data) {
			if (err) throw err;
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			return res.end();
		});
	}
})

server.listen(8080,"localhost");
console.log("now listening");
