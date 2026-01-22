import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function CatalogoPublico() {
  const [celulares, setCelulares] = useState([])
  const [accesorios, setAccesorios] = useState([]) // Antes "perfumes", ahora genérico
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)

  const theme = {
    navy: '#0b1426',
    card: '#162447',
    orange: '#f39c12',
    cyan: '#00d2ff',
    white: '#ffffff',
    muted: '#94a3b8',
    cardGlow: '0 0 20px rgba(0, 210, 255, 0.15)',
    buttonGradient: 'linear-gradient(to right, #00d2ff, #f39c12)',
  }

  // ====== CARGA DE DATOS ======
  const cargarEquipos = async () => {
    setCargando(true)
    
    // 1) Celulares (Serializados)
    const { data: celData, error: celError } = await supabase
      .from('items_serializados')
      .select(`
        id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, created_at,
        skus!inner(
          id, precio_venta, publicado,
          productos(marca, nombre)
        )
      `)
      .eq('skus.publicado', true)
      .eq('vendido', false)
      .order('created_at', { ascending: false })

    if (celError) console.error('Error celulares:', celError)
    else setCelulares(celData || [])

    // 2) Accesorios (Bulk - Fundas, Cargadores, etc.)
    const { data: accData, error: accError } = await supabase
      .from('skus')
      .select(`
        id, sku_codigo, precio_venta, tracking, publicado, created_at,
        productos(marca, nombre),
        stock_bulk(stock)
      `)
      .eq('publicado', true)
      .eq('tracking', 'BULK')
      .order('created_at', { ascending: false })

    if (accError) console.error('Error accesorios:', accError)
    else setAccesorios(accData || [])

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
    <div
      style={{
        padding: '20px',
        backgroundColor: theme.navy,
        minHeight: '100vh',
        color: theme.white,
        fontFamily: "'Inter', sans-serif",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23162447' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        .galeria-scroll {
          display: flex; overflow-x: auto; scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch; scrollbar-width: none; /* Ocultar scrollbar */
        }
        .foto-item {
          flex: 0 0 100%; scroll-snap-align: start; object-fit: cover; height: 280px;
        }
        .grid-catalogo {
          display: grid; gap: 30px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          max-width: 1400px; margin: auto;
        }
        .seccion-titulo {
            font-size: 1.5rem; font-weight: 800; color: ${theme.cyan}; 
            margin: 40px auto 20px; max-width: 1400px; padding-left: 10px;
            border-left: 5px solid ${theme.orange}; display: flex; align-items: center; gap: 10px;
        }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', margin: '40px 0 20px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0, lineHeight: 1 }}>
          LOS FARRUS <span style={{ color: theme.orange }}>HUB</span>
        </h1>
        <p style={{ color: theme.cyan, letterSpacing: '3px', fontWeight: 'bold', fontSize: '0.8rem', marginTop: 10 }}>
          CATÁLOGO OFICIAL
        </p>
      </div>

      {/* BUSCADOR */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <input
          placeholder="🔍 Buscar equipos o accesorios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '90%', maxWidth: '600px', padding: '16px 25px', borderRadius: '50px',
            backgroundColor: 'rgba(22, 36, 71, 0.8)', border: `1px solid ${theme.cyan}`,
            color: theme.white, fontSize: '1.1rem', outline: 'none',
            backdropFilter: 'blur(5px)', boxShadow: `0 0 20px ${theme.cyan}22`
          }}
        />
      </div>

      {cargando ? (
        <div style={{textAlign: 'center', marginTop: 50}}>Cargando catálogo...</div>
      ) : (
        <>
          {/* ====== SECCIÓN 1: CELULARES ====== */}
          {celularesFiltrados.length > 0 && (
            <>
              <div className="seccion-titulo">📱 CELULARES Y EQUIPOS</div>
              <div className="grid-catalogo">
                {celularesFiltrados.map((item) => {
                  const titulo = `${item?.skus?.productos?.marca} ${item?.skus?.productos?.nombre}`
                  return (
                    <div key={item.id} style={{ backgroundColor: theme.card, borderRadius: '24px', overflow: 'hidden', border: `1px solid ${theme.cyan}44`, boxShadow: theme.cardGlow, display: 'flex', flexDirection: 'column' }}>
                      
                      {/* FOTOS */}
                      <div className="galeria-scroll" style={{ position: 'relative' }}>
                        {item.imagen_url?.length > 0 ? (
                          item.imagen_url.map((url, i) => (
                            <img key={i} src={url} className="foto-item" alt="foto" />
                          ))
                        ) : (
                          <div style={{height: 280, display: 'grid', placeItems: 'center', background: '#050a14', color: '#555'}}>Sin Foto</div>
                        )}
                        {/* Etiqueta Estado */}
                        <div style={{ position: 'absolute', top: 15, right: 15, background: theme.orange, color: 'white', padding: '4px 12px', borderRadius: 8, fontWeight: 'bold', fontSize: '0.75rem', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                          {item.estado}
                        </div>
                      </div>

                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 5px', fontSize: '1.3rem' }}>{titulo}</h3>
                        <div style={{ color: theme.cyan, fontSize: '0.9rem', marginBottom: 15, fontWeight: 'bold' }}>
                          💾 {item.almacenamiento} {item.salud_bateria && `| 🔋 ${item.salud_bateria}%`}
                        </div>
                        
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.6rem', fontWeight: '900' }}>S/ {item.skus.precio_venta}</span>
                          <Link href={`/detalles/${item.id}?tipo=serial`} style={{ padding: '10px 20px', background: theme.buttonGradient, color: 'white', textDecoration: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            Ver Detalles
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ====== SECCIÓN 2: ACCESORIOS (BULK) ====== */}
          {accesoriosFiltrados.length > 0 && (
            <>
              <div className="seccion-titulo" style={{ marginTop: 60 }}>🎧 ACCESORIOS Y OTROS</div>
              <div className="grid-catalogo">
                {accesoriosFiltrados.map((sku) => {
                  const titulo = `${sku?.productos?.marca} ${sku?.productos?.nombre}`
                  // FIX: Supabase devuelve array en join, tomamos el primero o 0
                  const stock = sku?.stock_bulk?.[0]?.stock ?? 0

                  // Si no hay stock, no mostramos (opcional)
                  if (stock <= 0) return null

                  return (
                    <div key={sku.id} style={{ backgroundColor: theme.card, borderRadius: '24px', padding: '25px', border: `1px solid ${theme.cyan}44`, boxShadow: theme.cardGlow, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: 6, height: '100%', background: theme.orange }}></div>
                      
                      <h3 style={{ margin: '0 0 10px', fontSize: '1.4rem' }}>{titulo}</h3>
                      <p style={{ color: theme.muted, fontSize: '0.9rem', marginBottom: 20 }}>
                        Disponibles: <span style={{ color: 'white', fontWeight: 'bold' }}>{stock} unidades</span>
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: '900' }}>S/ {sku.precio_venta}</span>
                        <Link href={`/detalles/${sku.id}?tipo=bulk`} style={{ padding: '10px 20px', background: theme.navy, border: `1px solid ${theme.cyan}`, color: theme.cyan, textDecoration: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          Ver Stock
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {celularesFiltrados.length === 0 && accesoriosFiltrados.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: 60, color: theme.muted }}>
              <h2>No encontramos resultados 🕵️‍♂️</h2>
              <p>Intenta buscar con otro nombre.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}