const lan = {
  ar: {
    January: "كانون الثاني",
    February: "شباط",
    March: "اذار",
    April: "نيسان",
    May: "ايار",
    June: "حزيران",
    July: "تموز",
    August: "اب",
    September: "ايلول",
    October: "تشرين الاول",
    November: "تشرين الثاني",
    December: "كانون الاول",
  },
};
const translate = () => {
  const target = document.querySelectorAll("[data-tran]");
  if (target[0].getAttribute("data-tran") === "") return;
  target.forEach((lang) => {
    const targetattr = lang.dataset.tran;
    lang.textContent = lang.textContent.replace(
      targetattr,
      lan["ar"][targetattr]
    );
  });
};
