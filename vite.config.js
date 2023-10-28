// vite.config.js
import * as path from 'path';
export default {
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, './index.html'), // Tu página principal
          tienda: path.resolve(__dirname, 'src/tienda.html'), // Tu página de tienda
        },
      },
    },
  }