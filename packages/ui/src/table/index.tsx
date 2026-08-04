import { BaseTable, features, useTablePipeline } from 'ali-react-table'
import { Checkbox, Radio } from 'antd'
import { FC, useMemo, useState } from 'react'
import { INormalTableSelection, INormdalTableProps } from './type'

/**
 * 基于 ali-react-table 的 BaseTable 二次封装。
 * - 透传所有原生 props
 * - 提供默认主键、加载态、空数据展示等通用配置
 * - 内置 TablePipeline，通过链式 .use() 接入 singleSelect / multiSelect
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
  const [innerSingleValue, setInnerSingleValue] = useState<string>(
    typeof selection?.defaultValue === 'string' ? selection.defaultValue : '',
  )
  const [innerMultiValue, setInnerMultiValue] = useState<string[]>(
    Array.isArray(selection?.defaultValue) ? selection.defaultValue : [],
  )

  const pipeline = useTablePipeline({
    primaryKey,
    components: { Radio, Checkbox },
  })

  // 构建链式调用：input → use(singleSelect | multiSelect)
  pipeline.input({ dataSource: dataSource ?? [], columns: columns ?? [] }).use(
    selection?.type === 'multiple'
      ? features.multiSelect(buildMultiSelectOptions(selection, innerMultiValue, setInnerMultiValue))
      : features.singleSelect(buildSingleSelectOptions(selection, innerSingleValue, setInnerSingleValue)),
  )

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

/** 构建 singleSelect 配置 */
function buildSingleSelectOptions(
  selection: INormalTableSelection | undefined,
  innerValue: string,
  setInnerValue: (v: string) => void,
) {
  if (!selection) {
    return {
      highlightRowWhenSelected: true,
      radioPlacement: 'start' as const,
      clickArea: 'row' as const,
    }
  }
  const {
    value,
    defaultValue,
    onChange,
    highlightRowWhenSelected,
    isDisabled,
    clickArea = 'radio',
    placement = 'start',
    stopClickEventPropagation,
  } = selection
  const controlledValue = typeof value === 'string' ? value : undefined
  const initialDefault = typeof defaultValue === 'string' ? defaultValue : undefined
  return {
    value: controlledValue ?? innerValue,
    defaultValue: initialDefault,
    highlightRowWhenSelected,
    isDisabled,
    clickArea: clickArea as 'radio' | 'cell' | 'row',
    radioPlacement: placement as 'start' | 'end',
    stopClickEventPropagation,
    onChange: (next: string) => {
      setInnerValue(next)
      ;(onChange as (next: string) => void)?.(next)
    },
  }
}

/** 构建 multiSelect 配置 */
function buildMultiSelectOptions(
  selection: INormalTableSelection,
  innerValue: string[],
  setInnerValue: (v: string[]) => void,
) {
  const {
    value,
    defaultValue,
    onChange,
    highlightRowWhenSelected,
    isDisabled,
    clickArea = 'checkbox',
    placement = 'start',
    stopClickEventPropagation,
  } = selection
  const controlledValue = Array.isArray(value) ? value : undefined
  const initialDefault = Array.isArray(defaultValue) ? defaultValue : undefined
  return {
    value: controlledValue ?? innerValue,
    defaultValue: initialDefault,
    highlightRowWhenSelected,
    isDisabled,
    clickArea: clickArea as 'checkbox' | 'cell' | 'row',
    checkboxPlacement: placement as 'start' | 'end',
    stopClickEventPropagation,
    onChange: (
      next: string[],
      key: string,
      keys: string[],
      action: 'check' | 'uncheck' | 'check-all' | 'uncheck-all',
    ) => {
      setInnerValue(next)
      ;(onChange as (next: string[], key: string, keys: string[], action: 'check' | 'uncheck' | 'check-all' | 'uncheck-all') => void)?.(
        next,
        key,
        keys,
        action,
      )
    },
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
