
// PIXEL PULSE - PART 3
// Image search with loading, empty and error states


// 1. Get HTML elements
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");
const resultCount = document.getElementById("resultCount");
const emptyState = document.querySelector(".empty-state");


// 2. Listen for form submission
searchForm.addEventListener("submit", async function(event) {

    // Prevent page reload
    event.preventDefault();

    // Read search query
    const query = searchInput.value.trim();

    // Ignore empty searches
    if (query === "") {
        return;
    }

    // Clear previous results
    results.innerHTML = "";

    // Hide empty state
    emptyState.style.display = "none";

    // PART 3: Loading state
    resultCount.textContent = "Searching... Please wait.";

    // Disable button while searching
    searchButton.disabled = true;
    searchButton.textContent = "Searching...";


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

        // Keep results with image URLs
        const images = pages.filter(function(page) {
            return page.imageinfo && page.imageinfo[0];
        });


        // 5. Check for empty results
        if (images.length === 0) {

            resultCount.textContent =
                "No results found for \"" + query + "\"";

            emptyState.style.display = "block";

            emptyState.querySelector("h2").textContent =
                "No images found!";

            emptyState.querySelector("p").textContent =
                "Try another search topic.";

            return;
        }


        // 6. Display result count
        resultCount.textContent =
            "Showing " + images.length +
            " results for \"" + query + "\"";


        // Hide empty state
        emptyState.style.display = "none";


        // 7. Create image cards
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

            // Create title
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

        // PART 3: Error state
        console.error("Image search error:", error);

        resultCount.textContent =
            "Something went wrong. Please try again.";

        emptyState.style.display = "block";

        emptyState.querySelector("h2").textContent =
            "Oops! Something went wrong.";

        emptyState.querySelector("p").textContent =
            "Please check your internet connection and try again.";

    } finally {

        // Enable button after search finishes
        searchButton.disabled = false;
        searchButton.textContent = "Search";

    }

});
