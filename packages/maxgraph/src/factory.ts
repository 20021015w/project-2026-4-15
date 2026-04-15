// packages/maxgraph/src/GraphService.ts
import { Graph, InternalEvent } from '@maxgraph/core'

export interface GraphConfig {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  gridEnabled?: boolean
}
export interface mxGraph extends Graph{}

export class GraphService {
  private graph: Graph
  private container: HTMLElement
  constructor(config: GraphConfig) {
    this.container = config.container
    
    // 禁用默认的右键菜单
    InternalEvent.disableContextMenu(config.container)
    // 创建 graph 实例
    this.graph = new Graph(config.container)
    
    // 初始化配置
    this.initConfig(config)
  }

  private initConfig(config: GraphConfig) {
    // 基本配置
    this.graph.setPanning(true)
    this.graph.setTooltips(true)
    this.graph.setConnectable(true)
    
    // 网格配置
    if (config.gridEnabled !== false) {
      this.graph.setGridEnabled(true)
      this.graph.setGridSize(10)
    }
    
    // 背景颜色
    if (config.backgroundColor) {
      this.container.style.backgroundColor = config.backgroundColor
    }
    
    // 设置默认样式
    this.setupDefaultStyles()
  }

  private setupDefaultStyles() {
    const stylesheet = this.graph.getStylesheet()
    
    // 默认节点样式
    const vertexStyle = stylesheet.getDefaultVertexStyle()
    vertexStyle['fillColor'] = '#ffffff'
    vertexStyle['strokeColor'] = '#000000'
    vertexStyle['fontColor'] = '#000000'
    vertexStyle['fontSize'] = 12
    vertexStyle['rounded'] = true
    vertexStyle['shadow'] = true
    
    // 默认连线样式
    const edgeStyle = stylesheet.getDefaultEdgeStyle()
    edgeStyle['strokeColor'] = '#888888'
    edgeStyle['strokeWidth'] = 2
    edgeStyle['endArrow'] = 'block'  // 箭头
  }

  // 添加节点
  public addVertex(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    style?: string
  ) {
    const parent = this.graph.getDefaultParent()
    return this.graph.insertVertex(
      parent,
      null,
      label,
      x,
      y,
      width,
      height,
      //@ts-ignore
      style || 'rounded=1;whiteSpace=wrap;fillColor=#ffffff;'
    )
  }

  // 添加连线
  public addEdge(
    source: any,
    target: any,
    label?: string
  ) {
    const parent = this.graph.getDefaultParent()
    return this.graph.insertEdge(
      parent,
      null,
      label || '',
      source,
      target,
      //@ts-ignore
      'endArrow=block;'
    )
  }

  // 获取 graph 实例
  public getGraph() {
    return this.graph
  }

  // 销毁
  public destroy() {
    this.graph.destroy()
  }
  /**
   * 移除指定元素（使用 batchUpdate）
   */
  public removeElement(element: any, includeEdges: boolean = true): void {
    if (!element) return 
    
    const cells = Array.isArray(element) ? element : [element]
    const validCells = cells.filter(cell => cell && typeof cell === 'object')
    
    if (validCells.length === 0) return

    // 使用 batchUpdate 进行批量操作
    return this.graph.batchUpdate(() => {
      // 在这个回调中执行的变更会被批处理
      const removed = this.graph.removeCells(validCells, includeEdges)
      return removed || []
    })
  }
  
public on(event: string, callback: (sender: any, evt: any) => void) {
  this.graph.addListener(event, callback);
}
}

// 导出单例工厂函数
export const createGraphService = (config: GraphConfig) => {
  return new GraphService(config)
}
export const SEInternalEvent:InternalEvent = new InternalEvent()