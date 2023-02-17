class Producto {
    constructor(entrada) {
        this.Nombre = entrada.Nombre;
        this.Precio = parseInt(entrada.Precio);
        this.genero = entrada.genero;
    }

    saleMenosDe1000() {
        return this.Precio >= 1000;
    }
}