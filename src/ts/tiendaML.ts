import { createElementHtml, mostrarNumeroArticulosHtml } from "./helper-tienda";
import { borrarItemCarrito, calcularSubTotalProducto, getProductosLocal,  mostrarSubtotalHtml } from "./helpers";

// Interfaces para los nuevos datos
export interface Variante {
    _id: string;
    id: string;
    __v: number;
    color: string;
    image: string;
    product_id: string;
    size: string;
    stock: number;
}

export interface Producto {
    _id: string;
    ml_id: string;
    __v: number;
    available_quantity: number;
    main_image: string;
    price: number;
    status: string;
    title: string;
    variantes: Variante[];
    cantidad?: number;
    categoria?: string; // Necesitarás mapear esto según tus categorías
}

interface Order {
  items: Producto[];
}

// Inicializar variables y estructuras de datos
let productList: Producto[] = [];
let order: Order = { items: [] };
let ids: Array<string> = [];

const productosHTML = document.querySelector(".productos");
const productosCarrito = document.querySelector(".productos-carrito");

function addCarritoHTML(product: Producto) {
  let { main_image, title, price, _id } = product;

  // Caja Producto
  const imgCarrito = createElementHtml({
    element: "img", 
    classname: ["img-comprar"],   
    src: main_image
  });
    
  // Seccion Contenido
  const divContenidoCarrito = createElementHtml({
    element: "div", 
    classname: ["div-contenido-carrito", "centrar-texto"] 
  });
  
  const nombreProducto = createElementHtml({
    element: "p", 
    content: title
  });
  
  const precioProducto = createElementHtml({
    element: "p", 
    content: `$${price}`,
    dataset: `price-${_id}`
  });
  
  divContenidoCarrito.append(nombreProducto, precioProducto);

  // Seccion Stock
  const divStock = createElementHtml({
    element: "div", 
    classname: ["stock"]
  });
  
  const spanSumar = createElementHtml({ 
    element: "span", 
    classname: ["sumar"], 
    content: "+", 
    dataset: `sumar-${_id}`
  });
  
  const spanRestar = createElementHtml({ 
    element: "span", 
    classname: ["restar"], 
    content: "-", 
    dataset: `restar-${_id}`
  });
  
  const inputCarrito = createElementHtml({ 
    element: "input", 
    classname: ["input-carrito", "centrar-texto"], 
    dataset: `input-${_id}`
  }) as HTMLInputElement;
  
  if (inputCarrito) {
    const numericValue = 1;
    inputCarrito.value = numericValue.toString();
  }
  
  divStock.append(spanRestar, inputCarrito, spanSumar);
  divContenidoCarrito.append(divStock);

  // Borrar
  const btnBorrar = createElementHtml({
    element: "span", 
    classname: ["btn-borrar"],  
    content: "x", 
    dataset: `borrar-${_id}`
  });
  
  // Agregar img, y divs al producto-carrito
  const productoCarrito = createElementHtml({
    element: "div", 
    classname: ["producto-carrito"], 
    dataset: `producto-${_id}`
  });
  
  productoCarrito.append(imgCarrito, divContenidoCarrito, btnBorrar);
  if (productosCarrito) productosCarrito.append(productoCarrito);
  
  mostrarNumeroArticulosHtml();
}

export function agregarProducto(productId: string) {
  const product = productList.find((p) => p._id === productId);

  if (!product) return;
  
  // Obtener información de IDs desde el almacenamiento local
  const getIdsJSON = localStorage.getItem("productoIds");
  const getIds = getIdsJSON ? JSON.parse(getIdsJSON) : [];
  if (getIds) ids = getIds;

  // Obtener información del producto desde el almacenamiento local
  const getProductActualizarJSON = localStorage.getItem(`producto-${productId}`);
  const getProductActualizar = getProductActualizarJSON ? JSON.parse(getProductActualizarJSON) : null;
  
  if (!getProductActualizar) {
    // Si hay otras id de otros productos
    ids.push(productId);
    product.available_quantity--;
    product.cantidad = 1;
    order.items.push(product);
    localStorage.setItem(`producto-${productId}`, JSON.stringify(product));
    localStorage.setItem(`productoIds`, JSON.stringify(ids));

    addCarritoHTML(product);
    deshabilitarBtnAgregar(productId, true);
  }
  
  eventoSumarEnTodos();
  eventoRestarEnTodos();
  mostrarNumeroArticulosHtml();
  mostrarSubtotalHtml();
  borrarItemCarrito();
}

export function eventoSumarEnTodos() {
  const inputCarrito = document.querySelectorAll(".input-carrito") as NodeListOf<HTMLInputElement>;
  const btnsSumar = document.querySelectorAll(".sumar") as NodeListOf<HTMLSpanElement>;

  btnsSumar.forEach((btnSumar, index) => {
    btnSumar.addEventListener("click", (e) => {
      const target = e.target as HTMLElement; 

      if (inputCarrito[index] && target && target.dataset) {
        inputCarrito[index].value = String(Number(inputCarrito[index].value) + 1);
        const idProducto = (target.dataset.id as string).split("-");
        const productId = idProducto[1];

        const getProductActualizarJSON = localStorage.getItem(`producto-${productId}`);
        if (getProductActualizarJSON) {
          const getProductActualizar = JSON.parse(getProductActualizarJSON);
          getProductActualizar.cantidad = Number(inputCarrito[index].value);
          localStorage.setItem(`producto-${productId}`, JSON.stringify(getProductActualizar));

          const subTotalProducto = calcularSubTotalProducto(getProductActualizar);

          const inputPrecio = document.querySelector(`[data-id="price-${productId}"]`);
          if (inputPrecio) {
            inputPrecio.innerHTML = `$${subTotalProducto}`;
          }

          mostrarSubtotalHtml();
        }
      }
    });
  });
}

export function eventoRestarEnTodos() {
  const inputCarrito = document.querySelectorAll(".input-carrito") as NodeListOf<HTMLInputElement>;
  const btnsRestar = document.querySelectorAll(".restar") as NodeListOf<HTMLSpanElement>;
  
  btnsRestar.forEach((btnRestar, index) => {
    btnRestar.addEventListener("click", (e) => {
      const target = e.target as HTMLElement; 

      if (inputCarrito[index] && target && target.dataset) {
        inputCarrito[index].value = String(Number(inputCarrito[index].value) - 1);
        const idProducto = (target.dataset.id as string).split("-");
        const productId = idProducto[1];

        const getProductActualizarJSON = localStorage.getItem(`producto-${productId}`);
        if (getProductActualizarJSON) {
          const getProductActualizar = JSON.parse(getProductActualizarJSON);
          getProductActualizar.cantidad = Number(inputCarrito[index].value);
          localStorage.setItem(`producto-${productId}`, JSON.stringify(getProductActualizar));
          
          const subTotalProducto = calcularSubTotalProducto(getProductActualizar);
          const inputPrecio = document.querySelector(`[data-id="price-${productId}"]`);

          if (inputPrecio) inputPrecio.innerHTML = `$${subTotalProducto}`;
   
          mostrarSubtotalHtml();
        }
      }
    });
  });
}

function determinarCategoria(titulo: string): string {
  const tituloMinusculas = titulo.toLowerCase();
  
  if (tituloMinusculas.includes('champión') || tituloMinusculas.includes('zapato') || tituloMinusculas.includes('calzado')) {
    return 'championes';
  } else if (tituloMinusculas.includes('bermuda') || tituloMinusculas.includes('short')) {
    return 'bermudas';
  } else if (tituloMinusculas.includes('gorro') || tituloMinusculas.includes('gorra')) {
    return 'gorros';
  } else if (tituloMinusculas.includes('media') || tituloMinusculas.includes('calcetín')) {
    return 'medias';
  } else if (tituloMinusculas.includes('remera') || tituloMinusculas.includes('camiseta')) {
    return 'remeras';
  } else if (tituloMinusculas.includes('mochila')) {
    return 'mochilas';
  } else if (tituloMinusculas.includes('pantalón') || tituloMinusculas.includes('pantalon')) {
    return 'pantalones';
  }
  
  return 'mostrar-todo';
}

function renderProductosHtml(registros: Producto[]) {
  registros.forEach((registro) => {
    let { _id, main_image, images, title, price } = registro;
    const categoria = determinarCategoria(title);
    
    const divProducto = createElementHtml({
      element: "div",
      classname: ["producto", "centrar-texto"],
    }) as HTMLDivElement;

    // Hacer el producto clickeable (excepto el botón de carrito)
    divProducto.style.cursor = 'pointer';
    divProducto.addEventListener('click', (e) => {
      // Evitar navegación cuando se hace click en el botón de carrito
      if (!(e.target as HTMLElement).closest('.add')) {
        window.location.href = `detalleProducto.html?id=${_id}`;
      }
    });

    const img = createElementHtml({
      element: "img",
      src: images[0].url,
      style: "width: 100%; height: 200px; object-fit: cover;",
      classname: ["img-ml"],
    }) as HTMLImageElement;

    const nombre = createElementHtml({
      element: "p",
      content: title,
      style: "margin: 10px 0; font-weight: bold;"
    }) as HTMLParagraphElement;

    const precio = createElementHtml({
      element: "p",
      content: `$${price}`,
      style: "color: #2c5530; font-weight: bold; margin: 5px 0;"
    }) as HTMLParagraphElement;

    const button = createElementHtml({
      element: "button",
      classname: ["add"],
      content: "Agregar Carrito",
      dataset: _id,
      style: "background: #2c5530; color: white; border: none; padding: 8px 15px; cursor: pointer; border-radius: 4px;"
    }) as HTMLButtonElement;

    divProducto.setAttribute('data-category', categoria);
    divProducto.append(img, nombre, precio, button);
    if (productosHTML) productosHTML.append(divProducto);
  });

  // Configurar event listeners para los botones de carrito
  const btns = document.querySelectorAll(".add");
  btns.forEach((btnAgregar) => {
    btnAgregar.addEventListener("click", (e) => {
      e.stopPropagation(); // Evitar que el click se propague al div producto
      if (e.target instanceof HTMLElement) {
        const datasetId = e.target.dataset.id;
        if (datasetId) agregarProducto(datasetId);
      }
    });
  });
}

export function deshabilitarBtnAgregar(id: string, estado: boolean) {
  let btnAgregarCarrito = document.querySelector(`[data-id="${id}"]`) as HTMLButtonElement;
  if (btnAgregarCarrito && estado === true) {
    btnAgregarCarrito.disabled = true;
    btnAgregarCarrito.classList.add("disabled");
  }

  if (btnAgregarCarrito && estado === false) {
    btnAgregarCarrito.disabled = false;
    btnAgregarCarrito.classList.remove("disabled");
  }
}

export async function fetchProducts(): Promise<Producto[]> {
  try {
    const response = await fetch('https://tienda-virtual-ts-back-production.up.railway.app/ml/productos');
    const productos = await response.json();
    console.log(productos)
    console.log("Productos recibidos:", productos);
    productList = productos;
    
    return productList;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

const filtroPrecio: HTMLInputElement | null = document.querySelector("#precio");
const mostrarPrecio: HTMLElement | null = document.querySelector("#mostrar-precio");
const filtroCategorias: HTMLElement | null = document.querySelector(".filtro-categorias");

function eventoFiltrarCategoria() {
  if (filtroCategorias) {
    filtroCategorias.addEventListener("click", (e) => {
      if (!filtroPrecio || !productosHTML) return;
  
      productosHTML.innerHTML = "";
  
      const categoriaId: string = (e.target as HTMLElement).id;
      const previousSelected: HTMLElement | null = document.querySelector(".seleccionado");
  
      if (previousSelected) {
        previousSelected.classList.remove("seleccionado");
      }
      (e.target as HTMLElement).classList.add("seleccionado");
  
      const precioFiltro = Number(filtroPrecio.value);
      
      // Filtrar productos según categoría y precio
      productList.forEach((producto) => {
        const productoElement = document.querySelector(`[data-id="${producto._id}"]`)?.closest('.producto') as HTMLElement;
        const categoriaProducto = productoElement?.getAttribute('data-category') || determinarCategoria(producto.title);
        
        if ((categoriaId === "mostrar-todo" || categoriaId === categoriaProducto) && 
            producto.price >= precioFiltro) {
          
          const divProducto: HTMLElement = createElementHtml({
            element: "div",
            classname: ["producto", "centrar-texto"]
          });
          
          const img: HTMLElement = createElementHtml({
            element: "img",
            src: producto.main_image,
          }) as HTMLImageElement;
          
          const nombre: HTMLElement = createElementHtml({
            element: "p",
            content: producto.title
          });
  
          const precio: HTMLElement = createElementHtml({
            element: "p",
            content: `$${producto.price}`
          });
          
          const button: HTMLElement = createElementHtml({
            element: "button",
            classname: ["add"],
            content: "Agregar Carrito",
            dataset: producto._id,
          }) as HTMLButtonElement;
          
          divProducto.setAttribute('data-category', categoriaProducto);
          divProducto.append(img, nombre, precio, button);
          productosHTML.append(divProducto);
        }
      });
  
      const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".add");
      btns.forEach((element) => element.addEventListener("click", (e) => {
        const valor = (e.target as HTMLElement)?.dataset?.id;
        if (valor) agregarProducto(valor);
      }));
    });
  }
}

function eventoFiltrarPrecio() {
  if (filtroPrecio && mostrarPrecio) {
    filtroPrecio.addEventListener("input", (e) => {
      const targetValue = (e.target as HTMLInputElement).value;
      const precioPrincipal = parseInt(targetValue);
  
      mostrarPrecio.textContent = `$${precioPrincipal}`;
      
      if (productosHTML) productosHTML.innerHTML = "";
      
      const selectedCategory = document.querySelector(".seleccionado");
      const categoriaId = selectedCategory ? selectedCategory.id : "mostrar-todo";
      
      productList.forEach((producto) => {
        const categoriaProducto = determinarCategoria(producto.title);
        
        if (precioPrincipal <= producto.price && 
            (categoriaId === "mostrar-todo" || categoriaId === categoriaProducto)) {
          
          const divProducto: HTMLElement = createElementHtml({
            element: "div",
            classname: ["producto", "centrar-texto"]
          });
          
          const img: HTMLElement = createElementHtml({
            element: "img",
            src: producto.main_image,
          }) as HTMLImageElement;
          
          const nombre: HTMLElement = createElementHtml({
            element: "p",
            content: producto.title
          });
  
          const precio: HTMLElement = createElementHtml({
            element: "p",
            content: `$${producto.price}`
          });
          
          const button: HTMLElement = createElementHtml({
            element: "button",
            classname: ["add"],
            content: "Agregar Carrito",
            dataset: producto._id,
          }) as HTMLButtonElement;
          
          divProducto.setAttribute('data-category', categoriaProducto);
          divProducto.append(img, nombre, precio, button);
          if (productosHTML) productosHTML.append(divProducto);
        }
      });
  
      const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".add");
      btns.forEach((element) => element.addEventListener("click", (e) => {
        const valor = (e.target as HTMLElement)?.dataset?.id;
        if (valor) agregarProducto(valor);
      }));
    });
  }
}

window.onload = async () => {
  async function traerProductos() {
    const productos = await fetchProducts();
    renderProductosHtml(productos);
  }
  
  const promesaTotalProductos = new Promise(function(resolve) {
    resolve(traerProductos());
  });
  
  promesaTotalProductos.then(function() {
    eventoFiltrarCategoria();
    eventoFiltrarPrecio();
  });

  const promesaProductosLocal = new Promise(function(resolve) {
    resolve(getProductosLocal());
  });
  
  promesaProductosLocal.then(function() {
    mostrarNumeroArticulosHtml();
    borrarItemCarrito();
    eventoRestarEnTodos(); 
    eventoSumarEnTodos();
  });
};