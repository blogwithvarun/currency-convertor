const BASE_URL = "https://api.frankfurter.dev/v2/rates";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector("#FROM select");
const toCurr = document.querySelector("#TO select");
const msg = document.querySelector("#result");

for (let select of dropdowns) {
  for (currCode in currencyCountryMap) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name == "from" && currCode == "USD") {
      newOption.selected = "selected";
    } else if (select.name == "to" && currCode == "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = currencyCountryMap[currCode].countryCode;
  let img = element.parentElement.querySelector("img");
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  img.src = newSrc;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  try {
    const URL = `${BASE_URL}/?base=${fromCurr.value}&quotes=${toCurr.value}`;
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    let data = await response.json();

    let rate = data[0].rate;

    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    console.log("Success");
  } catch (Error) {
    console.log(Error);
    msg.innerText = "Error while fetching details.\n Please try again!";
  }
};


btn.addEventListener("click", (evt) => {
  msg.innerText = "";
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  msg.innerText = "";
  updateExchangeRate();
});
