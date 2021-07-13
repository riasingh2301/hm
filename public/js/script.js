//1:46:05 == Styling
const socket=io('/')

const videocontainer = document.getElementById('video-grid');
const myvideo=document.createElement('video');
//const myvideocontainer = document.getElementById('my-video');
myvideo.muted=true;

var peer = new Peer(undefined,{
  path:'/peerjs',
  host:'/',
  port:'3030'
}); 

let myVideoStream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myvideo, stream);

  peer.on('call',call=>{
    call.answer(stream);
    const video=document.createElement('video');
    call.on('stream', userVideoStream=>{
      addVideoStream(video,userVideoStream)
    })
  })

  socket.on('user-connected' , (userId)=>{
    // connectToNewUser(userId , stream);
     setTimeout(connectingNewUser,1000,userId,stream)
    })
  
})
//ID gets automatically generated
peer.on('open',id=>{
  socket.emit('join-room',ROOM_ID,id);
})
//I will call user and prvide my vedio stream and add the video stream in his page
const connectingNewUser = (userId,stream) =>{
  const call = peer.call(userId,stream)
  const video=document.createElement('video');
  call.on('stream', userVideoStream =>{
    addVideoStream(video, userVideoStream);
  }); 
}

//socket.emit('join-room');

const addVideoStream =(video, stream)=>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    })
    videocontainer.append(video);
  }




// input value
let text = $("#chat_message");
//console.log(text);
// when press enter send message
$('html').keydown((e)=>{
  if (e.which == 13 && text.val().length !== 0) {
    console.log(text.val());
    let newmsg={
      name:User,
      msg: text.val()
    }
    socket.emit('message',newmsg);
    text.val('');
  }
});

socket.on('createMessage',(message)=>{
  //console.log('coming frm server ${message}');
  $('ul').append(`<li class="message"><b><i class="fa fa-fw fa-user-circle"></i>${message.name}</b><br>${message.msg}</li>`);
});

let User='';
// input value
let user = $("#user");
//console.log(text);
// when press enter send message
$('html').keydown((e)=>{
  if (e.which == 13 && user.val().length !== 0) {
    console.log(user.val());
    User=user.val()
    //socket.emit('username', user.val());
    user.val('')
    
  }
});


// MUTE AND VIDEO

const muteUnmute = () => {
  let enabled = myVideoStream.getAudioTracks()[0].enabled;
  console.log(enabled);
  if (enabled) {
    //socket.emit("unmute-mic");
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    //socket.emit("mute-mic");
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    //socket.emit("stop-video");
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    //socket.emit("start-video");
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}


const setMuteButton = () => {
  const html = `
    <i class="fa fa-fw fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('#main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="fa fa-fw fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('#main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fa fa-fw fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('#main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="fa fa-fw fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('#main__video_button').innerHTML = html;
}


$(document).ready(function(){
  $("#endcall").click(function(){
    myVideoStream.getVideoTracks()[0].stop();
    $("video").remove();
    document.querySelector('#endcall').innerHTML = html;
  });
});

