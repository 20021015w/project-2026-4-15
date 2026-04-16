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