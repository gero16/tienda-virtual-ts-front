import { Producto, calcularSubTotalProducto, mostrarSubtotalHtml } from "./helpers";

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

export function eventoSumar(id: string) {
  const mas = document.querySelector(`[data-id="sumar-${id}"]`) as HTMLElement | null;

  if (mas) {
    mas.addEventListener("click", () => {
      const input = document.querySelector(`[data-id="input-${id}"]`) as HTMLInputElement | null;

      if (input) {
        let valorInput = Number(input.value);
        valorInput++;

        let getProductActualizarJSON = localStorage.getItem(`producto-${id}`);
        let getProductActualizar =  getProductActualizarJSON ? JSON.parse(getProductActualizarJSON) as Producto : null

        if (getProductActualizar) {
          getProductActualizar.cantidad = valorInput;
          localStorage.removeItem(`producto-${id}`);
          localStorage.setItem(`producto-${id}`, JSON.stringify(getProductActualizar));

          const subTotalProducto  = calcularSubTotalProducto(getProductActualizar);
          const subTotalPorProducto = document.querySelector(`[data-id="price-${id}"]`) as HTMLElement | null;
          
          if (subTotalPorProducto) subTotalPorProducto.innerHTML = `$${subTotalProducto}`;

          mostrarSubtotalHtml();
        }
      }
    });
  }
}

export function eventoRestar(id: string) {
  const menos = document.querySelector(`[data-id="restar-${id}"]`) as HTMLElement | null;

  if (menos) {
    menos.addEventListener("click", () => {
      const input = document.querySelector(`[data-id="input-${id}"]`) as HTMLInputElement | null;

      if (input) {
        console.log(input.value);
        let valorInput = Number(input.value);
        console.log(valorInput);
        valorInput--;

        let getProductActualizarJSON = localStorage.getItem(`producto-${id}`);
        let getProductActualizar =  getProductActualizarJSON ? JSON.parse(getProductActualizarJSON) as Producto : null
        console.log(getProductActualizar)

        if (getProductActualizar) {
          getProductActualizar.cantidad = valorInput;
          localStorage.removeItem(`producto-${id}`);
          localStorage.setItem(`producto-${id}`, JSON.stringify(getProductActualizar));
          console.log(getProductActualizar);

          const subTotalProducto  = calcularSubTotalProducto(getProductActualizar);
          const subTotalPorProducto = document.querySelector(`[data-id="price-${id}"]`) as HTMLElement | null;
          
          if (subTotalPorProducto) subTotalPorProducto.innerHTML = `$${subTotalProducto}`;

          mostrarSubtotalHtml();
        }
      }
    });
  }
}
