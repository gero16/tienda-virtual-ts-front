import { Producto, Variante } from '../interface/mercadolibre';

let productoActual: Producto | null = null;
let varianteSeleccionada: Variante | null = null;

// Obtener el ID del producto de la URL
function obtenerIdProducto(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Cargar los datos del producto
async function cargarProducto(id: string): Promise<void> {
    try {
        console.log('ID del producto:', id);
        console.log('URL de la API:', `https://tienda-virtual-ts-back-production.up.railway.app/ml/productos/${id}`);
        
        const response = await fetch(`https://tienda-virtual-ts-back-production.up.railway.app/ml/productos/${id}`);
        
        console.log('Status de la respuesta:', response.status);
        console.log('Headers:', response.headers);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const producto = await response.json();
        console.log('Producto recibido:', producto);
        
        productoActual = producto;
        mostrarProducto(producto);
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        mostrarError();
    }
}

// Mostrar la información del producto en la página
function mostrarProducto(producto: Producto): void {
    // Actualizar breadcrumb
    const breadcrumb = document.getElementById('nombre-producto-breadcrumb');
    if (breadcrumb) breadcrumb.textContent = producto.title;
    
    // Imagen principal
    const imagenPrincipal = document.getElementById('imagen-principal') as HTMLImageElement;
    if (imagenPrincipal) imagenPrincipal.src = producto.images[0].url;
    
    // Título
    const titulo = document.getElementById('titulo-producto');
    if (titulo) titulo.textContent = producto.title;

    // Precio
    const precio = document.getElementById('precio-producto');
    if (precio) precio.textContent = `$${producto.price}`;
    
    // Disponibilidad
    const disponibilidad = document.getElementById('disponibilidad-producto');
    if (disponibilidad) {
        disponibilidad.textContent = producto.available_quantity > 0 
        ? `Disponible (${producto.available_quantity} unidades)` 
        : 'Agotado';
        disponibilidad.style.color = producto.available_quantity > 0 ? 'green' : 'red';
    }

    // Descripcion
    const descripcion = document.getElementById('descripcion');
    if (descripcion) descripcion.textContent = `${producto.description}`;
    
    
    // Mostrar variantes
    mostrarVariantes(producto.variantes);
    
    // Configurar cantidad máxima
    const inputCantidad = document.getElementById('cantidad') as HTMLInputElement;
    if (inputCantidad) {
        inputCantidad.max = producto.available_quantity.toString();
    }
    
    // Configurar botón de agregar al carrito
    const btnAgregar = document.getElementById('agregar-carrito') as HTMLButtonElement;
    if (btnAgregar) {
        if (producto.available_quantity === 0) {
            btnAgregar.disabled = true;
            btnAgregar.textContent = 'Agotado';
        } else {
            btnAgregar.addEventListener('click', () => {
                if (varianteSeleccionada && productoActual) {
                    // Aquí puedes adaptar la lógica para manejar variantes en el carrito
                    agregarProductoAlCarrito(productoActual, varianteSeleccionada, parseInt(inputCantidad.value));
                } else {
                    alert('Por favor, selecciona una variante');
                }
            });
        }
    }
}

// Mostrar las opciones de variantes
function mostrarVariantes(variantes: Variante[]): void {
    const contenedorVariantes = document.getElementById('opciones-variantes');
    if (!contenedorVariantes) return;
    
    contenedorVariantes.innerHTML = '';
    
    variantes.forEach(variante => {
        const opcion = document.createElement('div');
        opcion.className = 'variante-option';
        opcion.innerHTML = `
            <strong>Color:</strong> ${variante.color}<br>
            <strong>Talla:</strong> ${variante.size}<br>
            <strong>Stock:</strong> ${variante.stock}
        `;
        
        opcion.addEventListener('click', () => {
            // Deseleccionar la opción anterior
            document.querySelectorAll('.variante-option').forEach(el => {
                el.classList.remove('seleccionada');
            });
            
            // Seleccionar la nueva opción
            opcion.classList.add('seleccionada');
            varianteSeleccionada = variante;
            
            // Actualizar la cantidad máxima según el stock de la variante
            const inputCantidad = document.getElementById('cantidad') as HTMLInputElement;
            if (inputCantidad) {
                inputCantidad.max = variante.stock.toString();
                if (parseInt(inputCantidad.value) > variante.stock) {
                    inputCantidad.value = variante.stock.toString();
                }
            }
        });
        
        contenedorVariantes.appendChild(opcion);
    });
    
    // Seleccionar la primera variante por defecto si hay variantes
    if (variantes.length > 0) {
        (contenedorVariantes.firstChild as HTMLElement)?.click();
    }
}

// Función para agregar producto al carrito (necesitarás adaptar tu lógica existente)
function agregarProductoAlCarrito(producto: Producto, variante: Variante, cantidad: number): void {
    // Aquí necesitas adaptar tu lógica existente del carrito
    // para manejar productos con variantes
    
    // Por ahora, simplemente redirigimos a la tienda
    alert(`Producto "${producto.title}" (${variante.color}, ${variante.size} - Cantidad : ${cantidad} ) agregado al carrito`);
    window.location.href = 'tienda-nueva.html';
}

// Mostrar mensaje de error
function mostrarError(): void {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="error">
                <h2>Error al cargar el producto</h2>
                <p>No se pudo cargar la información del producto. Por favor, intenta nuevamente.</p>
                <a href="tienda-nueva.html">Volver a la tienda</a>
            </div>
        `;
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    const idProducto = obtenerIdProducto();
    
    if (idProducto) {
        cargarProducto(idProducto);
    } else {
        mostrarError();
    }
});