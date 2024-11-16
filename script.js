
const base_url = "https://v6.exchangerate-api.com/v6/287aa375ef18f37c91cebfe2/latest"; 

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdown) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update country flag
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

// Fetch and update exchange rates
const updateExchangeRate = async () => {
    let amountInput = document.querySelector(".amount input");
    let amountVal = amountInput.value;

    if (amountVal === "" || isNaN(amountVal) || amountVal <= 0) {
        alert("Please enter a valid positive number");
        return;
    }

    console.log(fromCurr.value, toCurr.value);

    const url = `${base_url}/${fromCurr.value}`; // Base URL + selected "from" currency
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch exchange rate data");

        const data = await response.json();
        const conversionRate = data.conversion_rates[toCurr.value];

        if (!conversionRate) throw new Error("Invalid currency conversion data");

        const finalAmount = (amountVal * conversionRate).toFixed(2);
        msg.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        console.log(`Conversion Rate: 1 ${fromCurr.value} = ${conversionRate} ${toCurr.value}`);
    } catch (error) {
        console.error("Error:", error.message);
        msg.innerText = "Error fetching exchange rate data. Please try again.";
    }
};

// Add event listeners
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});
