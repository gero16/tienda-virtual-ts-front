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

const getUserId = async () => {
    const url = 'https://api.mercadolibre.com/users/me';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error getting user ID:', error);
    }
};

const getAllItems = async (userId : string ) => {
    const url = `https://api.mercadolibre.com/users/${userId}/items/search`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results; // Asumiendo que las IDs de los artículos están en 'results'
    } catch (error) {
        console.error('Error getting items:', error);
    }
};

const fetchAllItemsData = async () => {
    try {
        const userId = await getUserId();
        if (!userId) return;

        const items = await getAllItems(userId);
        if (!items || items.length === 0) {
            console.log('No items found.');
            return;
        }

        console.log('Items:', items);
    } catch (error) {
        console.error('Error fetching all items data:', error);
    }
};

fetchAllItemsData();


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

    
    //InfoUsuarioML()
    //fetchProductoML("MLU685991736")
    //fetchInfo()
    fetchAllItemsData();

  }
  