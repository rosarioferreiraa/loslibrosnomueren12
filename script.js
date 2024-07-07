const carrito = document.getElementById('carrito');
    const productos = document.getElementById('lista-productos');
    const listaproductos = document.querySelector('#lista-carrito tbody')
    const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
    const finalizarCarritoBtn = document.querySelector('#finalizar-compra');
    const buscarProductoInput = document.getElementById('buscador');
    const listaProductos = document.querySelectorAll('.card');

    eventslisteners();

    function eventslisteners() {
        //atento a cuando se presiona agregar carrito
        productos.addEventListener('click', comprarprod);

        //eliminar prod en el carrito
        carrito.addEventListener('click', eliminarprod);

        //vaciar carrit de compras
        vaciarCarritoBtn.addEventListener('click', vaciarcarrito);

        //finalizar carrit de compras
        finalizarCarritoBtn.addEventListener('click', finalizarcarrito);

        //mostrar lista de productos en carrito de compra al cargar DOM-LS
        document.addEventListener('DOMContentLoaded', leerLS);
      buscarProductoInput.addEventListener('input', () => {
            const textoBusqueda = buscarProductoInput.value.trim().toLowerCase();

            listaProductos.forEach(producto => {
                const nombreProducto = producto.querySelector('h4').textContent.toLowerCase();

                if (nombreProducto.includes(textoBusqueda)) {
                    producto.style.display = 'block'; // Mostrar el producto si coincide con la búsqueda
                } else {
                    producto.style.display = 'none'; // Ocultar el producto si no coincide con la búsqueda
                }
            });
        });

    }


    function comprarprod(e) {
        e.preventDefault();
        //delegation para agregar carrito
        if (e.target.classList.contains("agregar-carrito")) {
            const prod = e.target.parentElement.parentElement;
            //enviamos el prod seleccionado para tomar sus datos
            leerDatosprod(prod);
            var fin = document.getElementById('txtgracias');
            fin.style.visibility = 'hidden';
            var fin = document.querySelector('#vaciar-carrito');
            fin.style.visibility = 'visible';
            var fin = document.querySelector('#finalizar-compra');
            fin.style.visibility = 'visible';
            var fin = document.querySelector('#lista-carrito');
            fin.style.visibility = 'visible';

        }
    }


    //leer Datos del prod
    function leerDatosprod(prod) {
        const infoprod = {
            imagen: prod.querySelector('img').src,
            titulo: prod.querySelector('h4').textContent,
            precio: prod.querySelector('.precio').textContent,
            id: prod.querySelector('a').getAttribute('data-id')
        }

        insertarprod(infoprod);
    }

    // insertar prod en el carrito
    function insertarprod(prod) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><img src="${prod.imagen}" width="100"></td>
        <td>${prod.titulo}</td>
        <td>${prod.precio}</td>
        <td><a href="#" class="borrar-prod" data-id="${prod.id}">X</a></td>
    `;
        listaproductos.appendChild(row);
        guardarprodLocalStorage(prod);

    }

    //eliminar prod del carrito en el DOM
    function eliminarprod(e) {
        e.preventDefault();

        let prod, prodId;

        if (e.target.classList.contains('borrar-prod')) {
            e.target.parentElement.parentElement.remove();
        }
        prod = e.target.parentElement.parentElement;
        prodId = prod.querySelector('a').getAttribute('data-id');
        eliminarprodLS(prodId);
    }

    //vacias Carrito
    function vaciarcarrito() {
        //listaproductos.innerHTML = '';
        while (listaproductos.firstChild) {
            listaproductos.removeChild(listaproductos.firstChild);
        }
        //vaciar carrito  de LS
        vaciarLs();

        return false;
    }

    //finalizar Carrito
    function finalizarcarrito() {
        //listaproductos.innerHTML = '';
        while (listaproductos.firstChild) {
            listaproductos.removeChild(listaproductos.firstChild);
        }
        //vaciar carrito  de LS
        vaciarLs();
        var fin = document.getElementById('txtgracias');
        fin.style.visibility = 'visible';
        var fin = document.querySelector('#vaciar-carrito');
        fin.style.visibility = 'hidden';
        var fin = document.querySelector('#finalizar-compra');
        fin.style.visibility = 'hidden';
        var fin = document.querySelector('#lista-carrito');
        fin.style.visibility = 'hidden';
        return false;
    }

    //almacenar prod al LS
    function guardarprodLocalStorage(prod) {
        let productos;
        productos = obtenerproductosLocalStorage();
        //El prod seleccionado se agrega al Array
        productos.push(prod);
        localStorage.setItem('productos', JSON.stringify(productos));
    }


    //comprobar que hayan elementos en el LS
    function obtenerproductosLocalStorage() {
        let productosLS;
        //comprobamos si no hay naad o es nulo, creamos el array vacío
        if (localStorage.getItem('productos') === null) {
            productosLS = [];
        } else {
            productosLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productosLS;
    }

    //pinta los productos desde LS en el carrito
    function leerLS() {
        let productosLS;

        productosLS = obtenerproductosLocalStorage();

        productosLS.forEach(function (prod) {
            //Construimos el template
            const row = document.createElement("tr");
            row.innerHTML = `
        <td><img src="${prod.imagen}" width="100"></td>
        <td>${prod.titulo}</td>
        <td>${prod.precio}</td>
        <td><a href="#" class="borrar-prod" data-id="${prod.id}">X</a></td>
    `;
            listaproductos.appendChild(row);

        })
    }

    //eliminar prod del LS
    function eliminarprodLS(prod) {
        let productosLS;
        //obtnemos el arreglo con los productos
        productosLS = obtenerproductosLocalStorage();
        //iteramo para buscar coincidencias y eliminar
        productosLS.forEach(function (prodLS, index) {
            if (prodLS.id === prod) {
                productosLS.splice(index, 1);
            }
        });

        localStorage.setItem('productos', JSON.stringify(productosLS));

    }

    //eliminar todos los productos del LS
    function vaciarLs() {
        localStorage.clear();
    }