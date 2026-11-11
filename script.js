
// PIXEL PULSE - PART 2
// Search images using Wikimedia Commons API

// 1. Get HTML elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const resultCount = document.getElementById("resultCount");
const emptyState = document.querySelector(".empty-state");

// 2. Listen for form submission
searchForm.addEventListener("submit", async function(event) {

    // Stop page reload
    event.preventDefault();

    // Read the search query
    const query = searchInput.value.trim();

    // Ignore empty searches
    if (query === "") {
        return;
    }

    // Clear previous results
    results.innerHTML = "";

    // Hide empty message while searching
    emptyState.style.display = "none";

    resultCount.textContent = "Searching...";

    // 3. Create Wikimedia API URL
    const url =
        "https://commons.wikimedia.org/w/api.php" +
        "?action=query" +
        "&generator=search" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&gsrnamespace=6" +
        "&gsrlimit=20" +
        "&prop=imageinfo" +
        "&iiprop=url" +
        "&iiurlwidth=500" +
        "&format=json" +
        "&origin=*";

    try {

        // 4. Fetch image data
        const response = await fetch(url);

        // Check response
        if (!response.ok) {
            throw new Error("Failed to fetch images");
        }

        // Convert response into JSON
        const data = await response.json();

        // Get image results
        const pages = data.query
            ? Object.values(data.query.pages)
            : [];

        // Keep results that have image URLs
        const images = pages.filter(function(page) {
            return page.imageinfo && page.imageinfo[0];
        });

        // 5. Update result count
        resultCount.textContent =
            "Showing " + images.length +
            " results for \"" + query + "\"";

        // Show empty message if nothing was found
        if (images.length === 0) {
            emptyState.style.display = "block";
            emptyState.querySelector("h2").textContent =
                "No images found";
            emptyState.querySelector("p").textContent =
                "Try searching for another topic.";
            return;
        }

        // 6. Create an image card for every result
        images.forEach(function(image) {

            const imageInfo = image.imageinfo[0];

            // Create card
            const card = document.createElement("div");
            card.className = "image-card";

            // Create image
            const img = document.createElement("img");

            img.src = imageInfo.thumburl || imageInfo.url;
            img.alt = image.title;
            img.loading = "lazy";

            // Create image title
            const title = document.createElement("h3");

            title.textContent = image.title
                .replace("File:", "")
                .replaceAll("_", " ");

            // Add image and title to card
            card.appendChild(img);
            card.appendChild(title);

            // Add card to results grid
            results.appendChild(card);

        });

    } catch (error) {

        resultCount.textContent =
            "Unable to load images. Please try again.";

        emptyState.style.display = "block";

        console.error(error);

    }

});
