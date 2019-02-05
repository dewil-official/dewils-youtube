// Import persistant storage
const Store = require('electron-store');
const store = new Store();

// Add current link to the storage
function addVidButton() {
  let url = document.getElementById('url');
  url.classList.remove('is-primary');
  url.classList.remove('animated');
  url.classList.remove('shake');
  // If the link is valid, add it.
  if (isValidUrl(url.value)) {
    // Add the video ID to the playlist
    addToStore(isValidUrl(url.value));
    // Clear the input
    url.value = null;
    // TODO: Update Visuals
    updatePlaylist();
  } else {
    // Clear the input
    url.value = null;
    // Output error
    url.classList.add('is-primary');
    url.classList.add('animated');
    url.classList.add('shake');
  }
}

// Url verification
// IMPORTANT: Also converts the input url to video id
function isValidUrl(url) {
  if (url.includes('v=')) {
    // In case of a standard php url
    let id = url.substring(url.indexOf('v=')+2);
    if (id.includes('&')) {
      id = id.substring(0,id.indexOf('&'));
      return id;
    } else {
      return id;
    }
  } else if (url.includes('y2u.be') || url.includes('youtu.be')) {
    // In case of a shortened Url
    let id = url.substring(url.indexOf('/')+1);
    return id;
  } else if (!url.includes('/') && !url.includes(':') && !url.includes('&') && !url.includes('?') && !url.includes('=')) {
    // In case of direct id input (Not 100% shure working)
    return url;
  } else return false;
}

// Simplified storage handling
function addToStore(url) {
  // Create a new array to handle the playlists
  // If available, load the currently saved playlist into it
  let playlist = [];
  if (store.get('playlist')) playlist = store.get('playlist');
  // Then, add the new video
  playlist.push(url);
  // Aaaand save it!
  store.set('playlist', playlist);
}

function clearPlaylist() {
  store.set('playlist', []);
  updatePlaylist();
}

// UI Output
function updatePlaylist() {
  // Variables
  let msg = document.getElementsByClassName('message')[0];
  let isOpened = true;
  if (msg.classList.includes('hidden')) isOpened = false;
  let playlist = store.get('playlist');

  // Close it if playlist is empty
  if (isOpened && playlist == []) {
    msg.classList.add('hidden');
  }

  // Open it if not already opened
  if (!isOpened && playlist !== []) {
    msg.classList.remove('hidden');
  }

  // Rebuild contents
  let insert = '';
  for (let v of playlist) {
    insert += '<div class="video">';
    insert += '<img src="https://img.youtube.com/vi/'+v+'/mqdefault.jpg" height="67.5" width="120">';
    insert += '<p>'+v+'</p>';
    insert += '</div>';
  }
  
}
