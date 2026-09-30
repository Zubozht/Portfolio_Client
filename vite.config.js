import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(
  {
  plugins: 
  [
    react(), 
    VitePWA(
      {
        manifest:
        {
          name:"Marchenko Photo",
          short_name:"Marchenko Photo",
          theme_color:"#efefef",
          icons:
          [
            {
              src:"src/assets/Logos/portfoliologo.png",
              sizes:"512*512",
              type:"image/png",
              purpose:"any maskable"
            }
          ]
        },
        /*workbox:
        {
          runtimeCaching: 
          [
            {
              urlPattern: ({ url }) => {return url.hostname.split(".")[0]==="api"},
              handler: "CacheFirst",
              options: 
              {
                cacheName: "api-cache",
                cacheableResponse: { statuses: [0, 200] }
              }
            }
          ]
        }*/
      }
    )
  ],
  server: {host: true, port:5173}
})
