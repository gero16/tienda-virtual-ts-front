import { createElementHtml, mostrarNumeroArticulosHtml } from "./helper-tienda";
import { borrarItemCarrito, calcularSubTotalProducto, getProductosLocal,  mostrarSubtotalHtml } from "./helpers";

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
}

// Inicializar variables y estructuras de datos
let productList: Producto[] = []; // Debes inicializar productList con tus productos
let order: Order = { items: [] };
let ids : Array<string> = []



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

function agregarProducto ( productId : number) {
  const product = productList.find((p) => p.id === productId);

  if (!product) return;
  // Obtener información de IDs desde el almacenamiento local
  const getIdsJSON = localStorage.getItem("productoIds");
  const getIds = getIdsJSON ? JSON.parse(getIdsJSON) : [];
  if(getIds) ids = getIds

  // Obtener información del producto desde el almacenamiento local
   const getProductActualizarJSON = localStorage.getItem(`producto-${productId}`);
   const getProductActualizar = getProductActualizarJSON ? JSON.parse(getProductActualizarJSON) : null;
   
   if(!getProductActualizar) {
    // Si hay otras id de otros productos
    ids.push(productId.toString())
    product.stock--
    product.cantidad = 1
    order.items.push(product)
    localStorage.setItem(`producto-${productId}`, JSON.stringify(product));
    localStorage.setItem(`productoIds`, JSON.stringify(ids));

    addCarritoHTML(product);
    deshabilitarBtnAgregar(productId.toString(), true);
  }
   
   eventoSumarEnTodos()
   eventoRestarEnTodos()
   mostrarNumeroArticulosHtml()
   mostrarSubtotalHtml()
   borrarItemCarrito()
}



export function eventoSumarEnTodos() {
  const inputCarrito = document.querySelectorAll(".input-carrito") as NodeListOf<HTMLInputElement>;
  const btnsSumar = document.querySelectorAll(".sumar") as NodeListOf<HTMLSpanElement>;
  console.log("sumar en todos");

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
  const inputCarrito = document.querySelectorAll(".input-carrito") as NodeListOf <HTMLInputElement>;
  const btnsRestar = document.querySelectorAll(".restar") as NodeListOf <HTMLSpanElement>;
  btnsRestar.forEach((btnSumar, index) => {
    btnSumar.addEventListener("click", (e) => {
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


function renderProductosHtml(registros: Producto[]) {
  registros.forEach((registro) => {
    let { id, image, name, price } = registro;
    if(image.includes("img/")) image = `../${image}`
    
    const divProducto = createElementHtml({
      element: "div",
      classname: ["producto", "centrar-texto"],
    }) as HTMLDivElement;

    const img = createElementHtml({
      element: "img",
      src: image
    }) as HTMLImageElement;

    const nombre = createElementHtml({
      element: "p",
      content: `${name} id: ${id}`
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

export function deshabilitarBtnAgregar (id : string, estado : boolean) {
  let btnAgregarCarrito = document.querySelector(`[data-id="${ id }"]`) as HTMLButtonElement
  if(btnAgregarCarrito && estado === true) {
    btnAgregarCarrito.disabled = true;
    btnAgregarCarrito.classList.add("disabled")
  }

  if(btnAgregarCarrito && estado === false) {
    btnAgregarCarrito.disabled = false;
    btnAgregarCarrito.classList.remove("disabled")
  }
}
 


export async function fetchProducts() : Promise <Producto[]> {
    let productos = await (await fetch('http://localhost:3000/api/productos')).json()
    console.log(productos)
    let { registros } = productos;
  
    productList = registros;
    console.log(productList)
    return productList;
}




//let filtradoHTML: string = "";
const filtroPrecio: HTMLInputElement | null = document.querySelector("#precio");
const mostrarPrecio: HTMLElement | null = document.querySelector("#mostrar-precio");
const filtroCategorias: HTMLElement | null = document.querySelector(".filtro-categorias");

function eventoFiltrarCategoria () {
  if (filtroCategorias) {
    filtroCategorias.addEventListener("click", (e) => {
      if (!filtroPrecio) return;
      if (!productosHTML) return;
  
      if(productosHTML) {
  
        productosHTML.innerHTML = " ";
        //iltradoHTML = "";
  
        const nameCategoria: string = (e.target as HTMLElement).id;
        const previousSelected: HTMLElement | null = document.querySelector(".seleccionado");
  
        if (previousSelected) {
          previousSelected.classList.toggle("seleccionado");
          (e.target as HTMLElement).classList.toggle("seleccionado");
          console.log((e.target as HTMLElement).id);
        } else {
          (e.target as HTMLElement).classList.toggle("seleccionado");
        }
  
        if (previousSelected && previousSelected.id === (e.target as HTMLElement).id) {
          previousSelected.classList.remove("seleccionado");
        }
  
        console.log(productList)
        productList.forEach((elemento) => {
          let { name, image, id, category, price } = elemento;
          if(image.includes("img/")) image = `../${image}`

          if (category === nameCategoria && price >= Number(filtroPrecio.value)) {
            console.log("hola")
  
            const divProducto: HTMLElement = createElementHtml ({
                element: "div",
                classname: ["producto", "centrar-texto"]
              });
              
            const img: HTMLElement = createElementHtml({
              element: "img",
              src: image,
            }) as HTMLImageElement
            
            const nombre: HTMLElement = createElementHtml ({
              element : "p",
              content : name
            })
  
            const precio: HTMLElement = createElementHtml({
              element : "p",
              content : `${ price }`
            })
            const button: HTMLElement = createElementHtml({
              element : "button",
              classname : ["add"],
              content : "Agregar Carrito",
              dataset: String(id),
            }) as HTMLButtonElement
            
            divProducto.append(img, nombre, precio, button);
            productosHTML.append(divProducto);
            console.log(productosHTML)
          }
        });
  
        const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".add");
        btns.forEach((element) => element.addEventListener("click", (e) => {
          console.log(e.target);
          const valor = (e.target as HTMLElement)?.dataset?.id;
  
          if(valor) agregarProducto(Number(valor));
        }))
      }
  
    });
  }
  
}

function eventoFiltrarPrecio () {
  if (filtroPrecio) {
    filtroPrecio.addEventListener("click", (e) => {
      const targetValue = (e.target as HTMLInputElement).value
      const precioPrincipal = parseInt(targetValue)
  
      if(mostrarPrecio) mostrarPrecio.textContent = String("$" + precioPrincipal );
      //filtradoHTML = " ";
      if(productosHTML) productosHTML.innerHTML = " ";
      
      const selectedCategory = document.querySelector(".seleccionado")
      if(selectedCategory) {
        productList.forEach((elemento) => {
          let { name, image, id, category, price } = elemento;
          if(image.includes("img/")) image = `../${image}`

          if (precioPrincipal < price && category == selectedCategory.id) {
            const divProducto: HTMLElement = createElementHtml ({
                element: "div",
                classname: ["producto", "centrar-texto"]
              });
              
            const img: HTMLElement = createElementHtml({
              element: "img",
              src: image,
            }) as HTMLImageElement
            
            const nombre: HTMLElement = createElementHtml ({
              element : "p",
              content : name
            })
  
            const precio: HTMLElement = createElementHtml({
              element : "p",
              content : `$ ${ price }`
            })
            const button: HTMLElement = createElementHtml({
              element : "button",
              classname : ["add"],
              content : "Agregar Carrito",
              dataset: String(id),
            }) as HTMLButtonElement
            
            divProducto.append(img, nombre, precio, button);
            if(productosHTML) productosHTML.append(divProducto);
            console.log(productosHTML)
          }

          if (precioPrincipal < price && selectedCategory.id == "mostrar-todo") {
            const divProducto: HTMLElement = createElementHtml ({
                element: "div",
                classname: ["producto", "centrar-texto"]
              });
              
            const img: HTMLElement = createElementHtml({
              element: "img",
              src: image,
            }) as HTMLImageElement
            
            const nombre: HTMLElement = createElementHtml ({
              element : "p",
              content : name
            })
  
            const precio: HTMLElement = createElementHtml({
              element : "p",
              content : `$ ${ price }`
            })
            const button: HTMLElement = createElementHtml({
              element : "button",
              classname : ["add"],
              content : "Agregar Carrito",
              dataset: String(id),
            }) as HTMLButtonElement
            
            divProducto.append(img, nombre, precio, button);
            if(productosHTML) productosHTML.append(divProducto);
            console.log(productosHTML)
          }

        });
      }
    
      
      const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".add");
        btns.forEach((element) => element.addEventListener("click", (e) => {
          console.log(e.target);
          const valor = (e.target as HTMLElement)?.dataset?.id;
  
          if(valor) agregarProducto(Number(valor));
        }))
        
    })
  }
}

window.onload = async () => {

  async function traerProductos () {
    const productos = await fetchProducts()
    renderProductosHtml(productos)
  }
  const promesaTotalProductos =  new Promise (function(resolve) {
    resolve(traerProductos())
  })
  promesaTotalProductos.then( function () {
    eventoFiltrarCategoria()
    eventoFiltrarPrecio()
  })

  const promesaProductosLocal =  new Promise (function(resolve) {
    resolve( getProductosLocal())
  })
  
  promesaProductosLocal.then(function() {
    //mostrarSubtotalHtml()
    mostrarNumeroArticulosHtml()
    borrarItemCarrito()
    eventoRestarEnTodos() 
    eventoSumarEnTodos()
  })
}
