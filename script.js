// TMDB urls for different usecases
const TMDB_API_KEY = 'api_key=9ede1e3342a35f773734da8da1f49ef0';

const TMDB_HOME_URL = `https://api.themoviedb.org/3/discover/movie?${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const TMDB_BEST_R_RATED = '/discover/movie/?certification_country=US&certification=R&sort_by=popularity.desc&';

const TMDB_POPULAR_KIDS_MOVIES = '/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc&';


const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';


// fetching all the dom elements
var movieContainer = document.getElementById('movie-container');
// var rRatedMoviesBtn = document.getElementById('top-r-rated');
var kidsMoviesBtn = document.getElementById('top-kids-rated');
var webLogo = document.getElementById('logo');
var bestMoviesOfYearDropDownMenu = document.getElementById('best-of-year');
var pageHeading = document.getElementById('page-heading');
var myListBtn = document.getElementById('my-list');

var searchInput = document.getElementById('searchMovie');
var wrapperDiv = document.querySelector('.wrapper');
var resultsDiv = document.querySelector('.results');

var prevBtn = document.getElementById('prev-page');
var nextBtn = document.getElementById('next-page');
let pageNo = 1;


// populating best movies according to year dropdown using javascript
for (let year = 2022; year>=2000; year--) {
    var option = document.createElement('option');
    option.text = year;
    option.value = year;
    bestMoviesOfYearDropDownMenu.add(option);
}



// calling function to populate home page 
apiRequestCall(TMDB_HOME_URL);
// pageHeading.innerHTML = 'Best Popular Movies';

// function to make api request
function apiRequestCall(url){
    const xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.send();
    xhr.onload = function() {
        // clearing movie-container before populating the div
        movieContainer.innerHTML = "";
        var res = xhr.response;
        //converting response to json
        var conJson = JSON.parse(res);
        //this array will contain 20 movie objects
        var moviesObjArray = conJson.results;
        //we pass this array to createMovieElement function to create and populate our home page
        moviesObjArray.forEach(movie => createMovieElement(movie));
        addMovieToListButtonArray = document.getElementsByClassName('.add-movie-to-list');
        console.log(addMovieToListButtonArray);
    }
}


// function to create and populate our home page
function createMovieElement(movie){
    // create the movie element and add proper class and HTML content to it
    var movieElement = document.createElement('div');
    movieElement.classList.add('movie-element');
    movieElement.innerHTML = `
        <div class="movie-poster">
            <a href="moviePage.html?id=${movie.id}"><img src= ${TMDB_IMAGE_BASE_URL+movie.poster_path} alt="Movie Poster"></a>
        </div>
        <div class="movie-title">${movie.title}</div>
        <div class="movie-element-tags">
            <div class="movie-rating">
                ${movie.vote_average} <i class="fas fa-star"></i>
            </div>
            <div class="add-movie-to-list"  id="${movie.id}" onclick="addingMovieToList(${movie.id})">
                <i class="fas fa-plus"></i>
            </div>
        </div>
    `;
    // append this newly created child div to the parent movie-container div
    movieContainer.appendChild(movieElement);
}


//each movie element image is an <a> tag which will redirect to movie page with movie name and its rating as query string. This passed data will then be used to fetch individual movie details from OMDB Api and display them. rading is passed specifically to avoid mis match issues

// populating movies according to button clicked
// rRatedMoviesBtn.addEventListener('click', function(){
//     window.alert('This request has been blocked; the content must be served over HTTPS. API Not Secure');
//     // pageHeading.innerHTML = 'Top R Rated Movies';

//     // //testing for error
//     // try{
//     //     apiRequestCall(TMDB_BASE_URL+TMDB_BEST_R_RATED+TMDB_API_KEY);
//     // }
//     // catch(err){
//     //     window.alert(err);
//     // }
    
// });

kidsMoviesBtn.addEventListener('click', function(){
    pageHeading.innerHTML = 'Popular In Kids';
    apiRequestCall(TMDB_BASE_URL+TMDB_POPULAR_KIDS_MOVIES+TMDB_API_KEY);
});

webLogo.addEventListener('click', function(){
    pageHeading.innerHTML = 'Best Popular Movies';
    apiRequestCall(TMDB_HOME_URL);
});



// array containing id's of all movies which are added to My List
// we will use this array to display content of My List Page
var myMovieList = [];
var oldArray = [];

// adding functionality to Add Movie to list button
function addingMovieToList(buttonID){
    document.getElementById(buttonID).innerHTML = '<i class="fas fa-check"></i>';
    // to add the movie only once into list
    if (!myMovieList.includes(buttonID.toString())) {
        myMovieList.push(buttonID.toString());
    }
    console.log(myMovieList);
    console.log('-------------------------------');
    
    // display toast to confirm user that movie has been added to list
    displayToast();


    //first we need to check if local storage is empty, if yes then push data directly; if not, then first reterive that data, modify it and then append modified data to localstorage;
    oldArray = JSON.parse(localStorage.getItem('MovieArray'));
    if (oldArray == null) {
        localStorage.setItem('MovieArray', JSON.stringify(myMovieList));
    }
    else{
        // appending only new entries in old array
        myMovieList.forEach(item =>{
            if (!oldArray.includes(item)) {
                oldArray.push(item);
            }
        })
        localStorage.setItem('MovieArray', JSON.stringify(oldArray));
    }
    console.log(oldArray);
}


// toast will be displayed for 2sec
function displayToast(){
    document.getElementById('toasts').style.display = "block";   
    setTimeout(() => {
        document.getElementById('toasts').style.display = "none";
    }, 2000);
}





//to display movies of selected year, following function will be called where we fetch the selected year and then pass the url with selectedYear  
bestMoviesOfYearDropDownMenu.onchange =  displaySelectedYearMovies;

function displaySelectedYearMovies(){
    var selectedYear = bestMoviesOfYearDropDownMenu[bestMoviesOfYearDropDownMenu.selectedIndex].text;

    console.log(selectedYear);
    var BEST_MOVIES_OF_YEAR = `/discover/movie?primary_release_year=${selectedYear}&sort_by=popularity.desc&`;
    apiRequestCall(TMDB_BASE_URL+BEST_MOVIES_OF_YEAR+TMDB_API_KEY);

    pageHeading.innerHTML = `Best Movies of ${selectedYear}`;
}




// ------------------------NOTE 0.0------------------------

// Goofle like search bar functionality using a dataset and providing a list of matched patterns
// due to vary large DataTransferItem, searching was slower and slowed the website as well
// depriciated this code and new method to implement search bar is written below
/*

// Now, to implement search bar autocompletion functionality, an array/list with all movie names was required
// I could not find this data directly
// So instead, I downloaded one of the IMDb Dataset (.tsv) conraining movie titles, converted it into workable sql file, modified the data using sql commands and filtered out only required data (with language en and hi only)
// this filtered data then was exported as json and saved in the assets folder of this project

// this json will be contains movie titles which will be used to open movie specific pages


let imdbMovieDatasetJson ;
// using fetch api to load the local file into js. this will return a promise on which we we convert it into json and then store that into javascript variable accessible outside as well

// this dataset is not complete so some movies might not come in search result
fetch("./assets/try2Json.json")
.then(response =>response.json())
.then(locallyLoadedJson => {
    imdbMovieDatasetJson = locallyLoadedJson;
})
// --------------------------------------------------------NOTE:------------------------------------------------------------------
// since the file is on a local machine, we should not open index.html file as a file into browser directly or else fetch will not work. Instead, use the link or local hosting or vscode -> open with live server




// implementing search bar functionality

// fetching the necessary dom elements 


searchInput.addEventListener('keyup', ()=>{
    let results = [];
    var searchInputText = searchInput.value;
    if (searchInputText.length != 0) {
        results = imdbMovieDatasetJson.filter((item) => {
            return item.Title.toLowerCase().includes(searchInputText.toLowerCase());
        });
    }
    renderResults(results);    
});

function renderResults(results) {
    // if the input string is empty, we hide the box
    if (results.length == 0) {
        return  wrapperDiv.classList.remove('show');;
    }

    // else we create a new list element add it to ul
    const content = results.map((eachMovieobject) => {
        // <li> <a href="moviePage.html?id=${id-to-be-passed-as-query}">${set-name-of -each-list-item}</a></li>
        return `<li> <a href="moviePage.html?id=${eachMovieobject.id}">${eachMovieobject.Title}</a></li>`;
    }).join('');
    wrapperDiv.classList.add('show');
    resultsDiv.innerHTML = `<ul>${content}</ul>`;
}
*/






// search bar functionality bt directly modifing dom elements instead of providing a search list
// working faster than above method
searchInput.addEventListener('keyup', function() {
    //get the input string
    var searchedInput = searchInput.value;
    // make api call with this url which wil return result array of matched titles and later we pass this json to create dom elements 
    var urlForThisInput = `https://api.themoviedb.org/3/search/movie?query=${searchedInput}&${TMDB_API_KEY}`;
    if (searchedInput.length != 0) {
        apiRequestCall(urlForThisInput);
    }
    else {
        window.location.reload();
    }
});


//disable prevrious page button initially and then based upon page no 
prevBtn.disabled = true;
function disablePvreBtn() {
    if (pageNo == 1) {
        prevBtn.disabled = true;
    }
    else{
        prevBtn.disabled = false;
    }
}


// navigate between pages
nextBtn.addEventListener('click', () =>{
    pageNo++;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNo}&with_watch_monetization_types=flatrate`;
    apiRequestCall(tempURL);
    disablePvreBtn();
});

prevBtn.addEventListener('click', () =>{
    if (pageNo == 1) {
        return;
    }
    pageNo--;
    let tempURL = `https://api.themoviedb.org/3/discover/movie?${TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${pageNo}&with_watch_monetization_types=flatrate`;
    apiRequestCall(tempURL);
    disablePvreBtn();
});