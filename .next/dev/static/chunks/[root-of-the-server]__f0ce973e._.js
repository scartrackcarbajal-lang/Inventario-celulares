(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/lib/supabase.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [client] (ecmascript) <locals>");
;
const supabaseUrl = 'https://lptiwrdmvxyisaixnuel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdGl3cmRtdnh5aXNhaXhudWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDI0MDIsImV4cCI6MjA4MzY3ODQwMn0.iotGFhBfo2Fjvj9LhEk-z1CpCaM7wrZINrfDn0uGzD8';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/inventario.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Inventario
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
// --- COMPONENTE TARJETA (Angosta, Vertical + Zoom al hacer clic) ---
// Recibe la nueva propiedad "onOpenModal" para activar el zoom
function TarjetaEquipo({ cel, onEdit, onDelete, theme, onOpenModal }) {
    _s();
    const [fotoActiva, setFotoActiva] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x250?text=Sin+Foto');
    // Colores para la etiqueta de estado
    const colorEstado = {
        'Nuevo Sellado': '#00d2ff',
        'Semi Nuevo': '#f39c12',
        'Usado': '#e74c3c',
        'Open Box': '#f39c12' // Naranja
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            backgroundColor: theme.card,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `2px solid ${theme.cyan}`,
            boxShadow: `0 0 15px ${theme.cyan}44, inset 0 0 10px ${theme.cyan}22`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            position: 'relative',
            // --- CAMBIO CLAVE: Hacemos la tarjeta más angosta y centrada ---
            maxWidth: '360px',
            margin: '0 auto'
        },
        onMouseEnter: (e)=>{
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = `0 0 30px ${theme.cyan}66, inset 0 0 20px ${theme.cyan}33`;
        },
        onMouseLeave: (e)=>{
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 0 15px ${theme.cyan}44, inset 0 0 10px ${theme.cyan}22`;
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: '220px',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#050a14'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        lineNumber: 39,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            padding: '10px',
                            cursor: 'zoom-in' // Icono de lupa
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                            lineNumber: 50,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 42,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            cel.imagen_url && cel.imagen_url.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '6px',
                    padding: '8px 15px',
                    backgroundColor: '#0b1426',
                    overflowX: 'auto',
                    borderBottom: `1px solid ${theme.cyan}11`,
                    zIndex: 4,
                    position: 'relative'
                },
                children: cel.imagen_url.map((url, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: url,
                        onClick: ()=>setFotoActiva(url),
                        style: {
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '6px',
                            border: fotoActiva === url ? `2px solid ${theme.orange}` : `1px solid transparent`,
                            cursor: 'pointer',
                            opacity: fotoActiva === url ? 1 : 0.5,
                            transition: 'all 0.2s'
                        }
                    }, index, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 58,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 56,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '15px 20px',
                    background: theme.card,
                    position: 'relative',
                    zIndex: 4
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    margin: 0,
                                    fontSize: '1.3rem',
                                    color: 'white',
                                    fontWeight: '800',
                                    letterSpacing: '0.5px'
                                },
                                children: [
                                    cel.marca,
                                    " ",
                                    cel.modelo
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 67,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    backgroundColor: colorEstado[cel.estado] || '#888',
                                    color: 'white',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase'
                                },
                                children: cel.estado
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: theme.cyan,
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginBottom: '10px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "💾 ",
                                    cel.almacenamiento
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this),
                            cel.salud_bateria && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            opacity: 0.3
                                        },
                                        children: "|"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 73,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "🔋 ",
                                            cel.salud_bateria,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 73,
                                        columnNumber: 77
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    cel.color && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '10px',
                            display: 'inline-block',
                            padding: '5px 10px',
                            borderRadius: '8px',
                            border: `1px solid ${theme.cyan}44`,
                            backgroundColor: 'rgba(0, 210, 255, 0.05)',
                            color: '#fff',
                            fontSize: '0.85rem'
                        },
                        children: [
                            "🎨 Color: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 'bold',
                                    color: theme.cyan
                                },
                                children: cel.color
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 78,
                                columnNumber: 27
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 77,
                        columnNumber: 13
                    }, this),
                    cel.imei && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '0.7rem',
                            color: '#666',
                            fontFamily: 'monospace',
                            marginBottom: '8px'
                        },
                        children: [
                            "IMEI: ",
                            cel.imei
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 82,
                        columnNumber: 23
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'block',
                                            fontSize: '0.65rem',
                                            color: '#888',
                                            marginBottom: '2px'
                                        },
                                        children: "PRECIO"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 86,
                                        columnNumber: 14
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: 'white',
                                            fontSize: '1.6rem',
                                            fontWeight: '900'
                                        },
                                        children: [
                                            "S/ ",
                                            cel.precio_venta
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 87,
                                        columnNumber: 14
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onEdit(cel),
                                        style: {
                                            padding: '8px 16px',
                                            background: theme.cyan,
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '50px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            boxShadow: '0 4px 10px rgba(0,210,255,0.2)'
                                        },
                                        children: "EDITAR"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onDelete(cel.id),
                                        style: {
                                            width: '36px',
                                            height: '36px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: '#2d1a1a',
                                            color: '#ff6b6b',
                                            border: '1px solid #ff6b6b44',
                                            borderRadius: '50%',
                                            cursor: 'pointer'
                                        },
                                        children: "🗑️"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 64,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(TarjetaEquipo, "XA4xeh7Z4PgCqkP68zgwukebfEU=");
_c = TarjetaEquipo;
function Inventario() {
    _s1();
    const [equipos, setEquipos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [busqueda, setBusqueda] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [subiendo, setSubiendo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editandoId, setEditandoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notificacion, setNotificacion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        mensaje: '',
        visible: false,
        color: '#00d2ff'
    });
    // NUEVO ESTADO PARA EL ZOOM (Lightbox)
    const [modalImagen, setModalImagen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Seguridad
    const [autorizado, setAutorizado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [passwordInput, setPasswordInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const CLAVE_SECRETA = "carsal11";
    const verificarClave = ()=>{
        if (passwordInput === CLAVE_SECRETA) {
            setAutorizado(true);
            localStorage.setItem('farrus_auth', 'true');
        } else {
            avisar("⚠️ Clave incorrecta", "#ff4b2b");
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Inventario.useEffect": ()=>{
            if (localStorage.getItem('farrus_auth') === 'true') setAutorizado(true);
        }
    }["Inventario.useEffect"], []);
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
        imagen_url: []
    };
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(estadoInicial);
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
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').select('*').order('created_at', {
            ascending: false
        });
        setEquipos(data || []);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Inventario.useEffect": ()=>{
            if (autorizado) cargarEquipos();
        }
    }["Inventario.useEffect"], [
        autorizado
    ]);
    const manejarFotos = async (e)=>{
        const archivos = Array.from(e.target.files);
        setSubiendo(true);
        let nuevasUrls = [
            ...form.imagen_url || []
        ];
        for (const archivo of archivos){
            const nombre = `${Date.now()}_${archivo.name}`;
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').upload(nombre, archivo);
            if (!error) {
                const { data: u } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').getPublicUrl(nombre);
                nuevasUrls.push(u.publicUrl);
            }
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
        if (editandoId) {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').update(datosLimpios).eq('id', editandoId);
            if (error) avisar('Error: ' + error.message, 'red');
            else {
                setEditandoId(null);
                avisar("✅ Actualizado correctamente");
            }
        } else {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').insert([
                datosLimpios
            ]);
            if (error) avisar('Error: ' + error.message, 'red');
            else {
                avisar("🚀 Equipo registrado");
            }
        }
        setForm(estadoInicial);
        cargarEquipos();
    };
    // Lógica de BUSCADOR
    const equiposFiltrados = equipos.filter((cel)=>{
        const texto = busqueda.toLowerCase();
        return cel.marca?.toLowerCase().includes(texto) || cel.modelo?.toLowerCase().includes(texto) || cel.estado?.toLowerCase().includes(texto) || cel.imei?.toLowerCase().includes(texto) || cel.color?.toLowerCase().includes(texto);
    });
    // --- LOGIN ---
    if (!autorizado) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: theme.card,
                    padding: '50px 40px',
                    borderRadius: '35px',
                    textAlign: 'center',
                    border: `2px solid ${theme.cyan}`,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    width: '90%',
                    maxWidth: '400px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        style: {
                            fontSize: '2.5rem',
                            margin: '0 0 10px',
                            fontWeight: '900',
                            color: 'white'
                        },
                        children: [
                            "LOS FARRUS ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: theme.orange
                                },
                                children: "HUB"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 194,
                                columnNumber: 112
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: theme.cyan,
                            marginBottom: '35px',
                            letterSpacing: '2px',
                            fontSize: '0.9rem'
                        },
                        children: "PANEL DE GESTIÓN"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "password",
                        placeholder: "Escribe la clave...",
                        value: passwordInput,
                        onChange: (e)=>setPasswordInput(e.target.value),
                        onKeyDown: (e)=>e.key === 'Enter' && verificarClave(),
                        style: {
                            width: '100%',
                            padding: '20px',
                            borderRadius: '15px',
                            border: 'none',
                            backgroundColor: '#0b1426',
                            color: 'white',
                            marginBottom: '25px',
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: verificarClave,
                        style: {
                            width: '100%',
                            padding: '20px',
                            background: theme.orange,
                            color: 'white',
                            border: 'none',
                            borderRadius: '15px',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(243, 156, 18, 0.3)'
                        },
                        children: "ACCEDER AHORA 🔑"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 193,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 192,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: '100vh',
            background: theme.gradient,
            padding: '50px 20px',
            color: 'white',
            fontFamily: 'sans-serif'
        },
        children: [
            notificacion.visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                lineNumber: 212,
                columnNumber: 32
            }, this),
            modalImagen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                    lineNumber: 224,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 216,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: '1400px',
                    margin: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        style: {
                            textAlign: 'center',
                            marginBottom: '60px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: '3.5rem',
                                    fontWeight: '900',
                                    margin: 0
                                },
                                children: [
                                    "LOS FARRUS ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: theme.orange
                                        },
                                        children: "HUB"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 233,
                                        columnNumber: 87
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setAutorizado(false);
                                    localStorage.removeItem('farrus_auth');
                                },
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
                                lineNumber: 234,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: theme.card,
                            padding: '50px',
                            borderRadius: '40px',
                            marginBottom: '80px',
                            border: '1px solid rgba(0,210,255,0.15)',
                            boxShadow: '0 40px 90px rgba(0,0,0,0.4)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    marginBottom: '40px',
                                    borderLeft: `8px solid ${theme.orange}`,
                                    paddingLeft: '20px',
                                    fontSize: '1.8rem'
                                },
                                children: editandoId ? '📝 EDITAR EQUIPO' : '📦 NUEVO INGRESO'
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                    gap: '25px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: theme.cyan,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold'
                                                },
                                                children: "ESTADO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 243,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: form.estado,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        estado: e.target.value
                                                    }),
                                                style: inputStyle,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Nuevo Sellado",
                                                        children: "Nuevo Sellado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 245,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Semi Nuevo",
                                                        children: "Semi Nuevo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 246,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Usado",
                                                        children: "Usado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 247,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "Open Box",
                                                        children: "Open Box"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 248,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 242,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "MARCA"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 251,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. Apple",
                                                value: form.marca,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        marca: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 251,
                                                columnNumber: 102
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 251,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "MODELO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 252,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. iPhone 15",
                                                value: form.modelo,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        modelo: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 252,
                                                columnNumber: 103
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 252,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "COLOR"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 253,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. Azul Titanio",
                                                value: form.color,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        color: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 253,
                                                columnNumber: 102
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 253,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "ALMACENAMIENTO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 254,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Ej. 256Gb",
                                                value: form.almacenamiento,
                                                style: inputStyle,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        almacenamiento: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 254,
                                                columnNumber: 111
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "IMEI / SERIE"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 255,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                placeholder: "Escanea o escribe...",
                                                value: form.imei,
                                                style: {
                                                    ...inputStyle,
                                                    fontFamily: 'monospace'
                                                },
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        imei: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 255,
                                                columnNumber: 109
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 255,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "PRECIO VENTA"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 256,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                lineNumber: 256,
                                                columnNumber: 109
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "PRECIO COSTO"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 257,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                lineNumber: 257,
                                                columnNumber: 109
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 257,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "SALUD BATERÍA (%)"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 258,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                lineNumber: 258,
                                                columnNumber: 114
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: '1 / -1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    marginLeft: '10px',
                                                    color: '#888',
                                                    fontSize: '0.8rem'
                                                },
                                                children: "DESCRIPCIÓN"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 259,
                                                columnNumber: 51
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
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
                                                lineNumber: 259,
                                                columnNumber: 141
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: '1 / -1',
                                            marginTop: '10px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                form.imagen_url?.map((url, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'relative'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                                                                lineNumber: 264,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                lineNumber: 265,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 263,
                                                        columnNumber: 19
                                                    }, this)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "file",
                                                            multiple: true,
                                                            hidden: true,
                                                            onChange: manejarFotos
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 268,
                                                            columnNumber: 269
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 268,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                lineNumber: 272,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: '40px'
                        },
                        children: [
                            equiposFiltrados.map((cel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TarjetaEquipo, {
                                    cel: cel,
                                    theme: theme,
                                    // Pasamos la función para abrir el zoom 
                                    onOpenModal: setModalImagen,
                                    onEdit: (equipo)=>{
                                        setForm(equipo);
                                        setEditandoId(equipo.id);
                                        window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth'
                                        });
                                    },
                                    onDelete: async (id)=>{
                                        if (confirm('¿Eliminar definitivamente?')) {
                                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('Celulares').delete().eq('id', id);
                                            cargarEquipos();
                                        }
                                    }
                                }, cel.id, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this)),
                            equiposFiltrados.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    gridColumn: '1 / -1',
                                    textAlign: 'center',
                                    color: '#888',
                                    fontSize: '1.5rem'
                                },
                                children: "No se encontraron resultados 🕵️‍♂️"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 288,
                                columnNumber: 45
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 231,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
_s1(Inventario, "md9Us9ggVo/eKpAkz5CzchrotwI=");
_c1 = Inventario;
var _c, _c1;
__turbopack_context__.k.register(_c, "TarjetaEquipo");
__turbopack_context__.k.register(_c1, "Inventario");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/inventario.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/inventario";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/inventario.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/pages/inventario\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/inventario.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f0ce973e._.js.map