import { defineConfig } from 'astro/config';

export default defineConfig({
  server: {
    port: 3001,
    host: true 
  },
  vite: {
    server: {
      allowedHosts: ['pollution.arungeorgesaji.hackclub.app']
    }
  }
});
