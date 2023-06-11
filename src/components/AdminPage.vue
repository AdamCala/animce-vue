<template>
    <div id="sus">
      <h1>SONG PLAYER</h1>
      <div class="menu">
        <button @click="playRandomSong">Play Random Song</button>
      </div>
      <div id="fate">
        <div class="menu">
          <select v-model="selectedSongId" @change="playSelectedSong(selectedSongId)">
            <option value="">Select Song by ID</option>
            <option v-for="song in songs" :value="song.id.toString()" :key="song.id">Play {{ song.nazwa_piosenki }}</option>
          </select>
        </div>
        <div class="menu">
          <select v-model="queueSongId" @change="addToQueue(queueSongId)">
            <option value="">Select Song to Queue</option>
            <option v-for="song in songs" :value="song.id.toString()" :key="song.id">Queue {{ song.nazwa_piosenki }}</option>
          </select>
        </div>
      </div>
      <div class="menu">
        <button @click="toggleQueue">Show/Hide Queue</button>
      </div>
      <div v-show="showQueue" id="queueue">
        <div class="queue-item" v-for="(item, index) in queue" :key="index">
          
          <input type="checkbox" v-model="selectedQueueItems" :value="index" />
          <p>{{ index + 1 }}. {{ item.nazwa_animca }} - {{ item.nazwa_piosenki }}</p>
          <div class="queue-buttons">
            <button @click="moveQueueItemUp(index)" :disabled="index === 0">&#9650;</button>
            <button @click="moveQueueItemDown(index)" :disabled="index === queue.length - 1">&#9660;</button>
          </div>
        </div> 
        <button @click="removeSelectedSongsFromQueue" v-if="selectedQueueItems.length > 0">Remove Selected Songs</button>
      </div>
      <button v-if="queue.length > 0" @click="handleSongEnded">Next Song</button>
      <div v-if="selectedSong">
        <song-player :song="selectedSong" @play="setIsPlaying(true)" @pause="setIsPlaying(false)" @ended="handleSongEnded"/>
      </div>
    </div>
  </template>
  
  

<style>
#fate{
    display: flex;
    flex-direction: row;
    padding: 10px;
}
#fate > select{
    margin: 20px;
    padding: 20px;
}
    #sus {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .menu {
        margin-top: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    button {
        margin-right: 10px;
    }
    #queueue{
        display: flex;
        flex-direction: column;
    }
    .queue-item{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    p{
        color: #ea80fc; 
    }
</style>

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
                queueSongId: "",
                isPlaying: false,
                previousSongs: [],
                randomFactor: 7,
                queue: [],
                showQueue: false,
                selectedQueueItems: [],
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
            selectedQueueItem() {
                return this.queue.length > 0 ? 0 : null;
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
            playSelectedSong(songId) {
                const selectedSong = this.songs.find((song) => song.id.toString() === songId);
                if (selectedSong) {
                    console.log("Playing selected song:", selectedSong);
                    // Additional logic for playing the selected song
                }
            },
            addToQueue(songId) {
                const song = this.songs.find((song) => song.id.toString() === songId);
                if (song) {
                    this.queue.push(song);
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
            handleSongEnded() {
                console.log('owari da');
                if (this.queue.length > 0) {
                    // Play the next song from the queue
                    this.selectedSongId = this.queue[0].id.toString();
                    this.updatePreviousSongs(this.queue[0].id.toString());
                    this.queue.shift(); // Remove the first item from the queue

                }
            },
            toggleQueue() {
                this.showQueue = !this.showQueue;
            },
            removeSelectedSongsFromQueue() {
                if (this.selectedQueueItems.length > 0 && this.queue.length > 0) {
                    this.selectedQueueItems.sort((a, b) => b - a); // Sort indices in descending order
                    for (const index of this.selectedQueueItems) {
                    this.queue.splice(index, 1);
                    }
                    this.selectedQueueItems = [];
                }
            },
            moveQueueItemUp(index) {
            if (index > 0) {
                const temp = this.queue[index - 1];
                this.queue[index - 1] = this.queue[index];
                this.queue[index] = temp;
            }
            },

            moveQueueItemDown(index) {
            if (index < this.queue.length - 1) {
                const temp = this.queue[index + 1];
                this.queue[index + 1] = this.queue[index];
                this.queue[index] = temp;
            }
            }
        },
    };
</script>
