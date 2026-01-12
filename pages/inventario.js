import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// --- COMPONENTE TARJETA (Maneja la visualización individual de cada equipo) ---
function TarjetaEquipo({ cel, onEdit, onDelete, theme }) {
  // Estado local para saber qué foto está viendo el usuario en este momento
  const [fotoActiva, setFotoActiva] = useState(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto')

  return (
    <div style={{ backgroundColor: theme.card, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${theme.cyan}33`, boxShadow: '0 15px 35px rgba(0,0,0,0.3)', transition: 'transform 0.3s' }}>
      
      {/* 1. IMAGEN PRINCIPAL (Cambia dinámicamente) */}
      <div style={{ height: '280px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <img 
          src={fotoActiva} 
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
          alt="Vista previa" 
        />
        <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px 0' }}></div>
      </div>

      {/* 2. MINI GALERÍA INTERACTIVA (Haz clic para cambiar la foto principal) */}
      {cel.imagen_url && cel.imagen_url.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.4)', overflowX: 'auto', borderBottom: '1px solid #25335a', scrollbarWidth: 'thin' }}>
          {cel.imagen_url.map((url, index) => (
            <img 
              key={index} 
              src={url} 
              onClick={() => setFotoActiva(url)} // <--- AQUÍ ESTÁ LA MAGIA DEL CAMBIO
              style={{ 
                width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', 
                border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid ${theme.cyan}44`, 
                cursor: 'pointer', opacity: fotoActiva === url ? 1 : 0.6, transition: 'all 0.2s'
              }} 
            />
          ))}
        </div>
      )}

      {/* 3. DATOS DEL EQUIPO */}
      <div style={{ padding: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'white' }}>{cel.marca} {cel.modelo}</h3>
            {cel.salud_bateria && (
              <span style={{ fontSize: '0.8rem', color: theme.cyan, background: 'rgba(0,210,255,0.1)', padding: '5px 10px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
                🔋 {cel.salud_bateria}%
              </span>
            )}
        </div>
        
        <p style={{ color: '#aaa', fontWeight: 'bold', margin: '5px 0', fontSize: '0.9rem' }}>💾 {cel.almacenamiento || 'No especificado'}</p>
        
        {/* DESCRIPCIÓN (Si existe, se muestra en un recuadro) */}
        {cel.descripcion && (
            <div style={{ margin: '15px 0', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '15px', borderLeft: `4px solid ${theme.orange}`, fontSize: '0.9rem', color: '#ccc', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                {cel.descripcion}
            </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>Precio Venta</span>
            <span style={{ color: theme.orange, fontSize: '1.8rem', fontWeight: '900' }}>S/ {cel.precio_venta}</span>
          </div>
          {cel.precio_costo && (
             <div style={{ textAlign: 'right' }}>
               <span style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>Costo</span>
               <span style={{ color: '#555', fontSize: '1.1rem' }}>S/ {cel.precio_costo}</span>
             </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <button onClick={() => onEdit(cel)} style={{ flex: 1, padding: '15px', background: 'transparent', border: `2px solid ${theme.cyan}`, color: theme.cyan, borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>EDITAR</button>
          <button onClick={() => onDelete(cel.id)} style={{ padding: '15px 20px', background: 'linear-gradient(135deg, #4a1515, #2d1a1a)', color: '#ff6b6b', border: 'none', borderRadius: '15px', cursor: 'pointer' }}>🗑️</button>
        </div>
      </div>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL (Gestión y Lógica) ---
export default function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, color: '#00d2ff' })

  // --- 🔒 SEGURIDAD (Login Centrado) ---
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

  // --- TEMA VISUAL ---
  const theme = { 
    navy: '#0b1426', card: '#162447', orange: '#f39c12', 
    cyan: '#00d2ff', white: '#ffffff',
    gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)'
  }

  // --- FORMULARIO (Incluye Descripción) ---
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
    setForm({ ...form, imagen_url: nuevasUrls }); setSubiendo(false); avisar("📸 Fotos cargadas")
  }

  const guardar = async () => {
    // Limpieza de datos numéricos para evitar errores si el campo está vacío
    const datosLimpios = {
        ...form,
        precio_venta: form.precio_venta === '' ? null : form.precio_venta,
        precio_costo: form.precio_costo === '' ? null : form.precio_costo,
        salud_bateria: form.salud_bateria === '' ? null : form.salud_bateria
    }

    if (editandoId) {
      const { error } = await supabase.from('Celulares').update(datosLimpios).eq('id', editandoId)
      if (error) avisar('Error: ' + error.message, 'red')
      else { setEditandoId(null); avisar("✅ Actualizado"); }
    } else {
      const { error } = await supabase.from('Celulares').insert([datosLimpios])
      if (error) avisar('Error: ' + error.message, 'red')
      else { avisar("🚀 Registrado"); }
    }
    setForm(estadoInicial); cargarEquipos();
  }

  const inputStyle = { padding: '18px', borderRadius: '15px', border: '1px solid #25335a', background: '#0b1426', color: 'white', outline: 'none', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }

  // --- PANTALLA DE LOGIN (Bloqueo) ---
  if (!autorizado) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: theme.gradient, display: 'grid', placeItems: 'center', zIndex: 9999, fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: theme.card, padding: '60px 40px', borderRadius: '40px', textAlign: 'center', border: `2px solid ${theme.cyan}`, boxShadow: '0 30px 80px rgba(0,0,0,0.7)', width: '90%', maxWidth: '450px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px', fontWeight: '900', color: 'white' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <p style={{ color: theme.cyan, marginBottom: '40px', letterSpacing: '2px', fontSize: '0.9rem', fontWeight: 'bold' }}>PANEL DE CONTROL PRIVADO</p>
          <input 
            type="password" placeholder="Contraseña de acceso" value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verificarClave()}
            style={{ width: '100%', padding: '22px', borderRadius: '18px', border: 'none', backgroundColor: '#0b1426', color: 'white', marginBottom: '25px', textAlign: 'center', fontSize: '1.2rem', outline: 'none' }}
          />
          <button onClick={verificarClave} style={{ width: '100%', padding: '20px', background: theme.orange, color: 'white', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(243, 156, 18, 0.4)' }}>ACCEDER AL SISTEMA 🔑</button>
        </div>
      </div>
    )
  }

  // --- PANEL DE GESTIÓN ---
  return (
    <div style={{ minHeight: '100vh', background: theme.gradient, padding: '50px 20px', color: 'white', fontFamily: 'sans-serif' }}>
       {notificacion.visible && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: theme.card, color: theme.white, padding: '15px 30px', borderRadius: '15px', borderLeft: `6px solid ${notificacion.color}`, zIndex: 10000, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontSize: '1.1rem' }}>
            {notificacion.mensaje}
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: 'auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '900', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <button onClick={() => { setAutorizado(false); localStorage.removeItem('farrus_auth'); }} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.cyan}`, color: theme.cyan, padding: '10px 25px', borderRadius: '25px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold', transition: '0.3s' }}>Cerrar Sesión Segura 🔒</button>
        </header>

        {/* --- FORMULARIO DE REGISTRO --- */}
        <div style={{ backgroundColor: theme.card, padding: '50px', borderRadius: '40px', marginBottom: '80px', border: '1px solid rgba(0,210,255,0.15)', boxShadow: '0 40px 90px rgba(0,0,0,0.4)' }}>
          <h2 style={{ marginBottom: '40px', borderLeft: `8px solid ${theme.orange}`, paddingLeft: '20px', fontSize: '1.8rem', color: 'white' }}>
            {editandoId ? '📝 ACTUALIZANDO INFORMACIÓN' : '📦 REGISTRAR NUEVO EQUIPO'}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MARCA</label><input placeholder="Ej. Apple, Samsung" value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>MODELO</label><input placeholder="Ej. iPhone 13 Pro" value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>ALMACENAMIENTO</label><input placeholder="Ej. 128Gb" value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} /></div>
            
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO VENTA (S/.)</label><input type="number" placeholder="0.00" value={form.precio_venta} style={{...inputStyle, borderColor: theme.orange}} onChange={e => setForm({...form, precio_venta: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>PRECIO COSTO (S/.)</label><input type="number" placeholder="0.00" value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} /></div>
            <div><label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>SALUD BATERÍA (%)</label><input type="number" placeholder="Ej. 95" value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} /></div>
            
            <div style={{ gridColumn: '1 / -1' }}>
                <label style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>DESCRIPCIÓN Y ESTADO</label>
                <textarea 
                    placeholder="Escribe aquí detalles importantes: estado de pantalla, accesorios que incluye, detalles estéticos, etc." 
                    value={form.descripcion} 
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical', lineHeight: '1.5' }} 
                    onChange={e => setForm({...form, descripcion: e.target.value})}
                />
            </div>

            {/* SECCIÓN DE FOTOS */}
            <div style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
              <p style={{ color: theme.cyan, marginBottom: '15px', fontWeight: 'bold' }}>FOTOGRAFÍAS DEL PRODUCTO ({form.imagen_url?.length || 0})</p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.25)', padding: '25px', borderRadius: '25px', border: '2px dashed #25335a' }}>
                {form.imagen_url?.map((url, i) => (
                  <div key={i} style={{ position: 'relative', transition: 'transform 0.2s' }}>
                    <img src={url} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '15px', border: `2px solid ${theme.cyan}`, boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }} />
                    <button onClick={() => setForm({...form, imagen_url: form.imagen_url.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4b2b', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 5px 10px rgba(0,0,0,0.3)', display: 'grid', placeItems: 'center' }}>✕</button>
                  </div>
                ))}
                <label style={{ width: '120px', height: '120px', border: `3px dashed ${theme.cyan}`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '3rem', color: theme.cyan, background: 'rgba(0,210,255,0.05)', transition: 'background 0.3s' }}>
                  {subiendo ? '⏳' : '+'}
                  <input type="file" multiple hidden onChange={manejarFotos} />
                </label>
              </div>
            </div>
          </div>
          
          <button onClick={guardar} style={{ width: '100%', padding: '25px', background: theme.orange, color: 'white', border: 'none', borderRadius: '25px', fontWeight: '900', fontSize: '1.3rem', marginTop: '40px', cursor: 'pointer', boxShadow: '0 15px 40px rgba(243, 156, 18, 0.3)', letterSpacing: '1px', transition: 'transform 0.2s' }} onMouseDown={e => e.target.style.transform='scale(0.98)'} onMouseUp={e => e.target.style.transform='scale(1)'}>
            {editandoId ? 'CONFIRMAR CAMBIOS' : 'GUARDAR EN INVENTARIO'}
          </button>
        </div>

        {/* --- LISTADO DE STOCK --- */}
        <h2 style={{ marginBottom: '45px', paddingLeft: '30px', borderLeft: `8px solid ${theme.cyan}`, fontSize: '2.2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>STOCK ACTUAL ({equipos.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '45px' }}>
          {equipos.map(cel => (
            <TarjetaEquipo 
              key={cel.id} 
              cel={cel} 
              theme={theme} 
              onEdit={(equipo) => { setForm(equipo); setEditandoId(equipo.id); window.scrollTo({top: 0, behavior: 'smooth'}); }}
              onDelete={async (id) => { if(confirm('¿Estás seguro de eliminar este equipo del sistema?')) { await supabase.from('Celulares').delete().eq('id', id); cargarEquipos(); avisar("🗑️ Equipo eliminado"); } }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}