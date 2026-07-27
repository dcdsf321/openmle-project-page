"use client";

import { useEffect, useState } from "react";

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

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>("bright");

  useEffect(() => {
    const activeTheme =
      document.documentElement.dataset.theme === "dark" ? "dark" : "bright";
    setTheme(activeTheme);
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
        <div className="hero-grid">
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
        <div className="the-edge" />
        <a className="scroll-cue" href="#overview">
          Explore the system <Arrow down />
        </a>
      </section>

      <section className="section section-light" id="overview">
        <div className="section-heading">
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

        <figure className="media-frame wide-media">
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

        <div className="system-grid">
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
        <div className="abstract-copy">
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
        <div className="section-heading inverse">
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

        <div className="operator-grid">
          {operators.map((operator) => (
            <article key={operator.name}>
              <span>{operator.number}</span>
              <h3>{operator.name}</h3>
              <p>{operator.description}</p>
            </article>
          ))}
        </div>

        <figure className="media-frame dark-media">
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
        <div className="section-heading">
          <p className="kicker">03 / Results</p>
          <h2>
            Training gains and search
            <br />
            gains compose.
          </h2>
        </div>

        <div className="result-band">
          <div className="result-primary">
            <span className="result-label">MLE-Bench Lite · Medal Average</span>
            <strong>71.21%</strong>
            <p>
              Frontis-MA1-35B with OpenMLE-Evo-Max under a fixed six GPU-hour
              per-task budget.
            </p>
          </div>
          <div className="result-steps" aria-label="Performance progression">
            <article>
              <span>Base model</span>
              <strong>39.39%</strong>
              <p>Qwen3.6-35B-A3B + OpenMLE-Evo</p>
            </article>
            <div className="step-connector" aria-hidden="true">
              <span />
              <i />
            </div>
            <article>
              <span>Post-trained</span>
              <strong>60.61%</strong>
              <p>Frontis-MA1-35B + OpenMLE-Evo</p>
            </article>
            <div className="step-connector" aria-hidden="true">
              <span />
              <i />
            </div>
            <article>
              <span>Search enhanced</span>
              <strong>71.21%</strong>
              <p>Frontis-MA1-35B + OpenMLE-Evo-Max</p>
            </article>
          </div>
        </div>

        <figure className="media-frame results-figure">
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
        <div className="sandbox-copy">
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
        <figure className="media-frame sandbox-figure">
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
        <div>
          <p className="kicker">05 / Citation</p>
          <h2>Build on OpenMLE.</h2>
          <p>
            This is a visual demo based on the current working paper. Replace
            the placeholder publication metadata once the public release is
            finalized.
          </p>
        </div>
        <div className="citation-block">
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
