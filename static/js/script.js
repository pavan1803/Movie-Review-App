  let search = document.getElementById('search')
        let container = document.getElementById('container')
        let title = document.getElementById('title')
        let plot = document.getElementById('plot')
        let rating = document.getElementById('rating')
        let boxoffice = document.getElementById('boxoffice')
        let poster = document.getElementById('poster')
        let genre = document.getElementById('genre')
        const API_KEY = '74a7ae4b'

        async function moviesearch(event){
            event.preventDefault()
            try{
                const searchval = search.value.toLowerCase()
                
                const data = await fetch(`https://www.omdbapi.com/?s=${searchval}&apikey=${API_KEY}`)
                const val = await data.json() 

                if (val.Response === 'False'){
                    alert('Movie not present in db')
                    return
                }
                container.innerHTML=''

                val.Search.forEach(movie =>{
                    container.innerHTML +=
                    `<div class='card' onclick="getDetails('${movie.imdbID}')">
                        <img src = '${movie.Poster}'/>
                        <h3>${movie.Title}</h3>
                        <p>${movie.Year}</p>
                    </div>`
                })    
            }
            catch(error){
                console.error(error)
            } 
        }

        async function getDetails(id){
            try{
                const res =await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`)
                const data = await res.json()

                document.getElementById('modalTitle').textContent = data.Title
                document.getElementById('modalPoster').src = data.Poster
                document.getElementById('modalPlot').textContent = data.Plot
                document.getElementById('modalGenre').textContent = data.Genre
                document.getElementById('modalRating').textContent = '⭐' +data.imdbRating+'/10'
                document.getElementById('modalBoxOffice').textContent ='💵'+ data.BoxOffice

                loadReviews(data.Title);
             

                let modal = new bootstrap.Modal(document.getElementById('movieModal'))
                modal.show()
            }
            catch (error){
                console.error(error);
            }

        }

        function submitReview(){
             if (!currentRating || currentRating === 0) {
    alert("Please select a rating");
    return;
  }
            fetch('/submit-review/',{
                method : 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body:JSON.stringify({
                    movie_title : document.getElementById('modalTitle').innerText,
                    rating :currentRating,
                    review:document.getElementById('reviewInput').value
                })
            })
        }

        function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = cookie.substring(name.length + 1);
      }
    }
  }
  return cookieValue;
}

function loadReviews(movieTitle) {
  fetch(`/get-reviews/?movie_title=${encodeURIComponent(movieTitle)}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("reviewsContainer");

      container.innerHTML = "<h5>User Reviews</h5>";

      if (data.length === 0) {
        container.innerHTML += "<p>No reviews yet</p>";
        return;
      }

      data.forEach(r => {
        container.innerHTML += `
          <div style="margin-bottom:10px;">
            <strong>${r.user}</strong> ⭐ ${r.rating}
            <p>${r.review}</p>
          </div>
        `;
      });
    });
}


let currentRating = 0;

function setRating(val) {
  currentRating = val;
  document.getElementById('speedoValue').textContent = val;
  document.querySelectorAll('.star-btn').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.val) <= val);
  });
  document.getElementById('speedoArc').style.strokeDashoffset = 220 - (val / 5) * 220;
  const angle = -90 + ((val - 1) / 4) * 180;
  document.getElementById('speedoNeedle').setAttribute('transform', `rotate(${angle}, 90, 90)`);
}