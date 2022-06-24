const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=6e360be8-26a3-4f64-a7cd-bc6d0cae645a';
const API_URL_FAVORITE = 'https://api.thecatapi.com/v1/favourites?api_key=6e360be8-26a3-4f64-a7cd-bc6d0cae645a';
const API_URL_FAVORITE_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=6e360be8-26a3-4f64-a7cd-bc6d0cae645a`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload/';

const spanError = document.getElementById('error');

// fetch(API_URL_RANDOM)
// .then(res => res.json())
// .then(data => {
//     const img1 = document.getElementById('img1');   // Estamos llamando a 3 elementos en HTML
//     const img2 = document.getElementById('img2');
//     const img3 = document.getElementById('img3');    // img.src = data[0].url; 
//     img1.src = data[0].url;
//     img2.src = data[1].url;
//     img3.src = data[2].url;
// });

const HTTP={
    'OK': 200,
    'CREATED': 201,
    'BAD_REQUEST': 400,
    'UNAUTHORIZED': 401,
    'FORBIDDEN': 403,
    'NOT_FOUND': 404,
    'INTERNAL_SERVER_ERROR':500,
    'SERVICE_UNAVAILABLE': 503,
    'GATEWAY_TIMEOUT': 504,
  }

const getMichi = async () => {
    const res = await fetch(API_URL_RANDOM); // Llamando a la API
    const data = await res.json();  // Convertimos eso en sintaxis que JS pueda entender con el res.json

    if (res.status !== 200){
        spanError.innerHTML = 'Hubo un error ' + res.status + " " + data.message;
    } else {
        const img1 = document.getElementById('img1');   // Estamos llamando a 3 elementos en HTML
        const img2 = document.getElementById('img2');
        const img3 = document.getElementById('img3');
        const btn1 = document.getElementById('btn1');   // Llamamos a los botones tambien para sacar su ID de la imagen
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');

        console.log("Random");
        console.log(data); // Nos muestra el arreglo de las imagenes que recupero en la consola

        img1.src = data[0].url; // Cambiamos el atributo src de la imagen en html por la informacion de la imagen que recuperamos en la posicion 0 del arreglo
        img2.src = data[1].url;
        img3.src = data[2].url;

        btn1.onclick = () => saveFavoriteMichis(data[0].id);
        btn2.onclick = () => saveFavoriteMichis(data[1].id);
        btn3.onclick = () => saveFavoriteMichis(data[2].id);
    }
}



const loadFavoriteMichis = async () => {
    const res = await fetch(API_URL_FAVORITE); // Llamando a la API
    const data = await res.json();  // Convertimos eso en sintaxis que JS pueda entender con el res.json
    console.log("Favorites");
    console.log(data);

    if (res.status !== 200){
        spanError.innerHTML = 'Hubo un error ' + res.status + " " + data.message;
    } else {
        const section = document.getElementById('fav-michis'); // Hacemos la manipulacion del dom para insertar los michis fav
        section.innerHTML = '';     // Limpiamos los michis cargados anteriormente para volverlos a cargar 

        /* const h1 = document.createElement('h1'); // Crear nuevo titulo para insertarlo en el DOM cada que se quite un michi de favoritos
        const h1Text = document.createTextNode('Favorite Michis');
        h1.appendChild(h1Text);
        section.appendChild(h1); */

        data.forEach(element => {
            const article = document.createElement('article'); // Hacemos la manipulacion del dom para insertar los michis fav
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnText = document.createTextNode('Quitar');

            img.src = element.image.url;    // Le agregamos lo necesario a las imagenes de los michis favoritos
            img.className = 'michi-pic';

            btn.appendChild(btnText);       // Agregamos lo necesario a los botones de quitar michi
            btn.onclick = () => deleteFavoriteMichis(element.id);
            btn.className = 'btn-quitar-michi';
            
            article.appendChild(img);
            article.appendChild(btn);
            article.className = 'michis-info';

            section.appendChild(article);
        });
    }
}



const saveFavoriteMichis = async (id) => {
    const res = await fetch(API_URL_FAVORITE, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'   // Nos sirve para que el Frontend y Backend se comuniquen con el mismo tipo de informacion, que en este caso es JSON
        },
        body: JSON.stringify({
            image_id: id
        })
    })

    console.log('Save');
    console.log(res);

    const data = await res.json();

    if (res.status !== 200) {
        spanError.innerHTML = 'Hubo un error ' + res.status + ' ' + data.message;
    } else {
        console.log('Michi agregado a favoritos correctamente! ');
        loadFavoriteMichis();
    }

}


const deleteFavoriteMichis = async (id) => {
    const res = await fetch(API_URL_FAVORITE_DELETE(id), {
        method: 'DELETE'
       /* headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            favourite_id: id
        })*/
    });
    const data = await res.json();

    console.log('Delete');
    console.log(res)

    if (res.status !== 200) {
        spanError.innerText = 'Hubo un error' + res.status + ' ' + data.message;
    } else {
        console.log('Michi eliminado de favoritos correctamente! ');
        loadFavoriteMichis();
    }
}

const uploadMichiPicture = async () => {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': '6e360be8-26a3-4f64-a7cd-bc6d0cae645a',
        },
        body: formData,
    });

    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerText = 'Hubo un error' + res.status + ' ' + data.message;
        console.log({data});
    } else {
        console.log('Foto de michi subida :)');
        console.log({data});
        console.log(data.url);

        saveFavoriteMichis(data.id);
    }
}

const myButton = document.getElementById("btnRefresh");
myButton.onclick = getMichi;

getMichi();
loadFavoriteMichis();