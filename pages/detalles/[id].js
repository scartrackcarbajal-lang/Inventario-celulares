// ================================
// DETALLES: /detalles/[id]
// Archivo: pages/detalles/[id].js
// ================================

/* -------------------------------
   IMPORTS
-------------------------------- */
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

/* -------------------------------
   COMPONENTE PRINCIPAL
-------------------------------- */
export default function DetallesProducto() {
  /* -----------------------------
     ROUTER: ID dinámico
     URL ejemplo: /detalles/123
  ------------------------------ */
  const router = useRouter()
  const { id, tipo } = router.query


  /* -----------------------------
     ESTADOS
  ------------------------------ */
  const [cel, setCel] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [fotoActiva, setFotoActiva] = useState(null)

  /* -----------------------------
     CONFIG: WhatsApp
  ------------------------------ */
  const whatsappPropio = '51992571579'

  /* -----------------------------
     UI: Theme
  ------------------------------ */
  const theme = {
    navy: '#0b1426',
    card: '#162447',
    orange: '#f39c12',
    cyan: '#00d2ff',
    white: '#ffffff',
    muted: '#94a3b8',
    gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)',
  }

  /* -----------------------------
     LINK WHATSAPP (mensaje)
  ------------------------------ */
  const waLink = useMemo(() => {
    if (!cel) return '#'
    const msg = encodeURIComponent(`Hola! Me interesa el ${cel.marca} ${cel.modelo}`)
    return `https://wa.me/${whatsappPropio}?text=${msg}`
  }, [cel])

  /* -----------------------------
     CARGA DE DATOS (Supabase)
     - Solo publicados
     - Solo stock disponible
  ------------------------------ */
  useEffect(() => {
  if (!id || !tipo) return

  const cargar = async () => {
    setCargando(true)

    // SERIAL = celulares por unidad
    if (tipo === 'serial') {
      const { data, error } = await supabase
        .from('items_serializados')
        .select(`
          id,
          serial,
          estado,
          salud_bateria,
          almacenamiento,
          color,
          imagen_url,
          vendido,
          skus!inner(
            id,
            precio_venta,
            publicado,
            productos(marca, nombre)
          )
        `)
        .eq('id', id)
        .eq('skus.publicado', true)
        .eq('vendido', false)
        .single()

      if (error) {
        setCel(null)
        setCargando(false)
        return
      }

      // Adaptar a tu UI actual (cel.marca, cel.modelo, cel.precio_venta, etc.)
      const adaptado = {
        id: data.id,
        marca: data?.skus?.productos?.marca || '',
        modelo: data?.skus?.productos?.nombre || '',
        estado: data?.estado || '',
        precio_venta: data?.skus?.precio_venta ?? null,
        almacenamiento: data?.almacenamiento || '',
        salud_bateria: data?.salud_bateria ?? null,
        descripcion: '',
        color: data?.color || '',
        imagen_url: data?.imagen_url || [],
      }

      setCel(adaptado)
      setFotoActiva(Array.isArray(adaptado.imagen_url) ? adaptado.imagen_url[0] : null)
      setCargando(false)
      return
    }

    // BULK = perfumes por stock
    if (tipo === 'bulk') {
      const { data, error } = await supabase
        .from('skus')
        .select(`
          id,
          precio_venta,
          tracking,
          publicado,
          productos(marca, nombre),
          stock_bulk(stock)
        `)
        .eq('id', id)
        .eq('publicado', true)
        .eq('tracking', 'BULK')
        .single()

      if (error) {
        setCel(null)
        setCargando(false)
        return
      }

      const adaptado = {
        id: data.id,
        marca: data?.productos?.marca || '',
        modelo: data?.productos?.nombre || '',
        estado: 'Perfume',
        precio_venta: data?.precio_venta ?? null,
        almacenamiento: `Stock: ${data?.stock_bulk?.stock ?? 0}`,
        salud_bateria: null,
        descripcion: '',
        color: '',
        imagen_url: [],
      }

      setCel(adaptado)
      setFotoActiva(null)
      setCargando(false)
      return
    }

    // Tipo inválido
    setCel(null)
    setCargando(false)
  }

  cargar()
}, [id, tipo])

  /* -----------------------------
     UI: Estado Cargando
  ------------------------------ */
  if (cargando) {
    return (
      <div style={{ minHeight: '100vh', background: theme.gradient, color: 'white', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
        Cargando...
      </div>
    )
  }

  /* -----------------------------
     UI: No disponible
  ------------------------------ */
  if (!cel) {
    return (
      <div style={{ minHeight: '100vh', background: theme.gradient, color: 'white', fontFamily: 'sans-serif', padding: '40px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: theme.card, borderRadius: 24, padding: 24, border: `1px solid ${theme.cyan}33` }}>
          <h1 style={{ marginTop: 0 }}>No disponible</h1>
          <p style={{ color: theme.muted }}>
            Este producto no existe, no está publicado o ya se vendió.
          </p>

          {/* VOLVER AL CATÁLOGO */}
          <Link href="/" style={{ color: theme.cyan, fontWeight: 'bold', textDecoration: 'none' }}>
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  /* -----------------------------
     UI: Página Detalles
  ------------------------------ */
  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, color: 'white', fontFamily: 'sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* HEADER: volver */}
        <div style={{ marginBottom: 20 }}>
          <Link href="/" style={{ color: theme.cyan, fontWeight: 'bold', textDecoration: 'none' }}>
            ← Volver al catálogo
          </Link>
        </div>

        {/* CONTENIDO: Galería + Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* GALERÍA */}
          <div style={{ background: theme.card, borderRadius: 24, overflow: 'hidden', border: `1px solid ${theme.cyan}33` }}>
            {/* Foto principal */}
            <div style={{ height: 380, background: '#050a14', position: 'relative', display: 'grid', placeItems: 'center' }}>
              {fotoActiva ? (
                <img
                  src={fotoActiva}
                  alt={`${cel.marca} ${cel.modelo}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ color: theme.muted }}>Sin foto</div>
              )}
            </div>

            {/* Miniaturas */}
            {Array.isArray(cel.imagen_url) && cel.imagen_url.length > 1 && (
              <div style={{ display: 'flex', gap: 10, padding: 14, overflowX: 'auto', background: '#0b1426', borderTop: `1px solid ${theme.cyan}11` }}>
                {cel.imagen_url.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    onClick={() => setFotoActiva(url)}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: 'cover',
                      borderRadius: 12,
                      cursor: 'pointer',
                      border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid transparent`,
                      opacity: fotoActiva === url ? 1 : 0.6,
                    }}
                    alt={`Foto ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div style={{ background: theme.card, borderRadius: 24, padding: 22, border: `1px solid ${theme.cyan}33` }}>
            <h1 style={{ marginTop: 0, marginBottom: 8 }}>
              {cel.marca} {cel.modelo}
            </h1>

            <div style={{ color: theme.cyan, fontWeight: 'bold', marginBottom: 14 }}>
              💾 {cel.almacenamiento}
              {cel.salud_bateria ? ` | 🔋 ${cel.salud_bateria}%` : ''}
              {cel.color ? ` | 🎨 ${cel.color}` : ''}
            </div>

            <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 18 }}>
              {cel.descripcion || 'Calidad garantizada en LOS FARRUS HUB.'}
            </div>

            {/* PRECIO + WHATSAPP */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: theme.muted, letterSpacing: 1 }}>PRECIO</div>
                <div style={{ fontSize: '2rem', fontWeight: 900 }}>S/ {cel.precio_venta}</div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '14px 18px',
                  background: `linear-gradient(to right, ${theme.cyan}, ${theme.orange})`,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: 999,
                  fontWeight: 'bold',
                }}
              >
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ textAlign: 'center', padding: '40px 0', color: theme.muted, fontSize: '0.85rem' }}>
          © 2026 LOS FARRUS HUB
        </footer>
      </div>
    </div>
  )
}
