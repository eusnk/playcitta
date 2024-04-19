import '/style.css'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, remove } from 'firebase/database'

const firebaseConfig = { databaseURL: 'https://playcitta-default-rtdb.firebaseio.com/' }

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const refdb = ref(database, 'mascotas')
const newDate = new Date()
const date = newDate.toLocaleDateString()
const time = `${newDate.getHours()}:${newDate.getMinutes() < 10 ? '0' : ''}${newDate.getMinutes()}`

const inputFieldEl = document.getElementById('input-field')
const addButtonEl = document.getElementById('add-button')
const dogListEl = document.getElementById('dog-list')

function clearInputFieldEl() {
  inputFieldEl.value = ''
}

function cleardogListEl() {
  dogListEl.innerHTML = ''
}

addButtonEl.addEventListener('click', function () {
  let inputValue = inputFieldEl.value
  if (inputValue.length < 3) {
    alert('ingresa un nombre')
  } else {
    push(
      refdb,
      `<p class='xs'>${date} a las ${time}</p>
      <p><strong>${inputValue}</strong> está buscando con quien jugar.</p>
      <a id="removebutton" class="btn">click aquí para eliminar</a>`,
    )
  }
  clearInputFieldEl()
})

onValue(refdb, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val())
    cleardogListEl()
    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i]
      appendItemToPlayCittaEl(currentItem)
    }
  } else {
    dogListEl.innerHTML = 'Ninguna mascota, aún...'
  }
})

function appendItemToPlayCittaEl(item) {
  let itemID = item[0]
  let itemValue = item[1]
  let newEl = document.createElement('li')
  newEl.innerHTML = `${itemValue}`
  newEl.addEventListener('click', function (e) {
    if (e.target.id === 'removebutton') {
      let exactLocationOfItemInDB = ref(database, `mascotas/${itemID}`)
      remove(exactLocationOfItemInDB)
    }
  })
  dogListEl.prepend(newEl)
}
