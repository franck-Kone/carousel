// To run this assignment, right click on index.html in the Visual Studio file explorer to the left
// and select "Open with Live Server"

// Your Code Here.

//Clean Body
document.body.textContent = ''

// create header
const header = `<header id="header">
<h1 id="title"><span>&#128506;</span>JavaScript in The Wild LOCATOR APP </h1>
<button id="find-me" class="find-me">Locator</button>
</header>`

// create coords container
const coordsContainer = `<div class ='coords'>
<a id="map-link" target="_blank"></a><i class="fa-solid fa-eye"></i>
</div>`

//Instruction message
const instruction = document.createElement('h1')
instruction.className = 'instruction'
instruction.innerHTML = "Click On The Locator Button Up There <span>👆🏿</span> To See Your Current Position"

//Append header,coordsContainer and instruction message to the body
document.body.innerHTML = header
document.body.innerHTML += coordsContainer
document.body.append(instruction)

//Get coords latitude and longitude with google geolocation api
let latitudeCoord, longitudeCoord

function success(position) {

    const coords = position.coords
    latitudeCoord = coords.latitude
    longitudeCoord = coords.longitude

    getData(latitudeCoord, longitudeCoord)
}

function error() {
    alert("Sorry, no position available.");
}

const options = {
    enableHighAccuracy: false,
    maximumAge: 0,
    timeout: 5000,
};

navigator.geolocation.getCurrentPosition(success, error, options)

// Display coords and photos to the screen when pressing the button named Locator 
document.querySelector("#find-me").addEventListener("click", () => {

    const coordsDisplay = document.querySelector("#map-link");
    coordsDisplay.textContent = `Latitude: ${latitudeCoord} °, Longitude: ${longitudeCoord} °`;

    document.querySelector('.images-stock').style.display = 'flex'
    instruction.style.display = 'none'

    document.querySelector('.coords').style.visibility = 'visible'
});

// Hide coords Display when clicking on eye fa-solid font awesome
let coordsIsHidden = false
const eye = document.querySelector('.fa-solid')
eye.onclick = function () {

    if (!coordsIsHidden) {
        document.querySelector('#map-link').style.visibility = 'hidden'
        eye.classList.remove('fa-eye')
        eye.classList.add('fa-eye-slash')
        eye.style.color = 'black'
        eye.style.animation = 'none'

        coordsIsHidden = true
    } else {
        document.querySelector('#map-link').style.visibility = 'visible'
        eye.classList.remove('fa-eye-slash')
        eye.classList.add('fa-eye')
        eye.style.color = 'brown'
        eye.style.animation = 'textFlash 1s ease-in-out infinite'

        coordsIsHidden = false
    }

}

//Get data from flickr api based on our geolocation 
const getData = async function (lat, lon) {

    const apiKey = "b2cfde4baf7b243140c2a6e2d2c9940c";

    const myResponse = await fetch(`https://www.flickr.com/services/rest/?api_key=${apiKey}&format=json&nojsoncallback=1&method=flickr.photos.search&safe_search=1&per_page=5&lat=${lat}&lon=${lon}&text=bridge&page=2`)
        .then((response) => {

            if (response.status !== 200) {
                throw new Error('Cannot Either Fecth Data or Get Your Coords')
            }
            const newResponse = response.json()
            return newResponse
        })
        .then((result) => {

            renderImages(result)
        })

    return myResponse
}

//build image url
function createImageUrl(apiResult, num) {

    return `https://live.staticflickr.com/${apiResult.photos.photo[num].server}/${apiResult.photos.photo[num].id}_${apiResult.photos.photo[num].secret}_c.jpg`
}

//create Html image tags in according to our api Response and div and set their source to be images url  that we have created by using createImageUrl function 
function renderImages(dataFetched) {

    const imagesBigStock = document.createElement('section')
    imagesBigStock.className = "images-stock"
    const allImagesContainer = document.createElement('div')
    allImagesContainer.setAttribute('class', 'imagesContainer')

    for (let i = 0; i < dataFetched.photos.photo.length; i++) {
        const newImageUrl = createImageUrl(dataFetched, i)
        const newImage = document.createElement('img')
        newImage.setAttribute('style', 'width: 100%; height: 100%')
        newImage.src = newImageUrl
        allImagesContainer.append(newImage)
    }

    imagesBigStock.append(allImagesContainer)
    document.body.append(imagesBigStock)

    updateImage()
    createButtonsControl()
}

// update current image (carousel)
let currentImage = 1
let myInterval;

function updateImage() {

    const getImagesNodes = document.querySelectorAll('img')
    if (currentImage > getImagesNodes.length) {
        currentImage = 1
    } else if (currentImage < 1) {
        currentImage = getImagesNodes.length
    }
    const allImagesContainer = document.querySelector('.imagesContainer')
    allImagesContainer.style.transform = `translateX(-${(currentImage - 1) * allImagesContainer.clientWidth}px)`

    if (!myInterval) {

        myInterval = setInterval(() => {
            currentImage++
            updateImage()
        }, 3000)
    }
}

// carousel  control buttons creation
function createButtonsControl() {

    const buttonLeft = document.createElement('button')
    buttonLeft.className = "btnLeft"
    buttonLeft.textContent = '«'

    const buttonRight = document.createElement('button')
    buttonRight.className = "btnRight"
    buttonRight.textContent = '»'

    document.querySelector('.images-stock').append(buttonLeft, buttonRight)

    functionalities(buttonLeft, buttonRight)

}

// control buttons functionalities
function functionalities(left, right) {

    left.addEventListener('click', () => {
        left.style.transform = 'scale(0.9)'
        clearInterval(myInterval)
        myInterval = null
        currentImage--
        updateImage()
    })
    right.addEventListener('click', () => {
        right.style.transform = 'scale(0.9)'
        clearInterval(myInterval)
        myInterval = null
        currentImage++
        updateImage()
    })
}