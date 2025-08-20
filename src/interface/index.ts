export interface ElementOptions {
  element: string;
  classname?: string[];
  content?: string;
  dataset?: string;
  src?: string;
 style?: string; // Agrega esta línea
}

export interface InputElementOptions extends ElementOptions {
  element: 'input';
  value?: number;
}

 export interface Producto {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  cantidad: number;
}


export interface CompraProducto {
  id: number;
  cantidad: number;
}
