const formulario = document.getElementById('ingreso-producto');
const tabla = document.getElementById('tabla');
const productosDelLocalStorage = JSON.parse(localStorage.getItem('productos')) || [];
const productos = productosDelLocalStorage.map((producto) => {
    return new Producto(producto);
})

const agregarFilaALaTabla = (producto) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${producto.Nombre}</td>
    <td>${producto.Precio}</td>
    `;

    const Nombre = producto.Nombre;
    const botonera = document.createElement('td');
    botonera.innerHTML = `<button class="btn btn-danger mb-3">Borrar</button>`;
    botonera.addEventListener('click', () => {
        Swal.fire({
            text: `Estas seguro de borrar ${producto.Nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((respuesta) => {
            if (respuesta.isConfirmed) {
                const productoEncontrado = productos.find((elemento) => elemento.Nombre === Nombre);
                const indice = productos.indexOf(productoEncontrado);
                productos.splice(indice, 1);
                localStorage.setItem('productos', JSON.stringify(productos));
                tr.remove();
            }
        });
    });

    tr.append(botonera);

    tabla.append(tr);
}

for (const producto of productos) {
    agregarFilaALaTabla(producto);
}

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const producto = new Producto({
        Nombre: e.target[0].value,
        Precio: e.target[1].value,
    });

    if (!producto.saleMenosDe1000()) {
        Toastify({
            text: 'El producto debe costar más de $1000',
            gravity: 'top',
            position: 'right',
            duration: 3000,
            style: {
                background: 'red'
            }
        }).showToast();
        return;
    }

    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));

    agregarFilaALaTabla(producto);

    for (const input of e.target) {
        input.value = '';
    }
});