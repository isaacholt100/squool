import { NextApiRequest, NextApiResponse } from 'next';
import { Server, Socket } from 'socket.io';
require('events').EventEmitter.prototype._maxListeners = 16;
require('events').defaultMaxListeners = 16;

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!(res.socket as any).server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server((res.socket as any).server)

    io.on('connection', (socket: Socket) => {
        console.log("connected: " + socket.id);
        
        const user_id = req.cookies.user_id;
        socket.join("/user/" + req.cookies.user_id);
        socket.on("user message", (msg: string, ...params: any) => {
            console.log(msg, params);
            
            socket.to(user_id).emit(msg, ...params);
        });
      socket.broadcast.emit('a user connected');
      //socket.broadcast.emit("/theme", { type: "light"});
      socket.on('hello', _msg => {
        socket.emit('hello', 'world!');
      })
    });

    (res.socket as any).server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default ioHandler