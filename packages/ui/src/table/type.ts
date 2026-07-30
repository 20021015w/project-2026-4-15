import { BaseTableProps } from "ali-react-table";

/** 选择类型 */
export type NormalTableSelectionType = 'single' | 'multiple';

/** 点击响应区域 */
export type NormalTableSelectionClickArea = 'radio' | 'checkbox' | 'cell' | 'row';

/** 选择框所在列的位置 */
export type NormalTableSelectionPlacement = 'start' | 'end';

/**
 * 行选择配置
 * - 受控用法：value + onChange
 * - 非受控用法：defaultValue
 */
export interface INormalTableSelection {
  /** 选择类型，单选或复选，默认 'single' */
  type?: NormalTableSelectionType;
  /** 受控选中值：单选为 string，多选为 string[] */
  value?: string | string[];
  /** 非受控默认选中值 */
  defaultValue?: string | string[];
  /** 选中值变化回调 */
  onChange?:
    | ((next: string) => void)
    | ((next: string[], key: string, keys: string[], action: 'check' | 'uncheck' | 'check-all' | 'uncheck-all') => void);
  /** 选中时是否高亮该行 */
  highlightRowWhenSelected?: boolean;
  /** 判断一行是否禁用选择 */
  isDisabled?(row: any, rowIndex: number): boolean;
  /** 点击事件的响应区域 */
  clickArea?: NormalTableSelectionClickArea;
  /** 选择框所在列的位置 */
  placement?: NormalTableSelectionPlacement;
  /** 是否对触发 onChange 的 click 事件调用 stopPropagation */
  stopClickEventPropagation?: boolean;
}

export interface INormdalTableProps extends BaseTableProps {
  /** 行选择配置，传入即开启选择列 */
  selection?: INormalTableSelection;
}
