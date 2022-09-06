class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || []
    this.pinnedNotes = []
    this.title = ""
    this.text = ""
    this.id = ""

    this.$notesPinned = document.querySelector("#notes-pinned")
    this.$notesOthers = document.querySelector("#notes-others")
    this.$placeholder = document.querySelector("#placeholder")
    this.$notesPinnedTitle = document.querySelector(".notes-pinned")
    this.$notesOthersTitle = document.querySelector(".notes-others")
    this.$form = document.querySelector("#form")
    this.$noteTitle = document.querySelector("#form--note-title")
    this.$noteText = document.querySelector("#form--note-text")
    this.$formButtons = document.querySelector("#form-buttons")
    this.$closeFormButton = document.querySelector("#form-close-button")
    this.$modal = document.querySelector(".modal")
    this.$modalContent = document.querySelector(".modal-content")
    this.$modalTitle = document.querySelector(".modal-title")
    this.$modalText = document.querySelector(".modal-text")
    this.$modalCloseButton = document.querySelector(".modal-close-button")
    this.$colorTooltip = document.querySelector("#color-tooltip")
    this.$colorSelector = document.querySelector("input[type=color]")


    this.render()
    this.addEventListeners()
  }

  addEventListeners() {
    document.body.addEventListener("click", event => {
      this.handleFormClick(event)
      this.selectNote(event)
      this.openModal(event)
      this.deleteNote(event)
      this.pinNote(event)
    })

    document.body.addEventListener("mouseover", event => {
      event.stopPropagation()
      this.openTooltip(event)
    })

    document.body.addEventListener("click", event => {
      this.closeTooltip(event)
    })

    this.$colorTooltip.addEventListener("mouseover", function() {
      // this.style.display = "flex"
    })

    this.$colorTooltip.addEventListener("mouseout", function() {
      // this.style.display = "none"
    })

    this.$colorSelector.addEventListener("input", event => {
      const color = (event.target.value)
      this.editColorNote(color)
    })

    this.$colorTooltip.addEventListener("click", event => {
      const color = event.target.dataset.color
      if (color) {
        this.editColorNote(color)
      }
    })

    this.$form.addEventListener("submit", event => {
      event.preventDefault()
      const title = this.$noteTitle.value
      const text = this.$noteText.value
      const hasNote = title || text
      
      if (hasNote) {
        this.addNote({ title, text })
      }
    })

    this.$closeFormButton.addEventListener("click", event => {
      event.stopPropagation()
      this.closeForm()
    })

    this.$modalCloseButton.addEventListener("click", event => {
      this.closeModal(event)
    })
  }
  
  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target)
    const title = this.$noteTitle.value
    const text = this.$noteText.value
    const hasNote = title || text
    
    if (isFormClicked) {
      this.openForm()
    } else if (hasNote) {
      this.addNote({ title, text })
    } else {
      this.closeForm()
    }
  }

  openForm() {
    this.$form.classList.add("form-open")
    this.$noteTitle.style.display = "block"
    this.$formButtons.style.display = "block"
  }

  closeForm() {
    this.$form.classList.remove("#form-open")
    this.$noteTitle.style.display = "none"
    this.$formButtons.style.display = "none"
    this.$noteTitle.value = ""
    this.$noteText.value = ""
  }

  openModal(event) {
    if(event.target.matches(".fa-trash")) return
    if(event.target.matches(".fa-thumbtack")) return
    if(event.target.matches(".fa-palette")) return

    if (event.target.closest(".note")) {
      this.$modal.classList.toggle("open-modal")
      this.$modalTitle.value = this.title
      this.$modalText.value = this.text
      // console.log(typeof this.id)
      // console.log(notes[0].id)
      const colorOfNote = this.notes.find(note => note.id == Number(this.id)).color
      console.log(Boolean(colorOfNote))
      console.log(document.body.style)
      this.$modalContent.style.backgroundColor = colorOfNote 

    }
  }
  
  closeModal() {
    this.editNote()
    this.$modal.classList.toggle("open-modal")
  }

  openTooltip(event) {
    if (!event.target.matches(".fa-palette")) return
    this.id = event.target.dataset.id
    const noteCoordinates = event.target.getBoundingClientRect()
    const horizontal = noteCoordinates.left + window.scrollX - 100
    const vertical = noteCoordinates.top + window.scrollY
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`
    this.$colorTooltip.style.display = "flex"
  }

  closeTooltip(event) {
    if (event.target.closest("#color-tooltip")) return
    this.$colorTooltip.style.display = "none"
    
  }

  addNote( {title, text }) {
    const newNote = {
      title,
      text,
      color: "inherit",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
      pinned: false
    }
    this.notes =  [...this.notes, newNote]
    this.render()
    this.closeForm()
  }

  editNote() {
    const title = this.$modalTitle.value
    const text = this.$modalText.value
    this.notes = this.notes.map(note => 
      note.id === Number(this.id) ? { ...note, title, text } : note
    )
    this.render()
  }

  editColorNote(color) {
    this.notes = this.notes.map(note => 
      note.id === Number(this.id) ? { ...note, color } : note)
    this.render()
  }

  selectNote(event) {
    const $selectedNote = event.target.closest(".note")
    if (!$selectedNote) return
    const [$noteTitle, $noteText] = $selectedNote.children
    this.title = $noteTitle.innerText
    this.text = $noteText.innerText
    this.id = $selectedNote.dataset.id
  }

  deleteNote(event) {
    event.stopPropagation()
    if (!event.target.matches(".fa-trash")) return
    const id = event.target.dataset.id 
    this.notes = this.notes.filter(note => note.id !== Number(id))
    this.render()
  }

  pinNote(event) {
    if (!event.target.matches(".fa-thumbtack")) return
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? { ...note, pinned: !note.pinned } : note)
    this.render()
  }
    

  render() {
    this.saveNotes()
    this.displayNotes()
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes))
  }

  getNotesHtml(note) {
    return `
    <div style="background: ${note.color};" class="note" data-id="${note.id}">
      <div class=" ${note.title && "note-title"}">${note.title}</div>
      <div class="note-text">${note.text}</div>
      <div class="toolbar">
        <i class="toolbar-icons fa-solid fa-palette" data-id=${note.id}></i>
        <i class="toolbar-icons fa-solid fa-trash" data-id=${note.id}></i>
        <i class="toolbar-icons fa-solid fa-thumbtack" data-id=${note.id}></i>
      </div>
    </div>
  `
  }

  displayNotes() {
    const pinnedNotes = this.notes.filter(note => note.pinned)
    const otherNotes = this.notes.filter(note => !note.pinned)

    const hasNotes = this.notes.length > 0 
    const hasPinnedNotes = pinnedNotes.length > 0
    const hasOtherNotes = otherNotes.length > 0

    this.$placeholder.style.display = hasNotes ? "none" : "block"

    if (hasPinnedNotes && hasOtherNotes) {
      this.$notesPinnedTitle.style.display = "block"
      this.$notesOthersTitle.style.display = "block"
    } else {
      this.$notesPinnedTitle.style.display = "none"
      this.$notesOthersTitle.style.display = "none"
    }
    
    if (hasPinnedNotes) {
      this.$notesPinnedTitle.style.display = "block"
    }


    this.$notesPinned.innerHTML = pinnedNotes.map(item => this.getNotesHtml(item)).join("")
    this.$notesOthers.innerHTML = otherNotes.map(item => this.getNotesHtml(item)).join("")
  }

}



new App()