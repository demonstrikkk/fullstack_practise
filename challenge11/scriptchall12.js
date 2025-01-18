function factorial(x) {
    if (x === 0 || x === 1) {
        console.log(1); // Factorial of 0 or 1 is 1
        return;
    }

    let result = 1; // Start with 1 as the base of multiplication
    while (x > 1) {
        result *= x; // Multiply the current value of x with result
        x -= 1;      // Decrement x
    }

    console.log(result); // Output the factorial
}

// Test cases
factorial(1); // Output: 1
factorial(2); // Output: 2
factorial(5); // Output: 120
factorial(7); // Output: 5040
factorial(9); // Output: 362880
