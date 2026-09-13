export type ProjectTldrCopy = {
  thesisEn: string;
  thesisZh: string;
  problemEn: string;
  problemZh: string;
  approachEn: string;
  approachZh: string;
  statusEn: string;
  statusZh: string;
};

const projectTldrBySlug: Record<string, ProjectTldrCopy> = {
  "alive-briefing": {
    thesisEn: "Turning long AI answers into readable, interactive briefings.",
    thesisZh: "将冗长的 AI 回答，压缩为一眼可读、可继续交互的活字简报。",
    problemEn: "How can an in-car assistant compress interrupted answers without losing meaning or the next action?",
    problemZh: "当座舱助手的长回答频繁被用户打断，如何在压缩信息的同时保留关键含义，让用户快速理解并采取下一步行动？",
    approachEn: "I translated team principles into an interaction grammar and prototyped concise, proactive AI communication.",
    approachZh: "我将团队原则细化为语法与交互规范，并制作原型 Demo，探索简洁、具有主动性的 AI 表达。",
    statusEn: "Web prototypes cover in-car and card flows; user impact still needs validation.",
    statusZh: "网页原型已覆盖车机与卡片流程；用户影响仍待验证。",
  },
  livis: {
    thesisEn: "A cross-device task experience across the car, phone, and smart glasses.",
    thesisZh: "将车机任务能力与手机和智能眼镜打通，设计适配各端场景的创建、管理与交付体验。",
    problemEn: "How can tasks stay consistent when in-car capabilities are limited and results are scattered across sessions?",
    problemZh: "在车机能力无法全量接入、任务结果分散于不同会话的限制下，如何建立一致且可扩展的跨端任务体验？",
    approachEn: "I unified task structures and entry points, using source labels and a home-screen inbox to surface asynchronous results.",
    approachZh: "我从 0 到 1 设计跨端任务体验框架，统一任务结构、衔接多入口创建与管理，并通过来源标签与首页待查收入口，让异步结果可理解、可发现。",
    statusEn: "Interaction principles are in exploration; public case materials are still being assembled.",
    statusZh: "交互原则仍在探索中；公开案例材料正在整理。",
  },
  "from-query-to-quest": {
    thesisEn: "Reframing prompting to spark thought and sustain reflection.",
    thesisZh: "将 Prompting 拓展为启发思考与持续反思的旅程。",
    problemEn: "When people feel uncertain or stuck, how can AI dialogue support deep thinking beyond the linear “request → refinement → result” model?",
    problemZh: "当人感到不确定或思考受阻时，AI 对话如何超越线性的“请求 → 优化 → 结果”模式，支持深度思考？",
    approachEn: "Through Critical and Participatory Design, I developed three design principles and a conceptual framework connecting ambiguous thoughts, exploratory dialogue, and real-world action.",
    approachZh: "我结合批判性与参与式设计，提出三项设计原则与一个概念框架，将模糊想法、对话探索与现实行动连接起来。",
    statusEn: "The framework is documented; current research exposes trade-offs rather than validating a finished product.",
    statusZh: "框架已经形成；现有研究用于揭示取舍，而非证明产品已经有效。",
  },
};

export function getProjectTldr(slug: string): ProjectTldrCopy | undefined {
  return projectTldrBySlug[slug];
}
