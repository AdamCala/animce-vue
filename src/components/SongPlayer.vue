<template>
    <div id="amogus">
        <h2>{{ song.nazwa_piosenki }} - {{ song.wykonawca }} - {{ getDifficultyLabel(song.difficulty) }}</h2>
        <canvas ref="visualizerCanvas" width="1920" height="200"></canvas>
        <audio class="audio-player" ref="player" :src="songURL" controls @ended="handleSongEnded" autoplay></audio>
    </div>
</template>


<style scoped>

.audio-player::-webkit-media-controls {
  background-color: #202124;
  color: #ea80fc;
}

.audio-player::-webkit-media-controls-enclosure {
  background-color: #202124;
}

.audio-player::-webkit-media-controls-panel {
  color: #ea80fc;
}

h2 { 
    font-size: 30px; 
    letter-spacing: -1px; 
    color: #ea80fc; 
    text-transform: uppercase; 
    text-shadow: 1px 1px 0 #000; 
    text-align: center; line-height: 50px; 
}

#amogus{
    display: flex;
    flex-direction: column;
    align-items: center;
}
.audio-container {
  position: relative;
  background-color: #202124;
}

.canvas-container {
    position: absolute;
    top: 0;
    width: 100%;
    height: 150px;
}

audio {
  width: 100%;
  max-width: 500px;
}

canvas {
  width: 100%;
  height: 100%;
}

audio::-webkit-media-controls-panel {
  background-color: #202124;
  color: #ea80fc;
}
</style>

<script>
export default {
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  computed: {
    songURL() {
      return require(`@/../public/song/${this.song.nazwa_pliku}`);
    },
  },
  mounted() {
    this.setupVisualizer();
  },
  methods: {
    setupVisualizer() {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioElement = this.$refs.player;

      const audioSource = audioCtx.createMediaElementSource(audioElement);
      const analyser = audioCtx.createAnalyser();

      audioSource.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyser.fftSize = 2048; // Adjust the FFT size for smoother visualization
      analyser.minDecibels = -160; // Adjust the minimum decibels for responsiveness to lower volume

      const visualizerCanvas = this.$refs.visualizerCanvas;
      const canvasCtx = visualizerCanvas.getContext('2d');

      const devicePixelRatio = window.devicePixelRatio || 1;

      visualizerCanvas.width = visualizerCanvas.clientWidth * devicePixelRatio;
      visualizerCanvas.height = visualizerCanvas.clientHeight * devicePixelRatio;

      canvasCtx.scale(devicePixelRatio, devicePixelRatio);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawVisualizer = () => {
        requestAnimationFrame(drawVisualizer);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = '#202124';
        canvasCtx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

        canvasCtx.lineWidth = 2 * devicePixelRatio;
        canvasCtx.strokeStyle = '#ea80fc'; // Use a semi-transparent red color for a softer appearance
        canvasCtx.beginPath();

        const sliceWidth = visualizerCanvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] / 128.0) * 0.8 + 0.5;
          const y = v * visualizerCanvas.height / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(visualizerCanvas.width, visualizerCanvas.height / 2);
        canvasCtx.stroke();
      };

      drawVisualizer();
    },
    handleSongEnded() {
        console.log('Song ended');
        this.$emit('ended');
    },
    getDifficultyLabel(difficulty) {
      return difficulty === 0 ? 'Easy' : 'Hard';
    }
  },
};
</script>




