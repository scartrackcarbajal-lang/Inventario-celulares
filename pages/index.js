import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
// --- PASO 2A: Import Link (Next.js) ---
import Link from 'next/link'

export default function CatalogoPublico() {
  const [equipos, setEquipos] = useState([])
  // ====== V2: Listas separadas (celulares serializados + perfumes bulk) ======
  const [celulares, setCelulares] = useState([])
  const [perfumes, setPerfumes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const whatsappPropio = '51992571579'

  const theme = {
    navy: '#0b1426',
    card: '#162447',
    orange: '#f39c12',
    cyan: '#00d2ff',
    white: '#ffffff',
    muted: '#94a3b8',
    cardGlow: '0 0 20px rgba(0, 210, 255, 0.4)',
    buttonGradient: 'linear-gradient(to right, #00d2ff, #f39c12)',
  }

  // ====== CARGA V2: Celulares (por unidad) + Perfumes (por stock) ======
  const cargarEquipos = async () => {
    // 1) Celulares: 1 tarjeta por unidad (IMEI/serial)
    const { data: celData, error: celError } = await supabase
      .from('items_serializados')
      .select(`
        id,
        serial,
        estado,
        salud_bateria,
        almacenamiento,
        color,
        imagen_url,
        created_at,
        skus!inner(
          id,
          precio_venta,
          publicado,
          productos(
            marca,
            nombre
          )
        )
      `)
      .eq('skus.publicado', true)
      .eq('vendido', false)
      .order('created_at', { ascending: false })

    if (celError) {
      console.error('Error cargando celulares (items_serializados)', celError)
    } else {
      setCelulares(celData || [])
    }

    // 2) Perfumes: 1 tarjeta por SKU (cantidad)
    const { data: perfData, error: perfError } = await supabase
      .from('skus')
      .select(`
        id,
        sku_codigo,
        precio_venta,
        tracking,
        publicado,
        created_at,
        productos(marca, nombre),
        stock_bulk(stock)
      `)
      .eq('publicado', true)
      .eq('tracking', 'BULK')
      .order('created_at', { ascending: false })

    if (perfError) {
      console.error('Error cargando perfumes (skus + stock_bulk)', perfError)
    } else {
      setPerfumes(perfData || [])
    }
  }


  useEffect(() => {
    cargarEquipos()
  }, [])

  // ====== FILTROS V2 (busca en celulares + perfumes) ======
  const celularesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return celulares

    return celulares.filter((item) => {
      const marca = item?.skus?.productos?.marca?.toLowerCase() || ''
      const nombre = item?.skus?.productos?.nombre?.toLowerCase() || ''
      const estado = item?.estado?.toLowerCase() || ''
      return marca.includes(q) || nombre.includes(q) || estado.includes(q)
    })
  }, [celulares, busqueda])

  const perfumesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return perfumes

    return perfumes.filter((sku) => {
      const marca = sku?.productos?.marca?.toLowerCase() || ''
      const nombre = sku?.productos?.nombre?.toLowerCase() || ''
      return marca.includes(q) || nombre.includes(q)
    })
  }, [perfumes, busqueda])

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: theme.navy,
        minHeight: '100vh',
        color: theme.white,
        fontFamily: "'Inter', sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23162447' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
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
          .titulo-hub {
            font-size: 2.5rem !important;
          }
          .foto-item {
            height: 250px;
          }
          .grid-catalogo {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* HEADER RESPONSIVO */}
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h1 className="titulo-hub" style={{ fontSize: '4rem', fontWeight: '900', margin: 0 }}>
          LOS FARRUS <span style={{ color: theme.orange }}>HUB</span>
        </h1>
        <p style={{ color: theme.cyan, letterSpacing: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          CATÁLOGO OFICIAL
        </p>
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
            boxShadow: `0 0 15px ${theme.cyan}30`,
          }}
        />
      </div>

      {/* LISTADO DE EQUIPOS */}
      <div className="grid-catalogo">
        {/* ====== CELULARES (SERIALIZADOS): 1 tarjeta por unidad ====== */}
        {celularesFiltrados.map((item) => {
          const marca = item?.skus?.productos?.marca || ''
          const nombre = item?.skus?.productos?.nombre || ''
          const precio = item?.skus?.precio_venta ?? ''
          const titulo = `${marca} ${nombre}`.trim()

          return (
            <div
              key={`cel-${item.id}`}
              style={{
                backgroundColor: theme.card,
                borderRadius: '30px',
                overflow: 'hidden',
                border: `1px solid ${theme.cyan}60`,
                boxShadow: theme.cardGlow,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* GALERÍA DESLIZABLE */}
              <div className="galeria-scroll">
                {Array.isArray(item.imagen_url) && item.imagen_url.length > 0 ? (
                  item.imagen_url.map((url, i) => (
                    <img key={i} src={url} className="foto-item" alt={`${titulo} foto ${i + 1}`} />
                  ))
                ) : (
                  <img
                    src="https://via.placeholder.com/400x300/0b1426/ffffff?text=FARRUS+HUB"
                    className="foto-item"
                    alt="Sin foto"
                  />
                )}
              </div>

              <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{titulo}</h3>
                  <span
                    style={{
                      backgroundColor: theme.orange,
                      padding: '4px 10px',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.estado || 'Equipo'}
                  </span>
                </div>

                <p style={{ color: theme.cyan, fontWeight: 'bold', margin: '10px 0' }}>
                  💾 {item.almacenamiento || '—'}
                  {item.salud_bateria ? ` | 🔋 ${item.salud_bateria}%` : ''}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900' }}>S/ {precio}</span>

                  <Link
                    href={`/detalles/${item.id}?tipo=serial`}
                    style={{
                      padding: '12px 20px',
                      background: theme.buttonGradient,
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)',
                    }}
                  >
                    Ver Detalles 📱
                  </Link>
                </div>
              </div>

              {/* Indicador si hay más de 1 foto */}
              {Array.isArray(item.imagen_url) && item.imagen_url.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '260px',
                    width: '100%',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(0,0,0,0.6)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.6rem',
                    }}
                  >
                    Desliza para ver más ↔️
                  </span>
                </div>
              )}
            </div>
          )
        })}

        {/* ====== PERFUMES (BULK): 1 tarjeta por SKU ====== */}
        {perfumesFiltrados.map((sku) => {
          const marca = sku?.productos?.marca || ''
          const nombre = sku?.productos?.nombre || ''
          const stock = sku?.stock_bulk?.stock ?? 0
          const titulo = `${marca} ${nombre}`.trim()

          return (
            <div
              key={`perf-${sku.id}`}
              style={{
                backgroundColor: theme.card,
                borderRadius: '30px',
                overflow: 'hidden',
                border: `1px solid ${theme.cyan}60`,
                boxShadow: theme.cardGlow,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{titulo}</h3>

                <p style={{ color: theme.muted, fontSize: '0.9rem', margin: '12px 0 18px' }}>
                  Stock: {stock}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900' }}>S/ {sku.precio_venta}</span>

                  <Link
                    href={`/detalles/${sku.id}?tipo=bulk`}
                    style={{
                      padding: '12px 20px',
                      background: theme.buttonGradient,
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)',
                    }}
                  >
                    Ver Detalles 🧴
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <footer style={{ textAlign: 'center', padding: '60px 20px', color: theme.muted, fontSize: '0.8rem' }}>
        © 2026 LOS FARRUS HUB | TECNOLOGÍA PREMIUM EN PERÚ
      </footer>
    </div>
  )
}
