import { createApp, h, provide } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { plugin, defaultConfig } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import theme from './theme'
import { MotionPlugin } from '@vueuse/motion'
import VueSSE from 'vue-sse'

const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  cache,
  uri: `${import.meta.env.VITE_API}/graphql`,
})

const classes = generateClasses(theme)

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})
  .use(router)
  .use(MotionPlugin)
  .use(
    plugin,
    defaultConfig({
      config: {
        classes,
      },
    }),
  )
  .use(createPinia())
  .mount('#app')
