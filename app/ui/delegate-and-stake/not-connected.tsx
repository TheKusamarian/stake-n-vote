export function NotConnected() {
  return (
    <p>
      Please install a polkadot compatible wallet like{" "}
      <a className="underline" href="https://www.talisman.xyz/download">
        Talisman
      </a>{" "}
      or{" "}
      <a className="underline" href="https://polkadot.js.org/extension/">
        polkadot.js
      </a>{" "}
      and allow this site access to your account by clicking the wallet connect
      icon in the top right corner.
    </p>
  );
}
