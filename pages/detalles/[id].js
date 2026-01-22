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
     URL ejemplo: /detalles/123?tipo=serial
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
  ------------------------------ */
  useEffect(() => {
    if (!id || !tipo) return

    const cargar = async () => {
      setCargando(true)

      // === CASO 1: CELULAR (Unidad única) ===
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
              productos(marca, nombre, descripcion)
            )
          `)
          .eq('id', id)
          .eq('skus.publicado', true) // Solo si el modelo está publicado
          .eq('vendido', false)       // Solo si no se ha vendido
          .maybeSingle()

        if (error || !data) {
          setCel(null)
          setCargando(false)
          return
        }

        const adaptado = {
          id: data.id,
          marca: data?.skus?.productos?.marca || '',
          modelo: data?.skus?.productos?.nombre || '',
          estado: data?.estado || '',
          precio_venta: data?.skus?.precio_venta ?? null,
          almacenamiento: data?.almacenamiento || '',
          salud_bateria: data?.salud_bateria ?? null,
          descripcion: data?.skus?.productos?.descripcion || '',
          color: data?.color || '',
          imagen_url: data?.imagen_url || [],
        }

        setCel(adaptado)
        setFotoActiva(Array.isArray(adaptado.imagen_url) && adaptado.imagen_url.length > 0 ? adaptado.imagen_url[0] : null)
        setCargando(false)
        return
      }

      // === CASO 2: ACCESORIO / BULK (Stock múltiple) ===
      if (tipo === 'bulk') {
        // Buscamos el SKU y vemos si tiene stock en stock_bulk
        const { data, error } = await supabase
          .from('skus')
          .select(`
            id,
            precio_venta,
            tracking,
            publicado,
            productos(marca, nombre, descripcion),
            stock_bulk(stock)
          `)
          .eq('id', id)
          .eq('publicado', true)
          .eq('tracking', 'BULK')
          .maybeSingle()

        if (error || !data) {
          setCel(null)
          setCargando(false)
          return
        }

        // Verificamos si hay stock real
        const stockDisponible = data?.stock_bulk?.[0]?.stock ?? 0 // Nota: stock_bulk suele venir como array si es relación 1:N, o objeto si es 1:1. Ajustamos a array seguro.

        if (stockDisponible <= 0) {
            setCel(null) // O podrías mostrarlo como "Agotado"
            setCargando(false)
            return
        }

        const adaptado = {
          id: data.id,
          marca: data?.productos?.marca || '',
          modelo: data?.productos?.nombre || '',
          estado: 'Nuevo', // Accesorios siempre son nuevos usualmente
          precio_venta: data?.precio_venta ?? null,
          almacenamiento: `Disponible: ${stockDisponible}`, // Usamos este campo para mostrar stock
          salud_bateria: null,
          descripcion: data?.productos?.descripcion || '',
          color: '',
          imagen_url: [], // Si agregas fotos a productos/skus en el futuro, ponlas aquí
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
          <h1 style={{ marginTop: 0 }}>No disponible 😔</h1>
          <p style={{ color: theme.muted }}>
            Este producto no existe, no está publicado o ya se vendió.
          </p>

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
                <div style={{ color: theme.muted, fontSize: '1.2rem' }}>
                    {cel.imagen_url && cel.imagen_url.length > 0 ? 'Cargando...' : '📷 Sin foto'}
                </div>
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
            <h1 style={{ marginTop: 0, marginBottom: 8, fontSize: '2rem' }}>
              {cel.marca} {cel.modelo}
            </h1>

            <div style={{ color: theme.cyan, fontWeight: 'bold', marginBottom: 14, fontSize: '1.1rem' }}>
              {cel.almacenamiento && <span>💾 {cel.almacenamiento}</span>}
              {cel.salud_bateria && <span> | 🔋 {cel.salud_bateria}%</span>}
              {cel.color && <span> | 🎨 {cel.color}</span>}
              {cel.estado && <span> | ✨ {cel.estado}</span>}
            </div>

            <div style={{ color: theme.muted, lineHeight: 1.6, marginBottom: 25, fontSize: '1rem', borderLeft: `3px solid ${theme.orange}`, paddingLeft: 15 }}>
              {cel.descripcion || 'Equipo garantizado por LOS FARRUS HUB.'}
            </div>

            {/* PRECIO + WHATSAPP */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginTop: 'auto' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: theme.muted, letterSpacing: 1, textTransform: 'uppercase' }}>PRECIO FINAL</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>S/ {cel.precio_venta}</div>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '18px 30px',
                  background: `linear-gradient(to right, ${theme.cyan}, ${theme.orange})`,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: 999,
                  fontWeight: '900',
                  fontSize: '1.1rem',
                  boxShadow: '0 10px 25px rgba(0, 210, 255, 0.3)',
                  transition: 'transform 0.2s'
                }}
              >
                Comprar por WhatsApp 💬
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