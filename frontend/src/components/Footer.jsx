export default function Footer() {
  return (
    <footer>
      <a
        target="_blank"
        href="https://github.com/martinsmeder"
        rel="noreferrer"
        className="github"
      >
        <p>Code by Martin Smeder</p>
        <img src="github.png" alt="Github" />
      </a>

      <div className="apis">
        <a
          target="_blank"
          href="https://huggingface.co/facebook/bart-large-cnn"
          rel="noreferrer"
        >
          <p>
            AI model <span className="extraText">hosted by HF</span>
          </p>
          <img src="hf.png" alt="Huggingface" />
        </a>

        <a target="_blank" href="https://jooble.org/api/about" rel="noreferrer">
          <p>
            Job data <span className="extraText">aggregated by</span>
          </p>
          <img src="jooble.png" alt="Jooble" />
        </a>
      </div>
    </footer>
  );
}
