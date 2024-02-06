const isDesktopView = () => {
  return window.innerWidth > 1024;
};

const isMobileView = () => {
  return window.innerWidth < 768;
};

function isScrolledIntoView(el) {
  var rect = el.getBoundingClientRect();
  var elemTop = rect.top;
  var elemBottom = rect.bottom;

  // Only completely visible elements return true:
  var isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
  // Partially visible elements return true:
  //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
  return isVisible;
}

// rem to px converter setup
let remValue = 10;

if (window.innerWidth > 800) {
  remValue = 11;
}

if (window.innerWidth > 1100) {
  remValue = 14;
}

if (window.innerWidth >= 1400) {
  remValue = 16;
}

const remToPixel = (givenRemValue) => {
  return givenRemValue * remValue;
};
// End rem to px converter setup

// Chart display operations
const CHARTS = {
  FIRST_CHART: "FIRST_CHART",
  HORIZONTAL_BAR: "HORIZONTAL_BAR",
  BUSINESS_CHART_ONE: "BUSINESS_CHART_ONE",
  BUSINESS_CHART_TWO: "BUSINESS_CHART_TWO",
  DUBAI_DATASET_CHART: "DUBAI_DATASET_CHART",
};

const drawnCharts = [];

// This checks to see if a particular graph has been drawn
const hasBeenDrawn = (chart) => {
  return drawnCharts.includes(chart);
};

// Keeps record of graph that has been drawn
const pushIntoDrawnCharts = (chart) => {
  drawnCharts.push(chart);
};

// monitors the visibility stage of a graph on the page and renders it once it is visible
const showAnimatedChart = () => {
  // Load line chart
  if (
    isScrolledIntoView(document.querySelector("#meta-users")) &&
    !hasBeenDrawn(CHARTS.FIRST_CHART)
  ) {
    pushIntoDrawnCharts(CHARTS.FIRST_CHART);
    drawLineChart();
  }

  if (
    isScrolledIntoView(document.querySelector("#mena")) &&
    !hasBeenDrawn(CHARTS.HORIZONTAL_BAR)
  ) {
    pushIntoDrawnCharts(CHARTS.HORIZONTAL_BAR);
    drawHorizontalBarChart();
  }

  if (
    isScrolledIntoView(document.querySelector("#business-chart-one")) &&
    !hasBeenDrawn(CHARTS.BUSINESS_CHART_ONE)
  ) {
    pushIntoDrawnCharts(CHARTS.BUSINESS_CHART_ONE);
    drawBusinessBarChartOne();
  }

  if (
    isScrolledIntoView(document.querySelector("#business-chart-two")) &&
    !hasBeenDrawn(CHARTS.BUSINESS_CHART_TWO)
  ) {
    if (!allChartsDrawn()) {
      pushIntoDrawnCharts(CHARTS.BUSINESS_CHART_TWO);
      setTimeout(() => {
        drawBusinessBarChartTwo();
        doRankCounter();
      }, 1000);
    }
  }

  if (
    isScrolledIntoView(document.querySelector("#dubai-dataset-chart")) &&
    !hasBeenDrawn(CHARTS.DUBAI_DATASET_CHART)
  ) {
    pushIntoDrawnCharts(CHARTS.DUBAI_DATASET_CHART);
    drawDubaiDatasetChart();
  }
};
// End chart display operations

// Returns the total number of drawn charts
const allChartsDrawn = () => {
  drawnCharts.length === 5;
};

// Set font for Chartjs
Chart.defaults.font.family = "Montserrat";

// Line chart setup. For the first graph on the page
const drawLineChart = () => {
  const data = [
    { num_users: 3.5, quarter: "" },
    { num_users: 3.65, quarter: "Q2 '22" },
    { num_users: 3.71, quarter: "Q3 '22" },
    { num_users: 3.74, quarter: "Q4 '22" },
    { num_users: 3.81, quarter: "Q1 '23" },
    { num_users: 3.88, quarter: "Q2 '23" },
    { num_users: 3.96, quarter: "Q3 '23" },
  ];

  const totalDuration = 300;
  const delayBetweenPoints = totalDuration / data.length;
  const previousY = (ctx) => {
    const value =
      ctx.index === 0
        ? ctx.chart.scales.y.getPixelForValue(100)
        : ctx.chart
            .getDatasetMeta(ctx.datasetIndex)
            .data[ctx.index - 1].getProps(["y"], true).y;
  };

  const animation = {
    x: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: NaN, // the point is initially skipped
      delay(ctx) {
        if (ctx.type !== "data" || ctx.xStarted) {
          return 0;
        }
        ctx.xStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
    y: {
      type: "number",
      easing: "linear",
      duration: delayBetweenPoints,
      from: previousY,
      delay(ctx) {
        if (ctx.type !== "data" || ctx.yStarted) {
          return 0;
        }
        ctx.yStarted = true;
        return ctx.index * delayBetweenPoints;
      },
    },
  };

  const rect = { x: 0, y: 0, prevX: 0 };
  let chartPainted = false;

  let lineChart = new Chart(document.getElementById("meta-users"), {
    type: "line",

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          // Disable the on-canvas tooltip
          enabled: false,
          position: "nearest",
        },
      },
      onHover: (e, _, chart) => {
        const {
          ctx,
          tooltip,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = e.chart;

        const canvasPositionX = Chart.helpers.getRelativePosition(e, chart).x;

        const tooltipsPositions = tooltip.chart.scales.x._gridLineItems?.filter(
          (tooltip, index) => {
            return index > 0 && Math.round(tooltip.tx1) === canvasPositionX;
          }
        );

        const position = chart.canvas.getBoundingClientRect();

        // if (chartPainted) {
        //   if (canvasPrevPos > canvasPositionX) {
        //     canvasMoveCounter -= 1;
        //   } else {
        //     canvasMoveCounter += 1;
        //   }

        //   let canvasPrevPos = canvasPositionX;

        //   if (Math.abs(canvasMoveCounter) >= 40) {
        //     chartPainted = false;
        //     canvasMoveCounter = 0;
        //     // remove generated tooltip
        //     document.querySelector("#chartjs-tooltip").remove();

        //     document.querySelector("#chartjs-tooltip-circle").remove();

        //     document.querySelector("#chartjs-tooltip-line").remove();
        //   }
        // }

        if (tooltipsPositions?.length > 0 && !chartPainted) {
          chartPainted = true;

          // Show tooltip for the line intersect
          const meta = chart.getDatasetMeta(0);

          let tooltipIndex;

          for (let j = 0; j < meta.data.length; j++) {
            if (
              Math.floor(meta.data[j].x) ===
              Math.floor(tooltipsPositions[0].tx1)
            ) {
              tooltipIndex = j;
            }
          }

          let tooltipEl;
          let intersectingCircle;
          let dashedLine;

          rect.x = canvasPositionX;

          // Create tooltip element, dashed line and intersecting circle
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.innerHTML = "<table></table>";
            document.body.appendChild(tooltipEl);

            // intersecting circle
            intersectingCircle = document.createElement("div");
            intersectingCircle.id = "chartjs-tooltip-circle";
            intersectingCircle.style.opacity = 1;
            intersectingCircle.style.position = "absolute";
            intersectingCircle.style.left =
              position.left +
              meta.data[tooltipIndex]?.x -
              (isDesktopView() ? 10 : 15) +
              "px";
            intersectingCircle.style.top =
              position.top +
              window.scrollY +
              meta.data[tooltipIndex]?.y -
              10 +
              "px";
            intersectingCircle.style.font = "inherit";
            intersectingCircle.style.height = "20px";
            intersectingCircle.style.width = "20px";
            intersectingCircle.style.backgroundColor = "#226b8b";
            intersectingCircle.style.borderColor = "#fff";
            intersectingCircle.style.borderWidth = "2px";
            intersectingCircle.style.borderStyle = "solid";
            intersectingCircle.style.borderRadius = "50px";
            intersectingCircle.style.zIndex = 1000;
            intersectingCircle.style.pointerEvents = "none";
            //document.body.appendChild(intersectingCircle);
            // intersecting circle end

            // dashed line start
            // dashedLine = document.createElement("div");
            // dashedLine.id = "chartjs-tooltip-line";
            // dashedLine.innerHTML = "<div></div>";
            // dashedLine.style.position = "absolute";
            // dashedLine.style.left =
            //   position.left +
            //   meta.data[tooltipIndex]?.x -
            //   (isDesktopView() ? 1 : 15) +
            //   "px";
            // dashedLine.style.top = position.top + window.scrollY + "px";
            // dashedLine.style.height = chart.canvas.height - 30 + "px";
            // dashedLine.style.borderWidth = "0.1rem";
            // dashedLine.style.borderStyle = "dashed";
            // dashedLine.style.borderColor = "rgba(0,0,0,0.5)";
            // dashedLine.style.zIndex = 100;
            // document.body.appendChild(dashedLine);
            // dashed line end
          }

          // Hide if no tooltip
          const tooltipModel = tooltip;

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 1;
            //return;
          }

          // Set caret Position
          tooltipEl.classList.remove("above", "below", "no-transform");
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add("no-transform");
          }

          // Set Text

          let innerHtml = "<thead>";

          innerHtml += "</thead><tbody>";

          let style = "background:" + "#fff";
          style += "; color:" + "#000";
          style += "; border-width: 0px";
          const span =
            '<span style="' +
            style +
            '">' +
            meta._parsed[tooltipIndex]?.y +
            " bn</span>";
          innerHtml += "<tr><td>" + span + "</td></tr>";

          innerHtml += "</tbody>";

          let tableRoot = tooltipEl.querySelector("table");
          //tableRoot.innerHTML = innerHtml;

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 0;
          tooltipEl.style.position = "absolute";
          tooltipEl.style.left =
            position.left + meta.data[tooltipIndex]?.x + 22 + "px";
          tooltipEl.style.top =
            position.top +
            window.scrollY +
            meta.data[tooltipIndex]?.y -
            20 +
            "px";
          tooltipEl.style.font = "inherit";
          tooltipEl.style.padding = "5px";
          tooltipEl.style.backgroundColor = "#fff";
          tooltipEl.style.borderRadius = "5px";
          tooltipEl.style.color = "#fefefe";
          tooltipEl.style.zIndex = 1000;
          tooltipEl.style.fontSize = "1rem";
          tooltipEl.style.pointerEvents = "none";
          // End show tooltip
        }
      },
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
      animation,
    },
    data: {
      labels: data.map((row) => row.quarter),
      datasets: [
        {
          label: "",
          data: data.map((row) => row.num_users),
          borderColor: "#226b8b",
          borderWidth: 5,
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
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
          pointBorderWidth: 0,
          pointRadius: 10,
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "transparent",
          pointHoverBorderWidth: 0,
        },
      ],
    },
  });
};
// End line chart setup. This is for the first chart

// Open Data Barometer charts/graph setup
const drawHorizontalBarChart = () => {
  const animateValuePosition = (overlay, widthValue) => {
    let pixelsDeducted = 0;

    const barSizeLabelPosition = (+widthValue / 60) * 100 + 3 + "%";

    const interval = setInterval(() => {
      if (pixelsDeducted >= +barSizeLabelPosition.split("%")[0]) {
        overlay.style.left = pixelsDeducted - 2 + "%";

        clearInterval(interval);
      } else {
        overlay.style.left = pixelsDeducted + "%";

        pixelsDeducted += 5;
      }
    });
  };

  const slideOverlaysRight = () => {
    // Get the reference to the overlay
    const barOverlayContainers = document.querySelectorAll(
      ".section-four > article:nth-child(2) > section:nth-child(2) > section"
    );

    barOverlayContainers.forEach((barOverlayContainer, index) => {
      const overlay = barOverlayContainer.querySelector(
        "article:nth-child(2) > span"
      );

      animateValuePosition(overlay, overlay.textContent, index);
    });
  };

  const isMobileView = () => {
    return window.innerWidth < 768;
  };

  [
    { id: "g-20", length: 56.8, bgColor: "#236C8B" },
    { id: "world-average", length: 32.5, bgColor: "#236C8B" },
    { id: "uae", length: 26.2, bgColor: "#E39189" },
    { id: "mena", length: 18.2, bgColor: "#E39189" },
  ].forEach((horizontalBarChart, index) => {
    const chart = new Chart(document.getElementById(horizontalBarChart.id), {
      type: "bar",
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            ticks: {
              display: false,
              margin: 50,
            },
          },

          x: {
            border: {
              display: false,
            },
            grid: {
              display: false,
            },
            min: 0,
            max: 60,
            ticks: {
              stepSize: 5,
              margin: 50,
              display: false,
            },
          },
        },
      },
      data: {
        labels: [horizontalBarChart.id.toUpperCase().replace("-", " ")],
        datasets: [
          {
            data: [horizontalBarChart.length],
            backgroundColor: horizontalBarChart.bgColor,
            barThickness: isMobileView() ? 22 : 60,
          },
        ],
      },
    });

    //setChartHeightAndWidth(chart);

    // Run this code when the last bar has been painted
    slideOverlaysRight();
  });
};

// Business Data transparency Index charts setup, first graph
const drawBusinessBarChartOne = () => {
  const chartOneData = [
    { id: "Estonia", length: 95 },
    { id: "Latvia", length: 90 },
    { id: "Sweden", length: 85 },
  ];

  new Chart(document.getElementById("business-chart-one"), {
    type: "bar",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      barThickness: isDesktopView() ? 60 : 22,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            font: {
              size: remToPixel(isDesktopView() ? 1.11 : 0.8),
            },
          },
        },
        x: {
          border: {
            display: false,
          },
          grid: {
            display: false,
          },
          ticks: {
            autoSkip: false,
            font: {
              size: remToPixel(isDesktopView() ? 1.11 : 0.8),
            },
          },
        },
      },
    },
    data: {
      labels: isDesktopView()
        ? ["Estonia", "Latvia", "Sweden"]
        : ["EST", "LVA", "SWE"],
      datasets: [
        {
          data: chartOneData.map((data) => data.length),
          backgroundColor: "#236c8b",
        },
      ],
    },
  });
};

// Business Data transparency second graph
const drawBusinessBarChartTwo = () => {
  const chartTwoData = [
    { country: "UAE", length: 22 },
    { country: "QATAR", length: 20 },
    { country: "KSA", length: 18 },
  ];

  new Chart(document.getElementById("business-chart-two"), {
    type: "bar",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      barThickness: isDesktopView() ? 60 : 22,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            font: {
              size: remToPixel(isDesktopView() ? 1.11 : 0.8),
            },
          },
          border: { display: false },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: remToPixel(isDesktopView() ? 1.11 : 0.8),
            },
          },
        },
      },
    },
    data: {
      labels: chartTwoData.map((item) => item.country),
      datasets: [
        {
          data: chartTwoData.map((data) => data.length),
          backgroundColor: "#E18F88",
        },
      ],
    },
  });
};

// UAE rank counter
const doRankCounter = () => {
  let counts = setInterval(UAERankCounter);
  let upto = 0;
  function UAERankCounter() {
    let count = document.querySelector(
      ".section-four > article:nth-child(5) > article > section > section:nth-child(3) > section > article > section:nth-child(1) > span"
    );
    count.innerHTML = ++upto;
    if (upto === 87) {
      clearInterval(counts);
    }
  }
};
// End UAE rank counter
// End Business data chart

// Dubai dataset chart
// Please note the following
// The first elements list of values correlate with that of the second elements of the dubaiDataset
// So 7 correlates with 9, and 24 correlates with 10.5.
const drawDubaiDatasetChart = () => {
  const dubaiDataset = [
    {
      elements: [7, 24, 7, 8, 15.5],
      backgroundColor: "#E18F87",
    },
    {
      elements: [9, 10.5, 9, 5.5, 4],
      backgroundColor: "#4c87a0",
    },
  ];

  new Chart(document.getElementById("dubai-dataset-chart"), {
    type: "bar",
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          min: 0,
          max: 25,
          ticks: {
            stepSize: 5,
            font: {
              size: remToPixel(isDesktopView() ? 1.11 : 0.9),
            },
          },
          border: {
            display: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            autoSkip: false,
            font: {
              size: remToPixel(isDesktopView() ? 1.11 : 0.9),
            },
          },
        },
      },
    },
    data: {
      labels: ["Building", "Land", "Road", "Vegetation", "Water"],
      datasets: dubaiDataset.map((singleDataset) => {
        return {
          data: singleDataset.elements,
          backgroundColor: singleDataset.backgroundColor,
        };
      }),
    },
  });
};
