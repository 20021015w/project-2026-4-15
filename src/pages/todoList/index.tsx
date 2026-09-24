import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  addList,
  archiveTodo,
  deleteTodo,
  deleteTodos,
  done,
  todoList,
} from "@/features/list/listSlice";
import { ListBase } from "@/features/list/type";
import { Button, Checkbox, Input, List, message, Popconfirm, Space, Tag } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./index.less";
import { fetchList } from "@/features/list/listSlice";
import { useDrop } from "@/utils/useDrop";
import { DropContainer } from "./component/doneContainer";
import { DragMeta } from "./component/type";
const ListTodo = () => {
  const dispatch = useAppDispatch();
  const dataSource = useAppSelector(todoList)
    .data.slice()
    .sort((a, b) => a.displayIndex - b.displayIndex);
  useEffect(() => {
    dispatch(fetchList({}));
  }, []);
  const statusMapItem = useMemo(() => {
    return dataSource.reduce(
      (prev, cur) => {
        prev[cur.status] = [...(prev[cur.status] || []), cur];
        return prev;
      },
      {} as Record<"PENDING" | "DONE" | "ARCHIVED", ListBase[]>,
    );
  }, [dataSource]);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<any>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { setRef } = useDrop({
    onDrop: (e) => {
      console.log(e.dataTransfer?.getData("listItem"));
    },
  });
  const onDrop = useCallback(
    (dragMeta: DragMeta<ListBase>, targetContainerKey: string) => {
      const { item, sourceContainerKey } = dragMeta;
      console.log(item, sourceContainerKey, targetContainerKey);
      if (sourceContainerKey === targetContainerKey) return;
      let dispatcher = null;
      if (targetContainerKey === "PENDING") message.warning("禁止重新开始任务");
      switch (targetContainerKey) {
        case "DONE":
          dispatcher = done;
          break;
        case "ARCHIVED":
          dispatcher = archiveTodo;
          break;
        default:
          break;
      }
      if (dispatcher) {
        dispatcher(item.id);
      }
    },
    [dispatch],
  );

  // ✅ 失焦时添加
  const handleBlur = useCallback(() => {
    if (inputValue.trim()) {
      const newItem: ListBase = {
        id: Date.now().toString(),
        content: inputValue.trim(),
        status: "PENDING",
        displayIndex: dataSource.length,
        title: "",
      };
      dispatch(addList(newItem));
    }
    setIsEditing(false);
    setInputValue("");
  }, [inputValue, dataSource.length, dispatch]);

  // ✅ 点击添加按钮
  const handleAddClick = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus?.();
    }, 0);
  }, []);
  const getTag = useCallback((status: ListBase["status"]) => {
    switch (status) {
      case "DONE":
        return <Tag color="green">已完成</Tag>;
      case "PENDING":
        return <Tag color="red">未完成</Tag>;
      case "ARCHIVED":
        return <Tag color="orange">已归档</Tag>;
    }
  }, []);
  return (
    <div className={styles.container}>
      {/* 待办列表 */}
      <div className={styles.listContainer}>
        {Object.entries(statusMapItem).map(([status, items]) => (
          <DropContainer
            key={status}
            containerKey={status}
            onDrop={onDrop}
            className={styles.listCol}
          >
            <List
              dataSource={items}
              renderItem={(item) => (
                <List.Item
                  ref={setRef(item.id)}
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer?.setData(
                      "dragMeta",
                      JSON.stringify({ item, sourceContainerKey: status }),
                    );
                  }}
                >
                  <span>{item.content}</span>
                  <Space>{getTag(item.status)}</Space>
                </List.Item>
              )}
            />
          </DropContainer>
        ))}
      </div>

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
            style={{ width: "100%" }}
            autoFocus
            allowClear
          />
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <Button size="small" onClick={() => setIsEditing(false)}>
              取消
            </Button>
            <Button size="small" type="primary" onClick={handleBlur}>
              保存
            </Button>
          </div>
        </div>
      ) : (
        <Button type="primary" onClick={handleAddClick} style={{ marginTop: 16 }} block>
          + 添加待办
        </Button>
      )}
      <Outlet />
    </div>
  );
};
export default ListTodo;
