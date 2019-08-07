const supportedCards = {
  visa,
  mastercard,
};

const countries = [
  {
    code: 'US',
    currency: 'USD',
    currencyName: '',
    country: 'United States',
  },
  {
    code: 'NG',
    currency: 'NGN',
    currencyName: '',
    country: 'Nigeria',
  },
  {
    code: 'KE',
    currency: 'KES',
    currencyName: '',
    country: 'Kenya',
  },
  {
    code: 'UG',
    currency: 'UGX',
    currencyName: '',
    country: 'Uganda',
  },
  {
    code: 'RW',
    currency: 'RWF',
    currencyName: '',
    country: 'Rwanda',
  },
  {
    code: 'TZ',
    currency: 'TZS',
    currencyName: '',
    country: 'Tanzania',
  },
  {
    code: 'ZA',
    currency: 'ZAR',
    currencyName: '',
    country: 'South Africa',
  },
  {
    code: 'CM',
    currency: 'XAF',
    currencyName: '',
    country: 'Cameroon',
  },
  {
    code: 'GH',
    currency: 'GHS',
    currencyName: '',
    country: 'Ghana',
  },
];

const billHype = () => {
  const billDisplay = document.querySelector('.mdc-typography--headline4');
  if (!billDisplay) return;

  billDisplay.addEventListener('click', () => {
    const billSpan = document.querySelector('[data-bill]');
    if (
      billSpan &&
      appState.bill &&
      appState.billFormatted &&
      appState.billFormatted === billSpan.textContent
    ) {
      window.speechSynthesis.speak(
        new SpeechSynthesisUtterance(appState.billFormatted)
      );
    }
  });
};

const appState = {};

const formatAsMoney = (amount, buyerCountry) => {
  /* let country = country.find((country)=>{
			  return country.country===buyerCountry
		  });
		  if(country===undefined){
			  country=country.find((country)=>{
				  return country.country="United State"
			  });
		  };
		  const currency=country.currency;
		  const code=country.code;
		  return amount.toLocaleString ('en-${code}', {style: 'currency', currency:currency}) */
  const country = countries.find(country => country.country === buyerCountry);

  if (country) {
    return amount.toLocaleString(`en-${country.code}`, {
      style: 'currency',
      currency: country.currency,
    });
  }
  return amount.toLocaleString(`en-${countries[0].code}`, {
    style: 'currency',
    currency: countries[0].currency,
  });
};

const flagIfInvalid = (field, isValid) => {
  if (isValid === true) {
    field.classList.remove('is-invalid');
  } else {
    field.classList.add('is-invalid');
  }
};

const expiryDateFormatIsValid = field => {
  if (/^[\d]{1,}\/[\d]{2}$/.test(field.value)) {
    return true;
  }
  return false;
};

const detectCardType = first4Digits => {
  const firstDigit = first4Digits[0];
  const cardType =
    firstDigit == 4 ? 'is-visa' : firstDigit == 5 ? 'is-mastercard' : '';
  const creditCard = document.querySelector('[data-credit-card]');
  const cardTypeField = document.querySelector('[data-card-type]');
  if (cardType === 'is-visa') {
    creditCard.classList.add('is-visa');
    creditCard.classList.remove('is-mastercard');
    cardTypeField.src = supportedCards.visa;
  } else if (cardType === 'is-mastercard') {
    creditCard.classList.add('is-mastercard');
    creditCard.classList.remove('is-visa');
    cardTypeField.src = supportedCards.mastercard;
  } else {
    creditCard.classList.remove('is-mastercard');
    creditCard.classList.remove('is-visa');
    cardTypeField.src = 'https://placehold.it/120x60.png?text=Card';
  }
  return cardType;
};

const validateCardExpiryDate = () => {
  const field = document.querySelector('[data-cc-info] input:nth-child(2)');
  console.log(field);
  const [month, year] = field.value.split('/');
  console.log(field.value.split('/'));
  const expiryDate = new Date(`20${year}/${month}`);
  const now = new Date();
  const isValid = expiryDateFormatIsValid(field) && expiryDate > now;
  flagIfInvalid(field, isValid);
  return isValid;
};

const validateCardHolderName = () => {
  const name = document.querySelector('[data-cc-info] input:nth-child(1)');
  const isValid = /^[a-zA-Z]{3,30} [a-zA-Z]{3,30}$/.test(name.value);
  flagIfInvalid(name, isValid);
  return isValid;
};

const validateCardNumber = () => {
  const cardInputs = appState.cardDigits.flat(Infinity);
  const isValid = validateWithLuhn(cardInputs);
  if (isValid) {
    document
      .querySelector('div[data-cc-digits]')
      .classList.remove('is-invalid');
  } else {
    document.querySelector('div[data-cc-digits]').classList.add('is-invalid');
  }
  return isValid;
};

const validatePayment = () => {
  validateCardNumber();
  validateCardHolderName();
  validateCardExpiryDate();
};

const acceptCardNumbers = (event, fieldIndex) => {};
Object.defineProperty(acceptCardNumbers, 'name', { value: 'smartInput' });

const smartInput = (event, fieldIndex, fields) => {
  const e = event.key;
  const validCharacters =
    e == 'Backspace' ||
    e == 'Tab' ||
    e == 'Shift' ||
    e == 'ArrowUp' ||
    e == 'ArrowDown' ||
    e == 'ArrowRight' ||
    e == 'ArrowLeft';
  if (fieldIndex < 4) {
    if (!isFinite(e) && !validCharacters) {
      event.preventDefault();
    } else {
      const cardInputsField = document.querySelector(
        `[data-cc-digits] input:nth-child(${fieldIndex + 1})`
      );
      const cardValue = cardInputsField.value;
      const firstField = document.querySelector(
        '[data-cc-digits] input:nth-child(1)'
      ).value.length;
      if (appState.cardDigits[fieldIndex] == undefined && isFinite(e)) {
        appState.cardDigits[fieldIndex] = [];
        appState.cardDigits[fieldIndex].push(e);
        const digits = appState.cardDigits[0];
        detectCardType(digits);
      } else if (isFinite(e)) {
        appState.cardDigits[fieldIndex].push(e);
      }
      setTimeout(() => {
        if (fieldIndex < 3 && isFinite(e)) {
          cardInputsField.value = cardInputsField.value.substr(
            0,
            cardValue.length
          );
          cardInputsField.value += '#';
        }
        if (fieldIndex == 0) {
          detectCardType(appState.cardDigits[0]);
        }
      }, 500);
      smartCursor(event, fieldIndex, fields);
    }
  } else if (fieldIndex == 4) {
    if (!validCharacters && !/^[a-zA-Z]$/.test(e) && event.code != 'Space') {
      event.preventDefault();
    } else {
      smartCursor(event, fieldIndex, fields);
    }
  } else if (fieldIndex == 5) {
    if (!validCharacters && !/^[0-9/]$/.test(e)) {
      event.preventDefault();
    } else {
      smartCursor(event, fieldIndex, fields);
    }
  }
};

const smartCursor = (event, fieldIndex, fields) => {
  if (fields[fieldIndex].value.length == fields[fieldIndex].size) {
    if (fieldIndex < fields.length - 1) {
      fields[fieldIndex + 1].focus();
    }
  }
};

const enableSmartTyping = () => {
  const cardInputOne = document.querySelector(
    '[data-cc-digits] input:nth-child(1)'
  );
  const cardInputTwo = document.querySelector(
    '[data-cc-digits] input:nth-child(2)'
  );
  const cardInputThree = document.querySelector(
    '[data-cc-digits] input:nth-child(3)'
  );
  const cardInputFour = document.querySelector(
    '[data-cc-digits] input:nth-child(4)'
  );
  const nameField = document.querySelector('[data-cc-info] input:nth-child(1)');
  const dateField = document.querySelector('[data-cc-info] input:nth-child(2)');
  const fields = [
    cardInputOne,
    cardInputTwo,
    cardInputThree,
    cardInputFour,
    nameField,
    dateField,
  ];
  fields.forEach((field, index, fields) => {
    field.addEventListener('keydown', event => {
      smartInput(event, index, fields);
    });
  });
};

const validateWithLuhn = digits => {
  let sum = digits[digits.length - 1];
  const nDigits = digits.length;
  const parity = nDigits % 2;
  for (i = 0; i < nDigits - 1; i++) {
    digit = digits[i];
    if (i % 2 == parity) {
      digit *= 2;
    }
    if (digit > 9) {
      digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const uiCanInteract = () => {
  const firstInputElement = document.querySelector(
    '[data-cc-digits]>input:nth-child(1)'
  );
  const payBtn = document.querySelector('[data-pay-btn]');
  payBtn.addEventListener('click', validatePayment);
  firstInputElement.focus();
  billHype();
  enableSmartTyping();
};

const displayCartTotal = ({ results }) => {
  const [data] = results;
  const { itemsInCart, buyerCountry } = data;
  appState.items = itemsInCart;
  appState.country = buyerCountry;
  appState.bill = itemsInCart.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  appState.billFormatted = formatAsMoney(appState.bill, appState.country);
  const dataBill = document.querySelector('span[data-bill]');
  dataBill.textContent = appState.billFormatted;
  // document.querySelector('span[data-bill]').textContent = appState.billFormatted;
  appState.cardDigits = [];
  uiCanInteract();
};

const fetchBill = () => {
  const apiHost = 'https://randomapi.com/api';
  const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
  const apiEndpoint = `${apiHost}/${apiKey}`;
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      displayCartTotal(data);
    })
    .catch(err => {
      console.error(err);
    });
};

const startApp = () => {
  fetchBill();
};

startApp();
