//declaro variables
const contenedorProductos = document.getElementById('contenedor-productos')
const contenedorCarrito = document.getElementById('carrito-contenedor')
const botonVaciar = document.getElementById('vaciar-carrito')
const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')

let carrito = [] //Creo el array vacío para que cuando el usuario seleccione productos se agreguen a este

//Una vez declarada las variables, recorro mi array de objetos y los pinto en el DOM (Div, clases y demás etiquetas)
stockProductos.forEach((producto) => {
    const div = document.createElement('div') 
    div.classList.add('producto')
    div.innerHTML = `
    <h3>${producto.nombre}</h3>
    <img src=${producto.img}>
    <p class="precioProducto">Precio:$ ${producto.precio}</p>
    <button id="agregar${producto.id}" class="boton-agregar">Agregar</button>
    `
    contenedorProductos.appendChild(div) //Agrego al DOM el stock de productos con el appendChild

    const boton = document.getElementById(`agregar${producto.id}`) //Creo constante llamando al botón agregar
    boton.addEventListener('click', () => { //Escuchar el click del elemento declarado anteriormente y llamo a la función agregar carrito
        agregarAlCarrito(producto.id)

        //////////////////////// SWEET ALERT ////////////////////////
        Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Agregaste este producto al carrito',
            showConfirmButton: false,
            timer: 1000
        })
    })
})


//Función para agregar productos al carrito usando el ID
const agregarAlCarrito = (prodId) => {
    const existe = carrito.some (prod => prod.id === prodId) //método some para que evaluar si es true o false, comprobando si el elemento existe en el carrito
    if (existe){
        const prod = carrito.map (prod => { //Método map para modificar la cantidad de productos seleccionados
            if (prod.id === prodId){ //condicion para evaluar mediante el id si el producto elegido es repetido
                prod.cantidad++ //si la condición de arriba se cumple, se agrega un uno más al mismo producto
            }
        })
    } else { 
        const item = stockProductos.find((prod) => prod.id === prodId) //Traemos el producto mediante el ID del mismo
        carrito.push(item)
    }
    actualizarCarrito() //Llamo la función que está abajo para actualizar a medida que agrego productos
}


//Recorro lo agregado al carrito y preparo el contenido para ser pintado cuando se llame a la función
const actualizarCarrito = () => { 
    contenedorCarrito.innerHTML = "" //String vacío para visualizar contenido actualizado
    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio: $${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar">X</button>
        `
        contenedorCarrito.appendChild(div) //Inyecto lo declarado arriba 
        localStorage.setItem('carrito', JSON.stringify(carrito)) //Guardo en el storage los arrays en formato string
    })
    
    console.log(carrito)
    //Suma la propiedad precio según la cantidad, con valor iniciar del acumulador en 0 utilizando reduce
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0) 
}

//Función para eliminar del carrito
const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId) //Recorro el carrito
    const indice = carrito.indexOf(item) //Declaro el indice para hacer el splice
    carrito.splice(indice, 1) //Metodo Splice para eliminar el producto del Array
    actualizarCarrito() //Llamo a la función para que se actualice el DOM en carrito

    //////////////////////// TOASTIFY ////////////////////////
    Toastify({
        text: "Eliminaste el producto",
        duration: 3000,
        style: {
            background: "#0e8253",
          }
    }).showToast();
    console.log(carrito)
}


//Escuchamos el evento click en el botón vaciar, igualando la longitud a 0, actualizando el carrito
botonVaciar.addEventListener('click', () => { 

    //////////////////////// SWEET ALERT ////////////////////////
    Swal.fire({
        title: 'Está seguro?',
        text: 'Va a vaciar el carrito',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Vaciar',
        cancelButtonText: 'Cancelar', 
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0
            actualizarCarrito()
            Swal.fire(
                'Carrito limpio!',
                'El carrito ha sido vaciado',
                'success'
            )
        }
    })
})


//DOMContentLoaded para que cuando se actualice el DOM este sea tomado en el LocalStorage con método Get.
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})