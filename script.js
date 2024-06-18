

const songs = [
  {
      id: "1",
      name: "Dekha Tenu Pehli Pehli Baar Ve",
      artist: "artist 1",
      img: "Images/Image 1 AlbumArt_Large.jpg",
      audio: "Audio/Dekha Tenu Pehli Pehli Baar Ve_64(PagalWorld.com.sb).mp3",
      genre: "rock",
  },
  {
      id: "2",
      name: "Guli Mata_64(PagalWorld.com.sb)",
      artist: "artist 2",
      img: "Images/Image 2AlbumArt__Small.jpg",
      audio: "Audio/Song 2 Guli Mata_64(PagalWorld.com.sb).mp3",
      genre: "rock",
  },
  {
      id: "3",
      name: "Kahani Suno_64(PagalWorld.com.sb)",
      artist: "artist 3",
      img: "Images/Image 3.jpg",
      audio: "Audio/Kahani Suno_64(PagalWorld.com.sb).mp3",
      genre: "workout",
  },
  {
      id: "4",
      name: "O Mahi O Mahi_",
      artist: "artist 4",
      img: "Images/Image 4.jpg",
      audio: "Audio/O Mahi O Mahi_64(PagalWorld.com.sb).mp3",
      genre: "party",
  },
  {
      id: "5",
      name: "O Sajni Re",
      artist: "Fearless_320(PagalWorld.com.se)",
      img: "Images/Image 5.jpg",
      audio: "Audio/O Sajni Re_64(PagalWorld.com.sb).mp3",
      genre: "workout",
  },
  {
      id: "6",
      name: "Play Date Lilly Brooks",
      artist: "artist 6",
      img: "Images/Image 6.jpg",
      audio: "Audio/Play Date Lilly Brooks 128 Kbps.mp3",
      genre: "slowed and reverb",
  },
  {
      id: "7",
      name: "Ram Siya Ram",
      artist: "artist 7",
      img: "Images/Image 7.jpg",
      audio: "Audio/Ram Siya Ram_64(PagalWorld.com.sb).mp3",
      genre: "slowed and reverb",
  },
  {
      id: "8",
      name: "Soulmate",
      artist: "artist 8",
      img: "Images/Image 8.jpg",
      audio: "Audio/Soulmate_64(PagalWorld.com.sb).mp3",
      genre: "rock",
  },
  {
      id: "9",
      name: "Ve Haniya Ve Dil Janiya_",
      artist: "artist 9",
      img: "Images/Image 9.jpg",
      audio: "Audio/Ve Haniya Ve Dil Janiya_64(PagalWorld.com.sb).mp3",
      genre: "slowed and reverb",
  },
  {
      id: "10",
      name: "TAKE YOU ON (FEAT. PHILOSOFIE)-JAMES MERCY-VlcMusic.CoM",
      artist: "artist 10",
      img: "Images/Image 10.png",
      audio: "Audio/Sugar And Brownies Song Download.mp3",
      genre: "party",
  },
];

const customPlaylist = {};

const queue = [];
const unlistedPlaylist = new Set();
const showSongList = new Set(songs.map(element => element.id));

const playlists = [];
let currentSongIndex = -1;


showSongs();
renderCurrentSong();
toggleTheme();

/* -------------------------------------------------------------------------- */
/*                               Render Function                              */
/* -------------------------------------------------------------------------- */

/**
 * @description Render All song
 */
function showSongs() {
  const songsList = document.getElementById("songsList");
  songsList.innerHTML = "";
  songs.forEach((song) => {
    if (!showSongList.has(song.id))
      return;

    const button = document.createElement("button");
    button.textContent = `${song.name} - ${song.artist}`;
    button.addEventListener("click", () => {
      _updateCurrentSongQueueAndIndex("single",song.id);
    });
    songsList.appendChild(button);
  });
}

/**
 * @description Render Song Card
 */
function renderCurrentSong() {
  // checking for is there any current songs
  if(currentSongIndex == -1 ){
    document.getElementById("noSong").classList.toggle("displayNone");
    document.getElementById("currentSong").classList.toggle("displayNone");
    return;
  }
  // checks for queue end, if end then stop at last song
  if(currentSongIndex >= queue.length ){
    currentSongIndex--;
    return;
  }

  document.getElementById("currentSong").classList.remove("displayNone");
  document.getElementById("noSong").classList.add("displayNone");
  const eSongImage = document.getElementById("songImg");
  const eSongTitle = document.getElementById("songTitle");
  const eSongSubTitle = document.getElementById("songSubtitle");
  const eAudio = document.getElementById("audio");
  // update song info
  const songInfo = songs[queue[currentSongIndex]-1];
  eSongImage.src = songInfo.img;
  eSongTitle.innerHTML = songInfo.name;
  eSongSubTitle.innerHTML = songInfo.artist;
  eAudio.src = songInfo.audio;
  eAudio.play();            // play the song
  renderSongController();   // render the button
}

/**
 * @description Render Song Controller
 */
function renderSongController(){
  const ePrevSong = document.getElementById("prevSong");
  const eNextSong = document.getElementById("nextSong");
  const eAddToPlayList = document.getElementById("addToPlaylist");
  ePrevSong.disabled = (currentSongIndex == 0);
  eNextSong.disabled = (currentSongIndex === queue.length - 1);
  eAddToPlayList.disabled = unlistedPlaylist.has(queue[currentSongIndex]);
}

/**
 * @description Render current playlist
 */
function renderderUnlistedPlayList(){
  const eCurrentPlaylist = document.getElementById("currentPlaylist");
  eCurrentPlaylist.innerHTML = "";

  unlistedPlaylist.forEach((songId) => {
    let song = songs.filter(song => song.id == songId)[0]
    const button = document.createElement("button");
    button.textContent = `${song.name} - ${song.artist}`;
    button.addEventListener("click", () => {
      _updateCurrentSongQueueAndIndex("unlisted",song.id);
    });
    eCurrentPlaylist.appendChild(button);
  })

}

/**
 * @description Render All Playlist container
 */
function renderPlaylists(){
  const ePlaylistsList = document.getElementById("playlistsList");
  ePlaylistsList.innerHTML = "";
  let searchPlayListName = document.getElementById("playlistSerchInput").value;
  const PlayListNameRegex = new RegExp(searchPlayListName, 'i');          // playlist search regex create

  Object.keys(customPlaylist).forEach(key => {

    // Plylist search 
    if(!PlayListNameRegex.test(key))
      return;

    const ePlayListItems = document.createElement("div");
    ePlayListItems.className = "playlistsItems";
    ePlayListItems.id = key;

    // play songs from playlist button
    ePlayListItems.addEventListener("click", () =>{
      _updateCurrentSongQueueAndIndex("playlist",key);
    })

    const name = document.createElement("span");
    name.textContent = key;
    ePlayListItems.appendChild(name);

    const playlistActionContainer = document.createElement("div");
    playlistActionContainer.className = "playlistItems-Action";
    
    // delete button create
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<span class="material-symbols-outlined">delete_forever</span>`
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      let currentKey = event.target.parentElement.parentElement.parentElement.id;
      delete customPlaylist[currentKey];
      renderPlaylists();
      return;
    })

    
    playlistActionContainer.appendChild(deleteBtn);

    ePlayListItems.appendChild(playlistActionContainer);
    ePlaylistsList.appendChild(ePlayListItems);

  })
}
//------------------------------ END OF RENDER  ------------------------------------



/* -------------------------------------------------------------------------- */
/*                               Event Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * @description Filter & Search Song
 */
function onGenerFilter() {
  let filterValue = document.getElementById("genreFilter").value;
  let searchSongName = document.getElementById("songSerchInput").value;

  const genreRegex = filterValue === 'all' ? /.*/ : new RegExp(filterValue, 'i');
  const nameRegex = new RegExp(searchSongName, 'i');
  let filteredSongs = songs.filter(song => genreRegex.test(song.genre) && (nameRegex.test(song.name) || nameRegex.test(song.artist)));
  _setSongs(showSongList, filteredSongs);
  showSongs();

}

/**
 * @description Change ThemeS
 * @param {*} oEvent event object
 */
function toggleTheme(oEvent) {
  if(document.getElementById("checkBoxInput").checked)
    document.body.classList.remove("light-theme");
  else
  document.body.classList.add("light-theme");

}

/**
 * @description Search song on enter press
 * @param {*} oEvent event object
 */
function onSongSearchInputKeyPress(oEvent){
  if(oEvent.key == "Enter"){
    onGenerFilter();
  }
}

/**
 * @description Previous Song btn
 * @param {*} oEvent Evnt object
 */
function onPreviousSongClick(oEvent){
  currentSongIndex = currentSongIndex-1;
  renderCurrentSong();
}

/**
 * @description Next Song btn
 * @param {*} oEvent Evnt object
 */
function onNextSongClick(oEvent){
  currentSongIndex = currentSongIndex+1;
  renderCurrentSong();
}

/**
 * @description on Add to playlist button
 * @param {*} oEvent Evnt object
 */
function addtoPlaylist(oEvent){
  unlistedPlaylist.add(queue[currentSongIndex]);
  renderSongController();
  renderderUnlistedPlayList();
}

/**
 * @description after current song ends
 * @param {*} oEvent Evnt object
 */
function onCurrentSongEnd(oEvent){
  onNextSongClick();
}

function onCreateNewPlaylist(oEvent){
  const playlistName = document.getElementById("newPlaylistName").value;
  customPlaylist[playlistName] = new Set(unlistedPlaylist);
  unlistedPlaylist.clear();
  renderPlaylists();
  renderderUnlistedPlayList();
  document.getElementById("newPlaylistName").value = "";
}
//------------------------------ Event Functions ------------------------------------


/* -------------------------------------------------------------------------- */
/*                             All System Function                            */
/* -------------------------------------------------------------------------- */

/**
 * @description to conver a array to song ID set
 * @param {Set} setNameOfSongList 
 * @param {Array} arrayListOfSongs
 * 
 */
function _setSongs(setNameOfSongList, arrayListOfSongs) {
  setNameOfSongList.clear();
  arrayListOfSongs.forEach(songs => setNameOfSongList.add(songs.id));
}

/**
 * @description to update queue and currentSong index on Song button click
 * @param {*} type from where this function get called
 * @param {*} songId songId for update
 */
function _updateCurrentSongQueueAndIndex(type,songId){
  let songIndex = queue.indexOf(songId); // checks for song index in queue if available
  let index = songIndex;
  if(type=="single"){
    if(songIndex >= 0)  
      queue.splice(songIndex,1);  // removeing song Index from queue
    queue.push(songId); //update the queue
    index = queue.length-1;
  }
  else if(type == "playlist"){
    queue.splice(0,queue.length);       // removing all the songs from que
    unlistedPlaylist.clear()
    customPlaylist[songId].forEach(song => {
      queue.push(song)
      unlistedPlaylist.add(song);
    });
    index = 0;
    renderderUnlistedPlayList();
  }
  currentSongIndex = index;
  renderCurrentSong();
}