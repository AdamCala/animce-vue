<template>
    <div>
      <h1>SONG PLAYER</h1>
      <div class="menu">
        <button @click="playRandomSong">Play Random Song</button>
        <select v-model="selectedSongId">
          <option value="">Select Song by ID</option>
          <option v-for="song in songs" :value="song.id.toString()" :key="song.id">
            {{ song.nazwa_piosenki }} - {{ song.wykonawca }}
          </option>
        </select>
      </div>
      <div v-if="selectedSong">
        <song-player :song="selectedSong" @play="setIsPlaying(true)" @pause="setIsPlaying(false)" />
      </div>
    </div>
  </template>
  
  <script>
  import { processExcelFile } from "@/api/songsApi";
  import SongPlayer from "@/components/SongPlayer.vue";
  
  export default {
    components: {
      SongPlayer,
    },
    data() {
      return {
        songs: [],
        selectedSongId: "",
        isPlaying: false,
        previousSongs: [],
        randomFactor: 7
      };
    },
    mounted() {
      // Call the API endpoint to process the Excel file
      processExcelFile()
        .then((data) => {
          this.songs = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    computed: {
      selectedSong() {
        return this.songs.find((song) => song.id.toString() === this.selectedSongId);
      },
    },
    methods: {
      playRandomSong() {
        if (this.songs.length > 0) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * this.songs.length);
          } while (this.isPreviousSong(this.songs[randomIndex].id.toString()));
  
          this.selectedSongId = this.songs[randomIndex].id.toString();
          this.updatePreviousSongs(this.songs[randomIndex].id.toString());
        }
      },
      isPreviousSong(songId) {
        return this.previousSongs.includes(songId);
      },
      updatePreviousSongs(songId) {
        if (this.previousSongs.length >= this.randomFactor) {
          this.previousSongs.shift();
        }
        this.previousSongs.push(songId);
      },
      playSelectedSong() {
        const selectedSong = this.selectedSong;
        if (selectedSong) {
          console.log("Playing selected song:", selectedSong);
        }
      },
      pauseSong() {
        console.log("Pausing the song");
      },
      restartSong() {
        console.log("Restarting the song");
      },
      setIsPlaying(value) {
        this.isPlaying = value;
      },
    },
  };
  </script>
  
  <style>
  .menu {
    margin-top: 20px;
  }
  
  button {
    margin-right: 10px;
  }
  </style>
  