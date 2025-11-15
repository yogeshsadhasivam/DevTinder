var x = "20";
function func1() {
  var x = "5";
  alert(this.x);
  function func2() {
    alert(x);
  }
  func2();
}

func1();
// output ??
