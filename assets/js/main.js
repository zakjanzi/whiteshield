(async function () {
  const data = [
    { num_users: 3.5, quarter: "" },
    { num_users: 3.65, quarter: "Q2 '22" },
    { num_users: 3.71, quarter: "Q3 '22" },
    { num_users: 3.74, quarter: "Q4 '22" },
    { num_users: 3.81, quarter: "Q1 '23" },
    { num_users: 3.88, quarter: "Q2 '23" },
    { num_users: 3.96, quarter: "Q3 '23" },
  ];

  new Chart(document.getElementById("meta-users"), {
    type: "line",
    options: {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          min: 0,
          max: 5,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
    data: {
      labels: data.map((row) => row.quarter),
      datasets: [
        {
          label: "",
          data: data.map((row) => row.num_users),
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) {
              // This case happens on initial chart load
              return;
            }

            let gradient = ctx.createLinearGradient(
              0,
              chartArea.bottom,
              0,
              chartArea.top
            );

            gradient.addColorStop(0, "rgba(210, 207, 245, 0)");
            gradient.addColorStop(0.8, "rgba(210,207,245, .7)");
            gradient.addColorStop(1, "rgba(255,255,255,.7)");

            return gradient;
          },

          fill: true,
        },
      ],
    },
  });
})();

(() => {
  $(document).ready(() => {
    // Open Data Barometer charts setup
    [
      { id: "g-20", length: 56.8, bgColor: "#236C8B" },
      { id: "world-average", length: 32.5, bgColor: "#236C8B" },
      { id: "uae", length: 26.2, bgColor: "#DC766C" },
      { id: "mena", length: 18.2, bgColor: "#DC766C" },
    ].forEach((horizontalBarChart) => {
      new Chart(document.getElementById(horizontalBarChart.id), {
        type: "bar",
        options: {
          indexAxis: "y",
          responsive: true,
          plugins: false,
          scales: {
            y: {
              grid: {
                display: false,
              },
              min: 0,
              max: 60,
              ticks: {
                stepSize: 50,
                display: false,
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
        data: {
          labels: [horizontalBarChart.id.toUpperCase().replace("-", " ")],
          datasets: [
            {
              label: horizontalBarChart.length,
              data: [horizontalBarChart.length],
              backgroundColor: horizontalBarChart.bgColor,
            },
          ],
        },
      });
    });

    // Business Data transparency Index charts setup
    const chartOneData = [
      { id: "Estonia", length: 95 },
      { id: "Latvia", length: 90 },
      { id: "Sweden", length: 85 },
    ];

    new Chart(document.getElementById("business-chart-one"), {
      type: "bar",
      options: {
        responsive: true,
        plugins: false,
        scales: {
          y: {
            grid: {
              display: false,
            },
            min: 0,
            max: 60,
            ticks: {
              stepSize: 10,
              display: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
      data: {
        labels: "null",
        datasets: [
          {
            label: chartOneData.map((data) => data.id),
            data: chartOneData.map((data) => data.length),
            backgroundColor: "#003b5c",
          },
        ],
      },
    });
  });
})();
