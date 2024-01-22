const githubApiUrl = "https://api.github.com/users/";
let currentPage = 1;
let perPage = 10;
let targetUsername = "Raynos ";

$(document).ready(function () {
    getRepositories();
});

function getRepositories() {
    // Display loader while API call is in progress
    $("#repositoriesLoader").show();

    // Make API call to get user's repositories with pagination parameters
    const apiUrl = `${githubApiUrl}${targetUsername}/repos?page=${currentPage}&per_page=${perPage}`;
    $.get(apiUrl)
        .done(function (data) {
            // Process the data and render repositories
            renderRepositories(data);
            console.log(data)
            updatePaginationUI();
        })
        .fail(function (error) {
            alert(`Error: ${error.responseJSON.message}`);
        })
        .always(function () {
            // Hide loader when API call is complete (success or failure)
            $("#repositoriesLoader").hide();
        });
}

function renderRepositories(repositories) {
    const repositoriesDiv = document.getElementById("repositories");
    repositoriesDiv.innerHTML = ""; // Clear previous content

    // if (repositories.length === 0) {
    //     repositoriesDiv.innerHTML = "<p>No repositories found.</p>";
    //     return;
    // }

    // Loop through repositories and render each one
    repositories.forEach(function (repo) {
        const repoDiv = document.createElement("div");
        repoDiv.classList.add("repo-item");
        const languageClass = repo.language ? `language-${repo.language.toLowerCase()}` : '';
        repoDiv.innerHTML = `<p><strong>${repo.name}</strong> - ${repo.description || "No description"} ${repo.url} \n 
        <span class="${languageClass}">${repo.language}</span></p>`;
        repositoriesDiv.appendChild(repoDiv);
    });
}

function updatePaginationUI() {
    // Update current page text
    $("#currentPage").text(`Page ${currentPage}`);
}

function nextPage() {
    // Increment current page and fetch the next page
    currentPage++;
    getRepositories();
}

function prevPage() {
    // Decrement current page (avoid going below 1) and fetch the previous page
    currentPage = Math.max(currentPage - 1, 1);
    getRepositories();
}

function changePerPage() {
    // Update perPage variable and fetch the first page with the new perPage value
    perPage = parseInt($("#perPage").val(), 10);
    currentPage = 1;
    getRepositories();
}
