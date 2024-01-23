(() => {
  $(document).ready(() => {
    // Read more button click setup
    const readMoreBtn = document.querySelector("#read-more-btn");
    readMoreBtn.addEventListener("click", (e) => {
      document
        .querySelector(".first-section")
        .scrollIntoView({ behavior: "smooth" });
    });
    // End read more button click

    // Line chart setup
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
    const simplifyContainer = document.querySelector(".simplify-container");
    const simplifyText = document.querySelector(".simplify-text");
    const simplifyTextPos = simplifyText.getBoundingClientRect().y;
    // End last section page parallax

    const handleLastSectionParallax = () => {
      if (window.scrollY >= lastSectionContainerPos) {
        // Disable scrolling on the body
        document.body.style.height = "100%";
        document.body.style.overflowY = "hidden";
        lastSectionContainer.style.overflowY = "scroll";
      } else {
        document.body.style.height = "auto";
        document.body.style.overflowY = "auto";
      }

      if (window.scrollY >= simplifyTextPos) {
        if (simplifyContainer.classList.contains("simplify-fade-in")) return;
        simplifyContainer.classList.add("simplify-fade-in");
      }
    };

    window.addEventListener("scroll", (e) => {
      // For last section of the page
      handleLastSectionParallax();
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
      if (window.scrollY - 50 >= sectionThreeBgPos) {
        if (sectionThreeBg.classList.contains("bg-map")) return;

        sectionThreeBg.scrollIntoView({ behavior: "smooth" });
        sectionThreeBg.classList.add("bg-map");
      }
      // End for background transition opacity
    });

    // End first parallax section

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
          aspectRatio: 5,
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
              display: false,
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

    // UAE rank counter
    let counts = setInterval(UAERankCounter);
    let upto = 0;
    function UAERankCounter() {
      let count = document.querySelector(".country-rank-counter");
      count.innerHTML = ++upto;
      if (upto === 87) {
        clearInterval(counts);
      }
    }
    // End UAE rank counter

    // End Business data chart

    // Dubai dataset chart
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
  });
})();
