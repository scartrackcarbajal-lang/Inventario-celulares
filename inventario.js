echo "import { useState } from 're

export default function Inventario() {
  const [form, ] = useState({
    modelo: '', marca: '', estado: 'Nuevo', imei: '', 
    precio_venta: 0, precio_costo: 0, stock: 1, 
    salud_bateria: 100, descripcion: '', imagen_url: ''
  })

  const guardar = async () => {
    // Ahora usamos 'descripcion' e 'imagen_url' sin errores
    const { error } = await supabase.from('Celulares').insert([form])
    if (error) alert('Error: ' + error.message)
    else alert('¡Equipo guardado con éxito en el inventario!')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>📱 Registro de Equipos</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder='Modelo (ej: iPhone 13)' onChange={e => setForm({...form, modelo: e.target.value})} />
        <input placeholder='Marca' onChange={e => setForm({...form, marca: e.target.value})} />
        <input placeholder='IMEI' onChange={e => setForm({...form, imei: e.target.value})} />
        <input placeholder='Precio Venta (/.)' type='number' onChange={e => setForm({...form, precio_venta: e.target.value})} />  