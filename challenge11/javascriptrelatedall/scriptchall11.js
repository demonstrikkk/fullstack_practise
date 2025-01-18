// with the help of array
function adjective() {
    return ['crazy', 'amazing', 'fire'];
}

function shop_name() {
    return ['engine', 'foods', 'garments'];
}

function another_word() {
    return ['bros', 'limited', 'hub'];
}

function generate() {
    // Helper function to select a random element from an array
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    const random = 
        getRandomElement(adjective()) + " " + 
        getRandomElement(shop_name()) + " " + 
        getRandomElement(another_word());
    
    console.log(random);
}

generate();
generate();

// without the help of array
function adjective() {
    const random = Math.floor(Math.random() * 3); // Generates 0, 1, or 2
    if (random === 0) return 'crazy';
    else if (random === 1) return 'amazing';
    else return 'fire';
}

function shop_name() {
    const random = Math.floor(Math.random() * 3); // Generates 0, 1, or 2
    if (random === 0) return 'engine';
    else if (random === 1) return 'foods';
    else return 'garments';
}

function another_word() {
    const random = Math.floor(Math.random() * 3); // Generates 0, 1, or 2
    if (random === 0) return 'bros';
    else if (random === 1) return 'limited';
    else return 'hub';
}

function generate() {
    const random = adjective() + " " + shop_name() + " " + another_word();
    console.log(random);
}

generate();
generate();
