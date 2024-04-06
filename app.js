const BASE_URL = "https://api.currencylayer.com/convert?access_key=926d1be6e8159f8b0203c8dcb5c2f65e";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = "INR";
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const showRate = document.getElementById('showRate');
// calculating the gst
let fee;
let nc=1500;
let sc=250;

function calculateFee(amount) {
  let fee;
  if (amount < 100000) {
    fee = Math.max(amount * 0.01, 250);
  } else if (amount <= 1000000) {
    fee = 1000 + ((amount - 100000) * 0.005);
  } else {
    fee = Math.min(5500 + (amount - 1000000) * 0.001, 60000);
  }

  return fee;
};

// for (let select of dropdowns) {
//   for (currCode in countryList) {
//     let newOption = document.createElement("option");
//     newOption.innerText = currCode;
//     newOption.value = currCode;
//     if (select.name === "from" && currCode === "INR") {
//       newOption.selected = "selected";
//     } else if (select.name === "to" && currCode === "USD") {
//       newOption.selected = "selected";
//     }
//     select.append(newOption);
//   }

//   select.addEventListener("change", (evt) => {
//     updateFlag(evt.target);
//   });
// }

// Initialize dropdown options with flags
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let countryCode = countryList[currCode];
    let optionText = `${currCode} `;
    let newOption = new Option(optionText, currCode);
    newOption.classList.add("opt");
  
    let flagImg = new Image();
    flagImg.src = `https://wise.com/web-art/assets/flags/${countryCode.toLowerCase()}.svg`;
    flagImg.alt = `${currCode} Flag`;
    flagImg.classList.add("flag-icon");
  
    console.log("Flag URL:", flagImg.src); // Debugging log
    newOption.prepend(flagImg);
    select.append(newOption);
  }
  

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}



const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  
  if (amtVal === "" || amtVal < 1) {
    amtVal = "";
    amount.value = ""; // Corrected to set input value as "1" instead of "0"

  }
  const URL = `${BASE_URL}&from=${fromCurr.value}&to=${toCurr}&amount=${amtVal}`;
 
    let response = await fetch(URL);
    
    let data = await response.json();
    
    let rate = data.result;
    let q=(1/data.info.quote).toFixed(4);
    let cc = fromCurr.value.toUpperCase();
    
    showRate.innerHTML=`1 ${toCurr} = ${q} ${cc}`;
   
    let gst=calculateFee(rate);
    const calculateGST = (gst) => {
      return gst * 0.18; // Assuming GST rate is 18%
    };
    let gstq=calculateGST(gst).toFixed(2);
    document.getElementById('gst').innerText=`${gstq}`;
   
    let finalAmount = (rate+(nc+sc+(gst*0.18))).toFixed(3);
    msg.innerText = `${finalAmount}`;
    
    if (toCurr === "INR" && amtVal > 700000) {
      document.getElementById('notice').classList.remove('hide');
      document.getElementById('notice').innerText = "TCS (tax collection at source) as per tax regime for FY-2024-2025 will be applied on the payment page.";
    } else {
      document.getElementById('notice').classList.add('hide');
      document.getElementById('notice').innerText = "";
    }
};

const updateFee = async () => {
  try {
    const response = await fetch(`${BASE_URL}&from=INR&to=${fromCurr.value}&amount=322.01`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const rate = data.result;
    return 322.01 * rate;
  } catch (error) {
    console.error('Error fetching fee:', error);
    return 0; // Return 0 if fee fetching fails
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://wise.com/web-art/assets/flags/${countryCode.toLowerCase()}.svg`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

amountInput.addEventListener("input", () => {
  updateExchangeRate();
});



