export class CanvasLocal {
    constructor(g, canvas) {
        this.graphics = g;
        this.rWidth = 10;
        this.rHeight = 10;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = this.maxX / 2;
        this.centerY = this.maxY / 2;
    }
    iX(x) { return Math.round(this.centerX + x / this.pixelSize); }
    iY(y) { return Math.round(this.centerY - y / this.pixelSize); }
    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
    }
    fx(x) {
        return Math.sin(x * 2.5);
    }
    paint() {
        /*this.drawLine(0,0,this.maxX,0);
        this.drawLine(0,this.maxY,this.maxX,this.maxY);       extremos del canvas
        this.drawLine(0,0,0,this.maxY);
        this.drawLine(this.maxX,0,this.maxX,this.maxY);*/
        let lado = Math.min(this.maxX, this.maxY) * 0.9; // 90% del tamaño del canvas  era1    
        // let side = 0.95 * lado;
        let sideHalf = 0.5 * lado; //en cves de lado era side
        let xCenter = 320;
        let yCenter = 240;
        // let h = sideHalf * Math.sqrt(3);  calculaa en triangulo
        let x1 = xCenter - sideHalf;
        let y1 = yCenter - sideHalf;
        let x2 = xCenter + sideHalf;
        let y2 = yCenter - sideHalf;
        let x3 = xCenter + sideHalf;
        let y3 = yCenter + sideHalf;
        let x4 = xCenter - sideHalf;
        let y4 = yCenter + sideHalf;
        let xA, yA, xB, yB, xC, yC, xD, yD;
        let xA1, yA1, xB1, yB1, xC1, yC1, xD1, yD1, p, q;
        q = 0.05;
        p = 1 - q;
        xA = xCenter - sideHalf; // Esquina superior izquierda
        yA = yCenter - sideHalf;
        xB = xCenter + sideHalf; // Esquina superior derecha
        yB = yCenter - sideHalf;
        xC = xCenter + sideHalf; // Esquina inferior derecha
        yC = yCenter + sideHalf;
        xD = xCenter - sideHalf; // Esquina inferior izquierda
        yD = yCenter + sideHalf;
        for (let m = 0; m < 1; m++) {
            for (let n = 0; n < 1; n++) {
                // Inicializa las coordenadas de las esquinas del cuadrado
                let xA = 1 + n * lado - sideHalf; // Esquina superior izquierda
                let yA = 1 + m * lado - sideHalf;
                let xB = 1 + n * lado + sideHalf; // Esquina superior derecha
                let yB = 1 + m * lado - sideHalf;
                let xC = 1 + n * lado + sideHalf; // Esquina inferior derecha
                let yC = 1 + m * lado + sideHalf;
                let xD = 1 + n * lado - sideHalf; // Esquina inferior izquierda
                let yD = 1 + m * lado + sideHalf;
                for (let i = 0; i < 20; i++) {
                    // Dibuja las cuatro líneas del cuadrado
                    this.drawLine(this.iX(xA), this.iY(yA), this.iX(xB), this.iY(yB)); // Línea superior
                    this.drawLine(this.iX(xB), this.iY(yB), this.iX(xC), this.iY(yC)); // Línea derecha
                    this.drawLine(this.iX(xC), this.iY(yC), this.iX(xD), this.iY(yD)); // Línea inferior
                    this.drawLine(this.iX(xD), this.iY(yD), this.iX(xA), this.iY(yA)); // Línea izquierda
                    // Aplica la reducción progresiva
                    let xA1 = p * xA + q * xB;
                    let yA1 = p * yA + q * yB;
                    let xB1 = p * xB + q * xC;
                    let yB1 = p * yB + q * yC;
                    let xC1 = p * xC + q * xD;
                    let yC1 = p * yC + q * yD;
                    let xD1 = p * xD + q * xA;
                    let yD1 = p * yD + q * yA;
                    // Actualiza las esquinas para la siguiente iteración
                    xA = xA1;
                    yA = yA1;
                    xB = xB1;
                    yB = yB1;
                    xC = xC1;
                    yC = yC1;
                    xD = xD1;
                    yD = yD1;
                }
            }
        }
        for (let i = 0; i < 50; i++) {
            // Dibuja las líneas finales del cuadrado
            this.drawLine(xA, yA, xB, yB);
            this.drawLine(xB, yB, xC, yC);
            this.drawLine(xC, yC, xD, yD);
            this.drawLine(xD, yD, xA, yA);
            // Aplica la reducción progresiva
            let xA1 = p * xA + q * xB;
            let yA1 = p * yA + q * yB;
            let xB1 = p * xB + q * xC;
            let yB1 = p * yB + q * yC;
            let xC1 = p * xC + q * xD;
            let yC1 = p * yC + q * yD;
            let xD1 = p * xD + q * xA;
            let yD1 = p * yD + q * yA;
            // Actualiza las coordenadas
            xA = xA1;
            yA = yA1;
            xB = xB1;
            yB = yB1;
            xC = xC1;
            yC = yC1;
            xD = xD1;
            yD = yD1;
        }
    }
}
