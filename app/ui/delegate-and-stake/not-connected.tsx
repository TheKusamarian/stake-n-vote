export function NotConnected() {
  return (
    <p>
      Please click Connect in the top right corner or download the
      <br />
      <a
        className="underline"
        href="https://www.talisman.xyz/download"
        target="_blank"
      >
        Talisman Browser Extension
      </a>{" "}
      (Desktop) <br />
      or <br />
      <a className="underline" href="https://novawallet.io/" target="_blank">
        {" "}
        Nova Wallet
      </a>{" "}
      (Mobile) and then connect!
    </p>
  );
}
