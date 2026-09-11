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
    thesisEn: "AI should organize attention, not just output another answer.",
    thesisZh: "AI 不应只输出答案，还应该帮助人组织注意力。",
    problemEn: "In low-attention contexts, even a correct AI answer can be too slow to interpret and act on.",
    problemZh: "在驾驶等低注意力场景里，即使 AI 回答正确，也可能太慢、太难转化为行动。",
    approachEn: "Package event, impact, recommendation, action and receipt into one state-aware briefing.",
    approachZh: "把事件、影响、建议、行动与回执组织成一个会随状态更新的简报。",
    statusEn: "Web prototypes cover in-car and card flows; user impact still needs validation.",
    statusZh: "网页原型已覆盖车机与卡片流程；用户影响仍待验证。",
  },
  livis: {
    thesisEn: "Intelligence for glasses should live at the edge of attention.",
    thesisZh: "眼镜上的智能，应当停留在注意力的边缘。",
    problemEn: "A phone-like interface overloads the narrow field of view and competes with the world around the wearer.",
    problemZh: "照搬手机界面会挤占有限视野，并与佩戴者正在观察的现实世界争夺注意力。",
    approachEn: "Explore a lightweight interaction language that moves information between focus and peripheral awareness.",
    approachZh: "探索一种轻量交互语言，让信息在聚焦与周边感知之间自然移动。",
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
