import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, color: '#00d2ff' })

  // --- 🔒 SISTEMA DE SEGURIDAD (INICIO) ---
  const [autorizado, setAutorizado] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const CLAVE_SECRETA = "carsal11" // Tu clave personalizada solicitada

  const verificarClave = () => {
    if (passwordInput === CLAVE_SECRETA) {
      setAutorizado(true)
      localStorage.setItem('farrus_auth', 'true') // Mantiene la sesión activa brevemente
    } else {
      avisar("⚠️ Clave incorrecta", "#ff4b2b")
    }
  }

  // Verifica si ya habías entrado antes en esta sesión
  useEffect(() => {
    const auth = localStorage.getItem('farrus_auth')
    if (auth === 'true') setAutorizado(true)
  }, [])
  // --- 🔒 SISTEMA DE SEGURIDAD (FIN) ---

  const estadoInicial = {
    modelo: '', marca: '', almacenamiento: '', estado: 'Sellado', imei: '', 
    precio_venta: '', precio_costo: '', stock: '', 
    salud_bateria: '', descripcion: '', imagen_url: [] 
  }
  const [form, setForm] = useState(estadoInicial)

  const theme = { 
    navy: '#0b1426', card: '#162447', orange: '#f39c12', 
    cyan: '#00d2ff', white: '#ffffff' 
  }

  const avisar = (msg, color = theme.cyan) => {
    setNotificacion({ mensaje: msg, visible: true, color: color })
    setTimeout(() => setNotificacion(prev => ({ ...prev, visible: false })), 3000)
  }

  // Función para cargar equipos desde Supabase
  const cargarEquipos = async () => {
    const { data, error } = await supabase.from('Celulares').select('*').order('created_at', { ascending: false })
    if (error) avisar("Error al cargar: " + error.message, "red")
    else setEquipos(data || [])
  }

  useEffect(() => { 
    if (autorizado) cargarEquipos() 
  }, [autorizado])

  // Lógica para subir múltiples fotos a la galería
  const manejarFotos = async (e) => {
    const archivos = Array.from(e.target.files)
    if (archivos.length === 0) return
    setSubiendo(true)
    let nuevasUrls = [...(form.imagen_url || [])]
    
    for (const archivo of archivos) {
      const nombreArchivo = `${Date.now()}_${archivo.name}`
      const { data, error } = await supabase.storage.from('Celulares - fotos').upload(nombreArchivo, archivo)
      if (!error) {
        const { data: urlData } = supabase.storage.from('Celulares - fotos').getPublicUrl(nombreArchivo)
        nuevasUrls.push(urlData.publicUrl)
      }
    }
    setForm({ ...form, imagen_url: nuevasUrls })
    avisar(`📸 ${archivos.length} foto(s) añadidas`)
    setSubiendo(false)
  }

  const eliminarFotoGaleria = (index) => {
    const filtradas = form.imagen_url.filter((_, i) => i !== index)
    setForm({ ...form, imagen_url: filtradas })
  }

  // Guardar o Actualizar equipo
  const guardar = async () => {
    // Limpieza de datos numéricos para evitar errores de base de datos
    const datos = { ...form }
    const camposNum = ['precio_venta', 'precio_costo', 'stock', 'salud_bateria']
    camposNum.forEach(c => { if (datos[c] === '') datos[c] = null })

    if (editandoId) {
      const { error } = await supabase.from('Celulares').update(datos).eq('id', editandoId)
      if (error) avisar("Error: " + error.message, "#ff4b2b")
      else { 
        avisar('✅ Inventario actualizado'); 
        setEditandoId(null); 
        setForm(estadoInicial); 
        cargarEquipos(); 
      }
    } else {
      const { error } = await supabase.from('Celulares').insert([datos])
      if (error) avisar("Error: " + error.message, "#ff4b2b")
      else { 
        avisar('🚀 Equipo registrado con éxito'); 
        setForm(estadoInicial); 
        cargarEquipos(); 
      }
    }
  }

  // Borrar equipo de la lista
  const eliminarEquipo = async (id) => {
    if(window.confirm('¿Estás seguro de eliminar este celular? Esta acción no se puede deshacer.')) {
      const { error } = await supabase.from('Celulares').delete().eq('id', id)
      if (error) avisar("Error al borrar", "red")
      else { avisar("🗑️ Equipo eliminado", theme.orange); cargarEquipos(); }
    }
  }

  const inputStyle = { backgroundColor: '#0b1426', border: '1px solid #25335a', borderRadius: '12px', padding: '14px', color: '#ffffff', outline: 'none' }

  // VISTA DE LOGIN
  if (!autorizado) {
    return (
      <div style={{ height: '100vh', backgroundColor: theme.navy, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: theme.card, padding: '40px', borderRadius: '30px', textAlign: 'center', border: `2px solid ${theme.cyan}`, boxShadow: '0 0 30px rgba(0, 210, 255, 0.3)' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <p style={{ color: theme.muted, marginBottom: '30px' }}>Panel de Control Privado</p>
          <input 
            type="password" 
            placeholder="Escribe la contraseña..." 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verificarClave()}
            style={{ width: '100%', padding: '18px', borderRadius: '15px', border: 'none', backgroundColor: theme.navy, color: 'white', marginBottom: '20px', textAlign: 'center', fontSize: '1.1rem', outline: 'none' }}
          />
          <button onClick={verificarClave} style={{ width: '100%', padding: '18px', background: theme.orange, color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>ACCEDER AHORA 🔑</button>
        </div>
        {notificacion.visible && (
          <div style={{ position: 'fixed', top: '20px', backgroundColor: theme.card, color: 'white', padding: '15px 25px', borderRadius: '12px', borderLeft: `6px solid ${notificacion.color}` }}>{notificacion.mensaje}</div>
        )}
      </div>
    )
  }

  // VISTA DEL INVENTARIO (Solo visible si autorizado === true)
  return (
    <div style={{ padding: '20px', width: '98%', maxWidth: '1600px', margin: 'auto', backgroundColor: theme.navy, minHeight: '100vh', color: theme.white, fontFamily: 'sans-serif' }}>
      {notificacion.visible && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: theme.card, color: theme.white, padding: '15px 25px', borderRadius: '12px', borderLeft: `6px solid ${notificacion.color}`, zIndex: 1000, boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }}>{notificacion.mensaje}</div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: 0 }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
        <button onClick={() => { setAutorizado(false); localStorage.removeItem('farrus_auth'); }} style={{ background: 'transparent', border: '1px solid #444', color: '#888', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', marginTop: '10px' }}>Cerrar Sesión Segura 🔒</button>
      </div>

      {/* Formulario de Ingreso */}
      <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '25px', borderTop: `6px solid ${theme.orange}`, marginBottom: '50px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontSize: '1.4rem', marginTop: 0 }}>{editandoId ? '📝 EDITANDO DISPOSITIVO' : '📦 REGISTRAR NUEVO INGRESO'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginTop: '20px' }}>
          <input placeholder='Marca' value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} />
          <input placeholder='Modelo' value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} />
          <input placeholder='Almacenamiento (Gb)' value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} />
          <input placeholder='Precio Venta S/.' type='number' value={form.precio_venta} style={inputStyle} onChange={e => setForm({...form, precio_venta: e.target.value})} />
          <input placeholder='Precio Costo S/.' type='number' value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} />
          <input placeholder='Batería %' type='number' value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} />
          
          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <p style={{ color: theme.cyan, fontWeight: 'bold' }}>Galería de Fotos ({form.imagen_url?.length || 0})</p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: '#0b1426', padding: '20px', borderRadius: '15px', border: '1px solid #25335a' }}>
              {form.imagen_url?.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px', border: `2px solid ${theme.cyan}` }} />
                  <button onClick={() => eliminarFotoGaleria(i)} style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#ff4b2b', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>X</button>
                </div>
              ))}
              <label style={{ width: '100px', height: '100px', border: `2px dashed ${theme.cyan}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '2rem', color: theme.cyan }}>
                {subiendo ? '...' : '+'}
                <input type="file" accept="image/*" multiple onChange={manejarFotos} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
        <button onClick={guardar} style={{ marginTop: '25px', width: '100%', padding: '20px', background: theme.orange, color: theme.white, border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 20px rgba(243, 156, 18, 0.2)' }}>
          {editandoId ? 'CONFIRMAR CAMBIOS EN EL EQUIPO' : 'GUARDAR EQUIPO EN INVENTARIO'}
        </button>
      </div>

      {/* Listado de equipos registrados */}
      <h2 style={{ marginBottom: '30px', paddingLeft: '15px', borderLeft: `6px solid ${theme.cyan}` }}>STOCK EN TIENDA ({equipos.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {equipos.map(cel => (
          <div key={cel.id} style={{ backgroundColor: theme.card, borderRadius: '30px', overflow: 'hidden', border: '1px solid #25335a', transition: 'transform 0.3s' }}>
            <img src={cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250'} style={{ width: '100%', height: '230px', objectFit: 'cover' }} />
            <div style={{ padding: '25px' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{cel.marca} {cel.modelo}</h3>
              <p style={{ color: theme.cyan, fontWeight: 'bold' }}>💾 {cel.almacenamiento || '---'}</p>
              <p style={{ color: theme.orange, fontSize: '1.8rem', fontWeight: '900', margin: '15px 0' }}>S/ {cel.precio_venta}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { setEditandoId(cel.id); setForm(cel); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{ flex: 1, padding: '12px', background: 'transparent', border: `2px solid ${theme.cyan}`, color: theme.cyan, borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>EDITAR</button>
                <button onClick={() => eliminarEquipo(cel.id)} style={{ padding: '12px', background: '#2d1a1a', color: '#ff6b6b', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}