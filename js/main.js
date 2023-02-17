const formulario = document.getElementById('ingreso-producto');
const tabla = document.getElementById('tabla');
let productos = [];
let generosDelProducto = [];

const obtenerGeneros = async () => {
  const response = await fetch('./genero.json');
  const data = await response.json();

  generosDelProducto = data;

  document.getElementById('genero').innerHTML = data
    .map(({ id, nombre }) => `<option value="${id}">${nombre}</option>`)
    .join();

}

obtenerGeneros();

const llamadaAlServidor = new Promise((resolve) => {
  setTimeout(() => {
    const productosDelLocalStorage = JSON.parse(localStorage.getItem('productos')) || [];
    const storageProductos = productosDelLocalStorage.map((producto) => {
      return new Producto(producto);
    });

    productos = storageProductos;

    resolve(storageProductos)
  }, 2000);
});

const agregarFilaALaTabla = ({ Nombre, Precio, genero }) => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${Nombre}</td>
    <td>${Precio}</td>
    <td>${generosDelProducto.find(generoDelProducto => generoDelProducto.id === genero)?.nombre}</td>
    `;


  const botonera = document.createElement('td');
  botonera.innerHTML = `<button class="btn btn-danger mb-3">Borrar</button>`;
  botonera.addEventListener('click', () => {
    Swal.fire({
      text: `Estas seguro de borrar ${Nombre}?`,
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

const mensajeEspera = document.getElementById('mensaje-servidor');
mensajeEspera.hidden = false

llamadaAlServidor.then((data) => {
  for (const producto of data) {
    agregarFilaALaTabla(producto);
  }
  mensajeEspera.hidden = true;
  tabla.hidden = false;
}).catch(() => {
  Toastify({
    text: 'Ocurrió un error, vuelva más tarde',
    gravity: 'top',
    position: 'right',
    duration: 3000,
    style: {
      background: 'red'
    },
    close: true
  }).showToast();
});

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const [NombreInput, PrecioInput, generoInput] = e.target
  const producto = new Producto({
    Nombre: NombreInput.value,
    Precio: PrecioInput.value,
    genero: generoInput.value,
  });

  if (!producto.saleMenosDe1000()) {
    Toastify({
      text: 'El producto debe costar más de $1000',
      gravity: 'top',
      position: 'right',
      duration: 3000,
      style: {
        background: 'red'
      },
      close: true
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