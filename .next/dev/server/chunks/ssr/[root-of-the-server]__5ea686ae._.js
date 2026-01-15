module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

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
"[project]/pages/inventario.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Inventario
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
// --- COMPONENTE TARJETA (con VENDIDO + borde rojo + eliminar visible) ---
function TarjetaEquipo({ cel, onEdit, onDelete, onSell, theme, onOpenModal }) {
    const [fotoActiva, setFotoActiva] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto');
    // Colores para la etiqueta de estado
    const colorEstado = {
        'Nuevo Sellado': '#00d2ff',
        'Semi Nuevo': '#f39c12',
        'Usado': '#e74c3c',
        'Open Box': '#f39c12' // Naranja
    };
    // --- VENDIDO (estado calculado por stock) ---
    const vendido = Number(cel.stock) <= 0;
    // Sombras/borde según vendido
    const sombraNormal = `0 0 15px ${theme.cyan}44, inset 0 0 10px ${theme.cyan}22`;
    const sombraHover = `0 0 30px ${theme.cyan}66, inset 0 0 20px ${theme.cyan}33`;
    const sombraNormalVendido = '0 0 20px rgba(255,107,107,0.35), inset 0 0 12px rgba(255,107,107,0.18)';
    const sombraHoverVendido = '0 0 35px rgba(255,107,107,0.45), inset 0 0 18px rgba(255,107,107,0.22)';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: vendido ? '2px solid rgba(255,107,107,0.85)' : `2px solid ${theme.cyan}`,
            boxShadow: vendido ? sombraNormalVendido : sombraNormal,
            transition: 'transform 0.3s, box-shadow 0.3s',
            position: 'relative',
            maxWidth: '360px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column'
        },
        onMouseEnter: (e)=>{
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = vendido ? sombraHoverVendido : sombraHover;
        },
        onMouseLeave: (e)=>{
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = vendido ? sombraNormalVendido : sombraNormal;
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    height: '220px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#050a14',
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${fotoActiva})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(50px) brightness(0.4)',
                            transform: 'scale(1.5)',
                            zIndex: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        onClick: ()=>onOpenModal(fotoActiva),
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 2,
                            padding: '15px',
                            cursor: 'zoom-in'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: fotoActiva,
                            style: {
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))',
                                transition: 'transform 0.2s'
                            },
                            alt: "Celular"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: colorEstado[cel.estado] || '#888',
                            color: 'white',
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            zIndex: 3,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        },
                        children: cel.estado
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    vendido && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 5,
                            background: 'linear-gradient(135deg, rgba(0,0,0,0.60), rgba(0,0,0,0.25))',
                            backdropFilter: 'blur(2px)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '12px 22px',
                                borderRadius: '18px',
                                background: 'rgba(231, 76, 60, 0.18)',
                                border: '2px solid rgba(231, 76, 60, 0.80)',
                                color: '#fff',
                                fontWeight: '900',
                                fontSize: '1.5rem',
                                letterSpacing: '5px',
                                textTransform: 'uppercase',
                                boxShadow: '0 12px 30px rgba(0,0,0,0.55)'
                            },
                            children: "VENDIDO"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 125,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            cel.imagen_url && cel.imagen_url.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '8px',
                    padding: '10px 20px',
                    backgroundColor: '#0b1426',
                    overflowX: 'auto',
                    borderBottom: `1px solid ${theme.cyan}11`,
                    zIndex: 4,
                    position: 'relative',
                    flexShrink: 0
                },
                children: cel.imagen_url.map((url, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                        src: url,
                        onClick: ()=>setFotoActiva(url),
                        style: {
                            width: '42px',
                            height: '42px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid transparent`,
                            cursor: 'pointer',
                            opacity: fotoActiva === url ? 1 : 0.5,
                            transition: 'all 0.2s'
                        }
                    }, index, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 161,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 147,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    padding: '20px 25px',
                    background: theme.card,
                    position: 'relative',
                    zIndex: 4,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '12px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: 0,
                                fontSize: '1.4rem',
                                color: 'white',
                                fontWeight: '800',
                                letterSpacing: '0.5px',
                                lineHeight: '1.2'
                            },
                            children: [
                                cel.marca,
                                " ",
                                cel.modelo
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 194,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: theme.cyan,
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '15px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: [
                                    "💾 ",
                                    cel.almacenamiento
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            cel.salud_bateria && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.3
                                        },
                                        children: "|"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 202,
                                        columnNumber: 36
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: [
                                            "🔋 ",
                                            cel.salud_bateria,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 202,
                                        columnNumber: 75
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginBottom: '15px'
                        },
                        children: [
                            cel.color && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'inline-block',
                                    padding: '5px 12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${theme.cyan}44`,
                                    backgroundColor: 'rgba(0, 210, 255, 0.05)',
                                    color: '#fff',
                                    fontSize: '0.85rem'
                                },
                                children: [
                                    "🎨 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 'bold',
                                            color: theme.cyan
                                        },
                                        children: cel.color
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 209,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this),
                            cel.imei && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '0.75rem',
                                    color: '#666',
                                    fontFamily: 'monospace'
                                },
                                children: [
                                    "IMEI: ",
                                    cel.imei
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 212,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    cel.descripcion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '20px',
                            padding: '12px',
                            backgroundColor: 'rgba(0,0,0,0.25)',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            color: '#ccc',
                            lineHeight: '1.5',
                            borderLeft: `3px solid ${theme.orange}`
                        },
                        children: cel.descripcion
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            flexGrow: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '10px',
                            paddingTop: '15px',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            gap: '20px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'block',
                                            fontSize: '0.7rem',
                                            color: '#888',
                                            marginBottom: '4px',
                                            letterSpacing: '1px'
                                        },
                                        children: "PRECIO"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: 'white',
                                            fontSize: '1.7rem',
                                            fontWeight: '900',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: [
                                            "S/ ",
                                            cel.precio_venta
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 228,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'center',
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onEdit(cel),
                                        style: {
                                            padding: '10px 20px',
                                            background: theme.cyan,
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '50px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            boxShadow: '0 5px 15px rgba(0,210,255,0.2)'
                                        },
                                        children: "EDITAR"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 233,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            if (!vendido) onSell(cel);
                                        },
                                        disabled: vendido,
                                        style: {
                                            padding: '10px 16px',
                                            background: vendido ? 'rgba(255,255,255,0.08)' : 'rgba(231, 76, 60, 0.18)',
                                            color: vendido ? '#ddd' : '#ff6b6b',
                                            border: vendido ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,107,107,0.55)',
                                            borderRadius: '50px',
                                            fontWeight: 'bold',
                                            cursor: vendido ? 'not-allowed' : 'pointer',
                                            fontSize: '0.85rem',
                                            letterSpacing: '1px'
                                        },
                                        title: vendido ? 'Este equipo ya está vendido' : 'Marcar como vendido',
                                        children: "VENDIDO"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onDelete(cel.id),
                                        style: {
                                            padding: '10px 14px',
                                            background: '#2d1a1a',
                                            color: '#ff6b6b',
                                            border: '1px solid rgba(255,107,107,0.55)',
                                            borderRadius: '50px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem',
                                            boxShadow: '0 6px 18px rgba(255,107,107,0.15)'
                                        },
                                        title: "Eliminar del inventario",
                                        children: "ELIMINAR 🗑️"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 269,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 181,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
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
    const [modalImagen, setModalImagen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null) // Estado para el Zoom
    ;
    // --- AUTH (Supabase email/password) ---
    const [autorizado, setAutorizado] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [cargandoLogin, setCargandoLogin] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // --- LOGIN: mensaje visible ---
    const [loginError, setLoginError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    // --- VENTA: modal + form ---
    const [ventaModalAbierto, setVentaModalAbierto] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [ventaCel, setVentaCel] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [ventaForm, setVentaForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        precio_final: '',
        cliente_nombre: '',
        cliente_telefono: ''
    });
    const [ventas, setVentas] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [ventasDesde, setVentasDesde] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('') // "YYYY-MM-DD"
    ;
    const [ventasHasta, setVentasHasta] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('') // "YYYY-MM-DD"
    ;
    const [cargandoVentas, setCargandoVentas] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [guardandoVenta, setGuardandoVenta] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // --- FILTROS: básicos (luego ampliamos) ---
    const [filtroEstado, setFiltroEstado] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('TODOS');
    const [filtroPublicado, setFiltroPublicado] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('TODOS') // TODOS | PUBLICADO | OCULTO
    ;
    const [filtroVendidos, setFiltroVendidos] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('TODOS') // TODOS | VENDIDOS | DISPONIBLES
    ;
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession().then(({ data })=>{
            setAutorizado(!!data.session);
        });
        const { data: sub } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange((_event, session)=>{
            setAutorizado(!!session);
        });
        return ()=>{
            sub.subscription.unsubscribe();
        };
    }, []);
    // --- LOGIN: función ---
    const login = async ()=>{
        setLoginError('');
        const emailLimpio = (email || '').trim();
        if (!emailLimpio || !password) {
            setLoginError('Escribe correo y contraseña.');
            return;
        }
        setCargandoLogin(true);
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
            email: emailLimpio,
            password
        });
        setCargandoLogin(false);
        if (error) setLoginError(error.message);
    };
    const logout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        setAutorizado(false);
        avisar("🔒 Sesión cerrada");
    };
    // Estilos
    const theme = {
        navy: '#0b1426',
        card: '#162447',
        orange: '#f39c12',
        cyan: '#00d2ff',
        white: '#ffffff',
        gradient: 'linear-gradient(135deg, #050a14 0%, #162447 100%)'
    };
    const inputStyle = {
        padding: '16px',
        borderRadius: '15px',
        border: '1px solid #25335a',
        background: '#0b1426',
        color: 'white',
        outline: 'none',
        fontSize: '1rem',
        width: '100%',
        boxSizing: 'border-box'
    };
    // --- Estado inicial (incluye publicado + stock) ---
    const estadoInicial = {
        marca: '',
        modelo: '',
        color: '',
        almacenamiento: '',
        imei: '',
        precio_venta: '',
        precio_costo: '',
        salud_bateria: '',
        descripcion: '',
        estado: 'Nuevo Sellado',
        imagen_url: [],
        publicado: true,
        stock: 1
    };
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(estadoInicial);
    const normalizarImei = (v)=>(v || '').replace(/\D/g, '').slice(0, 15);
    const inicioDelDiaISO = (yyyyMmDd)=>{
        if (!yyyyMmDd) return null;
        const d = new Date(`${yyyyMmDd}T00:00:00`);
        return d.toISOString();
    };
    const finDelDiaISO = (yyyyMmDd)=>{
        if (!yyyyMmDd) return null;
        const d = new Date(`${yyyyMmDd}T23:59:59.999`);
        return d.toISOString();
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
    const cargarVentas = async ()=>{
        setCargandoVentas(true);
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('ventas').select(`
        id,
        celular_id,
        precio_lista,
        precio_final,
        descuento,
        cliente_nombre,
        cliente_telefono,
        vendido_en,
        vendido_por,
        Celulares:celular_id (
          id,
          marca,
          modelo,
          imei,
          precio_costo
        )
      `).order('vendido_en', {
            ascending: false
        }).limit(200);
        const desdeISO = inicioDelDiaISO(ventasDesde);
        const hastaISO = finDelDiaISO(ventasHasta);
        if (desdeISO) query = query.gte('vendido_en', desdeISO);
        if (hastaISO) query = query.lte('vendido_en', hastaISO);
        const { data, error } = await query;
        setCargandoVentas(false);
        if (error) {
            avisar('❌ Error cargando ventas: ' + error.message, '#ff4b2b');
            return;
        }
        setVentas(data || []);
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (autorizado) {
            cargarEquipos();
            cargarVentas();
        }
    }, [
        autorizado
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (autorizado) {
            cargarVentas();
        }
    }, [
        autorizado,
        ventasDesde,
        ventasHasta
    ]);
    const manejarFotos = async (e)=>{
        const archivos = Array.from(e.target.files);
        setSubiendo(true);
        let nuevasUrls = [
            ...form.imagen_url || []
        ];
        for (const archivo of archivos){
            const nombre = `${Date.now()}_${archivo.name}`;
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').upload(nombre, archivo);
            if (error) {
                avisar("❌ Error subiendo foto: " + error.message, "#ff4b2b");
                continue;
            }
            const { data: u } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').getPublicUrl(nombre);
            nuevasUrls.push(u.publicUrl);
        }
        setForm({
            ...form,
            imagen_url: nuevasUrls
        });
        setSubiendo(false);
        avisar("📸 Fotos subidas");
    };
    const guardar = async ()=>{
        const datosLimpios = {
            ...form,
            precio_venta: form.precio_venta === '' ? null : form.precio_venta,
            precio_costo: form.precio_costo === '' ? null : form.precio_costo,
            salud_bateria: form.salud_bateria === '' ? null : form.salud_bateria
        };
        // Normaliza IMEI (solo números, máx 15)
        datosLimpios.imei = datosLimpios.imei ? normalizarImei(datosLimpios.imei) : '';
        // Validación IMEI (si hay IMEI debe ser 15 dígitos)
        if (datosLimpios.imei && datosLimpios.imei.length !== 15) {
            avisar('⚠️ IMEI debe tener 15 dígitos', '#ff4b2b');
            return;
        }
        if (editandoId) {
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').update(datosLimpios).eq('id', editandoId);
            if (updateError) {
                const msg = (updateError?.message || '').toLowerCase();
                const code = updateError?.code;
                if (code === '23505' || msg.includes('duplicate') || msg.includes('unique')) {
                    avisar('⚠️ Ese IMEI ya existe en el inventario', '#ff4b2b');
                    return;
                }
                avisar('Error: ' + updateError.message, 'red');
                return;
            }
            setEditandoId(null);
            avisar('✅ Actualizado');
        } else {
            const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').insert([
                datosLimpios
            ]);
            if (insertError) {
                const msg = (insertError?.message || '').toLowerCase();
                const code = insertError?.code;
                if (code === '23505' || msg.includes('duplicate') || msg.includes('unique')) {
                    avisar('⚠️ Ese IMEI ya existe en el inventario', '#ff4b2b');
                    return;
                }
                avisar('Error: ' + insertError.message, 'red');
                return;
            }
            avisar('🚀 Registrado');
        }
        setForm(estadoInicial);
        await cargarEquipos();
        await cargarVentas();
        cargarEquipos();
    };
    // --- VENTA: abrir modal ---
    const abrirModalVenta = (cel)=>{
        setVentaCel(cel);
        setVentaForm({
            precio_final: cel?.precio_venta ?? '',
            cliente_nombre: '',
            cliente_telefono: ''
        });
        setVentaModalAbierto(true);
    };
    // --- VENTA: confirmar (ventas + movimientos + update celulares) ---
    const confirmarVenta = async ()=>{
        if (!ventaCel) return;
        if (Number(ventaCel.stock) <= 0) {
            avisar('⚠️ Este equipo ya está vendido', '#ff4b2b');
            return;
        }
        const precioFinal = Number(ventaForm.precio_final);
        if (!precioFinal || precioFinal <= 0) {
            avisar('⚠️ Ingresa el precio final', '#ff4b2b');
            return;
        }
        setGuardandoVenta(true);
        // usuario logueado (para vender_por y actor_id)
        const { data: sess } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        const userId = sess?.session?.user?.id;
        if (!userId) {
            setGuardandoVenta(false);
            avisar('⚠️ Sesión no válida, vuelve a iniciar sesión', '#ff4b2b');
            return;
        }
        // 1) Insert venta (OBLIGATORIO: vendido_por = userId para pasar RLS self)
        const { error: errVenta } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('ventas').insert([
            {
                celular_id: ventaCel.id,
                precio_lista: ventaCel.precio_venta ?? null,
                precio_final: precioFinal,
                cliente_nombre: ventaForm.cliente_nombre?.trim() || null,
                cliente_telefono: ventaForm.cliente_telefono?.trim() || null,
                vendido_por: userId
            }
        ]);
        if (errVenta) {
            setGuardandoVenta(false);
            avisar('❌ Error registrando venta: ' + errVenta.message, '#ff4b2b');
            return;
        }
        // 2) Update celular -> vendido
        const { error: errUpd } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').update({
            stock: 0,
            publicado: false
        }).eq('id', ventaCel.id);
        if (errUpd) {
            setGuardandoVenta(false);
            avisar('❌ Error marcando vendido: ' + errUpd.message, '#ff4b2b');
            return;
        }
        // 3) Insert movimiento (OBLIGATORIO: actor_id = userId para pasar RLS self)
        const { error: errMov } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('movimientos_inventario').insert([
            {
                celular_id: ventaCel.id,
                tipo: 'VENDIDO',
                actor_id: userId,
                detalle: {
                    precio_lista: ventaCel.precio_venta ?? null,
                    precio_final: precioFinal,
                    cliente_nombre: ventaForm.cliente_nombre?.trim() || null,
                    cliente_telefono: ventaForm.cliente_telefono?.trim() || null
                }
            }
        ]);
        if (errMov) {
            // No bloquea la venta, pero avisa (ya se vendió)
            avisar('⚠️ Vendido, pero no se registró movimiento: ' + errMov.message, '#ff4b2b');
        } else {
            avisar('✅ Venta registrada');
        }
        setGuardandoVenta(false);
        setVentaModalAbierto(false);
        setVentaCel(null);
        setVentaForm({
            precio_final: '',
            cliente_nombre: '',
            cliente_telefono: ''
        });
        await cargarEquipos();
        await cargarVentas();
    };
    const equiposFiltrados = equipos.filter((cel)=>{
        const texto = (busqueda || '').toLowerCase();
        const matchBusqueda = cel.marca?.toLowerCase().includes(texto) || cel.modelo?.toLowerCase().includes(texto) || cel.estado?.toLowerCase().includes(texto) || cel.imei?.toLowerCase().includes(texto) || cel.color?.toLowerCase().includes(texto);
        const matchEstado = filtroEstado === 'TODOS' ? true : cel.estado === filtroEstado;
        const matchPublicado = filtroPublicado === 'TODOS' ? true : filtroPublicado === 'PUBLICADO' ? !!cel.publicado : !cel.publicado;
        const vendido = Number(cel.stock) <= 0;
        const matchVendidos = filtroVendidos === 'TODOS' ? true : filtroVendidos === 'VENDIDOS' ? vendido : !vendido;
        return matchBusqueda && matchEstado && matchPublicado && matchVendidos;
    });
    const resumenVentas = ventas.reduce((acc, v)=>{
        const costo = Number(v?.Celulares?.precio_costo ?? 0);
        const final = Number(v?.precio_final ?? 0);
        acc.totalVentas += final;
        acc.totalCosto += costo;
        acc.totalGanancia += final - costo;
        acc.count += 1;
        return acc;
    }, {
        totalVentas: 0,
        totalCosto: 0,
        totalGanancia: 0,
        count: 0
    });
    // --- LOGIN ---
    if (!autorizado) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: theme.gradient,
                display: 'grid',
                placeItems: 'center',
                zIndex: 9999,
                fontFamily: 'sans-serif'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: theme.card,
                    padding: '50px 40px',
                    borderRadius: '35px',
                    textAlign: 'center',
                    border: `2px solid ${theme.cyan}`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    width: '90%',
                    maxWidth: '420px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: '2.5rem',
                            margin: '0 0 10px',
                            fontWeight: '900',
                            color: 'white'
                        },
                        children: [
                            "LOS FARRUS ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: theme.orange
                                },
                                children: "HUB"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 686,
                                columnNumber: 110
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 686,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        style: {
                            color: theme.cyan,
                            marginBottom: '25px',
                            letterSpacing: '2px',
                            fontSize: '0.9rem'
                        },
                        children: "PANEL DE GESTIÓN"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 687,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "email",
                        placeholder: "Correo (admin)",
                        value: email,
                        onChange: (e)=>setEmail(e.target.value),
                        style: {
                            width: '100%',
                            padding: '18px',
                            borderRadius: '15px',
                            border: 'none',
                            backgroundColor: '#0b1426',
                            color: 'white',
                            marginBottom: '12px',
                            textAlign: 'center',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 689,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "password",
                        placeholder: "Contraseña",
                        value: password,
                        onChange: (e)=>setPassword(e.target.value),
                        onKeyDown: (e)=>e.key === 'Enter' && login(),
                        style: {
                            width: '100%',
                            padding: '18px',
                            borderRadius: '15px',
                            border: 'none',
                            backgroundColor: '#0b1426',
                            color: 'white',
                            marginBottom: '18px',
                            textAlign: 'center',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 697,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: login,
                        // --- BOTÓN LOGIN ---
                        disabled: cargandoLogin,
                        style: {
                            width: '100%',
                            padding: '18px',
                            background: theme.orange,
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            fontWeight: 'bold',
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            opacity: cargandoLogin ? 0.7 : 1,
                            boxShadow: '0 10px 20px rgba(243, 156, 18, 0.3)'
                        },
                        children: cargandoLogin ? 'CONECTANDO...' : 'ACCEDER'
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 706,
                        columnNumber: 9
                    }, this),
                    loginError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '12px',
                            color: '#ff4b2b',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            textAlign: 'center'
                        },
                        children: [
                            "⚠️ ",
                            loginError
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 729,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 685,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 684,
            columnNumber: 5
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: theme.gradient,
            padding: '50px 20px',
            color: 'white',
            fontFamily: 'sans-serif'
        },
        children: [
            notificacion.visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: theme.card,
                    color: theme.white,
                    padding: '15px 30px',
                    borderRadius: '15px',
                    borderLeft: `6px solid ${notificacion.color}`,
                    zIndex: 10000,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                },
                children: notificacion.mensaje
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 740,
                columnNumber: 32
            }, this),
            modalImagen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                onClick: ()=>setModalImagen(null),
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'zoom-out',
                    padding: '20px',
                    boxSizing: 'border-box',
                    backdropFilter: 'blur(5px)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                    src: modalImagen,
                    style: {
                        maxHeight: '90vh',
                        maxWidth: '90vw',
                        objectFit: 'contain',
                        borderRadius: '20px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                        border: `2px solid ${theme.cyan}`
                    }
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 752,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 744,
                columnNumber: 9
            }, this),
            ventaModalAbierto && ventaCel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                onClick: ()=>!guardandoVenta && setVentaModalAbierto(false),
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    zIndex: 99998,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    boxSizing: 'border-box'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    onClick: (e)=>e.stopPropagation(),
                    style: {
                        width: '100%',
                        maxWidth: 520,
                        background: theme.card,
                        borderRadius: 24,
                        border: `1px solid ${theme.cyan}33`,
                        padding: 22
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            style: {
                                marginTop: 0
                            },
                            children: "Registrar venta"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 779,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                color: '#94a3b8',
                                marginBottom: 14
                            },
                            children: [
                                ventaCel.marca,
                                " ",
                                ventaCel.modelo,
                                " — IMEI: ",
                                ventaCel.imei || 'N/A'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 780,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            style: {
                                display: 'block',
                                marginBottom: 6,
                                color: theme.cyan,
                                fontWeight: 'bold'
                            },
                            children: "Precio final (con descuento)"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 784,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            type: "number",
                            value: ventaForm.precio_final,
                            onChange: (e)=>setVentaForm({
                                    ...ventaForm,
                                    precio_final: e.target.value
                                }),
                            style: inputStyle
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 787,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                height: 12
                            }
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 794,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            style: {
                                display: 'block',
                                marginBottom: 6,
                                color: '#94a3b8'
                            },
                            children: "Cliente (opcional)"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 796,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            placeholder: "Nombre",
                            value: ventaForm.cliente_nombre,
                            onChange: (e)=>setVentaForm({
                                    ...ventaForm,
                                    cliente_nombre: e.target.value
                                }),
                            style: inputStyle
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 799,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                height: 10
                            }
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 806,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            placeholder: "Teléfono",
                            value: ventaForm.cliente_telefono,
                            onChange: (e)=>setVentaForm({
                                    ...ventaForm,
                                    cliente_telefono: e.target.value
                                }),
                            style: inputStyle
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 808,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: 12,
                                marginTop: 18
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setVentaModalAbierto(false),
                                    disabled: guardandoVenta,
                                    style: {
                                        flex: 1,
                                        padding: '14px 16px',
                                        borderRadius: 14,
                                        border: `1px solid ${theme.cyan}44`,
                                        background: 'transparent',
                                        color: theme.cyan,
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        opacity: guardandoVenta ? 0.6 : 1
                                    },
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 816,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: confirmarVenta,
                                    disabled: guardandoVenta,
                                    style: {
                                        flex: 1,
                                        padding: '14px 16px',
                                        borderRadius: 14,
                                        border: 'none',
                                        background: theme.orange,
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        opacity: guardandoVenta ? 0.6 : 1
                                    },
                                    children: guardandoVenta ? 'Guardando...' : 'Confirmar venta'
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 834,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 815,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 769,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 760,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: '1400px',
                    margin: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                        style: {
                            textAlign: 'center',
                            marginBottom: '60px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: '3.5rem',
                                    fontWeight: '900',
                                    margin: 0
                                },
                                children: [
                                    "LOS FARRUS ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: theme.orange
                                        },
                                        children: "HUB"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 859,
                                        columnNumber: 87
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 859,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: logout,
                                style: {
                                    background: 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${theme.cyan}`,
                                    color: theme.cyan,
                                    padding: '10px 25px',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    marginTop: '15px',
                                    fontWeight: 'bold'
                                },
                                children: "Cerrar Sesión 🔒"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 860,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 858,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: theme.card,
                            padding: '50px',
                            borderRadius: '40px',
                            marginBottom: '80px',
                            border: '1px solid rgba(0,210,255,0.15)',
                            boxShadow: '0 40px 90px rgba(0,0,0,0.4)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                style: {
                                    marginBottom: '40px',
                                    borderLeft: `8px solid ${theme.orange}`,
                                    paddingLeft: '20px',
                                    fontSize: '1.8rem'
                                },
                                children: editandoId ? '📝 EDITAR EQUIPO' : '📦 NUEVO INGRESO'
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 865,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                    gap: '25px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: theme.cyan,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                },
                                                children: "ESTADO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 871,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                value: form.estado,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        estado: e.target.value
                                                    }),
                                                style: inputStyle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "Nuevo Sellado",
                                                        children: "Nuevo Sellado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 873,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "Semi Nuevo",
                                                        children: "Semi Nuevo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 874,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "Usado",
                                                        children: "Usado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 875,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                        value: "Open Box",
                                                        children: "Open Box"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 876,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 872,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 870,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "STOCK"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 882,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                min: "0",
                                                placeholder: "Ej. 1",
                                                value: form.stock ?? 0,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        stock: Number(e.target.value)
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 883,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 881,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: theme.cyan,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                },
                                                children: "PUBLICAR EN CATÁLOGO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 895,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '16px',
                                                    borderRadius: '15px',
                                                    background: '#0b1426',
                                                    border: '1px solid #25335a',
                                                    color: 'white'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: !!form.publicado,
                                                        onChange: (e)=>setForm({
                                                                ...form,
                                                                publicado: e.target.checked
                                                            })
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 897,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '0.9rem'
                                                        },
                                                        children: form.publicado ? 'Visible' : 'Oculto'
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 902,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 896,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 894,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "MARCA"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 909,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. Apple",
                                                value: form.marca,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        marca: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 910,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 908,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "MODELO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 914,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. iPhone 15",
                                                value: form.modelo,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        modelo: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 915,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 913,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "COLOR"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 919,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. Azul Titanio",
                                                value: form.color,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        color: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 920,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 918,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "ALMACENAMIENTO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 924,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. 256Gb",
                                                value: form.almacenamiento,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        almacenamiento: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 925,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 923,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "IMEI / SERIE"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 929,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                placeholder: "Escanea o escribe...",
                                                value: form.imei,
                                                style: {
                                                    ...inputStyle,
                                                    fontFamily: 'monospace'
                                                },
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        imei: normalizarImei(e.target.value)
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 930,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 928,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "PRECIO VENTA"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 934,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                placeholder: "S/.",
                                                value: form.precio_venta,
                                                style: {
                                                    ...inputStyle,
                                                    borderColor: theme.orange
                                                },
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        precio_venta: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 935,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 933,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "PRECIO COSTO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 939,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                placeholder: "S/.",
                                                value: form.precio_costo,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        precio_costo: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 940,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 938,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "SALUD BATERÍA (%)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 944,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                placeholder: "Ej. 90",
                                                value: form.salud_bateria,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        salud_bateria: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 945,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 943,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "DESCRIPCIÓN"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 949,
                                                columnNumber: 11
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                placeholder: "Detalles...",
                                                value: form.descripcion,
                                                style: {
                                                    ...inputStyle,
                                                    minHeight: '100px',
                                                    resize: 'vertical'
                                                },
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        descripcion: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 950,
                                                columnNumber: 11
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 948,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginTop: '10px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '20px',
                                                flexWrap: 'wrap',
                                                backgroundColor: 'rgba(0,0,0,0.25)',
                                                padding: '20px',
                                                borderRadius: '20px',
                                                border: '2px dashed #25335a'
                                            },
                                            children: [
                                                form.imagen_url?.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'relative'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                src: url,
                                                                style: {
                                                                    width: '100px',
                                                                    height: '100px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '15px',
                                                                    border: `2px solid ${theme.cyan}`
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/inventario.js",
                                                                lineNumber: 957,
                                                                columnNumber: 17
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setForm({
                                                                        ...form,
                                                                        imagen_url: form.imagen_url.filter((_, idx)=>idx !== i)
                                                                    }),
                                                                style: {
                                                                    position: 'absolute',
                                                                    top: '-10px',
                                                                    right: '-10px',
                                                                    background: '#ff4b2b',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '50%',
                                                                    width: '25px',
                                                                    height: '25px',
                                                                    cursor: 'pointer'
                                                                },
                                                                children: "✕"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/inventario.js",
                                                                lineNumber: 958,
                                                                columnNumber: 17
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 956,
                                                        columnNumber: 15
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    style: {
                                                        width: '100px',
                                                        height: '100px',
                                                        border: `3px dashed ${theme.cyan}`,
                                                        borderRadius: '15px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '2rem',
                                                        color: theme.cyan
                                                    },
                                                    children: [
                                                        subiendo ? '⏳' : '+',
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "file",
                                                            multiple: true,
                                                            hidden: true,
                                                            onChange: manejarFotos
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 969,
                                                            columnNumber: 15
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 967,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 954,
                                            columnNumber: 11
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 953,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 869,
                                columnNumber: 7
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: guardar,
                                style: {
                                    width: '100%',
                                    padding: '25px',
                                    background: theme.orange,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    fontWeight: '900',
                                    fontSize: '1.2rem',
                                    marginTop: '40px',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 30px rgba(243, 156, 18, 0.3)'
                                },
                                children: editandoId ? 'CONFIRMAR CAMBIOS' : 'GUARDAR EQUIPO'
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 975,
                                columnNumber: 7
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 864,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        style: {
                            marginBottom: '20px',
                            paddingLeft: '20px',
                            borderLeft: `8px solid ${theme.cyan}`,
                            fontSize: '2rem'
                        },
                        children: [
                            "INVENTARIO (",
                            equipos.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 981,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 12,
                            flexWrap: 'wrap',
                            marginBottom: 18
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: filtroEstado,
                                onChange: (e)=>setFiltroEstado(e.target.value),
                                style: inputStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "TODOS",
                                        children: "Estado: Todos"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 984,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Nuevo Sellado",
                                        children: "Nuevo Sellado"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 985,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Semi Nuevo",
                                        children: "Semi Nuevo"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 986,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Usado",
                                        children: "Usado"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 987,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "Open Box",
                                        children: "Open Box"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 988,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 983,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: filtroPublicado,
                                onChange: (e)=>setFiltroPublicado(e.target.value),
                                style: inputStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "TODOS",
                                        children: "Publicación: Todos"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 992,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "PUBLICADO",
                                        children: "Solo publicados"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 993,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "OCULTO",
                                        children: "Solo ocultos"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 994,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 991,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: filtroVendidos,
                                onChange: (e)=>setFiltroVendidos(e.target.value),
                                style: inputStyle,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "TODOS",
                                        children: "Stock: Todos"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 998,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "DISPONIBLES",
                                        children: "Disponibles"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 999,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "VENDIDOS",
                                        children: "Vendidos"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1000,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 997,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 982,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "🔍 Buscar por IMEI, Marca, Modelo, Color...",
                        value: busqueda,
                        onChange: (e)=>setBusqueda(e.target.value),
                        style: {
                            width: '100%',
                            padding: '22px',
                            fontSize: '1.2rem',
                            borderRadius: '20px',
                            border: 'none',
                            background: '#162447',
                            color: 'white',
                            marginBottom: '40px',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                            outline: 'none'
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 1003,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '40px'
                        },
                        children: [
                            equiposFiltrados.map((cel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(TarjetaEquipo, {
                                    cel: cel,
                                    theme: theme,
                                    onOpenModal: setModalImagen,
                                    onEdit: (equipo)=>{
                                        setForm({
                                            ...estadoInicial,
                                            ...equipo,
                                            publicado: !!equipo.publicado
                                        });
                                        setEditandoId(equipo.id);
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth'
                                        });
                                    },
                                    onDelete: async (id)=>{
                                        if (confirm('¿Eliminar definitivamente?')) {
                                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').delete().eq('id', id);
                                            cargarEquipos();
                                        }
                                    },
                                    onSell: (cel)=>abrirModalVenta(cel)
                                }, cel.id, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 1006,
                                    columnNumber: 13
                                }, this)),
                            equiposFiltrados.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                style: {
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    color: '#888',
                                    fontSize: '1.5rem'
                                },
                                children: "No se encontraron resultados 🕵️‍♂️"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 1018,
                                columnNumber: 45
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 1004,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 60,
                            backgroundColor: theme.card,
                            padding: 30,
                            borderRadius: 24
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                style: {
                                    marginTop: 0,
                                    borderLeft: `8px solid ${theme.orange}`,
                                    paddingLeft: 16
                                },
                                children: "Ventas (últimas 100)"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 1022,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                    marginBottom: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            minWidth: 180
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    marginBottom: 6,
                                                    color: '#94a3b8'
                                                },
                                                children: "Desde"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1027,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: ventasDesde,
                                                onChange: (e)=>setVentasDesde(e.target.value),
                                                style: inputStyle
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1028,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1026,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            minWidth: 180
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    marginBottom: 6,
                                                    color: '#94a3b8'
                                                },
                                                children: "Hasta"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1037,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: ventasHasta,
                                                onChange: (e)=>setVentasHasta(e.target.value),
                                                style: inputStyle
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1038,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1036,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 10,
                                            alignItems: 'flex-end'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: cargarVentas,
                                                style: {
                                                    padding: '14px 16px',
                                                    borderRadius: 14,
                                                    border: 'none',
                                                    background: theme.cyan,
                                                    color: '#000',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                },
                                                children: "Aplicar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1047,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setVentasDesde('');
                                                    setVentasHasta('');
                                                    cargarVentas();
                                                },
                                                style: {
                                                    padding: '14px 16px',
                                                    borderRadius: 14,
                                                    border: `1px solid ${theme.cyan}44`,
                                                    background: 'transparent',
                                                    color: theme.cyan,
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                },
                                                children: "Limpiar"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1054,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1046,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 1025,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 16,
                                    flexWrap: 'wrap',
                                    marginBottom: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Total ventas: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                                children: [
                                                    "S/ ",
                                                    resumenVentas.totalVentas.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1069,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1069,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Total costo: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                                children: [
                                                    "S/ ",
                                                    resumenVentas.totalCosto.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1070,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1070,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "Ganancia: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                                children: [
                                                    "S/ ",
                                                    resumenVentas.totalGanancia.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1071,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1071,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            "# ventas: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                                children: resumenVentas.count
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1072,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 1072,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 1068,
                                columnNumber: 11
                            }, this),
                            cargandoVentas ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: "Cargando ventas..."
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 1077,
                                columnNumber: 13
                            }, this) : ventas.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    color: '#94a3b8'
                                },
                                children: "Aún no hay ventas registradas."
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 1079,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                style: {
                                    overflowX: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                    style: {
                                        width: '100%',
                                        borderCollapse: 'collapse'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid rgba(255,255,255,0.15)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: 10
                                                        },
                                                        children: "Fecha"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 1085,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: 10
                                                        },
                                                        children: "Equipo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 1086,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: 10
                                                        },
                                                        children: "IMEI"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 1087,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: 10
                                                        },
                                                        children: "Final"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 1088,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: 10
                                                        },
                                                        children: "Costo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 1089,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                        style: {
                                                            padding: 10
                                                        },
                                                        children: "Ganancia"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 1090,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 1084,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 1083,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                            children: ventas.map((v)=>{
                                                const costo = Number(v?.Celulares?.precio_costo ?? 0);
                                                const final = Number(v?.precio_final ?? 0);
                                                const ganancia = final - costo;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        borderBottom: '1px solid rgba(255,255,255,0.08)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: 10
                                                            },
                                                            children: v.vendido_en ? new Date(v.vendido_en).toLocaleString() : '—'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 1100,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: 10
                                                            },
                                                            children: [
                                                                v?.Celulares?.marca,
                                                                " ",
                                                                v?.Celulares?.modelo
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 1101,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: 10,
                                                                fontFamily: 'monospace',
                                                                color: '#94a3b8'
                                                            },
                                                            children: v?.Celulares?.imei || 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 1102,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: 10
                                                            },
                                                            children: [
                                                                "S/ ",
                                                                final.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 1103,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: 10
                                                            },
                                                            children: [
                                                                "S/ ",
                                                                costo.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 1104,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: 10,
                                                                color: ganancia >= 0 ? '#7CFC98' : '#ff6b6b'
                                                            },
                                                            children: [
                                                                "S/ ",
                                                                ganancia.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 1105,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, v.id, true, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 1099,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 1093,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 1082,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 1081,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 1021,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 857,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 739,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__5ea686ae._.js.map