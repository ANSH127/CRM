export default function Footer() {
  return (
    <div className=" text-lg font-semibold"  style={{ textAlign: "center", padding: "1rem", color: "#555" }}>
      Built with <span style={{ color: "red" }}>❤️</span> by{" "}
      <span className="footer-link hover:underline">
        <a
          href="https://anshdev.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ansh Agarwal
        </a>
      </span>
    </div>
  );
}
