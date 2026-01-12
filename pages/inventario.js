import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, color: '#00d2ff' })

  // --- 🔒 SISTEMA DE SEGURIDAD ---
  const [autorizado, setAutorizado] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const CLAVE_SECRETA = "carsal11"

  const verificarClave = () => {
    if (passwordInput === CLAVE_SECRETA) {
      setAutorizado(true)
      localStorage.setItem('farrus_auth', 'true')
    } else {
      avisar("⚠️ Clave incorrecta", "#ff4b2b")
    }
  }

  useEffect(() => {
    const auth = localStorage.getItem('farrus_auth')
    if (auth === 'true') setAutorizado(true)
  }, [])
  // ------------------------------

  const estadoInicial = {
    modelo: '', marca: '', almacenamiento: '', estado: 'Sellado', imei: '', 
    precio_venta: '', precio_costo: '', stock: '', 
    salud_bateria: '', descripcion: '', imagen_url: [] 
  }
  const [form, setForm] = useState(estadoInicial)

  const theme = { 
    navy: '#0b1426', card: '#162447', orange: '#f39c12', 
    cyan: '#00d2ff', white: '#ffffff',
    gradient: 'linear-gradient(135deg, #0b1426 0%, #162447 100%)' // Nuevo fondo
  }

  const avisar = (msg, color = theme.cyan) => {
    setNotificacion({ mensaje: msg, visible: true, color: color })
    setTimeout(() => setNotificacion(prev => ({ ...prev, visible: false })), 3000)
  }

  const cargarEquipos = async () => {
    const { data, error } = await supabase.from('Celulares').select('*').order('created_at', { ascending: false })
    if (error) avisar("Error al cargar: " + error.message, "red")
    else setEquipos(data || [])
  }

  useEffect(() => { 
    if (autorizado) cargarEquipos() 
  }, [autorizado])

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

  const guardar = async () => {
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

  const eliminarEquipo = async (id) => {
    if(window.confirm('¿Estás seguro de eliminar este celular?')) {
      const { error } = await supabase.from('Celulares').delete().eq('id', id)
      if (error) avisar("Error al borrar", "red")
      else { avisar("🗑️ Equipo eliminado", theme.orange); cargarEquipos(); }
    }
  }

  const inputStyle = { backgroundColor: '#0b1426', border: '1px solid #25335a', borderRadius: '12px', padding: '14px', color: '#ffffff', outline: 'none' }

  // --- VISTA DE LOGIN CENTRADA Y MEJORADA ---
  if (!autorizado) {
    return (
      <div style={{ height: '100vh', background: theme.gradient, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ backgroundColor: theme.card, padding: '50px', borderRadius: '30px', textAlign: 'center', border: `2px solid ${theme.cyan}`, boxShadow: '0 10px 40px rgba(0, 210, 255, 0.2)', maxWidth: '450px', width: '90%' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
          <p style={{ color: theme.cyan, marginBottom: '40px', letterSpacing: '1px' }}>ACCESO A GESTIÓN</p>
          <input 
            type="password" 
            placeholder="Introduce tu contraseña..." 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && verificarClave()}
            style={{ width: '100%', padding: '18px', borderRadius: '15px', border: '2px solid #25335a', backgroundColor: theme.navy, color: 'white', marginBottom: '25px', textAlign: 'center', fontSize: '1.1rem', outline: 'none', transition: 'border-color 0.3s' }}
            onFocus={(e) => e.target.style.borderColor = theme.cyan}
            onBlur={(e) => e.target.style.borderColor = '#25335a'}
          />
          <button onClick={verificarClave} style={{ width: '100%', padding: '18px', background: theme.orange, color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', transition: 'transform 0.2s', boxShadow: '0 5px 15px rgba(243, 156, 18, 0.3)' }} onMouseDown={e => e.target.style.transform = 'scale(0.98)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}>
            ENTRAR AL PANEL 🔐
          </button>
        </div>
        {notificacion.visible && (
          <div style={{ position: 'fixed', top: '20px', backgroundColor: theme.card, color: 'white', padding: '15px 25px', borderRadius: '12px', borderLeft: `6px solid ${notificacion.color}`, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}>{notificacion.mensaje}</div>
        )}
      </div>
    )
  }

  // --- VISTA DEL INVENTARIO CON FONDO Y GALERÍA ---
  return (
    <div style={{ padding: '30px 20px', width: '100%', background: theme.gradient, minHeight: '100vh', color: theme.white, fontFamily: 'sans-serif' }}>
      {notificacion.visible && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: theme.card, color: theme.white, padding: '15px 25px', borderRadius: '12px', borderLeft: `6px solid ${notificacion.color}`, zIndex: 1000, boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }}>{notificacion.mensaje}</div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>LOS FARRUS <span style={{ color: theme.orange }}>HUB</span></h1>
        <button onClick={() => { setAutorizado(false); localStorage.removeItem('farrus_auth'); }} style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${theme.cyan}`, color: theme.cyan, padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = theme.cyan + '22'} onMouseLeave={e => e.target.style.background = 'rgba(0,0,0,0.2)'}>Cerrar Sesión 🔒</button>
      </div>

      {/* Formulario de Registro/Edición */}
      <div style={{ backgroundColor: theme.card, padding: '35px', borderRadius: '30px', border: `1px solid rgba(0, 210, 255, 0.1)`, marginBottom: '50px', boxShadow: '0 20px 50px rgba(0,0,0,0.4)', maxWidth: '1200px', margin: '0 auto 50px' }}>
        <h2 style={{ fontSize: '1.5rem', marginTop: 0, borderBottom: `2px solid ${theme.orange}`, paddingBottom: '15px', display: 'inline-block' }}>{editandoId ? '📝 EDITANDO DISPOSITIVO' : '📦 REGISTRAR NUEVO INGRESO'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '25px' }}>
          <input placeholder='Marca' value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} />
          <input placeholder='Modelo' value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} />
          <input placeholder='Almacenamiento (Gb)' value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} />
          <input placeholder='Precio Venta S/.' type='number' value={form.precio_venta} style={inputStyle} onChange={e => setForm({...form, precio_venta: e.target.value})} />
          <input placeholder='Precio Costo S/.' type='number' value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} />
          <input placeholder='Batería %' type='number' value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} />
          
          <div style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
            <p style={{ color: theme.cyan, fontWeight: 'bold', marginBottom: '10px' }}>Galería de Fotos ({form.imagen_url?.length || 0})</p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '20px', border: `1px dashed ${theme.cyan}` }}>
              {form.imagen_url?.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '15px', border: `2px solid ${theme.cyan}`, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }} />
                  <button onClick={() => eliminarFotoGaleria(i)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ff4b2b', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>X</button>
                </div>
              ))}
              <label style={{ width: '110px', height: '110px', border: `2px dashed ${theme.cyan}`, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '2.5rem', color: theme.cyan, backgroundColor: theme.cyan + '11', transition: 'background 0.3s' }} onMouseEnter={e => e.target.style.background = theme.cyan + '33'} onMouseLeave={e => e.target.style.background = theme.cyan + '11'}>
                {subiendo ? '...' : '+'}
                <input type="file" accept="image/*" multiple onChange={manejarFotos} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
        <button onClick={guardar} style={{ marginTop: '30px', width: '100%', padding: '22px', background: theme.orange, color: theme.white, border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(243, 156, 18, 0.3)', transition: 'transform 0.2s' }} onMouseDown={e => e.target.style.transform = 'scale(0.98)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}>
          {editandoId ? 'CONFIRMAR CAMBIOS EN EL EQUIPO' : 'GUARDAR EQUIPO EN INVENTARIO'}
        </button>
      </div>

      {/* Listado de STOCK con Galería */}
      <h2 style={{ marginBottom: '35px', paddingLeft: '20px', borderLeft: `6px solid ${theme.cyan}`, maxWidth: '1200px', margin: '0 auto 35px' }}>STOCK EN TIENDA ({equipos.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '35px', maxWidth: '1200px', margin: 'auto' }}>
        {equipos.map(cel => (
          <div key={cel.id} style={{ backgroundColor: theme.card, borderRadius: '30px', overflow: 'hidden', border: `1px solid ${theme.cyan}33`, boxShadow: '0 15px 35px rgba(0,0,0,0.3)', transition: 'transform 0.3s, box-shadow 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 210, 255, 0.2)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)'; }}>
            
            {/* Imagen Principal */}
            <div style={{ position: 'relative', height: '250px' }}>
                <img src={cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '20px 15px 10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.6rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{cel.marca} {cel.modelo}</h3>
                </div>
            </div>

            {/* Mini Galería de Fotos */}
            {cel.imagen_url && cel.imagen_url.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', padding: '10px 15px', backgroundColor: 'rgba(0,0,0,0.3)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                    {cel.imagen_url.map((url, index) => (
                        <img key={index} src={url} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', border: index === 0 ? `2px solid ${theme.orange}` : `1px solid ${theme.cyan}66`, opacity: index === 0 ? 1 : 0.7, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = index === 0 ? 1 : 0.7} />
                    ))}
                </div>
            )}

            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <p style={{ color: theme.cyan, fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center' }}>💾 {cel.almacenamiento || '---'}</p>
                  <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>🔋 {cel.salud_bateria ? cel.salud_bateria + '%' : '---'}</p>
              </div>
              <p style={{ color: theme.orange, fontSize: '2rem', fontWeight: '900', margin: '0 0 25px', textShadow: '0 2px 10px rgba(243, 156, 18, 0.3)' }}>S/ {cel.precio_venta}</p>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => { setEditandoId(cel.id); setForm(cel); window.scrollTo({top: 0, behavior: 'smooth'}); }} style={{ flex: 1, padding: '15px', background: 'transparent', border: `2px solid ${theme.cyan}`, color: theme.cyan, borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s', fontSize: '1rem' }} onMouseEnter={e => {e.target.style.background = theme.cyan; e.target.style.color = theme.navy;}} onMouseLeave={e => {e.target.style.background = 'transparent'; e.target.style.color = theme.cyan;}}>EDITAR</button>
                <button onClick={() => eliminarEquipo(cel.id)} style={{ padding: '15px 20px', background: 'linear-gradient(135deg, #ff4b2b, #ff416c)', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 5px 15px rgba(255, 75, 43, 0.3)', transition: 'transform 0.2s' }} onMouseDown={e => e.target.style.transform = 'scale(0.95)'} onMouseUp={e => e.target.style.transform = 'scale(1)'}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}