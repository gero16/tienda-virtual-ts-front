export let productList = []
export let arrayIds = []

export let total = 0;
export let subTotal = 0;
let sumaSub = 0;
let articulos = 0;
let datosProductosAgregados = []


const productosCarrito = document.querySelector(".productos-carrito");
const numbCompras = document.querySelector('.numero-compras')
const subTotalHtml = document.querySelector('.sub-total')

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
  

export function mostrarNumeroArticulosHtml () {
const storedData = localStorage.getItem("productoIds");
let getIds: string[] = []; // Inicializamos como un array vacío de strings

if (storedData) {
try {
  getIds = JSON.parse(storedData) as string[];
  // Ahora 'getIds' contendrá el valor parseado como un array de strings
} catch (error) {
  // Manejo de errores en caso de que la cadena no sea un JSON válido
  console.error("Error al parsear los datos del localStorage:", error);
}
}
  
  if (numbCompras) {
      if (getIds) {
      numbCompras.textContent = getIds.length.toString();
      } else {
      numbCompras.textContent = "0";
      }
  }

}