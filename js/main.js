'use strict';

var instantMeter = document.querySelector('#instant meter'),
    instantValueDisplay = document.querySelector('#instant .value'),
    slowMeter = document.querySelector('#slow meter'),
    slowValueDisplay = document.querySelector('#slow .value');

try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new AudioContext();
} catch (e) {
    alert('Web Audio API not supported.');
}

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
    audio: true,
    video: false
};

navigator.mediaDevices.getUserMedia(constraints)

    .then(function (stream) {
        // Put variables in global scope to make them available to the browser console.
        window.stream = stream;
        var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
        soundMeter.connectToSource(stream, function (e) {
            if (e) {
                alert(e);
                return;
            }
            setInterval(function () {
                instantMeter.value = instantValueDisplay.innerText = soundMeter.instant.toFixed(2);
                slowMeter.value = slowValueDisplay.innerText = soundMeter.slow.toFixed(2);
            }, 200);

            setInterval(function() {
                axios.post('service/post.php', 'db=' + slowMeter.value)
                    .catch(function(error) {
                       console.log(error);
                    });
            }, 1000);
        });
    })

    .catch(function (e) {
        console.log('navigator.getUserMedia error: ', e);
    });
