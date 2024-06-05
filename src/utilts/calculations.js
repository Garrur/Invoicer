const calculateNetAmount = (unitPrice, quantity, discount) => {
    return unitPrice * quantity - discount;
};

const calculateTax = (netAmount, taxRate) => {
    return netAmount * (taxRate / 100);
};

const amountToWords = (amount) => {
    // Implementation for converting amount to words
    return "One Thousand Only"; // Placeholder implementation
};

module.exports = {
    calculateNetAmount,
    calculateTax,
    amountToWords
};
