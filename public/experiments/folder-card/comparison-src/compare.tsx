import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ProjectCardTldr } from './before/ProjectCardTldr';
import { ProjectFolderCard } from '../../../../components/ProjectFolderCard';
import { CustomCursor } from './shared/CustomCursor';
import { SiteControls } from './shared/SiteControls';
import projects from './projects.json';

function Comparison() {
  const [selected, setSelected] = useState('from-query-to-quest');
  const project = projects.find(p => p.projectSlug === selected)!;
  return <>
    <header className="compare-header"><span>LEXI / LAB</span><SiteControls /></header>
    <main className="home-page comparison-page">
      <h1>Project Card · Before / After</h1>
      <p className="compare-caption">同一项目、同一文案，对比材质与交互。</p>
      <div className="compare-projects" role="group" aria-label="Choose project">
        {projects.map(p => <button key={p.projectSlug} aria-pressed={p.projectSlug === selected} onClick={() => setSelected(p.projectSlug)}>{p.projectTitle}</button>)}
      </div>
      <div className="compare-actions">
        <button onClick={() => document.querySelectorAll<HTMLButtonElement>('.compare-stage button[aria-expanded="false"]').forEach(button => button.click())}>同时展开</button>
        <button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape'}))}>全部收起</button>
      </div>
      <div className="compare-grid">
        <section aria-label="Before"><h2>Before <span>原首页组件</span></h2><div className="compare-stage"><article key={`old-${selected}`} className="project-card"><ProjectCardTldr {...project} /></article></div></section>
        <section aria-label="After"><h2>After <span>磨砂翻转组件</span></h2><div className="compare-stage"><article key={`new-${selected}`} className="project-card frosted-project-card"><ProjectFolderCard {...project} /></article></div></section>
      </div>
      <p className="compare-note">Hover 上方封面查看预览，点击展开摘要。点击前盖进入首页对应案例。</p>
      <nav className="compare-links"><a href="http://localhost:3000/#work">查看主站首页 ↗</a><a href="./material-study.html">独立材质实验 ↗</a></nav>
    </main>
    <CustomCursor />
  </>;
}
createRoot(document.getElementById('comparison-root')!).render(<Comparison />);
