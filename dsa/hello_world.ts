import * as readlineSync from 'readline-sync';

// Nhập vào một số từ người dùng
const number: number = readlineSync.questionInt('Nhập vào một số: ');

// In ra số đã nhập
console.log(`Số bạn đã nhập là: ${number}`);
