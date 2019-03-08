const YouTubePlayer = require('youtube-player');

var player, firstStateChange;

player = YouTubePlayer('player-div', {
    videoId: 'M7lc1UVf-VE'
});

player
    // Play video is a Promise.
    // 'playVideo' is queued and will execute as soon as player is ready.
    .playVideo()
    .then(function () {
        console.log('Starting to play player1. It will take some time to buffer video before it starts playing.');
});
