import React, { useEffect, useCallback, useState} from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../context/SocketProvider'

const RoomPage = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [myStream, setMyStream] = useState()
  const socket = useSocket()
  const handleUserJoined = useCallback(({email, id })=>{
    console.log(`Email ${email} joined room`)
    setRemoteSocketId(id)
  })

  useEffect(()=>{
    socket.on("user:joined", handleUserJoined)

    return ()=>{
        socket.off('user:joined', handleUserJoined)
    }
  },[socket, handleUserJoined])

  const handleCallUser = useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true})
    setMyStream(stream)
  },[])

  const handleEndCall = () => {
    // Add logic to end the call
    // You can emit an event to the server to notify about the end of the call
    socket.emit('endCall');
  
    // Clean up any resources, stop the stream, etc.
    if (myStream instanceof MediaStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
  
    setMyStream(null);
  };
  return (
    <div>
        <h1>Room</h1>
        <h4>{remoteSocketId ? 'Connected': "No one is in the room"}</h4>
        {remoteSocketId && 
        <>
            <button onClick={handleCallUser}>Call</button>
            <button onClick={handleEndCall}>End Call</button>
        </>
        }
        {myStream && 
            <>
                <h1>My video</h1>
                <ReactPlayer playing muted height="100px" width="200px" url={myStream}/>
            </>}
    </div>
  )
}

export default RoomPage