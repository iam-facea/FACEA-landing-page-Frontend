import faceaLogo from '../assets/FACEA LOGO.png'
import './FaceaLogo.css'

interface FaceaLogoProps {
  spinKey: number
}

export function FaceaLogo({ spinKey }: FaceaLogoProps) {
  // Este componente solo se ocupa de mostrar el logo.
  // La key cambia para que el navegador reinicie la animación CSS.
  return (
    <img
      key={spinKey}
      className="facea-logo"
      src={faceaLogo}
      alt="Logo de FACEA"
    />
  )
}
