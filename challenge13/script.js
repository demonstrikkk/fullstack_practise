



function card_builder(title, image, cName, views, monthold, duration, link = '#') {
    // Format views properly
    if (views >= 10000000) {
        views = (views / 10000000).toFixed(1) + "B"; // Billions
    } else if (views >= 1000000) {
        views = (views / 1000000).toFixed(1) + "M"; // Millions
    } else if (views >= 1000) {
        views = (views / 1000).toFixed(1) + "k"; // Thousands
    } else {
        views = views.toString();
    }

    // Find the existing black box container
    const blackBox = document.querySelector('.black');

    // Update the image
    const photoContainer = blackBox.querySelector('.photo_add');
    photoContainer.innerHTML = `<img src="${image}" alt="${title}" width="100px">`;

    // Update the title
    const titleContainer = blackBox.querySelector('.text a');
    titleContainer.href = link;
    titleContainer.textContent = title;

    // Update channel name
    const channelContainer = blackBox.querySelector('.channel_name h6');
    channelContainer.textContent = cName;

    // Update views
    const viewsContainer = blackBox.querySelector('.views-digit h6');
    viewsContainer.textContent = views;

    // Update time since posted
    const timeContainer = blackBox.querySelector('.numeral-time h6');
    timeContainer.textContent = monthold;

    // Update duration
    const durationContainer = blackBox.querySelector('.duration');
    durationContainer.textContent = duration;
    console.log('working properly')
}

// Example Usage
card_builder(
    'Remo Dsouza',
    'premium.png',
    'Dance+',
    20388979,
    '6 years',
    '3:11:20',
    'https://github.com/CodeWithHarry/Sigma-Web-Dev-Course/blob/main/Video%2073/card.png'
);
