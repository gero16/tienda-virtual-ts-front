import { eventoRestar, mostrarNumeroArticulosHtml } from "./helper-tienda"
import { getProductosLocal } from "./helpers"
import { eventoRestarEnTodos, eventoSumarEnTodos } from "./tienda"

console.log("hola")

const carritoHTML = document.querySelector(".carritoHTML") as HTMLDivElement
const ocultarCarrito = document.querySelector(".ocultar-carrito") as HTMLSpanElement
const iconoCarrito = document.querySelector(".carrito") as HTMLImageElement



iconoCarrito.addEventListener("click", () => {
    carritoHTML.style.display = "block";
  });
  
  ocultarCarrito.addEventListener("click", () => {
    carritoHTML.style.display = "none";
  });
  

  
window.onload = () => {
    new Promise (function(resolve, reject) {
      resolve( getProductosLocal())
    })
    .then(function(e) {
      //mostrarSubtotalHtml()
      mostrarNumeroArticulosHtml()
      //borrarItemCarrito()
      eventoRestarEnTodos() 
      eventoSumarEnTodos()
    
    })
  }
  