import { createGraphService, GraphService } from "@maxgraph/shared"
import { useEffect, useRef } from "react"
import styles from './structureDiagram.less'
export const SEMaxgraph: React.FC = () => {
  const container = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (container.current) {
      const graphService: GraphService = createGraphService({
        container: container.current
      })
      
      // 示例：添加节点和边
      const node1 = graphService.addVertex(100, 100, 100, 50, "Node 1")
      const node2 = graphService.addVertex(300, 100, 100, 50, "Node 2")
      graphService.addEdge(node1, node2, "Edge")

      // 清理函数
      return () => {
        graphService.destroy()
      }
    }
  }, []) 
  
  return (
    <div 
      className={styles.mxContainer}
      ref={container} 
    />
  )
}