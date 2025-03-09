//variables globales
let tablaCarrito = document.querySelector('.cart-table tbody');
let resumenSubTotal = document.querySelector(".res-sub-total");
let resumenDescuento = document.querySelector(".promo");
let resumenTotal = document.querySelector(".total");
let destino = document.querySelector(".destino");
let resumenDomicilio = document.querySelector(".valor-domi");
let btnResumen = document.querySelector(".btn-resumen");

//agregar eventos al navegador
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
})

//funcion cargar productos del localStorage
function cargarProductos() {
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    //limpiar tabla
    tablaCarrito.innerHTML = "";

    //comprobar si hay productos en el localStorage
    if (todosProductos.length != 0) {
        todosProductos.forEach((producto, index) => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td class="d-flex justify-content-between align-items-center"> 
                    <span onclick="borrarProducto(${index})" class="btn btn-danger"> ✖️ </span> 
                    <img src="${producto.imagen}" width="70px">
                    ${producto.nombre}
                </td>
                <td> 
                    $<span> ${producto.precio} </span>
                </td>
                <td> 
                    <div class="quantity quantity-wrap">
                        <div class="decrement" onclick="actualizarCantidad(${index}, -1)"> <i class="fa-solid fa-minus"></i> </div>
                        <input class="number" type="text" name="quantity" value="${producto.cantidad}" maxlength="2" size="1" readonly>
                        <div class="increment" onclick="actualizarCantidad(${index}, 1)"> <i class="fa-solid fa-plus"></i> </div>
                    </div>
                </td>
                <td> 
                    $ ${(producto.precio * producto.cantidad).toFixed(3)} 
                </td>`;
            tablaCarrito.appendChild(fila);
        });
    } else {
        let fila = document.createElement("tr")
        fila.innerHTML = `
            <td colspan="4">
                <p class="text-center fs-3"> No hay productos en el carrito </p>
            <td>`;
        tablaCarrito.appendChild(fila);
    }

    //ejecutar resumen de compra
    resumenCompra();
}

//funcion para actualizar cantidades del producto
function actualizarCantidad(pos, cambio) {
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    if (todosProductos[pos]) {
        //actualizar cantidad
        todosProductos[pos].cantidad = (todosProductos[pos].cantidad || 1) + cambio;

        //asegurarse de que la cantidad no sea menor a 1
        if (todosProductos[pos].cantidad < 1) {
            todosProductos[pos].cantidad = 1;
        }

        //calcular subtotal
        let subtotal = parseFloat(todosProductos[pos].precio) * parseInt(todosProductos[pos].cantidad);
    }

    //actualizar localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));

    //Recargar la tabla
    cargarProductos();
}

//funcion para borrar productos de detalle de carrito
function borrarProducto(pos) {
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    //eliminar producto
    todosProductos.splice(pos, 1);
    //actualizar localStorage
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
    //recargar tabla
    cargarProductos();
}

//funcion para el resumen de la compra
function resumenCompra() {
    // Obtener productos del localStorage
    let productos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    let sumaProductos = 0;
    
    // Sumar el valor total de todos los productos seleccionados
    productos.forEach((producto) => {
        sumaProductos += parseFloat(producto.precio) * parseInt(producto.cantidad);
    });
    
    // Determinar el valor del domicilio en función del destino seleccionado
    let dest = destino.value.toLowerCase();
    let valorDomicilio = 0;
    switch (dest) {
        case "medellin":
            valorDomicilio = 0;
            break;
        case "bello":
            valorDomicilio = 10;  // Por ejemplo, 10 unidades
            break;
        case "envigado":
        case "itagui":
        case "sabaneta":
            valorDomicilio = 15;
            break;
        case "copacabana":
        case "caldas":
        case "la estrella":
            valorDomicilio = 20;
            break;
        default:
            valorDomicilio = 0;
    }
    
    // Calcular el descuento promo: se aplica si la suma de productos excede 100
    let descuentoPromo = (sumaProductos > 100) ? sumaProductos * 0.1 : 0;
    
    // El subtotal se define como la suma de los productos MÁS el valor del domicilio
    let subtotalConDomicilio = sumaProductos + valorDomicilio;
    
    // El total final es el subtotal al que se le resta el descuento promo
    let totalFinal = subtotalConDomicilio - descuentoPromo;
    
    // Actualizar los elementos del DOM con los valores calculados
    resumenSubTotal.textContent = subtotalConDomicilio.toFixed(2);
    resumenDescuento.textContent = descuentoPromo.toFixed(2);
    resumenDomicilio.textContent = valorDomicilio.toFixed(2);
    resumenTotal.textContent = totalFinal.toFixed(2);
}
    //mostrar los calculos de resumen
    btnResumen.addEventListener("click", ()=>{
        //extraer los productos de localStorage
        let productos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
        let resumen = {
            //copiar todos los productos
            "productos" : productos,
        }
        //llenar la variable resunen con la informacion del  resumen de la compra
        resumen.subtotal = resumenSubTotal.textContent;
        resumen.descuento = resumenDescuento.textContent;
        resumen.destino = destino.value;
        resumen.domicilio = resumenDomicilio.textContent;
        resumen.totalApagar = resumenTotal.textContent;
    
        //guardar el resumen de la compra en localStorage
        localStorage.setItem("pro-carrito", JSON.stringify(resumen));
    
        //redirigir el usuario a la pagina de pago
        location.href = "checkout.html";
    
        //console.log(location.href);
    })