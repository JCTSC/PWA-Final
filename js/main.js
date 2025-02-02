import '../css/style.css';

const cameraView = document.querySelector("#camera--view"),
  cameraSensor = document.querySelector("#camera--sensor"),
  cameraTrigger = document.querySelector("#camera--trigger"),
  switchCameraButton = document.getElementById("switch-camera"),
  photoTitleInput = document.getElementById("photo-title");

let cameraMode = "user";
const lastPhotos = [];

const constraints = () => ({ video: { facingMode: cameraMode }, audio: false });

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("paleontologyDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePhoto(photoWithLocation) {
  const db = await openDB();
  const transaction = db.transaction("photos", "readwrite");
  const store = transaction.objectStore("photos");
  store.add(photoWithLocation);
}

async function loadPhotos() {
  const db = await openDB();
  const transaction = db.transaction("photos", "readonly");
  const store = transaction.objectStore("photos");
  const request = store.getAll();
  request.onsuccess = () => {
    const photos = request.result.slice(-10);
    lastPhotos.length = 0;
    lastPhotos.push(...photos);
    updatePhotoGallery();
  };
}

function updatePhotoGallery() {
  let gallery = document.getElementById("photo-gallery");
  if (!gallery) return;

  gallery.innerHTML = ""; 

  lastPhotos.forEach((photoWithLocation) => {
    const img = document.createElement("img");
    img.src = photoWithLocation.photo;
    img.classList.add("photo-preview");

    const title = document.createElement("h3");
    title.innerText = `Título: ${photoWithLocation.title || "Sem título"}`;

    const locationInfo = document.createElement("p");
    locationInfo.innerText = `Latitude: ${photoWithLocation.location.latitude}, Longitude: ${photoWithLocation.location.longitude}`;

    const iframe = document.createElement("iframe");
    iframe.width = "100%";
    iframe.height = "300";
    iframe.frameborder = "0";
    iframe.style.border = "0";
    iframe.allowfullscreen = true;
    iframe.src = `https://www.google.com/maps?q=${photoWithLocation.location.latitude},${photoWithLocation.location.longitude}&z=15&output=embed`;

    gallery.appendChild(img);
    gallery.appendChild(title);
    gallery.appendChild(locationInfo);
    gallery.appendChild(iframe);
  });
}
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('.../sw.js', { type: "module" });
      console.log('Service Worker registrado!', reg);
      postNews();
    } catch (err) {
      console.log('Registro do Service Worker falhou:', err);
    }
  });
}

const fossilSites = [
  { title: "Hell Creek Formation", description: "Um dos locais mais ricos em fósseis do período Cretáceo." },
  { title: "La Brea Tar Pits", description: "Famoso por preservar mamíferos da Era do Gelo." },
  { title: "Dinosaur Provincial Park", description: "Conhecido por uma vasta diversidade de fósseis de dinossauros." },
  { title: "Ischigualasto", description: "Uma das melhores janelas para o período Triássico." },
  { title: "Solnhofen Limestone", description: "Famoso por fósseis bem preservados, como o Archaeopteryx." }
];

function createFossilCards() {
  const cardsContainer = document.getElementById("cards-container");
  fossilSites.forEach((site) => {
    const card = document.createElement("div");
    card.classList.add("fossil-card");

    const title = document.createElement("h3");
    title.innerText = site.title;

    const description = document.createElement("p");
    description.innerText = site.description;

    card.appendChild(title);
    card.appendChild(description);
    cardsContainer.appendChild(card);
  });
}

createFossilCards();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('.../sw.js', { type: "module" });
      console.log('Service Worker registrado!', reg);
      postNews();
    } catch (err) {
      console.log('Registro do Service Worker falhou:', err);
    }
  });
}

const photosData = [
  {
    Titulo: "HellCreek Formation",
    latitude: 47.622905297912304,
    longitude:  -106.87586396756201, 
    imagem: "https://upload.wikimedia.org/wikipedia/commons/a/af/Hell_Creek.jpg"
  },
  {
    Titulo: "La Brea",
    latitude: 34.06391766107107,  
    longitude: -118.35643237991897,
    imagem: "https://www.latlong.net/photos/la-brea.jpg"
  },
  {
    Titulo: "Dinosaur Provincial Park",
    latitude: 50.77116079728583, 
    longitude: -111.49022477488813,
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkA3XOrairD1os7w7xtvNaFr6TUYkiHnDC-A&s"
  },
  {
    Titulo: "Ischigualasto Provincial Park",
    latitude: -30.163666833709204,
    longitude:  -67.8424189028875, 
    imagem: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Ischigualasto_provincial_park.jpg"
  },
  {
    Titulo: "Calcário Solnhofen",
    latitude: 48.896807405098656,  
    longitude: 10.997343039291554,
    imagem: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Solnhofen_-_cantera_de_calizas_tableadas.jpg"
  },
  { 
    Titulo: "Faium",
    latitude: 29.309024387921227,
    longitude:  30.841596733813503,
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6sCVoxdgRh5-AXhEBDu3VrsWe0zVIbLeWA&s"
  }
];

const cardsContainer = document.getElementById("cards-container");
const photoMap = document.getElementById("photo-map");

function createPhotoCards() {
  photosData.forEach((photo) => {
    const card = document.createElement("div");
    card.classList.add("photo-card");

    const img = document.createElement("img");
    img.src = photo.imagem;
    img.alt = "Foto com localização";

    card.appendChild(img);
    cardsContainer.appendChild(card);

    // Ao clicar no card, atualiza o iframe do mapa
    card.addEventListener("click", () => {
      const mapUrl = `https://www.google.com/maps?q=${photo.latitude},${photo.longitude}&z=15&output=embed`;
      photoMap.src = mapUrl;
    });
  });
}

// Chamando a função para exibir os cards na tela
createPhotoCards();
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints())
    .then((stream) => {
      cameraView.srcObject = stream;
    })
    .catch((error) => console.error("Ocorreu um erro.", error));
}

cameraTrigger.onclick = async function () {
  const photoTitle = photoTitleInput.value.trim();
  if (!photoTitle) {
    alert("Por favor, insira um título antes de tirar a foto.");
    return;
  }

  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  const photoData = cameraSensor.toDataURL("image/webp");

  navigator.geolocation.getCurrentPosition(async (posicao) => {
    const latitude = posicao.coords.latitude;
    const longitude = posicao.coords.longitude;

    const photoWithLocation = {
      title: photoTitle, // Salva o título junto com a foto
      photo: photoData,
      location: { latitude, longitude },
      timestamp: new Date().toISOString()
    };

    lastPhotos.push(photoWithLocation);
    if (lastPhotos.length > 3) lastPhotos.shift();

    await savePhoto(photoWithLocation);
    updatePhotoGallery();
  }, erro);
};

switchCameraButton.onclick = function () {
  cameraMode = cameraMode === "user" ? "environment" : "user";
  cameraStart();
};

window.addEventListener("load", () => {
  cameraStart();
  loadPhotos();
});

const capturarLocalizacao = document.getElementById('localizacao');
const latitude = document.getElementById('latitude');
const longitude = document.getElementById('longitude');
const iframeMap = document.getElementById('map'); 

const sucesso = (posicao) => { 
  latitude.innerHTML = posicao.coords.latitude;
  longitude.innerHTML = posicao.coords.longitude;
  iframeMap.src = `https://www.google.com/maps?q=${posicao.coords.latitude},${posicao.coords.longitude}&z=15&output=embed`;
};

const erro = (error) => { 
  let errorMessage;
  switch (error.code) {
    case 0: errorMessage = "Erro desconhecido"; break;
    case 1: errorMessage = "Permissão negada!"; break;
    case 2: errorMessage = "Captura de posição indisponível!"; break;
    case 3: errorMessage = "Tempo de solicitação excedido!"; break;
  }
  console.log('Ocorreu um erro: ' + errorMessage);
};

capturarLocalizacao.addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(sucesso, erro);
});
