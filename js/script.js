let currentSong = new Audio();
let songs;
let currfolder;


function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("-", " ")}</div>
                                <div>Suraj</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`;
  }
  
  //Attach an event listener to each songs
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element => {
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
  })


}


const playMusic = (track) => {
   currentSong.src = `/${currfolder}/` + track;
   currentSong.play()
   play.src = "img/pause.svg"
   document.querySelector(".songinfo").innerHTML = track
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

// async function displayAlbums() {

//   let a = await fetch(`http://127.0.0.1:5500/songs/`);
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let anchors = div.getElementsByTagName("a")
//   let cardContainer = document.querySelector(".cardContainer")
//   Array.from(anchors).forEach(async e=>{
//     if(e.href.includes("/songs")){
//       let folder = e.href.split("/").slice(-1)[0]
//       let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//       let response = await a.json();
//       cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="ncs" class="card">
//       <div  class="play">
//           <svg width="50" height="50">
//               <circle cx="25" cy="25" r="15" fill="green" />
//               <polygon points="15,20 25,35 35,20" fill="white" />
//           </svg>
//       </div>
//       <img src="/songs/${folder}/cover.jpg" alt="">
//       <h2>${response.title}</h2>
//       <p>${response.description}</p>
//   </div>`
//     }
//   })

 
// }

async function main() {

  //get the list of all the songs
  await getSongs("songs/ncs");
   

  // //Display all the albums on the page
  //  displayAlbums()

  //Attach an event listener to play next previous

  play.addEventListener("click" , () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "img/pause.svg"
    }
    else {
      currentSong.pause()
      play.src = "img/play.svg"
    }
  })
    
  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
     document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${
      secondsToMinutesSeconds(currentSong.duration)}`
     document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%"
  })


  // Add an event Listener to seekbar
   document.querySelector(".seekbar").addEventListener("click",e => {
        let precent = (e.offsetX/e.target.getBoundingClientRect().width)* 100 
        document.querySelector(".circle").style.left = precent + "%"
        currentSong.currentTime = ((currentSong.duration)*precent)/100   
        })


   // Add an event listener for hamburger
   document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
   })

   // Add an event listener for close
   document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%"
   })

   // Add event listener to previous and next
   previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) >= 0){
      playMusic(songs[index+1])
     }
   })

   next.addEventListener("click", () => {
         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
         if((index+1) < songs.length){
           playMusic(songs[index+1])
          }

     })
  
     //Add an event to vloume
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            currentSong.volume = parseInt(e.target.value)/100
            if (currentSong.volume > 0){
              document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
          }
          else if(currentSong.volume <= 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg")
          }
     })

      // load the playlist wheneever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async (item) => {
       songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
       
   })})

     // Event for mute button
     document.querySelector(".volume>img").addEventListener("click", e=>{ 
      if(e.target.src.includes("volume.svg")){
          e.target.src = e.target.src.replace("volume.svg", "mute.svg")
          currentSong.volume = 0;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else{
          e.target.src = e.target.src.replace("mute.svg", "volume.svg")
          currentSong.volume = .10;
          document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
      }

  })
}

main();
