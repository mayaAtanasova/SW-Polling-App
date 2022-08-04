import { Provider } from 'react-redux';
import store from './store/store';
import { useMySelector } from './hooks/useReduxHooks';

import './App.css';
import AppView from './views/AppView';
import AuthView from './views/AuthView';

const AppWrapper = () => {

  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}


const App = () => {
  const { isAuthenticated } = useMySelector((state: any) => state.auth);

  return (
    isAuthenticated ? <AppView /> : <AuthView />
  );
}

export default App;
