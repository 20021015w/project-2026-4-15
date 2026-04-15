---
title: Button
order: 1
---

# Button 按钮

按钮用于触发一个操作，如提交表单、打开对话框等。

## 基本用法

```jsx
import { Button } from './index';

export default () => (
  <div>
    <Button type="primary">主要按钮</Button>
    <Button>默认按钮</Button>
    <Button type="danger">危险按钮</Button>
  </div>
);
```

## 不同尺寸

```jsx
import { Button } from './index';

export default () => (
  <div>
    <Button size="small">小按钮</Button>
    <Button>中按钮</Button>
    <Button size="large">大按钮</Button>
  </div>
);
```

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `primary` \| `default` \| `danger` | `default` |
| size | 按钮尺寸 | `small` \| `medium` \| `large` | `medium` |
| onClick | 点击事件 | `() => void` | - |
| children | 按钮内容 | `React.ReactNode` | - |