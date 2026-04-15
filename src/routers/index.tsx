import { HasDone } from '@/pages/hasDone';
import { Login } from '@/pages/login';
import { SEMaxgraph } from '@/pages/structure/structureDiagram';
import { ListTodo } from '@/pages/todoList';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path:'/login',
    element:<Login />
  },
  {
    path: '/todo',
    element: <ListTodo />,
    children:[
      {
        path:'hasDone',
        element:<HasDone />
      }
    ]
  },
  {
    path: '/diagram',
    element: <SEMaxgraph />,
  },
]);


// 导出路由提供器组件
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;