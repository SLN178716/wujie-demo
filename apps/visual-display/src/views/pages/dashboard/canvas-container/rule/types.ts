// 尺子方向
export type RuleDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

// 尺子刻度朝向(尺子水平：start => 上; 尺子垂直: start => 左)
export type RuleScaleDirection = 'start' | 'end';

// 刻度配置
export interface ScaleOption {
  showNumber?: boolean; // 是否显示数值
  step: number; // 刻度间隔
  long: number; // 刻度长度
  color?: string; // 刻度颜色
  fontSize?: number; // 刻度数值字体大小
  fontColor?: string; // 刻度数值字体颜色
}

// 组件Props
export interface DashboardCanvasRuleProps {
  direction?: RuleDirection; // 尺子方向
  width: number; // 刻度长度
  height: number; // 尺高度
  scaleDirection?: RuleScaleDirection; // 刻度朝向
  scaleOptions?: ScaleOption[]; // 刻度配置
}
