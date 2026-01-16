import { useEffect, useState, useRef } from "react";

/* ---------- App with boot modes ---------- */

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const [bootMode, setBootMode] = useState("cold"); // "cold" | "restart"

  useEffect(() => {
    if (!bootDone) {
      const t = setTimeout(() => setBootDone(true), 2800);
      return () => clearTimeout(t);
    }
  }, [bootDone]);

  if (!bootDone) {
    return (
      <BootScreen
        message={
          bootMode === "cold"
            ? "Initializing profile… Loading skills… Welcome, Benny."
            : "Restarting Windows XP Portfolio…"
        }
      />
    );
  }

  return <Desktop setBootDone={setBootDone} setBootMode={setBootMode} />;
}

/* ---------- Boot screen ---------- */

function BootScreen({
  message = "Initializing profile… Loading skills… Welcome",
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return p + 4;
      });
    }, 80);
    return () => clearInterval(id);
  }, []);

  const barWidth = Math.min(progress, 100);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#00309c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexDirection: "column",
        gap: 20,
        fontFamily: "Tahoma, system-ui, sans-serif",
      }}
    >
      {/* XP logo image: file must be at public/xp-logo.png */}
      <img
        src="public/xp logo.png"
        alt="Windows XP"
        style={{ height: 150, marginBottom: 10 }}
      />

      {/* Pixel loading bar */}
      <div
        style={{
          width: 220,
          height: 10,
          border: "1px solid #0a2150",
          background: "#001a66",
          overflow: "hidden",
          borderRadius: 999,
          marginTop: 20,
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background:
              "repeating-linear-gradient(90deg, #71a1ff 0, #71a1ff 4px, #00309c 4px, #00309c 6px)",
          }}
        />
      </div>

      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
        {message}
      </div>
    </div>
  );
}

/* ---------- Desktop ---------- */

function Desktop({ setBootDone, setBootMode }) {
  const [openWindow, setOpenWindow] = useState(null);
  const [clock, setClock] = useState(new Date());
  const [wifiOn, setWifiOn] = useState(true);
  const [startOpen, setStartOpen] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [showBtDevices, setShowBtDevices] = useState(false);

  const [positions, setPositions] = useState({
    about: { x: 120, y: 80 },
    projects: { x: 240, y: 90 },
    skills: { x: 180, y: 130 },
    experience: { x: 260, y: 160 },
    contact: { x: 210, y: 200 },
    calculator: { x: 340, y: 120 },
    notepad: { x: 320, y: 180 },
    music: { x: 140, y: 220 },
  });

  const [drag, setDrag] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeString = clock.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = clock.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  useEffect(() => {
    function onMove(e) {
      if (!drag) return;
      const { id, offsetX, offsetY } = drag;
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      setPositions((prev) => ({
        ...prev,
        [id]: { x, y },
      }));
    }

    function onUp() {
      setDrag(null);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag]);

  const startDrag = (id, e) => {
    const pos = positions[id];
    setDrag({
      id,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
    });
  };

  const currentTitle =
    openWindow === "about"
      ? "user_profile.exe"
      : openWindow === "projects"
      ? "Projects"
      : openWindow === "skills"
      ? "Skills"
      : openWindow === "experience"
      ? "Experience"
      : openWindow === "contact"
      ? "Contact"
      : openWindow === "calculator"
      ? "Calculator"
      : openWindow === "notepad"
      ? "Notepad"
      : openWindow === "music"
      ? "Media Player"
      : "XP Portfolio";

  const handleShutdownChoice = (choice) => {
    if (choice === "restart") {
      setShowShutdown(false);
      setOpenWindow(null);
      setStartOpen(false);
      setBootMode("restart");
      setBootDone(false);
      return;
    }
    if (choice === "turnoff") {
      window.location.href = "about:blank";
      return;
    }
    if (choice === "cancel") {
      setShowShutdown(false);
    }
  };

  return (
    <div
      className="desktop"
      onClick={() => {
        if (startOpen) setStartOpen(false);
      }}
    >
      {/* Desktop icons */}
      <div className="desktop-icons">
        <DesktopIcon
          label="About Me"
          emoji="👤"
          onOpen={() => setOpenWindow("about")}
        />
        <DesktopIcon
          label="Projects"
          emoji="📁"
          onOpen={() => setOpenWindow("projects")}
        />
        <DesktopIcon
          label="Skills"
          emoji="🛠️"
          onOpen={() => setOpenWindow("skills")}
        />
        <DesktopIcon
          label="Experience"
          emoji="💼"
          onOpen={() => setOpenWindow("experience")}
        />
        <DesktopIcon
          label="Contact"
          emoji="✉️"
          onOpen={() => setOpenWindow("contact")}
        />
        <DesktopIcon
          label="Calculator"
          emoji="🧮"
          onOpen={() => setOpenWindow("calculator")}
        />
        <DesktopIcon
          label="Notepad"
          emoji="📄"
          onOpen={() => setOpenWindow("notepad")}
        />
        <DesktopIcon
          label="Music"
          emoji="🎵"
          onOpen={() => setOpenWindow("music")}
        />
      </div>

      {/* About */}
      <XPWindow
        id="about"
        title="user_profile.exe"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.about}
        startDrag={startDrag}
      >
        <h3 style={{ fontSize: 18, marginBottom: 4 }}>Benny Daniel</h3>
        <p style={{ fontSize: 13 }}>
          BCA student at Christ University, Bengaluru with a strong foundation
          in computer science and a growing interest in frontend development and
          software engineering.
        </p>
        <p style={{ fontSize: 13, marginTop: 4 }}>
          Enjoys building structured, user-friendly web interfaces and
          continuously improving technical and problem-solving skills through
          academic and personal projects.
        </p>
        <p style={{ fontSize: 13, marginTop: 4 }}>
          Has gained real-world exposure through internships in travel
          operations, data management, and customer coordination, learning to
          work efficiently in fast-paced environments.
        </p>
        <p style={{ fontSize: 13, marginTop: 4 }}>
          Values consistency, discipline, and learning through hands-on
          experience, and is seeking internship or entry-level opportunities to
          apply programming knowledge to real-world products.
        </p>
      </XPWindow>

      {/* Projects */}
      <XPWindow
        id="projects"
        title="Projects"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.projects}
        startDrag={startDrag}
      >
        <h3>Projects</h3>
        <ul>
          <li>
            Frontend practice – responsive HTML5/CSS3 pages with clean layouts
            and usability focus.
          </li>
          <br></br>
          <li>
            JavaScript learning – form validation, DOM manipulation, and
            logic‑based features.
          </li>
          <br></br>
          <li>
            Academic programming – C, C++, SQL and PL/SQL assignments and lab
            work.
          </li>
          <br></br>
          <li>
            Data handling – structured entry, validation and documentation in
            internships.
          </li>
        </ul>
      </XPWindow>

      {/* Skills */}
      <XPWindow
        id="skills"
        title="Skills"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.skills}
        startDrag={startDrag}
      >
        <h3>Technical Skills</h3>
        <ul>
          <li>Web: HTML5, CSS3</li>
          <li>Programming: C (Basics), C++ (Fundamentals), SQL, PL/SQL, JS (learning)</li>
          <li>Tools: VS Code, Excel, Word, PowerPoint, Google Workspace</li>
        </ul>
        <h3>Core Strengths</h3>
        <ul>
          <li>Clean and structured coding approach</li>
          <li>Data management and documentation</li>
          <li>Logical thinking and debugging</li>
          <li>Responsive UI development</li>
          <li>Continuous learning mindset</li>
        </ul>
      </XPWindow>

      {/* Experience */}
      <XPWindow
        id="experience"
        title="Experience"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.experience}
        startDrag={startDrag}
      >
        <h3 style={{ fontSize: 16, marginBottom: 4 }}>
          Travel Operations Intern – Pragathi Communication & Travel (2025)
        </h3>
        <ul style={{ fontSize: 13, marginBottom: 8 }}>
          <li>Processed and maintained B2B client records with high accuracy.</li>
          <li>Assisted with bookings, documentation and passport services.</li>
          <li>Coordinated between clients, field teams and engineers.</li>
        </ul>
        <h3 style={{ fontSize: 16, marginBottom: 4 }}>
          Data Entry & Customer Support – Canon India (2024)
        </h3>
        <ul style={{ fontSize: 13 }}>
          <li>Managed service-related data in internal systems.</li>
          <li>Interacted with customers and documented technical issues.</li>
          <li>Helped with scheduling and task allocation for technical staff.</li>
        </ul>
      </XPWindow>

      {/* Contact */}
      <XPWindow
        id="contact"
        title="Contact"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.contact}
        startDrag={startDrag}
      >
        <h3>Contact & Social</h3>
        <p>Email: bennydanii793@gmail.com</p>
        <p>Phone: +91 63636 28316</p>
        <p>
          GitHub:{" "}
          <a
            href="https://github.com/benny-daniel33"
            target="_blank"
            rel="noreferrer"
          >
            github.com/benny-daniel33
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a
            href="https://www.linkedin.com/in/d-benny-daniel-459a03312"
            target="_blank"
            rel="noreferrer"
          >
            d-benny-daniel-459a03312
          </a>
        </p>
        <p>
          Instagram:{" "}
          <a
            href="https://www.instagram.com/dani.slatt/"
            target="_blank"
            rel="noreferrer"
          >
            @dani.slatt
          </a>
        </p>
        <p style={{ marginTop: 8, fontStyle: "italic", fontSize: 12 }}>
          “Learning.exe is running in the background.”
        </p>
      </XPWindow>

      {/* Calculator */}
      <XPWindow
        id="calculator"
        title="Calculator"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.calculator}
        startDrag={startDrag}
      >
        <Calculator />
      </XPWindow>

      {/* Notepad */}
      <XPWindow
        id="notepad"
        title="Notepad"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.notepad}
        startDrag={startDrag}
      >
        <Notepad />
      </XPWindow>

      {/* Music Player */}
      <XPWindow
        id="music"
        title="Media Player"
        openWindow={openWindow}
        setOpenWindow={setOpenWindow}
        pos={positions.music}
        startDrag={startDrag}
      >
        <MusicPlayer />
      </XPWindow>

      {/* Taskbar */}
      <div
        className="taskbar"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          className="start-btn"
          onClick={(e) => {
            e.stopPropagation();
            setStartOpen((v) => !v);
          }}
        >
          <span>⊞</span>
          <span>Start</span>
        </button>
        <div className="taskbar-title">{currentTitle}</div>
        <div className="taskbar-spacer" />
        <div className="tray-icons">
          <span
            title={wifiOn ? "Wireless Network" : "Wireless Off"}
            style={{ cursor: "pointer" }}
            onClick={() => setWifiOn((v) => !v)}
          >
            {wifiOn ? "📶" : "🚫"}
          </span>
          <span
            title="Bluetooth devices"
            style={{ cursor: "pointer" }}
            onClick={() => setShowBtDevices((v) => !v)}
          >
            🔷
          </span>
        </div>
        <div className="taskbar-clock">
          <div>{timeString}</div>
          <div style={{ fontSize: 10 }}>{dateString}</div>
        </div>
      </div>

      {/* Start menu */}
      {startOpen && (
        <StartMenu
          onOpen={(id) => {
            setOpenWindow(id);
            setStartOpen(false);
          }}
          onShutdown={() => {
            setStartOpen(false);
            setShowShutdown(true);
          }}
        />
      )}

      {/* Shut Down dialog */}
      {showShutdown && <ShutdownDialog onChoice={handleShutdownChoice} />}

      {/* Bluetooth Devices window */}
      {showBtDevices && (
        <div
          className="window"
          style={{
            position: "absolute",
            width: 260,
            height: 300,
            right: 10,
            bottom: 50,
            zIndex: 9999,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="title-bar">
            <div className="title-bar-text">Bluetooth Devices</div>
            <div className="title-bar-controls">
              <button
                aria-label="Close"
                onClick={() => setShowBtDevices(false)}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="window-body" style={{ padding: 4, fontSize: 12 }}>
            <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
              <Device name="Airdopes 91" status="Not connected" />
              <Device name="AirPods Pro" status="Not connected" />
              <Device
                name="AirPods Pro #4"
                status="Connected mic, audio"
                active
              />
              <Device name="Apple" status="Not connected" />
              <Device name="boAt Rockerz 255 Pro" status="Not connected" />
              <Device name="Boult Audio Airbass" status="Not connected" />
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Start menu & Shutdown ---------- */

function StartMenu({ onOpen, onShutdown }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        bottom: 40,
        width: 260,
        height: 280,
        background: "#d4d0c8",
        border: "1px solid #000",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ flex: 1, display: "flex", fontSize: 12 }}>
        <div
          style={{
            width: 70,
            background: "#0a246a",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 8,
            fontWeight: "bold",
          }}
        >
          <div style={{ fontSize: 18 }}>XP</div>
          <div>Portfolio</div>
        </div>
        <div
          style={{
            flex: 1,
            padding: 6,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <button style={startItemStyle} onClick={() => onOpen("about")}>
            👤 About Me
          </button>
          <button style={startItemStyle} onClick={() => onOpen("projects")}>
            📁 Projects
          </button>
          <button style={startItemStyle} onClick={() => onOpen("skills")}>
            🛠️ Skills
          </button>
          <button style={startItemStyle} onClick={() => onOpen("experience")}>
            💼 Experience
          </button>
          <button style={startItemStyle} onClick={() => onOpen("contact")}>
            ✉️ Contact
          </button>
          <button style={startItemStyle} onClick={() => onOpen("calculator")}>
            🧮 Calculator
          </button>
          <button style={startItemStyle} onClick={() => onOpen("notepad")}>
            📄 Notepad
          </button>
          <button style={startItemStyle} onClick={() => onOpen("music")}>
            🎵 Media Player
          </button>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #808080",
          padding: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          style={{
            fontSize: 12,
            padding: "2px 10px",
            background: "#e35d04",
            color: "white",
            border: "1px solid #000",
            cursor: "pointer",
          }}
          onClick={onShutdown}
        >
          Shut Down…
        </button>
      </div>
    </div>
  );
}

const startItemStyle = {
  textAlign: "left",
  padding: "3px 6px",
  background: "#d4d0c8",
  border: "1px solid transparent",
  cursor: "pointer",
};

function ShutdownDialog({ onChoice }) {
  return (
    <div
      className="window"
      style={{
        position: "absolute",
        width: 320,
        height: 180,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    >
      <div className="title-bar">
        <div className="title-bar-text">Shut Down Windows</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={() => onChoice("cancel")}>
            ✕
          </button>
        </div>
      </div>
      <div className="window-body">
        <p style={{ marginBottom: 10 }}>
          What do you want the computer to do?
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button
            className="calc-btn"
            style={{ flex: 1 }}
            onClick={() => onChoice("turnoff")}
          >
            Turn Off
          </button>
          <button
            className="calc-btn"
            style={{ flex: 1 }}
            onClick={() => onChoice("restart")}
          >
            Restart
          </button>
          <button
            className="calc-btn"
            style={{ flex: 1 }}
            onClick={() => onChoice("cancel")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shared components ---------- */

function DesktopIcon({ label, emoji, onOpen }) {
  return (
    <div className="desktop-icon" onDoubleClick={onOpen}>
      <div className="desktop-icon-box">
        <span role="img" aria-label={label}>
          {emoji}
        </span>
      </div>
      <div>{label}</div>
    </div>
  );
}

function Device({ name, status, active }) {
  return (
    <li
      style={{
        padding: "4px 4px",
        marginBottom: 2,
        borderBottom: "1px solid #c0c0c0",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: active ? "#e0f4ff" : "transparent",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span>🎧</span>
        <span>{name}</span>
      </div>
      <div style={{ fontSize: 11, color: active ? "green" : "#555" }}>
        {active ? `● ${status}` : status}
      </div>
    </li>
  );
}

function XPWindow({
  id,
  title,
  openWindow,
  setOpenWindow,
  pos,
  startDrag,
  children,
}) {
  const visible = openWindow === id;
  if (!visible) return null;

  return (
    <div
      className="window"
      style={{
        position: "absolute",
        top: pos.y,
        left: pos.x,
        width: 460,
        height: 320,
        overflow: "hidden",
      }}
    >
      <div className="title-bar" onMouseDown={(e) => startDrag(id, e)}>
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={() => setOpenWindow(null)}>
            ✕
          </button>
        </div>
      </div>
      <div
        className="window-body"
        style={{
          height: "calc(100% - 24px)",
          overflow: "auto",
          fontSize: 13,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Calculator ---------- */

function Calculator() {
  const [value, setValue] = useState("0");

  const press = (ch) => {
    if (ch === "C") {
      setValue("0");
      return;
    }
    if (ch === "=") {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(value);
        setValue(String(result));
      } catch {
        setValue("Error");
      }
      return;
    }
    setValue((prev) =>
      prev === "0" || prev === "Error" ? String(ch) : prev + String(ch)
    );
  };

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "C",
    "+",
    "=",
  ];

  return (
    <div>
      <div
        style={{
          border: "1px inset #808080",
          marginBottom: 6,
          padding: 4,
          background: "white",
          textAlign: "right",
          fontFamily: "monospace",
        }}
      >
        {value}
      </div>
      <div className="calc-grid">
        {buttons.map((b) => (
          <button key={b} className="calc-btn" onClick={() => press(b)}>
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Notepad ---------- */

function Notepad() {
  const [text, setText] = useState(
    "Welcome to Notepad.\n\nYou can jot quick notes about tasks, ideas, or bugs here."
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>
        File&nbsp;&nbsp;Edit&nbsp;&nbsp;Format&nbsp;&nbsp;View&nbsp;&nbsp;Help
      </div>
      <textarea
        style={{
          flex: 1,
          width: "100%",
          resize: "none",
          border: "1px inset #808080",
          fontFamily: "Consolas, monospace",
          fontSize: 12,
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}

/* ---------- Music player ---------- */

function MusicPlayer() {
  const tracks = [
    {
      id: 1,
      name: "Therefore I Am",
      src: "/Music/Billie ellish - Therefore i am.mp3",
    },
    {
      id: 2,
      name: "Lovers Rock",
      src: "/Music/Lovers rock - Tv girl.mp3",
    },
    {
      id: 3,
      name: "Sunflower",
      src: "/Music/Sunflower (Spider-Man Into the Spider-Verse).mp3",
    },
    { id: 4, name: "The Glide", src: "/Music/The Glide.mp3" },
    { id: 5, name: "The Night We Met", src: "/Music/The night we met.mp3" },
  ];

  const [current, setCurrent] = useState(tracks[0]);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = current.src;

    if (playing) {
      audio.play().catch(() => {
        // autoplay blocked until user interacts; ignore
      });
    } else {
      audio.pause();
    }
  }, [current, playing]);

  const handlePlayPause = () => {
    setPlaying((p) => !p);
  };

  const handleNext = () => {
    const idx = tracks.findIndex((t) => t.id === current.id);
    const next = tracks[(idx + 1) % tracks.length];
    setCurrent(next);
    setPlaying(true);
  };

  const handlePrev = () => {
    const idx = tracks.findIndex((t) => t.id === current.id);
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length];
    setCurrent(prev);
    setPlaying(true);
  };

  return (
    <div>
      <audio ref={audioRef} />

      <h3 style={{ marginBottom: 4 }}>Media Player</h3>
      <div
        style={{
          border: "1px inset #808080",
          padding: 4,
          marginBottom: 6,
          background: "white",
          fontSize: 12,
        }}
      >
        Now {playing ? "Playing" : "Paused"}: {current.name}
      </div>
      <div style={{ marginBottom: 6 }}>
        <button className="calc-btn" onClick={handlePrev}>
          ◀
        </button>{" "}
        <button className="calc-btn" onClick={handlePlayPause}>
          {playing ? "Pause" : "Play"}
        </button>{" "}
        <button className="calc-btn" onClick={handleNext}>
          ▶
        </button>
      </div>
      <ul style={{ fontSize: 12, paddingLeft: 16 }}>
        {tracks.map((t) => (
          <li
            key={t.id}
            style={{
              cursor: "pointer",
              fontWeight: t.id === current.id ? "bold" : "normal",
            }}
            onClick={() => {
              setCurrent(t);
              setPlaying(true);
            }}
          >
            {t.name}
          </li>
        ))}
      </ul>
      <div className="rotate-overlay">
  <div>
    <h3 style={{ marginBottom: 8 }}>Rotate device</h3>
    <p style={{ fontSize: 13 }}>
      For the full Windows XP experience, tilt your phone and use the site in landscape
      mode, like a laptop screen.
    </p>
  </div>
</div>

    </div>
  );
}
