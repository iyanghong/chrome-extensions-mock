import { createApp } from 'vue';
import App from './App.vue';
import NaiveUi from '../plugins/NaiveUi';
import 'virtual:windi.css'
import 'virtual:windi-devtools'

const app =createApp(App)



app.use(NaiveUi)
app.mount('#app');
