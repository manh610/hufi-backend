import { app } from './app';
import  http from 'http';

const PORT = process.env.PORT;
const server = http.createServer(app);
server.listen(PORT);
server.on('listening', async () => {
    console.log(`Server is running on port ${PORT} `);
});