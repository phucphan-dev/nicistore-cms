import { dateInCurrentMonth } from 'common/utils/functions';

export const dataConfig = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 8, 34, 2, 3, 7, 9, 34, 12, 4],
      fill: false,
      backgroundColor: '#8BC441',
      borderColor: '#8BC441',
      pointHoverRadius: 5,
      pointRadius: 1,
    },
  ],
};
// OPTIONS CONFIGURATION
export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    scaleId: {
      ticks: {
        display: false,
      },
      title: {
        display: true,
      },
      grid: {
        borderDash: [2, 4],
        color: '#595959',
        borderColor: '#ffffff', // change color follow by theme
        drawTicks: false,
        label: {
          display: false,
        },
      },
    },
    x: {
      grid: {
        borderColor: '#595959',
        display: false,
      },
    },
    y: {
      // position: 'right',
      grid: {
        borderColor: '#ffffff', // change color follow by theme
        display: false,
      },
    },
  },
};

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    // htmlLegend: {
    //   // ID of the container to put the legend in
    //   containerID: 'doughnut-legend-container',
    // },
    legend: {
      display: true,
    },
    datalabels: {
      display: true,
      labels: {
        title: {
          font: {
            weight: 'bold',
            size: 15,
          },
          color: 'red',
        },
      },
    },
  },
};
export const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: false,
  },
  interaction: {
    mode: 'index', // show all value of lines on tooltip
    intersect: false,
  },
  plugins: {
    htmlLegend: {
      containerID: 'legend-container',
    },
    legend: {
      display: false,
      // position: 'bottom',
      // align: 'start',
      // labels: {
      //   usePointStyle: true,
      //   pointStyle: 'circle'
      // },
    },
    datalabels: {
      display: true,
      color: 'transparent',
      padding: {
        right: 2,
      },
      labels: {
        title: {
          font: {
            weight: 'bold',
            size: 15,
          },
          color: '#ffffff',
          rotation: -90,
        },
      },
    },
  },
  scales: {
    scaleId: {
      ticks: {
        display: false,
      },
      title: {
        display: true,
      },
      grid: {
        borderDash: [2, 4],
        color: '#595959',
        borderColor: '#ffffff', // change color follow by theme
        drawTicks: false,
        label: {
          display: false,
        },
      },
    },
    x: {
      grid: {
        borderColor: '#595959',
        display: false,
      },
      ticks: {
        // callback(value:any) {
        //   return `$${value}`;
        // },
        color: '#8C8C8C',
        font: {
          weight: 700,
          size: 16,
        },
      },
    },
    y: {
      grid: {
        borderColor: '#ffffff', // change color follow by theme
        display: false,
      },
      ticks: {
        callback(value: any) {
          return value;
        },
        color: '#8C8C8C',
        font: {
          weight: 700,
          size: 16,
        },
      },
    },
  },
};

// DATA CONFIGURATION
export const barData = {
  labels: dateInCurrentMonth(),
  datasets: [
    {
      type: 'bar',
      data: [
        200, 500, 1500, 800, 1200, 3000, 2800, 800, 1200, 3000,
        200, 500, 1500, 800, 1200, 3000, 2800, 800, 1200, 3000,
        200, 500, 1500, 800, 1200, 3000, 2800, 800, 1200, 3000,
        4000,
      ],
      backgroundColor: '#4D89FF',
      barThickness: 10,
      borderRadius: 3,
      label: 'Active User',
      order: 3,
    },
    {
      type: 'bar',
      data: [
        250, 800, 5500, 8000, 1900, 3040, 200, 80, 1200, 3900,
        250, 800, 5500, 8000, 1900, 3040, 200, 80, 1200, 3900,
        250, 800, 5500, 8000, 1900, 3040, 200, 80, 1200, 3900,
        4000,
      ],
      backgroundColor: '#6CDBBA',
      barThickness: 10,
      borderRadius: 3,
      label: 'New User',
      order: 2,
    },
    {
      type: 'line',
      label: 'Sections',
      data: [
        200, 70, 5900, 8880, 1990, 700, 2002, 800, 1210, 390,
        200, 70, 5900, 8880, 1990, 700, 2002, 800, 1210, 390,
        200, 70, 5900, 8880, 1990, 700, 2002, 800, 1210, 390,
        8000,
      ],
      fill: false,
      backgroundColor: '#ff4d4f',
      borderColor: '#ff4d4f',
      pointHoverRadius: 5,
      pointRadius: 1,
      order: 1,
    },
  ],
};
export const doughnutData = {
  labels: [
    'Dummy 1',
    'Dummy 2',
    'Dummy 3',
    'Dummy 4',
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [25556, 2000, 10000, 8000],
    backgroundColor: [
      '#9BDB48',
      '#FF4D4F',
      '#FCBD3F',
      '#4D9BF7',
    ],
    hoverOffset: 2,
  }],
};
