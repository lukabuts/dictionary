const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');
const wordInput = document.querySelector('#wordInput');
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const audio = document.getElementById('audio');
const errorDiv = document.querySelector('.errorDiv');
const errorDivContent = document.querySelector('.content');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Input validation
    const word = wordInput.value.trim();
    if (word === "") {
        resultDiv.style.display = "none";
        errorAlert("Please enter a word.");
        return;
    }

    try {
        const response = await fetch(`${url}${word}`);
        const data = await response.json();
        console.log(data);

        if (data.title === "No Definitions Found") {
            resultDiv.style.display = "none";
            errorAlert("No Definitions Found");
            return;
        }

        // Display results
        resultDiv.style.display = "block";
        displayWordData(data);

    } catch (error) {
        errorAlert("An error occurred. Please try again later.");
        console.error(error);
    }

    wordInput.value = "";
});

function displayWordData(data) {
    resultDiv.innerHTML = `
        <h1 class="wordh1">${wordInput.value}</h1>
        <button class="volumeBtn"><i class="bi bi-volume-up-fill"></i></button>
        <span>${data[0].meanings[0].partOfSpeech} ${data[0].phonetic === undefined ? `<i>/Phonetic not available/</i>` : data[0].phonetic}</span>
        <p><b>meaning:</b> ${data[0].meanings[0].definitions[0].definition}</p>
        <p><b>Example:</b> ${data[0].meanings[0].definitions[0].example === undefined ? `<i>Not Available</i>` : data[0].meanings[0].definitions[0].example}</p>
        <p><b>Synonyms:</b></p>
        <ul class="ul">
            ${
                data[0].meanings[0].synonyms.length === 0
                    ? `<i>Not Available</i>`
                    : data[0].meanings[0].synonyms.map(synonym => `<li>${synonym}</li>`).join('')
            }
        </ul>

        <p><b>Antonyms:</b></p>
        <ul class="ul">
            ${
                data[0].meanings[0].antonyms.length === 0
                    ? `<i>Not Available</i>`
                    : data[0].meanings[0].antonyms.map(antonym => `<li>${antonym}</li>`).join('')
            }
        </ul>
    `;

    const volumeBtn = document.querySelector('.volumeBtn');

    try{
        if (data[0].phonetics[0].audio) {
            audio.src = data[0].phonetics[0].audio;
            volumeBtn.addEventListener('click', () => {
                audio.play();
            });
        } else{
            audio.src = '';
            console.log(audio)
            volumeBtn.addEventListener('click', () => {
                errorAlert("Audio Not Found");
            });
        }
    } catch(error){
        console.log(error.message);
        volumeBtn.addEventListener('click', () => {
            errorAlert("No Audio Found")
        });
    }
}

function errorAlert(message){
    errorDiv.classList.add('active');
    errorDivContent.textContent = message;
    setTimeout(()=>{
        errorDiv.classList.remove('active')
    }, 2000)
}