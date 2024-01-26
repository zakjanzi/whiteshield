(() => {
  $(document).ready(() => {
    // Close navbar for mobile and tablet view on click nav item

    $(".nav-link").each((navLink) => {
      $(this).click(function (e) {
        $("#navbarSupportedContent").removeClass("show");
      });
    });

    // Read more button click setup
    const readMoreBtnText = document.querySelector(".read-more-btn__text");
    const readMoreBtn = document.querySelector("#read-more-btn");

    readMoreBtn.addEventListener("mouseover", (e) => {
      readMoreBtnText.classList.add("slide-up");
    });

    readMoreBtn.addEventListener("mouseleave", (e) => {
      readMoreBtnText.classList.remove("slide-up");
    });

    readMoreBtn.addEventListener("click", (e) => {
      document
        .querySelector(".first-section")
        .scrollIntoView({ behavior: "smooth" });
    });
    // End read more button click

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

    // Line chart setup
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

      const totalDuration = 1400;
      const delayBetweenPoints = totalDuration / data.length;
      const previousY = (ctx) =>
        ctx.index === 0
          ? ctx.chart.scales.y.getPixelForValue(100)
          : ctx.chart
              .getDatasetMeta(ctx.datasetIndex)
              .data[ctx.index - 1].getProps(["y"], true).y;

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

      new Chart(document.getElementById("meta-users"), {
        type: "line",
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
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
              pointBackgroundColor: "grey",
              pointBorderColor: "#fff",
              pointBorderWidth: 1,
              pointRadius: 4,
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "grey",
              pointHoverBorderWidth: 1,
            },
          ],
        },
      });
    };
    // End line chart setup

    // Background transition opacity
    const sectionThreeBg = document.querySelector(".section-three-bg");
    const sectionThreeBgPos = sectionThreeBg.getBoundingClientRect().y;
    // End background transition opacity

    // First parallax section
    const firstParagraph = document.querySelector(".first-paragraph");
    const firstPBottom =
      firstParagraph.offsetHeight + firstParagraph.getBoundingClientRect().y;
    const secondParagraph = document.querySelector(".second-paragraph");
    // End first parallax section

    // Last section page parallax
    const lastSectionContainer = document.querySelector(
      ".last-section-container"
    );
    const lastSectionContainerPos =
      lastSectionContainer.getBoundingClientRect().y;
    const firstOverlayContainer = document.querySelector(
      ".first-overlay-container"
    );
    const rightContainer = document.querySelector(".right-container");
    const leftContainer = document.querySelector(".left-container");
    const simplifyText = document.querySelector(".simplify-text");
    const initialSimplifyTextPos = simplifyText.getBoundingClientRect().y;
    const satelliteImages = document.querySelector(".satellite-images");
    const paragraphTwo = document.querySelector(".paragraph-two");
    const dataTable = document.querySelector(".data-table");
    const scoringFormula = document.querySelector(".scoring-formula-container");
    const paragraphThree = document.querySelector(".paragraph-three");
    let lastSectionParallaxActive = false;
    let lastSectionListener;
    let viewedSections = [];
    const SECTIONS = {
      SATELLITE_IMAGES: "SATELLITE_IMAGES",
      DATA_TABLE: "DATA_TABLE",
      SCORING_FORMULA: "SCORING_FORMULA",
      PARAGRAPH_THREE: "PARAGRAPH_THREE",
    };
    // End last section page parallax

    const endOfPageReached = () => {
      return window.scrollY + window.innerHeight >= document.body.scrollHeight;
    };

    const sectionViewed = (section) => {
      return viewedSections.includes(section);
    };

    const removeViewedSection = (section) => {
      const sectionIndex = viewedSections.indexOf(section);
      viewedSections.splice(sectionIndex, 1);
    };

    const showOrHideSatelliteImages = () => {
      if (simplifyText.getBoundingClientRect().y < 50) {
        if (sectionViewed(SECTIONS.SATELLITE_IMAGES)) return;
        satelliteImages.classList.add("fade-in");

        // Hide others
        dataTable.classList.remove("fade-in");

        viewedSections.push(SECTIONS.SATELLITE_IMAGES);
      } else {
        removeViewedSection(SECTIONS.SATELLITE_IMAGES);

        dataTable.classList.remove("fade-in");

        // Change the background image of the last section container
        lastSectionContainer.classList.remove("bg-img-2");
      }
    };

    const showOrHideDataTable = () => {
      // Display data table
      if (paragraphTwo.getBoundingClientRect().y <= -200) {
        // Hide all the right container items
        satelliteImages.classList.remove("fade-in");
        scoringFormula.classList.remove("fade-in");
        dataTable.classList.remove("fade-in");

        // Hide overlay
        firstOverlayContainer.classList.remove("simplify-fade-in");

        // Change the background image of the last section container
        lastSectionContainer.classList.add("bg-img-2");

        // Reset viewed images in right container for them to be displayed on reverse scroll
        removeViewedSection(SECTIONS.DATA_TABLE);
        removeViewedSection(SECTIONS.SCORING_FORMULA);
        removeViewedSection(SECTIONS.SATELLITE_IMAGES);
      } else if (paragraphTwo.getBoundingClientRect().y < 50) {
        if (sectionViewed(SECTIONS.SCORING_FORMULA)) return;
        scoringFormula.classList.add("fade-in");

        // Hide others
        satelliteImages.classList.remove("fade-in");
        dataTable.classList.remove("fade-in");

        viewedSections.push(SECTIONS.SCORING_FORMULA);
        removeViewedSection(SECTIONS.DATA_TABLE);
      } else if (paragraphTwo.getBoundingClientRect().y < 600) {
        if (sectionViewed(SECTIONS.DATA_TABLE)) return;
        dataTable.classList.add("fade-in");

        // Hide others
        satelliteImages.classList.remove("fade-in");
        scoringFormula.classList.remove("fade-in");

        viewedSections.push(SECTIONS.DATA_TABLE);
      }
    };

    let displayedPThree = false;
    const showOrHideOverlayForLastParagraph = () => {
      if (
        paragraphThree.getBoundingClientRect().y <= 600 &&
        displayedPThree === false
      ) {
        displayedPThree = true;
        firstOverlayContainer.classList.add("fade-in-important");
      } else if (paragraphThree.getBoundingClientRect().y > 600) {
        displayedPThree = false;
        firstOverlayContainer.classList.remove("fade-in-important");

        // Change the background image of the last section container
        lastSectionContainer.classList.remove("bg-img-2");
      }
    };

    const setupScrollListenerForLastSection = () => {
      const handler = (e) => {
        if (simplifyText.getBoundingClientRect().y < 450) {
          firstOverlayContainer.classList.add("simplify-fade-in");
        } else if (
          Math.round(simplifyText.getBoundingClientRect().y) ===
          window.innerHeight
        ) {
          firstOverlayContainer.classList.remove("simplify-fade-in");

          lastSectionParallaxActive = false;

          leftContainer.style.overscrollBehavior = "initial";

          leftContainer.removeEventListener("scroll", lastSectionListener);
        }

        showOrHideSatelliteImages();

        showOrHideDataTable();

        showOrHideOverlayForLastParagraph();
      };

      lastSectionListener = leftContainer.addEventListener("scroll", handler);
    };

    const handleLastSectionParallax = () => {
      if (endOfPageReached() && !lastSectionParallaxActive) {
        lastSectionParallaxActive = true;

        leftContainer.style.overscrollBehavior = "contain";

        setupScrollListenerForLastSection();
      } else if (endOfPageReached() && lastSectionParallaxActive) {
      }
    };

    // Chart display operations
    const CHARTS = {
      FIRST_CHART: "FIRST_CHART",
      HORIZONTAL_BAR: "HORIZONTAL_BAR",
      BUSINESS_CHART_ONE: "BUSINESS_CHART_ONE",
      BUSINESS_CHART_TWO: "BUSINESS_CHART_TWO",
      DUBAI_DATASET_CHART: "DUBAI_DATASET_CHART",
    };

    const drawnCharts = [];

    const hasBeenDrawn = (chart) => {
      return drawnCharts.includes(chart);
    };

    const pushIntoDrawnCharts = (chart) => {
      drawnCharts.push(chart);
    };

    const showAnimatedChart = () => {
      // Load line chart
      if (
        isScrolledIntoView(document.querySelector("#meta-users")) &&
        !hasBeenDrawn(CHARTS.FIRST_CHART)
      ) {
        drawLineChart();
        pushIntoDrawnCharts(CHARTS.FIRST_CHART);
      }

      if (
        isScrolledIntoView(document.querySelector("#mena")) &&
        !hasBeenDrawn(CHARTS.HORIZONTAL_BAR)
      ) {
        drawHorizontalBarChart();
        pushIntoDrawnCharts(CHARTS.HORIZONTAL_BAR);
      }

      if (
        isScrolledIntoView(document.querySelector("#business-chart-one")) &&
        !hasBeenDrawn(CHARTS.BUSINESS_CHART_ONE)
      ) {
        drawBusinessBarChartOne();
        pushIntoDrawnCharts(CHARTS.BUSINESS_CHART_ONE);
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
        drawDubaiDatasetChart();
        pushIntoDrawnCharts(CHARTS.DUBAI_DATASET_CHART);
      }
    };
    // End chart display operations

    const allChartsDrawn = () => {
      drawnCharts.length === 5;
    };

    window.addEventListener("scroll", (e) => {
      showAnimatedChart();

      // For last section of the page
      if (!lastSectionParallaxActive) {
        handleLastSectionParallax();
      }
      // End for last section of the page

      if (window.scrollY >= firstPBottom) {
        if (!secondParagraph.classList.contains("fade-bg")) {
          secondParagraph.classList.add("fade-bg");
        }
      } else {
        if (secondParagraph.classList.contains("fade-bg")) {
          secondParagraph.classList.remove("fade-bg");
        }
      }

      // For Background transition opacity (map section)
      if (window.scrollY + 50 >= sectionThreeBgPos) {
        if (sectionThreeBg.classList.contains("bg-map")) return;

        sectionThreeBg.classList.add("bg-map");
      }
      // End for background transition opacity
    });

    // Open Data Barometer charts setup
    const drawHorizontalBarChart = () => {
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
            aspectRatio: window.innerWidth < 768 ? 2 : 5,
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
              },
            ],
          },
        });
      });
    };

    // Business Data transparency Index charts setup
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
          aspectRatio: 1,
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
          labels: ["Estonia", "Latvia", "Sweden"],
          datasets: [
            {
              data: chartOneData.map((data) => data.length),
              backgroundColor: "#003b5c",
            },
          ],
        },
      });
    };

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
          aspectRatio: 1,
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
              },
              border: { display: false },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
        },
        data: {
          labels: chartTwoData.map((item) => item.country),
          datasets: [
            {
              data: chartTwoData.map((data) => data.length),
              backgroundColor: "#DC766C",
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
        let count = document.querySelector(".country-rank-counter");
        count.innerHTML = ++upto;
        if (upto === 87) {
          clearInterval(counts);
        }
      }
    };
    // End UAE rank counter
    // End Business data chart

    // Dubai dataset chart
    const drawDubaiDatasetChart = () => {
      const dubaiDataset = [
        {
          elements: [7, 24, 7, 8, 15.5],
          backgroundColor: "#DC766C",
        },
        {
          elements: [9, 10.5, 9, 5.5, 4],
          backgroundColor: "#003b5c",
        },
      ];

      new Chart(document.getElementById("dubai-dataset-chart"), {
        type: "bar",
        options: {
          responsive: true,
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
              },
              border: {
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
  });
})();
