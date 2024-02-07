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

    // Background transition opacity for the first parallax section on the page
    const sectionThreeBg = document.querySelector(".section-three-bg");
    const sectionThreeBgOverlay = document.querySelector(
      ".section-three-bg > section:nth-child(1)"
    );
    // End background transition opacity

    // First parallax section
    const firstParagraph = document.querySelector(
      ".section-three-bg > p:nth-child(2)"
    );
    const firstPBottom =
      firstParagraph.offsetHeight + firstParagraph.getBoundingClientRect().y;

    const secondParagraph = document.querySelector(
      ".section-three-bg > p:nth-child(3)"
    );
    const secondParagraphMargin =
      (window.innerHeight - secondParagraph.offsetHeight) / 2;
    secondParagraph.style.marginTop = firstPBottom + secondParagraphMargin;
    secondParagraph.style.marginBottom = secondParagraphMargin;

    const lastParagraph = document.querySelector(
      ".section-three-bg > p:nth-child(4)"
    );
    const lastParagraphMargin =
      (window.innerHeight - lastParagraph.offsetHeight) / 2;
    lastParagraph.style.marginBottom = lastParagraphMargin;
    // End first parallax section

    let firstOverlayContainer;

    if (!isDesktopView()) {
      // document
      // .querySelector(".last-section-container > article:nth-child(2)")
      // .remove();
      firstOverlayContainer = document.querySelector(
        ".last-section-container > section:nth-child(4)"
      );
    } else {
      firstOverlayContainer = document.querySelector(
        ".last-section-container > article:nth-child(2)"
      );
    }

    // Last section page parallax
    const lastSectionContainer = document.querySelector(
      ".last-section-container"
    );

    const lastSectionBgTwo = document.querySelector(
      ".last-section-container > img:nth-child(1)"
    );

    let leftContainer;

    if (isDesktopView()) {
      leftContainer = document.querySelector(
        ".last-section-container > article:nth-child(2) > section:nth-child(1)"
      );
    } else {
      leftContainer = document.querySelector(
        ".last-section-container > section:nth-child(4) > section:nth-child(1)"
      );
    }

    // These settings prevent the left container from being scrollable until the base of the page is reached
    // leftContainer.style.overflowY = "hidden";
    // leftContainer.style.height = "100%";
    // End settings setup

    const leftContainerContent = isMobileView()
      ? leftContainer.querySelector("article:nth-child(1)")
      : document.querySelector(
          ".last-section-container > article:nth-child(2) > section:nth-child(1) > article:nth-child(1)"
        );

    const simplifyText = isMobileView()
      ? leftContainerContent.querySelector("section:nth-child(1)")
      : document.querySelector(
          ".last-section-container > article:nth-child(2) > section:nth-child(1) > article:nth-child(1) > section:nth-child(1)"
        );

    const satelliteImages = document.querySelector(
      ".last-section-container > article:nth-child(2) > section:nth-child(2) > section:nth-child(1)"
    );
    const paragraphTwo = document.querySelector(
      ".last-section-container > article:nth-child(2) > section:nth-child(1) > article:nth-child(1) > section:nth-child(2)"
    );
    const dataTable = document.querySelector(
      ".last-section-container > article:nth-child(2) > section:nth-child(2) > section:nth-child(2)"
    );
    const scoringFormula = document.querySelector(
      ".last-section-container > article:nth-child(2) > section:nth-child(2) > section:nth-child(3)"
    );
    const paragraphThree = document.querySelector(
      ".last-section-container > article:nth-child(2) > section:nth-child(1) > article:nth-child(1) > section:nth-child(3)"
    );

    const footerBgTwoMobile = document.querySelector(
      ".last-section-container > img:nth-child(3)"
    );
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

    function getPageFullHeight() {
      var pageHeight = 0;

      function findHighestNode(nodesList) {
        for (var i = nodesList.length - 1; i >= 0; i--) {
          if (nodesList[i].scrollHeight && nodesList[i].clientHeight) {
            var elHeight = Math.max(
              nodesList[i].scrollHeight,
              nodesList[i].clientHeight
            );
            pageHeight = Math.max(elHeight, pageHeight);
          }
          if (nodesList[i].childNodes.length)
            findHighestNode(nodesList[i].childNodes);
        }
      }

      findHighestNode(document.documentElement.childNodes);
      // The entire page height is found
      // console.log("Page height is", pageHeight);

      return pageHeight;
    }

    const endOfLastSectionParallaxReached = () => {
      return (
        window.scrollY === lastSectionContainer.offsetTop &&
        lastSectionContainer.offsetHeight + lastSectionContainer.offsetTop ===
          getPageFullHeight()
      );
    };

    let initialPos = Math.abs(
      leftContainerContent.getBoundingClientRect().y -
        window.scrollY +
        innerHeight
    );

    const enableBodyScroll = () => {
      document.body.style.height = "initial";
      document.body.style.overflowY = "scroll";
    };

    const disableBodyScroll = () => {
      // Add a scroll event listener to the body
      // document.body.addEventListener("scroll", function (event) {
      //   // Prevent the default scroll behavior
      //   event.preventDefault();
      //   // Optionally, you can also prevent propagation
      //   event.stopPropagation();
      //   // Log a message or perform any other action if needed
      //   // console.log("Scrolling on body is disabled");
      // });
    };

    let simplifyTextInitPosDiff;
    let lastParagraphViewed = false;

    const lastSectionMobileScrollHandler = (e) => {
      if (!simplifyTextInitPosDiff)
        simplifyTextInitPosDiff =
          simplifyText.getBoundingClientRect().y - simplifyText.offsetTop;

      console.log(
        window.innerHeight -
          (paragraphThreeMobile.getBoundingClientRect().y +
            paragraphThreeMobile.offsetHeight)
      );

      // Condition required to show first overlay container
      if (leftContainerContent.getBoundingClientRect().y < innerHeight / 3) {
        firstOverlayContainer.classList.add("simplify-fade-in");
      }

      if (
        simplifyText.getBoundingClientRect().y - simplifyText.offsetTop >
          simplifyTextInitPosDiff &&
        lastSectionParallaxActive
      ) {
        firstOverlayContainer.classList.remove("simplify-fade-in");

        lastSectionParallaxActive = false;

        leftContainer.style.overflowY = "hidden";
        leftContainer.style.height = "100%";
        leftContainer.style.overscrollBehavior = "initial";

        // Enable body scroll
        lastSectionContainer.classList.remove("pin-section");

        leftContainer.removeEventListener(
          "scroll",
          lastSectionMobileScrollHandler
        );

        enableBodyScroll();

        window.scrollTo(0, window.scrollY - 10);
      }

      if (
        scoringFormula.getBoundingClientRect().y <=
          innerHeight - scoringFormula.offsetHeight &&
        paragraphThreeMobile.getBoundingClientRect().y <= innerHeight &&
        !lastParagraphViewed
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
        if (!firstOverlayContainer.classList.contains("simplify-fade-in")) {
          firstOverlayContainer.classList.add("simplify-fade-in");
          // Enable body scroll
          lastSectionContainer.classList.remove("pin-section");
          lastParagraphViewed = true;
        }

        // firstOverlayContainer.classList.add("fade-in-important");
      }

      // Monitors scrollend of the last section parallax
      if (
        lastParagraphViewed &&
        Math.round(
          window.innerHeight -
            (paragraphThreeMobile.getBoundingClientRect().y +
              paragraphThreeMobile.offsetHeight)
        ) === +paragraphThreeMobile.style.marginBottom.slice(0, 3)
      ) {
        // Enable body scroll
        lastSectionContainer.classList.remove("pin-section");

        console.log("removing");
        // Scroll down to the main footer a little
        // window.scrollBy(0, scrollY + innerHeight * 2);
      }
    };

    const pinLastSectionParallax = (entries) => {
      // console.log("attaching");
      entries.forEach((entry) => {
        entry.target.classList.add("pin-section");
        console.log(entries.length);
      });
      lastSectionParallaxActive = true;

      lastSectionContainer.scroll({
        top: 0,
        behavior: "smooth",
      });

      lastSectionContainer.classList.add("pin-section");

      leftContainer.style.overflowY = "scroll";
      leftContainer.style.height = "100vh";
      leftContainer.style.overscrollBehavior = "contain";

      leftContainer.addEventListener("scroll", lastSectionMobileScrollHandler);
    };

    let dubaiChart = document.querySelector("#dubai-dataset-chart");
    let dubaiChartPos = dubaiChart.offsetTop + dubaiChart.offsetHeight;

    // This intersection observer is used to monitor the last section parallax
    const observer = new IntersectionObserver(pinLastSectionParallax, {
      rootMargin: "-100px",
      root: document.querySelector("body"),
    });
    observer.observe(lastSectionContainer);

    window.addEventListener("scroll", (e) => {
      showAnimatedChart();

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

    document.body.style.width = window.innerWidth;
  });
})();
