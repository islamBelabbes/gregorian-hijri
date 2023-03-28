const date_convert = () => {
  // form valid //
  // Get references to the day and month dropdowns
  var dayDropdown = document.getElementById("gen-dd");
  var monthDropdown = document.getElementById("gen-mm");
  // Add a change event listener to the month dropdown
  monthDropdown.addEventListener("change", function () {
    // Get the selected month value
    var selectedMonth = this.value;

    // Clear the day dropdown options
    dayDropdown.innerHTML = "";

    // Create a new option for the day dropdown to show the default text
    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.hidden = true;
    defaultOption.text = "اليوم";
    dayDropdown.appendChild(defaultOption);

    // Determine the maximum number of days for the selected month
    var maxDays;
    if (selectedMonth == "02") {
      // February has 28 days by default, unless it's a leap year
      var year = new Date().getFullYear();
      maxDays = year % 4 == 0 && (year % 100 != 0 || year % 400 == 0) ? 29 : 28;
    } else if (
      selectedMonth == "04" ||
      selectedMonth == "06" ||
      selectedMonth == "09" ||
      selectedMonth == "11"
    ) {
      // April, June, September, and November have 30 days
      maxDays = 30;
    } else {
      // All other months have 31 days
      maxDays = 31;
    }

    // Add new options to the day dropdown for each day of the selected month
    for (var i = 1; i <= maxDays; i++) {
      var option = document.createElement("option");
      option.value = i < 10 ? "0" + i : i; // Add leading zero for single-digit days
      option.text = i;
      dayDropdown.appendChild(option);
    }
  });
  // tab function //
  const tab = () => {
    const tabs = document.querySelectorAll(".tab");
    const content = document.querySelectorAll("[data-content-div]");
    tabs.forEach((arr_tab) => {
      arr_tab.addEventListener("click", (e) => {
        if (document.querySelector(".result")) {
          document.querySelector(".result").remove();
        }
        tabs.forEach((tab_style) => {
          tab_style.classList.remove("tabSelected");
        });
        e.currentTarget.classList.add("tabSelected");
        content.forEach((content_div) => {
          if (
            content_div.getAttribute("data-content-div") ===
            e.currentTarget.getAttribute("data-content-tab")
          ) {
            content_div.style.display = "flex";
          } else {
            content_div.style.display = "none";
          }
        });
      });
    });
  };
  tab();
  const form_submit = () => {
    const hij_form = document.querySelector("#hij-form");
    const gen_form = document.querySelector("#gen-form");
    [hij_form, gen_form].forEach((form) => {
      form.addEventListener("submit", submit);
    });
  };
  const submit = (e) => {
    e.preventDefault();
    let loding = e.currentTarget.querySelector(".date-convert-submit");
    loding.querySelector("i").style.display = "inline-block";
    loding.disabled = true;
    setTimeout(() => {
      const formData = new FormData(e.target);
      const formProps = Object.fromEntries(formData);
      let formdate;
      let formtype;
      if (formProps["gen-dd"]) {
        formdate = `${formProps["gen-dd"]}-${formProps["gen-mm"]}-${formProps["gen-yy"]}`;
        formtype = "gen";
      } else {
        formdate = `${formProps["hij-dd"]}-${formProps["hij-mm"]}-${formProps["hij-yy"]}`;
        formtype = "hij";
      }
      fetchdata(formdate, formtype)
        .then((form_data) => {
          display(form_data, formtype);
          loding.querySelector("i").style.display = "none";
          loding.disabled = false;
        })
        .catch((error) => {
          console.log(error);
          alert("حصل خطا ما نرجو منك التاكد من ادخال تاريخ صحيح");
          loding.querySelector("i").style.display = "none";
          loding.disabled = false;
        });
    }, 2000);
  };
  const fetchdata = (date, type) => {
    let url;
    if (type === "gen") {
      url = `https://api.aladhan.com/v1/gToH/${date}`;
    } else {
      url = `http://api.aladhan.com/v1/hToG/${date}`;
    }
    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (type === "gen") {
          return {
            cunt: date,
            res: data.data.hijri,
          };
        } else {
          return {
            cunt: date,
            res: data.data.gregorian,
          };
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const display = (source, type) => {
    if (document.querySelector(".result")) {
      document.querySelector(".result").remove();
    }
    const template = document.querySelector("[data-result]");
    const templte_content = template.content.cloneNode(true).children[0];
    // //
    templte_content.querySelector(
      ".final-result h1:nth-of-type(1)"
    ).textContent = `${type === "gen" ? "التاريخ الهجري" : "التاريخ الميلادي"}`;
    // //

    templte_content.querySelector(
      "[data-final-date-text]"
    ).textContent = `${toArabicWord(source.res.day)} من شهر
    
    ${source?.res?.month?.ar || source.res.month.en} عام ${toArabicWord(
      source.res.year
    )}`;
    // //
    templte_content.querySelector("[data-current]").textContent = source.cunt
      .split("-")
      .reverse()
      .join("-");
    // //
    // templte_content
    //   .querySelector("[data-final-date-full]")
    //   .setAttribute("dir", `${source.res.month.ar ? "rtl" : "ltr"}`);
    // //
    templte_content.querySelector("[data-final-date]").textContent =
      source.res.date.split("-").reverse().join("-");
    // //
    if (type === "hij") {
      // templte_content
      // .querySelector("[data-final-date-full]")
      // .setAttribute("data-tran", source.res.month.en);
      [...templte_content.querySelectorAll("[data-tran]")].forEach((item) => {
        item.setAttribute("data-tran", source.res.month.en);
      });
    }

    // //
    templte_content.querySelector("[data-final-date-full]").textContent = `${
      source.res.day
    } ${source?.res?.month?.ar || source.res.month.en} ${source.res.year}`;
    // //

    document
      .querySelector(".date-converter-section")
      .appendChild(templte_content);
    translate();
  };

  form_submit();
};
date_convert();
