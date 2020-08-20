const http = require('http');

const app = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Hello World');
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server is running on port ${PORT}`);
