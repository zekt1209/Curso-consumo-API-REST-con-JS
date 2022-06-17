
const URL = 'https://api.thecatapi.com/v1/images/search';


fetch(URL)
.then(res => res.json())
.then(data => {
    const img = document.querySelector('img');
    img.src = data[0].url; 
});


const getMichi = async () => {
    const res = await fetch(URL);
    const data = await res.json();
    const img = document.querySelector('img');
    img.src = data[0].url;
}

const myButton = document.querySelector("button");
myButton.onclick = getMichi;
