/* const result = number => number * number;
console.log(result(2));

const person = {
  walk() {
    setTimeout(() => {
      console.log('this', this);
    }, 10000);
  },
};
person.walk();

// Array mapping
const colors = ['red', 'green', 'blue'];
const item = colors.map(color => `<li>${color}</li>`);
console.log(item);

// Object destructuring
const address = {
  street: '',
  city: '',
  country: '',
};
const { street, city, country } = address;

// Spread operator on Array
const first = [1, 2, 3, 4];
const second = [7, 8, 9, 10];

const combined = first.concat(second);
console.log(combined);

const combine = [...first, 5, 6, ...second];
console.log(combine);

// Spread operator on object
const firstName = { name: 'aminu' };
const surname = { sur: 'hussain' };

const added = { ...firstName, ...surname };
console.log(added); */

// function sendCars(...carId) {
// carId.forEach(id => console.log(id));
// }
// sendCars('monday', 5, 8, 6, 7);

const numbers = [2, 3, 5, 6];
const [firstNumber, ...restNumber] = numbers;
console.log(firstNumber);
console.log(restNumber);

class Car {
  constructor(maxSpeed, driver) {
    this.maxSpeed = maxSpeed;
    this.driver = driver;
    this.drive = function(speed, time) {
      console.log(speed * time);
    };
    this.logDriver = function() {
      console.log(`driver name is ${this.driver}`);
    };
  }
}
const myCar = new Car(40, 'Hussain');
myCar.drive(50, 5);

const newCar = new Car(70, 'Aminu');
newCar.drive(20, 2);

const myList = document.getElementsByTagName('a');

for (let index = 0; index < myList.length; index += 1) {
  myList[index].className = `link-${index}`;
}
