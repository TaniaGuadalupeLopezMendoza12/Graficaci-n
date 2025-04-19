var _a;
import { CanvasLocal } from './canvasLocal.js';
let canvas = document.getElementById('circlechart');
let graphics = canvas.getContext("2d");
const miCanvas = new CanvasLocal(graphics, canvas);
let datos = miCanvas.pedirDatos();
miCanvas.paint(datos);
//configuracion para evento del boton para infrasar nuevpod datos
(_a = document.getElementById("reloadData")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    datos = miCanvas.pedirDatos(); //solicita nuevos datos
    if (datos.length > 0) {
        miCanvas.paint(datos); //redibuja los nuevos datos
    }
    else {
        console.warn("No se ingresaron datos validos");
    }
});
