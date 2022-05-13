import { createApp, h, provide } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  cache,
  uri: `${import.meta.env.VITE_API}/graphql`,
})

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})
  .use(router)
  .use(createPinia())
  .mount('#app')
