function showLoading() {
  document.getElementById('loading-indicator').classList.add('show');
}

function hideLoading() {
  document.getElementById('loading-indicator').classList.remove('show');
}

class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Notes App</h1>`;
  }
}
customElements.define('app-bar', AppBar);

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form id="noteForm">
        <input type="text" id="note-title" placeholder="Note Title" required />
        <textarea id="note-body" placeholder="Note Body" required></textarea>
        <button type="submit">Add Note</button>
      </form>
    `;

    this.querySelector('#noteForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = this.querySelector('#note-title').value;
      const body = this.querySelector('#note-body').value;

      showLoading();
      await fetch('https://notes-api.dicoding.dev/v2/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body })
      });
      hideLoading();

      this.querySelector('#noteForm').reset();
      document.dispatchEvent(new Event('note-added'));
    });
  }
}
customElements.define('note-form', NoteForm);

class NoteItem extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || 'Untitled';
    const body = this.getAttribute('body') || '';
    const createdAt = this.getAttribute('created-at') || new Date().toISOString();
    const id = this.getAttribute('id');

    this.innerHTML = `
      <div class="note-item">
        <h2>${title}</h2>
        <p>${body}</p>
        <small>${new Date(createdAt).toLocaleString()}</small>
        <button class="delete-btn">Hapus</button>
      </div>
    `;

    this.querySelector('.delete-btn').addEventListener('click', async () => {
      showLoading();
      await fetch(`https://notes-api.dicoding.dev/v2/notes/${id}`, {
        method: 'DELETE'
      });
      hideLoading();

      document.dispatchEvent(new Event('note-deleted'));
    });
  }
}
customElements.define('note-item', NoteItem);
