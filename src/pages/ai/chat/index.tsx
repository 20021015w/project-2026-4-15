import { message as AntdMessage, ConfigProvider } from 'antd';
import React, { useCallback, useState } from 'react';
import ChatInput from './chatInput';
import ModalManager from './modal';
export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface AIResponse {
  reply: string;
  toolCalls?: ToolCall[];
}

const Chat: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  
  // 处理用户消息
  const handleSendMessage = useCallback(async (message: string) => {
    // 添加用户消息
    setConversation(prev => [...prev, { role: 'user', content: message }]);
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data: AIResponse = await response.json();
      
      // 添加 AI 回复
      setConversation(prev => [...prev, { role: 'ai', content: data.reply }]);
      
      // 处理工具调用（通过事件触发，实际状态由 ModalManager 管理）
      if (data.toolCalls && data.toolCalls.length > 0) {
        for (const toolCall of data.toolCalls) {
          if (toolCall.name === 'open_modal') {
            // 触发打开弹窗事件
            window.dispatchEvent(new CustomEvent('openModal', { detail: toolCall.arguments }));
          } else if (toolCall.name === 'close_modal') {
            window.dispatchEvent(new CustomEvent('closeModal'));
          }
        }
      }
      
    } catch (error) {
      console.error('请求失败:', error);
      AntdMessage.error('网络错误，请稍后重试');
      setConversation(prev => [...prev, { role: 'ai', content: '抱歉，服务出了点问题，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return (
    <ConfigProvider>
      <div className="app">
        <div className="chat-container">
          <div className="chat-header">
            <h1>🤖 AI 助手</h1>
            <p>试试说："打开弹窗"、"打开确认弹窗"、"关闭弹窗"、"现在几点"</p>
          </div>
          
          <div className="chat-messages">
            {conversation.length === 0 && (
              <div className="welcome-message">
                <p>👋 你好！我是 AI 助手</p>
                <p>你可以对我说：</p>
                <ul>
                  <li>"打开弹窗" - 打开信息弹窗</li>
                  <li>"打开确认弹窗" - 打开确认对话框</li>
                  <li>"打开表单弹窗" - 打开表单弹窗</li>
                  <li>"关闭弹窗" - 关闭当前弹窗</li>
                  <li>"现在几点" - 查询当前时间</li>
                </ul>
              </div>
            )}
            
            {conversation.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message ai">
                <div className="message-avatar">🤖</div>
                <div className="message-content typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
          </div>
          
          <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>
        
        <ModalManager />
      </div>
    </ConfigProvider>
  );
};

export default Chat;