// client/src/components/ChatInput.tsx
import { SendOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { KeyboardEvent, useState } from 'react';

const { TextArea } = Input;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  
  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="chat-input-container">
      <TextArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息... 例如：打开弹窗"
        autoSize={{ minRows: 1, maxRows: 4 }}
        disabled={disabled}
      />
      <Button
        type="primary"
        icon={<SendOutlined />}
        onClick={handleSend}
        disabled={!inputValue.trim() || disabled}
      >
        发送
      </Button>
    </div>
  );
};

export default ChatInput;