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
