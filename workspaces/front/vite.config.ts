import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()
    /* {
      name: 'file-export-plugin',
      configureServer(server) {
        server.middlewares.use('/download/:id', async (req, res) => {
          const url = require('url');
          console.log('Request URL:', req.url);

          const parseUrl = url.parse(req.url);
          const pathSegments = parseUrl.pathname.split('/');

          const fileId = pathSegments[pathSegments.length - 1]; // path is /download/:id et on récupère l'id
          const filePath = fileId;  // On récupère le chemin du fichier
          console.log('File path:', filePath);
          
          if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('File not found');
          }
        
          try {
            const contentType = filePath.endsWith('.csv') ? 'text/csv' : 'application/pdf'; // On détermine le type de fichier
            const readStream = fs.createReadStream(filePath);
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`);
            readStream.pipe(res);
          } catch (error) {
            console.error('Error serving file:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error while serving file');
          }
        });
      }
    } */
  ],
  
  resolve: {
    alias: {
      '@components': '/src/js/components',
      '@hooks': '/src/js/hooks',
      '@shared': '/src/../../shared',
      '@app': '/src',
    },
  },
  define: {
    'process.env': {}
  }
})
