
// https://vite.dev/config/
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Makes the server accessible on local network
    port: 5173,      // You can change this if the port is in use
  },
  

  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
});




// export default defineConfig({
//   plugins: [react()],

//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
// });

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tsconfigPaths from 'vite-tsconfig-paths'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   server: {
//     host: '0.0.0.0',  // Makes the server accessible from all devices on the local network
//     port: 5173,       // Adjust the port if necessary
//   },
// })
