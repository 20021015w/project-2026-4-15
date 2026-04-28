import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

// 使用lazy加载组件
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('@/pages/login'));
const ListTodo = lazy(() => import('@/pages/todoList'));
const HasDone = lazy(() => import('@/pages/hasDone'));
const SEMaxgraph = lazy(() => import('@/pages/structure/structureDiagram'))

// 加载中组件
const Loading = () => <div>Loading...</div>;

// 创建路由配置
const router = createBrowserRouter([
  {
    path:'/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/home',
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path:'/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/todo',
    element: (
      <Suspense fallback={<Loading />}>
        <ListTodo />
      </Suspense>
    ),
    children:[
      {
        path:'hasDone',
        element: (
          <Suspense fallback={<Loading />}>
            <HasDone />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/diagram',
    element: (
      <Suspense fallback={<Loading />}>
        <SEMaxgraph />
      </Suspense>
    ),
  },
]);

// 导出路由提供器组件
const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;