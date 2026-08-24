import {
  ClientHeader,
  ClientMintCard,
  ClientMyBricks,
} from "@/components/ClientOnly";

export default function Home() {
  return (
    <main>
      <ClientHeader />

      <div className="page-shell">
        <section className="hero-grid">
          <div className="hero-left">
            <div className="hero-mark">
              <img
                src="/logonobg.png"
                alt="404 Bricks"
              />
            </div>

            <div
  style={{
    width: "100%",
    maxWidth: "540px",
    marginTop: "auto",
    paddingBottom: "60px",
  }}
>
  <div
    style={{
      marginBottom: "18px",
      color: "#ccff00",
      fontSize: "15px",
      fontWeight: 900,
      letterSpacing: "0.18em",
    }}
  >
    ABOUT
  </div>

  <h3
    style={{
      margin: 0,
      marginBottom: "28px",
      maxWidth: "570px",
      color: "#ffffff",
      fontSize: "40px",
      lineHeight: 1.02,
      fontWeight: 900,
      letterSpacing: "-0.045em",
    }}
  >
    404 BRICKS.
  </h3>

  <p
    style={{
      margin: 0,
      marginBottom: "16px",
      maxWidth: "520px",
      color: "#8d8d8d",
      fontSize: "15px",
      lineHeight: 1.65,
      fontWeight: 400,
    }}
  >
    404 Bricks is an onchain collectible inspired by the ERC-404 concept, combining NFT ownership with $BRICKS fractionalization.
  </p>

  <p
    style={{
      margin: 0,
      marginBottom: "24px",
      maxWidth: "520px",
      color: "#8d8d8d",
      fontSize: "15px",
      lineHeight: 1.65,
      fontWeight: 400,
    }}
  >
    Hold the full Brick, split it into $BRICKS, trade the pieces, or rebuild the Brick when you have the full amount.
  </p>

  <div
    style={{
      color: "#ccff00",
      fontSize: "15px",
      fontWeight: 900,
      letterSpacing: "0.08em",
    }}
  >
    One Brick. More ways to own it.
  </div>
</div>
          </div>

          <ClientMintCard />
        </section>

        <ClientMyBricks />

        <footer className="site-footer">
          <div className="footer-left">
            <span className="footer-brand">
              © 404 BRICKS
            </span>
          </div>

          <div className="footer-links">
            <a
              href="https://x.com/404bricks_"
              target="_blank"
              rel="noreferrer"
            >
              X
            </a>

            <a
              href="https://opensea.io/collection/bricks-404"
              target="_blank"
              rel="noreferrer"
            >
              OPENSEA
            </a>

            <a
              href="https://robinhoodchain.blockscout.com/token/0x1bb56feE0c37762610E837aFE4deBAedb670b6d4"
              target="_blank"
              rel="noreferrer"
            >
              CONTRACT
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}