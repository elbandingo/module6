var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

//form submit handler needed for when the button is pressed, ensuring we capture what is included in the text box
var formSubmitHandler = function(e) {
    e.preventDefault();
    var username = nameInputEl.value.trim();
    console.log(username + " is the username that has been captured by the event listener");

    //if username is typed and captured, send it to the getUserRepos function
    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("please enter a username");
    }
    
}

//function to get the userRepos, passing the value of whats in the text box for the username
var getUserRepos = function(user) {
    //format the github api url to include the user being passed in the function
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make the URL request
    //fetch the API url, then run function to respond and console log the results
    
    fetch(apiUrl).then(function(response){
        if(response.ok){
        response.json().then(function(data){
            displayRepos(data, user);
        });
    } else {
        alert("Error: GitHub User not Found!");
    }
    });
    
    
    
};

var displayRepos = function(repos, searchTerm) {
//if there are no repos passed from the getUserRepos function, then we want to return an element saying none found

if (repos.length === 0) {
    repoContainerEl.textContent = "No Repositories Found.";
    return;
}

    //clear the old content
    repoContainerEl.textContent = "";
    //set the value in the SPAN to equal the username that was searched with
    repoSearchTerm.textContent = searchTerm;

    //loop over the repos value which is passed as an argument from the fetch
    for(var i = 0; i < repos.length; i++) {
        //format the repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create the container for the repo about to be listed inside
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //create the span content that will fill the container
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to the container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if the current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class ='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class ='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to the container
        repoEl.appendChild(statusEl);

        //append the container to the DOM
        repoContainerEl.appendChild(repoEl);

    }
};

//run the event listener on submit of the formn
userFormEl.addEventListener("submit", formSubmitHandler)
