import { createElementHtml, mostrarNumeroArticulosHtml } from "./helper-tienda";
import { getProductosLocal, ids } from "./helpers";

export interface Producto {
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
    stock: number;
    cantidad: number;
}

interface Order {
  items: Producto[];
  // Otras propiedades de la orden si las tienes
}

// Inicializar variables y estructuras de datos
let productList: Producto[] = []; // Debes inicializar productList con tus productos
let arrayIds : Array<number> = []
let order: Order = { items: [] };

let productoLocalStorage: Producto[] = []; // Debes inicializar productList con tus productos

const productosHTML = document.querySelector(".productos");
const productosCarrito = document.querySelector(".productos-carrito");



function addCarritoHTML(product : Producto) {
  let { image, name, price, id } = product
  console.log(product)

  // Caja Producto
  const imgCarrito = createElementHtml({element : "img", classname : ["img-comprar"], src : `../${image}` })
    
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
    let { id, image, name, price } = registro;
    if(image.includes("img/")) image = `../${image}`

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
 
function agregarProducto ( productId : number) {
  const product = productList.find((p) => p.id === productId);

  if (!product) {
    console.log("Producto no encontrado");
    return;
  }

    // Obtener información de IDs desde el almacenamiento local
    const getIdsJSON = localStorage.getItem("productoIds");
    const getIds = getIdsJSON ? JSON.parse(getIdsJSON) : [];
  
    // Continuar con el procesamiento de IDs
    if (getIds) {
      getIds.push(productId);
      product.stock--;
      product.cantidad = 1;
      order.items.push(product);
  
      // Actualizar el almacenamiento local con los IDs
      localStorage.setItem(`productoIds`, JSON.stringify(getIds));
    }
 
      
    // Obtener información del producto desde el almacenamiento local
   const getProductActualizarJSON = localStorage.getItem(`producto-${productId}`);
   const getProductActualizar = getProductActualizarJSON ? JSON.parse(getProductActualizarJSON) : null;
   // Comprobar si getProductActualizar no es nulo ni indefinido
   if (!getProductActualizar)  {
    
    ids.push(productId)
    product.stock--
    product.cantidad = 1
    order.items.push(product)
    localStorage.setItem(`producto-${productId}`, JSON.stringify(product));
    localStorage.setItem(`productoIds`, JSON.stringify(ids));
   } 
   // Agregar el producto al carrito en la interfaz
   addCarritoHTML(product);
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
  //console.log(productos)
  
  new Promise (function(resolve, reject) {
    resolve( getProductosLocal())
  })
  .then(function(e) {
    //mostrarSubtotalHtml()
    mostrarNumeroArticulosHtml()
    //borrarItemCarrito()
    //eventoRestarEnTodos() 
    //eventoSumarEnTodos()
  })
}