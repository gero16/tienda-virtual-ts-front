// vite.config.js
import * as path from 'path';
export default {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, './index.html'), // Tu página principal
          tienda: path.resolve(__dirname, 'src/html/tienda.html'), // Tu página de tienda
          checkout: path.resolve(__dirname, 'src/html/checkout.html'),
          contacto: path.resolve(__dirname, 'src/html/contacto.html'),
          tiendaML: path.resolve(__dirname, 'src/html/tiendaML.html'),
          detalleProducto: path.resolve(__dirname, 'src/html/detalleProducto.html')
        },
      },
    },
  }