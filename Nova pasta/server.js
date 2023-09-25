const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Chart = require('chart.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const chartData = {
  labels: [],
  datasets: [{
    label: 'Valor do Sensor',
    data: [],
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1
  }]
};

const chartOptions = {
  responsive: true,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'second'
      },
      title: {
        display: true,
        text: 'Tempo'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Valor'
      }
    }
  }
};

const chart = new Chart('myChart', {
  type: 'line',
  data: chartData,
  options: chartOptions
});

io.on('connection', (socket) => {
  socket.on('data', (data) => {
    chartData.labels.push(new Date());
    chartData.datasets[0].data.push(data);
    chart.update();
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
