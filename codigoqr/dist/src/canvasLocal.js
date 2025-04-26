export class CanvasLocal {
    constructor(g, canvas) {
        this.graphics = g;
        this.rWidth = 25;
        this.rHeight = 25;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
    }
    iX(x) { return Math.round(this.centerX + x / this.pixelSize); }
    iY(y) { return Math.round(this.centerY - y / this.pixelSize); }
    //iX(x: number):number{return this.centerX + Math.floor(x/this.pixelSize);}
    //iY(y: number): number{ return this.centerY - Math.floor(y / this.pixelSize); }
    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
    }
    /*fx(x:number):number {
      return Math.sin(x*2.5);
    }*/
    dibujarPixel(x, y) {
        const celdatamaño = Math.round(this.iX(1) - this.iX(0)); //tamañodela celda
        this.graphics.fillRect(this.iX(x), this.iY(y) - celdatamaño, celdatamaño, celdatamaño);
        //este no esthis.graphics.fillRect(this.iX(x), this.iY(y+1), this.iX(1)-this.iX(0), this.iX(1)-this.iX(0));
    }
    paint() {
        function textoABinario(texto) {
            return texto.split("").map(char => char.charCodeAt(0).toString(2).padStart(8, "0")).join("");
        }
        const url = prompt("Ingresa URL:    Ejemplo:https://www.google.com.mx/");
        if (url) {
            const datosQR = textoABinario(url); //convierte url a binario
            // console.log("binario enlace:", datosQR);
            const tamanoQR = 25;
            let matrizQR = new Array(tamanoQR).fill(null).map(() => new Array(tamanoQR).fill(0));
            //inserta datos en la matriz
            function insertarDatosQR(matriz, datos) {
                let index = 0;
                for (let x = tamanoQR - 1; x >= 0; x -= 2) {
                    for (let y = tamanoQR - 1; y >= 0; y--) {
                        if (matriz[y][x] === 0 && index < datos.length) {
                            matriz[y][x] = parseInt(datos[index]);
                            index++;
                        }
                    }
                }
            }
            // Inserta los datos antes de dibujar la matriz
            insertarDatosQR(matrizQR, datosQR);
            //cuenta los 0
            let ceros = matrizQR.flat().filter(bit => bit === 0).length;
            let unos = matrizQR.flat().filter(bit => bit === 1).length;
            //console.log(`Ceros: ${ceros}, Unos: ${unos}`);
            // Ahora sí, dibuja la matriz sobre la cuadrícula
            for (let y = 0; y < tamanoQR; y++) {
                for (let x = 0; x < tamanoQR; x++) {
                    this.graphics.fillStyle = matrizQR[y][x] ? "black" : "white";
                    //console.log(`Dibujando pixel en (${x}, ${y}) con color: ${matrizQR[y][x] ? "black" : "white"}`);  
                    this.dibujarPixel(x - tamanoQR / 2, y - tamanoQR / 2);
                }
            }
            //console.table(matrizQR);
            //console.log(`Filas: ${matrizQR.length}, Columnas: ${matrizQR[0]?.length}`);  
        }
        else {
            alert("No se ingreso ninguan URL");
        }
        let tamX = 25;
        let tamY = 25;
        /*this.graphics.fillStyle = "black";   //dibuja filas y columnas
         for(let x = -tamX/2; x<=tamX/2; x++)
          this.drawLine(this.iX(x), this.iY(-tamX/2),this.iX(x), this.iY(tamY/2));
         
         for(let y = -tamY/2; y<=tamY/2; y++)
          this.drawLine(this.iX(-tamX/2), this.iY(y),this.iX(tamX/2), this.iY(y));*/
        ////////////////////////////////////////////////////////////////////////////7
        // Cuadro negro/// dibuja el cudro en la esquina de abajo del lado izquierdo
        this.graphics.fillStyle = "white";
        for (let x = -tamX / 2; x < -tamX / 2 + 8; x++) {
            for (let y = -tamY / 2; y < -tamY / 2 + 8; y++) {
                if (x === -tamX / 2 || x === -tamX / 2 + 7 || y === -tamY / 2 || y === -tamY / 2 + 7) {
                    this.dibujarPixel(x, y); // Pinta el contorno negro
                }
            }
        }
        this.graphics.fillStyle = "black";
        for (let x = -tamX / 2; x < -tamX / 2 + 7; x++) {
            for (let y = -tamY / 2; y < -tamY / 2 + 7; y++) {
                if (x === -tamX / 2 || x === -tamX / 2 + 6 || y === -tamY / 2 || y === -tamY / 2 + 6) {
                    this.dibujarPixel(x, y); // Pinta el contorno negro
                }
            }
        }
        // Cuadro blanco
        this.graphics.fillStyle = "white";
        for (let x = -tamX / 2 + 1; x < -tamX / 2 + 6; x++) {
            for (let y = -tamY / 2 + 1; y < -tamY / 2 + 6; y++) {
                if (x === -tamX / 2 + 1 || x === -tamX / 2 + 5 || y === -tamY / 2 + 1 || y === -tamY / 2 + 5) {
                    this.dibujarPixel(x, y); // Pinta el cuadro blanco interno
                }
            }
        }
        this.graphics.fillStyle = "black";
        for (let x = -tamX / 2 + 2; x < -tamX / 2 + 5; x++) { //desde la segunda celda dentro del blando hasta la quinta
            for (let y = -tamY / 2 + 2; y < -tamY / 2 + 5; y++) {
                this.dibujarPixel(x, y);
            }
        }
        ////////////////////////////////////////////////////////////
        // Cuadro negro/// dibuja el cuadro en la esquina de arriba del lado derecha
        this.graphics.fillStyle = "white"; //margen blanco
        for (let x = tamX / 2 - 8; x < tamX / 2; x++) {
            for (let y = tamY / 2 - 8; y < tamY / 2; y++) {
                if (x === tamX / 2 - 8 || x === tamX / 2 - 1 || y === tamY / 2 - 8 || y === tamY / 2 - 1) {
                    this.dibujarPixel(x, y); // Pinta el contorno negro
                }
            }
        }
        // Cuadro negro/// dibuja el cuadro en la esquina de arriba del lado derecha
        this.graphics.fillStyle = "black";
        for (let x = tamX / 2 - 7; x < tamX / 2; x++) {
            for (let y = tamY / 2 - 7; y < tamY / 2; y++) {
                if (x === tamX / 2 - 7 || x === tamX / 2 - 1 || y === tamY / 2 - 7 || y === tamY / 2 - 1) {
                    this.dibujarPixel(x, y); // Pinta el contorno negro
                }
            }
        }
        // Cuadro blanco
        this.graphics.fillStyle = "white";
        for (let x = tamX / 2 - 6; x < tamX / 2 - 1; x++) {
            for (let y = tamY / 2 - 6; y < tamY / 2 - 1; y++) {
                if (x === tamX / 2 - 6 || x === tamX / 2 - 2 || y === tamY / 2 - 6 || y === tamY / 2 - 2) {
                    this.dibujarPixel(x, y); // Pinta el cuadro blanco interno
                }
            }
        }
        this.graphics.fillStyle = "black";
        for (let x = tamX / 2 - 5; x < tamX / 2 - 2; x++) { //desde la segunda celda dentro del blando hasta la quinta
            for (let y = tamY / 2 - 5; y < tamY / 2 - 2; y++) {
                this.dibujarPixel(x, y);
            }
        }
        ////////////////////////////////////////////////////////////
        this.graphics.fillStyle = "white";
        for (let x = -tamX / 2; x < -tamX / 2 + 8; x++) {
            for (let y = tamY / 2 - 8; y < tamY / 2; y++) {
                if (x === -tamX / 2 || x === -tamX / 2 + 7 || y === tamY / 2 - 8 || y === tamY / 2 - 1) {
                    this.dibujarPixel(x, y); // Pinta el contorno negro
                }
            }
        }
        // Cuadro negro/// dibuja el cudro en la esquina de abajo del lado izquierdo
        this.graphics.fillStyle = "black";
        for (let x = -tamX / 2; x < -tamX / 2 + 7; x++) {
            for (let y = tamY / 2 - 7; y < tamY / 2; y++) {
                if (x === -tamX / 2 || x === -tamX / 2 + 6 || y === tamY / 2 - 7 || y === tamY / 2 - 1) {
                    this.dibujarPixel(x, y); // Pinta el contorno negro
                }
            }
        }
        // Cuadro blanco
        this.graphics.fillStyle = "white";
        for (let x = -tamX / 2 + 1; x < -tamX / 2 + 6; x++) {
            for (let y = tamY / 2 - 6; y < tamY / 2 - 1; y++) {
                if (x === -tamX / 2 + 1 || x === -tamX / 2 + 5 || y === tamY / 2 - 6 || y === tamY / 2 - 2) {
                    this.dibujarPixel(x, y); // Pinta el cuadro blanco interno
                }
            }
        }
        this.graphics.fillStyle = "black";
        for (let x = -tamX / 2 + 2; x < -tamX / 2 + 5; x++) { //desde la segunda celda dentro del blando hasta la quinta
            for (let y = tamY / 2 - 5; y < tamY / 2 - 2; y++) {
                this.dibujarPixel(x, y);
            }
        }
        ////////////////////////////////////////////////////////////
        //Patron de alineacion cuadro chiquito
        const startXSmall = tamX / 2 - 9; // Coordenada inicial en X para el cuadro pequeño
        const startYSmall = -tamY / 2 + 4; // Coordenada inicial en Y para el cuadro pequeño
        // Cuadro negro externo (5x5)
        this.graphics.fillStyle = "black";
        for (let x = startXSmall; x < startXSmall + 5; x++) { // 5x5 tamaño del cuadro negro
            for (let y = startYSmall; y < startYSmall + 5; y++) { // 5x5 tamaño del cuadro negro
                if (x === startXSmall || x === startXSmall + 4 || y === startYSmall || y === startYSmall + 4) {
                    this.dibujarPixel(x, y); // Pinta el contorno negro
                }
            }
        }
        // Cuadro blanco interno (3x3)
        this.graphics.fillStyle = "white";
        for (let x = startXSmall + 1; x < startXSmall + 4; x++) { // Dentro del cuadro negro
            for (let y = startYSmall + 1; y < startYSmall + 4; y++) { // Dentro del cuadro negro
                this.dibujarPixel(x, y); // Pinta el contorno blanco
            }
        }
        // Cuadro negro interno sólido (1x1)
        this.graphics.fillStyle = "black";
        this.dibujarPixel(startXSmall + 2, startYSmall + 2); // Pinta el pixel negro central
        //patron de temporización
        this.graphics.fillStyle = "black";
        let xFijo = -tamX / 2 + 6; // Fijamos x en la posición deseada
        for (let y = -tamY / 2 + 8; y <= -tamY / 2 + 16; y++) {
            if ((y - (-tamY / 2)) % 2 === 0) {
                this.graphics.fillStyle = "black"; // Si es par, color negro
            }
            else {
                this.graphics.fillStyle = "white"; // Si es impar, color rojo (puedes cambiarlo)
            }
            this.dibujarPixel(xFijo, y);
        }
        let yFijo = -tamY / 2 + 18; // Fijamos x en la posición deseada
        for (let x = -tamX / 2 + 8; x <= -tamX / 2 + 16; x++) {
            if ((x - (-tamX / 2)) % 2 === 0) {
                this.graphics.fillStyle = "black"; // Si es par, color negro
            }
            else {
                this.graphics.fillStyle = "white"; // Si es impar, color rojo (puedes cambiarlo)
            }
            this.dibujarPixel(x, yFijo);
        }
        this.graphics.fillStyle = "black";
        this.dibujarPixel(-tamX / 2 + 8, -tamY / 2 + 7);
        //Franjas de formato
        let Fijo = -tamX / 2 + 8; // Fijamos x en la posición deseada 
        for (let y = -tamX / 2; y <= -tamX / 2 + 6; y++) {
            this.graphics.fillStyle = Math.random() < 0.5 ? "black" : "white";
            this.dibujarPixel(Fijo, y);
        }
        let posicionF = -tamY / 2 + 16; // Fijamos x en la posición deseada 
        for (let x = -tamX / 2 + 17; x <= -tamX / 2 + 24; x++) {
            this.graphics.fillStyle = Math.random() < 0.5 ? "black" : "white";
            //this.graphics.fillStyle = "red";
            this.dibujarPixel(x, posicionF);
        }
        let posicion = -tamY / 2 + 16; // Fijamos x en la posición deseada 
        for (let x = -tamX / 2; x <= -tamX / 2 + 5; x++) {
            this.graphics.fillStyle = Math.random() < 0.5 ? "black" : "white";
            //this.graphics.fillStyle = "red";
            this.dibujarPixel(x, posicion);
            this.dibujarPixel(-tamX / 2 + 7, -tamY / 2 + 16);
            this.dibujarPixel(-tamX / 2 + 8, -tamY / 2 + 16);
            this.dibujarPixel(-tamX / 2 + 8, -tamY / 2 + 17);
        }
        let posicionx = -tamX / 2 + 8; // Fijamos x en la posición deseada 
        for (let y = -tamX / 2 + 19; y <= -tamX / 2 + 24; y++) {
            this.graphics.fillStyle = Math.random() < 0.5 ? "black" : "white";
            //this.graphics.fillStyle = "red";
            this.dibujarPixel(posicionx, y);
        }
        // esquina inferior derecha (espesifica formato de la informacion)
        this.graphics.fillStyle = "black";
        this.dibujarPixel(-tamX / 2 + 23, -tamY / 2);
        this.graphics.fillStyle = "white";
        this.dibujarPixel(-tamX / 2 + 24, -tamY / 2);
        this.dibujarPixel(-tamX / 2 + 24, -tamY / 2 + 1);
        this.dibujarPixel(-tamX / 2 + 23, -tamY / 2 + 1);
        //this.graphics.fillStyle = "pink";
        // Rellenar todo el área interna de rosa
        for (let x = -tamX / 2; x <= -tamX / 2 + 5; x++) {
            for (let y = -tamY / 2 + 8; y <= -tamY / 2 + 15; y++) {
                this.graphics.fillStyle = Math.random() < 0.5 ? "black" : "white";
                this.dibujarPixel(x, y);
            }
        }
        this.dibujarPixel(-tamX / 2, -tamY / 2 + 8);
        this.dibujarPixel(-tamX / 2, -tamY / 2 + 15);
        this.dibujarPixel(-tamX / 2 + 5, -tamY / 2 + 15);
        this.dibujarPixel(-tamX / 2 + 5, -tamY / 2 + 8);
    } //del pain
} //del canvas
