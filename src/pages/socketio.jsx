import { useEffect } from 'react'
import io from 'socket.io-client'
import { useTheme } from '../context/Theme';

export default function SocketIO() {
    const [, setTheme] = useTheme();
  

  return <h1>Socket.io</h1>
}