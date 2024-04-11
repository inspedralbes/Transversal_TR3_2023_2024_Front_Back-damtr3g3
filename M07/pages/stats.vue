<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
  <div>
    <canvas id="myChart2"></canvas>
  </div>
  <div>
    <canvas id="myChart3"></canvas>
  </div>
</template>

<script>
import { getStats } from "../services/communicationsManager";
import {
  Chart,
  LinearScale,
  BarController,
  CategoryScale,
  BarElement,
  ScatterController,
  PointElement
} from "chart.js";

Chart.register(LinearScale, BarController, CategoryScale, BarElement, ScatterController, PointElement);

export default {
  data() {
    return {
      chart: null,
      chart2: null,
      stats: null,
      playerPositions: {},
      playerDamages: {},
      playerData: [],
      playerNames: [],
      intervalId: null,
    };
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.fetchStats();
      console.log("Stats updated");
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    fetchStats(){
      getStats().then((stats) => {
        this.stats = stats;
        this.processStats(stats);
      });
    },
    processStats(stats) {
      const playerPositions = {};
      const playerDamages = {};
      const playerCounts = {};
      const playerNames = [];

      stats.forEach((stat) => {
        const numPlayers = stat.playerStats.length;
        stat.playerStats.forEach((playerStat) => {
          if (playerPositions[playerStat.playerName]) {
            playerPositions[playerStat.playerName] += playerStat.position / numPlayers;
            playerDamages[playerStat.playerName] += playerStat.damageReceived;
            playerCounts[playerStat.playerName] += 1;
          } else {
            playerPositions[playerStat.playerName] = playerStat.position / numPlayers;
            playerDamages[playerStat.playerName] = playerStat.damageReceived;
            playerCounts[playerStat.playerName] = 1;
            playerNames.push(playerStat.playerName);
          }
        });
      });

      const playerData = [];
      for (const player in playerPositions) {
        playerPositions[player] /= playerCounts[player];
        playerDamages[player] /= playerCounts[player];
        playerData.push({
          x: playerPositions[player],
          y: playerDamages[player],
          playerName: player,
        });
      }

      this.playerPositions = playerPositions;
      this.playerDamages = playerDamages;
      this.playerData = playerData;
      this.playerNames = playerNames;
    },
    sortPlayersByPosition() {
      return Object.entries(this.playerPositions)
        .sort((a, b) => a[1] - b[1])
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
    },
    sortPlayersByDamage() {
      return Object.entries(this.playerDamages)
        .sort((a, b) => a[1] - b[1])
        .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
    },
  },
  async mounted() {
    this.stats = await getStats();
    this.processStats(this.stats);

    const sortedPlayerPositions = this.sortPlayersByPosition();
    const sortedPlayerDamages = this.sortPlayersByDamage();

    const ctx = document.getElementById("myChart").getContext("2d");
    const ctx2 = document.getElementById("myChart2").getContext("2d");
    const ctx3 = document.getElementById('myChart3').getContext('2d');
    if (this.chart) {
      this.chart.destroy(); // destroy previous chart if it exists
    }
    if (this.chart2) {
      this.chart2.destroy(); // destroy second chart if it exists
    }
    if (this.chart3) {
      this.chart3.destroy(); // destroy third chart if it exists
    }
    this.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(sortedPlayerPositions),
        datasets: [
          {
            label: "Posició Mitjana (Ajustada pel nombre de jugadors a la partida)",
            data: Object.values(sortedPlayerPositions),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            type: "linear",
            beginAtZero: true,
          },
        },
      },
    });
    this.chart2 = new Chart(ctx2, {
      // add this block
      type: "bar",
      data: {
        labels: Object.keys(sortedPlayerDamages),
        datasets: [
          {
            label: "Cops Rebuts (Mitjana)",
            data: Object.values(sortedPlayerDamages),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            type: "linear",
            beginAtZero: true,
          },
        },
      },
    });
    this.chart3 = new Chart(ctx3, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Posició Mitjana vs Cops Rebuts (Mitjana)',
          data: this.playerData.map((data, i) => ({ ...data, playerName: this.playerNames[i] })),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Posició Mitjana (Adjustada pel nombre de jugadors a la partida)'
            }
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cops rebuts (Mitjana)'
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: function(context) {
                return context[0].raw.playerNames;
              },
              label: function(context){
                return context.raw.playerNames;
              }
            }
          }
        }
      }
    });
  },
};
</script>

<style scoped></style>
