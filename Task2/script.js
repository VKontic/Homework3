let table = document.querySelector('table');
let search = document.querySelector('.search');
let submitBtn = document.querySelector('.submit');
let rating = document.querySelector('select')
let loadMoreBtn = document.querySelector('.loadMore');
loadMoreBtn.addEventListener('click', loadMore);
submitBtn.addEventListener('click', filter);

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

fetch("json.json")
    .then(handleErrors)
    .then(response => response.json())
    .then(updateTable)
    .catch(function(error) {
        console.log(error);
    });

function updateTable(jsonGames){
    loadFromElement(0, jsonGames);
}

function loadFromElement(index, jsonGames){
    let end = index + 3;
    if (jsonGames.length<end){
        end = jsonGames.length;
    }
    for (let i = index; i<end; i++){
        let id = jsonGames[i].id;
        let name = jsonGames[i].name;
        let imageLink = jsonGames[i].image;
        let publisher = jsonGames[i].publisher;
        let genres = jsonGames[i].genres;
        let rating = jsonGames[i].rating;
        let url = jsonGames[i].url;
       createRow(id,name,imageLink,publisher,genres,rating,url);
   }
}

function createRow(id,name,imageLink,publisher,genres,rating,url){
    let tr = document.createElement('tr');

    let tdId = document.createElement('td');
    tdId.innerText = id;

     let tdImage = document.createElement('td');
        let div = document.createElement('div');
        div.className="imageContainer";
        let txtGameName = document.createElement('p');
        txtGameName.className="gameName";
        txtGameName.innerText = name;
        let link = document.createElement('a');
        link.href = url;
        link.target = "_blank";
        let img = document.createElement('img');
        img.src = imageLink;
        div.appendChild(link);
        div.appendChild(txtGameName);
        link.appendChild(img);
    tdImage.appendChild(div);
    
    let tdPublisher = document.createElement('td');
    tdPublisher.innerText = publisher;

    let tdGenres = document.createElement('td')
    tdGenres.innerText = genres;

    let tdRating = document.createElement('td');
    tdRating.innerText = rating;
    
    let tdDel = document.createElement('td');
        let delBtn = document.createElement('i');
        delBtn.className = "far fa-times-circle deleteBtn";
        delBtn.addEventListener('click', removeItem);
    tdDel.appendChild(delBtn);

    tr.appendChild(tdId);
    tr.appendChild(tdImage);
    tr.appendChild(tdPublisher);
    tr.appendChild(tdGenres);
    tr.appendChild(tdRating);
    tr.appendChild(tdDel);
    table.appendChild(tr);
}

function filter(){
    clearTable();
    let filter = document.querySelector('input[type=radio]:checked').value;
    fetch("json.json")
        .then(handleErrors)
        .then(response => response.json())
        .then(function(jsonGames){
            for (let i = 0; i<jsonGames.length; i++){
                let id = jsonGames[i].id;
                let name = jsonGames[i].name;
                let imageLink = jsonGames[i].image;
                let publisher = jsonGames[i].publisher;
                let genres = jsonGames[i].genres;
                let rtg = jsonGames[i].rating;
                let url = jsonGames[i].url;
                if (rtg > rating.value ){
                    if (filter === 'name'){
                        if (name.toLowerCase().indexOf(search.value.toLowerCase().trim()) >= 0){
                            createRow(id,name,imageLink,publisher,genres,rtg,url);
                        }
                    }else if (filter === 'genre'){
                        if (genres.toLowerCase().indexOf(search.value.toLowerCase().trim())>= 0){
                            createRow(id,name,imageLink,publisher,genres,rtg,url);
                        }
                    }
                }
            }
        })
        .catch(function(error) {
            console.log(error);
        });

}

function loadMore(){
    if(table.childElementCount <= 1){
        //table is empty
    fetch("json.json")
        .then(handleErrors)
        .then(response => response.json())
        .then(data=>loadFromElement(0,data))
        .catch(function(error) {
            console.log(error);
        });

    }else{
        let startIndex = Number(table.lastElementChild.firstElementChild.innerText);
        fetch("json.json")
        .then(handleErrors)
        .then(response => response.json())
        .then(data=>loadFromElement(startIndex,data))
        .catch(function(error) {
            console.log(error);
        });
    }
}

function removeItem(e){
  e.target.parentElement.parentElement.remove();
}
function clearTable(){
     let currNumberOfItems = document.querySelectorAll('tr');
     let c = [...currNumberOfItems];
     for (let i = 1; i <currNumberOfItems.length; i++){
        c[i].remove();
     }
}