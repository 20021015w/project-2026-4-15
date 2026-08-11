import { useDrop } from "@/utils/useDrop";
import { createGraphService, GraphService } from "@maxgraph/shared";
import { useEffect, useState } from "react";
import styles from "./structureDiagram.less";

const SEMaxgraph = () => {
  // 保存 graph 实例
  const [graphService, setGraphService] = useState<GraphService | null>(null);

  // ✅ useDrop 返回的就是容器 domRef
  const containerRef = useDrop({
    isDefPreview: true,

    onDragEnter: (e) => {
      e.preventDefault();
      console.log("进入容器");
    },

    onMove: (e) => {
      e.preventDefault();
      // ✅ 想显示允许/禁止光标在这里控制
      e.dataTransfer!.dropEffect = "move";
    },

    onDragLeave: (e) => {
      e.preventDefault();
    },

    // ✅ 核心：在这里使用 graphService
    onDrop: (e) => {
      if (!graphService || !containerRef.current) return;

      const data = e.dataTransfer?.getData("a");
      if (!data) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // ✅ 在这里添加节点
      graphService.addVertex(x - 50, y - 25, 100, 50, `Dropped: ${data}`);
    },
  });

  // 初始化 maxgraph
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const graph = createGraphService({ container: el });
    setGraphService(graph);

    // 测试节点
    const n1 = graph.addVertex(100, 100, 100, 50, "Node1");
    const n2 = graph.addVertex(300, 100, 100, 50, "Node2");
    graph.addEdge(n1, n2, "Edge");

    return () => graph.destroy();
  }, [containerRef]);

  return (
    <>
      {/* 可拖拽元素 */}
      <div
        draggable="true"
        style={{ width: 100, height: 100, border: "1px solid red" }}
        onDragStart={(e) => {
          e.dataTransfer.setData("a", "你好");
        }}
      >
        拖我
      </div>

      {/* ✅ 拖放目标容器 */}
      <div className={styles.mxContainer} ref={containerRef} />
    </>
  );
};
export default SEMaxgraph;
