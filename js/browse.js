// Import persistant storage
const Store = require('electron-store');
const store = new Store();
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');

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

  youTube.getById(url, function(error, result) {
    if (error) {
      console.log(error);
    }
    else {
      // Create some variables to work with
      let vid = {};
      let answer = JSON.stringify(result, null, 2);
      let playlist = [];
      if (store.get('playlist')) playlist = store.get('playlist');

      // Add all properties to the vid-object
      vid.id = result.items[0].id;
      vid.title = result.items[0].snippet.title;

      // Then, add the new video
      playlist.push(vid);

      // Aaaand save it!
      store.set('playlist', playlist);
      updatePlaylist();
    }
  });
}

function clearPlaylist() {
  // Just clear the storage and update();
  store.set('playlist', []);
  updatePlaylist();
}

// UI Output
function updatePlaylist() {
  // Variables
  let msg = document.getElementsByClassName('message')[0];
  let playlist = store.get('playlist');

  // Rebuild contents
  let insert = '';
  playlist.forEach(function (v, v_index) {
    insert += '<div class="video">';
    insert += '<div class="vid-container">';
    insert += '<img src="https://img.youtube.com/vi/'+v.id+'/mqdefault.jpg" height="67.5" width="120">';
    insert += '<div class="vid-overlay"><a onclick="removeVid(' + v_index + ')">X</a></div>';
    insert += '</div>';
    insert += '<p>'+v.title+'</p>';
    insert += '</div>';
  });

  msg.getElementsByClassName('message-body')[0].innerHTML = insert;

}
