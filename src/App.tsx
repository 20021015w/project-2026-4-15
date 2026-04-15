import React from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './app/store';
import AppRouter from './routers';
import './styles/App.css';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <div className="app">
          <AppRouter />
        </div>
      </ConfigProvider>
    </Provider>
  );
}

export default App;