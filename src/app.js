import './style.css';
import './components.js';

function showLoading() {
  document.getElementById('loading-indicator').classList.add('show');
}

function hideLoading() {
  document.getElementById('loading-indicator').classList.remove('show');
}

async function fetchNotes() {
  const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
  const result = await response.json();
  console.log('HASIL FETCH:', result);
  return result.data;
}

function renderNotes(notes) {
  const notesContainer = document.getElementById('notes-container');
  notesContainer.innerHTML = '';

  notes.forEach(note => {
    const noteItem = document.createElement('note-item');
    noteItem.setAttribute('title', note.title);
    noteItem.setAttribute('body', note.body);
    noteItem.setAttribute('created-at', note.createdAt);
    noteItem.setAttribute('id', note.id);
    notesContainer.appendChild(noteItem);
  });
}

async function loadNotes() {
  showLoading();
  try {
    const notes = await fetchNotes();
    renderNotes(notes);
  } catch (error) {
    alert('Gagal memuat catatan.');
  }
  hideLoading();
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadNotes();
  document.addEventListener('note-added', loadNotes);
  document.addEventListener('note-deleted', loadNotes);
});
