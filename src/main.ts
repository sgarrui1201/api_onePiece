import { fromFetch } from 'rxjs/fetch'
import { from, of } from 'rxjs'
import { switchMap, catchError } from 'rxjs/operators'

interface Character {
  id: string
  nombre: string
  alias: string
  recompensa: number
  fruta: string | null
  rol: string
  tripulacion: string
  origenIslaId: string
}

interface Isla {
  id: string
  nombre: string
  mar: string
  descripcion: string
}

function fetchCharacters$() {
  return fromFetch('http://localhost:3001/personajes').pipe(
    switchMap(response => {
      if (response.ok) {
        return from(response.json() as Promise<Character[]>)
      } else {
        return of([] as Character[])
      }
    }),
    catchError(err => {
      console.error('Error al hacer fetch personajes:', err)
      return of([] as Character[])
    })
  )
}

function fetchIslas$() {
  return fromFetch('http://localhost:3001/islas').pipe(
    switchMap(response => {
      if (response.ok) {
        return from(response.json() as Promise<Isla[]>)
      } else {
        return of([] as Isla[])
      }
    }),
    catchError(err => {
      console.error('Error al hacer fetch islas:', err)
      return of([] as Isla[])
    })
  )
}

function createCharacterCard(character: Character): HTMLElement {
  const card = document.createElement('div')
  card.className = 'character-card'
  card.innerHTML = `
    <h2 class="character-name">${character.nombre} (${character.alias})</h2>
    <p><strong>Recompensa:</strong> ${character.recompensa.toLocaleString()} Berries</p>
    <p><strong>Fruta:</strong> ${character.fruta ?? 'Ninguna'}</p>
    <p><strong>Rol:</strong> ${character.rol}</p>
    <p><strong>Tripulación:</strong> ${character.tripulacion}</p>
  `
  return card
}

function createIslaCard(isla: Isla): HTMLElement {
  const card = document.createElement('div')
  card.className = 'isla-card'
  card.innerHTML = `
    <h2 class="isla-name">${isla.nombre}</h2>
    <p><strong>Mar:</strong> ${isla.mar}</p>
    <p>${isla.descripcion}</p>
  `
  return card
}

function main() {
  const app = document.getElementById('app')
  if (!app) {
    console.error('No se encontró el elemento #app')
    return
  }

  // Crear contenedor de botones
  const buttonContainer = document.createElement('div')
  buttonContainer.className = 'button-container'

  const btnPersonajes = document.createElement('button')
  btnPersonajes.textContent = 'Personajes'

  const btnIslas = document.createElement('button')
  btnIslas.textContent = 'Islas'

  buttonContainer.appendChild(btnPersonajes)
  buttonContainer.appendChild(btnIslas)
  app.innerHTML = '' // limpiar texto
  app.appendChild(buttonContainer)

  // Contenedor donde se mostrarán los datos
  const dataContainer = document.createElement('div')
  dataContainer.className = 'data-container'
  app.appendChild(dataContainer)

  btnPersonajes.addEventListener('click', () => {
    dataContainer.innerHTML = 'Cargando personajes...'
    fetchCharacters$().subscribe({
      next: personajes => {
        dataContainer.innerHTML = ''
        personajes.forEach(character => {
          const card = createCharacterCard(character)
          dataContainer.appendChild(card)
        })
      },
      error: err => {
        dataContainer.textContent = `Error al cargar personajes: ${err}`
      }
    })
  })

  btnIslas.addEventListener('click', () => {
    dataContainer.innerHTML = 'Cargando islas...'
    fetchIslas$().subscribe({
      next: islas => {
        dataContainer.innerHTML = ''
        islas.forEach(isla => {
          const card = createIslaCard(isla)
          dataContainer.appendChild(card)
        })
      },
      error: err => {
        dataContainer.textContent = `Error al cargar islas: ${err}`
      }
    })
  })
}

main()
