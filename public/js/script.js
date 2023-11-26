document.addEventListener("DOMContentLoaded", () => {
  const allBtn = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchClose = document.getElementById('searchClose')
  const searchInput = document.getElementById('searchInput')

  for(let i = 0; i < allBtn.length ; i++) {
    allBtn[i].addEventListener('click', () => {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open')
        searchInput.focus()
    })
  }

  searchClose.addEventListener('click', () => {
    searchBar.style.visibility = 'hidden'
    searchBar.classList.remove('open')
  })
  
});



