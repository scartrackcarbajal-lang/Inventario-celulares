import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// --- COMPONENTE TARJETA (Visualización del Stock) ---
function TarjetaEquipo({ cel, onEdit, onDelete, theme }) {
  const [fotoActiva, setFotoActiva] = useState(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto')

  // Colores de etiqueta según estado
  const colorEstado = {
    'Nuevo Sellado': '#00d2ff', // Cyan neón
    'Semi Nuevo': '#f39c12',    // Naranja
    'Usado': '#e74c3c',         // Rojo
    'Open Box': '#9b59b6'       // Morado
  }

  return (
    <div style={{ backgroundColor: theme.card, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${theme.cyan}33`, boxShadow: '0 15px 35px rgba(0,0,0,0.3)', transition: 'transform 0.3s' }}>
      
      {/* 1. IMAGEN PRINCIPAL */}
      <div style={{ height: '280px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <img src={fotoActiva} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="Preview" />
        
        {/* Etiqueta de Estado */}
        <div style={{ position: 'absolute', top: '15px', right: '15px', background: colorEstado[cel.estado] || '#888', color: 'white', padding: '6px 12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.8rem', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: 2 }}>
          {cel.estado}
        </div>

        {/* Etiqueta de Color (Nueva) */}
        {cel.color && (
           <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', border: `1px solid ${theme.cyan}55` }}>
             🎨 {cel.color}
           </div>
        )}
      </div>

      {/* 2. MINI GALERÍA */}
      {cel.imagen_url && cel.imagen_url.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.4)', overflowX: 'auto', borderBottom: '1px solid #25335a' }}>
          {cel.imagen_url.map((url, index) => (
            <img 
              key={index} src={url} onClick={() => setFotoActiva(url)}
              style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '10px', border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid ${theme.cyan}44`, cursor: 'pointer', opacity: fotoActiva === url ? 1 : 0.6 }} 
            />
          ))}
        </div>
      )}

      {/* 3. DATOS TÉCNICOS */}
      <div style={{ padding: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>{cel.marca} {cel.modelo}</h3>
            {cel.salud_bateria && <span style={{ fontSize: '0.85rem', color: theme.cyan, background: 'rgba(0,210,255,0.1)', padding: '5px 10px', borderRadius: '10px' }}>🔋 {cel.salud_bateria}%</span>}
        </div>
        
        <p style={{ color: '#aaa', fontWeight: 'bold', margin: '5px 0', fontSize: '0.9rem' }}>💾 {cel.almacenamiento || 'No esp.'}</p>
        
        {/* IMEI (Solo visible para ti en inventario) */}
        {cel.imei && (
            <p style={{ color: '#666', fontSize: '0.8rem', fontFamily: 'monospace', margin: '5px 0' }}>IMEI: {cel.imei}</p>
        )}

        {cel.descripcion && (
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: `3px solid ${theme.orange}`, fontSize: '0.85rem', color: '#ccc', margin: '15px 0', whiteSpace: 'pre-wrap' }}>
                {cel.descripcion}
            </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div><span style={{ fontSize: '0.8rem', color: '#666' }}>Precio Venta</span><div style={{ color: theme.orange, fontSize: '1.8rem', fontWeight: '900' }}>S/ {cel.precio_venta}</div></div>
          {cel.precio_costo && <div style={{ textAlign: 'right' }}><span style={{ fontSize: '0.8rem', color: '#666' }}>Costo</span><div style={{ color: '#555', fontSize: '1.1rem' }}>S/ {cel.precio_costo}</div></div>}
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <button onClick={() => onEdit(cel)} style={{ flex: 1, padding: '14px', background: 'transparent', border: `2px solid ${theme.cyan}`, color: theme.cyan, borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>EDITAR</button>
          <button onClick={() => onDelete(cel.id)} style={{ padding: '14px 20px', background: '#2d1a1a', color: '#ff6b6b', border: 'none', borderRadius: '15px', cursor: 'pointer' }}>🗑️</button>
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

  // Seguridad
  const [autorizado, setAutorizado] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const CLAVE_SECRETA = "carsal11"

  const verificarClave = () => {
    if (passwordInput === CLAVE_SECRETA) { setAutorizado(true); localStorage.setItem('farrus_auth', 'true'); } 
    else { avisar("⚠️ Clave incorrecta", "#ff4b2b") }
  }
  useEffect(() => { if (localStorage.getItem('farrus_auth') === 'true') setAutorizado(true) }, [])

  // Estilos y Estado Inicial (Ahora con IMEI y COLOR)
  const theme = { navy: '#0b1426', card: '#162447', orange: '#f39c12', cyan: '#00d2ff', white: '#ffffff', gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)' }
  const inputStyle = { padding: '16px', borderRadius: '15px', border: '1px solid #25335a', background: '#0b1426', color: 'white', outline: 'none', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }
  
  const estadoInicial = { 
    marca: '', modelo: '', color: '', almacenamiento: '', imei: '', // Agregados
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
      if (error) avisar('Error: ' + error.message, 'red'); else { setEditandoId(null); avisar("✅ Actualizado correctamente"); }
    } else {
      const { error } = await supabase.from('Celulares').insert([datosLimpios])
      if (error) avisar('Error: ' + error.message, 'red'); else { avisar("🚀 Equipo registrado"); }
    }
    setForm(estadoInicial); cargarEquipos();
  }

  // Lógica de BUSCADOR MEJORADO (Busca por IMEI también)
  const equiposFiltrados = equipos.filter(cel => {
    const texto = busqueda.toLowerCase()
    return (
        cel.marca?.toLowerCase().includes(texto) || 
        cel.modelo?.toLowerCase().includes(texto) ||
        cel.estado?.toLowerCase().includes(texto) ||
        cel.imei?.toLowerCase().includes(texto) || // Búsqueda por IMEI
        cel.color?.toLowerCase().includes(texto)
    )
  })

  // --- LOGIN ---
  if (!autorizado) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: theme.gradient, display: 'grid', placeItems: 'center', zIndex: 9999, fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: theme.card, padding: '60px 40px', borderRadius: '40px', textAlign: 'center', border: `2px solid ${theme.cyan}`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)', width: '90%', maxWidth: '450px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px', fontWeight: '900', color: 'white' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <p style={{ color: theme.cyan, marginBottom: '40px', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 'bold' }}>PANEL DE GESTIÓN</p>
          <input type="password" placeholder="Clave de acceso" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && verificarClave()} style={{ width: '100%', padding: '22px', borderRadius: '18px', border: 'none', backgroundColor: '#0b1426', color: 'white', marginBottom: '25px', textAlign: 'center', fontSize: '1.3rem', outline: 'none' }} />
          <button onClick={verificarClave} style={{ width: '100%', padding: '20px', background: theme.orange, color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}>ACCEDER 🔑</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, padding: '50px 20px', color: 'white', fontFamily: 'sans-serif' }}>
      {notificacion.visible && <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: theme.card, color: theme.white, padding: '15px 30px', borderRadius: '15px', borderLeft: `6px solid ${notificacion.color}`, zIndex: 10000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{notificacion.mensaje}</div>}

      <div style={{ maxWidth: '1400px', margin: 'auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0 }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <button onClick={() => { setAutorizado(false); localStorage.removeItem('farrus_auth'); }} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.cyan}`, color: theme.cyan, padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold' }}>Cerrar Sesión 🔒</button>
        </header>

        {/* --- FORMULARIO COMPLETO --- */}
        <div style={{ backgroundColor: theme.card, padding: '50px', borderRadius: '40px', marginBottom: '80px', border: '1px solid rgba(0,210,255,0.15)', boxShadow: '0 40px 90px rgba(0,0,0,0.4)' }}>
          <h2 style={{ marginBottom: '40px', borderLeft: `8px solid ${theme.orange}`, paddingLeft: '20px', fontSize: '1.8rem' }}>{editandoId ? '📝 EDITAR EQUIPO' : '📦 NUEVO INGRESO'}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '25px' }}>
            {/* ESTADO */}
            <div>
                <label style={{marginLeft: '10px', color: theme.cyan, fontSize: '0.8rem', fontWeight: 'bold'}}>ESTADO</label>
                <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={inputStyle}>
                    <option value="Nuevo Sellado">Nuevo Sellado</option>
                    <option value="Semi Nuevo">Semi Nuevo</option>
                    <option value="Usado">Usado</option>
                    <option value="Open Box">Open Box</option>
                </select>
            </div>

            {/* CAMPOS DE TEXTO */}
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MARCA</label><input placeholder="Ej. Apple" value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MODELO</label><input placeholder="Ej. iPhone 15" value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} /></div>
            
            {/* NUEVO: COLOR */}
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>COLOR</label><input placeholder="Ej. Azul Titanio" value={form.color} style={inputStyle} onChange={e => setForm({...form, color: e.target.value})} /></div>
            
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>ALMACENAMIENTO</label><input placeholder="Ej. 256Gb" value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} /></div>
            
            {/* NUEVO: IMEI */}
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>IMEI / SERIE</label><input placeholder="Escanea o escribe..." value={form.imei} style={{...inputStyle, fontFamily: 'monospace'}} onChange={e => setForm({...form, imei: e.target.value})} /></div>

            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO VENTA</label><input type="number" placeholder="S/." value={form.precio_venta} style={{...inputStyle, borderColor: theme.orange}} onChange={e => setForm({...form, precio_venta: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO COSTO</label><input type="number" placeholder="S/." value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>SALUD BATERÍA (%)</label><input type="number" placeholder="Ej. 90" value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} /></div>
            
            <div style={{ gridColumn: '1 / -1' }}>
                <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>DESCRIPCIÓN ADICIONAL</label>
                <textarea placeholder="Detalles, fallas, accesorios..." value={form.descripcion} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} onChange={e => setForm({...form, descripcion: e.target.value})} />
            </div>

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

        {/* --- BUSCADOR INTELIGENTE Y LISTADO --- */}
        <h2 style={{ marginBottom: '20px', paddingLeft: '20px', borderLeft: `8px solid ${theme.cyan}`, fontSize: '2rem' }}>INVENTARIO ({equipos.length})</h2>
        
        <input 
          type="text" 
          placeholder="🔍 Buscar por IMEI, Marca, Modelo, Color..." 
          value={busqueda} 
          onChange={(e) => setBusqueda(e.target.value)} 
          style={{ width: '100%', padding: '22px', fontSize: '1.2rem', borderRadius: '20px', border: 'none', background: '#162447', color: 'white', marginBottom: '40px', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', outline: 'none' }} 
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {equiposFiltrados.map(cel => (
            <TarjetaEquipo 
              key={cel.id} 
              cel={cel} 
              theme={theme} 
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