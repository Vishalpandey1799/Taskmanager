
// khelega free fire ?!


// accessing html elements



const inputBox = document.querySelector("form input"); // Selects the input field in the form for the search query
const searchBtn = document.querySelector("form button"); // Selects the button in the form to trigger the search

// dropdown elements
const drop = document.querySelector(".select_part"); // Selects the dropdown container
const selected_dropdown = document.querySelector(".selected"); // Selects the element showing the selected option in the dropdown
const angle_up_down = document.querySelector(".select_part i"); // Selects the icon for the dropdown (used to rotate it)
const dropdown_list = document.querySelector(".dropDown"); // Selects the dropdown options list
const dropdown_options = document.querySelectorAll(".options"); // Selects all the individual options in the dropdown
const allNews = document.querySelector(".news_feed_container"); // Selects the container where news articles will be displayed



// Search functionality
searchBtn.addEventListener("click", (e) => { // Add event listener to the search button
    e.preventDefault(); // Prevent default form submission (refresh)
});

// Dynamic elements creation
const elementCreation = (data) => { // Function to create dynamic elements for each news article
    // Create a parent div for each news article
    const parentElement = document.createElement("div");
    parentElement.classList.add("news");

    // Create a container for the news image
    const image_contain = document.createElement("div");
    image_contain.classList.add("news_img");

    // Create an image element for the news
    const news_image = document.createElement("img");
    news_image.src = data.newsImg; // Set the image source URL from the data
    news_image.loading = "lazy"; // Use lazy loading for the image to improve performance

    image_contain.append(news_image); // Append the image to the container

    // Create a second container for the article text/details
    const secondParent = document.createElement("div");
    secondParent.classList.add("allabout");

    // Create a paragraph for the article headline
    const news_headline = document.createElement("p");
    news_headline.classList.add("news_headline");
    news_headline.textContent = data.title; // Set the headline text

    // Create a container for the source and publication date
    const source_date = document.createElement("div");
    source_date.classList.add("source_date");

    // Create a span for the source name
    const news_source = document.createElement("span");
    news_source.textContent = data.source; // Set the source name

    // Create a span for the published date, formatted to 'MMM DD, YYYY'
    const published_Date = document.createElement("span");
    published_Date.innerHTML = new Date(data.published).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    source_date.append(news_source, published_Date); // Append source and date to the container

    // Create a paragraph for the article description (shortened)
    const description = document.createElement("p");
    description.textContent = data.description; // Set the description text

    // Create a container for the "Read More" link and download icon
    const link_download = document.createElement("div");
    link_download.classList.add("readmore_download");

    // Create an anchor link for "Read More"
    const newsRedirect = document.createElement("a");
    newsRedirect.classList.add("read");
    newsRedirect.target = "_blank"
    newsRedirect.href = data.newsURL; // Set the link to the full article
    newsRedirect.textContent = "Read More"; // Set the text of the link

    // Create a right arrow icon inside the "Read More" link
    const rightArrow = document.createElement("i");
    rightArrow.classList.add("fa-solid", "fa-right-long");

    newsRedirect.append(rightArrow); // Append the arrow icon to the link

    // Create a download icon (functionality not implemented)
    const download = document.createElement("i");
    download.classList.add("fa-solid", "fas", "fa-file-download");
    download.style.cursor = "pointer";

    download.addEventListener("click", () => {
        downloadArticle(data)
    })

    link_download.append(newsRedirect, download); // Append the link and download icon to the container
    secondParent.append(news_headline, source_date, description, link_download); // Append everything to the secondParent div
    parentElement.append(image_contain, secondParent); // Append the image and the secondParent to the parent element






    allNews.append(parentElement); // Append the full article to the news feed container
}


const downloadArticle = (data) => {
    const articleContent = `
        <html>
            <head>
                <title>${data.title}</title>
            </head>
            <body>
                <h1>${data.title}</h1>
                <img src="${data.newsImg}" alt="news image" />
                <p><strong>Source:</strong> ${data.source}</p>
                <p><strong>Published:</strong> ${new Date(data.published).toLocaleDateString()}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Link:</strong> <a href="${data.newsURL}" target="_blank">${data.newsURL}</a></p>
            </body>
        </html>
    `;

    const blob = new Blob([articleContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${data.title}.html`; // Name the file after the title of the news article
    link.click(); // Simulate a click to trigger the download
}


// Fetch news from the API
const random = [
    "sport",
    "technology",
    "crypto",
    "samsung",
    "politics",
    "business",
    "entertainment",
    "health",
    "science",
    "travel",
    "education",
    "fashion",
    "food",
    "music",
    "environment",
];
// Array of random categories for fetching news



const newsApi = async (searchvalue) => { // Asynchronous function to fetch news articles
    const API_KEY = "49c68f2353614544bec1054eda825944"; // Your API key for the NewsAPI
    let api;
    const randomIndex = Math.floor(Math.random() * random.length); // Randomly select an index from the random categories
    console.log(randomIndex)
    // If the search value exists, construct the API URL with the search term
    if (searchvalue) {
        api = `https://newsapi.org/v2/everything?q=${searchvalue}&apiKey=${API_KEY}&pageSize=12`;
    } else {
        // If no search term is provided, fetch news based on a random category
        api = `https://newsapi.org/v2/everything?q=${random[randomIndex]}&apiKey=${API_KEY}&pageSize=12`;
    }

    try {
        const fetching = await fetch(api); // Fetch the data from the NewsAPI
        const response = await fetching.json(); // Parse the response as JSON
        allNews.innerHTML = "";
        // If articles are returned in the response
        if (response.articles) {
            // Filter the articles to ensure that required fields are not null
            const filteredArticles = response.articles.filter(article => {
                return (
                    article.author !== null &&
                    article.description !== null &&
                    article.source.name !== null &&
                    article.title !== null &&
                    article.url !== null &&
                    article.urlToImage !== null &&
                    article.publishedAt !== null
                );
            });

            // Clear any previous articles in the news feed

            // Loop through the filtered articles and create elements for each one
            filteredArticles.forEach(article => {
                const newsData = {
                    author: article.author,
                    title: article.title,
                    source: article.source.name,
                    newsURL: article.url,
                    newsImg: article.urlToImage,
                    published: article.publishedAt,
                    description: article.description.slice(0, 100) + " ReadMore...", // Truncate description for display
                };

                elementCreation(newsData); // Call the function to create and display each news article
            });
        }
    } catch (error) {
        console.error(error); // Log any errors that occur during the API request
    }
};

// Initial call to fetch news without any search term (random topic)
newsApi();

// Search functionality on button click
searchBtn.addEventListener("click", (e) => { // Add event listener for the search button
    e.preventDefault(); // Prevent default form submission
    let searchvalue = inputBox.value.trim(); // Get the search query value
    newsApi(searchvalue); // Call the news API with the search term
});