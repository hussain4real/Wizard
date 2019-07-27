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
const { street: st, city: c, country: cty } = address;

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

class Person {
  constructor(name) {
    this.name = name;
  }

  walk() {
    console.log('what is ur own', this);
  }
}
const person = new Person('Elhussain');
console.log(person.name);
