async function displaySongs(){
    let response = await fetch('/api/songs/');
    let songsJSON = await response.json();
    let rbSongs = document.getElementById("song-list-RB");
    let rapSongs = document.getElementById("song-list-rap");
    let altSongs = document.getElementById("song-list-alt");
    let reggaeSongs = document.getElementById("song-list-reggae");
    let oldSongs = document.getElementById("song-list-old");
    let otherSongs = document.getElementById("song-list-other");
    rbSongs.innerHTML = "";
    rapSongs.innerHTML = "";
    altSongs.innerHTML = "";
    reggaeSongs.innerHTML = "";
    oldSongs.innerHTML = "";
    otherSongs.innerHTML = "";

    for(i in songsJSON){
        let song = songsJSON[i];
        //songsDiv.append(getSongItem(song));
        if(song.genre == "R&B") {
            rbSongs.append(getSongItem(song));
        } else if(song.genre == "rap") {
            rapSongs.append(getSongItem(song));
        } else if(song.genre == "alt"){
            altSongs.append(getSongItem(song));
        } else if(song.genre == "reggae"){
            reggaeSongs.append(getSongItem(song));
        } else if(song.genre == "oldies"){
            oldSongs.append(getSongItem(song));
        } else {
            otherSongs.append(getSongItem(song));
        }
    }
}

function getSongItem(song){
    let songSection = document.createElement("section");
    songSection.classList.add("song-section");
    let aTitle = document.createElement("a");
    aTitle.setAttribute("data-id", song._id);
    aTitle.href = "#";
    aTitle.onclick = showSongDetails;
    let h3Elem = document.createElement("h3");
    h3Elem.innerHTML = song.title;
    songSection.append(h3Elem);
    aTitle.append(h3Elem);
    songSection.append(aTitle);

    return songSection;
}

async function showSongDetails(){
    let id = this.getAttribute("data-id");
    let response = await fetch(`/api/songs/${id}`);

    if(response.status != 200) {
        console.log("error receiving song");
        return;
    }

    let song = await response.json();
    document.getElementById("song-id").textContent = song._id;
    document.getElementById("txt-title").value = song.title;
    document.getElementById("txt-artist").value = song.artist;
    document.getElementById("txt-album").value = song.album;
    document.getElementById("txt-year").value = song.year;
    document.getElementById("txt-genre").value = song.genre;
    document.getElementById("txt-writers").value = song.writers;

    let detailsSection = document.getElementById("details-section");
    detailsSection.innerHTML = "";
    detailsSection.classList.remove("hidden");

    h2Elem = document.createElement("h2");
    h2Elem.innerHTML = song.title;
    detailsSection.append(h2Elem);

    let h3Elem = document.createElement("h3");
    h3Elem.innerHTML = `Artist: ${song.artist}`;
    detailsSection.append(h3Elem);

    let h3Album = document.createElement("h3");
    h3Album.innerHTML = `Album: ${song.album}`;
    detailsSection.append(h3Album);

    let h3Year = document.createElement("h3");
    h3Year.innerHTML = `Year Released: ${song.year}`;
    detailsSection.append(h3Year);

    let h3Genre = document.createElement("h3");
    h3Genre.innerHTML = `Genre: ${song.genre}`;
    detailsSection.append(h3Genre);

    let h3Writers = document.createElement("h3");
    h3Writers.innerHTML = `Writer(s): ${song.writers}`;
    detailsSection.append(h3Writers);
}

async function addSong() {
    let songTitle = document.getElementById("txt-add-title").value;
    let songArtist = document.getElementById("txt-add-artist").value;
    let songAlbum = document.getElementById("txt-add-album").value;
    let songYear = document.getElementById("txt-add-year").value;
    let songGenre = document.getElementById("txt-add-genre").value;
    let songWriters = document.getElementById("txt-add-writers").value;

    let song = {"title":songTitle, "artist":songArtist, "album":songAlbum, "year":songYear, "genre":songGenre, "writers":songWriters};

    let response = await fetch('/api/songs',{
        method:"POST",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(song)
    });

    if(response.status != 200) {
        console.log("error posting data");
        let errorMessage = document.getElementById("error-add");
        errorMessage.classList.remove("success-message");
        errorMessage.classList.add("error-message");
        errorMessage.innerHTML = "ERROR; please enter valid information";
        setTimeout(function(){
            errorMessage.innerHTML="";
        }, 3000);
        return;
    }

    let successMessage = document.getElementById("error-add");
    successMessage.classList.remove("error-message");
    successMessage.classList.add("success-message");
    successMessage.innerHTML = "Success! Song Added.";
    setTimeout(function(){
        successMessage.innerHTML="";
    }, 3000);

    let result = await response.json();
    console.log(result);
    displaySongs();
}

async function editSong(){
    let songId = document.getElementById("song-id").textContent;
    let songTitle = document.getElementById("txt-title").value;
    let songArtist = document.getElementById("txt-artist").value;
    let songAlbum = document.getElementById("txt-album").value;
    let songYear = document.getElementById("txt-year").value;
    let songGenre = document.getElementById("txt-genre").value;
    let songWriters = document.getElementById("txt-writers").value;
    let song = {"title":songTitle, "artist":songArtist, "album":songAlbum, "year":songYear, "genre":songGenre, "writers":songWriters};

    let response = await fetch(`/api/songs/${songId}`,{
        method:"PUT",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        },
        body: JSON.stringify(song)
    });

    if(response.status != 200){
        console.log("error editing song");
        let errorMessage = document.getElementById("error-edit");
        errorMessage.classList.remove("success-message");
        errorMessage.classList.add("error-message");
        errorMessage.innerHTML = "ERROR; please enter valid information";
        setTimeout(function(){
            errorMessage.innerHTML="";
        }, 3000);
        return;
    }

    let successMessage = document.getElementById("error-edit");
    successMessage.classList.remove("error-message");
    successMessage.classList.add("success-message");
    successMessage.innerHTML = "Success! Song Edited.";
    setTimeout(function(){
        successMessage.innerHTML="";
    }, 3000);

    let result = await response.json();
    displaySongs();
}

async function deleteSong() {
    let songId = document.getElementById("song-id").textContent;

    let response = await fetch(`/api/songs/${songId}`,{
        method:"DELETE",
        headers:{
            'Content-Type':'application/json;charset=utf-8'
        }
    });

    if(response.status != 200){
        console.log("error deleting song");
        return;
    }

    let result = await response.json();
    displaySongs();
}

function revealVaults(){
    let vaults = document.getElementById("song-list-container");
    let btn = document.getElementById("show-vaults");
    vaults.classList.toggle("hidden");
    if(vaults.classList.contains("hidden")){
        btn.innerHTML = "+";
    } else {
        btn.innerHTML = "-";
    }
}

function revealRB(){
    let RBsongs = document.getElementById("song-list-RB");
    let vault = document.getElementById("vault-RB");
    vault.classList.remove("vault");
    RBsongs.classList.remove("hidden");
}
function revealRap(){
    let rapSongs = document.getElementById("song-list-rap");
    let vault = document.getElementById("vault-rap");
    vault.classList.remove("vault");
    rapSongs.classList.remove("hidden");
}
function revealReggae(){
    let reggaeSongs = document.getElementById("song-list-reggae");
    let vault = document.getElementById("vault-reggae");
    vault.classList.remove("vault");
    reggaeSongs.classList.remove("hidden");
}
function revealAlt(){
    let altSongs = document.getElementById("song-list-alt");
    let vault = document.getElementById("vault-alt");
    vault.classList.remove("vault");
    altSongs.classList.remove("hidden");
}
function revealOld(){
    let oldSongs = document.getElementById("song-list-old");
    let vault = document.getElementById("vault-old");
    vault.classList.remove("vault");
    oldSongs.classList.remove("hidden");
}
function revealOther(){
    let otherSongs = document.getElementById("song-list-other");
    let vault = document.getElementById("vault-other");
    vault.classList.remove("vault");
    otherSongs.classList.remove("hidden");
}

function showAddForm(){
    let addForm = document.getElementById("add-song");
    let addBtn = document.getElementById("show-add-song");
    addForm.classList.toggle("hidden");
    if(addForm.classList.contains("hidden")){
        addBtn.innerHTML = "+";
    } else {
        addBtn.innerHTML = "-";
    }
}
function showEditForm(){
    let editForm = document.getElementById("song-details");
    let editBtn = document.getElementById("show-edit-song");
    editForm.classList.toggle("hidden");
    
    if(editForm.classList.contains("hidden")){
        editBtn.innerHTML = "+";
    } else {
        editBtn.innerHTML = "-";
    }
}

window.onload = function(){
    this.displaySongs();

    let addBtn = document.getElementById("btn-add-song");
    addBtn.onclick = addSong;

    let editBtn = document.getElementById("btn-edit-song");
    editBtn.onclick = editSong;

    let deleteBtn = document.getElementById("btn-delete-song");
    deleteBtn.onclick = deleteSong;

    let showVaultsButton = document.getElementById("show-vaults");
    showVaultsButton.onclick = this.revealVaults;

    let revealRBButton = document.getElementById("vault-RB");
    revealRBButton.onclick = this.revealRB;

    let revealRapButton = document.getElementById("vault-rap");
    revealRapButton.onclick = this.revealRap;

    let revealReggaeButton = document.getElementById("vault-reggae");
    revealReggaeButton.onclick = this.revealReggae;

    let revealAltButton = document.getElementById("vault-alt");
    revealAltButton.onclick = this.revealAlt;

    let revealOldButton = document.getElementById("vault-old");
    revealOldButton.onclick = this.revealOld;

    let revealOtherButton = document.getElementById("vault-other");
    revealOtherButton.onclick = this.revealOther;

    let showButtonAdd = document.getElementById("show-add-song");
    showButtonAdd.onclick = this.showAddForm;
    let showButtonEdit = document.getElementById("show-edit-song");
    showButtonEdit.onclick = this.showEditForm;
}