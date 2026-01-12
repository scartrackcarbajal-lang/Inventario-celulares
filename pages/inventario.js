import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Componente Tarjeta para el Stock con Galería Interactiva
function TarjetaEquipo({ cel, onEdit, onDelete, theme }) {
  const [fotoActiva, setFotoActiva] = useState(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto')

  return (
    <div style={{ backgroundColor: theme.card, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${theme.cyan}33`, boxShadow: '0 15px 35px rgba(0,0,0,0.3)', transition: 'transform 0.3s' }}>
      {/* Imagen Principal que cambia al hacer clic en miniaturas */}
      <div style={{ height: '260px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={fotoActiva} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Principal" />
      </div>

      {/* Mini Galería Seleccionable */}
      {cel.imagen_url && cel.imagen_url.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.4)', overflowX: 'auto', borderBottom: '1px solid #25335a' }}>
          {cel.imagen_url.map((url, index) => (
            <img 
              key={index} src={url} 
              onClick={() => setFotoActiva(url)}
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px', border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid ${theme.cyan}44`, cursor: 'pointer', opacity: fotoActiva === url ? 1 : 0.6 }} 
            />
          ))}
        </div>
      )}

      <div style={{ padding: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{cel.marca} {cel.modelo}</h3>
            <span style={{ fontSize: '0.8rem', color: theme.cyan, background: 'rgba(0,210,255,0.1)', padding: '4px 10px', borderRadius: '10px' }}>{cel.salud_bateria ? cel.salud_bateria + '%' : '---'} 🔋</span>
        </div>
        <p style={{ color: theme.cyan, fontWeight: 'bold', margin: '10px 0' }}>💾 {cel.almacenamiento || '---'}</p>
        
        {/* Visualización de la Descripción */}
        {cel.descripcion && (
            <div style={{ margin: '15px 0', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: `3px solid ${theme.orange}`, fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>
                {cel.descripcion}
            </div>
        )}

        <p style={{ color: theme.orange, fontSize: '1.8rem', fontWeight: '900', margin: '15px 0' }}>S/ {cel.precio_venta}</p>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onEdit(cel)} style={{ flex: 1, padding: '12px', background: 'transparent', border: `2px solid ${theme.cyan}`, color: theme.cyan, borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>EDITAR</button>
          <button onClick={() => onDelete(cel.id)} style={{ padding: '12px 15px', background: 'linear-gradient(135deg, #4a1515, #2d1a1a)', color: '#ff6b6b', border: 'none', borderRadius: '15px', cursor: 'pointer' }}>🗑️</button>
        </div>
      </div>
    </div>
  )
}

export default function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, color: '#00d2ff' })

  // --- 🔒 SEGURIDAD ---
  const [autorizado, setAutorizado] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const CLAVE_SECRETA = "carsal11"

  const verificarClave = () => {
    if (passwordInput === CLAVE_SECRETA) {
      setAutorizado(true)
      localStorage.setItem('farrus_auth', 'true')
    } else { avisar("⚠️ Clave incorrecta", "#ff4b2b") }
  }

  useEffect(() => { if (localStorage.getItem('farrus_auth') === 'true') setAutorizado(true) }, [])

  const theme = { 
    navy: '#0b1426', card: '#162447', orange: '#f39c12', 
    cyan: '#00d2ff', white: '#ffffff',
    gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)'
  }

  const estadoInicial = { 
    marca: '', modelo: '', almacenamiento: '', precio_venta: '', 
    precio_costo: '', salud_bateria: '', descripcion: '', imagen_url: [] 
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
    setForm({ ...form, imagen_url: nuevasUrls }); setSubiendo(false); avisar("📸 Galería actualizada")
  }

  const guardar = async () => {
    if (editandoId) {
      await supabase.from('Celulares').update(form).eq('id', editandoId)
      setEditandoId(null)
    } else {
      await supabase.from('Celulares').insert([form])
    }
    setForm(estadoInicial); cargarEquipos(); avisar("🚀 Registro exitoso")
  }

  const inputStyle = { padding: '16px', borderRadius: '15px', border: '1px solid #25335a', background: '#0b1426', color: 'white', outline: 'none', fontSize: '1rem' }

  // --- LOGIN CENTRADO ---
  if (!autorizado) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: theme.gradient, display: 'grid', placeItems: 'center', zIndex: 9999, fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: theme.card, padding: '60px 40px', borderRadius: '40px', textAlign: 'center', border: `2px solid ${theme.cyan}`, boxShadow: '0 25px 70px rgba(0,0,0,0.6)', width: '90%', maxWidth: '420px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px', fontWeight: '900' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <p style={{ color: theme.cyan, marginBottom: '40px', letterSpacing: '3px', fontSize: '0.8rem', fontWeight: 'bold' }}>SISTEMA DE GESTIÓN</p>
          <input 
            type="password" placeholder="Escribe la clave" value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verificarClave()}
            style={{ width: '100%', padding: '22px', borderRadius: '18px', border: 'none', backgroundColor: '#0b1426', color: 'white', marginBottom: '25px', textAlign: 'center', fontSize: '1.3rem', outline: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={verificarClave} style={{ width: '100%', padding: '20px', background: theme.orange, color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(243, 156, 18, 0.4)' }}>ACCEDER AL PANEL 🔑</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, padding: '50px 20px', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1300px', margin: 'auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: '900', margin: 0, letterSpacing: '-2px' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <button onClick={() => { setAutorizado(false); localStorage.removeItem('farrus_auth'); }} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.cyan}`, color: theme.cyan, padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }}>Finalizar Sesión 🔒</button>
        </header>

        {/* Formulario de Gestión con Descripción */}
        <div style={{ backgroundColor: theme.card, padding: '45px', borderRadius: '35px', marginBottom: '70px', border: '1px solid rgba(0,210,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
          <h2 style={{ marginBottom: '35px', borderLeft: `6px solid ${theme.orange}`, paddingLeft: '20px', fontSize: '1.6rem' }}>{editandoId ? '📝 ACTUALIZAR DISPOSITIVO' : '📦 REGISTRAR NUEVO STOCK'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
            <input placeholder="Marca (ej. Apple)" value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} />
            <input placeholder="Modelo (ej. iPhone 15 Pro)" value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} />
            <input placeholder="Almacenamiento (Gb/Tb)" value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} />
            <input placeholder="Precio Venta S/." type="number" value={form.precio_venta} style={inputStyle} onChange={e => setForm({...form, precio_venta: e.target.value})} />
            <input placeholder="Precio Costo S/." type="number" value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} />
            <input placeholder="Salud Batería %" type="number" value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} />
            
            {/* Campo de Descripción */}
            <textarea 
                placeholder="Descripción detallada: estado estético, accesorios incluidos, tiempo de uso, etc." 
                value={form.descripcion} 
                style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: '100px', resize: 'vertical' }} 
                onChange={e => setForm({...form, descripcion: e.target.value})}
            />

            <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
              <p style={{ color: theme.cyan, marginBottom: '15px', fontWeight: 'bold' }}>IMÁGENES DEL EQUIPO ({form.imagen_url?.length || 0})</p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.3)', padding: '25px', borderRadius: '25px', border: '1px dashed #25335a' }}>
                {form.imagen_url?.map((url, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={url} style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '15px', border: `2px solid ${theme.cyan}` }} />
                    <button onClick={() => setForm({...form, imagen_url: form.imagen_url.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4b2b', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                  </div>
                ))}
                <label style={{ width: '110px', height: '110px', border: `3px dashed ${theme.cyan}`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '2.5rem', color: theme.cyan, background: 'rgba(0,210,255,0.05)' }}>
                  {subiendo ? '...' : '+'}
                  <input type="file" multiple hidden onChange={manejarFotos} />
                </label>
              </div>
            </div>
          </div>
          <button onClick={guardar} style={{ width: '100%', padding: '22px', background: theme.orange, color: 'white', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '1.2rem', marginTop: '40px', cursor: 'pointer', boxShadow: '0 15px 30px rgba(243, 156, 18, 0.3)', transition: 'transform 0.2s' }} onMouseDown={e => e.target.style.transform='scale(0.98)'} onMouseUp={e => e.target.style.transform='scale(1)'}>
            {editandoId ? 'APLICAR CAMBIOS AL EQUIPO' : 'REGISTRAR EQUIPO EN EL SISTEMA'}
          </button>
        </div>

        {/* Stock con Galería Dinámica */}
        <h2 style={{ marginBottom: '40px', paddingLeft: '25px', borderLeft: `8px solid ${theme.cyan}`, fontSize: '2rem' }}>STOCK DISPONIBLE EN TIENDA ({equipos.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '40px' }}>
          {equipos.map(cel => (
            <TarjetaEquipo 
              key={cel.id} 
              cel={cel} 
              theme={theme} 
              onEdit={(equipo) => { setForm(equipo); setEditandoId(equipo.id); window.scrollTo({top: 0, behavior: 'smooth'}); }}
              onDelete={async (id) => { if(confirm('¿Deseas eliminar permanentemente este equipo?')) { await supabase.from('Celulares').delete().eq('id', id); cargarEquipos(); avisar("🗑️ Eliminado"); } }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}