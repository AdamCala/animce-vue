<template>
    <div>
      <h1>SCOREBOARD</h1>
      <div class="scoreboard">
        <h2>Easy Difficulty</h2>
        <ol>
          <li v-for="(item, index) in easySongs" :key="index">
            <div class="entry">
              <span class="player">{{ item.nazwa_piosenki }}</span>
              <span class="points">{{ item.plays }}</span>
            </div>
          </li>
        </ol>
      </div>
      <div class="scoreboard">
        <h2>Hard Difficulty</h2>
        <ol>
          <li v-for="(item, index) in hardSongs" :key="index">
            <div class="entry">
              <span class="player">{{ item.nazwa_piosenki }}</span>
              <span class="points">{{ item.plays }}</span>
            </div>
          </li>
        </ol>
      </div>
      <div class="scoreboard">
        <h2>Existing Players Scoreboard</h2>
        <ol>
          <li v-for="(item, index) in filelist" :key="index">
            <div class="entry">
              <span class="player">{{ item.gracza }}</span>
              <span class="points">{{ item.punkty }}</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </template>

<style>

h1 { color: #ea80fc; font-family: 'Righteous', cursive; font-size: 65px; font-weight: normal; line-height: 60px; margin: 10px 0 20px; text-transform: uppercase; text-shadow: 2px 2px 0 #000; text-align: center; }
h2 { color: #ea80fc; font-family: 'Righteous', cursive; font-weight: normal; line-height: 60px; margin: 10px 0 20px; text-transform: uppercase; text-shadow: 2px 2px 0 #000; text-align: center; }
span { color: #ea80fc; font-family: 'Righteous', cursive; font-weight: normal;  text-transform: uppercase; text-shadow: 2px 2px 0 #000; text-align: center; }
li { color: #ea80fc; font-family: 'Righteous', cursive; font-weight: normal;  text-transform: uppercase; text-shadow: 2px 2px 0 #000; text-align: center; }

.scoreboard {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.entry {
    display: flex;
    justify-content: space-between;
}

.player {
    margin-right: 10px;
}

.points {
    font-weight: bold;
}
</style>

<script>
import { processExcelFile } from "@/api/usersApi";

export default {
    data() {
        return {
            filelist: [],
            easySongs: [],
            hardSongs: []
        };
    },
    mounted() {
        // Call the API endpoint to process the Excel file
        fetch('http://localhost:3000/readFile')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Filter the songs based on difficulty
                this.easySongs = data.filter(song => song.difficulty === 0);
                this.hardSongs = data.filter(song => song.difficulty === 1);
            })
            .catch(error => {
                console.error('Error retrieving song data:', error);
            });
        processExcelFile()
            .then((data) => {
                this.filelist = data;
            })
            .catch((error) => {
                console.error(error);
            });
    }
};
</script>
