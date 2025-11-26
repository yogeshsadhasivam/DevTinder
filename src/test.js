// var x = "20";
// function func1() {
//   var x = "5";
//   alert(this.x);
//   function func2() {
//     alert(x);
//   }
//   func2();
// }

// func1();
// output ??


// var obj1 = {
//   valueOfThis: function(){
//     return this;
//   }
// }
//  
// var obj2 = {
//   valueOfThis: () => {
//     return this;
//   }
// }
//  
// console.log(obj1.valueOfThis()); 
// console.log(obj2.valueOfThis());

// var x = 23;
//  
// (function(){
//   var x = 43;
//  
//   (function random(){
//     x++;
//     
//     var x = 21;
//     console.log(x);
//   })();
// })();

console.log(global);