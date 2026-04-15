import { List } from 'antd';
import { FC, useState } from "react";
import { TreeListProps, TreeNode } from "./type";
export const Tree: FC<TreeListProps> = ({
  defaultExpandAll,
  data,
  onSelect
}) => {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(() => {
    if (defaultExpandAll) {
      const getAllKeys = (nodes: TreeNode[]): string[] => {
        let keys: string[] = [];
        nodes.forEach(node => {
          keys.push(node.key);
          if (node.children) {
            keys = keys.concat(getAllKeys(node.children));
          }
        });
        return keys;
      };
      return new Set(getAllKeys(data));
    }
    return new Set();
  });
  //展开树节点
  const toggleExpand = (key: string) => {
    const newExpanded = new Set(expandedKeys);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedKeys(newExpanded);
  };
  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedKeys.has(node.key)
    return <div style={{ marginLeft: level * 15 }}>
      <List.Item key={node.key}
        onDoubleClick={() => toggleExpand(node.key)}
        onSelect={() => onSelect?.(node)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 展开/收起图标 */}
          {hasChildren && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.key);
              }}
              style={{ cursor: 'pointer', width: 20 }}
            >
              {isExpanded ? '📂' : '📁'}
            </span>
          )}
          {!hasChildren && <span style={{ width: 20 }}>📄</span>}

          {/* 节点名称 */}
          <span>{node.title}</span>
        </div>
      </List.Item>
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map(item => renderNode(item, level + 1))}
        </div>
      )}
    </div>
  }
  return <List>
    {data.map(node => renderNode(node))}
  </List>
}
export default Tree;