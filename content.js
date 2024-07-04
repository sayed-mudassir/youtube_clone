const menu = document.getElementById("menu");
const suggestion = document.getElementsByClassName("suggestion-options");
const links = document.getElementsByClassName("links");
const sideBar = document.getElementById("side-pannel");
const sideBar2 = document.getElementById("side-pannel2");
const suggestionsContainer = document.getElementById("suggestions");
// console.log(suggestion[1])
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

menu.addEventListener("click",()=>{
    sideBar.classList.toggle("hidden");
    sideBar2.classList.toggle("hidden");

    suggestionsContainer.classList.toggle("suggestions-sidebar-closed");
    body.classList.toggle("body-shrinked");
})

for (let i = 0; i < suggestion.length; i++) {
  suggestion[i].addEventListener("click", (event) => {
    event.target.classList.toggle("active");
    makeOtherSuggestionDisable(i);
    // console.log();
    searchVideos(event.target.innerText, 50, "snippet");
  });
}

function makeOtherSuggestionDisable(target) {
    for(let i = 0; i<suggestion.length;i++){
        if(i!=target){
            suggestion[i].classList.remove("active");
        }
    }
}

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", (event) => {
      event.target.classList.toggle("active");
      makeOtherLinksDisable(i);
    });
  }
  
  function makeOtherLinksDisable(target) {
      for(let i = 0; i<links.length;i++){
          if(i!=target){
              links[i].classList.remove("active");
          }
      }
  }

  searchBar.addEventListener("focus",(event)=>{
    event.target.style.border = "1px solid #1d62b9"
  });
  searchBar.addEventListener("blur",(event)=>{
    event.target.style.border = "none"
  });

searchButton.addEventListener("click",()=>{
    if(searchBar.value){
        searchVideos(searchBar.value, 50, "snippet");
    }
    else{
        alert("please enter a text to search")
    }
})



