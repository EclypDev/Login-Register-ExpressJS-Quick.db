function generateNumericId(number) {
    const min = 1;
    const max = number;
    let numericId = '';
  
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      numericId += randomNumber.toString();
    }
  
    return parseInt(numericId);
  }

  export { generateNumericId }