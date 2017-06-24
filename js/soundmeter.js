'use strict';

/* Meter class that generates a number correlated to audio volume.
 The meter class itself displays nothing, but it makes the
 instantaneous and time-decaying volumes available for inspection.
 It also reports on the fraction of samples that were at or near
 the top of the measurement range.
 */
function SoundMeter(context) {
    this.context = context;
    this.instant = 0.0;
    this.slow = 0.0;
    this.script = context.createScriptProcessor(2048, 1, 1); // bufferSize, numberOfInputChannels, numberOfOutputChannels
    var that = this;

    /** appelé lorsque les 2048o sont pleins */
    this.script.onaudioprocess = function (event) {
        var input = event.inputBuffer.getChannelData(0);
        var sum = 0.0;
        for (var i = 0; i < input.length; ++i) { // loop on 2048 samples
            sum += input[i] * input[i];
        }
        that.instant = Math.sqrt(sum / input.length);
        that.slow = 0.95 * that.slow + 0.05 * that.instant;
    };
}

SoundMeter.prototype.connectToSource = function (stream, callback) {
    try {
        this.mic = this.context.createMediaStreamSource(stream);
        this.mic.connect(this.script);
        // necessary to make sample run, but should not be.
        this.script.connect(this.context.destination);
        if (typeof callback !== 'undefined') {
            callback(null);
        }
    } catch (e) {
        console.error(e);
        if (typeof callback !== 'undefined') {
            callback(e);
        }
    }
};

SoundMeter.prototype.stop = function () {
    this.mic.disconnect();
    this.script.disconnect();
};
