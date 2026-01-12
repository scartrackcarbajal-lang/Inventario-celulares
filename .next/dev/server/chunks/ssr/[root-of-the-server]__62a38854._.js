module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[project]/lib/supabase.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__ = __turbopack_context__.i("[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, esm_import, [project]/node_modules/@supabase/supabase-js)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const supabaseUrl = 'https://lptiwrdmvxyisaixnuel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdGl3cmRtdnh5aXNhaXhudWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDI0MDIsImV4cCI6MjA4MzY3ODQwMn0.iotGFhBfo2Fjvj9LhEk-z1CpCaM7wrZINrfDn0uGzD8';
const supabase = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__["createClient"])(supabaseUrl, supabaseAnonKey);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/inventario.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Inventario
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function Inventario() {
    const [equipos, setEquipos] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [busqueda, setBusqueda] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [subiendo, setSubiendo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editandoId, setEditandoId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [notificacion, setNotificacion] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        mensaje: '',
        visible: false,
        color: '#00d2ff'
    });
    // IMPORTANTE: imagen_url ahora se inicializa como un array []
    const estadoInicial = {
        modelo: '',
        marca: '',
        almacenamiento: '',
        estado: 'Sellado',
        imei: '',
        precio_venta: '',
        precio_costo: '',
        stock: '',
        salud_bateria: '',
        descripcion: '',
        imagen_url: []
    };
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(estadoInicial);
    const theme = {
        navy: '#0b1426',
        card: '#162447',
        orange: '#f39c12',
        cyan: '#00d2ff',
        white: '#ffffff',
        muted: '#94a3b8'
    };
    const avisar = (msg, color = theme.cyan)=>{
        setNotificacion({
            mensaje: msg,
            visible: true,
            color: color
        });
        setTimeout(()=>setNotificacion((prev)=>({
                    ...prev,
                    visible: false
                })), 3000);
    };
    const cargarEquipos = async ()=>{
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').select('*').order('created_at', {
            ascending: false
        });
        setEquipos(data || []);
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        cargarEquipos();
    }, []);
    const equiposFiltrados = equipos.filter((cel)=>cel.modelo?.toLowerCase().includes(busqueda.toLowerCase()) || cel.marca?.toLowerCase().includes(busqueda.toLowerCase()) || cel.almacenamiento?.toLowerCase().includes(busqueda.toLowerCase()));
    // MANEJO DE MÚLTIPLES FOTOS
    const manejarFotos = async (e)=>{
        const archivos = Array.from(e.target.files);
        if (archivos.length === 0) return;
        setSubiendo(true);
        let nuevasUrls = [
            ...form.imagen_url || []
        ];
        for (const archivo of archivos){
            const nombreArchivo = `${Date.now()}_${archivo.name}`;
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').upload(nombreArchivo, archivo);
            if (!error) {
                const { data: urlData } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').getPublicUrl(nombreArchivo);
                nuevasUrls.push(urlData.publicUrl);
            }
        }
        setForm({
            ...form,
            imagen_url: nuevasUrls
        });
        avisar(`📸 ${archivos.length} foto(s) añadidas con éxito`);
        setSubiendo(false);
    };
    const eliminarFotoGaleria = (indexEliminar)=>{
        const filtradas = form.imagen_url.filter((_, index)=>index !== indexEliminar);
        setForm({
            ...form,
            imagen_url: filtradas
        });
        avisar('Foto removida', theme.orange);
    };
    const prepararEdicion = (equipo)=>{
        setEditandoId(equipo.id);
        // Nos aseguramos de que imagen_url sea un array al editar
        setForm({
            ...equipo,
            imagen_url: Array.isArray(equipo.imagen_url) ? equipo.imagen_url : []
        });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    const cancelarEdicion = ()=>{
        setEditandoId(null);
        setForm(estadoInicial);
    };
    const guardar = async ()=>{
        const datosParaEnviar = {
            ...form
        };
        const camposNumericos = [
            'precio_venta',
            'precio_costo',
            'stock',
            'salud_bateria'
        ];
        camposNumericos.forEach((campo)=>{
            if (datosParaEnviar[campo] === '' || datosParaEnviar[campo] === null) {
                datosParaEnviar[campo] = null;
            }
        });
        if (editandoId) {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').update(datosParaEnviar).eq('id', editandoId);
            if (error) avisar('Error: ' + error.message, '#ff4b2b');
            else {
                avisar('✅ ¡Inventario actualizado!');
                cancelarEdicion();
                cargarEquipos();
            }
        } else {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').insert([
                datosParaEnviar
            ]);
            if (error) avisar('Error: ' + error.message, '#ff4b2b');
            else {
                avisar('🚀 ¡Equipo registrado!');
                setForm(estadoInicial);
                cargarEquipos();
            }
        }
    };
    const inputStyle = {
        backgroundColor: '#0b1426',
        border: '1px solid #25335a',
        borderRadius: '12px',
        padding: '14px',
        color: '#ffffff',
        outline: 'none'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: '20px',
            fontFamily: 'sans-serif',
            width: '98%',
            maxWidth: '1600px',
            margin: 'auto',
            backgroundColor: theme.navy,
            minHeight: '100vh',
            color: theme.white,
            position: 'relative'
        },
        className: "jsx-3b1f9c4efbd20541",
        children: [
            notificacion.visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: theme.card,
                    color: theme.white,
                    padding: '15px 25px',
                    borderRadius: '12px',
                    borderLeft: `6px solid ${notificacion.color}`,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    zIndex: 1000
                },
                className: "jsx-3b1f9c4efbd20541",
                children: notificacion.mensaje
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 122,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "3b1f9c4efbd20541",
                children: ".btn-press{cursor:pointer;transition:transform .1s}.btn-press:active{transform:scale(.96)}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center',
                    marginBottom: '40px',
                    padding: '20px'
                },
                className: "jsx-3b1f9c4efbd20541",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: '3rem',
                            fontWeight: '900',
                            margin: 0
                        },
                        className: "jsx-3b1f9c4efbd20541",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: theme.white
                                },
                                className: "jsx-3b1f9c4efbd20541",
                                children: "LOS FARRUS"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 135,
                                columnNumber: 11
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: theme.orange
                                },
                                className: "jsx-3b1f9c4efbd20541",
                                children: "HUB"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 135,
                                columnNumber: 66
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            width: '250px',
                            height: '5px',
                            backgroundColor: theme.orange,
                            margin: '10px auto',
                            borderRadius: '5px'
                        },
                        className: "jsx-3b1f9c4efbd20541"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        style: {
                            color: theme.cyan,
                            fontWeight: 'bold',
                            letterSpacing: '2px'
                        },
                        className: "jsx-3b1f9c4efbd20541",
                        children: "CONTROL DE INVENTARIO"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '40px',
                    display: 'flex',
                    justifyContent: 'center'
                },
                className: "jsx-3b1f9c4efbd20541",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                    placeholder: "🔍 Buscar modelo, marca o capacidad...",
                    value: busqueda,
                    onChange: (e)=>setBusqueda(e.target.value),
                    style: {
                        width: '100%',
                        maxWidth: '800px',
                        padding: '18px 25px',
                        borderRadius: '15px',
                        backgroundColor: theme.card,
                        border: `2px solid ${theme.cyan}`,
                        color: theme.white,
                        fontSize: '1.1rem',
                        outline: 'none'
                    },
                    className: "jsx-3b1f9c4efbd20541"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: theme.card,
                    padding: '30px',
                    borderRadius: '25px',
                    borderTop: `6px solid ${theme.orange}`,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    marginBottom: '50px'
                },
                className: "jsx-3b1f9c4efbd20541",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        style: {
                            color: theme.white,
                            marginTop: 0,
                            fontSize: '1.4rem'
                        },
                        className: "jsx-3b1f9c4efbd20541",
                        children: editandoId ? '📝 EDITANDO EQUIPO' : '📦 NUEVO INGRESO'
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '15px',
                            marginTop: '20px'
                        },
                        className: "jsx-3b1f9c4efbd20541",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                placeholder: "Marca",
                                value: form.marca,
                                style: inputStyle,
                                onChange: (e)=>setForm({
                                        ...form,
                                        marca: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                placeholder: "Modelo",
                                value: form.modelo,
                                style: inputStyle,
                                onChange: (e)=>setForm({
                                        ...form,
                                        modelo: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                placeholder: "Almacenamiento",
                                value: form.almacenamiento,
                                style: inputStyle,
                                onChange: (e)=>setForm({
                                        ...form,
                                        almacenamiento: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                placeholder: "IMEI",
                                value: form.imei,
                                style: inputStyle,
                                onChange: (e)=>setForm({
                                        ...form,
                                        imei: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                style: inputStyle,
                                value: form.estado,
                                onChange: (e)=>setForm({
                                        ...form,
                                        estado: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Sellado",
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: "Sellado"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Open Box",
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: "Open Box"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Seminuevo",
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: "Seminuevo"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Usado",
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: "Usado"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 159,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                placeholder: "Batería %",
                                type: "number",
                                value: form.salud_bateria,
                                style: inputStyle,
                                onChange: (e)=>setForm({
                                        ...form,
                                        salud_bateria: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                placeholder: "Precio Venta S/.",
                                type: "number",
                                value: form.precio_venta,
                                style: inputStyle,
                                onChange: (e)=>setForm({
                                        ...form,
                                        precio_venta: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                placeholder: "Precio Costo S/.",
                                type: "number",
                                value: form.precio_costo,
                                style: inputStyle,
                                onChange: (e)=>setForm({
                                        ...form,
                                        precio_costo: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                placeholder: "Descripción...",
                                style: {
                                    ...inputStyle,
                                    gridColumn: '1 / -1',
                                    height: '60px'
                                },
                                value: form.descripcion,
                                onChange: (e)=>setForm({
                                        ...form,
                                        descripcion: e.target.value
                                    }),
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    gridColumn: '1 / -1',
                                    marginTop: '10px'
                                },
                                className: "jsx-3b1f9c4efbd20541",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: theme.cyan,
                                            fontWeight: 'bold'
                                        },
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: [
                                            "Galería de Fotos (",
                                            form.imagen_url?.length || 0,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '10px',
                                            flexWrap: 'wrap',
                                            backgroundColor: '#0b1426',
                                            padding: '15px',
                                            borderRadius: '15px',
                                            border: `1px solid ${theme.cyan}40`
                                        },
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: [
                                            form.imagen_url?.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        position: 'relative'
                                                    },
                                                    className: "jsx-3b1f9c4efbd20541",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                            src: url,
                                                            style: {
                                                                width: '100px',
                                                                height: '100px',
                                                                objectFit: 'cover',
                                                                borderRadius: '10px',
                                                                border: `2px solid ${theme.cyan}`
                                                            },
                                                            className: "jsx-3b1f9c4efbd20541"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 172,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>eliminarFotoGaleria(i),
                                                            style: {
                                                                position: 'absolute',
                                                                top: '-5px',
                                                                right: '-5px',
                                                                background: 'red',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '50%',
                                                                width: '22px',
                                                                height: '22px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold'
                                                            },
                                                            className: "jsx-3b1f9c4efbd20541",
                                                            children: "X"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 173,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 171,
                                                    columnNumber: 17
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    width: '100px',
                                                    height: '100px',
                                                    border: `2px dashed ${theme.cyan}`,
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    fontSize: '2rem',
                                                    color: theme.cyan
                                                },
                                                className: "jsx-3b1f9c4efbd20541" + " " + "btn-press",
                                                children: [
                                                    subiendo ? '...' : '+',
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "file",
                                                        accept: "image/*",
                                                        multiple: true,
                                                        onChange: manejarFotos,
                                                        style: {
                                                            display: 'none'
                                                        },
                                                        className: "jsx-3b1f9c4efbd20541"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 178,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 176,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 169,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: guardar,
                        style: {
                            marginTop: '25px',
                            width: '100%',
                            padding: '20px',
                            background: `linear-gradient(to right, ${theme.orange}, #d35400)`,
                            color: theme.white,
                            border: 'none',
                            borderRadius: '15px',
                            fontWeight: '900',
                            fontSize: '1.2rem'
                        },
                        className: "jsx-3b1f9c4efbd20541" + " " + "btn-press",
                        children: editandoId ? 'CONFIRMAR CAMBIOS' : 'GUARDAR DISPOSITIVO'
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                style: {
                    paddingLeft: '15px',
                    borderLeft: `6px solid ${theme.cyan}`,
                    marginBottom: '30px'
                },
                className: "jsx-3b1f9c4efbd20541",
                children: [
                    "STOCK DISPONIBLE (",
                    equiposFiltrados.length,
                    ")"
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '30px'
                },
                className: "jsx-3b1f9c4efbd20541",
                children: equiposFiltrados.map((cel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: theme.card,
                            borderRadius: '25px',
                            overflow: 'hidden',
                            border: '1px solid #25335a'
                        },
                        className: "jsx-3b1f9c4efbd20541",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                src: cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250/0b1426/ffffff?text=FARRUS',
                                style: {
                                    width: '100%',
                                    height: '220px',
                                    objectFit: 'cover'
                                },
                                className: "jsx-3b1f9c4efbd20541"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '25px'
                                },
                                className: "jsx-3b1f9c4efbd20541",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            margin: 0,
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold'
                                        },
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: [
                                            cel.marca,
                                            " ",
                                            cel.modelo
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: theme.cyan,
                                            fontWeight: 'bold',
                                            margin: '8px 0'
                                        },
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: [
                                            "💾 ",
                                            cel.almacenamiento || '---'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 197,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '2.2rem',
                                            fontWeight: '900',
                                            color: theme.orange,
                                            margin: '15px 0'
                                        },
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: [
                                            "S/ ",
                                            cel.precio_venta
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '10px'
                                        },
                                        className: "jsx-3b1f9c4efbd20541",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>prepararEdicion(cel),
                                                style: {
                                                    flex: 3,
                                                    padding: '12px',
                                                    background: 'transparent',
                                                    border: `2px solid ${theme.cyan}`,
                                                    color: theme.cyan,
                                                    borderRadius: '12px',
                                                    fontWeight: 'bold'
                                                },
                                                className: "jsx-3b1f9c4efbd20541" + " " + "btn-press",
                                                children: "EDITAR"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>eliminar(cel.id),
                                                style: {
                                                    flex: 1,
                                                    backgroundColor: '#2d1a1a',
                                                    color: '#ff6b6b',
                                                    border: '1px solid #ff6b6b',
                                                    borderRadius: '12px'
                                                },
                                                className: "jsx-3b1f9c4efbd20541" + " " + "btn-press",
                                                children: "🗑️"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 201,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this)
                        ]
                    }, cel.id, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__62a38854._.js.map