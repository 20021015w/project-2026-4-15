---
title: ripple
order: 3
---

# Ripple 涟漪

在点击位置生成涟漪动画

## 基本用法

```jsx
import { Ripple } from './index';

export default () => (
  <Ripple range={40}>
    <div style={{ width: 100, height: 100, background: '#eee' }}>点击我</div>
  </Ripple>
);
```
## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| range | 涟漪大小 | number | 30px |
| duration | 持续时间 | number | 450ms |
| children | 需要涟漪效果的组件 | ReactNode| - |
| color | 涟漪颜色 | string | - |
