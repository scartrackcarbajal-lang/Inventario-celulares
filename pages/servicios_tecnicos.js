import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

const WHATSAPP_NUMBER = "51992571579" 

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#020617',
    color: '#e2e8f0',
    fontFamily: "'Inter', sans-serif",
    overflowX: 'hidden',
    position: 'relative',
  },
  glassNav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px'
  },
  goldGradient: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #fbbf24 50%, #d97706 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '950',
  },
}

const Icons = {
  Logo: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/><path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>,
  Search: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Whatsapp: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Plane: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>,
  Wrench: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  Grid: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Smartphone: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>,
  Gem: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3l-4 6 5 12 5-12-4-6"/></svg>,
}

function ProductCard({ item }) {
  const router = useRouter()
  const msg = encodeURIComponent(`Hola FARRUS HUB, solicito información sobre: ${item.nombre} (S/ ${item.precio}).`)
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`

  const handleDetails = () => {
    const tipoQuery = item.tipo === 'celular' ? 'serial' : 'bulk'
    router.push(`/detalles/${item.id}?tipo=${tipoQuery}`)
  }

  return (
    <div className="product-card" onClick={handleDetails}>
      <div className="img-container">
        <div className="shimmer-mask"></div>
        <img 
          src={item.imagen || 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop'} 
          alt={item.nombre} 
          loading="lazy"
        />
        <div className="badge-wrapper">
           <span className={`badge ${item.estado === 'Nuevo Sellado' ? 'new' : 'used'}`}>
            {item.estado}
           </span>
        </div>
      </div>
      <div className="content-area">
        <div className="brand-header">
           <span className="brand-tag">{item.marca}</span>
           <div className="stock-indicator-pulse">
             <span className="dot"></span>
             <span className="text">Disponible</span>
           </div>
        </div>
        <h3 className="product-name">{item.nombre}</h3>
        <p className="product-specs">{item.specs}</p>
        
        <div className="card-footer">
          <div className="price-container">
            <span className="price-label">INVERSIÓN</span>
            <span className="price-value">S/ {item.precio}</span>
          </div>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="action-button" onClick={e => e.stopPropagation()}>
            <Icons.Whatsapp />
            <span className="btn-text">LO QUIERO</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('stock')
  const [categoryFilter, setCategoryFilter] = React.useState('todos')
  const [inventory, setInventory] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [scrollProgress, setScrollProgress] = React.useState(0)
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })

  const cargarDatos = React.useCallback(async () => {
    setLoading(true)
    try {
      const { data: cels } = await supabase.from('items_serializados').select(`id, imei:serial, estado, salud_bateria, almacenamiento, color, imagen_url, skus!inner( precio_venta, publicado, productos(marca, nombre) )`)
      const { data: bulk } = await supabase.from('skus').select(`id, precio_venta, tracking, publicado, productos(marca, nombre), stock_bulk(stock)`).eq('tracking', 'BULK')

      const adaptadoCels = (cels || []).map(c => ({
        id: c.id, tipo: 'celular', marca: c.skus?.productos?.marca || 'S/M', nombre: c.skus?.productos?.nombre || 'Equipo',
        precio: c.skus?.precio_venta || 0, imagen: c.imagen_url?.[0], estado: c.estado,
        specs: `${c.almacenamiento || ''} ${c.color || ''} ${c.salud_bateria ? `🔋 ${c.salud_bateria}%` : ''}`
      }))

      const adaptadoBulk = (bulk || []).filter(b => (b.stock_bulk?.[0]?.stock || 0) > 0).map(b => ({
        id: b.id, tipo: 'bulk', marca: b.productos?.marca || 'S/M', nombre: b.productos?.nombre || 'Producto',
        precio: b.precio_venta || 0, imagen: null, estado: 'Nuevo', specs: 'Original Hub'
      }))

      setInventory([...adaptadoCels, ...adaptadoBulk])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    cargarDatos()
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalScroll) * 100
      setScrollProgress(progress)
    }

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [cargarDatos])

  const counts = React.useMemo(() => {
    return {
      todos: inventory.length,
      celular: inventory.filter(i => i.tipo === 'celular').length,
      bulk: inventory.filter(i => i.tipo === 'bulk').length
    }
  }, [inventory])

  const filteredItems = React.useMemo(() => {
    let result = inventory
    if (categoryFilter !== 'todos') {
      result = result.filter(i => (categoryFilter === 'celular' ? i.tipo === 'celular' : i.tipo === 'bulk'))
    }
    if (search.trim()) {
      const terms = search.toLowerCase().trim().split(/\s+/)
      result = result.filter(i => {
        const str = `${i.marca} ${i.nombre} ${i.specs} ${i.estado}`.toLowerCase()
        return terms.every(t => str.includes(t))
      })
    }
    return result
  }, [inventory, categoryFilter, search])

  return (
    <div style={styles.container}>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      <div className="mouse-spotlight" style={{ left: mousePos.x, top: mousePos.y }}></div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        /* --- ESTILOS DE ULTRA-LUJO --- */
        @keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        @keyframes reveal-up { from { opacity: 0; transform: translateY(50px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(150%); } }
        @keyframes pulse-dot { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(2.5); opacity: 0; } 100% { transform: scale(1); opacity: 0; } }
        @keyframes particle-float { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(-100vh); opacity: 0; } }

        .vip-ticker-wrap { background: #020617; border-bottom: 1px solid rgba(245, 158, 11, 0.2); overflow: hidden; height: 35px; display: flex; align-items: center; }
        .vip-ticker { white-space: nowrap; animation: ticker 30s linear infinite; color: #F59E0B; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
        
        .scroll-progress { position: fixed; top: 0; left: 0; height: 4px; background: linear-gradient(to right, #F59E0B, #fbbf24); z-index: 1000; transition: width 0.1s ease-out; }
        .mouse-spotlight { position: fixed; width: 600px; height: 600px; background: radial-gradient(circle, rgba(245, 158, 11, 0.05) 0%, transparent 70%); border-radius: 50%; pointer-events: none; z-index: 1; transform: translate(-50%, -50%); transition: opacity 0.5s; }

        .dynamic-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background: radial-gradient(circle at 15% 15%, rgba(245, 158, 11, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 85%, rgba(6, 182, 212, 0.1) 0%, transparent 40%); }
        .particle { position: absolute; background: white; border-radius: 50%; pointer-events: none; animation: particle-float 15s linear infinite; opacity: 0.1; }

        .main-content { padding: 40px 20px; max-width: 1400px; margin: 0 auto; width: 100%; box-sizing: border-box; position: relative; z-index: 2; }
        
        /* HERO */
        .hero-section { text-align: center; padding: 100px 20px 60px; }
        .hero-title { font-size: clamp(3rem, 10vw, 7rem); margin: 0; line-height: 0.8; letter-spacing: -5px; font-weight: 950; text-shadow: 0 0 30px rgba(245, 158, 11, 0.2); }
        .hero-subtitle { color: #94a3b8; font-size: 1.2rem; max-width: 850px; margin: 35px auto; line-height: 1.6; font-weight: 500; }

        /* TABS */
        .tab-menu { display: flex; justify-content: center; gap: 15px; margin: 0 auto 60px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.05); width: fit-content; backdrop-filter: blur(15px); flex-wrap: wrap; }
        .tab-trigger { padding: 16px 45px; border-radius: 99px; background: transparent; border: none; color: #64748b; cursor: pointer; font-weight: 900; transition: 0.5s cubic-bezier(0.2, 0, 0, 1); font-size: 1rem; text-transform: uppercase; letter-spacing: 2px; }
        .tab-trigger.active { background: #F59E0B; color: #020617; box-shadow: 0 20px 45px -10px rgba(245, 158, 11, 0.5); transform: scale(1.08); }

        /* CATEGORÍAS ÉLITE */
        .category-container { display: flex; justify-content: center; gap: 20px; margin-bottom: 80px; flex-wrap: wrap; }
        .cat-card { width: clamp(140px, 25vw, 240px); padding: 35px 20px; border-radius: 35px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1); display: flex; flex-direction: column; align-items: center; gap: 15px; text-align: center; position: relative; overflow: hidden; }
        .cat-card:hover { transform: translateY(-15px); background: rgba(255,255,255,0.04); border-color: rgba(245, 158, 11, 0.3); }
        .cat-card.active { border-color: #F59E0B; background: rgba(245, 158, 11, 0.05); box-shadow: 0 20px 60px -20px rgba(245, 158, 11, 0.4); }
        .cat-card .count-badge { position: absolute; top: 15px; right: 15px; font-size: 0.65rem; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 8px; color: #94a3b8; font-weight: 900; }
        .cat-card.active .count-badge { background: #F59E0B; color: #020617; }
        .cat-card .icon-box { color: #64748b; transition: 0.4s; }
        .cat-card.active .icon-box { color: #F59E0B; transform: scale(1.3); }
        .cat-card span { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
        .cat-card.active span { color: white; }

        /* SEARCHBAR */
        .search-area { position: relative; max-width: 900px; margin: 0 auto 60px; width: 100%; }
        .search-input { width: 100%; padding: 25px 35px 25px 85px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 60px; color: white; outline: none; font-size: 1.3rem; transition: 0.4s; backdrop-filter: blur(20px); box-sizing: border-box; }
        .search-input:focus { border-color: #F59E0B; box-shadow: 0 0 80px rgba(245, 158, 11, 0.15); }
        .search-icon-fixed { position: absolute; top: 50%; left: 35px; transform: translateY(-50%); color: #F59E0B; }

        /* --- PRODUCT CARDS REDISEÑADAS --- */
        .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
        .product-card { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 40px; overflow: hidden; display: flex; flexDirection: column; height: 100%; transition: all 0.6s cubic-bezier(0.15, 1, 0.3, 1); cursor: pointer; position: relative; animation: reveal-up 0.8s ease-out backwards; }
        .product-card:hover { transform: translateY(-15px) scale(1.02); border-color: rgba(245, 158, 11, 0.6); box-shadow: 0 40px 100px -30px rgba(0,0,0,1); }
        
        .img-container { height: 350px; background: #010409; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 40px; border-bottom: 1px solid rgba(255,255,255,0.02); }
        .shimmer-mask { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); animation: shimmer 3s infinite; }
        .img-container img { width: 100%; height: 100%; object-fit: contain; z-index: 1; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.8)); transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
        .product-card:hover img { transform: scale(1.15) rotate(2deg); }
        
        .badge { position: absolute; top: 20px; right: 20px; padding: 6px 16px; border-radius: 12px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); }
        .badge.new { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .badge.used { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

        /* STOCK PULSE */
        .stock-indicator-pulse { display: flex; align-items: center; gap: 8px; }
        .stock-indicator-pulse .dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; position: relative; }
        .stock-indicator-pulse .dot::after { content: ''; position: absolute; inset: -4px; background: #4ade80; border-radius: 50%; animation: pulse-dot 2.5s infinite; }
        .stock-indicator-pulse .text { font-size: 0.7rem; color: #4ade80; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }

        .content-area { padding: 35px; flex: 1; display: flex; flex-direction: column; }
        .brand-tag { font-size: 0.85rem; color: #F59E0B; font-weight: 950; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 10px; }
        .product-name { font-size: 1.8rem; color: white; font-weight: 950; margin: 0 0 10px 0; line-height: 1.1; letter-spacing: -0.5px; }
        .product-specs { font-size: 0.95rem; color: #64748b; margin-bottom: 30px; line-height: 1.4; font-weight: 500; }
        
        .card-footer { margin-top: auto; display: flex; justify-content: space-between; alignItems: center; border-top: 1px solid rgba(255,255,255,0.08); paddingTop: 25px; gap: 15px; }
        .price-container { display: flex; flex-direction: column; min-width: 0; }
        .price-label { font-size: 0.65rem; color: #475569; font-weight: 900; letter-spacing: 2px; }
        .price-value { font-size: 2.2rem; font-weight: 950; color: white; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .action-button { background: #10b981; color: white; padding: 14px 24px; border-radius: 18px; display: flex; align-items: center; gap: 10px; transition: 0.4s; text-decoration: none; font-weight: 950; font-size: 0.85rem; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3); text-transform: uppercase; flex-shrink: 0; }
        .action-button:hover { background: #34d399; transform: scale(1.05); box-shadow: 0 15px 35px rgba(16, 185, 129, 0.5); }

        /* PANELES VIP */
        .elite-panel { background: rgba(15, 23, 42, 0.4); border-radius: 70px; padding: 130px 60px; text-align: center; border: 1px solid rgba(255, 255, 255, 0.04); position: relative; overflow: hidden; box-shadow: 0 80px 160px -40px rgba(0,0,0,1); max-width: 1100px; margin: 40px auto; animation: reveal-up 1.2s ease-out; }
        .icon-halo { margin-bottom: 50px; display: inline-flex; padding: 50px; background: rgba(245, 158, 11, 0.03); border-radius: 50px; border: 1px solid rgba(245, 158, 11, 0.08); color: #F59E0B; position: relative; }
        .cta-premium { display: inline-flex; align-items: center; gap: 20px; padding: 25px 70px; background: white; color: #020617; border-radius: 99px; font-weight: 950; text-decoration: none; font-size: 1.3rem; margin-top: 50px; transition: 0.5s; text-transform: uppercase; letter-spacing: 3px; }
        .cta-premium:hover { transform: translateY(-12px); box-shadow: 0 40px 80px rgba(255,255,255,0.2); }

        @media (max-width: 768px) {
          .hero-title { font-size: 3.5rem; letter-spacing: -3px; }
          .grid-layout { grid-template-columns: 1fr; gap: 25px; }
          .cat-card { width: 45%; padding: 20px 10px; border-radius: 24px; }
          .elite-panel { padding: 80px 25px; border-radius: 50px; }
          .action-button span { display: none; }
          .action-button { padding: 18px; border-radius: 16px; }
          .search-input { font-size: 1.1rem; padding-left: 65px; }
          .img-container { height: 300px; }
          .price-value { font-size: 1.8rem; }
        }
      `}} />

      <div className="vip-ticker-wrap">
        <div className="vip-ticker">
          Nuevos Ingresos: iPhone 16 Pro Max • Reparaciones Técnicas: Diagnóstico sin costo • Importaciones directas de USA y Europa • Equipos Sellados con Garantía Total • Servicio VIP de microsoldadura • 
        </div>
      </div>

      <div className="dynamic-bg"></div>
      
      {/* PARTÍCULAS DE FONDO */}
      {[...Array(15)].map((_, i) => (
        <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${Math.random() * 3}px`, height: `${Math.random() * 3}px`, animationDelay: `${Math.random() * 5}s` }}></div>
      ))}

      {/* NAVBAR FLEXIBLE */}
      <nav style={styles.glassNav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icons.Logo />
          <span style={{ fontSize: '1.5rem', fontWeight: '950', color: 'white', letterSpacing: '-1.5px' }}>FARRUS<span style={styles.goldGradient}>HUB</span></span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => router.push('/inventario')} style={{ ...styles.btnIcon, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', height: '44px', borderRadius: '15px', color: '#94a3b8', fontWeight: 'bold', padding: '0 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.Lock /> <span className="hide-mobile">ADMINISTRAR</span>
          </button>
        </div>
      </nav>

      <div className="main-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <h1 className="hero-title" style={styles.goldGradient}>Tecnología Premium</h1>
          <p className="hero-subtitle">Tu aliado en importación de equipos de alta gama, accesorios exclusivos y servicio técnico de primer nivel. Calidad superior para quienes no aceptan menos.</p>
          
          <div className="tab-menu">
            <button className={`tab-trigger ${activeTab === 'stock' ? 'active' : ''}`} onClick={() => setActiveTab('stock')}>Disponible</button>
            <button className={`tab-trigger ${activeTab === 'pedido' ? 'active' : ''}`} onClick={() => setActiveTab('pedido')}>Encargos</button>
            <button className={`tab-trigger ${activeTab === 'taller' ? 'active' : ''}`} onClick={() => setActiveTab('taller')}>Reparaciones</button>
          </div>
        </section>

        <div style={{ minHeight: '600px' }}>
          {activeTab === 'stock' && (
            <div className="animate-reveal">
              {/* BUSCADOR ADAPTABLE */}
              <div className="search-area">
                 <div className="search-icon-fixed"><Icons.Search /></div>
                 <input 
                   className="search-input"
                   placeholder="Busca por marca, modelo o color..." 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
              </div>

              {/* SELECTOR DE CATEGORÍAS */}
              <div className="category-container">
                <div className={`cat-card ${categoryFilter === 'todos' ? 'active' : ''}`} onClick={() => setCategoryFilter('todos')}>
                  <div className="count-badge">{counts.todos}</div>
                  <div className="icon-box"><Icons.Grid /></div>
                  <span>Catálogo</span>
                </div>
                <div className={`cat-card ${categoryFilter === 'celular' ? 'active' : ''}`} onClick={() => setCategoryFilter('celular')}>
                  <div className="count-badge">{counts.celular}</div>
                  <div className="icon-box"><Icons.Smartphone /></div>
                  <span>Equipos</span>
                </div>
                <div className={`cat-card ${categoryFilter === 'bulk' ? 'active' : ''}`} onClick={() => setCategoryFilter('bulk')}>
                  <div className="count-badge">{counts.bulk}</div>
                  <div className="icon-box"><Icons.Gem /></div>
                  <span>Accesorios</span>
                </div>
              </div>

              {/* GRID DE PRODUCTOS DINÁMICO */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '120px' }}>
                  <div style={{ width: '80px', height: '80px', border: '8px solid rgba(245, 158, 11, 0.05)', borderTopColor: '#F59E0B', borderRadius: '50%', animation: 'reveal-up 1s linear infinite', margin: '0 auto 35px' }}></div>
                  <p style={{ fontWeight: '950', letterSpacing: '8px', color: '#F59E0B', textTransform: 'uppercase', fontSize: '1rem' }}>Escaneando Inventario...</p>
                </div>
              ) : (
                <div className="grid-layout">
                  {filteredItems.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '140px 40px', background: 'rgba(255,255,255,0.01)', borderRadius: '80px', border: '1px dashed rgba(255,255,255,0.08)' }}>
                      <p style={{ fontSize: '1.8rem', color: '#64748b', fontWeight: '700' }}>Sin hallazgos en esta frecuencia.</p>
                    </div>
                  ) : (
                    filteredItems.map((item) => (
                      <ProductCard key={item.id + item.tipo} item={item} />
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pedido' && (
            <div className="elite-panel">
              <div className="icon-halo"><Icons.Plane /></div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: '950', color: 'white', marginBottom: '35px', letterSpacing: '-4px' }}>Importación Directa</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.6rem', lineHeight: '1.8', maxWidth: '900px', margin: '0 auto', fontStyle: 'italic' }}>
                ¿Buscas lo inalcanzable? Importamos dispositivos exclusivos de <strong>USA y Europa</strong> bajo pedido. Gestión integral con seguridad garantizada y asesoría personalizada para clientes exigentes.
              </p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, solicito información para una importación especial.`} target="_blank" rel="noreferrer" className="cta-premium">
                COTIZAR EQUIPO <Icons.Whatsapp />
              </a>
            </div>
          )}

          {activeTab === 'taller' && (
            <div className="elite-panel">
              <div className="icon-halo" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.04)' }}><Icons.Wrench /></div>
              <h2 style={{ fontSize: '4.5rem', fontWeight: '950', color: 'white', marginBottom: '35px', letterSpacing: '-4px' }}>Reparaciones Técnicas</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.6rem', lineHeight: '1.8', maxWidth: '900px', margin: '0 auto' }}>
                Cirugía técnica para tus dispositivos de gama alta. Especialistas en restauración de placas, cambios de pantalla y optimización estructural con piezas certificadas y garantía post-reparación.
                <br/><br/>
                <span style={{ color: '#F59E0B', fontWeight: '950', background: 'rgba(245,158,11,0.1)', padding: '20px 50px', borderRadius: '30px', border: '1px solid rgba(245,158,11,0.2)', display: 'inline-block', fontSize: '1.2rem' }}>DIAGNÓSTICO HUB SIN COSTO</span>
              </p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola, necesito agendar una revisión técnica para mi equipo.`} target="_blank" rel="noreferrer" className="cta-premium" style={{ background: '#3b82f6', color: 'white' }}>
                AGENDAR CITA <Icons.Whatsapp />
              </a>
            </div>
          )}
        </div>
      </div>

      <footer style={{ padding: '120px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.02)', color: '#475569', fontSize: '1.1rem', fontWeight: '800', marginTop: '140px' }}>
        <div style={{ marginBottom: '30px', opacity: 0.5 }}><Icons.Logo /></div>
        <p style={{ letterSpacing: '4px', textTransform: 'uppercase' }}>© 2026 LOS FARRUS HUB • EXCELENCIA TECNOLÓGICA</p>
      </footer>
    </div>
  )
}