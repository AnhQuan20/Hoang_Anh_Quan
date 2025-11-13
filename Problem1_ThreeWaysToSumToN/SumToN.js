// Please cd to current folder
// then run node SumToN.js 
const sum_to_n_a = (n) => {
  n = Math.abs(n)
  let sum = 0;
  for(let i = 1; i <= n; i++){
    sum += i;
  }
  return sum
};

const sum_to_n_b = (n) => {
  n = Math.abs(n)
  return (n * (n + 1)) / 2
};

const sum_to_n_c = (n) => {
  n = Math.abs(n)
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};

console.log(sum_to_n_a(5.5));
console.log(sum_to_n_b(6));
console.log(sum_to_n_c(7));
