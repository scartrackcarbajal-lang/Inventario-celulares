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
const supabaseUrl = ("TURBOPACK compile-time value", "https://lptiwrdmvxyisaixnuel.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdGl3cmRtdnh5aXNhaXhudWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDI0MDIsImV4cCI6MjA4MzY3ODQwMn0.iotGFhBfo2Fjvj9LhEk-z1CpCaM7wrZINrfDn0uGzD8");
const supabase = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$29$__["createClient"])(supabaseUrl, supabaseAnonKey);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/index.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CatalogoPublico
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [ssr] (ecmascript)");
// --- PASO 2A: Import Link (Next.js) ---
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function CatalogoPublico() {
    const [equipos, setEquipos] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // ====== V2: Listas separadas (celulares serializados + perfumes bulk) ======
    const [celulares, setCelulares] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [perfumes, setPerfumes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [busqueda, setBusqueda] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const whatsappPropio = '51992571579';
    const theme = {
        navy: '#0b1426',
        card: '#162447',
        orange: '#f39c12',
        cyan: '#00d2ff',
        white: '#ffffff',
        muted: '#94a3b8',
        cardGlow: '0 0 20px rgba(0, 210, 255, 0.4)',
        buttonGradient: 'linear-gradient(to right, #00d2ff, #f39c12)'
    };
    // ====== CARGA V2: Celulares (por unidad) + Perfumes (por stock) ======
    const cargarEquipos = async ()=>{
        // 1) Celulares: 1 tarjeta por unidad (IMEI/serial)
        const { data: celData, error: celError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('items_serializados').select(`
        id,
        serial,
        estado,
        salud_bateria,
        almacenamiento,
        color,
        imagen_url,
        created_at,
        skus!inner(
          id,
          precio_venta,
          publicado,
          productos(
            marca,
            nombre
          )
        )
      `).eq('skus.publicado', true).eq('vendido', false).order('created_at', {
            ascending: false
        });
        if (celError) {
            console.error('Error cargando celulares (items_serializados)', celError);
        } else {
            setCelulares(celData || []);
        }
        // 2) Perfumes: 1 tarjeta por SKU (cantidad)
        const { data: perfData, error: perfError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('skus').select(`
        id,
        sku_codigo,
        precio_venta,
        tracking,
        publicado,
        created_at,
        productos(marca, nombre),
        stock_bulk(stock)
      `).eq('publicado', true).eq('tracking', 'BULK').order('created_at', {
            ascending: false
        });
        if (perfError) {
            console.error('Error cargando perfumes (skus + stock_bulk)', perfError);
        } else {
            setPerfumes(perfData || []);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        cargarEquipos();
    }, []);
    // ====== FILTROS V2 (busca en celulares + perfumes) ======
    const celularesFiltrados = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const q = busqueda.toLowerCase().trim();
        if (!q) return celulares;
        return celulares.filter((item)=>{
            const marca = item?.skus?.productos?.marca?.toLowerCase() || '';
            const nombre = item?.skus?.productos?.nombre?.toLowerCase() || '';
            const estado = item?.estado?.toLowerCase() || '';
            return marca.includes(q) || nombre.includes(q) || estado.includes(q);
        });
    }, [
        celulares,
        busqueda
    ]);
    const perfumesFiltrados = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const q = busqueda.toLowerCase().trim();
        if (!q) return perfumes;
        return perfumes.filter((sku)=>{
            const marca = sku?.productos?.marca?.toLowerCase() || '';
            const nombre = sku?.productos?.nombre?.toLowerCase() || '';
            return marca.includes(q) || nombre.includes(q);
        });
    }, [
        perfumes,
        busqueda
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: '20px',
            backgroundColor: theme.navy,
            minHeight: '100vh',
            color: theme.white,
            fontFamily: "'Inter', sans-serif",
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23162447' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        },
        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
            [
                "83efe2e5b9e8c490",
                [
                    theme.cyan,
                    theme.cyan
                ]
            ]
        ]),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "83efe2e5b9e8c490",
                dynamic: [
                    theme.cyan,
                    theme.cyan
                ],
                children: `@import "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap";.galeria-scroll{scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:${theme.cyan} transparent;display:flex;overflow-x:auto}.galeria-scroll::-webkit-scrollbar{height:6px}.galeria-scroll::-webkit-scrollbar-thumb{background:${theme.cyan};border-radius:10px}.foto-item{scroll-snap-align:start;object-fit:cover;flex:0 0 100%;height:300px}.grid-catalogo{grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:30px;max-width:1400px;margin:auto;display:grid}@media (width<=600px){.titulo-hub{font-size:2.5rem!important}.foto-item{height:250px}.grid-catalogo{grid-template-columns:1fr}}`
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center',
                    margin: '40px 0'
                },
                className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                    [
                        "83efe2e5b9e8c490",
                        [
                            theme.cyan,
                            theme.cyan
                        ]
                    ]
                ]),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: '4rem',
                            fontWeight: '900',
                            margin: 0
                        },
                        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                            [
                                "83efe2e5b9e8c490",
                                [
                                    theme.cyan,
                                    theme.cyan
                                ]
                            ]
                        ]) + " " + "titulo-hub",
                        children: [
                            "LOS FARRUS ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: theme.orange
                                },
                                className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                    [
                                        "83efe2e5b9e8c490",
                                        [
                                            theme.cyan,
                                            theme.cyan
                                        ]
                                    ]
                                ]),
                                children: "HUB"
                            }, void 0, false, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 178,
                                columnNumber: 22
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        style: {
                            color: theme.cyan,
                            letterSpacing: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        },
                        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                            [
                                "83efe2e5b9e8c490",
                                [
                                    theme.cyan,
                                    theme.cyan
                                ]
                            ]
                        ]),
                        children: "CATÁLOGO OFICIAL"
                    }, void 0, false, {
                        fileName: "[project]/pages/index.js",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '50px',
                    display: 'flex',
                    justifyContent: 'center'
                },
                className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                    [
                        "83efe2e5b9e8c490",
                        [
                            theme.cyan,
                            theme.cyan
                        ]
                    ]
                ]),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                    placeholder: "🔍 ¿Qué celular buscas?",
                    value: busqueda,
                    onChange: (e)=>setBusqueda(e.target.value),
                    style: {
                        width: '90%',
                        maxWidth: '600px',
                        padding: '18px 25px',
                        borderRadius: '50px',
                        backgroundColor: theme.card,
                        border: `2px solid ${theme.cyan}`,
                        color: theme.white,
                        fontSize: '1.1rem',
                        outline: 'none',
                        boxShadow: `0 0 15px ${theme.cyan}30`
                    },
                    className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                        [
                            "83efe2e5b9e8c490",
                            [
                                theme.cyan,
                                theme.cyan
                            ]
                        ]
                    ])
                }, void 0, false, {
                    fileName: "[project]/pages/index.js",
                    lineNumber: 187,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                    [
                        "83efe2e5b9e8c490",
                        [
                            theme.cyan,
                            theme.cyan
                        ]
                    ]
                ]) + " " + "grid-catalogo",
                children: [
                    celularesFiltrados.map((item)=>{
                        const marca = item?.skus?.productos?.marca || '';
                        const nombre = item?.skus?.productos?.nombre || '';
                        const precio = item?.skus?.precio_venta ?? '';
                        const titulo = `${marca} ${nombre}`.trim();
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                backgroundColor: theme.card,
                                borderRadius: '30px',
                                overflow: 'hidden',
                                border: `1px solid ${theme.cyan}60`,
                                boxShadow: theme.cardGlow,
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column'
                            },
                            className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                [
                                    "83efe2e5b9e8c490",
                                    [
                                        theme.cyan,
                                        theme.cyan
                                    ]
                                ]
                            ]),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                        [
                                            "83efe2e5b9e8c490",
                                            [
                                                theme.cyan,
                                                theme.cyan
                                            ]
                                        ]
                                    ]) + " " + "galeria-scroll",
                                    children: Array.isArray(item.imagen_url) && item.imagen_url.length > 0 ? item.imagen_url.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                            src: url,
                                            alt: `${titulo} foto ${i + 1}`,
                                            className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                [
                                                    "83efe2e5b9e8c490",
                                                    [
                                                        theme.cyan,
                                                        theme.cyan
                                                    ]
                                                ]
                                            ]) + " " + "foto-item"
                                        }, i, false, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 233,
                                            columnNumber: 21
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        src: "https://via.placeholder.com/400x300/0b1426/ffffff?text=FARRUS+HUB",
                                        alt: "Sin foto",
                                        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                            [
                                                "83efe2e5b9e8c490",
                                                [
                                                    theme.cyan,
                                                    theme.cyan
                                                ]
                                            ]
                                        ]) + " " + "foto-item"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 236,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '25px',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    },
                                    className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                        [
                                            "83efe2e5b9e8c490",
                                            [
                                                theme.cyan,
                                                theme.cyan
                                            ]
                                        ]
                                    ]),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start'
                                            },
                                            className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                [
                                                    "83efe2e5b9e8c490",
                                                    [
                                                        theme.cyan,
                                                        theme.cyan
                                                    ]
                                                ]
                                            ]),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    style: {
                                                        margin: 0,
                                                        fontSize: '1.5rem'
                                                    },
                                                    className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                        [
                                                            "83efe2e5b9e8c490",
                                                            [
                                                                theme.cyan,
                                                                theme.cyan
                                                            ]
                                                        ]
                                                    ]),
                                                    children: titulo
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 246,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        backgroundColor: theme.orange,
                                                        padding: '4px 10px',
                                                        borderRadius: '10px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 'bold'
                                                    },
                                                    className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                        [
                                                            "83efe2e5b9e8c490",
                                                            [
                                                                theme.cyan,
                                                                theme.cyan
                                                            ]
                                                        ]
                                                    ]),
                                                    children: item.estado || 'Equipo'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 247,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: theme.cyan,
                                                fontWeight: 'bold',
                                                margin: '10px 0'
                                            },
                                            className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                [
                                                    "83efe2e5b9e8c490",
                                                    [
                                                        theme.cyan,
                                                        theme.cyan
                                                    ]
                                                ]
                                            ]),
                                            children: [
                                                "💾 ",
                                                item.almacenamiento || '—',
                                                item.salud_bateria ? ` | 🔋 ${item.salud_bateria}%` : ''
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 260,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginTop: 'auto'
                                            },
                                            className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                [
                                                    "83efe2e5b9e8c490",
                                                    [
                                                        theme.cyan,
                                                        theme.cyan
                                                    ]
                                                ]
                                            ]),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '1.8rem',
                                                        fontWeight: '900'
                                                    },
                                                    className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                        [
                                                            "83efe2e5b9e8c490",
                                                            [
                                                                theme.cyan,
                                                                theme.cyan
                                                            ]
                                                        ]
                                                    ]),
                                                    children: [
                                                        "S/ ",
                                                        precio
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 266,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/detalles/${item.id}?tipo=serial`,
                                                    style: {
                                                        padding: '12px 20px',
                                                        background: theme.buttonGradient,
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                        borderRadius: '50px',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.9rem',
                                                        boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)'
                                                    },
                                                    children: "Ver Detalles 📱"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/index.js",
                                                    lineNumber: 268,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/index.js",
                                            lineNumber: 265,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this),
                                Array.isArray(item.imagen_url) && item.imagen_url.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        top: '260px',
                                        width: '100%',
                                        textAlign: 'center',
                                        pointerEvents: 'none'
                                    },
                                    className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                        [
                                            "83efe2e5b9e8c490",
                                            [
                                                theme.cyan,
                                                theme.cyan
                                            ]
                                        ]
                                    ]),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            background: 'rgba(0,0,0,0.6)',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.6rem'
                                        },
                                        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                            [
                                                "83efe2e5b9e8c490",
                                                [
                                                    theme.cyan,
                                                    theme.cyan
                                                ]
                                            ]
                                        ]),
                                        children: "Desliza para ver más ↔️"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 297,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/index.js",
                                    lineNumber: 288,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, `cel-${item.id}`, true, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 216,
                            columnNumber: 13
                        }, this);
                    }),
                    perfumesFiltrados.map((sku)=>{
                        const marca = sku?.productos?.marca || '';
                        const nombre = sku?.productos?.nombre || '';
                        const stock = sku?.stock_bulk?.stock ?? 0;
                        const titulo = `${marca} ${nombre}`.trim();
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                backgroundColor: theme.card,
                                borderRadius: '30px',
                                overflow: 'hidden',
                                border: `1px solid ${theme.cyan}60`,
                                boxShadow: theme.cardGlow,
                                display: 'flex',
                                flexDirection: 'column'
                            },
                            className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                [
                                    "83efe2e5b9e8c490",
                                    [
                                        theme.cyan,
                                        theme.cyan
                                    ]
                                ]
                            ]),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '25px',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column'
                                },
                                className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                    [
                                        "83efe2e5b9e8c490",
                                        [
                                            theme.cyan,
                                            theme.cyan
                                        ]
                                    ]
                                ]),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        style: {
                                            margin: 0,
                                            fontSize: '1.5rem'
                                        },
                                        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                            [
                                                "83efe2e5b9e8c490",
                                                [
                                                    theme.cyan,
                                                    theme.cyan
                                                ]
                                            ]
                                        ]),
                                        children: titulo
                                    }, void 0, false, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 334,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: theme.muted,
                                            fontSize: '0.9rem',
                                            margin: '12px 0 18px'
                                        },
                                        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                            [
                                                "83efe2e5b9e8c490",
                                                [
                                                    theme.cyan,
                                                    theme.cyan
                                                ]
                                            ]
                                        ]),
                                        children: [
                                            "Stock: ",
                                            stock
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 336,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: 'auto'
                                        },
                                        className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                            [
                                                "83efe2e5b9e8c490",
                                                [
                                                    theme.cyan,
                                                    theme.cyan
                                                ]
                                            ]
                                        ]),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '1.8rem',
                                                    fontWeight: '900'
                                                },
                                                className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                                                    [
                                                        "83efe2e5b9e8c490",
                                                        [
                                                            theme.cyan,
                                                            theme.cyan
                                                        ]
                                                    ]
                                                ]),
                                                children: [
                                                    "S/ ",
                                                    sku.precio_venta
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 341,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/detalles/${sku.id}?tipo=bulk`,
                                                style: {
                                                    padding: '12px 20px',
                                                    background: theme.buttonGradient,
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    borderRadius: '50px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.9rem',
                                                    boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)'
                                                },
                                                children: "Ver Detalles 🧴"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/index.js",
                                                lineNumber: 343,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/index.js",
                                        lineNumber: 340,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/index.js",
                                lineNumber: 333,
                                columnNumber: 15
                            }, this)
                        }, `perf-${sku.id}`, false, {
                            fileName: "[project]/pages/index.js",
                            lineNumber: 321,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/pages/index.js",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                style: {
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: theme.muted,
                    fontSize: '0.8rem'
                },
                className: __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"].dynamic([
                    [
                        "83efe2e5b9e8c490",
                        [
                            theme.cyan,
                            theme.cyan
                        ]
                    ]
                ]),
                children: "© 2026 LOS FARRUS HUB | TECNOLOGÍA PREMIUM EN PERÚ"
            }, void 0, false, {
                fileName: "[project]/pages/index.js",
                lineNumber: 365,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/index.js",
        lineNumber: 113,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0b5d204b._.js.map