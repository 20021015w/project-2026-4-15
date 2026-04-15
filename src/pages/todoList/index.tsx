import { useAppDispatch, useAppSelector } from "@/app/hook"
import { addList, deleteTodo, deleteTodos, done, todoList } from '@/features/list/listSlice'
import { ListBase } from "@/features/list/type"
import { DeleteFilled, DeleteOutlined } from "@ant-design/icons"
import { Button, Checkbox, Input, List, Popconfirm, Space } from "antd"
import { useCallback, useMemo, useRef, useState } from "react"
import { Outlet } from "react-router-dom"
import styles from './index.less'
export const ListTodo = () => {
  const dispatch = useAppDispatch()
  // ✅ 优化1：使用slice()创建副本避免修改原数组
  const dataSource = useAppSelector(todoList)
    .slice()
    .sort((a, b) => a.displayIndex - b.displayIndex)
  const [inputValue, setInputValue] = useState<string>('')
  const inputRef = useRef<any>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  
  // ✅ 优化2：使用Set管理选中状态，性能更好
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  
  // ✅ 优化3：计算选中数量
  const selectedCount = useMemo(() => selectedIds.size, [selectedIds])
  
  const onToggle = useCallback((id: string) => {
    dispatch(done(id))
  }, [dispatch])
  
  const onDelete = useCallback((id: string) => {
    dispatch(deleteTodo(id))
    // 删除后从选中集中移除
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [dispatch])
  
  // ✅ 优化4：批量删除
  const onBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return
    dispatch(deleteTodos(Array.from(selectedIds)))
    setSelectedIds(new Set()) // 清空选中
  }, [dispatch, selectedIds])
  
  // ✅ 优化5：全选/取消全选
  const onSelectAll = useCallback(() => {
    if (selectedIds.size === dataSource.length) {
      setSelectedIds(new Set()) // 全部取消
    } else {
      setSelectedIds(new Set(dataSource.map(item => item.id))) // 全部选中
    }
  }, [dataSource, selectedIds])
  
  // ✅ 优化6：单个选中/取消
  const onSelectItem = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(id)
      } else {
        newSet.delete(id)
      }
      return newSet
    })
  }, [])
  
  // ✅ 失焦时添加
  const handleBlur = useCallback(() => {
    if (inputValue.trim()) {
      const newItem: ListBase = {
        id: Date.now().toString(),
        listInfo: inputValue.trim(),
        isDone: false,
        displayIndex: dataSource.length
      }
      dispatch(addList(newItem))
    }
    setIsEditing(false)
    setInputValue('')
  }, [inputValue, dataSource.length, dispatch])
  
  // ✅ 点击添加按钮
  const handleAddClick = useCallback(() => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus?.()
    }, 0)
  }, [])
  
  return (
    <div className={styles.container}>
      {/* ✅ 优化7：批量操作栏 */}
      <div className={styles.list}>
        <Space>
          <Checkbox 
            onChange={onSelectAll}
            checked={selectedIds.size === dataSource.length && dataSource.length > 0}
            indeterminate={selectedIds.size > 0 && selectedIds.size < dataSource.length}
          >
            {selectedIds.size === dataSource.length ? '取消全选' : '全选'}
          </Checkbox>
          <span className={styles.selectOption}>
            {selectedCount > 0 ? `已选中 ${selectedCount} 项` : ''}
          </span>
        </Space>
        
        {selectedCount > 0 && (
          <Popconfirm
            title={`确定要删除选中的 ${selectedCount} 个待办吗？`}
            onConfirm={onBatchDelete}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteFilled />}
            >
              批量删除 ({selectedCount})
            </Button>
          </Popconfirm>
        )}
      </div>

      {/* 待办列表 */}
      <List
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            style={{
              background: selectedIds.has(item.id) ? '#e6f7ff' : 'white',
              transition: 'background 0.3s',
              borderRadius: 4,
              marginBottom: 4
            }}
            actions={[
              <Space>
                <Checkbox 
                  checked={item.isDone}
                  onChange={() => onToggle(item.id)}
                >
                  完成
                </Checkbox>
                
                <Checkbox 
                  checked={selectedIds.has(item.id)}
                  onChange={(e) => onSelectItem(item.id, e.target.checked)}
                />
                
                <Popconfirm
                  title="确定要删除这个待办吗？"
                  onConfirm={() => onDelete(item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Space>
            ]}
          >
            <List.Item.Meta
              title={
                <span style={{ 
                  textDecoration: item.isDone ? 'line-through' : 'none',
                  color: item.isDone ? '#52c41a' : 'rgba(0, 0, 0, 0.85)',
                  fontWeight: item.isDone ? 'normal' : 500
                }}>
                  {item.listInfo}
                </span>
              }
              description={
                <span style={{ fontSize: 12, color: '#999' }}>
                  ID: {item.id.slice(-4)} • 序号: {item.displayIndex}
                </span>
              }
            />
          </List.Item>
        )}
      />
      
      {/* 添加待办区域 */}
      {isEditing ? (
        <div style={{ marginTop: 16 }}>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onPressEnter={handleBlur}
            placeholder="请输入待办事项，失焦或回车保存"
            style={{ width: '100%' }}
            autoFocus
            allowClear
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button size="small" onClick={() => setIsEditing(false)}>
              取消
            </Button>
            <Button size="small" type="primary" onClick={handleBlur}>
              保存
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          type="primary" 
          onClick={handleAddClick}
          style={{ marginTop: 16 }}
          block
        >
          + 添加待办
        </Button>
      )}
      <Outlet />
    </div>
  )
}