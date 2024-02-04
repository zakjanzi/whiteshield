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

    // Set font for Chartjs
    Chart.defaults.font.family = "Montserrat";

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

    const setChartHeightAndWidth = (chart) => {
      chart.canvas.parentNode.style.height = getCanvasHeight();
      chart.canvas.parentNode.style.width = getCanvasWidth() + "%";
    };

    const plugin = {
      id: "savetopng",

      afterRender: function (chart, options) {
        if (!chart.$initialImage) {
          chart.$initialImage = chart.canvas.toDataURL("image/png");
          document.querySelector("#meta-users-dummy-chart").src =
            chart.$initialImage;
        }
      },
    };

    Chart.register(plugin);

    // Line chart setup
    const drawLineChart = () => {
      const showDummyLineChart = () => {
        const graphImage = document.querySelector("#meta-users-dummy-chart");
        graphImage.classList.remove("z-1");
        graphImage.classList.add("z-3");
        graphImage.classList.add("fade-in-normal");
      };

      const hideDummyLineChart = () => {
        const graphImage = document.querySelector("#meta-users-dummy-chart");
        graphImage.classList.remove("fade-in-animation");
        graphImage.classList.remove("z-3");
        graphImage.classList.add("z-1");
      };

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

            const canvasPositionX = Chart.helpers.getRelativePosition(
              e,
              chart
            ).x;

            const tooltipsPositions =
              tooltip.chart.scales.x._gridLineItems?.filter(
                (tooltip, index) => {
                  return (
                    index > 0 && Math.round(tooltip.tx1) === canvasPositionX
                  );
                }
              );

            if (tooltipsPositions?.length > 0 && !chartPainted) {
              // ctx.save();
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

              const position = chart.canvas.getBoundingClientRect();

              let tooltipEl;
              let intersectingCircle;

              // Create tooltip element and intersecting circle
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
                  meta.data[tooltipIndex].y -
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
                document.body.appendChild(intersectingCircle);
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
                meta._parsed[tooltipIndex].y +
                " bn</span>";
              innerHtml += "<tr><td>" + span + "</td></tr>";

              innerHtml += "</tbody>";

              let tableRoot = tooltipEl.querySelector("table");
              tableRoot.innerHTML = innerHtml;

              // Display, position, and set styles for font
              tooltipEl.style.opacity = 1;
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

              // Begin drawing dashed lines
              ctx.beginPath();
              ctx.lineWidth = 0.3;
              ctx.strokeStyle = "rgba(0,0,0,1)";
              ctx.setLineDash([10, 10]);
              rect.x = canvasPositionX;
              rect.y = tooltipsPositions[0]?.ty1 - position.bottom;
              ctx.moveTo(canvasPositionX, rect.y);
              ctx.lineTo(canvasPositionX, bottom);
              ctx.stroke();
              ctx.closePath();
              ctx.setLineDash([]);
              // End drawing dashed lines

              chartPainted = true;
            } else {
              if (
                (canvasPositionX > rect.x + isDesktopView()
                  ? 30
                  : 25 || canvasPositionX < rect.x - isDesktopView()
                  ? 30
                  : 20) &&
                chartPainted
              ) {
                // tooltip.setActiveElements([]);

                showDummyLineChart();

                // remove generated tooltip
                document.querySelector("#chartjs-tooltip").remove();

                document.querySelector("#chartjs-tooltip-circle").remove();

                chart.update();

                hideDummyLineChart();

                chartPainted = false;
                return;
              }
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
    // End line chart setup

    // Background transition opacity
    const sectionThreeBg = document.querySelector(".section-three-bg");
    const sectionThreeBgOverlay = document.querySelector(
      ".section-three__bg-overlay"
    );
    // End background transition opacity

    // First parallax section
    const firstParagraph = document.querySelector(".first-paragraph");
    const firstPBottom =
      firstParagraph.offsetHeight + firstParagraph.getBoundingClientRect().y;

    const secondParagraph = document.querySelector(".second-paragraph");
    const secondParagraphMargin =
      (window.innerHeight - secondParagraph.offsetHeight) / 2;
    secondParagraph.style.marginTop = firstPBottom + secondParagraphMargin;
    secondParagraph.style.marginBottom = secondParagraphMargin;

    const lastParagraph = document.querySelector(".last-paragraph");
    const lastParagraphMargin =
      (window.innerHeight - lastParagraph.offsetHeight) / 2;
    lastParagraph.style.marginBottom = lastParagraphMargin;
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

    const lastSectionBgTwo = document.querySelector(".last-section__bg-two");

    const leftContainer = document.querySelector(".left-container");

    // These settings prevent the left container from being scrollable until the base of the page is reached
    // leftContainer.style.overflowY = "hidden";
    // leftContainer.style.height = "100%";
    // End settings setup

    const leftContainerContent = isMobileView()
      ? document.querySelector(".left-container-content.mobile")
      : document.querySelector(".left-container-content");
    const simplifyText = document.querySelector(".simplify-text");
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

    const showOrHideSatelliteImages = (e) => {
      if (simplifyText.getBoundingClientRect().y <= 0) {
        if (sectionViewed(SECTIONS.SATELLITE_IMAGES)) return;
        satelliteImages.classList.add("fade-in");

        if (!reverseScrollPosObj["satelliteImages"]) {
          savePosition({
            id: "satelliteImages",
            position: lastScrollTop,
          });
        }

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

    const showOrHideDataTable = (e) => {
      if (
        paragraphThree.getBoundingClientRect().y <= window.innerHeight - 150 &&
        displayedPThree.state
      ) {
        paragraphThree.style.marginBottom =
          (window.innerHeight - paragraphThree.offsetHeight) / 2 + "px";

        firstOverlayContainer.classList.add("simplify-fade-in");
      }

      if (
        paragraphThree.getBoundingClientRect().y <= window.innerHeight &&
        !displayedPThree.state
      ) {
        displayedPThree.state = true;

        scoringFormula.classList.remove("fade-in");

        // // Change the background image of the last section container
        // lastSectionContainer.classList.add("opacity-0");
        firstOverlayContainer.classList.remove("simplify-fade-in");
        lastSectionBgTwo.classList.add("show-bg-img-2");
      }

      if (paragraphTwo.getBoundingClientRect().y <= 10) {
        if (sectionViewed(SECTIONS.SCORING_FORMULA)) return;
        scoringFormula.classList.add("fade-in");

        savePosition({
          id: "scoringFormula",
          position: lastScrollTop,
        });

        // Hide others
        satelliteImages.classList.remove("fade-in");
        dataTable.classList.remove("fade-in");

        displayedPThree.state = false;

        viewedSections.push(SECTIONS.SCORING_FORMULA);
      }

      if (
        paragraphTwo.getBoundingClientRect().y + paragraphTwo.offsetHeight <
        window.innerHeight
      ) {
        if (sectionViewed(SECTIONS.DATA_TABLE)) return;
        dataTable.classList.add("fade-in");

        if (!reverseScrollPosObj["dataTable"]) {
          savePosition({
            id: "dataTable",
            position: lastScrollTop,
          });
        }

        // Hide others
        satelliteImages.classList.remove("fade-in");
        scoringFormula.classList.remove("fade-in");

        viewedSections.push(SECTIONS.DATA_TABLE);
      }
    };

    let displayedPThree = {
      state: false,
    };

    const reverseScrollPosObj = {};

    const savePosition = (positionDetails) => {
      reverseScrollPosObj[positionDetails.id] = positionDetails.position;
    };

    const handleReverseScroll = (e) => {
      if (
        lastScrollTop < reverseScrollPosObj["scoringFormula"] &&
        lastScrollTop + window.innerHeight > reverseScrollPosObj["dataTable"]
      ) {
        lastSectionBgTwo.classList.remove("show-bg-img-2");
        scoringFormula.classList.add("fade-in");

        satelliteImages.classList.remove("fade-in");
        dataTable.classList.remove("fade-in");
        return;
      }

      if (
        lastScrollTop > reverseScrollPosObj["scoringFormula"] &&
        lastScrollTop < reverseScrollPosObj["dataTable"]
      ) {
        dataTable.classList.add("fade-in");

        satelliteImages.classList.remove("fade-in");
        scoringFormula.classList.remove("fade-in");
        return;
      }

      if (
        lastScrollTop >= reverseScrollPosObj["satelliteImages"] &&
        lastScrollTop > reverseScrollPosObj["dataTable"]
      ) {
        satelliteImages.classList.add("fade-in");

        dataTable.classList.remove("fade-in");
        scoringFormula.classList.remove("fade-in");
      }
    };

    let lastScrollTop =
      leftContainerContent?.getBoundingClientRect().top + window.innerHeight;

    function handleScroll() {
      const scrollTopPosition =
        leftContainerContent.getBoundingClientRect().top + window.innerHeight;

      if (scrollTopPosition > lastScrollTop) {
        handleReverseScroll();
      } else if (scrollTopPosition < lastScrollTop) {
      }

      lastScrollTop = scrollTopPosition;
    }

    const setupScrollListenerForLastSection = () => {
      const handler = (e) => {
        // This function will be used to get the positions at which each item on the right is displayed
        handleScroll();

        if (
          simplifyText.getBoundingClientRect().y <
            window.innerHeight - simplifyText.offsetHeight &&
          simplifyText.getBoundingClientRect().y > 0
        ) {
          firstOverlayContainer.classList.add("simplify-fade-in");
        } else if (
          Math.round(simplifyText.getBoundingClientRect().y) >=
            window.innerHeight &&
          lastSectionParallaxActive
        ) {
          satelliteImages.classList.remove("fade-in");

          firstOverlayContainer.classList.remove("simplify-fade-in");

          lastSectionParallaxActive = false;

          leftContainer.style.overflowY = "hidden";

          leftContainer.style.overscrollBehavior = "initial";

          leftContainer.removeEventListener("scroll", handler);

          window.scrollTo(window.scrollX, window.scrollY - 10);
        }

        showOrHideSatelliteImages(e);

        showOrHideDataTable(e);
      };

      leftContainer.addEventListener("scroll", handler);
    };

    const handleLastSectionParallax = () => {
      if (endOfPageReached() && !lastSectionParallaxActive) {
        lastSectionParallaxActive = true;

        leftContainer.style.overflowY = "scroll";
        leftContainer.style.overscrollBehavior = "contain";

        firstOverlayContainer.classList.add("w-102vw");

        setupScrollListenerForLastSection();
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

    let initialPos = Math.abs(
      leftContainerContent.getBoundingClientRect().y -
        window.scrollY +
        innerHeight
    );

    const lastSectionMobileScrollHandler = () => {
      let currentPos =
        leftContainerContent.getBoundingClientRect().y +
        innerHeight +
        initialPos;

      // Condition required to show first overlay container
      if (leftContainerContent.getBoundingClientRect().y < innerHeight / 3) {
        firstOverlayContainer.classList.add("simplify-fade-in");
      }

      if (currentPos >= window.scrollY && lastSectionParallaxActive) {
        firstOverlayContainer.classList.remove("simplify-fade-in");

        lastSectionParallaxActive = false;

        leftContainer.style.overflowY = "clip";
        leftContainer.style.height = "100%";
        leftContainer.style.overscrollBehavior = "initial";

        leftContainer.removeEventListener(
          "scroll",
          lastSectionMobileScrollHandler
        );

        window.scrollTo(0, window.scrollY - 20);
      }

      if (
        scoringFormula.getBoundingClientRect().y <=
          innerHeight - scoringFormula.offsetHeight &&
        paragraphThreeMobile.getBoundingClientRect().y <= innerHeight
      ) {
        // handle the background fade in after scoring formula section
        paragraphThreeMobile.style.marginBottom =
          (window.innerHeight - paragraphThreeMobile.offsetHeight) / 2 + "px";

        // Fade out left container (This is the container for all elements being scrolled in the footer)
        leftContainer.classList.add("fade-out-animation");

        // Fade in new background
        footerBgTwoMobile.classList.add("fade-in-footer-bg-two");

        // Fade out overlay
        firstOverlayContainer.classList.remove("simplify-fade-in");
      }

      if (
        paragraphThreeMobile.getBoundingClientRect().y <
        window.innerHeight - window.innerHeight * 0.6
      ) {
        firstOverlayContainer.classList.add("simplify-fade-in");

        // firstOverlayContainer.classList.add("fade-in-important");
      }
    };

    window.addEventListener("scroll", (e) => {
      showAnimatedChart();

      // handle mobile view on scroll
      if (isMobileView() && endOfPageReached() && !lastSectionParallaxActive) {
        lastSectionParallaxActive = true;

        leftContainer.style.overflowY = "scroll";
        leftContainer.style.height = "inherit";
        leftContainer.style.overscrollBehavior = "contain";

        leftContainer.addEventListener(
          "scroll",
          lastSectionMobileScrollHandler
        );
      }

      // For last section of the page
      if (!lastSectionParallaxActive && isDesktopView()) {
        handleLastSectionParallax();
      }
      // End for last section of the page

      // Fade section three into view
      if (window.innerHeight / 2 >= sectionThreeBg.getBoundingClientRect().y) {
        //sectionThreeBgOverlay.classList.add("fade-in");

        sectionThreeBg.classList.add("fade-in");
      }

      // show parallax for section three by removing overlay
      if (
        secondParagraph.getBoundingClientRect().y - 100 <
        (window.innerHeight - secondParagraph.offsetHeight) / 2
      ) {
        sectionThreeBgOverlay.classList.remove("fade-in");
      }
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
        const barOverlays = document.querySelectorAll(
          ".section-four__chart-canvas-overlay"
        );

        barOverlays.forEach((overlay, index) => {
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
        const chart = new Chart(
          document.getElementById(horizontalBarChart.id),
          {
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
          }
        );

        //setChartHeightAndWidth(chart);

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

    document.body.style.width = window.innerWidth;
  });
})();
