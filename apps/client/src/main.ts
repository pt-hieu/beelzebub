import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { generateClasses } from '@formkit/themes'
import { defaultConfig, plugin } from '@formkit/vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import { createApp, h, provide } from 'vue'
import { createUploadLink } from 'apollo-upload-client'
import App from './App.vue'
import router from './router'
import theme from './theme'

const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  cache,
  // uri: `${import.meta.env.VITE_API}/graphql`,
  // @ts-ignore
  link: createUploadLink({
    uri: `${import.meta.env.VITE_API}/graphql`,
  }),
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
