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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://lptiwrdmvxyisaixnuel.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdGl3cmRtdnh5aXNhaXhudWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMDI0MDIsImV4cCI6MjA4MzY3ODQwMn0.iotGFhBfo2Fjvj9LhEk-z1CpCaM7wrZINrfDn0uGzD8");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
// ==========================================
// 🎨 ESTILOS PREMIUM (CSS-IN-JS)
// ==========================================
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#020617',
        color: '#e2e8f0',
        fontFamily: "'Inter', sans-serif",
        backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 100%)`,
        backgroundAttachment: 'fixed'
    },
    glassPanel: {
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
    },
    goldText: {
        background: 'linear-gradient(to right, #F59E0B, #D97706)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '900'
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white',
        outline: 'none',
        fontSize: '0.95rem',
        transition: 'all 0.2s'
    },
    label: {
        display: 'block',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: 'bold',
        color: '#94a3b8',
        marginBottom: '6px'
    },
    btnPrimary: {
        background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
        transition: 'transform 0.2s'
    },
    btnIcon: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.05)',
        color: '#cbd5e1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px'
    },
    statCard: {
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
    }
};
// ==========================================
// 🎨 ICONOS SVG
// ==========================================
const Icons = {
    Logo: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 2L2 7L12 12L22 7L12 2Z",
                    stroke: "#F59E0B",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 92,
                    columnNumber: 75
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M2 17L12 22L22 17",
                    stroke: "#F59E0B",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 92,
                    columnNumber: 168
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M2 12L12 17L22 12",
                    stroke: "#F59E0B",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 92,
                    columnNumber: 252
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 92,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
    Search: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "11",
                    cy: "11",
                    r: "8"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 93,
                    columnNumber: 115
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "m21 21-4.3-4.3"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 93,
                    columnNumber: 146
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 93,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    Plus: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M5 12h14"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 94,
                    columnNumber: 113
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 5v14"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 94,
                    columnNumber: 133
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 94,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
    Smartphone: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                    x: "5",
                    y: "2",
                    width: "14",
                    height: "20",
                    rx: "2"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 95,
                    columnNumber: 119
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 18h.01"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 95,
                    columnNumber: 168
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 95,
            columnNumber: 21
        }, ("TURBOPACK compile-time value", void 0)),
    Chart: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 3v18h18"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 96,
                    columnNumber: 114
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M18 17V9"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 96,
                    columnNumber: 136
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M13 17V5"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 96,
                    columnNumber: 156
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 17v-3"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 96,
                    columnNumber: 176
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 96,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    Headphones: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 97,
                    columnNumber: 119
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 97,
                    columnNumber: 171
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 14V8a9 9 0 0 0-9-9 9 9 0 0 0-9 9v6"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 97,
                    columnNumber: 224
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 97,
            columnNumber: 21
        }, ("TURBOPACK compile-time value", void 0)),
    Dollar: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 1v22"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 98,
                    columnNumber: 115
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 98,
                    columnNumber: 135
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 98,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    Box: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 99,
                    columnNumber: 112
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "3.27 6.96 12 12.01 20.73 6.96"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 99,
                    columnNumber: 245
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    x2: "12",
                    y1: "22.08",
                    y2: "12"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 99,
                    columnNumber: 295
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 99,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0)),
    Check: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "20 6 9 17 4 12"
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 100,
                columnNumber: 114
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 100,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    Edit: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 101,
                columnNumber: 113
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 101,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0)),
    Trash: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M3 6h18"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 102,
                    columnNumber: 114
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 102,
                    columnNumber: 133
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 102,
                    columnNumber: 185
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 102,
            columnNumber: 16
        }, ("TURBOPACK compile-time value", void 0)),
    Upload: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 103,
                    columnNumber: 115
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                    points: "17 8 12 3 7 8"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 103,
                    columnNumber: 168
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: "12",
                    x2: "12",
                    y1: "3",
                    y2: "15"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 103,
                    columnNumber: 202
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 103,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)),
    Eye: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 104,
                    columnNumber: 112
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "3"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 104,
                    columnNumber: 168
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 104,
            columnNumber: 14
        }, ("TURBOPACK compile-time value", void 0)),
    Info: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "18",
            height: "18",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "12",
                    cy: "12",
                    r: "10"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 105,
                    columnNumber: 113
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 16v-4"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 105,
                    columnNumber: 145
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 8h.01"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 105,
                    columnNumber: 166
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 105,
            columnNumber: 15
        }, ("TURBOPACK compile-time value", void 0))
};
// ==========================================
// COMPONENTES UI
// ==========================================
const StatCard = ({ label, value, subtext, color = '#F59E0B', icon })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.statCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '20px',
                    opacity: 0.1,
                    color: color
                },
                children: icon
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 114,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 117,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                style: {
                    fontSize: '2rem',
                    fontWeight: '900',
                    color: 'white',
                    margin: 0,
                    lineHeight: 1
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 118,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            subtext && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: '0.8rem',
                    color: color,
                    marginTop: '8px',
                    fontWeight: '500'
                },
                children: subtext
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 119,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 113,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = StatCard;
const DetallesModal = ({ cel, onClose })=>{
    if (!cel) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            padding: '20px'
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                ...styles.glassPanel,
                width: '100%',
                maxWidth: '600px',
                padding: '0',
                overflow: 'hidden',
                backgroundColor: '#0f172a'
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        height: '300px',
                        background: '#020617',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: cel.imagen_url?.[0] || 'https://via.placeholder.com/400',
                            style: {
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                padding: '20px'
                            }
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 129,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            style: {
                                position: 'absolute',
                                top: 15,
                                right: 15,
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                color: 'white',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                cursor: 'pointer'
                            },
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 130,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 128,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '30px',
                        maxHeight: '50vh',
                        overflowY: 'auto'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: '20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#F59E0B',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            },
                                            children: cel.marca
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 135,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            style: {
                                                fontSize: '2rem',
                                                fontWeight: '900',
                                                color: 'white',
                                                margin: 0
                                            },
                                            children: cel.modelo
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 136,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: 'right'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '1.5rem',
                                                fontWeight: '900',
                                                color: 'white'
                                            },
                                            children: [
                                                "S/ ",
                                                cel.precio_venta
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 139,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '0.8rem',
                                                color: '#64748b'
                                            },
                                            children: [
                                                "Costo: S/ ",
                                                cel.precio_costo
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 140,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 133,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '25px',
                                background: 'rgba(255,255,255,0.03)',
                                padding: '20px',
                                borderRadius: '16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.8rem',
                                                display: 'block'
                                            },
                                            children: "IMEI / Serial"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 145,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'white',
                                                fontFamily: 'monospace'
                                            },
                                            children: cel.imei
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 145,
                                            columnNumber: 110
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.8rem',
                                                display: 'block'
                                            },
                                            children: "Estado"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 146,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#F59E0B',
                                                fontWeight: 'bold'
                                            },
                                            children: cel.estado
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 146,
                                            columnNumber: 103
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.8rem',
                                                display: 'block'
                                            },
                                            children: "Color"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 147,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'white'
                                            },
                                            children: cel.color
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 147,
                                            columnNumber: 102
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.8rem',
                                                display: 'block'
                                            },
                                            children: "Batería"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 148,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'white'
                                            },
                                            children: [
                                                cel.salud_bateria,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 148,
                                            columnNumber: 104
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 148,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: '#64748b',
                                                fontSize: '0.8rem',
                                                display: 'block'
                                            },
                                            children: "Capacidad"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 149,
                                            columnNumber: 18
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: 'white'
                                            },
                                            children: cel.almacenamiento
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 149,
                                            columnNumber: 106
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 144,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        cel.descripcion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '20px',
                                background: 'rgba(255,255,255,0.02)',
                                padding: '15px',
                                borderRadius: '12px',
                                borderLeft: '3px solid #F59E0B'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#94a3b8',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        marginBottom: '5px'
                                    },
                                    children: "Notas / Detalles"
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#cbd5e1',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-wrap'
                                    },
                                    children: cel.descripcion
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 155,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 153,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            style: {
                                width: '100%',
                                padding: '14px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: '0.2s'
                            },
                            children: "Cerrar Ficha"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 159,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 132,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 127,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 126,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = DetallesModal;
function ProductCard({ cel, onEdit, onDelete, onSell, onVerDetalle, onOpenModal }) {
    _s();
    const [fotoActiva, setFotoActiva] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(cel.imagen_url?.[0] || 'https://via.placeholder.com/400x300/0f172a/334155?text=No+Image');
    const vendido = Number(cel.stock) <= 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            ...styles.glassPanel,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            opacity: vendido ? 0.6 : 1,
            transition: 'transform 0.3s',
            cursor: 'default'
        },
        onMouseEnter: (e)=>e.currentTarget.style.transform = 'translateY(-5px)',
        onMouseLeave: (e)=>e.currentTarget.style.transform = 'translateY(0)',
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    height: '240px',
                    backgroundColor: '#020617',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'zoom-in'
                },
                onClick: ()=>onOpenModal(fotoActiva),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: fotoActiva,
                        style: {
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '20px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.65rem',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            color: '#F59E0B',
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                        },
                        children: cel.estado
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    !cel.publicado && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            color: '#94a3b8',
                            border: '1px solid rgba(255,255,255,0.1)'
                        },
                        children: "Oculto"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    vendido && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(2px)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                border: '3px solid #ef4444',
                                color: '#ef4444',
                                padding: '8px 20px',
                                borderRadius: '12px',
                                fontSize: '1.2rem',
                                fontWeight: '900',
                                transform: 'rotate(-12deg)',
                                backgroundColor: '#020617'
                            },
                            children: "VENDIDO"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 209,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    color: '#F59E0B',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px'
                                },
                                children: cel.marca
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 217,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '1.2rem',
                                    fontWeight: '800',
                                    color: 'white',
                                    margin: 0,
                                    lineHeight: 1.2
                                },
                                children: cel.modelo
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.75rem',
                                    color: '#94a3b8',
                                    marginBottom: '4px',
                                    borderBottom: '1px dashed rgba(255,255,255,0.1)',
                                    paddingBottom: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "IMEI"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'monospace',
                                            color: '#cbd5e1'
                                        },
                                        children: cel.imei
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 224,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.75rem',
                                    color: '#94a3b8'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Inversión"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 227,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: '#cbd5e1'
                                        },
                                        children: [
                                            "S/ ",
                                            cel.precio_costo
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 227,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 226,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 222,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            marginBottom: '20px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    textAlign: 'center'
                                },
                                children: [
                                    "💾 ",
                                    cel.almacenamiento
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    color: '#cbd5e1',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    textAlign: 'center'
                                },
                                children: [
                                    "🎨 ",
                                    cel.color
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: 'auto',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '0.65rem',
                                            fontWeight: 'bold',
                                            color: '#64748b',
                                            textTransform: 'uppercase'
                                        },
                                        children: "VENTA"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 242,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '1.4rem',
                                            fontWeight: '900',
                                            color: 'white'
                                        },
                                        children: [
                                            "S/ ",
                                            cel.precio_venta
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 243,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onVerDetalle(cel),
                                        style: {
                                            ...styles.btnIcon,
                                            color: '#38bdf8',
                                            borderColor: 'rgba(56, 189, 248, 0.3)'
                                        },
                                        title: "Ver Detalles",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Eye, {}, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 246,
                                            columnNumber: 164
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onEdit(cel),
                                        style: styles.btnIcon,
                                        title: "Editar",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Edit, {}, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 247,
                                            columnNumber: 87
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 247,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>!vendido && onSell(cel),
                                        disabled: vendido,
                                        style: {
                                            ...styles.btnIcon,
                                            backgroundColor: vendido ? 'transparent' : 'rgba(245, 158, 11, 0.1)',
                                            color: vendido ? '#475569' : '#F59E0B',
                                            borderColor: vendido ? 'transparent' : 'rgba(245, 158, 11, 0.3)'
                                        },
                                        title: "Vender",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Dollar, {}, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 248,
                                            columnNumber: 301
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onDelete(cel.id),
                                        style: {
                                            ...styles.btnIcon,
                                            color: '#ef4444',
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            borderColor: 'rgba(239, 68, 68, 0.2)'
                                        },
                                        title: "Eliminar",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Trash, {}, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 249,
                                            columnNumber: 201
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 215,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 171,
        columnNumber: 5
    }, this);
}
_s(ProductCard, "bXnnnmXi/WD4ppprPRLtHAEH8/s=");
_c2 = ProductCard;
function Inventario() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // --- ESTADOS ---
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('inventory') // 'inventory', 'sales', 'register'
    ;
    const [equipos, setEquipos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [busqueda, setBusqueda] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [subiendo, setSubiendo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editandoId, setEditandoId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editandoSkuId, setEditandoSkuId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [notificacion, setNotificacion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        mensaje: '',
        visible: false,
        type: 'success'
    });
    const [modalImagen, setModalImagen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [detalleModalOpen, setDetalleModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Auth & Ventas
    const [autorizado, setAutorizado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [cargandoLogin, setCargandoLogin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loginError, setLoginError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [ventaModalAbierto, setVentaModalAbierto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ventaCel, setVentaCel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [ventaForm, setVentaForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        precio_final: '',
        cliente_nombre: '',
        cliente_telefono: ''
    });
    const [guardandoVenta, setGuardandoVenta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ventas, setVentas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [ventasDesde, setVentasDesde] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [ventasHasta, setVentasHasta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [cargandoVentas, setCargandoVentas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Filtros
    const [filtroEstado, setFiltroEstado] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('TODOS');
    const [filtroVendidos, setFiltroVendidos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('TODOS');
    // Formulario
    const estadoInicial = {
        marca: '',
        modelo: '',
        estado: 'Nuevo Sellado',
        serial: '',
        color: '',
        almacenamiento: '',
        salud_bateria: '',
        descripcion: '',
        precio_venta: '',
        precio_costo: '',
        publicado: true,
        imagen_url: []
    };
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(estadoInicial);
    // --- HELPERS ---
    const normalizarSerial = (v)=>String(v || '').trim().replace(/\s+/g, '').toUpperCase().slice(0, 30);
    const avisar = (msg, type = 'success')=>{
        setNotificacion({
            mensaje: msg,
            visible: true,
            type
        });
        setTimeout(()=>setNotificacion((prev)=>({
                    ...prev,
                    visible: false
                })), 3000);
    };
    const inicioDelDiaISO = (d)=>d ? new Date(`${d}T00:00:00`).toISOString() : null;
    const finDelDiaISO = (d)=>d ? new Date(`${d}T23:59:59.999`).toISOString() : null;
    // --- EFFECTS ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Inventario.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession().then({
                "Inventario.useEffect": ({ data })=>setAutorizado(!!data.session)
            }["Inventario.useEffect"]);
            const { data: sub } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "Inventario.useEffect": (_e, session)=>setAutorizado(!!session)
            }["Inventario.useEffect"]);
            return ({
                "Inventario.useEffect": ()=>sub.subscription.unsubscribe()
            })["Inventario.useEffect"];
        }
    }["Inventario.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Inventario.useEffect": ()=>{
            if (autorizado) {
                cargarEquipos();
                cargarVentas();
            }
        }
    }["Inventario.useEffect"], [
        autorizado
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Inventario.useEffect": ()=>{
            if (autorizado) cargarVentas();
        }
    }["Inventario.useEffect"], [
        autorizado,
        ventasDesde,
        ventasHasta
    ]);
    // --- LOGIC ---
    const login = async ()=>{
        if (!email || !password) return;
        setCargandoLogin(true);
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
            email,
            password
        });
        setCargandoLogin(false);
        if (error) setLoginError(error.message);
    };
    const logout = async ()=>{
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
    };
    const cargarEquipos = async ()=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('items_serializados').select(`id, sku_id, serial, estado, salud_bateria, almacenamiento, color, imagen_url, vendido, costo_compra, created_at, skus:sku_id ( id, sku_codigo, tracking, precio_venta, precio_costo, publicado, productos:producto_id ( id, marca, nombre, descripcion ) )`).order('created_at', {
            ascending: false
        });
        if (error) return avisar('Error cargando inventario', 'error');
        setEquipos((data || []).map((row)=>({
                id: row.id,
                marca: row?.skus?.productos?.marca || '',
                modelo: row?.skus?.productos?.nombre || '',
                estado: row.estado,
                imei: row.serial,
                precio_venta: row?.skus?.precio_venta || 0,
                precio_costo: row.costo_compra ? Number(row.costo_compra) : row?.skus?.precio_costo ?? 0,
                almacenamiento: row.almacenamiento,
                salud_bateria: row.salud_bateria,
                color: row.color,
                imagen_url: row.imagen_url,
                publicado: row?.skus?.publicado ?? false,
                stock: row.vendido ? 0 : 1,
                descripcion: row?.skus?.productos?.descripcion || '',
                _raw: row
            })));
    };
    const cargarVentas = async ()=>{
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('ventas_v2').select(`id, precio_lista, precio_final, descuento, cliente_nombre, cliente_telefono, cantidad, tipo_venta, vendido_en, vendido_por, item_serializado_id, sku_id, items_serializados:item_serializado_id ( serial, costo_compra ), skus:sku_id ( id, precio_costo, productos:producto_id ( marca, nombre ) )`).order('vendido_en', {
            ascending: false
        }).limit(300);
        if (ventasDesde) query = query.gte('vendido_en', inicioDelDiaISO(ventasDesde));
        if (ventasHasta) query = query.lte('vendido_en', finDelDiaISO(ventasHasta));
        const { data, error } = await query;
        if (error) return avisar('Error cargando ventas', 'error');
        setVentas(data || []);
    };
    const manejarFotos = async (e)=>{
        const archivos = Array.from(e.target.files || []);
        if (!archivos.length) return;
        setSubiendo(true);
        let nuevas = [
            ...form.imagen_url || []
        ];
        for (const file of archivos){
            const name = `${Date.now()}_${file.name}`;
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').upload(name, file);
            if (!error) {
                const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('Celulares - fotos').getPublicUrl(name);
                nuevas.push(data.publicUrl);
            }
        }
        setForm({
            ...form,
            imagen_url: nuevas
        });
        setSubiendo(false);
        avisar('Fotos subidas con éxito');
    };
    const asegurarCategoriaId = async (nombre)=>{
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('categorias').select('id').eq('nombre', nombre).maybeSingle();
        if (data) return data.id;
        const { data: neu } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('categorias').insert({
            nombre
        }).select('id').single();
        return neu.id;
    };
    const asegurarProductoId = async ({ categoriaId, marca, modelo, descripcion })=>{
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('productos').select('id').eq('categoria_id', categoriaId).eq('marca', marca).eq('nombre', modelo).maybeSingle();
        if (data) return data.id;
        const { data: neu } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('productos').insert({
            categoria_id: categoriaId,
            marca,
            nombre: modelo,
            descripcion,
            activo: true
        }).select('id').single();
        return neu.id;
    };
    const crearSku = async ({ productoId, precio_venta, precio_costo, publicado })=>{
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('skus').insert({
            producto_id: productoId,
            sku_codigo: `CEL-${productoId}-${Date.now()}`,
            tracking: 'SERIAL',
            precio_venta,
            precio_costo,
            publicado: !!publicado
        }).select('id').single();
        return data.id;
    };
    const guardar = async ()=>{
        try {
            const serial = normalizarSerial(form.serial);
            if (!form.marca || !form.modelo || !serial) return avisar('Faltan datos obligatorios', 'error');
            if (editandoId) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('items_serializados').update({
                    serial,
                    estado: form.estado,
                    salud_bateria: form.salud_bateria,
                    almacenamiento: form.almacenamiento,
                    color: form.color,
                    imagen_url: form.imagen_url,
                    costo_compra: form.precio_costo
                }).eq('id', editandoId);
                if (editandoSkuId) {
                    const { data: skuData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('skus').select('producto_id').eq('id', editandoSkuId).single();
                    if (skuData) await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('productos').update({
                        descripcion: form.descripcion
                    }).eq('id', skuData.producto_id);
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('skus').update({
                        precio_venta: form.precio_venta,
                        precio_costo: form.precio_costo,
                        publicado: form.publicado
                    }).eq('id', editandoSkuId);
                }
                avisar('Equipo actualizado');
                setEditandoId(null);
            } else {
                const catId = await asegurarCategoriaId('Celulares');
                const prodId = await asegurarProductoId({
                    categoriaId: catId,
                    marca: form.marca,
                    modelo: form.modelo,
                    descripcion: form.descripcion
                });
                const skuId = await crearSku({
                    productoId: prodId,
                    precio_venta: form.precio_venta,
                    precio_costo: form.precio_costo,
                    publicado: form.publicado
                });
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('items_serializados').insert({
                    sku_id: sku.id,
                    serial,
                    estado: form.estado,
                    salud_bateria: form.salud_bateria,
                    almacenamiento: form.almacenamiento,
                    color: form.color,
                    vendido: false,
                    imagen_url: form.imagen_url,
                    costo_compra: form.precio_costo
                });
                avisar('Equipo registrado');
            }
            setForm(estadoInicial);
            cargarEquipos();
        } catch (e) {
            avisar(e.message, 'error');
        }
    };
    const confirmarVenta = async ()=>{
        if (!ventaCel) return;
        const precioFinal = Number(ventaForm.precio_final);
        if (!precioFinal) return avisar('Falta precio', 'error');
        setGuardandoVenta(true);
        const { data: sess } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        const userId = sess?.session?.user?.id;
        if (!userId) return;
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('ventas_v2').insert({
            item_serializado_id: ventaCel.id,
            sku_id: ventaCel._raw.skus.id,
            precio_lista: ventaCel.precio_venta,
            precio_final: precioFinal,
            descuento: (ventaCel.precio_venta || 0) - precioFinal,
            cliente_nombre: ventaForm.cliente_nombre,
            cliente_telefono: ventaForm.cliente_telefono,
            vendido_por: userId,
            tipo_venta: 'SERIALIZADO',
            cantidad: 1
        });
        if (!error) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('items_serializados').update({
                vendido: true
            }).eq('id', ventaCel.id);
            avisar('¡Venta registrada!');
            setVentaModalAbierto(false);
            setVentaCel(null);
            setVentaForm({
                precio_final: '',
                cliente_nombre: '',
                cliente_telefono: ''
            });
            cargarEquipos();
            cargarVentas();
        } else {
            avisar(error.message, 'error');
        }
        setGuardandoVenta(false);
    };
    const resumenVentas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Inventario.useMemo[resumenVentas]": ()=>ventas.reduce({
                "Inventario.useMemo[resumenVentas]": (acc, v)=>{
                    const final = Number(v.precio_final || 0);
                    let costo = v.items_serializados?.costo_compra ? Number(v.items_serializados.costo_compra) : Number(v.skus?.precio_costo || 0) * (v.cantidad || 1);
                    return {
                        totalVentas: acc.totalVentas + final,
                        totalCosto: acc.totalCosto + costo,
                        totalGanancia: acc.totalGanancia + (final - costo),
                        count: acc.count + 1
                    };
                }
            }["Inventario.useMemo[resumenVentas]"], {
                totalVentas: 0,
                totalCosto: 0,
                totalGanancia: 0,
                count: 0
            })
    }["Inventario.useMemo[resumenVentas]"], [
        ventas
    ]);
    const equiposFiltrados = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Inventario.useMemo[equiposFiltrados]": ()=>equipos.filter({
                "Inventario.useMemo[equiposFiltrados]": (c)=>{
                    const terminos = busqueda.toLowerCase().trim().split(/\s+/);
                    const datos = `${c.marca} ${c.modelo} ${c.imei} ${c.color} ${c.almacenamiento} ${c.estado} ${c.descripcion}`.toLowerCase();
                    const match = terminos.every({
                        "Inventario.useMemo[equiposFiltrados].match": (t)=>datos.includes(t)
                    }["Inventario.useMemo[equiposFiltrados].match"]);
                    const st = filtroEstado === 'TODOS' || c.estado === filtroEstado;
                    const vd = filtroVendidos === 'TODOS' || (filtroVendidos === 'VENDIDOS' ? Number(c.stock) <= 0 : Number(c.stock) > 0);
                    return match && st && vd;
                }
            }["Inventario.useMemo[equiposFiltrados]"])
    }["Inventario.useMemo[equiposFiltrados]"], [
        equipos,
        busqueda,
        filtroEstado,
        filtroVendidos
    ]);
    if (!autorizado) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            ...styles.container,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                ...styles.glassPanel,
                padding: '40px',
                width: '100%',
                maxWidth: '380px',
                textAlign: 'center'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: '20px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Logo, {}, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 459,
                        columnNumber: 47
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 459,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        fontSize: '2rem',
                        color: 'white',
                        margin: '0 0 10px 0',
                        fontWeight: '900'
                    },
                    children: [
                        "FARRUS",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: styles.goldText,
                            children: "HUB"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 460,
                            columnNumber: 105
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 460,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: '#94a3b8',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '30px'
                    },
                    children: "Acceso Administrativo"
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 461,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            style: styles.input,
                            placeholder: "Correo",
                            value: email,
                            onChange: (e)=>setEmail(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 463,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            style: styles.input,
                            type: "password",
                            placeholder: "Contraseña",
                            value: password,
                            onChange: (e)=>setPassword(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 464,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: login,
                            style: {
                                ...styles.btnPrimary,
                                justifyContent: 'center',
                                marginTop: '10px'
                            },
                            children: cargandoLogin ? 'Verificando...' : 'Iniciar Sesión'
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 465,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 462,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/inventario.js",
            lineNumber: 458,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 457,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                style: {
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    padding: '16px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '8px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Logo, {}, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 474,
                                    columnNumber: 212
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 474,
                                columnNumber: 77
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '1.2rem',
                                    fontWeight: '900',
                                    color: 'white'
                                },
                                children: [
                                    "FARRUS",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: styles.goldText,
                                        children: "HUB"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 474,
                                        columnNumber: 310
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 474,
                                columnNumber: 232
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '8px',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '4px',
                            borderRadius: '16px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            flexWrap: 'wrap'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('register'),
                                style: {
                                    ...styles.btnIcon,
                                    width: 'auto',
                                    padding: '0 20px',
                                    borderRadius: '12px',
                                    background: activeTab === 'register' ? '#F59E0B' : 'transparent',
                                    color: activeTab === 'register' ? 'black' : '#94a3b8',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                },
                                children: "Registro"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('inventory'),
                                style: {
                                    ...styles.btnIcon,
                                    width: 'auto',
                                    padding: '0 20px',
                                    borderRadius: '12px',
                                    background: activeTab === 'inventory' ? '#F59E0B' : 'transparent',
                                    color: activeTab === 'inventory' ? 'black' : '#94a3b8',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                },
                                children: "Inventario"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 477,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('sales'),
                                style: {
                                    ...styles.btnIcon,
                                    width: 'auto',
                                    padding: '0 20px',
                                    borderRadius: '12px',
                                    background: activeTab === 'sales' ? '#F59E0B' : 'transparent',
                                    color: activeTab === 'sales' ? 'black' : '#94a3b8',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                },
                                children: "Finanzas"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/accesorios'),
                                style: {
                                    ...styles.btnIcon,
                                    width: 'auto',
                                    padding: '0 20px',
                                    borderRadius: '12px',
                                    background: 'transparent',
                                    color: '#94a3b8',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem'
                                },
                                children: "Accesorios"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 479,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 475,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: logout,
                        style: {
                            ...styles.btnIcon,
                            width: 'auto',
                            padding: '0 16px',
                            borderRadius: '12px',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            color: '#ef4444'
                        },
                        children: "Salir"
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 481,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 473,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '30px',
                    maxWidth: '1400px',
                    margin: '0 auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '20px',
                            marginBottom: '40px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                label: "Ventas Totales",
                                value: `S/ ${resumenVentas.totalVentas.toLocaleString()}`,
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Dollar, {}, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 488,
                                    columnNumber: 109
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 488,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                label: "Ganancia Neta",
                                value: `S/ ${resumenVentas.totalGanancia.toLocaleString()}`,
                                color: "#10b981",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Chart, {}, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 489,
                                    columnNumber: 126
                                }, void 0),
                                subtext: "Margen saludable"
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 489,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                label: "Inversión Activa",
                                value: `S/ ${resumenVentas.totalCosto.toLocaleString()}`,
                                color: "#94a3b8",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Box, {}, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 490,
                                    columnNumber: 126
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 490,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                label: "Unidades Vendidas",
                                value: resumenVentas.count,
                                color: "#3b82f6",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Check, {}, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 491,
                                    columnNumber: 97
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 491,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 487,
                        columnNumber: 9
                    }, this),
                    activeTab === 'register' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "form-area",
                        style: {
                            ...styles.glassPanel,
                            padding: '40px',
                            marginBottom: '50px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '30px',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    paddingBottom: '20px',
                                    flexWrap: 'wrap',
                                    gap: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '14px',
                                                    background: 'rgba(245, 158, 11, 0.1)',
                                                    color: '#F59E0B',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid rgba(245, 158, 11, 0.2)'
                                                },
                                                children: editandoId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Edit, {}, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 497,
                                                    columnNumber: 335
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Box, {}, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 497,
                                                    columnNumber: 352
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 497,
                                                columnNumber: 85
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                    margin: 0
                                                },
                                                children: editandoId ? 'Editar Equipo' : 'Registrar Nuevo Equipo'
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 497,
                                                columnNumber: 372
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 497,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '8px 16px',
                                            background: 'rgba(0,0,0,0.3)',
                                            borderRadius: '50px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px',
                                                    color: form.publicado ? '#10b981' : '#64748b'
                                                },
                                                children: form.publicado ? 'Público' : 'Borrador'
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 499,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: ()=>setForm({
                                                        ...form,
                                                        publicado: !form.publicado
                                                    }),
                                                style: {
                                                    width: '40px',
                                                    height: '22px',
                                                    background: form.publicado ? '#10b981' : '#334155',
                                                    borderRadius: '99px',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: '18px',
                                                        height: '18px',
                                                        background: 'white',
                                                        borderRadius: '50%',
                                                        position: 'absolute',
                                                        top: '2px',
                                                        left: form.publicado ? '20px' : '2px',
                                                        transition: 'all 0.3s',
                                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 500,
                                                    columnNumber: 268
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 500,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 498,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 496,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.grid,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Marca"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 505,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: styles.input,
                                                placeholder: "Ej. Apple",
                                                value: form.marca,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        marca: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 505,
                                                columnNumber: 63
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 505,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Modelo"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 506,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: styles.input,
                                                placeholder: "Ej. iPhone 15",
                                                value: form.modelo,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        modelo: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 506,
                                                columnNumber: 64
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 506,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Estado"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 508,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                style: styles.input,
                                                value: form.estado,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        estado: e.target.value
                                                    }),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Nuevo Sellado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 510,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Semi Nuevo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 510,
                                                        columnNumber: 51
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Usado"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 510,
                                                        columnNumber: 78
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        children: "Open Box"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 510,
                                                        columnNumber: 100
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 509,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 507,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Serial / IMEI"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 513,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: {
                                                    ...styles.input,
                                                    fontFamily: 'monospace'
                                                },
                                                placeholder: "Escanea...",
                                                value: form.serial,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        serial: normalizarSerial(e.target.value)
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 513,
                                                columnNumber: 71
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 513,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Color"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 514,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: styles.input,
                                                placeholder: "Ej. Azul",
                                                value: form.color,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        color: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 514,
                                                columnNumber: 63
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 514,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Almacenamiento"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 515,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: styles.input,
                                                placeholder: "Ej. 128GB",
                                                value: form.almacenamiento,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        almacenamiento: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 515,
                                                columnNumber: 72
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 515,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Batería %"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 516,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: styles.input,
                                                type: "number",
                                                placeholder: "100",
                                                value: form.salud_bateria,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        salud_bateria: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 516,
                                                columnNumber: 67
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 516,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    ...styles.label,
                                                    color: '#F59E0B'
                                                },
                                                children: "Precio Venta"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 517,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: {
                                                    ...styles.input,
                                                    borderColor: 'rgba(245, 158, 11, 0.4)',
                                                    color: '#F59E0B',
                                                    fontWeight: 'bold'
                                                },
                                                type: "number",
                                                placeholder: "0.00",
                                                value: form.precio_venta,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        precio_venta: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 517,
                                                columnNumber: 93
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 517,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Costo Compra"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 518,
                                                columnNumber: 22
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: styles.input,
                                                type: "number",
                                                placeholder: "0.00",
                                                value: form.precio_costo,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        precio_costo: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 518,
                                                columnNumber: 70
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 518,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: '1/-1'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: styles.label,
                                                children: "Detalles / Descripción"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 519,
                                                columnNumber: 53
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                style: {
                                                    ...styles.input,
                                                    height: '100px',
                                                    resize: 'vertical'
                                                },
                                                placeholder: "Detalles adicionales...",
                                                value: form.descripcion,
                                                onChange: (e)=>setForm({
                                                        ...form,
                                                        descripcion: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 519,
                                                columnNumber: 111
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 519,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            gridColumn: '1/-1',
                                            border: '2px dashed rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            padding: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            background: 'rgba(0,0,0,0.2)'
                                        },
                                        onClick: ()=>document.getElementById('file-input').click(),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    color: '#94a3b8',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Upload, {}, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 520,
                                                        columnNumber: 461
                                                    }, this),
                                                    " ",
                                                    subiendo ? 'Subiendo...' : 'Click para subir fotos'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 520,
                                                columnNumber: 336
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                id: "file-input",
                                                type: "file",
                                                hidden: true,
                                                multiple: true,
                                                onChange: manejarFotos
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 520,
                                                columnNumber: 537
                                            }, this),
                                            form.imagen_url.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: '10px',
                                                    marginTop: '15px'
                                                },
                                                children: form.imagen_url.map((u, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: u,
                                                        style: {
                                                            width: '50px',
                                                            height: '50px',
                                                            borderRadius: '8px',
                                                            objectFit: 'cover',
                                                            border: '1px solid rgba(255,255,255,0.2)'
                                                        }
                                                    }, i, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 520,
                                                        columnNumber: 741
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 520,
                                                columnNumber: 645
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 520,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 504,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: guardar,
                                style: {
                                    ...styles.btnPrimary,
                                    width: '100%',
                                    justifyContent: 'center',
                                    marginTop: '30px',
                                    fontSize: '1.1rem',
                                    padding: '16px'
                                },
                                children: editandoId ? 'Guardar Cambios' : 'Registrar en Inventario'
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 522,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 495,
                        columnNumber: 12
                    }, this),
                    activeTab === 'inventory' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "header-actions",
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-end',
                                    marginBottom: '40px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                style: {
                                                    fontSize: '2.5rem',
                                                    fontWeight: '900',
                                                    color: 'white',
                                                    margin: '0 0 5px 0'
                                                },
                                                children: "Control de Inventario"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 529,
                                                columnNumber: 20
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#64748b'
                                                },
                                                children: "Vista general de tu negocio"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 529,
                                                columnNumber: 137
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 529,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '20px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'right'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '0.7rem',
                                                        color: '#64748b',
                                                        fontWeight: 'bold'
                                                    },
                                                    children: "TOTAL ITEMS"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 532,
                                                    columnNumber: 24
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        fontSize: '1.5rem',
                                                        fontWeight: 'bold',
                                                        color: 'white'
                                                    },
                                                    children: equipos.length
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 533,
                                                    columnNumber: 24
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 531,
                                            columnNumber: 20
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 530,
                                        columnNumber: 16
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 528,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "filters-container",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: '2',
                                            minWidth: '280px',
                                            position: 'relative'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    position: 'absolute',
                                                    top: '14px',
                                                    left: '14px',
                                                    color: '#94a3b8'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icons.Search, {}, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 540,
                                                    columnNumber: 100
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 540,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                style: {
                                                    ...styles.input,
                                                    paddingLeft: '45px'
                                                },
                                                placeholder: "Buscar (IMEI, Modelo, Color...)",
                                                value: busqueda,
                                                onChange: (e)=>setBusqueda(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 541,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 539,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: '1',
                                            minWidth: '180px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            style: {
                                                ...styles.input,
                                                cursor: 'pointer'
                                            },
                                            value: filtroEstado,
                                            onChange: (e)=>setFiltroEstado(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "TODOS",
                                                    children: "Todos los Estados"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 546,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Nuevo Sellado",
                                                    children: "Nuevo Sellado"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 547,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Semi Nuevo",
                                                    children: "Semi Nuevo"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 548,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Usado",
                                                    children: "Usado"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 549,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "Open Box",
                                                    children: "Open Box"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 550,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 545,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 544,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: '1',
                                            minWidth: '180px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            style: {
                                                ...styles.input,
                                                cursor: 'pointer'
                                            },
                                            value: filtroVendidos,
                                            onChange: (e)=>setFiltroVendidos(e.target.value),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "TODOS",
                                                    children: "Todo el Inventario"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 556,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "DISPONIBLES",
                                                    children: "En Stock"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 557,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "VENDIDOS",
                                                    children: "Vendidos"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 557,
                                                    columnNumber: 64
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 555,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 554,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 538,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.grid,
                                children: equiposFiltrados.map((cel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCard, {
                                        cel: cel,
                                        onEdit: (c)=>{
                                            setForm({
                                                ...estadoInicial,
                                                ...c,
                                                serial: c.imei
                                            });
                                            setEditandoId(c.id);
                                            setEditandoSkuId(c._raw.skus.id);
                                            setActiveTab('register');
                                            window.scrollTo({
                                                top: 0,
                                                behavior: 'smooth'
                                            });
                                        },
                                        onDelete: async (id)=>{
                                            if (confirm('¿Eliminar?')) {
                                                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$js__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('items_serializados').delete().eq('id', id);
                                                cargarEquipos();
                                            }
                                        },
                                        onSell: (c)=>{
                                            setVentaCel(c);
                                            setVentaForm({
                                                precio_final: c.precio_venta,
                                                cliente_nombre: '',
                                                cliente_telefono: ''
                                            });
                                            setVentaModalAbierto(true);
                                        },
                                        onOpenModal: setModalImagen,
                                        onVerDetalle: setDetalleModalOpen
                                    }, cel.id, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 564,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 562,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    activeTab === 'sales' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...styles.glassPanel,
                            padding: '0',
                            overflow: 'hidden'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "table-container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                style: {
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    color: '#cbd5e1'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            style: {
                                                background: 'rgba(0,0,0,0.3)',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)'
                                            },
                                            children: [
                                                'Fecha',
                                                'Producto',
                                                'Detalle',
                                                'Venta',
                                                'Costo',
                                                'Ganancia'
                                            ].map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    style: {
                                                        padding: '16px',
                                                        textAlign: h === 'Producto' || h === 'Fecha' ? 'left' : 'right',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '1px',
                                                        color: '#64748b',
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    children: h
                                                }, h, false, {
                                                    fileName: "[project]/pages/inventario.js",
                                                    lineNumber: 574,
                                                    columnNumber: 194
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/inventario.js",
                                            lineNumber: 574,
                                            columnNumber: 24
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 574,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: ventas.map((v)=>{
                                            const final = Number(v.precio_final);
                                            const costo = v.items_serializados?.costo_compra ? Number(v.items_serializados.costo_compra) : Number(v.skus?.precio_costo) * (v.cantidad || 1);
                                            const ganancia = final - costo;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                style: {
                                                    borderBottom: '1px solid rgba(255,255,255,0.02)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: '16px',
                                                            whiteSpace: 'nowrap'
                                                        },
                                                        children: new Date(v.vendido_en).toLocaleDateString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 580,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: '16px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                                                style: {
                                                                    color: 'white'
                                                                },
                                                                children: v.skus?.productos?.marca
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/inventario.js",
                                                                lineNumber: 581,
                                                                columnNumber: 57
                                                            }, this),
                                                            " ",
                                                            v.skus?.productos?.nombre
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 581,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: '16px',
                                                            textAlign: 'right',
                                                            fontFamily: 'monospace',
                                                            fontSize: '0.85rem'
                                                        },
                                                        children: v.items_serializados?.serial || 'Bulk'
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 582,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: '16px',
                                                            textAlign: 'right',
                                                            fontWeight: 'bold',
                                                            color: 'white'
                                                        },
                                                        children: [
                                                            "S/ ",
                                                            final.toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 583,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: '16px',
                                                            textAlign: 'right',
                                                            color: '#64748b'
                                                        },
                                                        children: [
                                                            "S/ ",
                                                            costo.toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 584,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        style: {
                                                            padding: '16px',
                                                            textAlign: 'right'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: ganancia >= 0 ? '#10b981' : '#ef4444',
                                                                fontWeight: 'bold',
                                                                background: ganancia >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                                padding: '4px 10px',
                                                                borderRadius: '50px',
                                                                fontSize: '0.85rem',
                                                                border: `1px solid ${ganancia >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                                                            },
                                                            children: [
                                                                "S/ ",
                                                                ganancia.toFixed(2)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/inventario.js",
                                                            lineNumber: 585,
                                                            columnNumber: 77
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/inventario.js",
                                                        lineNumber: 585,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, v.id, true, {
                                                fileName: "[project]/pages/inventario.js",
                                                lineNumber: 579,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/pages/inventario.js",
                                        lineNumber: 575,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/inventario.js",
                                lineNumber: 573,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 572,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/inventario.js",
                        lineNumber: 571,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 484,
                columnNumber: 7
            }, this),
            modalImagen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                },
                onClick: ()=>setModalImagen(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: modalImagen,
                    style: {
                        maxHeight: '90vh',
                        maxWidth: '90vw',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                    }
                }, void 0, false, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 598,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 597,
                columnNumber: 9
            }, this),
            detalleModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetallesModal, {
                cel: detalleModalOpen,
                onClose: ()=>setDetalleModalOpen(null)
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 602,
                columnNumber: 28
            }, this),
            ventaModalAbierto && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(8px)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        ...styles.glassPanel,
                        width: '100%',
                        maxWidth: '450px',
                        padding: '30px',
                        backgroundColor: '#0f172a'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                margin: '0 0 10px 0',
                                fontSize: '1.8rem',
                                color: 'white'
                            },
                            children: "Confirmar Venta"
                        }, void 0, false, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 607,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: '#94a3b8',
                                marginBottom: '25px'
                            },
                            children: [
                                "Vendiendo: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                                    style: {
                                        color: '#F59E0B'
                                    },
                                    children: [
                                        ventaCel?.marca,
                                        " ",
                                        ventaCel?.modelo
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 608,
                                    columnNumber: 78
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 608,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '20px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: styles.label,
                                    children: "Precio Final Real"
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 609,
                                    columnNumber: 51
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    autoFocus: true,
                                    style: {
                                        ...styles.input,
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#F59E0B',
                                        borderColor: '#F59E0B'
                                    },
                                    value: ventaForm.precio_final,
                                    onChange: (e)=>setVentaForm({
                                            ...ventaForm,
                                            precio_final: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 609,
                                    columnNumber: 104
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 609,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '30px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: styles.label,
                                    children: "Cliente (Opcional)"
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 610,
                                    columnNumber: 51
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    style: styles.input,
                                    placeholder: "Nombre del cliente",
                                    value: ventaForm.cliente_nombre,
                                    onChange: (e)=>setVentaForm({
                                            ...ventaForm,
                                            cliente_nombre: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 610,
                                    columnNumber: 105
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 610,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '15px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setVentaModalAbierto(false),
                                    style: {
                                        flex: 1,
                                        padding: '14px',
                                        borderRadius: '14px',
                                        background: 'transparent',
                                        border: '1px solid #475569',
                                        color: '#94a3b8',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    },
                                    children: "Cancelar"
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 612,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: confirmarVenta,
                                    disabled: guardandoVenta,
                                    style: {
                                        ...styles.btnPrimary,
                                        flex: 1,
                                        justifyContent: 'center'
                                    },
                                    children: guardandoVenta ? '...' : 'Confirmar'
                                }, void 0, false, {
                                    fileName: "[project]/pages/inventario.js",
                                    lineNumber: 613,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/inventario.js",
                            lineNumber: 611,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/inventario.js",
                    lineNumber: 606,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 605,
                columnNumber: 9
            }, this),
            notificacion.visible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: '80px',
                    right: '20px',
                    padding: '15px 25px',
                    borderRadius: '12px',
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderLeft: `5px solid ${notificacion.type === 'error' ? '#ef4444' : '#10b981'}`,
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    zIndex: 300
                },
                children: notificacion.mensaje
            }, void 0, false, {
                fileName: "[project]/pages/inventario.js",
                lineNumber: 619,
                columnNumber: 32
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/inventario.js",
        lineNumber: 472,
        columnNumber: 5
    }, this);
}
_s1(Inventario, "SPiWqvg53RkRS5vkODrXw+QgaWk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c3 = Inventario;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "StatCard");
__turbopack_context__.k.register(_c1, "DetallesModal");
__turbopack_context__.k.register(_c2, "ProductCard");
__turbopack_context__.k.register(_c3, "Inventario");
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