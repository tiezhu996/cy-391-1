# 个人碳足迹可视化工具

记录出行、饮食、用电和购物行为，自动计算碳排放并给出可视化趋势、等级评估和减碳建议。

## 项目主要功能

- 按出行、饮食、用电、购物记录日常碳排放
- 展示日、周、月趋势折线图、类别堆叠柱状图和结构饼图
- 根据月度总量评估低碳等级并对比全国人均水平
- 根据排放结构生成个性化减碳建议
- 碳积分与虚拟勋章兑换
- 本地 30 天低排放排行榜
- CSV 导入导出

## 本地开发方式

```bash
cd frontend
npm install
npm run dev
```

访问地址：http://localhost:18411

## 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端框架 | React 18 + TypeScript |
| UI | Tailwind CSS + shadcn/ui 风格组件 |
| 图表 | Recharts |
| 状态管理 | Zustand |
| 构建工具 | Vite |
| 持久化 | IndexedDB |

## 项目目录结构

```text
frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   ├── storage/
│   ├── constants/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── App.tsx
├── public/
└── package.json
```

## License

MIT
