const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const connectDB = require('./init/db');

// Connect to Database
connectDB();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});