import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CatalogoPublico() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const whatsappPropio = "51992571579" 

  const theme = { 
    navy: '#0b1426', 
    card: '#162447', 
    orange: '#f39c12', 
    cyan: '#00d2ff', 
    white: '#ffffff', 
    muted: '#94a3b8',
    cardGlow: '0 0 20px rgba(0, 210, 255, 0.4)',
    buttonGradient: 'linear-gradient(to right, #00d2ff, #f39c12)'
  }

    const cargarEquipos = async () => {
    const { data, error } = await supabase
      .from('Celulares')
      .select(`
        id,
        marca,
        modelo,
        estado,
        precio_venta,
        almacenamiento,
        salud_bateria,
        descripcion,
        color,
        imagen_url,
        created_at,
        stock,
        publicado
      `)
      .eq('publicado', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando catálogo', error)
      return
    }

    setEquipos(data || [])
  }

  useEffect(() => { cargarEquipos() }, [])

  const equiposFiltrados = equipos.filter(cel => 
    cel.modelo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    cel.marca?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: theme.navy, 
      minHeight: '100vh', 
      color: theme.white, 
      fontFamily: "'Inter', sans-serif",
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23162447' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
    }}>
      
      {/* Estilos Dinámicos para Scroll y Responsividad */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        /* Galería para PC y Móvil */
        .galeria-scroll {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: ${theme.cyan} transparent;
        }

        /* Estilo de la barra de scroll para PC (Chrome/Edge/Safari) */
        .galeria-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .galeria-scroll::-webkit-scrollbar-thumb {
          background: ${theme.cyan};
          border-radius: 10px;
        }

        .foto-item {
          flex: 0 0 100%;
          scroll-snap-align: start;
          object-fit: cover;
          height: 300px; /* Altura fija para mantener proporción */
        }

        /* Ajustes de cuadrícula responsiva */
        .grid-catalogo {
          display: grid;
          gap: 30px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          max-width: 1400px;
          margin: auto;
        }

        @media (max-width: 600px) {
          .titulo-hub { font-size: 2.5rem !important; }
          .foto-item { height: 250px; }
          .grid-catalogo { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HEADER RESPONSIVO */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 className="titulo-hub" style={{ fontSize: '4rem', fontWeight: '900', margin: 0 }}>
          LOS FARRUS <span style={{ color: theme.orange }}>HUB</span>
        </h1>
        <p style={{ color: theme.cyan, letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>CATÁLOGO OFICIAL</p>
      </div>

      {/* BUSCADOR RESPONSIVO */}
      <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'center' }}>
        <input 
          placeholder="🔍 ¿Qué celular buscas?" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ 
            width: '90%', 
            maxWidth: '600px', 
            padding: '18px 25px', 
            borderRadius: '50px', 
            backgroundColor: theme.card, 
            border: `2px solid ${theme.cyan}`, 
            color: theme.white, 
            fontSize: '1.1rem', 
            outline: 'none',
            boxShadow: `0 0 15px ${theme.cyan}30`
          }} 
        />
      </div>

      {/* LISTADO DE EQUIPOS */}
      <div className="grid-catalogo">
        {equiposFiltrados.map(cel => (
          <div key={cel.id} style={{ 
            backgroundColor: theme.card, 
            borderRadius: '30px', 
            overflow: 'hidden', 
            border: `1px solid ${theme.cyan}60`, 
            boxShadow: theme.cardGlow,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            
            {/* GALERÍA DESLIZABLE */}
            <div className="galeria-scroll">
              {Array.isArray(cel.imagen_url) && cel.imagen_url.length > 0 ? (
                cel.imagen_url.map((url, i) => (
                  <img key={i} src={url} className="foto-item" alt={`${cel.modelo} vista ${i+1}`} />
                ))
              ) : (
                <img src='https://via.placeholder.com/400x300/0b1426/ffffff?text=FARRUS+HUB' className="foto-item" />
              )}
            </div>

            {/* CONTENIDO DE LA TARJETA */}
            <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{cel.marca} {cel.modelo}</h3>
                <span style={{ backgroundColor: theme.orange, padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  {cel.estado}
                </span>
              </div>
              
              <p style={{ color: theme.cyan, fontWeight: 'bold', margin: '10px 0' }}>💾 {cel.almacenamiento}{cel.salud_bateria && ` | 🔋 ${cel.salud_bateria}%`}</p>
              
              <p style={{ color: theme.muted, fontSize: '0.85rem', marginBottom: '20px', flex: 1 }}>
                {cel.descripcion || "Calidad garantizada en LOS FARRUS HUB."}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900' }}>S/ {cel.precio_venta}</span>
                
                <a 
                  href={`https://wa.me/${whatsappPropio}?text=Hola! Me interesa el ${cel.marca} ${cel.modelo}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    padding: '12px 20px', 
                    background: theme.buttonGradient, 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '50px', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)'
                  }}
                >
                  Ver Detalles 📱
                </a>
              </div>
            </div>

            {/* Indicador visual para PC/Móvil */}
            {cel.imagen_url?.length > 1 && (
              <div style={{ 
                position: 'absolute', 
                top: '260px', 
                width: '100%', 
                textAlign: 'center', 
                pointerEvents: 'none' 
              }}>
                <span style={{ background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.6rem' }}>
                   Desliza para ver más ↔️
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <footer style={{ textAlign: 'center', padding: '60px 20px', color: theme.muted, fontSize: '0.8rem' }}>
        © 2026 LOS FARRUS HUB | TECNOLOGÍA PREMIUM EN PERÚ
      </footer>
    </div>
  )
}