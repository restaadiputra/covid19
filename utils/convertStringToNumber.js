module.exports = stringValue => {
  let validatedNumber = parseInt(stringValue);
  validatedNumber = Number.isInteger(validatedNumber) ? validatedNumber : 0;
  return validatedNumber;
};
