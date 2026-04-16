# ClickModal 命令式弹窗工具

基于 Ant Design Modal 封装的命令式弹窗工具，无需在组件内维护状态，支持多弹窗管理、自动层级控制、自动销毁。

## 特性

- ✅ 命令式调用，无需组件内维护状态
- ✅ 支持多弹窗管理，自动处理层级关系
- ✅ 自动销毁，避免内存泄漏
- ✅ 完整的 API 支持，包括打开、关闭、获取状态等操作
- ✅ 与 Ant Design Modal 完全兼容，支持所有 ModalProps

## 基础用法

```tsx
import { ClickModal } from './index';

export default () => {
  const handleOpen = () => {
    ClickModal.open({
      title: '基础弹窗',
      content: <div>这是命令式弹窗内容</div>,
      onOk: () => console.log('点击了确定'),
    });
  };

  return <button onClick={handleOpen}>打开弹窗</button>;
};
```

## 高级用法

### 关闭指定弹窗

> **注意**：在文档演示中，当弹窗打开后，由于弹窗会覆盖在文档内容之上，可能无法点击文档中的关闭按钮。在实际应用中，您可以将关闭按钮放在页面的其他位置，或者使用弹窗内部的关闭按钮。

```tsx
import { ClickModal } from './index';

export default () => {
  let modalId: string;
  
  const handleOpen = () => {
    modalId = ClickModal.open({
      title: '可关闭的弹窗',
      content: <div>
        <p>点击按钮可以关闭我</p>
        <button onClick={() => ClickModal.close(modalId)} style={{ marginTop: 10 }}>关闭弹窗</button>
      </div>,
    });
  };

  return (
    <div>
      <button onClick={handleOpen}>打开弹窗</button>
    </div>
  );
};
```

### 多弹窗管理

> **注意**：在文档演示中，当弹窗打开后，由于弹窗会覆盖在文档内容之上，可能无法点击文档中的关闭按钮。在实际应用中，您可以将关闭按钮放在页面的其他位置，或者使用弹窗内部的关闭按钮。

```tsx
import { ClickModal } from './index';

export default () => {
  const handleOpenMultiple = () => {
    // 打开第一个弹窗
    const modalId1 = ClickModal.open({
      title: '弹窗 1',
      content: <div>
        <p>我是第一个弹窗</p>
        <button onClick={() => ClickModal.close(modalId1)} style={{ marginTop: 10 }}>关闭我</button>
      </div>,
    });
    
    // 打开第二个弹窗
    setTimeout(() => {
      const modalId2 = ClickModal.open({
        title: '弹窗 2',
        content: <div>
          <p>我是第二个弹窗</p>
          <button onClick={() => ClickModal.close(modalId2)} style={{ marginTop: 10 }}>关闭我</button>
        </div>,
      });
    }, 500);
    
    // 打开第三个弹窗
    setTimeout(() => {
      const modalId3 = ClickModal.open({
        title: '弹窗 3',
        content: <div>
          <p>我是第三个弹窗</p>
          <button onClick={() => ClickModal.close(modalId3)} style={{ marginTop: 10 }}>关闭我</button>
          <button onClick={() => ClickModal.closeAll()} style={{ marginTop: 10, marginLeft: 10 }}>关闭所有弹窗</button>
        </div>,
      });
    }, 1000);
  };

  return (
    <div>
      <button onClick={handleOpenMultiple}>打开多个弹窗</button>
    </div>
  );
};
```

## API

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| open | 打开弹窗 | options: OpenModalOptions | string (弹窗 ID) |
| close | 关闭指定 ID 弹窗 | id: string | — |
| closeLatest | 关闭最近打开的弹窗 | — | — |
| closeAll | 关闭所有弹窗 | — | — |
| closeOthers | 关闭除指定 ID 外的所有弹窗 | keepId: string | — |
| getCount | 获取打开的弹窗数量 | — | number |
| getIds | 获取所有弹窗 ID 数组 | — | string[] |
| hasOpen | 是否存在打开的弹窗 | — | boolean |
| getTop | 获取最新弹窗实例 | — | ModalInstance  undefined |

## OpenModalOptions

继承自 Ant Design 的 `ModalProps`，并添加了以下属性：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 弹窗内容 | React.ReactNode | - |

## 注意事项

1. 弹窗会自动管理 z-index，确保新打开的弹窗总是在最上层
2. 弹窗关闭后会自动清理 DOM，避免内存泄漏
3. 支持所有 Ant Design Modal 的属性和方法
4. 可以通过 `afterClose` 回调函数处理弹窗关闭后的逻辑

## 示例代码

### 带确认和取消按钮的弹窗

```tsx
import { ClickModal } from './index';

export default () => {
  const handleOpen = () => {
    ClickModal.open({
      title: '确认操作',
      content: <div>确定要执行此操作吗？</div>,
      onOk: () => {
        console.log('点击了确定');
        // 执行确认操作
      },
      onCancel: () => {
        console.log('点击了取消');
        // 执行取消操作
      },
    });
  };

  return <button onClick={handleOpen}>打开确认弹窗</button>;
};
```

### 自定义样式的弹窗

```tsx
import { ClickModal } from './index';

export default () => {
  const handleOpen = () => {
    ClickModal.open({
      title: '自定义弹窗',
      content: <div>这是一个自定义样式的弹窗</div>,
      width: 600,
      okText: '确认',
      cancelText: '取消',
      className: 'custom-modal',
      style: {
        borderRadius: 8,
      },
    });
  };

  return <button onClick={handleOpen}>打开自定义弹窗</button>;
};
```