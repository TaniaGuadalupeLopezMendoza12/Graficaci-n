
export class CanvasLocal {
  //atributos
  protected graphics: CanvasRenderingContext2D;
  protected rWidth:number;
  protected rHeight:number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;
  
      
  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.graphics = g;
    this.rWidth = 12;
    this.rHeight= 8;
    this.maxX = canvas.width - 1
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX/12;
    this.centerY = this.maxY/8*7;
  }
  ///pide datos al usuario
  
      public pedirDatos(): number[] {
        const input: string | null = prompt("Ingresa los números separados por comas:");
        if (input) {
          const numbers = input.split(',').map(num => parseFloat(num.trim())); // Convierte a números
          if (numbers.some(isNaN)) {
            console.error("Uno o más valores no son válidos.");
            alert("Por favor, ingresa solo números separados por comas.");
            return [];
          }
          return numbers;
        }
        return[]; //retorna arreglo bacio 
      }
  ///
  iX(x: number):number{return Math.round(this.centerX + x/this.pixelSize);}
  iY(y: number):number{return Math.round(this.centerY - y / this.pixelSize); }
      drawLine(x1: number, y1: number, x2: number, y2:number) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
      }
  drawRmboide(x1: number, y1: number, x2: number, y2: number,
  x3:number, y3:number, x4:number, y4:number, color:string) {
  
    // Color de relleno
    this.graphics.fillStyle = color;
    
    // Comenzamos la ruta de dibujo, o path
    this.graphics.beginPath();
    // Mover a la esquina superior izquierda
    this.graphics.moveTo(x1, y1);
    // Dibujar la línea hacia la derecha
    this.graphics.lineTo(x2, y2);
    // Ahora la que va hacia abajo
    this.graphics.lineTo(x3, y3); // A 80 porque esa es la altura
    // La que va hacia la izquierda
    this.graphics.lineTo(x4, y4);
    // Y dejamos que la última línea la dibuje JS
    this.graphics.closePath();
    // Hacemos que se dibuje
    this.graphics.stroke();
    // Lo rellenamos
    this.graphics.fill();
  }

  fx(x:number):number {
    return Math.sin(x*2.5);
  }

  maxH(h: number[]): number{
    let max = h[0];
    for (let i = 1; i < h.length; i++) {
      if (max < h[i])
        max = h[i];
    }
    //
    let res:number;
    let pot: number = 10;
    //se calcula la potencia de 10 mayor al max para redondear el maximo de la grafica.
    while (pot<max) {
      pot *= 10;
    }
    pot /= 10;
    res = Math.ceil(max / pot) * pot;
    return res;
  }
      barra(x:number, y:number, alt:number, colors: string):void{
        this.graphics.fillStyle= colors;  //color de rellenado
        this.graphics.beginPath();
        this.graphics.moveTo(this.iX(x), this.iY(0));
        this.graphics.lineTo(this.iX(x - 0.5), this.iY(0.5));
        this.graphics.lineTo(this.iX(x - 0.5), this.iY(y + alt));
        this.graphics.lineTo(this.iX(x), this.iY(y + alt - 0.5));
        this.graphics.lineTo(this.iX(x + 0.5), this.iY(y + alt));
        this.graphics.lineTo(this.iX(x + 0.5), this.iY(0.5));
        this.graphics.closePath();
        this.graphics.fill(); //rellena el area con el color definido


          this.graphics.strokeStyle = 'gray';
          this.drawLine(this.iX(x-0.5), this.iY(y+alt), this.iX(x-0.5), this.iY(this.rHeight-2));
          this.drawLine(this.iX(x), this.iY(y+alt-0.5), this.iX(x), this.iY(this.rHeight-2.5));
          this.drawLine(this.iX(x+0.5), this.iY(y+alt), this.iX(x+0.5), this.iY(this.rHeight-2));
          this.drawLine(this.iX(x-0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-1.5));
          this.drawLine(this.iX(x+0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-1.5));
          this.graphics.strokeStyle = 'black';
          this.drawLine(this.iX(x-0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-2.5));
          this.drawLine(this.iX(x+0.5), this.iY(this.rHeight-2), this.iX(x), this.iY(this.rHeight-2.5));
     
            this.graphics.fillStyle= "#91918F";  //parte de arriba de la barra
            this.graphics.beginPath();
            this.graphics.moveTo(this.iX(x - 0.5), this.iY(this.rHeight - 2)); // Punto inicial (esquina inferior izquierda)
            this.graphics.lineTo(this.iX(x), this.iY(this.rHeight - 1.5)); // Punto superior central
            this.graphics.lineTo(this.iX(x + 0.5), this.iY(this.rHeight - 2)); // Esquina inferior derecha
            this.graphics.lineTo(this.iX(x), this.iY(this.rHeight - 2.5)); // Punto inferior central
            this.graphics.closePath();
            this.graphics.fill();

              this.graphics.fillStyle="#D5DBDB";///pinta lado derecho
              this.graphics.beginPath()
              this.graphics.moveTo(this.iX(x), this.iY(y + alt - 0.5)); // Inicio de la línea central
              this.graphics.lineTo(this.iX(x), this.iY(this.rHeight - 2.5)); // Extiende hacia abajo
              this.graphics.lineTo(this.iX(x + 0.5), this.iY(this.rHeight - 2)); // Extiende hacia el lado derecho
              this.graphics.lineTo(this.iX(x + 0.5), this.iY(y + alt)); // Regresa hacia la parte superior derecha
              this.graphics.closePath();
              this.graphics.fill();
    
                this.graphics.fillStyle="#91918F"; //"#B3B2AE"; ///pinta lado izquierd
                this.graphics.beginPath()
                this.graphics.moveTo(this.iX(x - 0.5), this.iY(y + alt)); // Punto inicial (esquina superior izquierda)
                this.graphics.lineTo(this.iX(x - 0.5), this.iY(this.rHeight - 2)); // Línea vertical izquierda
                this.graphics.lineTo(this.iX(x), this.iY(this.rHeight - 2.5)); // Línea diagonal izquierda
                this.graphics.lineTo(this.iX(x), this.iY(y + alt - 0.5)); // Línea superior central
                this.graphics.closePath(); // Cierra el contorno
                this.graphics.closePath();
                this.graphics.fill();
              }
    
 
    
  generadorColores(): string{
    const r= Math.floor(Math.random()*256);  //rojo (0-255)
    const g= Math.floor(Math.random()*256);  //verde
    const b= Math.floor(Math.random()*256);  //azul
    return `rgb(${r}, ${g}, ${b})`;
  }

  public paint(h: number[]): void {
        this.graphics.clearRect(0,0, this.maxX, this.maxY); //limpiaelcanvas antes de dibujar
        //let h: number[] = [20, 100, 160, 420];
        if(h.length==0){
          console.error("No se guardaron datos");
          return;
        }
        let maxEsc: number;
        //let colors: string[]= ['magenta', 'red', 'green', 'yellow'];

        maxEsc = this.maxH(h);
            let i=0;
            for (let x = 0; x < 8; x += (8 / h.length)) {
              //this.graphics.strokeStyle = colors[i % 4]; // Establece el color de la barra
              if (i < h.length) {
                const altura = h[i] * (this.rHeight - 2) / maxEsc; // Calcula la altura de la barra
                
                const randomcolor= this.generadorColores();
                // Dibuja la barra
                this.barra(x, 0, altura, randomcolor);
            
                // Cambia el color del texto al mismo color de la barra
                this.graphics.fillStyle = randomcolor; // Color del número igual al de la barra
                this.graphics.font = "bold 20px Arial"; // Estilo del texto
                //centra el texto debajo de cada barra
                const anchotex= this.graphics.measureText(`${h[i]}%`).width;  //calcula ancho del texto
                const TextX= this.iX(x)- anchotex/2; //ajusta la posiscion para centrar el texto
                // Dibuja el número sobre la barra
                this.graphics.fillText(
                  `${h[i]}%`, // Muestra el número como texto
                  TextX, // Posición horizontal (centrado con la barra)
                  this.iY(-0.5) // Posición vertical (justo encima de la barra)
                );
            
                i++; // Incrementa el índice
              }
            }
        
      }

}