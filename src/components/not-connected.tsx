export function NotConnected() {
  return (
    <>
      <p className="text-lg">⚡️ You are not connected</p>
      <p>
        Please click Connect in the top right corner or download the{" "}
        {/* <br /> */}
        <a
          className="underline"
          href="https://www.talisman.xyz/download"
          target="_blank"
          rel="noreferrer"
        >
          Talisman Browser Extension
        </a>
        (Desktop) or{" "}
        <a
          className="underline"
          href="https://novawallet.io/"
          target="_blank"
          rel="noreferrer"
        >
          Nova Wallet
        </a>{" "}
        (Mobile) and then connect!
      </p>
    </>
  )
}
