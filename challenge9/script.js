
let currentSlide = 0;

function moveSlide(step) {
    const slides = document.querySelectorAll('.topp');
    const totalSlides = slides.length;
    
    currentSlide = (currentSlide + step + totalSlides) % totalSlides; // Circular scroll

    const scrollContainer = document.querySelector('.slider');
    scrollContainer.scrollTo({
        left: slides[currentSlide].offsetLeft,
        behavior: 'smooth'
    });
}
const modal = document.getElementById("movieModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

// Add click event listeners to each movie
document.querySelectorAll('.topp').forEach(movie => {
    movie.addEventListener('click', function() {
        const title = this.querySelector('.move').textContent; // Get the movie title
        const description = "This is a description for " + title; // Example description

        // Set modal content
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        // Show the modal
        modal.style.display = "block";
    });
});

// Close the modal when the user clicks on <span> (x)
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
const scrollblocks = document.querySelectorAll('.blocks');

// Add click event listener to each scroll block
for (let block of scrollblocks) {
    block.addEventListener('click', function () {
        const existingBlocker = block.nextElementSibling?.classList.contains('animate');
        if (existingBlocker) {
            block.nextElementSibling.remove(); // Remove if already present
        } else {
            const blocker = document.createElement('span'); // Create a new span element
            blocker.className = 'blocks animate';

            // Set the content based on the block class
            switch (block.classList[1]) { // Check the second class (e.g., '1', '2', etc.)
                case '1':
                    blocker.innerHTML = `
                        Netflix is a streaming service that offers a wide variety of award-winning TV shows, 
                        movies, anime, documentaries, and more – on thousands of internet-connected devices.
                    `;
                    break;
                case '2':
                    blocker.innerHTML = `
                        You can watch as much as you want, whenever you want, without a single ad – all for one 
                        low monthly price. There's always something new to discover, and new TV shows and movies 
                        are added every week!
                    `;
                    break;
                case '3':
                    blocker.innerHTML = `
                        Enjoy exclusive Netflix Originals, including award-winning shows, movies, documentaries, 
                        and series tailored to your preferences.
                    `;
                    break;
                case '4':
                    blocker.innerHTML = `
                        Netflix lets you download your favorite shows to watch offline on supported devices. 
                        Stay entertained anywhere, anytime!
                    `;
                    break;
                case '5':
                    blocker.innerHTML = `
                        With Netflix, there are no contracts or cancellation fees. Watch what you love and cancel 
                        anytime if you decide Netflix isn’t for you.
                    `;
                    break;
                case '6':
                    blocker.innerHTML = `
                        Netflix offers a personalized experience by recommending content based on your watching 
                        habits and preferences.
                    `;
                    break;
                default:
                    blocker.innerHTML = `Default content for this block.`;
            }

            // Insert the blocker after the clicked block
            block.insertAdjacentElement('afterend', blocker);
        }
    });
}

