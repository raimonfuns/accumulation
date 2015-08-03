var http = require('http'); // 加载http模块，负责创建web服务器和处理http相关任务
http.createServer(function (req, res) { // request、response
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Nodejs\n');
}).listen(1337, '127.0.0.1'); // 链式调用
console.log('Server running at http://127.0.0.1:1337/');