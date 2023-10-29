import { createElementHtml, mostrarNumeroArticulosHtml } from "./helpers";

export let productList : Producto[] = []
export let arrayIds : Array<number> = []

interface Producto {
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
    stock: number;
    cantidad: number;
}

const productosHTML = document.querySelector(".productos");
const productosCarrito = document.querySelector(".productos-carrito");



function addCarritoHTML(product : Producto) {
  let { image, name, price, id, cantidad } = product
  console.log(product)

  // Caja Producto
  const imgCarrito = createElementHtml({element : "img", classname : ["img-comprar"], src : image })
    
  // Seccion Contenido
  const divContenidoCarrito = createElementHtml({element : "div", classname : ["div-contenido-carrito", "centrar-texto"] })
  const nombreProducto = createElementHtml({element: "p", content : name})
  const precioProducto = createElementHtml({element : "p", content : `$${price}`, dataset: `price-$${id}`})
  divContenidoCarrito.append(nombreProducto, precioProducto);

  // Seccion Stock
  const divStock = createElementHtml({element : "div", classname : ["stock"]})
  const spanSumar = createElementHtml({ element : "span", classname :  ["sumar"], content : "+", dataset : `sumar-${id}`})
  const spanRestar = createElementHtml({ element : "span", classname :  ["restar"], content : "-", dataset : `restar-${id}`})
  const inputCarrito = createElementHtml({ element : "input", classname :  ["input-carrito", "centrar-texto"], dataset : `input-${id}`}) as HTMLInputElement;
  if (inputCarrito) {
    // Aunque los valores numéricos pueden ser usados en los campos de entrada numérica, JavaScript espera que los valores de entrada de formularios se almacenen como cadenas. 
    const numericValue = 1; // Asigna el valor numérico que desees
    inputCarrito.value = numericValue.toString(); // Convierte el valor a una cadena
  }
  
  divStock.append(spanRestar, inputCarrito, spanSumar)
  divContenidoCarrito.append(divStock)

  // Borrar
  const btnBorrar = createElementHtml({element : "span", classname : ["btn-borrar"],  content : "x", dataset : `borrar-${id}` })
  // Agregar img, y divs al producto-carrito
  const productoCarrito = createElementHtml({element : "div", classname :  ["producto-carrito"], dataset : `producto-${product.id}`})
  productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar);
  if (productosCarrito) productosCarrito.append(productoCarrito);
  

  mostrarNumeroArticulosHtml()
}

function renderProductosHtml(registros: Producto[]) {
  registros.forEach((registro) => {
    const { id, image, name, price } = registro;

    const divProducto = createElementHtml({
      element: "div",
      classname: ["producto", "centrar-texto"]
    }) as HTMLDivElement;

    const img = createElementHtml({
      element: "img",
      src: image
    }) as HTMLImageElement;

    const nombre = createElementHtml({
      element: "p",
      content: name
    }) as HTMLParagraphElement;

    const precio = createElementHtml({
      element: "p",
      content: `$${price}`
    }) as HTMLParagraphElement;

    const button = createElementHtml({
      element: "button",
      classname: ["add"],
      content: "Agregar Carrito",
      dataset: id.toString()
    }) as HTMLButtonElement;

    divProducto.append(img, nombre, precio, button);
    if(productosHTML) productosHTML.append(divProducto);
  });

  const btns = document.querySelectorAll(".add");
  btns.forEach((btnAgregar) => {
    btnAgregar.addEventListener("click", (e) => {
      if (e.target instanceof HTMLElement) {
        const datasetId = e.target.dataset.id;
        if (datasetId) agregarProducto(parseInt(datasetId));
        }
    });
  });
}
 
function agregarProducto ( value : number) {

}


export async function fetchProducts() : Promise <Producto[]> {
    let productos = await (await fetch('http://localhost:3000/api/productos')).json()
  
    let { registros } = productos;
  
    productList = registros;
    console.log(productList)
    return productList;
  }

  window.onload = async () => {
    console.log("hola")
    const productos = await fetchProducts()
    renderProductosHtml(productos)
    console.log(productos)
  }