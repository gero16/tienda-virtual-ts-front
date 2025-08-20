import { createElementHtml } from "./helper-tienda";
import { deshabilitarBtnAgregar } from "./tienda";
import { Producto } from "../interface";

export let total : number = 0 
export let subTotal : number = 0
export let sumaSub : number = 0
export let ids : Array<string> = []
export let datosProductosAgregados : Array<Producto> = []
export let articulos : number = 0

const productosCarrito = document.querySelector(".productos-carrito") as HTMLDListElement
const numbCompras = document.querySelector('.numero-compras') as HTMLSpanElement
const subTotalHtml = document.querySelector('.sub-total') as HTMLParagraphElement

const arrayIds: string[] = [];

const carritoHTML = document.querySelector(".carritoHTML") as HTMLDivElement
const ocultarCarrito = document.querySelector(".ocultar-carrito") as HTMLSpanElement
const iconoCarrito = document.querySelector(".carrito") as HTMLImageElement



iconoCarrito.addEventListener("click", () => {
    carritoHTML.style.display = "block";
  });
  
  ocultarCarrito.addEventListener("click", () => {
    carritoHTML.style.display = "none";
  });

export function llenarIds () {
  const getIdsJSON = localStorage.getItem(`productoIds`);
  const getIds : string[] | null = getIdsJSON ? JSON.parse(getIdsJSON) : null;
  if(getIds) {
    getIds.forEach((id : string )=> {
      arrayIds.push(id.toString())
    });
  }
  return arrayIds;
}

export function calcularSubTotalProducto(product : Producto) {
  let subTotalProducto = product.cantidad * product.price
  return subTotalProducto
}

export function mostrarSubtotalHtml () {
  let cuenta = 0
  const getIdsJSON = localStorage.getItem(`productoIds`);
  const getIds = getIdsJSON ? JSON.parse(getIdsJSON) : null;
  if(getIds) {
    for (let index = 0; index < getIds.length; index++) {
      const getProductJSON = localStorage.getItem(`producto-${ getIds[index] }`);
      const getProduct = getProductJSON ? JSON.parse(getProductJSON) : null;
      let precio = calcularSubTotalProducto(getProduct)
      cuenta += precio
      subTotalHtml.innerHTML = `$${cuenta}`
    }
  }
  if(!getIds) subTotalHtml.innerHTML = `$0`
}

export function htmlCarritoLocalStorage () {
  // De donde salen los datos de datosProductosAgregadooooos!!!
  if (datosProductosAgregados) { 
    const divProductoVacio = document.querySelector(".producto-vacio") as HTMLDivElement
    divProductoVacio.innerHTML = ""

    datosProductosAgregados.forEach((product) => {
      let { image, name, price, id, cantidad } = product
      const imgCarrito = createElementHtml({element : "img", classname : ["img-comprar"],   src: `/${image.replace("src/", "").replace("../", "")}`  })
      
    // Seccion Contenido
      const divContenidoCarrito = createElementHtml({element : "div", classname : ["div-contenido-carrito", "centrar-texto"] })
      const nombreProducto = createElementHtml({element: "p", content : name})
      const precioProducto = createElementHtml({element : "p", content : `$${price}`, dataset: `price-${id}`})
      divContenidoCarrito.append(nombreProducto, precioProducto);

      // Seccion Stock
      const divStock = createElementHtml({element : "div", classname : ["stock"]})
      const spanSumar = createElementHtml({ element : "span", classname :  ["sumar"], content : "+", dataset : `sumar-${id}`})
      const spanRestar = createElementHtml({ element : "span", classname :  ["restar"], content : "-", dataset : `restar-${id}`})
      const inputCarrito = createElementHtml({ element : "input", classname :  ["input-carrito", "centrar-texto"], dataset : `input-${id}`}) as HTMLInputElement;
      if (inputCarrito) {
        // Aunque los valores numéricos pueden ser usados en los campos de entrada numérica, JavaScript espera que los valores de entrada de formularios se almacenen como cadenas. 
        const numericValue = cantidad; // Asigna el valor numérico que desees
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

      // Me aparecen 2 producto-carrito's creados antes en el HTML
      
      numbCompras.textContent = articulos.toString();
      sumaSub = cantidad * price
      const htmlPrice = document.querySelector(`[data-id="price-${id}"]`) as HTMLParagraphElement
      htmlPrice ? htmlPrice.textContent=  `$${sumaSub}` : ""
      total = total + sumaSub
      subTotalHtml.innerHTML = `$${total}`;
    });
  } 


  mostrarSubtotalHtml()
}

export function mostrarNumeroArticulosHtml () {
  const getIdsJSON =localStorage.getItem("productoIds")
  const getIds =  getIdsJSON ? JSON.parse(getIdsJSON) : null
  if(getIds) numbCompras.textContent = getIds.length
  else numbCompras.textContent = "0" 
 
}

export function traerIdsLocalStorage (ids : Array<string>) {
  ids.forEach(id => {
      const productoLocalJSON = localStorage.getItem(`producto-${ id }`);
      const productoLocal = productoLocalJSON ? JSON.parse(productoLocalJSON) : null;
      if(productoLocal) {
        datosProductosAgregados.push(productoLocal)
        // Deshabilitar agregar producto 
        deshabilitarBtnAgregar(id, true)
      }
      else return;
  })
}

export function borrarItemCarrito() {
  const btnBorrar = document.querySelectorAll('.btn-borrar') as NodeListOf<HTMLElement>;

  for (let i = 0; i < btnBorrar.length; i++) {
    btnBorrar[i].addEventListener('click', (e) => {
      const obtenerSubtotal = document.querySelector(".sub-total") as HTMLElement | null;
      const subTotalHtml = document.querySelector(".sub-total") as HTMLElement;
      
      if (obtenerSubtotal) {
        const obtenerSubtotalText = obtenerSubtotal.textContent?.split("$");
        const subtotal = obtenerSubtotalText ? parseInt(obtenerSubtotalText[1]) : 0;
        console.log(subtotal);
        const target = e.target as HTMLElement; 
        if(target && target.dataset) {
          let id = (target.dataset.id as string).split("-")
          
            new Promise(function(resolve) {
              resolve(restarSubtotal(id));
            })
            .then(function() {
              const productoElement = document.querySelector(`[data-id="producto-${id[1]}"]`) as HTMLElement | null;
              if (productoElement) {
                productoElement.parentNode?.removeChild(productoElement);
              }
    
              localStorage.removeItem(`producto-${id[1]}`);
              const getIdsJSON = localStorage.getItem("productoIds");
              console.log(getIdsJSON)
              if (getIdsJSON) {
                const getIds = JSON.parse(getIdsJSON);
                const filteredIds = getIds.filter((elementId: string) => elementId !== (id[1]));
                console.log(filteredIds);
                localStorage.removeItem("productoIds");
                if (filteredIds.length > 0) {
                  localStorage.setItem("productoIds", JSON.stringify(filteredIds));
                }
              }
    
              mostrarNumeroArticulosHtml();
              if (location.pathname === "/tienda.html") {
                deshabilitarBtnAgregar(id[1], false);
              }
            });
          }
    
          function restarSubtotal(id: string[]) {
            const obtenerCosto = document.querySelector(`[data-id="price-${id[1]}"]`) as HTMLElement;
            console.log(obtenerCosto);
            if (obtenerCosto) {
              const obtenerCostoText = obtenerCosto.textContent?.split("$");
              if (obtenerCostoText) {
                const costo = parseInt(obtenerCostoText[1]);
                const resta = subtotal - costo;
                subTotalHtml.innerHTML = `$${resta}`;
              }
            }
          }
        }
      });
    }
  }

export function getProductosLocal() {
  llenarIds();
  const promise = new Promise(function (resolve) {
    resolve(traerIdsLocalStorage(arrayIds))
  })
  promise
    .then(function () {
      htmlCarritoLocalStorage()
  })
}
