// client/src/components/ModalManager.tsx
import { Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface ModalState {
  visible: boolean;
  type: 'info' | 'confirm' | 'form' | 'custom';
  title: string;
  content: string;
}

const ModalManager: React.FC = () => {
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    type: 'info',
    title: '',
    content: '',
  });
  
  const [form] = Form.useForm();
  
  // 监听打开弹窗事件
  useEffect(() => {
    const handleOpenModal = (event: CustomEvent) => {
      const { modalType, title, content } = event.detail;
      setModalState({
        visible: true,
        type: modalType || 'info',
        title: title || '提示',
        content: content || '',
      });
    };
    
    const handleCloseModal = () => {
      setModalState(prev => ({ ...prev, visible: false }));
      form.resetFields();
    };
    
    window.addEventListener('openModal', handleOpenModal as EventListener);
    window.addEventListener('closeModal', handleCloseModal);
    
    return () => {
      window.removeEventListener('openModal', handleOpenModal as EventListener);
      window.removeEventListener('closeModal', handleCloseModal);
    };
  }, [form]);
  
  const handleOk = () => {
    if (modalState.type === 'form') {
      form.validateFields().then(values => {
        console.log('表单提交:', values);
        message.success('表单提交成功');
        setModalState(prev => ({ ...prev, visible: false }));
        form.resetFields();
      });
    } else if (modalState.type === 'confirm') {
      message.success('已确认');
      setModalState(prev => ({ ...prev, visible: false }));
    } else {
      setModalState(prev => ({ ...prev, visible: false }));
    }
  };
  
  const handleCancel = () => {
    if (modalState.type === 'confirm') {
      message.info('已取消');
    }
    setModalState(prev => ({ ...prev, visible: false }));
    form.resetFields();
  };
  
  // 根据弹窗类型渲染内容
  const renderContent = () => {
    if (modalState.content) {
      return <p>{modalState.content}</p>;
    }
    
    switch (modalState.type) {
      case 'info':
        return <p>这是一条信息提示，AI 助手为您打开了这个弹窗。</p>;
      case 'confirm':
        return <p>您确定要执行这个操作吗？</p>;
      case 'form':
        return (
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email', message: '请输入有效的邮箱' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Form>
        );
      default:
        return <p>弹窗内容</p>;
    }
  };
  
  // 根据弹窗类型配置按钮
  const getModalProps = () => {
    if (modalState.type === 'confirm') {
      return {
        okText: '确认',
        cancelText: '取消',
      };
    }
    if (modalState.type === 'form') {
      return {
        okText: '提交',
        cancelText: '取消',
      };
    }
    return {
      okText: '知道了',
      cancelText: undefined,
    };
  };
  
  return (
    <Modal
      title={modalState.title}
      open={modalState.visible}
      onOk={handleOk}
      onCancel={handleCancel}
      {...getModalProps()}
    >
      {renderContent()}
    </Modal>
  );
};

export default ModalManager;