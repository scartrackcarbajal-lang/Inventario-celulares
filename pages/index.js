import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function CatalogoPublico() {
  const [celulares, setCelulares] = useState([])
  const [accesorios, setAccesorios] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  // --- PALETA DE COLORES REFINADA ---
  const theme = {
    bg: '#050a14', // Fondo ultra oscuro
    cardBg: 'rgba(22, 36, 71, 0.7)', // Vidrio oscuro
    cyan: '#00f2ff', // Cyan neón más brillante
    orange: '#ff9d00', // Naranja intenso
    text: '#ffffff',
    textMuted: '#94a3b8',
    gradientText: 'linear-gradient(to right, #00f2ff, #ff9d00)',
    gradientButton: 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)',
    shadowGlow: '0 0 25px rgba(0, 242, 255, 0.15)',
  }

  // ====== CARGA DE DATOS ======
  const cargarEquipos = async () => {
    setCargando(true)
    
    // 1) Celulares
    const { data: celData } = await supabase
      .from('items_serializados')
      .select(`
        id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, created_at,
        skus!inner( id, precio_venta, publicado, productos(marca, nombre) )
      `)
      .eq('skus.publicado', true)
      .eq('vendido', false)
      .order('created_at', { ascending: false })

    if (celData) setCelulares(celData)

    // 2) Accesorios
    const { data: accData } = await supabase
      .from('skus')
      .select(`
        id, sku_codigo, precio_venta, tracking, publicado, created_at,
        productos(marca, nombre),
        stock_bulk(stock)
      `)
      .eq('publicado', true)
      .eq('tracking', 'BULK')
      .order('created_at', { ascending: false })

    if (accData) setAccesorios(accData)
    setCargando(false)
  }

  useEffect(() => {
    cargarEquipos()
  }, [])

  // ====== FILTROS ======
  const celularesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return celulares
    return celulares.filter((item) => {
      const txt = `${item?.skus?.productos?.marca} ${item?.skus?.productos?.nombre} ${item?.estado}`.toLowerCase()
      return txt.includes(q)
    })
  }, [celulares, busqueda])

  const accesoriosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return accesorios
    return accesorios.filter((sku) => {
      const txt = `${sku?.productos?.marca} ${sku?.productos?.nombre}`.toLowerCase()
      return txt.includes(q)
    })
  }, [accesorios, busqueda])

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', fontFamily: "'Inter', sans-serif", paddingBottom: 60 }}>
      
      {/* --- ESTILOS CSS GLOBALES PARA ANIMACIONES --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        
        body { margin: 0; padding: 0; background: #050a14; }

        /* Scrollbar oculta pero funcional */
        .galeria-scroll {
          display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
        }
        .galeria-scroll::-webkit-scrollbar { display: none; }
        
        .foto-item {
          flex: 0 0 100%; scroll-snap-align: center; object-fit: cover; height: 320px;
          transition: transform 0.3s;
        }

        /* Animación Hover Tarjeta */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 242, 255, 0.2);
          border-color: rgba(0, 242, 255, 0.5) !important;
        }

        /* Texto Gradiente */
        .text-gradient {
          background: ${theme.gradientText};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Grid Responsivo */
        .grid-catalogo {
          display: grid; gap: 30px; 
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          max-width: 1200px; margin: 0 auto; padding: 0 20px;
        }

        /* Input Glass */
        .input-glass:focus {
          border-color: ${theme.cyan} !important;
          box-shadow: 0 0 20px rgba(0, 242, 255, 0.3);
          background: rgba(22, 36, 71, 0.9) !important;
        }
      `}</style>

      {/* === HEADER HERO SECTION === */}
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px 40px', 
        background: `radial-gradient(circle at center, #1a2a50 0%, #050a14 70%)` 
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>
          LOS FARRUS <span className="text-gradient">HUB</span>
        </h1>
        <p style={{ color: theme.textMuted, fontSize: '0.9rem', letterSpacing: '4px', textTransform: 'uppercase', marginTop: 10, fontWeight: 600 }}>
          Catálogo Premium
        </p>

        {/* BUSCADOR FLOTANTE */}
        <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
          <input
            className="input-glass"
            placeholder="🔍 Buscar iPhone, Samsung, Accesorios..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%', maxWidth: '500px', padding: '18px 30px', borderRadius: '50px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white', fontSize: '1.1rem', outline: 'none',
              backdropFilter: 'blur(10px)', transition: 'all 0.3s'
            }}
          />
        </div>
      </div>

      {/* === CONTENIDO === */}
      {cargando ? (
        <div style={{ textAlign: 'center', color: theme.cyan, marginTop: 50, fontSize: '1.2rem' }}>Cargando inventario...</div>
      ) : (
        <>
          {/* SECCIÓN 1: CELULARES */}
          {celularesFiltrados.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ maxWidth: 1200, margin: '0 auto 25px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 15 }}>
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>Equipos Disponibles</h2>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              <div className="grid-catalogo">
                {celularesFiltrados.map((item) => {
                  const titulo = `${item?.skus?.productos?.marca} ${item?.skus?.productos?.nombre}`
                  return (
                    <div key={item.id} className="card-hover" style={{
                      backgroundColor: theme.cardBg, borderRadius: 24, overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
                      display: 'flex', flexDirection: 'column'
                    }}>
                      {/* FOTO + BADGE */}
                      <div style={{ position: 'relative' }}>
                        <div className="galeria-scroll">
                          {item.imagen_url?.length > 0 ? (
                            item.imagen_url.map((url, i) => <img key={i} src={url} className="foto-item" />)
                          ) : (
                            <div style={{ height: 320, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#02050a', color: '#333' }}>Sin Foto</div>
                          )}
                        </div>
                        {/* Badge de Estado */}
                        <div style={{
                          position: 'absolute', top: 15, right: 15,
                          background: item.estado === 'Nuevo Sellado' ? theme.cyan : theme.orange,
                          color: '#000', padding: '6px 14px', borderRadius: 20,
                          fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                        }}>
                          {item.estado}
                        </div>
                      </div>

                      {/* INFO CARD */}
                      <div style={{ padding: 25, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 5px', fontSize: '1.4rem', color: 'white' }}>{titulo}</h3>
                        
                        {/* Specs */}
                        <div style={{ display: 'flex', gap: 10, fontSize: '0.9rem', color: theme.cyan, fontWeight: 600, marginBottom: 20 }}>
                          <span>💾 {item.almacenamiento}</span>
                          {item.salud_bateria && <span>• 🔋 {item.salud_bateria}%</span>}
                        </div>

                        {/* Footer Card */}
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '0.7rem', color: theme.textMuted }}>PRECIO</span>
                            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>S/ {item.skus.precio_venta}</span>
                          </div>
                          
                          <Link href={`/detalles/${item.id}?tipo=serial`} style={{
                            padding: '12px 24px', background: theme.text, color: '#000',
                            borderRadius: 50, textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem',
                            boxShadow: '0 5px 15px rgba(255,255,255,0.2)', transition: 'transform 0.2s'
                          }}>
                            Ver →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* SECCIÓN 2: ACCESORIOS */}
          {accesoriosFiltrados.length > 0 && (
            <div style={{ marginTop: 80 }}>
              <div style={{ maxWidth: 1200, margin: '0 auto 25px', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 15 }}>
                <span style={{ fontSize: '1.5rem' }}>🎧</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', margin: 0 }}>Accesorios & Varios</h2>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              <div className="grid-catalogo">
                {accesoriosFiltrados.map((sku) => {
                  const stock = sku?.stock_bulk?.[0]?.stock ?? 0
                  if (stock <= 0) return null

                  return (
                    <div key={sku.id} className="card-hover" style={{
                      backgroundColor: theme.cardBg, borderRadius: 24, padding: 30,
                      border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
                      display: 'flex', flexDirection: 'column', position: 'relative'
                    }}>
                      {/* Borde Izquierdo Decorativo */}
                      <div style={{ position: 'absolute', left: 0, top: 20, bottom: 20, width: 4, background: theme.cyan, borderRadius: '0 5px 5px 0' }}></div>

                      <div style={{ marginBottom: 15 }}>
                        <span style={{ color: theme.textMuted, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {sku.productos.marca}
                        </span>
                        <h3 style={{ margin: '5px 0 0', fontSize: '1.5rem', color: 'white' }}>{sku.productos.nombre}</h3>
                      </div>

                      <div style={{ display: 'inline-block', background: 'rgba(0, 242, 255, 0.1)', color: theme.cyan, padding: '5px 12px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 25 }}>
                        ✓ {stock} en Stock
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>S/ {sku.precio_venta}</span>
                        <Link href={`/detalles/${sku.id}?tipo=bulk`} style={{
                          color: theme.cyan, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem'
                        }}>
                          Ver Stock →
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {celularesFiltrados.length === 0 && accesoriosFiltrados.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: theme.textMuted }}>
              <div style={{ fontSize: '3rem', marginBottom: 20, opacity: 0.5 }}>🕵️‍♂️</div>
              <h2 style={{ color: 'white' }}>No encontramos lo que buscas</h2>
              <p>Prueba buscando "iPhone", "Cargador" o "Samsung"</p>
            </div>
          )}
        </>
      )}

      <footer style={{ textAlign: 'center', color: theme.textMuted, fontSize: '0.8rem', padding: '80px 20px 40px', opacity: 0.6 }}>
        © 2026 LOS FARRUS HUB — Ecuador
      </footer>
    </div>
  )
}