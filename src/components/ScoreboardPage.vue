<template>
    <div>
        <h1>SCOREBOARD</h1>
        <div class="scoreboard">
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
            filelist: []
        };
    },
    mounted() {
        // Call the API endpoint to process the Excel file
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
