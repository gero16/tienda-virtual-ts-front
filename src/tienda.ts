export let productList : Producto[] = []
export let arrayIds : Array<number> = []

interface Producto {
    id: number;
    name: string;
    image: string;
    category: string;
    price: number;
    stock: number;
    cantidad: number;
}

export async function fetchProducts() : Promise <Producto[]> {
    let productos = await (await fetch('http://localhost:3000/api/productos')).json()
  
    let { registros } = productos;
  
    productList = registros;
    console.log(productList)
    return productList;
  }

  window.onload = async () => {
    console.log("hola")
    const productos = await fetchProducts()
    console.log(productos)
  }