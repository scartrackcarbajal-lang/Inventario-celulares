import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

// ==========================================
// 🎨 ICONOS (SVG Inline - Sin dependencias)
// ==========================================
const Icons = {
  Logo: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="gold-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3" strokeLinecap="round"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Smartphone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01" strokeWidth="2" strokeLinecap="round"/></svg>,
  Headphones: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/><path d="M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"/></svg>,
  Chart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  Dollar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  Eye: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  Box: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
}

// ==========================================
// COMPONENTES UI: "LUXURY GLASS"
// ==========================================

const StatCard = ({ label, value, subtext, trend, icon, colorClass }) => (
  <div className="relative group p-6 rounded-[24px] bg-[#0F172A]/40 border border-white/5 hover:border-[#F59E0B]/30 backdrop-blur-xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
    <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/0 to-[#F59E0B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative flex justify-between items-start">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">{value}</h3>
        {subtext && <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${colorClass}`}>{trend === 'up' && '↗'} {subtext}</p>}
      </div>
      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[#F59E0B] group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
    </div>
  </div>
)

function ProductCard({ cel, onEdit, onDelete, onSell, onOpenModal }) {
  const [fotoActiva, setFotoActiva] = useState(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x300/0f172a/334155?text=No+Image')
  const vendido = Number(cel.stock) <= 0

  return (
    <div className={`group relative flex flex-col rounded-[28px] bg-[#0F172A]/60 border border-white/5 hover:border-[#F59E0B]/40 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ${vendido ? 'opacity-60 grayscale-[0.8]' : ''}`}>
      
      {/* IMAGEN HERO */}
      <div className="relative h-72 bg-gradient-to-b from-[#1e293b]/50 to-[#0f172a]/50 p-6 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => onOpenModal(fotoActiva)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <img 
          src={fotoActiva} 
          alt={cel.modelo} 
          className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-110 z-10" 
        />
        
        {/* Badge Estado */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg border z-20
          ${cel.estado === 'Nuevo Sellado' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' : 
            cel.estado === 'Semi Nuevo' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-700/50 text-slate-300 border-white/10'}`}>
          {cel.estado}
        </div>

        {/* Badge Visibilidad */}
        {!cel.publicado && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase bg-black/40 text-slate-400 border border-white/10 backdrop-blur-md z-20">
            Oculto
          </div>
        )}

        {vendido && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px] z-30">
            <div className="border-[3px] border-red-500 text-red-500 px-8 py-3 rounded-2xl text-2xl font-black -rotate-12 tracking-widest uppercase shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              Vendido
            </div>
          </div>
        )}
      </div>

      {/* CUERPO */}
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="mb-5">
          <p className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-[0.2em] mb-1.5 opacity-80">{cel.marca}</p>
          <h3 className="text-lg font-bold text-white leading-tight group-hover:text-[#F59E0B] transition-colors duration-300">{cel.modelo}</h3>
        </div>

        {/* Specs Grid (YA INCLUYE LOS CAMPOS SOLICITADOS) */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-white/5 rounded-xl p-2.5 flex items-center gap-2 border border-white/5">
            <span className="text-xs opacity-50">💾</span>
            <span className="text-xs font-semibold text-slate-300">{cel.almacenamiento}</span>
          </div>
          {cel.salud_bateria && (
            <div className="bg-white/5 rounded-xl p-2.5 flex items-center gap-2 border border-white/5">
              <span className="text-xs opacity-50">🔋</span>
              <span className="text-xs font-semibold text-slate-300">{cel.salud_bateria}%</span>
            </div>
          )}
          <div className="bg-white/5 rounded-xl p-2.5 flex items-center gap-2 border border-white/5 col-span-2">
            <span className="text-xs opacity-50">🎨</span>
            <span className="text-xs font-semibold text-slate-300">{cel.color}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Precio</p>
            <p className="text-xl font-black text-white tracking-tight">S/ {cel.precio_venta}</p>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => onEdit(cel)} className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center border border-white/5" title="Editar"><Icons.Edit /></button>
            <button onClick={() => !vendido && onSell(cel)} disabled={vendido} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-white/5 ${vendido ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'}`} title="Vender"><Icons.Dollar /></button>
            <button onClick={() => onDelete(cel.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center border border-white/5" title="Eliminar"><Icons.Trash /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
export default function Inventario() {
  const router = useRouter()
  
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState('inventory')
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [editandoSkuId, setEditandoSkuId] = useState(null)
  const [notificacion, setNotificacion] = useState({ mensaje: '', visible: false, type: 'success' })
  const [modalImagen, setModalImagen] = useState(null)

  // Auth & Ventas
  const [autorizado, setAutorizado] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargandoLogin, setCargandoLogin] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const [ventaModalAbierto, setVentaModalAbierto] = useState(false)
  const [ventaCel, setVentaCel] = useState(null)
  const [ventaForm, setVentaForm] = useState({ precio_final: '', cliente_nombre: '', cliente_telefono: '' })
  const [guardandoVenta, setGuardandoVenta] = useState(false)
  
  const [ventas, setVentas] = useState([])
  const [ventasDesde, setVentasDesde] = useState('')
  const [ventasHasta, setVentasHasta] = useState('')
  const [cargandoVentas, setCargandoVentas] = useState(false)

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [filtroVendidos, setFiltroVendidos] = useState('TODOS')

  // Formulario (CON LOS CAMPOS FALTANTES AÑADIDOS)
  const estadoInicial = { 
    marca: '', modelo: '', estado: 'Nuevo Sellado', serial: '', 
    color: '', almacenamiento: '', salud_bateria: '', // <--- Asegurados aquí
    descripcion: '', precio_venta: '', precio_costo: '', published: true, imagen_url: [] 
  }
  const [form, setForm] = useState(estadoInicial)

  // --- HELPERS ---
  const normalizarSerial = (v) => String(v || '').trim().replace(/\s+/g, '').toUpperCase().slice(0, 30)
  
  const avisar = (msg, type = 'success') => {
    setNotificacion({ mensaje: msg, visible: true, type })
    setTimeout(() => setNotificacion((prev) => ({ ...prev, visible: false })), 3000)
  }
  
  const inicioDelDiaISO = (d) => d ? new Date(`${d}T00:00:00`).toISOString() : null
  const finDelDiaISO = (d) => d ? new Date(`${d}T23:59:59.999`).toISOString() : null

  // --- EFFECTS ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAutorizado(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setAutorizado(!!session))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (autorizado) {
      cargarEquipos()
      cargarVentas()
    }
  }, [autorizado])

  useEffect(() => { if (autorizado) cargarVentas() }, [autorizado, ventasDesde, ventasHasta])

  // --- LOGIC (REAL) ---
  const login = async () => {
    if (!email || !password) return
    setCargandoLogin(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setCargandoLogin(false)
    if (error) setLoginError(error.message)
  }
  
  const logout = async () => { await supabase.auth.signOut() }
  
  const cargarEquipos = async () => {
    const { data, error } = await supabase.from('items_serializados')
      .select(`
        id, sku_id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, vendido, costo_compra, created_at,
        skus:sku_id ( id, sku_codigo, tracking, precio_venta, precio_costo, publicado, productos:producto_id ( id, marca, nombre ) )
      `)
      .order('created_at', { ascending: false })
      
    if (error) return avisar('Error cargando inventario', 'error')
    
    setEquipos((data || []).map(row => ({
      id: row.id, 
      marca: row?.skus?.productos?.marca || '', 
      modelo: row?.skus?.productos?.nombre || '', 
      estado: row.estado, 
      imei: row.serial, 
      precio_venta: row?.skus?.precio_venta || 0, 
      precio_costo: row.costo_compra ? Number(row.costo_compra) : (row?.skus?.precio_costo ?? 0), 
      almacenamiento: row.almacenamiento, 
      salud_bateria: row.salud_bateria, 
      color: row.color, 
      imagen_url: row.imagen_url, 
      publicado: row?.skus?.publicado ?? false, 
      stock: row.vendido ? 0 : 1, 
      _raw: row
    })))
  }
  
  const cargarVentas = async () => {
    setCargandoVentas(true)
    let query = supabase.from('ventas_v2')
      .select(`
        id, precio_lista, precio_final, descuento, cliente_nombre, cliente_telefono, cantidad, tipo_venta,
        vendido_en, vendido_por, item_serializado_id, sku_id,
        items_serializados:item_serializado_id ( serial, costo_compra ),
        skus:sku_id ( id, precio_costo, productos:producto_id ( marca, nombre ) )
      `)
      .order('vendido_en', { ascending: false }).limit(300)
      
    if (ventasDesde) query = query.gte('vendido_en', inicioDelDiaISO(ventasDesde))
    if (ventasHasta) query = query.lte('vendido_en', finDelDiaISO(ventasHasta))

    const { data, error } = await query
    setCargandoVentas(false)
    if (error) return avisar('Error cargando ventas', 'error')
    setVentas(data || [])
  }
  
  const manejarFotos = async (e) => {
    const archivos = Array.from(e.target.files || [])
    if (!archivos.length) return
    setSubiendo(true)
    let nuevas = [...(form.imagen_url || [])]
    
    for (const file of archivos) {
      const name = `${Date.now()}_${file.name}`
      const { error } = await supabase.storage.from('Celulares - fotos').upload(name, file)
      if (!error) {
        const { data } = supabase.storage.from('Celulares - fotos').getPublicUrl(name)
        nuevas.push(data.publicUrl)
      }
    }
    setForm({ ...form, imagen_url: nuevas })
    setSubiendo(false)
    avisar('Fotos subidas con éxito')
  }
  
  // --- GUARDADO COMPLEJO (RECUPERADO AL 100%) ---
  const asegurarCategoriaId = async (nombre) => {
    const { data } = await supabase.from('categorias').select('id').eq('nombre', nombre).maybeSingle()
    if (data) return data.id
    const { data: neu } = await supabase.from('categorias').insert({ nombre }).select('id').single()
    return neu.id
  }
  
  const asegurarProductoId = async ({ categoriaId, marca, modelo, descripcion }) => {
    const { data } = await supabase.from('productos').select('id').eq('categoria_id', categoriaId).eq('marca', marca).eq('nombre', modelo).maybeSingle()
    if (data) return data.id
    const { data: neu } = await supabase.from('productos').insert({ categoria_id: categoriaId, marca, nombre: modelo, descripcion, activo: true }).select('id').single()
    return neu.id
  }

  const crearSku = async ({ productoId, precio_venta, precio_costo, publicado }) => {
    const { data } = await supabase.from('skus').insert({
      producto_id: productoId, sku_codigo: `CEL-${productoId}-${Date.now()}`, tracking: 'SERIAL',
      precio_venta, precio_costo, publicado: !!publicado
    }).select('id').single()
    return data.id
  }

  const guardar = async () => {
    try {
      const serial = normalizarSerial(form.serial)
      if (!form.marca || !form.modelo || !serial) return avisar('Faltan datos obligatorios', 'error')
      
      if (editandoId) {
        await supabase.from('items_serializados').update({
          serial, estado: form.estado, salud_bateria: form.salud_bateria, almacenamiento: form.almacenamiento,
          color: form.color, imagen_url: form.imagen_url, costo_compra: form.precio_costo
        }).eq('id', editandoId)
        
        if (editandoSkuId) {
          await supabase.from('skus').update({
            precio_venta: form.precio_venta, precio_costo: form.precio_costo, publicado: form.publicado
          }).eq('id', editandoSkuId)
        }
        avisar('Equipo actualizado')
        setEditandoId(null)
      } else {
        const catId = await asegurarCategoriaId('Celulares')
        const prodId = await asegurarProductoId({ categoriaId: catId, marca: form.marca, modelo: form.modelo, descripcion: form.descripcion })
        const skuId = await crearSku({ productoId: prodId, precio_venta: form.precio_venta, precio_costo: form.precio_costo, publicado: form.publicado })
        
        await supabase.from('items_serializados').insert({
          sku_id: skuId, serial, estado: form.estado, salud_bateria: form.salud_bateria,
          almacenamiento: form.almacenamiento, color: form.color, vendido: false,
          imagen_url: form.imagen_url, costo_compra: form.precio_costo
        })
        avisar('Equipo registrado')
      }
      setForm(estadoInicial)
      cargarEquipos()
    } catch (e) { avisar(e.message, 'error') }
  }
  
  const confirmarVenta = async () => {
    if (!ventaCel) return
    const precioFinal = Number(ventaForm.precio_final)
    if (!precioFinal) return avisar('Falta precio', 'error')
    setGuardandoVenta(true)
    
    const { data: sess } = await supabase.auth.getSession()
    const userId = sess?.session?.user?.id
    if (!userId) return

    const { error } = await supabase.from('ventas_v2').insert({
      item_serializado_id: ventaCel.id, sku_id: ventaCel._raw.skus.id, precio_lista: ventaCel.precio_venta,
      precio_final: precioFinal, descuento: (ventaCel.precio_venta || 0) - precioFinal,
      cliente_nombre: ventaForm.cliente_nombre, cliente_telefono: ventaForm.cliente_telefono,
      vendido_por: userId, tipo_venta: 'SERIALIZADO', cantidad: 1
    })

    if (!error) {
      await supabase.from('items_serializados').update({ vendido: true }).eq('id', ventaCel.id)
      avisar('¡Venta registrada!')
      setVentaModalAbierto(false)
      setVentaCel(null)
      setVentaForm({ precio_final: '', cliente_nombre: '', cliente_telefono: '' })
      cargarEquipos()
      cargarVentas()
    } else {
      avisar(error.message, 'error')
    }
    setGuardandoVenta(false)
  }

  // --- CALCULOS ---
  const resumenVentas = useMemo(() => ventas.reduce((acc, v) => {
    const final = Number(v.precio_final || 0)
    let costo = v.items_serializados?.costo_compra ? Number(v.items_serializados.costo_compra) : (Number(v.skus?.precio_costo || 0) * (v.cantidad || 1))
    return { totalVentas: acc.totalVentas + final, totalCosto: acc.totalCosto + costo, totalGanancia: acc.totalGanancia + (final - costo), count: acc.count + 1 }
  }, { totalVentas: 0, totalCosto: 0, totalGanancia: 0, count: 0 }), [ventas])

  const equiposFiltrados = useMemo(() => equipos.filter(c => {
    const q = busqueda.toLowerCase()
    return (c.marca?.toLowerCase().includes(q) || c.modelo?.toLowerCase().includes(q) || c.imei?.toLowerCase().includes(q)) && (filtroEstado === 'TODOS' || c.estado === filtroEstado) && (filtroVendidos === 'TODOS' || (filtroVendidos === 'VENDIDOS' ? Number(c.stock) <= 0 : Number(c.stock) > 0))
  }), [equipos, busqueda, filtroEstado, filtroVendidos])

  // ==========================================
  // RENDER: LOGIN (Luxury Dark)
  // ==========================================
  if (!autorizado) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-[#020617] to-[#020617]"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#F59E0B]/10 rounded-full blur-[120px]"></div>
      
      <div className="relative z-10 w-full max-w-sm p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-2xl text-center">
        <div className="mb-8 flex justify-center"><div className="p-4 bg-white/5 rounded-2xl border border-white/10"><Icons.Logo /></div></div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">FARRUS<span className="text-[#F59E0B]">HUB</span></h1>
        <p className="text-slate-400 mb-8 font-medium text-sm tracking-wide uppercase">Acceso Administrativo</p>
        <div className="space-y-4 text-left">
          <input className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]/50 focus:bg-black/60 transition-all" placeholder="Correo" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-[#F59E0B]/50 focus:bg-black/60 transition-all" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={login} className="w-full py-4 mt-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-1">
            {cargandoLogin ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </div>
      </div>
    </div>
  )

  // ==========================================
  // RENDER: DASHBOARD (Ultra Premium)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-200 flex flex-col selection:bg-[#F59E0B]/30">
      
      {/* 1. TOP NAVIGATION BAR (AHORA ARRIBA para dar espacio) */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-lg"><Icons.Logo /></div>
          <h1 className="text-xl font-black text-white tracking-wide hidden sm:block">FARRUS<span className="text-[#F59E0B]">HUB</span></h1>
        </div>

        <nav className="flex items-center gap-1 bg-black/20 p-1.5 rounded-2xl border border-white/5">
          <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'inventory' ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icons.Smartphone /> <span className="hidden md:inline">Inventario</span>
          </button>
          <button onClick={() => setActiveTab('sales')} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'sales' ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <Icons.Chart /> <span className="hidden md:inline">Finanzas</span>
          </button>
          <button onClick={() => router.push('/accesorios')} className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300">
            <Icons.Headphones /> <span className="hidden md:inline">Accesorios</span>
          </button>
        </nav>

        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 text-slate-400 font-bold text-sm hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all">
          <Icons.Logout /> <span className="hidden sm:inline">Salir</span>
        </button>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 drop-shadow-lg">{activeTab === 'inventory' ? 'Control de Inventario' : 'Reporte Financiero'}</h2>
            <p className="text-slate-400 font-medium tracking-wide">Resumen general de tu negocio</p>
          </div>
          {activeTab === 'inventory' && (
            <button 
              onClick={() => { setEditandoId(null); setForm(estadoInicial); document.getElementById('form-area').scrollIntoView({behavior: 'smooth'}); }}
              className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-white font-bold rounded-2xl shadow-[0_10px_40px_-10px_rgba(245,158,11,0.4)] transition-all flex items-center gap-3 transform hover:-translate-y-1"
            >
              <Icons.Plus /> Nuevo Ingreso
            </button>
          )}
        </div>

        {/* DASHBOARD METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard label="Ventas Totales" value={`S/ ${resumenVentas.totalVentas.toLocaleString()}`} trend="up" subtext="Este mes" icon={<Icons.Dollar />} colorClass="text-[#F59E0B]" />
          <StatCard label="Ganancia Neta" value={`S/ ${resumenVentas.totalGanancia.toLocaleString()}`} trend="up" subtext="Margen saludable" icon={<Icons.Chart />} colorClass="text-emerald-400" />
          <StatCard label="Inversión" value={`S/ ${resumenVentas.totalCosto.toLocaleString()}`} subtext="Capital activo" icon={<Icons.Box />} colorClass="text-slate-400" />
          <StatCard label="Unidades" value={resumenVentas.count} subtext="Equipos vendidos" icon={<Icons.Check />} colorClass="text-blue-400" />
        </div>

        {activeTab === 'inventory' ? (
          <>
            {/* FORMULARIO */}
            <div id="form-area" className="bg-[#0F172A]/60 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-white/5 shadow-2xl mb-16 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F59E0B] via-yellow-300 to-[#D97706] opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/5 gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 text-[#F59E0B] flex items-center justify-center border border-white/10 shadow-inner">{editandoId ? <Icons.Edit /> : <Icons.Box />}</div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{editandoId ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}</h2>
                </div>
                
                {/* --- TOGGLE DE VISIBILIDAD --- */}
                <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                  <span className={`text-xs font-bold uppercase tracking-widest ${form.publicado ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {form.publicado ? 'Público' : 'Borrador'}
                  </span>
                  <button 
                    onClick={() => setForm({...form, publicado: !form.publicado})}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${form.publicado ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${form.publicado ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Fila 1 */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Marca</label>
                  <input className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all placeholder-slate-600 font-medium" placeholder="Ej. Apple" value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Modelo</label>
                  <input className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all placeholder-slate-600 font-medium" placeholder="Ej. iPhone 15" value={form.modelo} onChange={e=>setForm({...form, modelo:e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Estado</label>
                  <select className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all appearance-none font-medium cursor-pointer" value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
                    <option>Nuevo Sellado</option><option>Semi Nuevo</option><option>Usado</option><option>Open Box</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Serial / IMEI</label>
                  <input className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all placeholder-slate-600 font-mono tracking-wide" placeholder="Escanea..." value={form.serial} onChange={e=>setForm({...form, serial:normalizarSerial(e.target.value)})} />
                </div>

                {/* Fila 2 - Nuevos Campos Agregados */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Color</label>
                    <input className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all placeholder-slate-600 font-medium" placeholder="Ej. Titanium Blue" value={form.color} onChange={e=>setForm({...form, color:e.target.value})} />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Almacenamiento</label>
                    <input className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all placeholder-slate-600 font-medium" placeholder="Ej. 256GB" value={form.almacenamiento} onChange={e=>setForm({...form, almacenamiento:e.target.value})} />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Batería (%)</label>
                    <input type="number" className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all placeholder-slate-600 font-medium" placeholder="Ej. 100" value={form.salud_bateria} onChange={e=>setForm({...form, salud_bateria:e.target.value})} />
                </div>

                 {/* Fila 3 - Precios */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest pl-1">Precio Venta</label>
                  <input type="number" className="w-full px-5 py-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-2xl text-[#F59E0B] focus:border-[#F59E0B] focus:bg-[#F59E0B]/10 outline-none transition-all font-black text-lg" placeholder="0.00" value={form.precio_venta} onChange={e=>setForm({...form, precio_venta:e.target.value})} />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Costo Compra</label>
                  <input type="number" className="w-full px-5 py-4 bg-[#020617]/50 border border-white/10 rounded-2xl text-white focus:border-[#F59E0B]/50 focus:bg-[#020617]/80 outline-none transition-all placeholder-slate-600 font-medium" placeholder="0.00" value={form.precio_costo} onChange={e=>setForm({...form, precio_costo:e.target.value})} />
                </div>

                {/* Subida de Fotos - Ocupa resto de espacio */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all group" onClick={()=>document.getElementById('file-input').click()}>
                  <p className="font-bold text-slate-500 group-hover:text-white transition-colors flex items-center gap-3 text-sm">
                    <span className="p-2 bg-white/5 rounded-lg text-[#F59E0B]"><Icons.Upload /></span> 
                    {subiendo ? 'Subiendo...' : 'Click para subir fotos'}
                  </p>
                  <input id="file-input" type="file" hidden multiple onChange={manejarFotos} />
                  {form.imagen_url.length > 0 && <div className="flex gap-3 mt-4 flex-wrap justify-center">{form.imagen_url.map((u, i) => <img key={i} src={u} className="w-12 h-12 rounded-lg object-cover border border-white/20 shadow-md" />)}</div>}
                </div>
              </div>
              <button onClick={guardar} className="w-full mt-10 py-4 bg-white hover:bg-slate-200 text-black font-black rounded-2xl shadow-xl shadow-white/5 transition-all text-sm uppercase tracking-widest hover:-translate-y-1">
                {editandoId ? 'Guardar Cambios' : 'Registrar en Inventario'}
              </button>
            </div>

            {/* BARRA FILTROS */}
            <div className="flex flex-wrap gap-4 mb-10 bg-[#0F172A]/70 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/5 w-fit mx-auto lg:mx-0">
              <div className="relative">
                <div className="absolute left-4 top-3.5 text-slate-500"><Icons.Search /></div>
                <input className="pl-12 pr-6 py-3 bg-black/30 rounded-xl outline-none border border-transparent focus:border-white/10 text-white w-72 placeholder-slate-600 font-medium transition-all" placeholder="Buscar por IMEI, modelo..." value={busqueda} onChange={e=>setBusqueda(e.target.value)} />
              </div>
              <select className="px-6 py-3 bg-black/30 rounded-xl font-bold text-slate-400 outline-none cursor-pointer border border-transparent hover:bg-black/50 hover:text-white transition-all" value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)}>
                <option value="TODOS">Todos los Estados</option><option value="Nuevo Sellado">Nuevo Sellado</option>
              </select>
              <select className="px-6 py-3 bg-black/30 rounded-xl font-bold text-slate-400 outline-none cursor-pointer border border-transparent hover:bg-black/50 hover:text-white transition-all" value={filtroVendidos} onChange={e=>setFiltroVendidos(e.target.value)}>
                <option value="TODOS">Todo el Inventario</option><option value="DISPONIBLES">En Stock</option><option value="VENDIDOS">Vendidos</option>
              </select>
            </div>

            {/* GRID PRODUCTOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
              {equiposFiltrados.map(cel => (
                <ProductCard 
                  key={cel.id} cel={cel} onEdit={(c) => { setForm({...estadoInicial, ...c, serial: c.imei}); setEditandoId(c.id); setEditandoSkuId(c._raw.skus.id); document.getElementById('form-area').scrollIntoView({behavior: 'smooth'}) }} onDelete={async (id) => { if(confirm('¿Eliminar?')) { await supabase.from('items_serializados').delete().eq('id', id); cargarEquipos(); } }} onSell={(c) => { setVentaCel(c); setVentaForm({precio_final: c.precio_venta, cliente_nombre:'', cliente_telefono:''}); setVentaModalAbierto(true); }} onOpenModal={setModalImagen}
                />
              ))}
            </div>
          </>
        ) : (
          /* TABLA DE VENTAS */
          <div className="bg-[#0F172A]/70 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/5 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
                  <th className="p-6 font-extrabold">Fecha</th>
                  <th className="p-6 font-extrabold">Producto</th>
                  <th className="p-6 font-extrabold">Detalle</th>
                  <th className="p-6 text-right font-extrabold">Venta</th>
                  <th className="p-6 text-right font-extrabold">Costo</th>
                  <th className="p-6 text-right font-extrabold">Ganancia</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-300 divide-y divide-white/5">
                {ventas.map(v => {
                  const final = Number(v.precio_final); const costo = v.items_serializados?.costo_compra ? Number(v.items_serializados.costo_compra) : (Number(v.skus?.precio_costo) * (v.cantidad || 1)); const ganancia = final - costo
                  return (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6 text-slate-400 group-hover:text-white transition-colors">{new Date(v.vendido_en).toLocaleDateString()}</td>
                      <td className="p-6"><b className="text-white text-base">{v.skus?.productos?.marca}</b> {v.skus?.productos?.nombre}</td>
                      <td className="p-6 font-mono text-xs text-slate-500 bg-black/20 rounded-lg m-2 w-fit px-3 py-1">{v.items_serializados?.serial || 'Bulk'}</td>
                      <td className="p-6 text-right font-bold text-white text-base">S/ {final.toFixed(2)}</td>
                      <td className="p-6 text-right text-slate-500">S/ {costo.toFixed(2)}</td>
                      <td className="p-6 text-right"><span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${ganancia >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>S/ {ganancia.toFixed(2)}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* MODALES */}
      {modalImagen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100] flex items-center justify-center p-10" onClick={() => setModalImagen(null)}>
          <img src={modalImagen} className="max-h-full max-w-full rounded-2xl shadow-2xl border border-white/10" />
        </div>
      )}

      {ventaModalAbierto && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[90] flex items-center justify-center p-4">
          <div className="bg-[#0F172A] w-full max-w-md p-10 rounded-[32px] shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F59E0B] to-[#D97706]"></div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Confirmar Venta</h2>
            <p className="text-slate-400 mb-8 font-medium">Estás vendiendo: <b className="text-[#F59E0B]">{ventaCel?.marca} {ventaCel?.modelo}</b></p>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Precio Final Real</label>
                <input type="number" autoFocus className="w-full mt-2 px-6 py-5 bg-black/40 border border-[#F59E0B]/30 rounded-2xl focus:border-[#F59E0B] focus:bg-black/60 outline-none text-3xl font-black text-white placeholder-slate-600" value={ventaForm.precio_final} onChange={e=>setVentaForm({...ventaForm, precio_final:e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Cliente (Opcional)</label>
                <input className="w-full mt-2 px-6 py-4 bg-black/40 border border-white/10 rounded-2xl outline-none font-medium text-white placeholder-slate-600" placeholder="Nombre del cliente" value={ventaForm.cliente_nombre} onChange={e=>setVentaForm({...ventaForm, cliente_nombre:e.target.value})} />
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={()=>setVentaModalAbierto(false)} className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-400 font-bold rounded-2xl hover:bg-white/10 hover:text-white transition-all">Cancelar</button>
              <button onClick={confirmarVenta} disabled={guardandoVenta} className="flex-1 py-4 bg-[#F59E0B] text-black font-bold rounded-2xl hover:bg-[#D97706] transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] transform hover:-translate-y-1">{guardandoVenta ? '...' : 'Confirmar Venta'}</button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICACIÓN TOAST */}
      {notificacion.visible && (
        <div className={`fixed top-6 right-6 px-8 py-5 rounded-2xl shadow-2xl border-l-4 font-bold z-[100] animate-in slide-in-from-right-10 flex items-center gap-4 bg-[#0F172A] text-white border border-white/10 backdrop-blur-md ${notificacion.type === 'error' ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
          <span className="text-xl">{notificacion.type === 'error' ? '⚠️' : '🎉'}</span>
          {notificacion.mensaje}
        </div>
      )}
    </div>
  )
}