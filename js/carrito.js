//Variables Gloables

let btnProducts = document.querySelectorAll(".btn-product");
let contandorCarrito = document.querySelector(".contar-pro");
let listadoCarrito = document.querySelector(".list-cart tbody")
let con = 0;

document.addEventListener("DOMContentLoaded", () => {
    cargarProLocalStorage();
});

btnProducts.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        con++;
        contandorCarrito.textContent = con;
        //agregar producto al carrito
        infoProducto(i);
    });
});

//agregar producto al carrito
function agregarProducto(producto) {
    let fila = document.createElement("tr");
    fila.innerHTML = `
        <td> ${con} </td>
        <td> <img src="${producto.imagen}" width="70px"> </td>
        <td> ${producto.nombre} </td>
        <td> $${producto.precio} </td>
        <td> <span onclick="borrarProduct(${con})" class="btn btn-danger"> ✖️ </span> </td>`;
    listadoCarrito.appendChild(fila);
}

//funcion para agregar la informacion del producto al carrito
function infoProducto(pos) {
    let producto = btnProducts[pos].parentElement.parentElement.parentElement;
    let precioText = producto.querySelector("h5").textContent;
    let precioValue = parseFloat(precioText.replace('$', '')); // Convertir el precio a número

    let infoPro = {
        nombre: producto.querySelector("h3").textContent,
        imagen: producto.querySelector("img").src,
        precio: precioValue, // Usar el valor numérico
        cantidad: 1
    };

    agregarProducto(infoPro);
    guardarProLocalStorage(infoPro);
}

function borrarProduct(pos)
{
    let producto = event.target;
    //console.log(producto.parentElement.parentElement);
    producto.parentElement.parentElement.remove();
    //disminuir el contador de productos del carrito
    if(con > 0)
    {
        con--;
        contandorCarrito.textContent = con;
    }
    eliminarProLocalStorage(pos);
}


//guardar los productos en el localStorage
function guardarProLocalStorage(producto) {
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null) {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.push(producto);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

function eliminarProLocalStorage()
{
    let todosProductos = [];
    let productosPrevios = JSON.parse(localStorage.getItem("pro-carrito"));
    if (productosPrevios != null)
    {
        todosProductos = Object.values(productosPrevios);
    }
    todosProductos.slice((pos-1), 1);
    localStorage.setItem("pro-carrito", JSON.stringify(todosProductos));
}

//cargar productos de localStorage en el carrito
function cargarProLocalStorage() {
    let todosProductos = JSON.parse(localStorage.getItem("pro-carrito")) || [];
    todosProductos.forEach((producto, index) => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td> ${index + 1} </td>
            <td> <img src="${producto.imagen}" width="70px"> </td>
            <td> ${producto.nombre} </td>
            <td> $${producto.precio} </td>
            <td> <span onclick="borrarProduct(${index + 1})" class="btn btn-danger"> ✖️ </span> </td>`;
        listadoCarrito.appendChild(fila);
    });
}

contandorCarrito.parentElement.addEventListener("click", ()=>
    {
        listadoCarrito.parentElement.classList.toggle("ocultar");
    })
