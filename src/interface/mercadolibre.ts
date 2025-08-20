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
    images: Array<{
        id: string;
        url: string;
        high_quality: string;
        _id?: string; // Opcional porque MongoDB lo genera automáticamente
    }>;
}

export interface Order {
  items: Producto[];
}