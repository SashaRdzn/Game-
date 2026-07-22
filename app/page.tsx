"use client";

import { useEffect, useMemo, useState } from "react";

type AppId = "readme" | "files" | "terminal" | "archive" | "log" | "help";
type FileId = "readme" | "photo" | "note" | "deleted" | "archive" | "log";
type WindowMode = "open" | "minimized";

const files: Record<FileId, { name: string; icon: string; app: AppId }> = {
  readme: { name: "ПРОЧТИ_МЕНЯ.txt", icon: "▤", app: "readme" },
  photo: { name: "IMG_A7.corrupt", icon: "▧", app: "files" },
  note: { name: "заметка_без_даты.txt", icon: "▤", app: "files" },
  deleted: { name: "user_fragment.log", icon: "⌫", app: "files" },
  archive: { name: "НАСЛЕДСТВО.arc", icon: "▣", app: "archive" },
  log: { name: "system.log", icon: "≡", app: "log" },
};

const bootLines = [
  "MEMORIA RECOVERY BIOS 4.12",
  "Memory check ............ 640K OK",
  "Mounting remote volume .. DEGRADED",
  "Filesystem integrity .... 63%",
  "Unauthorized session .... DETECTED",
];

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [windows, setWindows] = useState<Partial<Record<AppId, WindowMode>>>({});
  const [zOrder, setZOrder] = useState<AppId[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileId>("photo");
  const [startOpen, setStartOpen] = useState(false);
  const [terminal, setTerminal] = useState<string[]>(["MEMORIA shell v1.7", "Введите help для списка команд."]);
  const [command, setCommand] = useState("");
  const [restored, setRestored] = useState(false);
  const [archiveCode, setArchiveCode] = useState("");
  const [chapterDone, setChapterDone] = useState(false);
  const [notice, setNotice] = useState("Канал нестабилен");

  useEffect(() => {
    const saved = localStorage.getItem("memoria-progress");
    if (saved === "chapter1") {
      setBooted(true); setRestored(true); setChapterDone(true);
    }
  }, []);

  useEffect(() => {
    if (booted || bootStep >= bootLines.length) return;
    const timer = setTimeout(() => setBootStep((v) => v + 1), 650);
    return () => clearTimeout(timer);
  }, [bootStep, booted]);

  const time = useMemo(() => new Intl.DateTimeFormat("ru", { hour: "2-digit", minute: "2-digit" }).format(new Date()), []);

  function focusWindow(app: AppId) {
    setZOrder((order) => [...order.filter((id) => id !== app), app]);
  }

  function openWindow(app: AppId) {
    setWindows((current) => ({ ...current, [app]: "open" }));
    focusWindow(app);
  }

  function minimizeWindow(app: AppId) {
    setWindows((current) => ({ ...current, [app]: "minimized" }));
  }

  function closeWindow(app: AppId) {
    setWindows((current) => {
      const next = { ...current };
      delete next[app];
      return next;
    });
    setZOrder((order) => order.filter((id) => id !== app));
  }

  function toggleTaskWindow(app: AppId) {
    if (windows[app] === "minimized") openWindow(app);
    else if (zOrder[zOrder.length - 1] === app) minimizeWindow(app);
    else focusWindow(app);
  }

  function runCommand() {
    const raw = command.trim();
    const cmd = raw.toLowerCase();
    let response = `Команда не найдена: ${raw}`;
    if (!raw) return;
    if (cmd === "help") response = "Команды: ls, cat <файл>, status, recover <файл>, clear";
    if (cmd === "ls") response = "README.txt  system.log  .trash/user_fragment.log  inheritance.arc";
    if (cmd === "status") response = "Том RECOVERY: 63%  |  Последний вход: unknown_17  |  отметка времени повреждена";
    if (cmd === "cat system.log") response = "[??:14] login: unknown_17\n[??:17] deleted: user_fragment.log\n[??:18] archive locked";
    if (cmd === "cat user_fragment.log" || cmd === "cat .trash/user_fragment.log") response = restored ? "HOUR_FRAGMENT = 03\nKEY_FORMAT = HHMM" : "Ошибка: файл помечен как удалённый. Используйте recover.";
    if (cmd === "recover user_fragment.log" || cmd === "recover .trash/user_fragment.log") {
      response = "Восстановление завершено.\nHOUR_FRAGMENT = 03\nKEY_FORMAT = HHMM";
      setRestored(true);
      setNotice("Обнаружен восстановленный фрагмент");
    }
    if (cmd === "clear") { setTerminal([]); setCommand(""); return; }
    setTerminal((v) => [...v, `C:\\RECOVERY> ${raw}`, ...response.split("\n")]);
    setCommand("");
  }

  function unlockArchive() {
    const normalized = archiveCode.trim().toLowerCase().replace(/\s+/g, "");
    if (["0314", "03:14", "314"].includes(normalized)) {
      setChapterDone(true);
      localStorage.setItem("memoria-progress", "chapter1");
      setNotice("Глава 1 завершена");
    } else setNotice("Ключ отклонён. Соедините фрагменты времени в формате HHMM");
  }

  if (!booted) return (
    <main className="boot-screen" onClick={() => bootStep >= bootLines.length && setBooted(true)}>
      <div className="boot-box">
        <div className="boot-mark">M</div>
        {bootLines.slice(0, bootStep).map((line) => <p key={line}>{line}</p>)}
        {bootStep >= bootLines.length && <button className="boot-enter" onClick={() => setBooted(true)}>[ НАЖМИТЕ, ЧТОБЫ ПОДКЛЮЧИТЬСЯ ]</button>}
        <span className="cursor-block" />
      </div>
      <div className="scanlines" />
    </main>
  );

  return (
    <main className="desktop" onClick={() => startOpen && setStartOpen(false)}>
      <div className="desktop-watermark"><b>MEMORIA</b><span>REMOTE RECOVERY SYSTEM</span></div>
      <div className="warning-strip">ВНИМАНИЕ: целостность файловой системы 63% · соединение только для чтения</div>
      <section className="icons" aria-label="Рабочий стол">
        <DesktopIcon icon="▤" label="ПРОЧТИ_МЕНЯ.txt" onClick={() => openWindow("readme")} />
        <DesktopIcon icon="▣" label="НАСЛЕДСТВО.arc" onClick={() => openWindow("archive")} />
        <DesktopIcon icon="▧" label="Мои файлы" onClick={() => openWindow("files")} />
        <DesktopIcon icon="⌫" label="Корзина" onClick={() => { setSelectedFile("deleted"); openWindow("files"); }} />
        <DesktopIcon icon=">_" label="Терминал" onClick={() => openWindow("terminal")} />
      </section>

      {zOrder.map((app, index) => windows[app] === "open" && <Window key={app} title={windowTitle(app)} active={zOrder[zOrder.length - 1] === app} layer={index} app={app} onFocus={() => focusWindow(app)} onClose={() => closeWindow(app)} onMinimize={() => minimizeWindow(app)}>
        {app === "readme" && <Readme onContinue={() => openWindow("files")} />}
        {app === "files" && <FileExplorer selected={selectedFile} setSelected={setSelectedFile} restored={restored} openArchive={() => openWindow("archive")} />}
        {app === "terminal" && <div className="terminal"><div className="terminal-output">{terminal.map((line, i) => <div key={i}>{line}</div>)}</div><div className="terminal-input"><span>C:\RECOVERY&gt;</span><input value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCommand()} aria-label="Команда терминала" /></div></div>}
        {app === "archive" && <Archive restored={restored} code={archiveCode} setCode={setArchiveCode} unlock={unlockArchive} done={chapterDone} />}
        {app === "log" && <pre className="text-file">[??:14:08] LOGIN unknown_17\n[??:17:42] DELETE user_fragment.log\n[??:18:01] LOCK inheritance.arc\n[??:18:07] SESSION LOST</pre>}
        {app === "help" && <div className="document"><h2>Справка</h2><p>Исследуйте файлы двойным щелчком. Терминал понимает команды <code>help</code>, <code>ls</code>, <code>cat</code>, <code>status</code> и <code>recover</code>.</p></div>}
      </Window>)}

      <div className="status-toast"><i className={chapterDone ? "ok" : ""} /> {notice}</div>
      <footer className="taskbar">
        <button className="start" onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }}><span>◆</span> ПУСК</button>
        {zOrder.map((app) => windows[app] && <button key={app} className={`task-button ${windows[app] === "minimized" ? "is-minimized" : zOrder[zOrder.length - 1] === app ? "is-active" : ""}`} onClick={() => toggleTaskWindow(app)}>{windowTitle(app)}</button>)}
        <div className="tray"><span>▥</span><span>{time}</span></div>
      </footer>
      {startOpen && <div className="start-menu" onClick={(e) => e.stopPropagation()}><div className="start-brand">MEMORIA <small>4.1</small></div><button onClick={() => { openWindow("files"); setStartOpen(false); }}>▧ Проводник</button><button onClick={() => { openWindow("terminal"); setStartOpen(false); }}>&gt;_ Терминал</button><button onClick={() => { openWindow("help"); setStartOpen(false); }}>? Справка</button><div className="start-divider" /><button onClick={() => { localStorage.removeItem("memoria-progress"); location.reload(); }}>↻ Сбросить сеанс</button></div>}
      <div className="scanlines" />
    </main>
  );
}

function DesktopIcon({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) { return <button className="desktop-icon" onDoubleClick={onClick} onClick={onClick}><span>{icon}</span><em>{label}</em></button>; }
function Window({ title, active, layer, app, onClose, onMinimize, onFocus, children }: { title: string; active: boolean; layer: number; app: AppId; onClose: () => void; onMinimize: () => void; onFocus: () => void; children: React.ReactNode }) {
  const positions: Record<AppId, { left: string; top: string }> = { readme: { left: "48%", top: "47%" }, files: { left: "52%", top: "50%" }, terminal: { left: "55%", top: "54%" }, archive: { left: "50%", top: "49%" }, log: { left: "54%", top: "46%" }, help: { left: "46%", top: "52%" } };
  return <section className={`window ${active ? "window-active" : "window-inactive"}`} style={{ zIndex: 10 + layer, left: positions[app].left, top: positions[app].top }} onMouseDown={onFocus}><header className="titlebar"><span>▥ {title}</span><div><button aria-label={`Свернуть ${title}`} onClick={(e) => { e.stopPropagation(); onMinimize(); }}>_</button><button aria-label={`Закрыть ${title}`} onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button></div></header><nav className="menubar">Файл　 Правка　 Вид　 Справка</nav><div className="window-content">{children}</div><div className="window-status">MEMORIA REMOTE VOLUME · READ ONLY</div></section>;
}
function windowTitle(app: AppId) { return ({ readme: "ПРОЧТИ_МЕНЯ — Блокнот", files: "Проводник — RECOVERY", terminal: "Командная строка", archive: "Архиватор", log: "system.log", help: "Справка MEMORIA" })[app]; }

function Readme({ onContinue }: { onContinue: () => void }) { return <article className="document letter"><div className="stamp">URGENT<br/><b>14 MAR</b></div><p className="mono-meta">RECOVERY NOTE / НЕ ОТПРАВЛЯТЬ ПО ПОЧТЕ</p><h1>Если ты это читаешь — резервный канал сработал.</h1><p>Кто-то получил доступ к моему компьютеру. Я успел перенести сюда несколько файлов, связанных с наследством, но часть данных удалена.</p><p>Начни с первой фотографии. Система сохранила только правую половину времени, а левую кто-то удалил вместе с журналом пользователя.</p><p>Чтобы открыть архив, придётся восстановить недостающий фрагмент и соединить обе половины.</p><p className="signature">— твой брат<br/><small>P.S. Если увидишь пользователя <b>unknown_17</b>, отключись.</small></p><button className="system-button" onClick={onContinue}>Открыть файлы →</button></article>; }

function FileExplorer({ selected, setSelected, restored, openArchive }: { selected: FileId; setSelected: (id: FileId) => void; restored: boolean; openArchive: () => void }) {
  const list: FileId[] = ["photo", "note", "log", "archive", ...(restored ? ["deleted" as FileId] : [])];
  return <div className="explorer"><aside><b>RECOVERY (C:)</b><span>└─ documents</span><span>└─ archive</span><span>└─ system</span><span className="muted">└─ .trash</span></aside><div className="file-area"><div className="file-grid">{list.map((id) => <button key={id} className={selected === id ? "selected" : ""} onClick={() => setSelected(id)} onDoubleClick={() => id === "archive" && openArchive()}><span>{files[id].icon}</span><em>{files[id].name}</em></button>)}</div><FilePreview id={selected} restored={restored} openArchive={openArchive} /></div></div>;
}

function FilePreview({ id, restored, openArchive }: { id: FileId; restored: boolean; openArchive: () => void }) {
  if (id === "photo") return <div className="preview"><div className="corrupt-photo"><span><b>??</b>:14</span><i>LEFT SECTOR LOST</i></div><p><b>IMG_A7.corrupt</b></p><p>Левая часть отметки времени уничтожена. Уцелели только минуты: <b>14</b>.</p></div>;
  if (id === "note") return <div className="preview"><p><b>заметка_без_даты.txt</b></p><p>«Ключ — это полное время первой фотографии: часы, затем минуты. Часы остались в удалённом журнале».</p></div>;
  if (id === "log") return <div className="preview"><p><b>system.log</b></p><pre>[??:14] login: unknown_17{`\n`}[??:17] delete: user_fragment.log</pre></div>;
  if (id === "deleted") return <div className="preview"><p><b>user_fragment.log</b> · восстановлен</p><pre>HOUR_FRAGMENT = 03{`\n`}KEY_FORMAT = HHMM</pre></div>;
  if (id === "archive") return <div className="preview"><p><b>НАСЛЕДСТВО.arc</b></p><p>Зашифрованный архив. Требуется четырёхзначный ключ.</p><button className="system-button" onClick={openArchive}>Открыть архив</button></div>;
  return <div className="preview"><p>{restored ? "Фрагмент восстановлен." : "Файл недоступен."}</p></div>;
}

function Archive({ restored, code, setCode, unlock, done }: { restored: boolean; code: string; setCode: (v: string) => void; unlock: () => void; done: boolean }) {
  if (done) return <div className="archive done"><div className="seal">I</div><p className="eyebrow">ГЛАВА 1 ЗАВЕРШЕНА</p><h2>АРХИВ ВОССТАНОВЛЕН</h2><p>Внутри нет документов о деньгах. Только список из семи имён — и одно из них зачёркнуто твоей рукой.</p><div className="red-message">СЛЕДУЮЩИЙ СЕКТОР ЗАБЛОКИРОВАН<br/><small>Причина: активна другая сессия</small></div><p className="observer">unknown_17: «Теперь я знаю, что ты здесь»</p></div>;
  return <div className="archive"><div className="lock">▣</div><p className="eyebrow">AES LEGACY CONTAINER</p><h2>НАСЛЕДСТВО.arc</h2><p>Архив повреждён, но заголовок читается. Введите четырёхзначный ключ.</p><label>КЛЮЧ ДОСТУПА<input maxLength={5} value={code} onChange={(e) => setCode(e.target.value)} placeholder="_ _ _ _" /></label><button className="system-button danger" onClick={unlock}>РАСШИФРОВАТЬ</button><small>{restored ? "Удалённый фрагмент восстановлен: часы = 03, формат = HHMM. Минуты ищите на первой фотографии." : "В корзине обнаружен удалённый фрагмент. Его можно восстановить через терминал."}</small></div>;
}
