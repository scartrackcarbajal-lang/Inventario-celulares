import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Inventario() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, color: '#00d2ff' })

  // IMPORTANTE: imagen_url ahora se inicializa como un array []
  const estadoInicial = {
    modelo: '', marca: '', almacenamiento: '', estado: 'Sellado', imei: '', 
    precio_venta: '', precio_costo: '', stock: '', 
    salud_bateria: '', descripcion: '', imagen_url: [] 
  }
  const [form, setForm] = useState(estadoInicial)

  const theme = { 
    navy: '#0b1426', card: '#162447', orange: '#f39c12', 
    cyan: '#00d2ff', white: '#ffffff', muted: '#94a3b8' 
  }

  const avisar = (msg, color = theme.cyan) => {
    setNotificacion({ mensaje: msg, visible: true, color: color })
    setTimeout(() => setNotificacion(prev => ({ ...prev, visible: false })), 3000)
  }

  const cargarEquipos = async () => {
    const { data } = await supabase.from('Celulares').select('*').order('created_at', { ascending: false })
    setEquipos(data || [])
  }

  useEffect(() => { cargarEquipos() }, [])

  const equiposFiltrados = equipos.filter(cel => 
    cel.modelo?.toLowerCase().includes(busqueda.toLowerCase()) ||
    cel.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
    cel.almacenamiento?.toLowerCase().includes(busqueda.toLowerCase())
  )

  // MANEJO DE MÚLTIPLES FOTOS
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
    avisar(`📸 ${archivos.length} foto(s) añadidas con éxito`)
    setSubiendo(false)
  }

  const eliminarFotoGaleria = (indexEliminar) => {
    const filtradas = form.imagen_url.filter((_, index) => index !== indexEliminar)
    setForm({ ...form, imagen_url: filtradas })
    avisar('Foto removida', theme.orange)
  }

  const prepararEdicion = (equipo) => {
    setEditandoId(equipo.id)
    // Nos aseguramos de que imagen_url sea un array al editar
    setForm({
      ...equipo,
      imagen_url: Array.isArray(equipo.imagen_url) ? equipo.imagen_url : []
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setForm(estadoInicial)
  }

  const guardar = async () => {
    const datosParaEnviar = { ...form };
    const camposNumericos = ['precio_venta', 'precio_costo', 'stock', 'salud_bateria'];
    
    camposNumericos.forEach(campo => {
      if (datosParaEnviar[campo] === '' || datosParaEnviar[campo] === null) {
        datosParaEnviar[campo] = null;
      }
    });

    if (editandoId) {
      const { error } = await supabase.from('Celulares').update(datosParaEnviar).eq('id', editandoId)
      if (error) avisar('Error: ' + error.message, '#ff4b2b')
      else {
        avisar('✅ ¡Inventario actualizado!')
        cancelarEdicion(); cargarEquipos();
      }
    } else {
      const { error } = await supabase.from('Celulares').insert([datosParaEnviar])
      if (error) avisar('Error: ' + error.message, '#ff4b2b')
      else {
        avisar('🚀 ¡Equipo registrado!')
        setForm(estadoInicial); cargarEquipos();
      }
    }
  }

  const inputStyle = { 
    backgroundColor: '#0b1426', border: '1px solid #25335a', 
    borderRadius: '12px', padding: '14px', color: '#ffffff', outline: 'none' 
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', width: '98%', maxWidth: '1600px', margin: 'auto', backgroundColor: theme.navy, minHeight: '100vh', color: theme.white, position: 'relative' }}>
      
      {notificacion.visible && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: theme.card, color: theme.white, padding: '15px 25px', borderRadius: '12px', borderLeft: `6px solid ${notificacion.color}`, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000 }}>
          {notificacion.mensaje}
        </div>
      )}

      <style jsx global>{`
        .btn-press { transition: transform 0.1s; cursor: pointer; }
        .btn-press:active { transform: scale(0.96); }
      `}</style>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px', padding: '20px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', margin: 0 }}>
          <span style={{ color: theme.white }}>LOS FARRUS</span> <span style={{ color: theme.orange }}>HUB</span>
        </h1>
        <div style={{ width: '250px', height: '5px', backgroundColor: theme.orange, margin: '10px auto', borderRadius: '5px' }}></div>
        <p style={{ color: theme.cyan, fontWeight: 'bold', letterSpacing: '2px' }}>CONTROL DE INVENTARIO</p>
      </div>

      {/* BUSCADOR */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
        <input placeholder="🔍 Buscar modelo, marca o capacidad..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ width: '100%', maxWidth: '800px', padding: '18px 25px', borderRadius: '15px', backgroundColor: theme.card, border: `2px solid ${theme.cyan}`, color: theme.white, fontSize: '1.1rem', outline: 'none' }} />
      </div>

      {/* FORMULARIO */}
      <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '25px', borderTop: `6px solid ${theme.orange}`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', marginBottom: '50px' }}>
        <h2 style={{ color: theme.white, marginTop: 0, fontSize: '1.4rem' }}>{editandoId ? '📝 EDITANDO EQUIPO' : '📦 NUEVO INGRESO'}</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginTop: '20px' }}>
          <input placeholder='Marca' value={form.marca} style={inputStyle} onChange={e => setForm({...form, marca: e.target.value})} />
          <input placeholder='Modelo' value={form.modelo} style={inputStyle} onChange={e => setForm({...form, modelo: e.target.value})} />
          <input placeholder='Almacenamiento' value={form.almacenamiento} style={inputStyle} onChange={e => setForm({...form, almacenamiento: e.target.value})} />
          <input placeholder='IMEI' value={form.imei} style={inputStyle} onChange={e => setForm({...form, imei: e.target.value})} />
          <select style={inputStyle} value={form.estado} onChange={e => setForm({...form, estado: e.target.value})}>
            <option value="Sellado">Sellado</option>
            <option value="Open Box">Open Box</option>
            <option value="Seminuevo">Seminuevo</option>
            <option value="Usado">Usado</option>
          </select>
          <input placeholder='Batería %' type='number' value={form.salud_bateria} style={inputStyle} onChange={e => setForm({...form, salud_bateria: e.target.value})} />
          <input placeholder='Precio Venta S/.' type='number' value={form.precio_venta} style={inputStyle} onChange={e => setForm({...form, precio_venta: e.target.value})} />
          <input placeholder='Precio Costo S/.' type='number' value={form.precio_costo} style={inputStyle} onChange={e => setForm({...form, precio_costo: e.target.value})} />
          <textarea placeholder='Descripción...' style={{ ...inputStyle, gridColumn: '1 / -1', height: '60px' }} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
          
          {/* SECCIÓN DE GALERÍA */}
          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <p style={{ color: theme.cyan, fontWeight: 'bold' }}>Galería de Fotos ({form.imagen_url?.length || 0})</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', backgroundColor: '#0b1426', padding: '15px', borderRadius: '15px', border: `1px solid ${theme.cyan}40` }}>
              {form.imagen_url?.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={url} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: `2px solid ${theme.cyan}` }} />
                  <button onClick={() => eliminarFotoGaleria(i)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                </div>
              ))}
              <label className="btn-press" style={{ width: '100px', height: '100px', border: `2px dashed ${theme.cyan}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '2rem', color: theme.cyan }}>
                {subiendo ? '...' : '+'}
                <input type="file" accept="image/*" multiple onChange={manejarFotos} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
        
        <button className="btn-press" onClick={guardar} style={{ marginTop: '25px', width: '100%', padding: '20px', background: `linear-gradient(to right, ${theme.orange}, #d35400)`, color: theme.white, border: 'none', borderRadius: '15px', fontWeight: '900', fontSize: '1.2rem' }}>
          {editandoId ? 'CONFIRMAR CAMBIOS' : 'GUARDAR DISPOSITIVO'}
        </button>
      </div>

      {/* LISTADO */}
      <h2 style={{ paddingLeft: '15px', borderLeft: `6px solid ${theme.cyan}`, marginBottom: '30px' }}>STOCK DISPONIBLE ({equiposFiltrados.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {equiposFiltrados.map(cel => (
          <div key={cel.id} style={{ backgroundColor: theme.card, borderRadius: '25px', overflow: 'hidden', border: '1px solid #25335a' }}>
            <img src={cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250/0b1426/ffffff?text=FARRUS'} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            <div style={{ padding: '25px' }}>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{cel.marca} {cel.modelo}</p>
              <p style={{ color: theme.cyan, fontWeight: 'bold', margin: '8px 0' }}>💾 {cel.almacenamiento || '---'}</p>
              <p style={{ fontSize: '2.2rem', fontWeight: '900', color: theme.orange, margin: '15px 0' }}>S/ {cel.precio_venta}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-press" onClick={() => prepararEdicion(cel)} style={{ flex: 3, padding: '12px', background: 'transparent', border: `2px solid ${theme.cyan}`, color: theme.cyan, borderRadius: '12px', fontWeight: 'bold' }}>EDITAR</button>
                <button className="btn-press" onClick={() => eliminar(cel.id)} style={{ flex: 1, backgroundColor: '#2d1a1a', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '12px' }}>🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}