import { BaseTable, features, useTablePipeline } from 'ali-react-table'
import { Checkbox, Radio } from 'antd'
import { FC, useMemo, useState } from 'react'
import { INormalTableSelection, INormdalTableProps } from './type'

/**
 * 基于 ali-react-table 的 BaseTable 二次封装。
 * - 透传所有原生 props
 * - 提供默认主键、加载态、空数据展示等通用配置
 * - 内置 TablePipeline，支持通过 selection 配置开启单选/多选
 */
export const NormalTable: FC<INormdalTableProps> = ({
  primaryKey = 'id',
  className,
  style,
  isLoading,
  components,
  defaultColumnWidth = 120,
  isStickyHeader = true,
  hasStickyScroll = true,
  columns,
  dataSource,
  selection,
  ...rest
}) => {
  const mergedClassName = useMemo(() => {
    return ['wsl-normal-table', className].filter(Boolean).join(' ')
  }, [className])

  const mergedComponents = useMemo(() => {
    return {
      EmptyContent: components?.EmptyContent ?? DefaultEmptyContent,
      LoadingIcon: components?.LoadingIcon ?? DefaultLoadingIcon,
      ...components,
    }
  }, [components])

  // 非受控模式下的内部选中状态
  const [innerSingleValue, setInnerSingleValue] = useState<string>('')
  const [innerMultiValue, setInnerMultiValue] = useState<string[]>([])

  const pipeline = useTablePipeline({
    primaryKey,
    components: { Radio, Checkbox },
  })
  pipeline.input({ dataSource: dataSource ?? [], columns: columns ?? [] })

  // 应用选择能力
  useSelection(pipeline, selection, {
    innerSingleValue,
    setInnerSingleValue,
    innerMultiValue,
    setInnerMultiValue,
  })

  // pipeline 输出的 props（包含 dataSource/columns/primaryKey/getRowProps）
  const pipelineProps = pipeline.getProps()

  return (
    <BaseTable
      {...pipelineProps}
      className={mergedClassName}
      style={{ width: '100%', ...style }}
      isLoading={isLoading}
      components={mergedComponents}
      defaultColumnWidth={defaultColumnWidth}
      isStickyHeader={isStickyHeader}
      hasStickyScroll={hasStickyScroll}
      {...rest}
    />
  )
}

interface SelectionState {
  innerSingleValue: string
  setInnerSingleValue: (v: string) => void
  innerMultiValue: string[]
  setInnerMultiValue: (v: string[]) => void
}

function useSelection(
  pipeline: ReturnType<typeof useTablePipeline>,
  selection: INormalTableSelection | undefined,
  state: SelectionState,
) {
  if (!selection) return

  const {
    type = 'single',
    value,
    defaultValue,
    onChange,
    highlightRowWhenSelected,
    isDisabled,
    clickArea = type === 'multiple' ? 'checkbox' : 'radio',
    placement = 'start',
    stopClickEventPropagation,
  } = selection

  if (type === 'multiple') {
    const controlledValue = (Array.isArray(value) ? value : undefined) as string[] | undefined
    const initialDefault = (Array.isArray(defaultValue) ? defaultValue : undefined) as string[] | undefined
    const effectiveValue = controlledValue ?? state.innerMultiValue
    // 首次渲染时同步 defaultValue
    if (controlledValue === undefined && initialDefault && state.innerMultiValue.length === 0) {
      state.setInnerMultiValue(initialDefault)
    }
    pipeline.use(
      features.multiSelect({
        value: effectiveValue,
        defaultValue: initialDefault,
        highlightRowWhenSelected,
        isDisabled,
        clickArea: clickArea as 'checkbox' | 'cell' | 'row',
        checkboxPlacement: placement,
        stopClickEventPropagation,
        onChange: (next, key, keys, action) => {
          state.setInnerMultiValue(next)
          ;(onChange as (next: string[], key: string, keys: string[], action: 'check' | 'uncheck' | 'check-all' | 'uncheck-all') => void)?.(next, key, keys, action)
        },
      }),
    )
  } else {
    const controlledValue = typeof value === 'string' ? value : undefined
    const initialDefault = typeof defaultValue === 'string' ? defaultValue : undefined
    const effectiveValue = controlledValue ?? state.innerSingleValue
    if (controlledValue === undefined && initialDefault && !state.innerSingleValue) {
      state.setInnerSingleValue(initialDefault)
    }
    pipeline.use(
      features.singleSelect({
        value: effectiveValue,
        defaultValue: initialDefault,
        highlightRowWhenSelected,
        isDisabled,
        clickArea: clickArea as 'radio' | 'cell' | 'row',
        radioPlacement: placement,
        stopClickEventPropagation,
        onChange: (next) => {
          state.setInnerSingleValue(next)
          ;(onChange as (next: string) => void)?.(next)
        },
      }),
    )
  }
}

const DefaultEmptyContent: FC = () => {
  return <div style={{ padding: 16, color: '#999', textAlign: 'center' }}>暂无数据</div>
}

const DefaultLoadingIcon: FC = () => {
  return (
    <div style={{ padding: 16, color: '#999', textAlign: 'center' }}>
      <span style={{ display: 'inline-block', marginRight: 8 }}>加载中...</span>
    </div>
  )
}

export type { INormalTableSelection, INormdalTableProps }
export default NormalTable
