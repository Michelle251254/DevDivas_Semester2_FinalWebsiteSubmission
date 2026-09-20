console.log("Hello World");
console.log(5);
console.log(4 + 4);
console.log("I am older than" + 18 + "years old");

let text = "This is a string";
console.log(text);

text = "I wanted to change the value";

let num = 3;
let num2 = 9;
let total;

//if you don't define it, your cod wont work

total = num2 - num;

console.log("total" + total);

let bool = true;
console.log(bool);

let array = ["a", "list", "of", "things"];
console.log(array);
//array could be called something ells

console.log(array[2]);
//it starts counting at 0

let object = {
  //it uses key values
  name: "object",
  //name is a key value
  isUseful: true,
  parts: ["name", "curly brackets", "key value parts", "comma splits"],
  pairs: 4,
};
//you can have allot of key values

console.log(object);
console.log(object.isUseful); //specific pies of info
console.log(object.pairs[1]); //object inside array
//global value can be used throw out the website

//== checks id the values are the same
//=== value and hight
//!= not = to
//!== not = and
//|| one of the two should be bigger the 5
//! no

let age = 18;

if (age >= 18) {
  //code block
  console.log("you are an adult");
} else {
  console.log("Go home, you are a child!!");
}
//if the age is older than 18 it will go with if, but when the age is lower than 18 it will use the else

let int = 10;
let notInt = "10";

if (notInt == 10) {
  console.log("The values are the same");
} else {
  console.log("these values are not the same");
}

num3 = 12;
firstname = "Michelle";

if (num3 >= 14 && firstname == "Michelle") {
  console.log("if is going to show");
} else {
  console.log("the else is going shut");
}
