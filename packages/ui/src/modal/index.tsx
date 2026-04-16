// utils/modalHelper.tsx
import type { ModalProps } from 'antd';
import { Modal } from 'antd';
import { createRoot } from 'react-dom/client';

// 扩展 ModalProps，添加 content 字段方便使用
export interface OpenModalOptions extends ModalProps {
  content: React.ReactNode;  // 弹窗内容
}

// Modal 实例类型
interface ModalInstance {
  id: string;
  destroy: () => void;
}

// 存储所有打开的 Modal 实例
const modalStack: ModalInstance[] = [];
let idCounter = 0;

// 生成唯一 ID
const generateId = (title?: string): string => {
  return `${title || 'modal'}_${Date.now()}_${++idCounter}`;
};

// 打开 Modal
export const openModal = (options: OpenModalOptions): string => {
  const div = document.createElement('div');
  const id = generateId('wslModal');
  const zIndex = 1000 + modalStack.length;
  
  document.body.appendChild(div);
  const root = createRoot(div);
  
  let isClosed = false;
  let isOpen = true;
  
  const { content, ...modalProps } = options;
  
  const destroy = () => {
    if (isClosed) return;
    isClosed = true;
    
    // 从栈中移除
    const index = modalStack.findIndex(item => item.id === id);
    if (index !== -1) {
      modalStack.splice(index, 1);
    }
    
    // 清理 DOM
    setTimeout(() => {
      root.unmount();
      div.remove();
    }, 300); 
    
    // 触发关闭回调
    options.afterClose?.();
  };
  
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    
    // 重新渲染 Modal，将 open 设置为 false
    root.render(
      <Modal
        {...modalProps}
        open={false}
        zIndex={zIndex}
        afterClose={destroy}
      >
        {content}
      </Modal>
    );
  };
  
  // 渲染 Modal
  root.render(
    <Modal
      {...modalProps}
      open={true}
      zIndex={zIndex}
      afterClose={destroy}
      onCancel={close}
      onOk={close}
    >
      {content}
    </Modal>
  );
  
  const instance: ModalInstance = { id, destroy: close };
  modalStack.push(instance);
  
  return id;
};

// 关闭指定 Modal
export const closeModal = (id: string) => {
  const index = modalStack.findIndex(item => item.id === id);
  if (index !== -1) {
    modalStack[index].destroy();
    modalStack.splice(index, 1);
  }
};

// 关闭最新打开的 Modal（栈顶）
export const closeLatestModal = () => {
  const latest = modalStack.pop();
  if (latest) {
    latest.destroy();
  }
};

// 关闭所有 Modal
export const closeAllModals = () => {
  // 从后往前关闭，避免索引问题
  for (let i = modalStack.length - 1; i >= 0; i--) {
    modalStack[i].destroy();
  }
  modalStack.length = 0;
};

// 关闭除了指定 ID 以外的所有 Modal
export const closeOthersModal = (keepId: string) => {
  for (let i = modalStack.length - 1; i >= 0; i--) {
    if (modalStack[i].id !== keepId) {
      modalStack[i].destroy();
      modalStack.splice(i, 1);
    }
  }
};

// 获取当前打开的 Modal 数量
export const getModalCount = (): number => {
  return modalStack.length;
};

// 获取所有打开的 Modal ID
export const getModalIds = (): string[] => {
  return modalStack.map(modal => modal.id);
};

// 判断是否有 Modal 打开
export const hasOpenModals = (): boolean => {
  return modalStack.length > 0;
};

// 获取栈顶 Modal（最新打开的）
export const getTopModal = (): ModalInstance | undefined => {
  return modalStack[modalStack.length - 1];
};

// 导出便捷对象
export const ClickModal = {
  open: openModal,
  close: closeModal,
  closeLatest: closeLatestModal,
  closeAll: closeAllModals,
  closeOthers: closeOthersModal,
  getCount: getModalCount,
  getIds: getModalIds,
  hasOpen: hasOpenModals,
  getTop: getTopModal,
};