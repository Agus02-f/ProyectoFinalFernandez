class Producto {
    constructor(entrada) {
        this.Nombre = entrada.Nombre;
        this.Precio = parseInt(entrada.Precio);
    }

    saleMenosDe1000() {
        return this.Precio >= 1000;
    }
}