import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import Modal from 'react-modal';

import { store, history } from './app/store';
import { I18N, i18n } from './app/i18n';

import './index.css';
import { App } from './App';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
    <I18N>
      <App history={history} />
    </I18N>
  </Provider>
);

Modal.setAppElement('#root');

const configuration = {
  onSuccess: (registration: ServiceWorkerRegistration) => {
    console.log('SW', 'onSuccess');
  },
  onUpdate: (registration: ServiceWorkerRegistration) => {
    console.log('SW', 'onUpdate');
    if (registration && registration.waiting) {
      if (
        window.confirm(`${i18n.t('pages:index.serviceWorker.updateMessage')}`)
      ) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  },
};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register(configuration);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
