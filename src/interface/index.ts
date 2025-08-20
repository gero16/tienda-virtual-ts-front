export interface ElementOptions {
  element: string;
  classname?: string[];
  content?: string;
  dataset?: string;
  src?: string;
  style?: string;
  id?: string;
  type?: string;
  onclick?: (event: Event) => void;
  value?: string | number;
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
