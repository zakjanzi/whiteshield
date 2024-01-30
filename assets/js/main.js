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

    const isDesktopView = () => {
      return window.innerWidth > 1024;
    };

    const isTabletView = () => {
      return window.innerWidth >= 768 && window.innerWidth < 1024;
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

      const rect = { x: 0, y: 0 };

      new Chart(document.getElementById("meta-users"), {
        type: "line",
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          onHover: (e, _, chart) => {
            const {
              ctx,
              tooltip,
              chartArea: { top, bottom, left, right, width, height },
              scales: { x, y },
            } = e.chart;

            const canvasPositionX = Chart.helpers.getRelativePosition(
              e,
              chart
            ).x;

            const tooltipsPositions =
              tooltip.chart.scales.x._gridLineItems.filter((tooltip, index) => {
                return index > 0 && Math.round(tooltip.tx1) === canvasPositionX;
              });

            if (tooltipsPositions.length > 0) {
              rect.x = canvasPositionX;
              rect.y = tooltipsPositions[0].ty1 - 600;
              ctx.save();
              ctx.beginPath();
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = "rgba(0,0,0,1)";
              ctx.setLineDash([10, 10]);
              ctx.moveTo(canvasPositionX, rect.y);
              ctx.lineTo(canvasPositionX, bottom);
              ctx.stroke();
              ctx.closePath();
              ctx.setLineDash([]);
            } else {
              ctx.restore();
              ctx.save();
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
              pointBackgroundColor: "none",
              pointBorderColor: "transparent",
              pointBorderWidth: 0,
              pointRadius: 0,
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "transparent",
              pointHoverBorderWidth: 0,
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

    let firstOverlayContainer;

    if (!isDesktopView()) {
      document.querySelector(".first-overlay-container").remove();
      firstOverlayContainer = document.querySelector(
        ".first-overlay-container"
      );
    } else {
      firstOverlayContainer = document.querySelector(
        ".first-overlay-container"
      );
    }

    // Last section page parallax
    const lastSectionContainer = document.querySelector(
      ".last-section-container"
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
    const footerBgTwoMobile = document.querySelector(".footer-bg-two-mobile");
    const paragraphThreeMobile = document.querySelector(
      ".paragraph-three-mobile"
    );
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
      viewedSections = Array.from(new Set(viewedSections));

      const sectionIndex = viewedSections.indexOf(section);
      viewedSections.splice(sectionIndex, 1);
    };

    const showOrHideSatelliteImages = () => {
      if (simplifyText.getBoundingClientRect().y <= 0) {
        if (sectionViewed(SECTIONS.SATELLITE_IMAGES)) return;
        satelliteImages.classList.add("fade-in");

        // Hide others
        dataTable.classList.remove("fade-in");

        viewedSections.push(SECTIONS.SATELLITE_IMAGES);
      } else {
        removeViewedSection(SECTIONS.SATELLITE_IMAGES);

        dataTable.classList.remove("fade-in");
        // satelliteImages.classList.remove("fade-in");

        // Change the background image of the last section container
        lastSectionContainer.classList.remove("bg-img-2");
      }
    };

    const showOrHideDataTable = () => {
      if (
        paragraphThree.getBoundingClientRect().y <= window.innerHeight - 150 &&
        displayedPThree.state
      ) {
        firstOverlayContainer.classList.add("simplify-fade-in");
      }

      if (
        paragraphThree.getBoundingClientRect().y <= window.innerHeight &&
        !displayedPThree.state
      ) {
        displayedPThree.state = true;

        scoringFormula.classList.remove("fade-in");

        // // Change the background image of the last section container
        lastSectionContainer.classList.remove("bg-img-1");
        lastSectionContainer.classList.add("bg-img-2");
        firstOverlayContainer.classList.remove("simplify-fade-in");
        lastSectionContainer.classList.add("show-bg-img-2");
      }

      if (
        paragraphTwo.getBoundingClientRect().y + 5 <=
        Math.abs(
          window.innerHeight - (window.innerHeight + paragraphTwo.offsetHeight)
        )
      ) {
        if (sectionViewed(SECTIONS.SCORING_FORMULA)) return;
        scoringFormula.classList.add("fade-in");

        // Hide others
        satelliteImages.classList.remove("fade-in");
        dataTable.classList.remove("fade-in");

        viewedSections.push(SECTIONS.SCORING_FORMULA);
      }

      if (
        paragraphTwo.getBoundingClientRect().y + paragraphTwo.offsetHeight <
        window.innerHeight
      ) {
        if (sectionViewed(SECTIONS.DATA_TABLE)) return;
        dataTable.classList.add("fade-in");

        // Hide others
        satelliteImages.classList.remove("fade-in");
        scoringFormula.classList.remove("fade-in");

        viewedSections.push(SECTIONS.DATA_TABLE);
      }
    };

    let displayedPThree = {
      state: false,
    };

    const setupScrollListenerForLastSection = () => {
      const handler = (e) => {
        if (
          simplifyText.getBoundingClientRect().y <
            window.innerHeight - simplifyText.offsetHeight &&
          simplifyText.getBoundingClientRect().y > 0
        ) {
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
      };

      lastSectionListener = leftContainer.addEventListener("scroll", handler);
    };

    const handleLastSectionParallax = () => {
      if (endOfPageReached() && !lastSectionParallaxActive) {
        lastSectionParallaxActive = true;

        leftContainer.style.overflowY = "scroll";
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

    const allChartsDrawn = () => {
      drawnCharts.length === 5;
    };

    window.addEventListener("scroll", (e) => {
      showAnimatedChart();

      // handle mobile view on scroll
      if (!isDesktopView() && endOfPageReached()) {
        const handler = (e) => {
          let firstOverlayActive = false;

          if (
            simplifyText.getBoundingClientRect().y <
              window.innerHeight - window.innerHeight / 2 &&
            simplifyText.getBoundingClientRect().y > 10
          ) {
            if (!firstOverlayActive) {
              firstOverlayContainer.classList.add("simplify-fade-in");
              firstOverlayActive = true;
            }

            lastSectionParallaxActive = true;

            leftContainer.style.overflowY = "scroll";
            leftContainer.style.overscrollBehavior = "contain";
          }
          let overlayDisabled = false;
          if (
            Math.round(simplifyText.getBoundingClientRect().y) >
              window.innerHeight / 2 &&
            !overlayDisabled
          ) {
            firstOverlayContainer.classList.remove("simplify-fade-in");

            lastSectionParallaxActive = false;

            leftContainer.style.overscrollBehavior = "initial";

            leftContainer.removeEventListener("scroll", lastSectionListener);
            overlayDisabled = true;
          }

          if (
            scoringFormula.getBoundingClientRect().y <=
              -(window.innerHeight - scoringFormula.offsetHeight) &&
            paragraphThreeMobile.getBoundingClientRect().y > window.innerHeight
          ) {
            // handle the background fade in after scoring formula section

            // Fade out left container (This is the container for all elements being scrolled in the footer)
            leftContainer.classList.add("fade-out-animation");

            // Fade in new background
            footerBgTwoMobile.classList.add("fade-in-animation");

            // Fade out overlay
            firstOverlayContainer.classList.remove("simplify-fade-in");
          }

          if (
            scoringFormula.getBoundingClientRect().y >=
              -(window.innerHeight - scoringFormula.offsetHeight) &&
            !overlayDisabled
          ) {
            leftContainer.classList.remove("fade-out-animation");

            footerBgTwoMobile.classList.remove("fade-in-animation");

            firstOverlayContainer.classList.add("simplify-fade-in");
          }

          if (
            paragraphThreeMobile.getBoundingClientRect().y <
            window.innerHeight - window.innerHeight * 0.6
          ) {
            firstOverlayContainer.classList.add("simplify-fade-in");

            // firstOverlayContainer.classList.add("fade-in-important");
          }
        };

        lastSectionListener = leftContainer.addEventListener("scroll", handler);
      }

      // For last section of the page
      if (!lastSectionParallaxActive && isDesktopView()) {
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
      if (window.scrollY + window.innerHeight / 2 >= sectionThreeBgPos) {
        if (sectionThreeBg.classList.contains("bg-map")) return;

        sectionThreeBg.classList.add("bg-map");
      }
      // End for background transition opacity
    });

    const getCanvasHeight = () => {
      if (window.innerWidth > 767) {
        return "60px";
      } else if (window.innerWidth <= 767) {
        return "32px";
      }
    };

    const getCanvasWidth = () => {
      if (window.innerWidth > 767) {
        return 65;
      } else if (window.innerWidth <= 767) {
        return 70;
      }
    };

    // Open Data Barometer charts setup
    const drawHorizontalBarChart = () => {
      const animateValuePosition = (overlay, widthValue) => {
        let pixelsDeducted = 0;

        const barSizeLabelPosition = (+widthValue / 60) * 100 + 3 + "%";

        const interval = setInterval(() => {
          if (pixelsDeducted >= +barSizeLabelPosition.split("%")[0]) {
            overlay.style.left = pixelsDeducted - 4 + "%";

            clearInterval(interval);
          } else {
            overlay.style.left = pixelsDeducted + "%";

            pixelsDeducted += 5;
          }
        });
      };

      const slideOverlaysRight = () => {
        // Get the reference to the overlay
        const barOverlays = document.querySelectorAll(
          ".section-four__chart-canvas-overlay"
        );

        barOverlays.forEach((overlay, index) => {
          animateValuePosition(overlay, overlay.textContent, index);
        });
      };

      const setChartHeightAndWidth = (chart) => {
        chart.canvas.parentNode.style.height = getCanvasHeight();
        chart.canvas.parentNode.style.width = getCanvasWidth() + "%";
      };

      [
        { id: "g-20", length: 56.8, bgColor: "#236C8B" },
        { id: "world-average", length: 32.5, bgColor: "#236C8B" },
        { id: "uae", length: 26.2, bgColor: "#E39189" },
        { id: "mena", length: 18.2, bgColor: "#E39189" },
      ].forEach((horizontalBarChart, index) => {
        const chart = new Chart(
          document.getElementById(horizontalBarChart.id),
          {
            type: "bar",
            options: {
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 2000,
              },
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
          }
        );

        // Run this code when the last bar has been painted
        slideOverlaysRight();
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
          maintainAspectRatio: false,
          barThickness: isDesktopView() || isTabletView() ? 60 : 22,
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
                  size: remToPixel(
                    isDesktopView() || isTabletView() ? 1.11 : 0.8
                  ),
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
                  size: remToPixel(
                    isDesktopView() || isTabletView() ? 1.11 : 0.8
                  ),
                },
              },
            },
          },
        },
        data: {
          labels:
            isDesktopView() || isTabletView()
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
                  size: remToPixel(
                    isDesktopView() || isTabletView() ? 1.11 : 0.8
                  ),
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
                  size: remToPixel(
                    isDesktopView() || isTabletView() ? 1.11 : 0.8
                  ),
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
                  size: remToPixel(
                    isDesktopView() ? 1.11 : isTabletView() ? 0.7 : 0.55
                  ),
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
                font: {
                  size: remToPixel(
                    isDesktopView() ? 1.11 : isTabletView() ? 0.7 : 0.55
                  ),
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
  });
})();
