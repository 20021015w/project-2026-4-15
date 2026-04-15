// 假数据存储

export const mockData = {
  // 用户数据
  users: [
    {
      id: '1',
      name: '张三',
      gander: true,
      createTime: '2024-01-01 10:00:00',
      updateTime: '2024-04-01 15:30:00',
      role: 'admin',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '2',
      name: '李四',
      gander: false,
      createTime: '2024-02-01 09:00:00',
      updateTime: '2024-03-15 14:20:00',
      role: 'user',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '3',
      name: '王五',
      gander: true,
      createTime: '2024-03-01 11:00:00',
      updateTime: '2024-04-10 16:45:00',
      role: 'user',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
    }
  ],
  
  // 产品数据
  products: [
    {
      id: '1',
      name: '笔记本电脑',
      price: 5999,
      stock: 100,
      category: '电子产品',
      createTime: '2024-01-10 08:00:00'
    },
    {
      id: '2',
      name: '智能手机',
      price: 3999,
      stock: 200,
      category: '电子产品',
      createTime: '2024-01-15 09:30:00'
    },
    {
      id: '3',
      name: '无线耳机',
      price: 999,
      stock: 300,
      category: '配件',
      createTime: '2024-01-20 10:00:00'
    }
  ],
  
  // 订单数据
  orders: [
    {
      id: '1',
      userId: '1',
      totalPrice: 5999,
      status: '已完成',
      createTime: '2024-03-01 14:00:00'
    },
    {
      id: '2',
      userId: '2',
      totalPrice: 3999,
      status: '待付款',
      createTime: '2024-04-01 10:00:00'
    },
    {
      id: '3',
      userId: '3',
      totalPrice: 999,
      status: '已发货',
      createTime: '2024-04-10 16:00:00'
    }
  ]
};
