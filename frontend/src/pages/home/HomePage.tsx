import { useState } from 'react'
import { FaceaLogo } from '../../components/FaceaLogo'
import './HomePage.css'

export function HomePage() {
  // useState guarda un valor que cambia y hace que React vuelva a renderizar.
  // Acá lo usamos para repetir la animación del logo cada vez que apretás el botón.
  const [spinKey, setSpinKey] = useState(0)

  return (
    <main className="home-page">
      {/* main representa el contenido principal de la pantalla. */}
      <section className="home-card">
        <FaceaLogo spinKey={spinKey} />
        <h1>FACEA</h1>
        <p>Una base simple para empezar a entender componentes y comportamiento.</p>
        <button type="button" onClick={() => setSpinKey((current) => current + 1)}>
          Girar logo
        </button>
      </section>
    </main>
  )
}
