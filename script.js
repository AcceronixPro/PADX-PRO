
// Get DOM elements
const noteList = document.getElementById('note-list');
const addNoteBtn = document.getElementById('add-note-btn');
const noteEditor = document.getElementById('note-editor');
const noteTextarea = document.getElementById('note-textarea');
const saveNoteBtn = document.getElementById('save-note-btn');

// Initialize notes array from local storage
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let currentNoteIndex = -1;

// Add event listeners
addNoteBtn.addEventListener('click', () => {
  noteEditor.style.display = 'block';
  noteTextarea.focus();
  currentNoteIndex = -1;
});

noteList.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const noteIndex = Array.prototype.indexOf.call(noteList.children, e.target);
    currentNoteIndex = noteIndex;
    noteTextarea.value = notes[noteIndex];
    noteEditor.style.display = 'block';
  }
});

saveNoteBtn.addEventListener('click', () => {
  const noteText = noteTextarea.value.trim();
  if (noteText) {
    if (currentNoteIndex === -1) {
      notes.push(noteText);
    } else {
      notes[currentNoteIndex] = noteText;
    }
    saveNotesToLocalStorage();
    renderNoteList();
    noteTextarea.value = '';
    noteEditor.style.display = 'none';
  }
});

// Add swipe-to-delete event listener
noteList.addEventListener('touchstart', (e) => {
  const noteListItem = e.target.closest('li');
  if (noteListItem) {
    const startX = e.touches[0].clientX;
    noteListItem.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      if (endX - startX < -100) {
        const noteIndex = Array.prototype.indexOf.call(noteList.children, noteListItem);
        notes.splice(noteIndex, 1);
        saveNotesToLocalStorage();
        renderNoteList();
      }
    });
  }
});
// Display a toast notification when the note app is opened
window.onload = function() {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'Welcome to PADX ! Start typing to create a new note and slide left to delete .';
  document.body.appendChild(toast);
  
  // Auto-remove the toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
};


// Add an event listener to the save button
saveNoteBtn.addEventListener('click', () => {
  // Check if the button is being used to save or cancel
  if (saveNoteBtn.textContent === 'Save') {
    // Save the note
    const noteText = noteTextarea.value.trim();
    if (noteText) {
      if (currentNoteIndex === -1) {
        notes.push(noteText);
      } else {
        notes[currentNoteIndex] = noteText;
      }
      saveNotesToLocalStorage();
      renderNoteList();
      noteTextarea.value = '';
    }
  } else {
    // Cancel the note
    noteEditor.style.display = 'none';
    noteTextarea.value = '';
    currentNoteIndex = -1;
    saveNoteBtn.textContent = 'Save';
  }
  
  // Toggle the button text
  saveNoteBtn.textContent = saveNoteBtn.textContent === 'Save' ? 'Cancel' : 'Save';
});
		// Service worker
		if ('serviceWorker' in navigator) {
			window.addEventListener('load', () => {
				navigator.serviceWorker.register('service-worker.js').then(
					() => {
						
					},
					err => {
						console.log('❌ Service worker registration', err);
					}
				)
			});
		}

// Render note list
function renderNoteList() {
  noteList.innerHTML = '';
  notes.forEach((note, index) => {
    const noteListItem = document.createElement('li');
    noteListItem.textContent = note.substring(0, 50) + '...';
    noteList.appendChild(noteListItem);
  });
}

// Save notes to local storage
function saveNotesToLocalStorage() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Initialize note list
renderNoteList();
