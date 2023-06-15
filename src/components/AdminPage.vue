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
            <option v-for="song in songs" :value="song.id.toString()" :key="song.id">Play {{ song.nazwa_animca }} - {{ song.nazwa_piosenki }} - ({{ getDifficultyLabel(song.difficulty) }})</option>
          </select>
        </div>
        <div class="menu">
          <select v-model="queueSongId" @change="addToQueue(queueSongId)">
            <option value="">Select Song to Queue</option>
            <option v-for="song in songs" :value="song.id.toString()" :key="song.id">Queue {{ song.nazwa_animca }} - {{ song.nazwa_piosenki }} - ({{ getDifficultyLabel(song.difficulty) }})</option>
          </select>
        </div>
      </div>
      <div class="menu">
        <button @click="toggleQueue">Show/Hide Queue</button>
      </div>
      <div v-show="showQueue" id="queueue">
        <div class="queue-item" v-for="(item, index) in queue" :key="index">
            <p>{{ index + 1 }}. {{ item.nazwa_animca }} - {{ item.nazwa_piosenki }} - ({{ getDifficultyLabel(item.difficulty) }})</p>
            <div class="queue-buttons">
            <button @click="moveQueueItemUp(index)" :disabled="index === 0">&#9650;</button>
            <button @click="moveQueueItemDown(index)" :disabled="index === queue.length - 1">&#9660;</button>
            <button @click="removeSongFromQueue(index)">Delete</button> <!-- New button for deleting individual song -->
            </div>
        </div>
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
            };
        },
        mounted() {
            console.log('Mounted hook called');
            // Call the API endpoint to process the Excel file
            processExcelFile()
                .then((data) => {
                    this.songs = data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        beforeMount(){
            this.fetchQueue();
        },
        created(){
            console.log('Created hook called');
        },
        computed: {
            selectedSong() {
                return this.songs.find((song) => song.id.toString() === this.selectedSongId);
            },
            selectedQueueItem() {
                return this.queue.length > 0 ? 0 : null;
            },
            updateQueue() {
                return async () => {
                    const newData = {
                        queue: this.queue
                    };

                    try {
                    const response = await fetch('http://localhost:3000/writeQueue', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newData)
                    });

                    // Handle the response from the server
                    console.log(await response.text());
                    } catch (error) {
                    // Handle any errors that occur during the request
                    console.error(error);
                    }
                };
            }
        },
        methods: {
            async fetchQueue() {
                try {
                    const response = await fetch('http://localhost:3000/readQueue');
                    
                    const data = await response.json();
                    console.log('data');
                    console.log(data);
                    this.queue = data.queue;
                    console.log('Queue:', this.queue);
                } catch (error) {
                    console.error(error);
                }
            },
            getDifficultyLabel(difficulty) {
                return difficulty === 0 ? 'Easy' : 'Hard';
            },
            playRandomSong() {
                if (this.songs.length > 0) {
                    let randomIndex;
                    do {
                        randomIndex = Math.floor(Math.random() * this.songs.length);
                    } while (this.isPreviousSong(this.songs[randomIndex].id.toString()));

                    this.selectedSongId = this.songs[randomIndex].id.toString();
                    this.updatePreviousSongs(this.songs[randomIndex].id.toString());
                }
                    const selectedSong = this.songs.find((song) => song.id.toString() === this.selectedSongId);

                    fetch('http://localhost:3000/readFile')
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                    const existingSong = data.find((song) => song.id === selectedSong.id);

                    if (existingSong) {
                        // Increment "plays" value if the song exists
                        existingSong.plays += 1;

                        // Update the song in the JSON file
                        fetch('http://localhost:3000/writeFile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                        })
                        .then(() => {
                            console.log('Song updated in the JSON file');
                        })
                        .catch((error) => {
                            console.error('Error updating song:', error);
                        });
                    } else {
                        // Create a new record for the song if it doesn't exist
                        const newSong = {
                        id: selectedSong.id,
                        nazwa_piosenki: selectedSong.nazwa_piosenki,
                        nazwa_animca: selectedSong.nazwa_animca,
                        difficulty: selectedSong.difficulty,
                        plays: 1
                        };

                        // Add the new song to the JSON file
                        data.push(newSong);

                        // Update the JSON file with the new song
                        fetch('http://localhost:3000/writeFile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                        })
                        .then(() => {
                            console.log('New song added to the JSON file');
                        })
                        .catch((error) => {
                            console.error('Error adding new song:', error);
                        });
                    }
                    })
                    .catch((error) => {
                    console.error('Error retrieving song data:', error);
                    });

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

                // Check if the song already exists in the JSON file
                fetch('http://localhost:3000/readFile')
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                    const existingSong = data.find((song) => song.id === selectedSong.id);

                    if (existingSong) {
                        // Increment "plays" value if the song exists
                        existingSong.plays += 1;

                        // Update the song in the JSON file
                        fetch('http://localhost:3000/writeFile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                        })
                        .then(() => {
                            console.log('Song updated in the JSON file');
                        })
                        .catch((error) => {
                            console.error('Error updating song:', error);
                        });
                    } else {
                        // Create a new record for the song if it doesn't exist
                        const newSong = {
                        id: selectedSong.id,
                        nazwa_piosenki: selectedSong.nazwa_piosenki,
                        nazwa_animca: selectedSong.nazwa_animca,
                        difficulty: selectedSong.difficulty,
                        plays: 1
                        };

                        // Add the new song to the JSON file
                        data.push(newSong);

                        // Update the JSON file with the new song
                        fetch('http://localhost:3000/writeFile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                        })
                        .then(() => {
                            console.log('New song added to the JSON file');
                        })
                        .catch((error) => {
                            console.error('Error adding new song:', error);
                        });
                    }
                    })
                    .catch((error) => {
                    console.error('Error retrieving song data:', error);
                    });

                // Additional logic for playing the selected song
                }
            },
            addToQueue(songId) {
                const song = this.songs.find((song) => song.id.toString() === songId);
                if (song) {
                    this.queue.push(song);
                }
                this.updateQueue();
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
                    const selectedSong = this.songs.find((song) => song.id.toString() === this.selectedSongId);

                    fetch('http://localhost:3000/readFile')
                    .then(response => response.json())
                    .then(data => {
                    console.log(data);
                    const existingSong = data.find((song) => song.id === selectedSong.id);

                    if (existingSong) {
                        // Increment "plays" value if the song exists
                        existingSong.plays += 1;

                        // Update the song in the JSON file
                        fetch('http://localhost:3000/writeFile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                        })
                        .then(() => {
                            console.log('Song updated in the JSON file');
                        })
                        .catch((error) => {
                            console.error('Error updating song:', error);
                        });
                    } else {
                        // Create a new record for the song if it doesn't exist
                        const newSong = {
                        id: selectedSong.id,
                        nazwa_piosenki: selectedSong.nazwa_piosenki,
                        nazwa_animca: selectedSong.nazwa_animca,
                        difficulty: selectedSong.difficulty,
                        plays: 1
                        };

                        // Add the new song to the JSON file
                        data.push(newSong);

                        // Update the JSON file with the new song
                        fetch('http://localhost:3000/writeFile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                        })
                        .then(() => {
                            console.log('New song added to the JSON file');
                        })
                        .catch((error) => {
                            console.error('Error adding new song:', error);
                        });
                    }
                    })
                    .catch((error) => {
                    console.error('Error retrieving song data:', error);
                    });
                    this.updateQueue();

                }
            },
            toggleQueue() {
                this.showQueue = !this.showQueue;
            },
            removeSongFromQueue(index) {
                this.queue.splice(index, 1);
                this.updateQueue();
            },
            moveQueueItemUp(index) {
            if (index > 0) {
                const temp = this.queue[index - 1];
                this.queue[index - 1] = this.queue[index];
                this.queue[index] = temp;
                this.updateQueue();
                }
            },

            moveQueueItemDown(index) {
            if (index < this.queue.length - 1) {
                const temp = this.queue[index + 1];
                this.queue[index + 1] = this.queue[index];
                this.queue[index] = temp;
                this.updateQueue();
                }
            }
        },
    };
</script>