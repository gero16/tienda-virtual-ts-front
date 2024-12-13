import { mostrarNumeroArticulosHtml } from "./helper-tienda"
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
  

  const accessToken = 'TEST-3488859500794386-010715-320f2dd75257891352172318a1ed84fd-370206533';
  const userId = '370206533';

  const numeroAplicacionApi = "6781299248679448"
  const numeroAplicacionGero = "3488859500794386"
  


  const fetchProductoML = (idPublicacion : string) => {
  
    const url = `https://api.mercadolibre.com/items/${ idPublicacion }`; 

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ accessToken }`
        }
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

  }

  
const InfoUsuarioML = () => {
  const url = 'https://api.mercadolibre.com/users/me';

  fetch(url, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${accessToken}`
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
    console.log(data)
      const userId = data.id;
      console.log(`Your User ID: ${userId}`);
  })
  .catch(error => console.error('Error:', error));
}
  

const fetchInfo = () => {

  const url = `https://api.mercadolibre.com/users/${ userId }/items/search`;

  fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log(data);
})
.catch(error => console.error('Error:', error));
}



window.onload = () => {
    new Promise (function(resolve) {
      resolve( getProductosLocal())
    })
    .then(function() {
      //mostrarSubtotalHtml()
      mostrarNumeroArticulosHtml()
      //borrarItemCarrito()
      eventoRestarEnTodos() 
      eventoSumarEnTodos()
    })

    
    InfoUsuarioML()
    fetchProductoML("MLU685978524")
    //fetchInfo()
    
  }
  