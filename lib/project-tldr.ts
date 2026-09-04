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
    thesisEn: "AI can help people think without quietly taking over the thinking.",
    thesisZh: "AI 可以帮助人思考，而不是悄悄替人完成思考。",
    problemEn: "People often approach AI with fragments, emotion or uncertainty rather than a clear task.",
    problemZh: "人们经常带着片段、情绪或不确定性接近 AI，而不是一个清晰任务。",
    approachEn: "Use critical and participatory design to protect agency, attention and slow continuity in dialogue.",
    approachZh: "通过批判性与参与式设计，保护对话中的能动性、注意力与慢连续性。",
    statusEn: "The framework is documented; current research exposes trade-offs rather than validating a finished product.",
    statusZh: "框架已经形成；现有研究用于揭示取舍，而非证明产品已经有效。",
  },
};

export function getProjectTldr(slug: string): ProjectTldrCopy | undefined {
  return projectTldrBySlug[slug];
}
