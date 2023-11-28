import { createApp } from 'vue';
import '../style.css';
import App from './App.vue';
import NaiveUi from '../plugins/NaiveUi';
import 'virtual:windi.css'
import 'virtual:windi-devtools'

const app =createApp(App)



app.use(NaiveUi)
app.mount('#app');
