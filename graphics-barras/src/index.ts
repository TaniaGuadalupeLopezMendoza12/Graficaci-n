import { CanvasLocal } from './canvasLocal.js';

let canvas: HTMLCanvasElement= document.getElementById('circlechart') as HTMLCanvasElement;
let graphics: CanvasRenderingContext2D= canvas.getContext("2d")!;



const miCanvas = new CanvasLocal(graphics, canvas);
let datos= miCanvas.pedirDatos();
miCanvas.paint(datos);

//configuracion para evento del boton para infrasar nuevpod datos
document.getElementById("reloadData")?.addEventListener("click",() =>{
    datos= miCanvas.pedirDatos(); //solicita nuevos datos
    if(datos.length>0){
        miCanvas.paint(datos); //redibuja los nuevos datos
    }else{
        console.warn("No se ingresaron datos validos");
    }
});