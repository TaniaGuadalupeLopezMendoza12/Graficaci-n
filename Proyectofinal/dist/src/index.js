var _a, _b, _c, _d, _e, _f;
//import { Input } from './Input.js'; // No se usa directamente aquí
import { Obj3D } from './Obj3D.js';
//import { Canvas3D } from './Canvas3D.js'; // No se usa directamente aquí
//import { CvWireframe } from './CvWireFrame.js'; // Se usa CvHLines
import { CvHLines } from './CvHLines.js';
import { Rota3D } from './Rota3D.js';
import { Point3D } from './Point3D.js';
// Índices del rotor y las aspas - ¡DEFINICIONES GLOBALES CONSISTENTES!
export var CENTRO_ROTOR_INDEX = 69;
export var ASPA1_INDICES_FRONTAL_START = 91;
export var ASPA1_INDICES_FRONTAL_END = 95;
export var ASPA1_INDICES_TRASERA_START = 191;
export var ASPA1_INDICES_TRASERA_END = 195;
export var ASPA2_INDICES_FRONTAL_START = 101;
export var ASPA2_INDICES_FRONTAL_END = 105;
export var ASPA2_INDICES_TRASERA_START = 201;
export var ASPA2_INDICES_TRASERA_END = 205;
export var ASPA3_INDICES_FRONTAL_START = 106;
export var ASPA3_INDICES_FRONTAL_END = 110;
export var ASPA3_INDICES_TRASERA_START = 211;
export var ASPA3_INDICES_TRASERA_END = 215;
// Este array ALL_ASPA_INDICES_RANGES es el que usarás en Obj3D.ts para la lógica
// de determinar qué vértices pertenecen al cuerpo principal.
export var ALL_ASPA_INDICES_RANGES = [
    { start: ASPA1_INDICES_FRONTAL_START, end: ASPA1_INDICES_FRONTAL_END },
    { start: ASPA1_INDICES_TRASERA_START, end: ASPA1_INDICES_TRASERA_END },
    { start: ASPA2_INDICES_FRONTAL_START, end: ASPA2_INDICES_FRONTAL_END },
    { start: ASPA2_INDICES_TRASERA_START, end: ASPA2_INDICES_TRASERA_END },
    { start: ASPA3_INDICES_FRONTAL_START, end: ASPA3_INDICES_FRONTAL_END },
    { start: ASPA3_INDICES_TRASERA_START, end: ASPA3_INDICES_TRASERA_END }
];
var canvas;
var graphics;
// Se inicializan al cargar la ventana
canvas = document.getElementById('circlechart');
graphics = canvas.getContext('2d');
window.onload = function () {
    var _a;
    cargarModeloDesdeArchivo();
    (_a = document.getElementById('girarBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        girando = !girando; // Alterna el estado de giro
    });
    animar(); // Inicia el bucle de animación
};
var cv;
var obj;
var ang = 0; // Ángulo general (si lo usas)
var girando = false; // Controla si el rotor debe girar
var intervalID = null; // Para setInterval si lo usaras
var eje1; // Si necesitas ejes adicionales
var eje2; // Si necesitas ejes adicionales
// Arrays para almacenar los vértices originales de las aspas
// ¡IMPORTANTE!: Estos arrays se llenarán con copias de los vértices inmutables.
var aspa1_original = [];
var aspa1_trasera_original = [];
var aspa2_original = [];
var aspa2_trasera_original = [];
var aspa3_original = [];
var aspa3_trasera_original = [];
var anguloPasoAspas = 0; // Controla el "pitch" de las aspas
var centroRotor; // Punto central del rotor (índice 69)
var anguloRotorPrincipal = 0; // Controla la rotación global del rotor
// Copia inmutable de los vértices del modelo, tal como se leen del archivo (sin shiftToOrigin).
var obj_vertices_inmutables = [];
/**
 * Carga el modelo 3D desde 'MioEjemplo.txt', inicializa Obj3D y CvHLines,
 * y prepara los datos para la animación.
 */
function cargarModeloDesdeArchivo() {
    fetch('MioEjemplo.txt')
        .then(function (response) { return response.text(); })
        .then(function (contenido) {
        mostrarContenido(contenido); // Muestra el contenido del archivo en algún lugar del DOM
        obj = new Obj3D(); // Crea una nueva instancia de Obj3D
        // Intenta leer el modelo. Asumimos que Obj3D.readObject() NO llama a shiftToOrigin().
        if (obj.read(contenido)) {
            // *** 1. Guardar copia inmutable de los vértices originales (del archivo) ***
            // Recorremos obj.w y copiamos los Point3D válidos a obj_vertices_inmutables.
            // Esto es crucial para tener una referencia a las posiciones sin traslaciones.
            obj_vertices_inmutables = new Array(obj.w.length);
            for (var i = 0; i < obj.w.length; i++) {
                if (obj.w[i] instanceof Point3D) {
                    obj_vertices_inmutables[i] = new Point3D(obj.w[i].x, obj.w[i].y, obj.w[i].z);
                }
                else {
                    // Si un índice está vacío o no es un Point3D, lo mantenemos como undefined en la copia.
                    obj_vertices_inmutables[i] = undefined;
                }
            }
            // *** 2. Definir el centroRotor usando los vértices inmutables ***
            // Se verifica que el índice 69 exista y sea un Point3D válido.
            var CENTRO_ROTOR_INDEX_1 = 69; // Define el índice para mayor claridad
            if (obj_vertices_inmutables[CENTRO_ROTOR_INDEX_1] instanceof Point3D) {
                centroRotor = new Point3D(obj_vertices_inmutables[CENTRO_ROTOR_INDEX_1].x, obj_vertices_inmutables[CENTRO_ROTOR_INDEX_1].y, obj_vertices_inmutables[CENTRO_ROTOR_INDEX_1].z);
            }
            else {
                console.error("ERROR CR\u00CDTICO: El punto ".concat(CENTRO_ROTOR_INDEX_1, " (centroRotor) no es un Point3D v\u00E1lido o es indefinido en el archivo. La animaci\u00F3n del rotor no funcionar\u00E1."));
                girando = false; // Deshabilitar animación
                return; // Salir de la función si el punto vital no está presente
            }
            // *** 3. Inicializar las aspas usando los vértices inmutables y con comprobaciones ***
            // Siempre limpiar los arrays antes de llenarlos si esta función pudiera llamarse múltiples veces.
            aspa1_original = [];
            for (var i = 91; i <= 95; i++) {
                if (obj_vertices_inmutables[i] instanceof Point3D) {
                    aspa1_original.push(new Point3D(obj_vertices_inmutables[i].x, obj_vertices_inmutables[i].y, obj_vertices_inmutables[i].z));
                }
                else {
                    console.warn("Advertencia: V\u00E9rtice ".concat(i, " para aspa1_original es indefinido en obj_vertices_inmutables. Verifica tu archivo MioEjemplo.txt."));
                }
            }
            aspa1_trasera_original = [];
            for (var i = 191; i <= 195; i++) {
                if (obj_vertices_inmutables[i] instanceof Point3D) {
                    aspa1_trasera_original.push(new Point3D(obj_vertices_inmutables[i].x, obj_vertices_inmutables[i].y, obj_vertices_inmutables[i].z));
                }
                else {
                    console.warn("Advertencia: V\u00E9rtice ".concat(i, " para aspa1_trasera_original es indefinido en obj_vertices_inmutables. Verifica tu archivo MioEjemplo.txt."));
                }
            }
            aspa2_original = [];
            for (var i = 101; i <= 105; i++) {
                if (obj_vertices_inmutables[i] instanceof Point3D) {
                    aspa2_original.push(new Point3D(obj_vertices_inmutables[i].x, obj_vertices_inmutables[i].y, obj_vertices_inmutables[i].z));
                }
                else {
                    console.warn("Advertencia: V\u00E9rtice ".concat(i, " para aspa2_original es indefinido en obj_vertices_inmutables. Verifica tu archivo MioEjemplo.txt."));
                }
            }
            aspa2_trasera_original = [];
            for (var i = 201; i <= 205; i++) {
                if (obj_vertices_inmutables[i] instanceof Point3D) {
                    aspa2_trasera_original.push(new Point3D(obj_vertices_inmutables[i].x, obj_vertices_inmutables[i].y, obj_vertices_inmutables[i].z));
                }
                else {
                    console.warn("Advertencia: V\u00E9rtice ".concat(i, " para aspa2_trasera_original es indefinido en obj_vertices_inmutables. Verifica tu archivo MioEjemplo.txt."));
                }
            }
            aspa3_original = [];
            for (var i = 106; i <= 110; i++) {
                if (obj_vertices_inmutables[i] instanceof Point3D) {
                    aspa3_original.push(new Point3D(obj_vertices_inmutables[i].x, obj_vertices_inmutables[i].y, obj_vertices_inmutables[i].z));
                }
                else {
                    console.warn("Advertencia: V\u00E9rtice ".concat(i, " para aspa3_original es indefinido en obj_vertices_inmutables. Verifica tu archivo MioEjemplo.txt."));
                }
            }
            aspa3_trasera_original = [];
            for (var i = 211; i <= 215; i++) {
                if (obj_vertices_inmutables[i] instanceof Point3D) {
                    aspa3_trasera_original.push(new Point3D(obj_vertices_inmutables[i].x, obj_vertices_inmutables[i].y, obj_vertices_inmutables[i].z));
                }
                else {
                    console.warn("Advertencia: V\u00E9rtice ".concat(i, " para aspa3_trasera_original es indefinido en obj_vertices_inmutables. Verifica tu archivo MioEjemplo.txt."));
                }
            }
            // Después de cargar y preparar los datos, inicializa el visor.
            cv = new CvHLines(graphics, canvas);
            cv.setObj(obj); // CvHLines usará la instancia de 'obj' que se está modificando.
            cv.paint(); // Pinta la vista inicial del modelo
        }
        else {
            console.error("Error: obj.read(contenido) falló. No se pudo cargar el modelo 3D.");
        }
    })
        .catch(function (error) {
        console.error("Error al cargar el modelo:", error);
    });
}
function mostrarContenido(contenido) {
    var elemento = document.getElementById('contenido-archivo');
    if (elemento) { // Comprueba si el elemento existe antes de acceder a innerHTML
        elemento.innerHTML = contenido;
    }
}
/**
 * Controla el punto de vista del observador.
 * @param dTheta Cambio en el ángulo theta (rotación horizontal).
 * @param dPhi Cambio en el ángulo phi (rotación vertical).
 * @param fRho Factor de escalado de la distancia.
 */
function vp(dTheta, dPhi, fRho) {
    if (obj != undefined) {
        // obj ya es la instancia global, no necesitas cv.getObj() aquí.
        if (!obj.vp(cv, dTheta, dPhi, fRho)) {
            alert('Datos de vista no válidos. Posiblemente fuera de rango.');
        }
    }
    else {
        alert('Aún no se ha leído un archivo de modelo.');
    }
}
// Funciones para controlar la vista con botones
function eyeDownFunc() { vp(0, 0.1, 1); }
function eyeUpFunc() { vp(0, -0.1, 1); }
function eyeLeftFunc() { vp(-0.1, 0, 1); }
function eyeRightFunc() { vp(0.1, 0, 1); }
function incrDistFunc() { vp(0, 0, 2); }
function decrDistFunc() { vp(0, 0, 0.5); }
// Event listeners para los botones de la vista
(_a = document.getElementById('eyeDown')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', eyeDownFunc, false);
(_b = document.getElementById('eyeUp')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', eyeUpFunc, false);
(_c = document.getElementById('eyeLeft')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', eyeLeftFunc, false);
(_d = document.getElementById('eyeRight')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', eyeRightFunc, false);
(_e = document.getElementById('incrDist')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', incrDistFunc, false);
(_f = document.getElementById('decrDist')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', decrDistFunc, false);
/**
 * Realiza la rotación automática del rotor y el pitch de las aspas.
 * Actualiza los vértices del modelo en obj.w y repinta el canvas.
 */
function rotarRotorAutomatico() {
    var velocidadRotacionRotor = -5 * Math.PI / 180; // Velocidad de rotación del rotor principal
    anguloPasoAspas += 0.05; // Ajusta la velocidad del pitch de las aspas
    anguloRotorPrincipal += velocidadRotacionRotor;
    var dirGlobal = new Point3D(0, 1, 0); // Eje Y para la rotación global del rotor
    var dirLocal = new Point3D(0, 0, 1); // Eje Z para el pitch (cabeceo) de cada aspa
    /**
     * Procesa la rotación y el pitch de una aspa específica y actualiza los vértices en obj.w.
     * @param orig Array de vértices de la parte frontal de la aspa (originales).
     * @param tras Array de vértices de la parte trasera de la aspa (originales).
     * @param baseIx Índice base en obj.w para la parte frontal.
     * @param backIx Índice base en obj.w para la parte trasera.
     * @param fase Desfase angular para el pitch de esta aspa.
     */
    var procesarAspa = function (orig, tras, baseIx, backIx, fase) {
        // Obtenemos el pivote original del aspa de la copia inmutable.
        var pivotAspaOriginal = obj_vertices_inmutables[baseIx];
        // *** CRÍTICO: Comprobación de validez antes de usar los puntos clave ***
        if (!(pivotAspaOriginal instanceof Point3D)) {
            console.error("ERROR: pivotAspaOriginal (\u00EDndice ".concat(baseIx, ") no es un Point3D v\u00E1lido. No se puede rotar esta aspa. Deteniendo animaci\u00F3n."));
            girando = false; // Detener la animación si hay un error crítico
            return; // Salir de la función procesarAspa
        }
        if (!(centroRotor instanceof Point3D)) {
            console.error("ERROR: centroRotor no es un Point3D válido. No se pueden rotar las aspas. Deteniendo animación.");
            girando = false; // Detener la animación
            return; // Salir de la función procesarAspa
        }
        var pitchAng = Math.sin(anguloPasoAspas + fase) * (15 * Math.PI / 180); // Calcula el ángulo de pitch
        // Calcula los nuevos vértices para la parte frontal del aspa
        var frontV = calcularNuevosVerticesAspa(orig, pitchAng, anguloRotorPrincipal, pivotAspaOriginal, dirLocal, centroRotor, dirGlobal);
        // Calcula los nuevos vértices para la parte trasera del aspa
        var backV = calcularNuevosVerticesAspa(tras, pitchAng, anguloRotorPrincipal, pivotAspaOriginal, dirLocal, centroRotor, dirGlobal);
        // Actualiza los vértices en el objeto obj.w, que es lo que CvHLines dibuja.
        // Asegúrate de que los índices son correctos y que `p` es un Point3D.
        frontV.forEach(function (p, i) {
            if (p instanceof Point3D)
                obj.w[baseIx + i] = p;
        });
        backV.forEach(function (p, i) {
            if (p instanceof Point3D)
                obj.w[backIx + i] = p;
        });
    };
    // Llama a procesarAspa para cada una de las tres aspas
    procesarAspa(aspa1_original, aspa1_trasera_original, 91, 191, 0);
    procesarAspa(aspa2_original, aspa2_trasera_original, 101, 201, 2 * Math.PI / 3); // Desfase para la segunda aspa
    procesarAspa(aspa3_original, aspa3_trasera_original, 106, 211, 4 * Math.PI / 3); // Desfase para la tercera aspa
    cv.paint(); // Repinta el canvas con los vértices actualizados
}
// En main.ts, dentro de la función calcularNuevosVerticesAspa
/**
 * Calcula la posición de los vértices de un aspa después de aplicar rotaciones.
 * @param verticesAspaOriginal Los vértices originales del aspa.
 * @param pitchAngle El ángulo de cabeceo (pitch) del aspa.
 * @param rotorGlobalAngle El ángulo de rotación global del rotor.
 * @param pivotAspa El punto de pivote del aspa (donde rota localmente).
 * @param localRotationAxis El eje de rotación local para el pitch.
 * @param globalRotationCenter El centro de rotación global del rotor.
 * @param globalRotationAxis El eje de rotación global del rotor.
 * @returns Un array de Point3D con los nuevos vértices transformados.
 */
function calcularNuevosVerticesAspa(verticesAspaOriginal, pitchAngle, rotorGlobalAngle, pivotAspa, localRotationAxis, // NOTA: Tu Rota3D.initRotate usa dos puntos, no un vector.
// Necesitaremos convertir este vector en un segundo punto.
globalRotationCenter, globalRotationAxis // NOTA: Igual que arriba, necesitaremos un segundo punto.
) {
    var nuevosVertices = [];
    // --- PRE-CALCULAR MATRICES DE ROTACIÓN ---
    // Para la rotación local (pitch):
    // Tu initRotate necesita dos puntos para definir el eje.
    // El eje es 'localRotationAxis' que sale del 'pivotAspa'.
    // Entonces, el segundo punto 'B' será 'pivotAspa + localRotationAxis'.
    var localAxisEndPoint = new Point3D(pivotAspa.x + localRotationAxis.x, pivotAspa.y + localRotationAxis.y, pivotAspa.z + localRotationAxis.z);
    Rota3D.initRotate(pivotAspa, localAxisEndPoint, pitchAngle);
    // Guarda esta matriz para la rotación local
    var localR = {
        r11: Rota3D.r11, r12: Rota3D.r12, r13: Rota3D.r13,
        r21: Rota3D.r21, r22: Rota3D.r22, r23: Rota3D.r23,
        r31: Rota3D.r31, r32: Rota3D.r32, r33: Rota3D.r33,
        r41: Rota3D.r41, r42: Rota3D.r42, r43: Rota3D.r43,
    };
    // Para la rotación global del rotor:
    // El eje es 'globalRotationAxis' que sale del 'globalRotationCenter'.
    // El segundo punto 'B' será 'globalRotationCenter + globalRotationAxis'.
    var globalAxisEndPoint = new Point3D(globalRotationCenter.x + globalRotationAxis.x, globalRotationCenter.y + globalRotationAxis.y, globalRotationCenter.z + globalRotationAxis.z);
    Rota3D.initRotate(globalRotationCenter, globalAxisEndPoint, rotorGlobalAngle);
    // Guarda esta matriz para la rotación global
    var globalR = {
        r11: Rota3D.r11, r12: Rota3D.r12, r13: Rota3D.r13,
        r21: Rota3D.r21, r22: Rota3D.r22, r23: Rota3D.r23,
        r31: Rota3D.r31, r32: Rota3D.r32, r33: Rota3D.r33,
        r41: Rota3D.r41, r42: Rota3D.r42, r43: Rota3D.r43,
    };
    verticesAspaOriginal.forEach(function (vertex) {
        if (!(vertex instanceof Point3D)) {
            console.warn("Advertencia: Vértice de aspa original no es Point3D válido. Saltando.");
            nuevosVertices.push(undefined);
            return;
        }
        var tempVertex = new Point3D(vertex.x, vertex.y, vertex.z); // Copia para no modificar el original
        // 1. Aplicar la rotación de "pitch" (cabeceo) local del aspa.
        // Las propiedades r11 a r43 de Rota3D son estáticas, se sobrescriben en cada llamada a initRotate.
        // Por eso las guardamos en objetos 'localR' y 'globalR' para aplicarlas de forma segura.
        // Necesitamos una función auxiliar para aplicar una matriz específica.
        tempVertex = applyRotationMatrix(tempVertex, localR);
        // 2. Aplicar la rotación global del rotor.
        tempVertex = applyRotationMatrix(tempVertex, globalR);
        nuevosVertices.push(tempVertex);
    });
    return nuevosVertices;
}
// --- NUEVA FUNCIÓN AUXILIAR EN main.ts ---
// Necesitas esta función porque Rota3D usa propiedades estáticas para la matriz.
// Así, puedes aplicar una matriz específica sin que se sobrescriba por la siguiente llamada a initRotate.
function applyRotationMatrix(p, matrix) {
    return new Point3D(p.x * matrix.r11 + p.y * matrix.r21 + p.z * matrix.r31 + matrix.r41, p.x * matrix.r12 + p.y * matrix.r22 + p.z * matrix.r32 + matrix.r42, p.x * matrix.r13 + p.y * matrix.r23 + p.z * matrix.r33 + matrix.r43);
}
// ... (el resto de tu código de main.ts permanece igual)
/**
 * Bucle principal de animación que se llama continuamente.
 */
function animar() {
    if (girando) {
        rotarRotorAutomatico(); // Gira el rotor y las aspas si 'girando' es true
    }
    requestAnimationFrame(animar); // Solicita el siguiente frame de animación
}
// Eventos de ratón para controlar la vista
var Pix, Piy; // Posición inicial del ratón
var Pfx, Pfy; // Posición final del ratón
var SensibilidadX = 0.02, SensibilidadY = 0.02; // Sensibilidad de arrastre
var flag = false; // Indica si el ratón está presionado y arrastrando
function handleMouse(evento) {
    Pix = evento.offsetX;
    Piy = evento.offsetY;
    flag = true;
}
function makeVizualization(evento) {
    if (flag) {
        Pfx = evento.offsetX;
        Pfy = evento.offsetY;
        var difX = Pix - Pfx;
        var difY = Pfy - Piy;
        // Aplica rotación vertical (arriba/abajo)
        vp(0, SensibilidadY * difY, 1);
        Piy = Pfy; // Actualiza la posición inicial Y
        // Aplica rotación horizontal (izquierda/derecha)
        vp(SensibilidadX * difX, 0, 1);
        Pix = Pfx; // Actualiza la posición inicial X
    }
}
function noDraw() {
    flag = false; // Deja de arrastrar
}
canvas.addEventListener('mousedown', handleMouse);
canvas.addEventListener('mouseup', noDraw);
canvas.addEventListener('mousemove', makeVizualization);
