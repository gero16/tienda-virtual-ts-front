//import { createElementHtml } from "./helper-tienda";
// import { Producto } from "./helpers";
let divPedido : HTMLDivElement | null = document.querySelector(".contenido-pedido");
let datosProductosAgregados : Array<Producto> = []
let productoIds :Array<string>= [];

let envio : number = 0;
let total : number = 0;
let subTotal : number = 0
let sumaSubTotal : number = 0;

export interface Producto {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  cantidad: number;
}

interface ElementOptions {
  element: string;
  classname?: string[];
  content?: string;
  dataset?: string;
  src?: string;
}

interface InputElementOptions extends ElementOptions {
  element: 'input';
  value?: number;
}

export function createElementHtml(options: ElementOptions | InputElementOptions): HTMLElement {
const { element, classname, content, dataset, src } = options;

const elementoEtiqueta = document.createElement(element);

if (classname) {
  classname.forEach((clase) => {
    elementoEtiqueta.classList.add(clase);
  });
}

if (content) elementoEtiqueta.textContent = content;

if (element === 'img' && src) {
  if (elementoEtiqueta instanceof HTMLImageElement) {
    elementoEtiqueta.src = src;
  }
}

if (element === 'input' && 'value' in options && options.value) {
  if (elementoEtiqueta instanceof HTMLInputElement) {
    elementoEtiqueta.value = options.value.toString(); // Convertimos a cadena
  }
}

if (dataset) elementoEtiqueta.dataset.id = dataset;

return elementoEtiqueta;
}

window.onload = async () => {
  const promise = new Promise <Producto[]> (function (resolve) {
    // Aquí ejecutamos la función y resolvemos la promesa con los datos
    let productoIdsJSON = localStorage.getItem(`productoIds`);
    console.log(productoIdsJSON);
    if (productoIdsJSON) {
      productoIds = JSON.parse(productoIdsJSON);
      productoIds.forEach(id => {
        const dataJSON = localStorage.getItem(`producto-${id}`);
        console.log(dataJSON);
        if (dataJSON) {
          console.log(dataJSON);
          const data = JSON.parse(dataJSON);
          datosProductosAgregados.push(data);
        }
      });
    }

    // Resolvemos la promesa con los datos
    resolve(datosProductosAgregados);
  });
  // data es como (e) => {}
  promise.then(function (data: Producto[])  {
    console.log(data); // Aquí tenemos los datos resueltos
    checkoutHTML(data);
  });
};


function checkoutHTML(products: Producto[]) {
    let pedidoHTML = "";
    const ids: [number, number][] = [];
  
  
    products.forEach((product) => {
      const { name, image, price, id, cantidad } = product;
      subTotal = price * cantidad;
      sumaSubTotal = sumaSubTotal + price * cantidad;
      total = sumaSubTotal + envio;
      const idsCantidad: [number, number] = [id, cantidad];
      ids.push(idsCantidad);
  
      // Crear elementos HTML con createElementHtml
      const productoPedido = createElementHtml({ element: "div", classname: ["producto-pedido"] });
      const imagenPedido = createElementHtml({ element: "img", classname: ["imagen-pedido"], src: `../${image}` });
      const infoPedido = createElementHtml({ element: "div", classname: ["info-pedido"] });
      const nombrePedido = createElementHtml({ element: "h3", classname: ["nombre-pedido"], content: name });
      const cantidadPedido = createElementHtml({ element: "p", classname: ["cantidad-pedido"], content: `Cantidad:${cantidad}` });
      const precioPedido = createElementHtml({ element: "p", classname: ["precio-pedido"], content: `$${subTotal}` });
  
      infoPedido.append(nombrePedido, cantidadPedido, precioPedido);
      productoPedido.append(imagenPedido, infoPedido);
      pedidoHTML += productoPedido.outerHTML;
    });

    // Agregar pedidoHTML al contenedor deseado, por ejemplo:
    if (divPedido) divPedido.innerHTML = pedidoHTML;

     // Promocion
     const divPromo = createElementHtml({element : "div", classname: ["codigo-promo"] });
     const promoSpan = createElementHtml({element : "span", content :"Código de promoción" });
     const promoInput = createElementHtml({element : "input", classname: ["input-promo"]});
     divPromo.append(promoSpan, promoInput)
     // Pedido
     const divTotalPedido = createElementHtml({ element: "div", classname: ["div-total-pedido"] });
     const ulTotal = createElementHtml({  element: "ul" });
     // Subtotal
     const liSub = createElementHtml({ element: "li" });
     const pCategoriaSub = createElementHtml({element: "p", content: "SubTotal:" });
     const pSub = createElementHtml({element: "p", content: "$ " + sumaSubTotal});
     // Envío
     const liEnvio = createElementHtml({ element: "li" });
     const pCategoriaEnvio = createElementHtml({element: "p",content: "Envío:" });
     const pEnvio = createElementHtml({ element: "p" });
     pEnvio.textContent = envio === 0 ? "Gratis!" : "$ " + envio;

     // Total
     const liTotal = createElementHtml({ element: "li", classname: ["liTotal"] });
     const pCategoriaTotal = createElementHtml({element: "h2", content: "Total:" });
     const pTotal = createElementHtml({ element: "p" });
     pTotal.textContent = "$ " + total;

     // Agregar elementos al DOM
     liSub.append(pCategoriaSub, pSub);
     liEnvio.append(pCategoriaEnvio, pEnvio);
     liTotal.append(pCategoriaTotal, pTotal);
     ulTotal.append(liSub, liEnvio, liTotal);
     divTotalPedido.append(divPromo, ulTotal);
     if (divPedido) {
       divPedido.appendChild(divPromo);
       divPedido.appendChild(divTotalPedido);
     }
  }
  
  