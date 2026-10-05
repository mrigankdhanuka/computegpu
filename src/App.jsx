import { useState } from "react";
import "./App.css";

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const DOMAIN = "computegpu.world";

const REASONS = [
  {
    title: "It says what it is",
    body: "Compute and GPU are the exact words buyers, investors and developers search for when they need AI hardware. The name explains the business before anyone reads a word of your site.",
  },
  {
    title: "It sits in a growing category",
    body: "Training and running AI models runs on GPUs. GPU clouds, rental marketplaces and decentralized compute networks all need a name people can remember and type correctly.",
  },
  {
    title: "Easy to say, spell and share",
    body: "Two plain English words. No hyphens, no numbers, no invented spelling. It works on a podcast, on a slide, or in a voice message.",
  },
  {
    title: ".world fits a global product",
    body: "GPU capacity is rented across borders. A .world address suits a marketplace or network that serves customers everywhere, and it stays easy to pair with a .com later.",
  },
  {
    title: "One name, many businesses",
    body: "A GPU rental marketplace, a decentralized compute network, an AI cloud, a hardware reseller, a benchmarking site. The domain does not lock you into one of them.",
  },
  {
    title: "Priced below the owner's own estimate",
    body: "The owner values the domain at around $50,000. The asking price is $10,000, so a buyer starts with room to grow into the name.",
  },
];

const COLS = 12;
const ROWS = 7;

function CoreGrid() {
  const cells = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      cells.push(
        <span
          key={`${r}-${c}`}
          className={`core ${(r * 5 + c * 3) % 7 === 0 ? "core--amber" : ""}`}
          style={{ "--delay": `${(r + c) * 0.06}s` }}
        />
      );
    }
  }
  return (
    <div className="grid" role="img" aria-label="A grid of GPU cores lighting up in sequence">
      {cells}
    </div>
  );
}

function Price() {
  return (
    <div className="price">
      <p className="price__label">Asking price</p>
      <p className="price__ask">$10,000</p>
      <p className="price__was">
        <span className="price__old">
          $50,000
          <i className="price__strike" />
        </span>{" "}
        owner's estimate of value
      </p>
    </div>
  );
}

function OfferForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (!ACCESS_KEY) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");
    const formData = new FormData(form);
    formData.append("access_key", ACCESS_KEY);
    formData.append("subject", `Offer for ${DOMAIN}`);
    formData.append("from_name", `${DOMAIN} landing page`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        Your name
        <input type="text" name="name" autoComplete="name" required />
      </label>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label>
        Your offer (USD)
        <input type="text" name="offer" inputMode="numeric" placeholder="10,000" />
      </label>
      <label>
        Message
        <textarea name="message" rows="4" placeholder="Tell me what you plan to build." required />
      </label>
      {/* Spam trap: Web3Forms rejects submissions where this is checked */}
      <input type="checkbox" name="botcheck" className="hp" tabIndex="-1" autoComplete="off" />

      <button
        type="submit"
        className="btn"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send offer"}
      </button>

      {status === "ok" && (
        <p className="note note--ok" role="status">
          Offer sent. You will get a reply by email.
        </p>
      )}
      {status === "unconfigured" && (
        <p className="note note--err" role="alert">
          The offer form is not available yet. Please try again later.
        </p>
      )}
      {status === "error" && (
        <p className="note note--err" role="alert">
          Your offer was not sent. Check your connection and try again.
        </p>
      )}
    </form>
  );
}

export default function App() {
  return (
    <>
      <header className="hero">
        <div className="wrap hero__inner">
          <p className="tag">Domain for sale</p>
          <h1 className="wordmark">{DOMAIN}</h1>
          <div className="hero__copy">
            <p className="lede">
              A name for whoever builds the next place to rent, train and run on GPUs.
            </p>
            <Price />
            <a className="btn" href="#offer">Make an offer</a>
          </div>
          <CoreGrid />
        </div>
      </header>

      <main>
        <section className="wrap why" id="why">
          <h2>Why $10,000 is a fair price</h2>
          <ul className="reasons">
            {REASONS.map((r) => (
              <li key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="wrap offer" id="offer">
          <div>
            <h2>Make an offer</h2>
            <p>
              Send your name, email and offer. I reply personally. The sale is paid and transferred
              through an escrow service, so neither side takes a risk.
            </p>
          </div>
          <OfferForm />
        </section>
      </main>

      <footer className="wrap footer">
        <p>{DOMAIN} is for sale. Price shown in US dollars.</p>
      </footer>
    </>
  );
}
