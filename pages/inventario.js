import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

// --- COMPONENTE TARJETA (con VENDIDO + borde rojo + eliminar visible) ---
function TarjetaEquipo({ cel, onEdit, onDelete, onSell, theme, onOpenModal }) {
  const [fotoActiva, setFotoActiva] = useState(
    cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto'
  )

  // Colores para la etiqueta de estado
  const colorEstado = {
    'Nuevo Sellado': '#00d2ff', // Cyan
    'Semi Nuevo': '#f39c12', // Naranja
    'Usado': '#e74c3c', // Rojo
    'Open Box': '#f39c12', // Naranja
  }

  // --- VENDIDO (estado calculado por stock) ---
  const vendido = Number(cel.stock) <= 0

  // Sombras/borde según vendido
  const sombraNormal = `0 0 15px ${theme.cyan}44, inset 0 0 10px ${theme.cyan}22`
  const sombraHover = `0 0 30px ${theme.cyan}66, inset 0 0 20px ${theme.cyan}33`

  const sombraNormalVendido =
    '0 0 20px rgba(255,107,107,0.35), inset 0 0 12px rgba(255,107,107,0.18)'
  const sombraHoverVendido =
    '0 0 35px rgba(255,107,107,0.45), inset 0 0 18px rgba(255,107,107,0.22)'

  return (
    <div
      style={{
        backgroundColor: theme.card,
        borderRadius: '20px',
        overflow: 'hidden',
        border: vendido ? '2px solid rgba(255,107,107,0.85)' : `2px solid ${theme.cyan}`,
        boxShadow: vendido ? sombraNormalVendido : sombraNormal,
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative',
        maxWidth: '360px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = vendido ? sombraHoverVendido : sombraHover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = vendido ? sombraNormalVendido : sombraNormal
      }}
    >
      {/* 1. SECCIÓN DE IMAGEN */}
      <div
        style={{
          height: '220px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#050a14',
          flexShrink: 0,
        }}
      >
        {/* Fondo Ambiental */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${fotoActiva})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(50px) brightness(0.4)',
            transform: 'scale(1.5)',
            zIndex: 1,
          }}
        />

        {/* Imagen Nítida (Clic para Zoom) */}
        <div
          onClick={() => onOpenModal(fotoActiva)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            padding: '15px',
            cursor: 'zoom-in',
          }}
        >
          <img
            src={fotoActiva}
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))',
              transition: 'transform 0.2s',
            }}
            alt="Celular"
          />
        </div>

        {/* ETIQUETA DE ESTADO (Arriba a la derecha) */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: colorEstado[cel.estado] || '#888',
            color: 'white',
            padding: '5px 12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            zIndex: 3,
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {cel.estado}
        </div>

        {/* --- VENDIDO: sello grande --- */}
        {vendido && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              background: 'linear-gradient(135deg, rgba(0,0,0,0.60), rgba(0,0,0,0.25))',
              backdropFilter: 'blur(2px)',
            }}
          >
            <div
              style={{
                padding: '12px 22px',
                borderRadius: '18px',
                background: 'rgba(231, 76, 60, 0.18)',
                border: '2px solid rgba(231, 76, 60, 0.80)',
                color: '#fff',
                fontWeight: '900',
                fontSize: '1.5rem',
                letterSpacing: '5px',
                textTransform: 'uppercase',
                boxShadow: '0 12px 30px rgba(0,0,0,0.55)',
              }}
            >
              VENDIDO
            </div>
          </div>
        )}
      </div>

      {/* 2. MINI GALERÍA */}
      {cel.imagen_url && cel.imagen_url.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#0b1426',
            overflowX: 'auto',
            borderBottom: `1px solid ${theme.cyan}11`,
            zIndex: 4,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {cel.imagen_url.map((url, index) => (
            <img
              key={index}
              src={url}
              onClick={() => setFotoActiva(url)}
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid transparent`,
                cursor: 'pointer',
                opacity: fotoActiva === url ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
              alt="Mini"
            />
          ))}
        </div>
      )}

      {/* 3. DATOS TÉCNICOS */}
      <div
        style={{
          padding: '20px 25px',
          background: theme.card,
          position: 'relative',
          zIndex: 4,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Título */}
        <div style={{ marginBottom: '12px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '1.4rem',
              color: 'white',
              fontWeight: '800',
              letterSpacing: '0.5px',
              lineHeight: '1.2',
            }}
          >
            {cel.marca} {cel.modelo}
          </h3>
        </div>

        {/* Specs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: theme.cyan,
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '15px',
          }}
        >
          <span>💾 {cel.almacenamiento}</span>
          {cel.salud_bateria && (
            <>
              <span style={{ opacity: 0.3 }}>|</span>
              <span>🔋 {cel.salud_bateria}%</span>
            </>
          )}
        </div>

        {/* Color e IMEI */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '15px',
          }}
        >
          {cel.color && (
            <div
              style={{
                display: 'inline-block',
                padding: '5px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme.cyan}44`,
                backgroundColor: 'rgba(0, 210, 255, 0.05)',
                color: '#fff',
                fontSize: '0.85rem',
              }}
            >
              🎨 <span style={{ fontWeight: 'bold', color: theme.cyan }}>{cel.color}</span>
            </div>
          )}
          {cel.imei && (
            <div style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>
              IMEI: {cel.imei}
            </div>
          )}
        </div>

        {/* Descripción */}
        {cel.descripcion && (
          <div
            style={{
              marginBottom: '20px',
              padding: '12px',
              backgroundColor: 'rgba(0,0,0,0.25)',
              borderRadius: '12px',
              fontSize: '0.85rem',
              color: '#ccc',
              lineHeight: '1.5',
              borderLeft: `3px solid ${theme.orange}`,
            }}
          >
            {cel.descripcion}
          </div>
        )}

        <div style={{ flexGrow: 1 }} />

        {/* Footer: Precio y Botones */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            gap: '20px',
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '0.7rem',
                color: '#888',
                marginBottom: '4px',
                letterSpacing: '1px',
              }}
            >
              PRECIO
            </span>
            <div style={{ color: 'white', fontSize: '1.7rem', fontWeight: '900', whiteSpace: 'nowrap' }}>
              S/ {cel.precio_venta}
            </div>
          </div>

          {/* --- BOTONES (EDITAR / VENDIDO / ELIMINAR) --- */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onEdit(cel)}
              style={{
                padding: '10px 20px',
                background: theme.cyan,
                color: '#000',
                border: 'none',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: '0 5px 15px rgba(0,210,255,0.2)',
              }}
            >
              EDITAR
            </button>

            <button
              onClick={() => {
                if (!vendido) onSell(cel)
              }}
              disabled={vendido}
              style={{
                padding: '10px 16px',
                background: vendido ? 'rgba(255,255,255,0.08)' : 'rgba(231, 76, 60, 0.18)',
                color: vendido ? '#ddd' : '#ff6b6b',
                border: vendido ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,107,107,0.55)',
                borderRadius: '50px',
                fontWeight: 'bold',
                cursor: vendido ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem',
                letterSpacing: '1px',
              }}
              title={vendido ? 'Este equipo ya está vendido' : 'Marcar como vendido'}
            >
              VENDIDO
            </button>

            <button
              onClick={() => onDelete(cel.id)}
              style={{
                padding: '10px 14px',
                background: '#2d1a1a',
                color: '#ff6b6b',
                border: '1px solid rgba(255,107,107,0.55)',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                boxShadow: '0 6px 18px rgba(255,107,107,0.15)',
              }}
              title="Eliminar del inventario"
            >
              ELIMINAR 🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- LOGICA PRINCIPAL ---
export default function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [editandoSkuId, setEditandoSkuId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, color: '#00d2ff' })
  const [modalImagen, setModalImagen] = useState(null) // Estado para el Zoom

  // --- AUTH (Supabase email/password) ---
  const [autorizado, setAutorizado] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargandoLogin, setCargandoLogin] = useState(false)
  const [loginError, setLoginError] = useState('')

  // --- VENTA: modal + form ---
  const [ventaModalAbierto, setVentaModalAbierto] = useState(false)
  const [ventaCel, setVentaCel] = useState(null)
  const [ventaForm, setVentaForm] = useState({
    precio_final: '',
    cliente_nombre: '',
    cliente_telefono: '',
  })
  const [ventas, setVentas] = useState([])
  const [ventasDesde, setVentasDesde] = useState('') // "YYYY-MM-DD"
  const [ventasHasta, setVentasHasta] = useState('') // "YYYY-MM-DD"
  const [cargandoVentas, setCargandoVentas] = useState(false)
  const [guardandoVenta, setGuardandoVenta] = useState(false)

  // --- FILTROS ---
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [filtroPublicado, setFiltroPublicado] = useState('TODOS') // TODOS | PUBLICADO | OCULTO
  const [filtroVendidos, setFiltroVendidos] = useState('TODOS') // TODOS | VENDIDOS | DISPONIBLES

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAutorizado(!!data.session)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAutorizado(!!session)
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [])

  // --- LOGIN ---
  const login = async () => {
    setLoginError('')

    const emailLimpio = (email || '').trim()
    if (!emailLimpio || !password) {
      setLoginError('Escribe correo y contraseña.')
      return
    }

    setCargandoLogin(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: emailLimpio,
      password,
    })
    setCargandoLogin(false)

    if (error) setLoginError(error.message)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAutorizado(false)
    avisar('Sesión cerrada')
  }

  // Estilos
  const theme = {
    navy: '#0b1426',
    card: '#162447',
    orange: '#f39c12',
    cyan: '#00d2ff',
    white: '#ffffff',
    gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)',
  }
  const inputStyle = {
    padding: '16px',
    borderRadius: '15px',
    border: '1px solid #25335a',
    background: '#0b1426',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
  }

  // ====== FORM V2 (celular serializado) ======
  const estadoInicial = {
    marca: '',
    modelo: '',
    estado: 'Nuevo Sellado',
    serial: '', // IMEI/serie
    color: '',
    almacenamiento: '',
    salud_bateria: null,
    descripcion: '',
    precio_venta: null,
    precio_costo: null,
    publicado: true,
    imagen_url: [],
  }
  const [form, setForm] = useState(estadoInicial)

  const normalizarSerial = (v) => String(v || '').replace(/\s/g, '').slice(0, 30)

  const inicioDelDiaISO = (yyyyMmDd) => {
    if (!yyyyMmDd) return null
    const d = new Date(`${yyyyMmDd}T00:00:00`)
    return d.toISOString()
  }

  const finDelDiaISO = (yyyyMmDd) => {
    if (!yyyyMmDd) return null
    const d = new Date(`${yyyyMmDd}T23:59:59.999`)
    return d.toISOString()
  }

  const avisar = (msg, color = theme.cyan) => {
    setNotificacion({ mensaje: msg, visible: true, color })
    setTimeout(() => setNotificacion((prev) => ({ ...prev, visible: false })), 3000)
  }

  // ====== CARGAR EQUIPOS ======
  const cargarEquipos = async () => {
    const { data, error } = await supabase
      .from('items_serializados')
      .select(`
        id, sku_id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, vendido, created_at,
        skus:sku_id (
          id, sku_codigo, tracking, precio_venta, precio_costo, publicado,
          productos:producto_id ( id, marca, nombre )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      avisar(`Error cargando inventario: ${error.message}`, '#ff4b2b')
      return
    }

    const adaptados = (data || []).map((row) => ({
      id: row.id,
      marca: row?.skus?.productos?.marca || '',
      modelo: row?.skus?.productos?.nombre || '',
      estado: row.estado,
      imei: row.serial,
      precio_venta: row?.skus?.precio_venta ?? null,
      precio_costo: row?.skus?.precio_costo ?? null,
      almacenamiento: row.almacenamiento,
      salud_bateria: row.salud_bateria,
      color: row.color,
      imagen_url: row.imagen_url,
      publicado: row?.skus?.publicado ?? false,
      stock: row.vendido ? 0 : 1,
      _raw: row,
    }))

    setEquipos(adaptados)
  }

  const cargarVentas = async () => {
    setCargandoVentas(true)

    let query = supabase
      .from('ventas_v2')
      .select(`
        id, precio_lista, precio_final, descuento, cliente_nombre, cliente_telefono,
        vendido_en, vendido_por, item_serializado_id, sku_id,
        items_serializados:item_serializado_id ( serial ),
        skus:sku_id ( id, precio_costo, productos:producto_id ( marca, nombre ) )
      `)
      .order('vendido_en', { ascending: false })
      .limit(300)

    const desdeISO = inicioDelDiaISO(ventasDesde)
    const hastaISO = finDelDiaISO(ventasHasta)
    if (desdeISO) query = query.gte('vendido_en', desdeISO)
    if (hastaISO) query = query.lte('vendido_en', hastaISO)

    const { data, error } = await query
    setCargandoVentas(false)

    if (error) {
      avisar(`Error cargando ventas: ${error.message}`, '#ff4b2b')
      return
    }

    setVentas(data || [])
  }

  useEffect(() => {
    if (autorizado) {
      cargarEquipos()
      cargarVentas()
    }
  }, [autorizado])

  useEffect(() => {
    if (autorizado) {
      cargarVentas()
    }
  }, [autorizado, ventasDesde, ventasHasta])

  // ====== SUBIR FOTOS ======
  const manejarFotos = async (e) => {
    const archivos = Array.from(e.target.files || [])
    if (archivos.length === 0) return

    setSubiendo(true)

    let nuevasUrls = Array.isArray(form.imagen_url) ? [...form.imagen_url] : []

    for (const archivo of archivos) {
      const nombre = `${Date.now()}_${archivo.name}`

      const { error: upErr } = await supabase.storage.from('Celulares - fotos').upload(nombre, archivo)

      if (upErr) {
        avisar(`Error subiendo foto: ${upErr.message}`, '#ff4b2b')
        continue
      }

      const { data } = supabase.storage.from('Celulares - fotos').getPublicUrl(nombre)
      nuevasUrls.push(data.publicUrl)
    }

    setForm({ ...form, imagen_url: nuevasUrls })
    setSubiendo(false)
    avisar('Fotos subidas')
  }

  // ====== HELPERS: asegurar producto y sku ======
  const asegurarCategoriaId = async (nombreCategoria) => {
    const { data, error } = await supabase.from('categorias').select('id').eq('nombre', nombreCategoria).maybeSingle()
    if (error) throw error
    if (data?.id) return data.id

    const { data: ins, error: insErr } = await supabase
      .from('categorias')
      .insert({ nombre: nombreCategoria })
      .select('id')
      .single()
    if (insErr) throw insErr
    return ins.id
  }

  const asegurarProductoId = async ({ categoriaId, marca, modelo, descripcion }) => {
    const nombre = String(modelo || '').trim()
    const marcaL = String(marca || '').trim()

    const { data, error } = await supabase
      .from('productos')
      .select('id')
      .eq('categoria_id', categoriaId)
      .eq('marca', marcaL)
      .eq('nombre', nombre)
      .maybeSingle()

    if (error) throw error
    if (data?.id) return data.id

    const { data: ins, error: insErr } = await supabase
      .from('productos')
      .insert({
        categoria_id: categoriaId,
        marca: marcaL,
        nombre,
        descripcion: descripcion || null,
        activo: true,
      })
      .select('id')
      .single()

    if (insErr) throw insErr
    return ins.id
  }

  const crearSku = async ({ productoId, precio_venta, precio_costo, publicado }) => {
    const sku_codigo = `CEL-${productoId}-${Date.now()}`
    const { data: sku, error } = await supabase
      .from('skus')
      .insert({
        producto_id: productoId,
        sku_codigo,
        tracking: 'SERIAL',
        precio_venta: precio_venta ?? null,
        precio_costo: precio_costo ?? null,
        publicado: !!publicado,
      })
      .select('id')
      .single()

    if (error) throw error
    return sku.id
  }

  // ====== GUARDAR ======
  const guardar = async () => {
    try {
      const marca = String(form.marca || '').trim()
      const modelo = String(form.modelo || '').trim()
      const serial = normalizarSerial(form.serial)

      if (!marca || !modelo) {
        avisar('Marca y modelo son obligatorios.', '#ff4b2b')
        return
      }
      if (!serial) {
        avisar('IMEI/serie es obligatorio para celulares.', '#ff4b2b')
        return
      }

      // EDIT MODE: actualizar item + sku
      if (editandoId) {
        // 1) Update item_serializados
        const { error: errUpdItem } = await supabase
          .from('items_serializados')
          .update({
            serial,
            estado: form.estado || null,
            salud_bateria: form.salud_bateria ? Number(form.salud_bateria) : null,
            almacenamiento: form.almacenamiento || null,
            color: form.color || null,
            imagen_url: Array.isArray(form.imagen_url) ? form.imagen_url : [],
          })
          .eq('id', editandoId)

        if (errUpdItem) {
          avisar('Error actualizando item: ' + errUpdItem.message, '#ff4b2b')
          return
        }

        // 2) Update skus (precio/publicado)
        if (editandoSkuId) {
          const { error: errUpdSku } = await supabase
            .from('skus')
            .update({
              precio_venta: form.precio_venta ? Number(form.precio_venta) : null,
              precio_costo: form.precio_costo ? Number(form.precio_costo) : null,
              publicado: !!form.publicado,
            })
            .eq('id', editandoSkuId)

          if (errUpdSku) {
            avisar('Item actualizado, pero error actualizando SKU: ' + errUpdSku.message, '#ff4b2b')
            // No return: el item ya se actualizó.
          }
        }

        avisar('Equipo actualizado')
        setEditandoId(null)
        setEditandoSkuId(null)
        setForm(estadoInicial)
        await cargarEquipos()
        return
      }

      // NUEVO: crear producto+sku+item
      const categoriaId = await asegurarCategoriaId('Celulares')
      const productoId = await asegurarProductoId({
        categoriaId,
        marca,
        modelo,
        descripcion: form.descripcion,
      })

      const skuId = await crearSku({
        productoId,
        precio_venta: form.precio_venta ? Number(form.precio_venta) : null,
        precio_costo: form.precio_costo ? Number(form.precio_costo) : null,
        publicado: form.publicado,
      })

      const { error: insErr } = await supabase.from('items_serializados').insert({
        sku_id: skuId,
        serial,
        estado: form.estado || null,
        salud_bateria: form.salud_bateria ? Number(form.salud_bateria) : null,
        almacenamiento: form.almacenamiento || null,
        color: form.color || null,
        vendido: false,
        imagen_url: Array.isArray(form.imagen_url) ? form.imagen_url : [],
      })

      if (insErr) {
        avisar(`Error guardando: ${insErr.message}`, '#ff4b2b')
        return
      }

      avisar('Equipo registrado')
      setForm(estadoInicial)
      await cargarEquipos()
    } catch (e) {
      avisar(`Error: ${e.message}`, '#ff4b2b')
    }
  }

  // --- VENTA: abrir modal ---
  const abrirModalVenta = (cel) => {
    setVentaCel(cel)
    setVentaForm({
      precio_final: cel?.precio_venta ?? '',
      cliente_nombre: '',
      cliente_telefono: '',
    })
    setVentaModalAbierto(true)
  }

  // --- VENTA: confirmar ---
  const confirmarVenta = async () => {
    if (!ventaCel) return

    if (Number(ventaCel.stock) <= 0) {
      avisar('Este equipo ya está vendido', '#ff4b2b')
      return
    }

    const precioFinal = Number(ventaForm.precio_final)
    if (!precioFinal || precioFinal <= 0) {
      avisar('Ingresa el precio final', '#ff4b2b')
      return
    }

    setGuardandoVenta(true)

    const { data: sess } = await supabase.auth.getSession()
    const userId = sess?.session?.user?.id
    if (!userId) {
      setGuardandoVenta(false)
      avisar('Sesión no válida, vuelve a iniciar sesión', '#ff4b2b')
      return
    }

    const skuId = ventaCel?._raw?.skus?.id
    if (!skuId) {
      setGuardandoVenta(false)
      avisar('No se encontró SKU del equipo (skuId). Recarga e intenta otra vez.', '#ff4b2b')
      return
    }

    const { error: errVenta } = await supabase.from('ventas_v2').insert({
      item_serializado_id: ventaCel.id,
      sku_id: skuId,
      precio_lista: ventaCel.precio_venta ?? null,
      precio_final: precioFinal,
      descuento: ventaCel.precio_venta != null ? Number(ventaCel.precio_venta) - precioFinal : null,
      cliente_nombre: ventaForm.cliente_nombre?.trim() || null,
      cliente_telefono: ventaForm.cliente_telefono?.trim() || null,
      vendido_por: userId,
    })

    if (errVenta) {
      setGuardandoVenta(false)
      avisar(`Error registrando venta: ${errVenta.message}`, '#ff4b2b')
      return
    }

    const { error: errUpd } = await supabase.from('items_serializados').update({ vendido: true }).eq('id', ventaCel.id)
    if (errUpd) {
      setGuardandoVenta(false)
      avisar(`Venta registrada, pero error marcando vendido: ${errUpd.message}`, '#ff4b2b')
      return
    }

    avisar('Venta registrada')
    setGuardandoVenta(false)
    setVentaModalAbierto(false)
    setVentaCel(null)
    setVentaForm({ precio_final: '', cliente_nombre: '', cliente_telefono: '' })

    await cargarEquipos()
    await cargarVentas()
  }

  const equiposFiltrados = useMemo(() => {
    return equipos.filter((cel) => {
      const texto = (busqueda || '').toLowerCase()

      const matchBusqueda =
        cel.marca?.toLowerCase().includes(texto) ||
        cel.modelo?.toLowerCase().includes(texto) ||
        cel.estado?.toLowerCase().includes(texto) ||
        cel.imei?.toLowerCase().includes(texto) ||
        cel.color?.toLowerCase().includes(texto)

      const matchEstado = filtroEstado === 'TODOS' ? true : cel.estado === filtroEstado

      const matchPublicado =
        filtroPublicado === 'TODOS' ? true : filtroPublicado === 'PUBLICADO' ? !!cel.publicado : !cel.publicado

      const vendido = Number(cel.stock) <= 0
      const matchVendidos =
        filtroVendidos === 'TODOS' ? true : filtroVendidos === 'VENDIDOS' ? vendido : !vendido

      return matchBusqueda && matchEstado && matchPublicado && matchVendidos
    })
  }, [equipos, busqueda, filtroEstado, filtroPublicado, filtroVendidos])

  const resumenVentas = useMemo(() => {
    return (ventas || []).reduce(
      (acc, v) => {
        const costo = Number(v?.skus?.precio_costo ?? 0)
        const final = Number(v?.precio_final ?? 0)
        acc.totalVentas += final
        acc.totalCosto += costo
        acc.totalGanancia += final - costo
        acc.count += 1
        return acc
      },
      { totalVentas: 0, totalCosto: 0, totalGanancia: 0, count: 0 }
    )
  }, [ventas])

  // --- LOGIN ---
  if (!autorizado) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: theme.gradient,
          display: 'grid',
          placeItems: 'center',
          zIndex: 9999,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            backgroundColor: theme.card,
            padding: '50px 40px',
            borderRadius: '35px',
            textAlign: 'center',
            border: `2px solid ${theme.cyan}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            width: '90%',
            maxWidth: '420px',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px', fontWeight: '900', color: 'white' }}>
            LOS FARRUS <span style={{ color: theme.orange }}>HUB</span>
          </h1>
          <p style={{ color: theme.cyan, marginBottom: '25px', letterSpacing: '2px', fontSize: '0.9rem' }}>
            PANEL DE GESTIÓN
          </p>

          <input
            type="email"
            placeholder="Correo (admin)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '15px',
              border: 'none',
              backgroundColor: '#0b1426',
              color: 'white',
              marginBottom: '12px',
              textAlign: 'center',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            style={{
              width: '100%',
              padding: '18px',
              borderRadius: '15px',
              border: 'none',
              backgroundColor: '#0b1426',
              color: 'white',
              marginBottom: '18px',
              textAlign: 'center',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <button
            onClick={login}
            disabled={cargandoLogin}
            style={{
              width: '100%',
              padding: '18px',
              background: theme.orange,
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              cursor: 'pointer',
              opacity: cargandoLogin ? 0.7 : 1,
              boxShadow: '0 10px 20px rgba(243, 156, 18, 0.3)',
            }}
          >
            {cargandoLogin ? 'CONECTANDO...' : 'ACCEDER'}
          </button>

          {loginError && (
            <div style={{ marginTop: '12px', color: '#ff4b2b', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center' }}>
              {loginError}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, padding: '50px 20px', color: 'white', fontFamily: 'sans-serif' }}>
      {notificacion.visible && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: theme.card,
            color: theme.white,
            padding: '15px 30px',
            borderRadius: '15px',
            borderLeft: `6px solid ${notificacion.color}`,
            zIndex: 10000,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          {notificacion.mensaje}
        </div>
      )}

      {/* --- MODAL ZOOM --- */}
      {modalImagen && (
        <div
          onClick={() => setModalImagen(null)}
          style={{
            position: 'fixed',
            top: 0
, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out',
            padding: '20px', boxSizing: 'border-box', backdropFilter: 'blur(5px)'
        }}>
          <img 
            src={modalImagen} 
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', border: `2px solid ${theme.cyan}` }} 
          />
        </div>
      )}
      {/* --- MODAL VENTA --- */}
      {ventaModalAbierto && ventaCel && (
        <div
          onClick={() => !guardandoVenta && setVentaModalAbierto(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 99998,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', boxSizing: 'border-box'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 520,
              background: theme.card,
              borderRadius: 24,
              border: `1px solid ${theme.cyan}33`,
              padding: 22
            }}
          >
            <h2 style={{ marginTop: 0 }}>Registrar venta</h2>
            <div style={{ color: '#94a3b8', marginBottom: 14 }}>
              {ventaCel.marca} {ventaCel.modelo} — IMEI: {ventaCel.imei || 'N/A'}
            </div>

            <label style={{ display: 'block', marginBottom: 6, color: theme.cyan, fontWeight: 'bold' }}>
              Precio final (con descuento)
            </label>
            <input
              type="number"
              value={ventaForm.precio_final}
              onChange={(e) => setVentaForm({ ...ventaForm, precio_final: e.target.value })}
              style={inputStyle}
            />

            <div style={{ height: 12 }} />

            <label style={{ display: 'block', marginBottom: 6, color: '#94a3b8' }}>
              Cliente (opcional)
            </label>
            <input
              placeholder="Nombre"
              value={ventaForm.cliente_nombre}
              onChange={(e) => setVentaForm({ ...ventaForm, cliente_nombre: e.target.value })}
              style={inputStyle}
            />

            <div style={{ height: 10 }} />

            <input
              placeholder="Teléfono"
              value={ventaForm.cliente_telefono}
              onChange={(e) => setVentaForm({ ...ventaForm, cliente_telefono: e.target.value })}
              style={inputStyle}
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button
                onClick={() => setVentaModalAbierto(false)}
                disabled={guardandoVenta}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: `1px solid ${theme.cyan}44`,
                  background: 'transparent',
                  color: theme.cyan,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: guardandoVenta ? 0.6 : 1
                }}
              >
                Cancelar
              </button>

              <button
                onClick={confirmarVenta}
                disabled={guardandoVenta}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: 'none',
                  background: theme.orange,
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: guardandoVenta ? 0.6 : 1
                }}
              >
                {guardandoVenta ? 'Guardando...' : 'Confirmar venta'}
              </button>
            </div>
          </div>
        </div>
      )}


      <div style={{ maxWidth: '1400px', margin: 'auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0 }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <button onClick={logout} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.cyan}`, color: theme.cyan, padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }}>Cerrar Sesión 🔒</button>
        </header>

       {/* --- FORMULARIO --- */}
    <div style={{ backgroundColor: theme.card, padding: '50px', borderRadius: '40px', marginBottom: '80px', border: '1px solid rgba(0,210,255,0.15)', boxShadow: '0 40px 90px rgba(0,0,0,0.4)' }}>
      <h2 style={{ marginBottom: '40px', borderLeft: `8px solid ${theme.orange}`, paddingLeft: '20px', fontSize: '1.8rem' }}>
        {editandoId ? '📝 EDITAR EQUIPO' : '📦 NUEVO INGRESO'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
        <div>
          <label style={{marginLeft: '10px', color: theme.cyan, fontSize: '0.8rem', fontWeight: 'bold'}}>ESTADO</label>
          <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={inputStyle}>
            <option value="Nuevo Sellado">Nuevo Sellado</option>
            <option value="Semi Nuevo">Semi Nuevo</option>
            <option value="Usado">Usado</option>
            <option value="Open Box">Open Box</option>
          </select>
        </div>
        
        {/* --- stock --- */}
        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>STOCK</label>
          <input
            type="number"
            min="0"
            placeholder="Ej. 1"
            value={form.stock ?? 0}
            style={inputStyle}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
        </div>

        {/* ✅ PUBLICAR */}
        <div>
          <label style={{marginLeft: '10px', color: theme.cyan, fontSize: '0.8rem', fontWeight: 'bold'}}>PUBLICAR EN CATÁLOGO</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', borderRadius: '15px', background: '#0b1426', border: '1px solid #25335a', color: 'white' }}>
            <input
              type="checkbox"
              checked={!!form.publicado}
              onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
            />
            <span style={{ fontSize: '0.9rem' }}>
              {form.publicado ? 'Visible' : 'Oculto'}
            </span>
          </div>
        </div>

        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MARCA</label>
          <input placeholder="Ej. Apple" value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} />
        </div>

        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MODELO</label>
          <input placeholder="Ej. iPhone 15" value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} />
        </div>

        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>COLOR</label>
          <input placeholder="Ej. Azul Titanio" value={form.color} style={inputStyle} onChange={e => setForm({...form, color: e.target.value})} />
        </div>

        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>ALMACENAMIENTO</label>
          <input placeholder="Ej. 256Gb" value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} />
        </div>

        <div>
          <label style={{ marginLeft: 10, color: '#888', fontSize: '0.8rem' }}>
        IMEI / SERIE
        </label>
        <input
          placeholder="Escanea o escribe..."
          value={form.serial}
          onChange={(e) => setForm({ ...form, serial: normalizarImei(e.target.value) })}
          style={{ ...inputStyle, fontFamily: 'monospace' }}
        />
        </div>

        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO VENTA</label>
          <input type="number" placeholder="S/." value={form.precio_venta} style={{...inputStyle, borderColor: theme.orange}} onChange={e => setForm({...form, precio_venta: e.target.value})} />
        </div>

        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO COSTO</label>
          <input type="number" placeholder="S/." value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} />
        </div>

        <div>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>SALUD BATERÍA (%)</label>
          <input type="number" placeholder="Ej. 90" value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>DESCRIPCIÓN</label>
          <textarea placeholder="Detalles..." value={form.descripcion} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} onChange={e => setForm({...form, descripcion: e.target.value})} />
        </div>

        <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.25)', padding: '20px', borderRadius: '20px', border: '2px dashed #25335a' }}>
            {form.imagen_url?.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '15px', border: `2px solid ${theme.cyan}` }} />
                <button
                  onClick={() => setForm({...form, imagen_url: form.imagen_url.filter((_, idx) => idx !== i)})}
                  style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4b2b', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))}

            <label style={{ width: '100px', height: '100px', border: `3px dashed ${theme.cyan}`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '2rem', color: theme.cyan }}>
              {subiendo ? '⏳' : '+'}
              <input type="file" multiple hidden onChange={manejarFotos} />
            </label>
          </div>
        </div>
      </div>

      <button onClick={guardar} style={{ width: '100%', padding: '25px', background: theme.orange, color: 'white', border: 'none', borderRadius: '25px', fontWeight: '900', fontSize: '1.2rem', marginTop: '40px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(243, 156, 18, 0.3)' }}>
        {editandoId ? 'CONFIRMAR CAMBIOS' : 'GUARDAR EQUIPO'}
      </button>
    </div>

        {/* --- LISTADO --- */}
        <h2 style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: `8px solid ${theme.cyan}`, fontSize: '2rem' }}>INVENTARIO ({equipos.length})</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={inputStyle}>
            <option value="TODOS">Estado: Todos</option>
            <option value="Nuevo Sellado">Nuevo Sellado</option>
            <option value="Semi Nuevo">Semi Nuevo</option>
            <option value="Usado">Usado</option>
            <option value="Open Box">Open Box</option>
          </select>

          <select value={filtroPublicado} onChange={(e) => setFiltroPublicado(e.target.value)} style={inputStyle}>
            <option value="TODOS">Publicación: Todos</option>
            <option value="PUBLICADO">Solo publicados</option>
            <option value="OCULTO">Solo ocultos</option>
          </select>

          <select value={filtroVendidos} onChange={(e) => setFiltroVendidos(e.target.value)} style={inputStyle}>
            <option value="TODOS">Stock: Todos</option>
            <option value="DISPONIBLES">Disponibles</option>
            <option value="VENDIDOS">Vendidos</option>
          </select>
        </div>
       
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {equiposFiltrados.map(cel => (
            <TarjetaEquipo 
              key={cel.id} cel={cel} theme={theme}
              onOpenModal={setModalImagen}
              onEdit={(equipo) => {
                setForm({ ...estadoInicial, ...equipo, serial: equipo.imei })
                setEditandoId(equipo.id)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onDelete={async (id) => {
                if (!confirm('Eliminar definitivamente?')) return

                const { error } = await supabase
                  .from('items_serializados')
                  .delete()
                  .eq('id', id)

                if (error) {
                  avisar(`Error eliminando: ${error.message}`, '#ff4b2b')
                  return
                }

                avisar('Eliminado')
                cargarEquipos()
              }}
              onSell={(cel) => abrirModalVenta(cel)}
            />
          ))}
          {equiposFiltrados.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', fontSize: '1.5rem' }}>No se encontraron resultados 🕵️‍♂️</p>}
        </div>
        {/* ===== PANEL DE VENTAS (PASO 4) VA AQUÍ ===== */}
        <div style={{ marginTop: 60, backgroundColor: theme.card, padding: 30, borderRadius: 24 }}>
          <h2 style={{ marginTop: 0, borderLeft: `8px solid ${theme.orange}`, paddingLeft: 16 }}>
            Ventas (últimas 100)
          </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#94a3b8' }}>Desde</label>
            <input
              type="date"
              value={ventasDesde}
              onChange={(e) => setVentasDesde(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ display: 'block', marginBottom: 6, color: '#94a3b8' }}>Hasta</label>
            <input
              type="date"
              value={ventasHasta}
              onChange={(e) => setVentasHasta(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <button
              onClick={cargarVentas}
              style={{ padding: '14px 16px', borderRadius: 14, border: 'none', background: theme.cyan, color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Aplicar
            </button>

            <button
              onClick={() => {
                setVentasDesde('')
                setVentasHasta('')
                cargarVentas()
              }}
              style={{ padding: '14px 16px', borderRadius: 14, border: `1px solid ${theme.cyan}44`, background: 'transparent', color: theme.cyan, fontWeight: 'bold', cursor: 'pointer' }}
            >
              Limpiar
            </button>
          </div>
        </div>

          {/* === AQUÍ VA TU BLOQUE RESUMEN === */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
            <div>Total ventas: <b>S/ {resumenVentas.totalVentas.toFixed(2)}</b></div>
            <div>Total costo: <b>S/ {resumenVentas.totalCosto.toFixed(2)}</b></div>
            <div>Ganancia: <b>S/ {resumenVentas.totalGanancia.toFixed(2)}</b></div>
            <div># ventas: <b>{resumenVentas.count}</b></div>
          </div>
          {/* === FIN BLOQUE RESUMEN === */}

          {cargandoVentas ? (
            <div>Cargando ventas...</div>
          ) : ventas.length === 0 ? (
            <div style={{ color: '#94a3b8' }}>Aún no hay ventas registradas.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <th style={{ padding: 10 }}>Fecha</th>
                    <th style={{ padding: 10 }}>Equipo</th>
                    <th style={{ padding: 10 }}>IMEI</th>
                    <th style={{ padding: 10 }}>Final</th>
                    <th style={{ padding: 10 }}>Costo</th>
                    <th style={{ padding: 10 }}>Ganancia</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v) => {
                    const costo = Number(v?.skus?.precio_costo ?? 0)
                    const final = Number(v?.precio_final ?? 0)
                    const ganancia = final - costo

                    const fecha = v?.vendido_en ? new Date(v.vendido_en).toLocaleString() : '—'
                    const marca = v?.skus?.productos?.marca ?? '—'
                    const modelo = v?.skus?.productos?.nombre ?? '—'
                    const serial = v?.items_serializados?.serial ?? 'NA'

                    return (
                      <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <td style={{ padding: 10 }}>{fecha}</td>
                        <td style={{ padding: 10 }}>{marca} {modelo}</td>
                        <td style={{ padding: 10, fontFamily: 'monospace', color: '#94a3b8' }}>{serial}</td>
                        <td style={{ padding: 10 }}>S/ {final.toFixed(2)}</td>
                        <td style={{ padding: 10 }}>S/ {costo.toFixed(2)}</td>
                        <td style={{ padding: 10, color: ganancia >= 0 ? '#7CFC98' : '#ff6b6b' }}>
                          S/ {ganancia.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* ===== FIN PANEL DE VENTAS ===== */}
      </div>
    </div>
  )
}