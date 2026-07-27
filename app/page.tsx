"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "bright" | "dark";

const operators = [
  {
    number: "01",
    name: "Draft",
    description: "Turn a task and its data contract into the first executable ML pipeline.",
  },
  {
    number: "02",
    name: "Improve",
    description: "Make evidence-backed upgrades to models, features, and validation.",
  },
  {
    number: "03",
    name: "Debug",
    description: "Use sandbox feedback to repair failures and recover viable branches.",
  },
  {
    number: "04",
    name: "Crossover",
    description: "Recombine complementary discoveries instead of restarting from scratch.",
  },
];

const bibtex = `@article{frontisma1_2026,
  title   = {Frontis-MA1: MetA-Evolving towards
             Recursive Self-Improvement},
  author  = {Horizon Research, Frontis.AI
             and Tsinghua University},
  year    = {2026}
}`;

function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true">{down ? "↓" : "↗"}</span>;
}

function CountUp({
  value,
  decimals = 2,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = numberRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderValue = (current: number) => {
      element.textContent = `${current.toFixed(decimals)}${suffix}`;
    };

    if (reducedMotion) {
      renderValue(value);
      return;
    }

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1250;

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          renderValue(value * eased);
          if (progress < 1) frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [decimals, suffix, value]);

  return <span ref={numberRef}>{`0${suffix}`}</span>;
}

type SearchNode = {
  parent: number | null;
  x: number;
  y: number;
  operator: "Draft" | "Improve" | "Debug" | "Crossover";
  score: number;
  failed?: boolean;
};

const searchNodes: SearchNode[] = [
  { parent: null, x: 0.5, y: 0.5, operator: "Draft", score: 0.28 },
  { parent: 0, x: 0.35, y: 0.32, operator: "Improve", score: 0.39 },
  { parent: 0, x: 0.34, y: 0.68, operator: "Draft", score: 0.33 },
  { parent: 0, x: 0.64, y: 0.31, operator: "Debug", score: 0.31 },
  { parent: 1, x: 0.2, y: 0.2, operator: "Improve", score: 0.47 },
  { parent: 1, x: 0.19, y: 0.44, operator: "Debug", score: 0, failed: true },
  { parent: 2, x: 0.18, y: 0.8, operator: "Improve", score: 0.45 },
  { parent: 3, x: 0.8, y: 0.2, operator: "Improve", score: 0.44 },
  { parent: 3, x: 0.81, y: 0.46, operator: "Debug", score: 0.42 },
  { parent: 2, x: 0.47, y: 0.82, operator: "Improve", score: 0.51 },
  { parent: 4, x: 0.08, y: 0.12, operator: "Debug", score: 0.49 },
  { parent: 6, x: 0.08, y: 0.9, operator: "Improve", score: 0.56 },
  { parent: 7, x: 0.92, y: 0.11, operator: "Improve", score: 0.53 },
  { parent: 8, x: 0.93, y: 0.56, operator: "Draft", score: 0, failed: true },
  { parent: 9, x: 0.68, y: 0.88, operator: "Improve", score: 0.6 },
  { parent: 4, x: 0.36, y: 0.12, operator: "Crossover", score: 0.63 },
  { parent: 14, x: 0.84, y: 0.82, operator: "Crossover", score: 0.71 },
];

function EvolutionSearch({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [replay, setReplay] = useState(0);
  const [hud, setHud] = useState({
    nodes: 1,
    best: searchNodes[0].score,
    operator: searchNodes[0].operator,
    complete: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const palette = {
      background: theme === "dark" ? "#000000" : "#FFFFFF",
      gray: "#3D4145",
      soft: "#F0F2F4",
      cyan: "#00C1D4",
      orange: "#FA5F26",
      text: theme === "dark" ? "#F0F2F4" : "#3D4145",
    };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frame = 0;
    let startTime = 0;
    let lastHudCount = 0;

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const point = (node: SearchNode) => ({
      x: 30 + node.x * Math.max(width - 60, 1),
      y: 42 + node.y * Math.max(height - 84, 1),
    });

    const draw = (visibleProgress: number) => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = palette.background;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = theme === "dark" ? palette.gray : "#D0D3D8";
      context.lineWidth = 1;
      context.globalAlpha = 0.55;
      for (let index = 1; index < 8; index += 1) {
        const y = (height / 8) * index;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      context.globalAlpha = 1;

      const exactProgress = visibleProgress * (searchNodes.length - 1);
      const visibleCount = Math.min(
        searchNodes.length,
        Math.floor(exactProgress) + 1,
      );
      const activeProgress = exactProgress - Math.floor(exactProgress);
      const bestScore = Math.max(
        ...searchNodes.slice(0, visibleCount).map((node) => node.score),
      );

      for (let index = 1; index < visibleCount; index += 1) {
        const node = searchNodes[index];
        if (node.parent === null) continue;
        const parent = searchNodes[node.parent];
        const from = point(parent);
        const to = point(node);
        const lineProgress =
          index === visibleCount - 1 && visibleCount < searchNodes.length
            ? activeProgress
            : 1;
        const color =
          node.operator === "Improve" || node.operator === "Debug"
            ? palette.cyan
            : palette.gray;

        context.strokeStyle = color;
        context.globalAlpha = node.failed ? 0.34 : 0.56;
        context.lineWidth = node.operator === "Crossover" ? 2 : 1.25;
        context.setLineDash(node.operator === "Debug" ? [5, 6] : []);
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(
          from.x + (to.x - from.x) * lineProgress,
          from.y + (to.y - from.y) * lineProgress,
        );
        context.stroke();
      }
      context.setLineDash([]);
      context.globalAlpha = 1;

      for (let index = 0; index < visibleCount; index += 1) {
        const node = searchNodes[index];
        const position = point(node);
        const isBest = node.score === bestScore && !node.failed;
        const nodeProgress =
          index === visibleCount - 1 && visibleCount < searchNodes.length
            ? Math.min(activeProgress * 2.2, 1)
            : 1;
        const radius = (4 + node.score * 6) * nodeProgress;

        if (node.failed) {
          context.strokeStyle = palette.gray;
          context.globalAlpha = 0.7;
          context.lineWidth = 1.5;
          context.beginPath();
          context.moveTo(position.x - 5, position.y - 5);
          context.lineTo(position.x + 5, position.y + 5);
          context.moveTo(position.x + 5, position.y - 5);
          context.lineTo(position.x - 5, position.y + 5);
          context.stroke();
          context.globalAlpha = 1;
          continue;
        }

        context.fillStyle = isBest
          ? palette.orange
          : node.operator === "Improve" || node.operator === "Debug"
            ? palette.cyan
            : palette.gray;
        context.globalAlpha = index === 0 ? 1 : 0.85;
        context.beginPath();
        context.arc(position.x, position.y, radius, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;

        if (isBest) {
          context.strokeStyle = palette.orange;
          context.lineWidth = 1.5;
          context.beginPath();
          context.arc(position.x, position.y, radius + 6, 0, Math.PI * 2);
          context.stroke();
          context.fillStyle = palette.text;
          context.font = '12px "IBM Plex Mono", monospace';
          context.fillText(
            bestScore.toFixed(2),
            position.x + radius + 12,
            position.y + 4,
          );
        }
      }

      if (visibleCount !== lastHudCount) {
        lastHudCount = visibleCount;
        const latest = searchNodes[visibleCount - 1];
        setHud({
          nodes: visibleCount,
          best: bestScore,
          operator: latest.operator,
          complete: visibleCount === searchNodes.length,
        });
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(reducedMotion ? 1 : 0);
    });
    resizeObserver.observe(stage);

    if (reducedMotion) {
      draw(1);
    } else {
      const duration = 6200;
      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        draw(eased);
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [replay, theme]);

  return (
    <div className="evolution-figure motion-reveal">
      <div className="evolution-stage" ref={stageRef}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Animated OpenMLE evolutionary program search tree"
        />
        <div className="evolution-hud" aria-live="polite">
          <span className="live-state">{hud.complete ? "COMPLETE" : "EVOLVING"}</span>
          <span>
            nodes <b>{hud.nodes}</b>
          </span>
          <span>
            best <b>{hud.best.toFixed(2)}</b>
          </span>
          <span>
            operator <b>{hud.operator}</b>
          </span>
        </div>
        <button
          className="replay-button"
          type="button"
          onClick={() => setReplay((value) => value + 1)}
          aria-label="Replay evolutionary search animation"
        >
          Replay ↻
        </button>
      </div>
      <div className="evolution-legend" aria-label="Search operator legend">
        <span>
          <i className="legend-node draft" /> Draft
        </span>
        <span>
          <i className="legend-node improve" /> Improve
        </span>
        <span>
          <i className="legend-node debug" /> Debug
        </span>
        <span>
          <i className="legend-node crossover" /> Crossover
        </span>
        <span>
          <i className="legend-failed" /> Failed run
        </span>
      </div>
      <p className="evolution-caption">
        <strong>Live simulation.</strong> OpenMLE-Evo expands executable programs,
        scores each branch in the sandbox, and preserves the incumbent best.
      </p>
    </div>
  );
}

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>("bright");
  const scrollProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTheme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "bright";
    setTheme(activeTheme);
  }, []);

  useEffect(() => {
    const progressBar = scrollProgressRef.current;
    if (!progressBar) return;
    document.documentElement.classList.add("motion-ready");

    const updateProgress = () => {
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      const progress = distance > 0 ? root.scrollTop / distance : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".motion-reveal, .motion-stagger",
      ),
    );
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" },
    );

    revealElements.forEach((element) => {
      if (reducedMotion) element.classList.add("is-visible");
      else revealObserver.observe(element);
    });
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", updateProgress);
    };
  }, []);

  async function copyCitation() {
    await navigator.clipboard.writeText(bibtex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function toggleTheme() {
    const nextTheme: Theme = theme === "bright" ? "dark" : "bright";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("openmle-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <main>
      <div className="scroll-progress" ref={scrollProgressRef} />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="OpenMLE home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>OpenMLE</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#overview">Overview</a>
          <a href="#method">Method</a>
          <a href="#results">Results</a>
          <a href="#citation">Citation</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "bright" ? "dark" : "bright"} mode`}
            aria-pressed={theme === "dark"}
          >
            <span className={theme === "bright" ? "is-active" : ""}>Bright</span>
            <i aria-hidden="true" />
            <span className={theme === "dark" ? "is-active" : ""}>Dark</span>
          </button>
          <a className="nav-cta" href="./paper.pdf" target="_blank">
            Read paper <Arrow />
          </a>
        </div>
      </header>

      <section className="hero strata-zone" id="top">
        <div className="strata-lines" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, index) => (
            <i key={index} style={{ top: `${18 + index * 5.6}%` }} />
          ))}
        </div>
        <div className="hero-grid motion-stagger is-visible">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="node" />
              Open full-stack AI4AI research
            </div>
            <h1>
              MetA-Evolving
              <br />
              towards Recursive
              <br />
              Self-Improvement
            </h1>
            <p className="hero-lede">
              OpenMLE aligns post-training and inference around the same atomic
              program-evolution operators—closing the loop between learning,
              execution, and long-horizon search.
            </p>
            <div className="resource-row">
              <a className="button button-primary" href="./paper.pdf" target="_blank">
                Paper PDF <Arrow />
              </a>
              <a
                className="button"
                href="https://github.com/FrontisAI"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <Arrow />
              </a>
              <a
                className="button"
                href="https://huggingface.co/FrontisAI"
                target="_blank"
                rel="noreferrer"
              >
                Models <Arrow />
              </a>
            </div>
            <p className="affiliations">
              Horizon Research, Frontis.AI <span>×</span> Tsinghua University
            </p>
          </div>

          <aside className="hero-aside" aria-label="Project summary">
            <p className="aside-index">RSI / 2026</p>
            <div className="threshold-diagram" aria-hidden="true">
              <span className="state-line state-line-a" />
              <span className="state-line state-line-b" />
              <span className="state-line state-line-c" />
              <span className="state-line state-line-d" />
              <i className="node node-a" />
              <i className="node node-b" />
              <i className="node node-c" />
              <i className="node node-d" />
              <b>EXECUTE</b>
            </div>
            <div className="aside-note">
              <span>One system</span>
              <strong>Training ↔ Search</strong>
            </div>
          </aside>
        </div>
        <EvolutionSearch theme={theme} />
        <div className="the-edge" />
        <a className="scroll-cue" href="#overview">
          Explore the system <Arrow down />
        </a>
      </section>

      <section className="section section-light" id="overview">
        <div className="section-heading motion-stagger">
          <p className="kicker">01 / Overview</p>
          <h2>
            AI that improves
            <br />
            the process of building AI.
          </h2>
          <p className="section-intro">
            Machine learning engineering is a concrete testbed for recursive
            self-improvement: every proposed change can be executed, measured,
            and fed back into the next decision.
          </p>
        </div>

        <figure className="media-frame wide-media motion-reveal">
          <img
            src="./media/teaser.png"
            alt="OpenMLE system overview showing Gym, ERL, and Evo components"
          />
          <figcaption>
            <span>Figure 01</span>
            A full-stack loop from verifiable environments to learned operators
            and long-horizon evolution.
          </figcaption>
        </figure>

        <div className="system-grid motion-stagger">
          <article>
            <span className="system-index">01</span>
            <div>
              <h3>OpenMLE-Gym</h3>
              <p>Verifiable task environments and execution feedback.</p>
            </div>
          </article>
          <article>
            <span className="system-index">02</span>
            <div>
              <h3>OpenMLE-ERL</h3>
              <p>Execution-grounded SFT and RL for operator learning.</p>
            </div>
          </article>
          <article>
            <span className="system-index">03</span>
            <div>
              <h3>OpenMLE-Evo</h3>
              <p>Long-horizon search that composes learned operators.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="abstract-section">
        <div className="abstract-index">
          <span className="node" />
          Abstract
        </div>
        <div className="abstract-copy motion-reveal">
          <p className="abstract-lead">
            Recursive self-improvement requires AI systems that improve the
            process of building AI.
          </p>
          <p>
            We introduce OpenMLE, an open full-stack system for studying RSI in
            machine learning engineering. Its core design aligns post-training
            and inference around four atomic program-evolution operators. The
            same operators are trained through execution-grounded SFT and RL,
            then composed into long-horizon search—closing a meta-evolutionary
            loop between learning and evolution.
          </p>
        </div>
      </section>

      <section className="section section-dark" id="method">
        <div className="the-edge top-edge" />
        <div className="section-heading inverse motion-stagger">
          <p className="kicker">02 / Method</p>
          <h2>
            Four operators.
            <br />
            One evolving system.
          </h2>
          <p className="section-intro">
            The operator vocabulary stays fixed across post-training and
            inference, so every executed rollout can become learning signal.
          </p>
        </div>

        <div className="operator-grid motion-stagger">
          {operators.map((operator) => (
            <article key={operator.name}>
              <span>{operator.number}</span>
              <h3>{operator.name}</h3>
              <p>{operator.description}</p>
            </article>
          ))}
        </div>

        <figure className="media-frame dark-media motion-reveal">
          <img
            src="./media/learning-rollouts.png"
            alt="Diagram showing how OpenMLE learns from executed rollouts"
          />
          <figcaption>
            <span>Figure 02</span>
            Executed trajectories turn trial, feedback, and repair into reusable
            operator experience.
          </figcaption>
        </figure>
      </section>

      <section className="section section-results" id="results">
        <div className="section-heading motion-stagger">
          <p className="kicker">03 / Results</p>
          <h2>
            Training gains and search
            <br />
            gains compose.
          </h2>
        </div>

        <div className="result-band motion-reveal">
          <div className="result-primary">
            <span className="result-label">MLE-Bench Lite · Medal Average</span>
            <strong>
              <CountUp value={71.21} suffix="%" />
            </strong>
            <p>
              Frontis-MA1-35B with OpenMLE-Evo-Max under a fixed six GPU-hour
              per-task budget.
            </p>
          </div>
          <div className="result-steps" aria-label="Performance progression">
            <article>
              <span>Base model</span>
              <strong>
                <CountUp value={39.39} suffix="%" />
              </strong>
              <p>Qwen3.6-35B-A3B + OpenMLE-Evo</p>
            </article>
            <div className="step-connector" aria-hidden="true">
              <span />
              <i />
            </div>
            <article>
              <span>Post-trained</span>
              <strong>
                <CountUp value={60.61} suffix="%" />
              </strong>
              <p>Frontis-MA1-35B + OpenMLE-Evo</p>
            </article>
            <div className="step-connector" aria-hidden="true">
              <span />
              <i />
            </div>
            <article>
              <span>Search enhanced</span>
              <strong>
                <CountUp value={71.21} suffix="%" />
              </strong>
              <p>Frontis-MA1-35B + OpenMLE-Evo-Max</p>
            </article>
          </div>
        </div>

        <figure className="media-frame results-figure motion-reveal">
          <img
            src="./media/main-results.png"
            alt="Main MLE-Bench Lite comparison and parameter-performance Pareto frontier"
          />
          <figcaption>
            <span>Figure 03</span>
            Main model–harness results on MLE-Bench Lite. Values are drawn from
            the current paper draft.
          </figcaption>
        </figure>
      </section>

      <section className="section sandbox-section">
        <div className="sandbox-copy motion-stagger">
          <p className="kicker">04 / Execution substrate</p>
          <h2>Every idea meets reality.</h2>
          <p>
            Isolated sandboxes execute candidate solutions, validate artifacts,
            capture failure signals, and return structured evidence to the
            evolutionary loop.
          </p>
          <div className="guide-list">
            <div>
              <strong>Verifiable</strong>
              <span>Scores come from actual execution.</span>
            </div>
            <div>
              <strong>Long-horizon</strong>
              <span>Useful branches keep evolving after first success.</span>
            </div>
            <div>
              <strong>Transferable</strong>
              <span>Model and framework gains extend to NatureBench Lite.</span>
            </div>
          </div>
        </div>
        <figure className="media-frame sandbox-figure motion-reveal">
          <img
            src="./media/sandbox-architecture.png"
            alt="OpenMLE sandbox architecture"
          />
          <figcaption>
            <span>Figure 04</span>
            The execution layer that grounds learning and search.
          </figcaption>
        </figure>
      </section>

      <section className="citation-section" id="citation">
        <div className="motion-stagger">
          <p className="kicker">05 / Citation</p>
          <h2>Build on OpenMLE.</h2>
          <p>
            This is a visual demo based on the current working paper. Replace
            the placeholder publication metadata once the public release is
            finalized.
          </p>
        </div>
        <div className="citation-block motion-reveal">
          <pre>
            <code>{bibtex}</code>
          </pre>
          <button type="button" onClick={copyCitation} aria-live="polite">
            {copied ? "Copied" : "Copy BibTeX"}
          </button>
        </div>
      </section>

      <footer>
        <div className="the-edge" />
        <div className="footer-inner">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>OpenMLE</span>
          </a>
          <p>MetA-Evolving towards Recursive Self-Improvement.</p>
          <div className="footer-links">
            <a href="./paper.pdf" target="_blank">
              Paper
            </a>
            <a href="https://github.com/FrontisAI" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://huggingface.co/FrontisAI" target="_blank" rel="noreferrer">
              Hugging Face
            </a>
          </div>
          <p className="credit">
            Academic page structure inspired by{" "}
            <a href="https://nerfies.github.io/" target="_blank" rel="noreferrer">
              Nerfies
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
