import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// --- COMPONENTE TARJETA (Footer con separación mejorada entre Precio y Botones) ---
function TarjetaEquipo({ cel, onEdit, onDelete, theme, onOpenModal }) {
  const [fotoActiva, setFotoActiva] = useState(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto')

  // Colores para la etiqueta de estado
  const colorEstado = {
    'Nuevo Sellado': '#00d2ff', // Cyan
    'Semi Nuevo': '#f39c12',    // Naranja
    'Usado': '#e74c3c',         // Rojo
    'Open Box': '#f39c12'       // Naranja
  }

  return (
    <div style={{
      backgroundColor: theme.card,
      borderRadius: '20px',
      overflow: 'hidden',
      border: `2px solid ${theme.cyan}`,
      boxShadow: `0 0 15px ${theme.cyan}44, inset 0 0 10px ${theme.cyan}22`,
      transition: 'transform 0.3s, box-shadow 0.3s',
      position: 'relative',
      maxWidth: '360px', // Ancho fijo ideal
      margin: '0 auto',
      display: 'flex',       
      flexDirection: 'column' 
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 0 30px ${theme.cyan}66, inset 0 0 20px ${theme.cyan}33`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 15px ${theme.cyan}44, inset 0 0 10px ${theme.cyan}22`; }}
    >
      
      {/* 1. SECCIÓN DE IMAGEN */}
      <div style={{ height: '220px', position: 'relative', overflow: 'hidden', backgroundColor: '#050a14', flexShrink: 0 }}>
          
          {/* Fondo Ambiental */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${fotoActiva})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(50px) brightness(0.4)', transform: 'scale(1.5)', zIndex: 1 }}></div>

          {/* Imagen Nítida (Clic para Zoom) */}
          <div 
            onClick={() => onOpenModal(fotoActiva)}
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              zIndex: 2, padding: '15px', cursor: 'zoom-in'
            }}>
              <img src={fotoActiva} style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))', transition: 'transform 0.2s' }} alt="Celular" />
          </div>

          {/* ETIQUETA DE ESTADO (Arriba a la derecha) */}
          <div style={{ 
            position: 'absolute', top: '12px', right: '12px', 
            backgroundColor: colorEstado[cel.estado] || '#888', 
            color: 'white', padding: '5px 12px', borderRadius: '8px', 
            fontWeight: 'bold', fontSize: '0.75rem', zIndex: 3, 
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {cel.estado}
          </div>
      </div>

      {/* 2. MINI GALERÍA */}
      {cel.imagen_url && cel.imagen_url.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', padding: '10px 20px', backgroundColor: '#0b1426', overflowX: 'auto', borderBottom: `1px solid ${theme.cyan}11`, zIndex: 4, position: 'relative', flexShrink: 0 }}>
          {cel.imagen_url.map((url, index) => (
            <img key={index} src={url} onClick={() => setFotoActiva(url)} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid transparent`, cursor: 'pointer', opacity: fotoActiva === url ? 1 : 0.5, transition: 'all 0.2s' }} />
          ))}
        </div>
      )}

      {/* 3. DATOS TÉCNICOS */}
      <div style={{ padding: '20px 25px', background: theme.card, position: 'relative', zIndex: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Título */}
        <div style={{ marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'white', fontWeight: '800', letterSpacing: '0.5px', lineHeight: '1.2' }}>{cel.marca} {cel.modelo}</h3>
        </div>

        {/* Specs: Almacenamiento | Batería */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.cyan, fontSize: '0.9rem', fontWeight: '600', marginBottom: '15px' }}>
            <span>💾 {cel.almacenamiento}</span>
            {cel.salud_bateria && (<><span style={{ opacity: 0.3 }}>|</span><span>🔋 {cel.salud_bateria}%</span></>)}
        </div>

        {/* Color e IMEI */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
          {cel.color && (
              <div style={{ display: 'inline-block', padding: '5px 12px', borderRadius: '8px', border: `1px solid ${theme.cyan}44`, backgroundColor: 'rgba(0, 210, 255, 0.05)', color: '#fff', fontSize: '0.85rem' }}>
                  🎨 <span style={{ fontWeight: 'bold', color: theme.cyan }}>{cel.color}</span>
              </div>
          )}
          {cel.imei && (<div style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>IMEI: {cel.imei}</div>)}
        </div>

        {/* DESCRIPCIÓN */}
        {cel.descripcion && (
            <div style={{ 
              marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.25)', 
              borderRadius: '12px', fontSize: '0.85rem', color: '#ccc', lineHeight: '1.5',
              borderLeft: `3px solid ${theme.orange}` 
            }}>
                {cel.descripcion}
            </div>
        )}

        {/* Espaciador flexible */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Footer: Precio y Botones (CON GAP DE SEPARACIÓN AGREGADO) */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '10px', 
            paddingTop: '15px', 
            borderTop: '1px solid rgba(255,255,255,0.08)',
            gap: '20px' // <--- ESTO SEPARA EL PRECIO DE LOS BOTONES
        }}>
          <div>
             <span style={{ display: 'block', fontSize: '0.7rem', color: '#888', marginBottom: '4px', letterSpacing: '1px' }}>PRECIO</span>
             <div style={{ color: 'white', fontSize: '1.7rem', fontWeight: '900', whiteSpace: 'nowrap' }}>S/ {cel.precio_venta}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => onEdit(cel)} style={{ padding: '10px 20px', background: theme.cyan, color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem', boxShadow: '0 5px 15px rgba(0,210,255,0.2)' }}>EDITAR</button>
            <button onClick={() => onDelete(cel.id)} style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2d1a1a', color: '#ff6b6b', border: '1px solid #ff6b6b44', borderRadius: '50%', cursor: 'pointer' }}>🗑️</button>
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
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, color: '#00d2ff' })
  const [modalImagen, setModalImagen] = useState(null) // Estado para el Zoom

  // Seguridad
  const [autorizado, setAutorizado] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const CLAVE_SECRETA = "carsal11"

  const verificarClave = () => {
    if (passwordInput === CLAVE_SECRETA) { setAutorizado(true); localStorage.setItem('farrus_auth', 'true'); } 
    else { avisar("⚠️ Clave incorrecta", "#ff4b2b") }
  }
  useEffect(() => { if (localStorage.getItem('farrus_auth') === 'true') setAutorizado(true) }, [])

  // Estilos
  const theme = { navy: '#0b1426', card: '#162447', orange: '#f39c12', cyan: '#00d2ff', white: '#ffffff', gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)' }
  const inputStyle = { padding: '16px', borderRadius: '15px', border: '1px solid #25335a', background: '#0b1426', color: 'white', outline: 'none', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }
  
  const estadoInicial = { 
    marca: '', modelo: '', color: '', almacenamiento: '', imei: '', 
    precio_venta: '', precio_costo: '', salud_bateria: '', descripcion: '', 
    estado: 'Nuevo Sellado', imagen_url: [] 
  }
  const [form, setForm] = useState(estadoInicial)

  const avisar = (msg, color = theme.cyan) => {
    setNotificacion({ mensaje: msg, visible: true, color: color })
    setTimeout(() => setNotificacion(prev => ({ ...prev, visible: false })), 3000)
  }

  const cargarEquipos = async () => {
    const { data } = await supabase.from('Celulares').select('*').order('created_at', { ascending: false })
    setEquipos(data || [])
  }
  useEffect(() => { if (autorizado) cargarEquipos() }, [autorizado])

  const manejarFotos = async (e) => {
    const archivos = Array.from(e.target.files)
    setSubiendo(true)
    let nuevasUrls = [...(form.imagen_url || [])]
    for (const archivo of archivos) {
      const nombre = `${Date.now()}_${archivo.name}`
      const { data, error } = await supabase.storage.from('Celulares - fotos').upload(nombre, archivo)
      if (!error) {
        const { data: u } = supabase.storage.from('Celulares - fotos').getPublicUrl(nombre)
        nuevasUrls.push(u.publicUrl)
      }
    }
    setForm({ ...form, imagen_url: nuevasUrls }); setSubiendo(false); avisar("📸 Fotos subidas")
  }

  const guardar = async () => {
    const datosLimpios = { 
        ...form, 
        precio_venta: form.precio_venta === '' ? null : form.precio_venta, 
        precio_costo: form.precio_costo === '' ? null : form.precio_costo, 
        salud_bateria: form.salud_bateria === '' ? null : form.salud_bateria 
    }
    
    if (editandoId) {
      const { error } = await supabase.from('Celulares').update(datosLimpios).eq('id', editandoId)
      if (error) avisar('Error: ' + error.message, 'red'); else { setEditandoId(null); avisar("✅ Actualizado"); }
    } else {
      const { error } = await supabase.from('Celulares').insert([datosLimpios])
      if (error) avisar('Error: ' + error.message, 'red'); else { avisar("🚀 Registrado"); }
    }
    setForm(estadoInicial); cargarEquipos();
  }

  const equiposFiltrados = equipos.filter(cel => {
    const texto = busqueda.toLowerCase()
    return (
        cel.marca?.toLowerCase().includes(texto) || 
        cel.modelo?.toLowerCase().includes(texto) ||
        cel.estado?.toLowerCase().includes(texto) ||
        cel.imei?.toLowerCase().includes(texto) || 
        cel.color?.toLowerCase().includes(texto)
    )
  })

  // --- LOGIN ---
  if (!autorizado) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: theme.gradient, display: 'grid', placeItems: 'center', zIndex: 9999, fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: theme.card, padding: '50px 40px', borderRadius: '35px', textAlign: 'center', border: `2px solid ${theme.cyan}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)', width: '90%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px', fontWeight: '900', color: 'white' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <p style={{ color: theme.cyan, marginBottom: '35px', letterSpacing: '2px', fontSize: '0.9rem' }}>PANEL DE GESTIÓN</p>
          <input 
            type="password" placeholder="Escribe la clave..." value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && verificarClave()}
            style={{ width: '100%', padding: '20px', borderRadius: '15px', border: 'none', backgroundColor: '#0b1426', color: 'white', marginBottom: '25px', textAlign: 'center', fontSize: '1.2rem', outline: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={verificarClave} style={{ width: '100%', padding: '20px', background: theme.orange, color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(243, 156, 18, 0.3)' }}>
            ACCEDER AHORA 🔑
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, padding: '50px 20px', color: 'white', fontFamily: 'sans-serif' }}>
      {notificacion.visible && <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: theme.card, color: theme.white, padding: '15px 30px', borderRadius: '15px', borderLeft: `6px solid ${notificacion.color}`, zIndex: 10000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{notificacion.mensaje}</div>}

      {/* --- MODAL ZOOM --- */}
      {modalImagen && (
        <div 
          onClick={() => setModalImagen(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
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

      <div style={{ maxWidth: '1400px', margin: 'auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0 }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <button onClick={() => { setAutorizado(false); localStorage.removeItem('farrus_auth'); }} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.cyan}`, color: theme.cyan, padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }}>Cerrar Sesión 🔒</button>
        </header>

        {/* --- FORMULARIO --- */}
        <div style={{ backgroundColor: theme.card, padding: '50px', borderRadius: '40px', marginBottom: '80px', border: '1px solid rgba(0,210,255,0.15)', boxShadow: '0 40px 90px rgba(0,0,0,0.4)' }}>
          <h2 style={{ marginBottom: '40px', borderLeft: `8px solid ${theme.orange}`, paddingLeft: '20px', fontSize: '1.8rem' }}>{editandoId ? '📝 EDITAR EQUIPO' : '📦 NUEVO INGRESO'}</h2>
          
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
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MARCA</label><input placeholder="Ej. Apple" value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MODELO</label><input placeholder="Ej. iPhone 15" value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>COLOR</label><input placeholder="Ej. Azul Titanio" value={form.color} style={inputStyle} onChange={e => setForm({...form, color: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>ALMACENAMIENTO</label><input placeholder="Ej. 256Gb" value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>IMEI / SERIE</label><input placeholder="Escanea o escribe..." value={form.imei} style={{...inputStyle, fontFamily: 'monospace'}} onChange={e => setForm({...form, imei: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO VENTA</label><input type="number" placeholder="S/." value={form.precio_venta} style={{...inputStyle, borderColor: theme.orange}} onChange={e => setForm({...form, precio_venta: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO COSTO</label><input type="number" placeholder="S/." value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>SALUD BATERÍA (%)</label><input type="number" placeholder="Ej. 90" value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>DESCRIPCIÓN</label><textarea placeholder="Detalles..." value={form.descripcion} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} onChange={e => setForm({...form, descripcion: e.target.value})} /></div>
            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.25)', padding: '20px', borderRadius: '20px', border: '2px dashed #25335a' }}>
                {form.imagen_url?.map((url, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={url} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '15px', border: `2px solid ${theme.cyan}` }} />
                    <button onClick={() => setForm({...form, imagen_url: form.imagen_url.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4b2b', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}>✕</button>
                  </div>
                ))}
                <label style={{ width: '100px', height: '100px', border: `3px dashed ${theme.cyan}`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '2rem', color: theme.cyan }}>{subiendo ? '⏳' : '+'}<input type="file" multiple hidden onChange={manejarFotos} /></label>
              </div>
            </div>
          </div>
          <button onClick={guardar} style={{ width: '100%', padding: '25px', background: theme.orange, color: 'white', border: 'none', borderRadius: '25px', fontWeight: '900', fontSize: '1.2rem', marginTop: '40px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(243, 156, 18, 0.3)' }}>{editandoId ? 'CONFIRMAR CAMBIOS' : 'GUARDAR EQUIPO'}</button>
        </div>

        {/* --- LISTADO --- */}
        <h2 style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: `8px solid ${theme.cyan}`, fontSize: '2rem' }}>INVENTARIO ({equipos.length})</h2>
        <input type="text" placeholder="🔍 Buscar por IMEI, Marca, Modelo, Color..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: '100%', padding: '22px', fontSize: '1.2rem', borderRadius: '20px', border: 'none', background: '#162447', color: 'white', marginBottom: '40px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', outline: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {equiposFiltrados.map(cel => (
            <TarjetaEquipo 
              key={cel.id} cel={cel} theme={theme}
              onOpenModal={setModalImagen}
              onEdit={(equipo) => { setForm(equipo); setEditandoId(equipo.id); window.scrollTo({top: 0, behavior: 'smooth'}); }}
              onDelete={async (id) => { if(confirm('¿Eliminar definitivamente?')) { await supabase.from('Celulares').delete().eq('id', id); cargarEquipos(); } }}
            />
          ))}
          {equiposFiltrados.length === 0 && <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888', fontSize: '1.5rem' }}>No se encontraron resultados 🕵️‍♂️</p>}
        </div>
      </div>
    </div>
  )
}