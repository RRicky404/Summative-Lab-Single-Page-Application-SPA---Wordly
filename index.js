document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const input = document.getElementById('word-input');
  const resultsDiv = document.getElementById('results');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const word = input.value.trim();
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!word) {
      resultsDiv.textContent = 'Please enter a word.';
      return;
    }

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

      if (!res.ok) {
        throw new Error('Word not found');
      }

      const data = await res.json();
      const definition = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition found.';
      const partOfSpeech = data[0]?.meanings[0]?.partOfSpeech || 'Unknown';
      const example = data[0]?.meanings[0]?.definitions[0]?.example || 'No example available.';
      const phonetic = data[0]?.phonetic || 'No phonetic info';
      const audioObj = data[0]?.phonetics?.find(p => p.audio);
      const audio = audioObj ? audioObj.audio : null;

      resultsDiv.innerHTML = `
        <h2>${word}</h2>
        <p><strong>Phonetic:</strong> ${phonetic}</p>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
        <p><strong>Definition:</strong> ${definition}</p>
        <p><strong>Example:</strong> ${example}</p>
        ${audio ? `<button id="play-audio">🔊 Play Pronunciation</button>` : '<p>No audio available.</p>'}
      `;

      if (audio) {
        const playBtn = document.getElementById('play-audio');
        playBtn.addEventListener('click', () => {
          const audioPlayer = new Audio(audio);
          audioPlayer.play();
        });
      }
    } catch (err) {
      resultsDiv.textContent = 'Error fetching word. Please try another one.';
      console.error(err);
    }
  });
});