"use client";

/* eslint-disable @next/next/no-img-element -- Uses prebuilt responsive WebP assets. */
import { useId, useRef, useState, type KeyboardEvent } from "react";

export type ComparisonImage = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  label: string;
  shortLabel: string;
};

const problemSizes = "(max-width: 600px) min(320px, calc(100vw - 40px)), (max-width: 760px) 40vw, (max-width: 1100px) calc((100vw - 296px) * .404), (max-width: 1216px) calc((100vw - 344px) * .404), 352px";
const optionSizes = "(max-width: 600px) calc(100vw - 40px), (max-width: 760px) 60vw, (max-width: 1100px) calc((100vw - 296px) * .596), (max-width: 1216px) calc((100vw - 344px) * .596), 520px";

export function LivisSourceComparison({ problem, options }: { problem: ComparisonImage; options: ComparisonImage[] }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % options.length
      : event.key === "ArrowLeft" ? (index - 1 + options.length) % options.length
      : event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return <figure className="livis-source-comparison" id="livis-source-comparison" aria-label="消息来源：问题与三个方案对比">
    <div className="livis-source-grid">
      <div className="livis-source-problem">
        <div className="livis-source-image">
          <img src={problem.src} srcSet={problem.srcSet} sizes={problemSizes} width={problem.width} height={problem.height} alt={problem.alt} loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="livis-source-options">
        {options.map((option, index) => <div key={option.src} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index}>
          {selected === index ? <div className="livis-source-image">
            <img src={option.src} srcSet={option.srcSet} sizes={optionSizes} width={option.width} height={option.height} alt={option.alt} loading="lazy" decoding="async" />
          </div> : null}
        </div>)}
        <div className="livis-source-tabs" role="tablist" aria-label="切换消息来源方案">
          {options.map((option, index) => <button type="button" role="tab" key={option.src} id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} ref={element => { tabs.current[index] = element; }} onClick={() => setSelected(index)} onKeyDown={event => handleKeyDown(event, index)}>
            <span className="livis-source-tab-number">0{index + 1}</span><span>{option.shortLabel}</span>
          </button>)}
        </div>
      </div>
    </div>
  </figure>;
}
