"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AppId = "readme" | "files" | "terminal" | "archive" | "log" | "help" | "browser";
type FileId = "readme" | "photo" | "note" | "deleted" | "archive" | "log" | "epstein";
type WindowMode = "open" | "minimized";

const files: Record<FileId, { name: string; icon: string; app: AppId }> = {
  readme: { name: "ПРОЧТИ_МЕНЯ.txt", icon: "▤", app: "readme" },
  photo: { name: "IMG_A7.corrupt", icon: "▧", app: "files" },
  note: { name: "заметка_без_даты.txt", icon: "▤", app: "files" },
  deleted: { name: "user_fragment.log", icon: "⌫", app: "files" },
  archive: { name: "НАСЛЕДСТВО.arc", icon: "▣", app: "archive" },
  log: { name: "system.log", icon: "≡", app: "log" },
  epstein: { name: ".Jeffrey_Epstein_year", icon: "⊘", app: "files" },
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
  const [browserInstalled, setBrowserInstalled] = useState(false);
  const [installState, setInstallState] = useState<"idle" | "awaiting" | "installing" | "done">("idle");
  const [protocolError, setProtocolError] = useState(false);
  const [linkWarning, setLinkWarning] = useState<string | null>(null);
  const [browserPage, setBrowserPage] = useState<"home" | "cloud" | "crypto">("home");
  const [browserNavKey, setBrowserNavKey] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("Канал нестабилен");

  useEffect(() => {
    const saved = localStorage.getItem("memoria-progress");
    if (saved === "chapter1") {
      setBooted(true); setRestored(true); setChapterDone(true);
    }
    if (localStorage.getItem("memoria-pikanichok") === "installed") {
      setBrowserInstalled(true); setInstallState("done");
    }
  }, []);

  useEffect(() => {
    if (booted || bootStep >= bootLines.length) return;
    const timer = setTimeout(() => setBootStep((v) => v + 1), 650);
    return () => clearTimeout(timer);
  }, [bootStep, booted]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [terminal]);

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
    if (cmd === "pkg search protocol:pika" || cmd === "pkg search pika") response = "Подключение к legacy.memoria... OK\nСинхронизация индекса пакетов... OK\n\nНайдено: 2\npikanichok-browser  0.8.14  legacy  [PIKA, HTTP]\npikaview-lite       0.3.1   unsupported";
    if (cmd === "pkg info pikanichok-browser") response = "Пакет: pikanichok-browser\nНазвание: Pikanichok Navigator\nВерсия: 0.8.14\nРазмер загрузки: 14.8 MB\nИздатель: PIKA Systems\nПодпись: ПРОСРОЧЕНА\nПротоколы: HTTP, PIKA, MEM, SIXSEVEN";
    if (cmd === "pikanichok") {
      if (browserInstalled) { response = "Запуск Pikanichok Navigator 0.8.14..."; setBrowserPage("home"); setTimeout(() => openWindow("browser"), 350); }
      else response = "'pikanichok' не является установленной программой.\nПодсказка: pkg search protocol:pika";
    }
    if (cmd === "pkg install pikanichok-browser") {
      if (browserInstalled) response = "pikanichok-browser 0.8.14 уже установлен.";
      else {
        response = "Чтение списков пакетов... готово\nПроверка зависимостей... готово\n\nБудут установлены:\n  legacy-certificates\n  pika-network-driver\n  pikanichok-browser\n\nНеобходимо загрузить: 14.8 MB\nПосле установки занято: 31.2 MB\nПодпись пакета просрочена. Продолжить? [Y/n]";
        setInstallState("awaiting");
      }
    }
    if ((cmd === "y" || cmd === "yes") && installState === "awaiting") {
      response = "Подтверждение получено. Начинаю загрузку...";
      setInstallState("installing");
      const steps = [
        [1000, "Получение legacy-certificates [###.................] 16%   420 KB/s"],
        [4000, "Получение pika-network-driver [########............] 41%   503 KB/s"],
        [8000, "Получение pikanichok-browser [##############......] 73%   0 KB/s"],
        [12000, "archive-01: ошибка контрольной суммы (SHA1 mismatch)"],
        [15000, "Переключение на зеркало archive-02... OK (ping 284 ms)"],
        [19000, "Получение pikanichok-browser [####################] 100%   14.8 MB"],
        [22000, "Распаковка и настройка pika-network-driver... готово"],
        [24500, "Регистрация протокола pika://... готово"],
        [27000, "Создание ярлыка... готово\n\nPikanichok Navigator 0.8.14 установлен.\nКоманда запуска: pikanichok"],
      ] as const;
      steps.forEach(([delay, line], index) => setTimeout(() => {
        setTerminal((value) => [...value, line]);
        if (index === steps.length - 1) {
          setBrowserInstalled(true); setInstallState("done");
          localStorage.setItem("memoria-pikanichok", "installed");
          setNotice("Установлен Pikanichok Navigator");
        }
      }, delay));
    }
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
        {browserInstalled && <DesktopIcon icon="◎" label="Pikanichok" onClick={() => { setBrowserPage("home"); openWindow("browser"); }} />}
      </section>

      {zOrder.map((app, index) => windows[app] === "open" && <Window key={app} title={windowTitle(app)} active={zOrder[zOrder.length - 1] === app} layer={index} app={app} onFocus={() => focusWindow(app)} onClose={() => closeWindow(app)} onMinimize={() => minimizeWindow(app)}>
        {app === "readme" && <Readme onContinue={() => openWindow("files")} />}
        {app === "files" && <FileExplorer selected={selectedFile} setSelected={setSelectedFile} restored={restored} openArchive={() => openWindow("archive")} />}
        {app === "terminal" && <div className="terminal"><div className="terminal-output">{terminal.map((line, i) => <TerminalLine key={i} line={line} />)}<div ref={terminalEndRef} /></div><div className="terminal-input"><span>C:\RECOVERY&gt;</span><input value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCommand()} aria-label="Команда терминала" /></div></div>}
        {app === "archive" && <Archive restored={restored} code={archiveCode} setCode={setArchiveCode} unlock={unlockArchive} done={chapterDone} openLink={() => { if (browserInstalled) setLinkWarning("pika://oblako-foto/xxx-228-lox/"); else setProtocolError(true); }} openCryptoLink={() => { if (browserInstalled) setLinkWarning("pika://crypto-ne-naebalovo-100%/walet/526967148866"); else setProtocolError(true); }} />}
        {app === "log" && <pre className="text-file">[??:14:08] LOGIN unknown_17\n[??:17:42] DELETE user_fragment.log\n[??:18:01] LOCK inheritance.arc\n[??:18:07] SESSION LOST</pre>}
        {app === "help" && <div className="document"><h2>Справка</h2><p>Исследуйте файлы двойным щелчком. Терминал понимает команды <code>help</code>, <code>ls</code>, <code>cat</code>, <code>status</code> и <code>recover</code>.</p></div>}
        {app === "browser" && <Pikanichok page={browserPage} navKey={browserNavKey} />}
      </Window>)}

      {protocolError && <div className="protocol-error" role="alertdialog" aria-label="Ошибка протокола"><header>MEMORIA NETWORK SERVICE <button onClick={() => setProtocolError(false)}>×</button></header><div className="error-body"><div className="error-icon">!</div><div><h3>Невозможно открыть этот адрес</h3><p>В системе отсутствует обработчик протокола <b>PIKA</b>.</p><pre>Адрес: pika://oblako-foto/xxx-228-lox/{`\n`}Код ошибки: NO_PROTOCOL_HANDLER</pre><p className="error-hint">Совместимое программное обеспечение может находиться в старых репозиториях.</p><code>pkg search protocol:pika</code></div></div><footer><button className="system-button" onClick={() => setProtocolError(false)}>Закрыть</button></footer></div>}
      {linkWarning && <div className="link-warning" role="alertdialog" aria-label="Подтверждение перехода"><header>ПРЕДУПРЕЖДЕНИЕ БЕЗОПАСНОСТИ</header><div className="link-warning-body"><div className="warning-icon">!</div><div><h3>Вы уверены, что хотите перейти на этот сайт?</h3><p>Адрес находится вне защищённой области MEMORIA:</p><code>{linkWarning}</code><small>Подлинность и безопасность узла не проверены.</small></div></div><footer><button className="system-button" onClick={() => setLinkWarning(null)}>Отмена</button><button className="system-button danger" onClick={() => { const target = linkWarning.includes("crypto-ne-naebalovo") ? "crypto" : "cloud"; setLinkWarning(null); setBrowserPage(target); setBrowserNavKey((value) => value + 1); openWindow("browser"); }}>Перейти</button></footer></div>}

      <div className="status-toast"><i className={chapterDone ? "ok" : ""} /> {notice}</div>
      <footer className="taskbar">
        <button className="start" onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }}><span>◆</span> ПУСК</button>
        {zOrder.map((app) => windows[app] && <button key={app} className={`task-button ${windows[app] === "minimized" ? "is-minimized" : zOrder[zOrder.length - 1] === app ? "is-active" : ""}`} onClick={() => toggleTaskWindow(app)}>{windowTitle(app)}</button>)}
        <div className="tray"><span>▥</span><span>{time}</span></div>
      </footer>
      {startOpen && <div className="start-menu" onClick={(e) => e.stopPropagation()}><div className="start-brand">MEMORIA <small>4.1</small></div><button onClick={() => { openWindow("files"); setStartOpen(false); }}>▧ Проводник</button><button onClick={() => { openWindow("terminal"); setStartOpen(false); }}>&gt;_ Терминал</button>{browserInstalled && <button onClick={() => { setBrowserPage("home"); openWindow("browser"); setStartOpen(false); }}>◎ Pikanichok Navigator</button>}<button onClick={() => { openWindow("help"); setStartOpen(false); }}>? Справка</button><div className="start-divider" /><button onClick={() => { localStorage.removeItem("memoria-progress"); localStorage.removeItem("memoria-pikanichok"); location.reload(); }}>↻ Сбросить сеанс</button></div>}
      <div className="scanlines" />
    </main>
  );
}

function DesktopIcon({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) { return <button className="desktop-icon" onDoubleClick={onClick} onClick={onClick}><span>{icon}</span><em>{label}</em></button>; }
function TerminalLine({ line }: { line: string }) {
  const parts = line.split("SIXSEVEN");
  return <div>{parts.map((part, index) => <span key={index}>{part}{index < parts.length - 1 && <b className="clue-red">SIXSEVEN</b>}</span>)}</div>;
}
function Window({ title, active, layer, app, onClose, onMinimize, onFocus, children }: { title: string; active: boolean; layer: number; app: AppId; onClose: () => void; onMinimize: () => void; onFocus: () => void; children: React.ReactNode }) {
  const positions: Record<AppId, { left: string; top: string }> = { readme: { left: "48%", top: "47%" }, files: { left: "52%", top: "50%" }, terminal: { left: "55%", top: "54%" }, archive: { left: "50%", top: "49%" }, log: { left: "54%", top: "46%" }, help: { left: "46%", top: "52%" }, browser: { left: "51%", top: "48%" } };
  return <section className={`window ${active ? "window-active" : "window-inactive"}`} style={{ zIndex: 10 + layer, left: positions[app].left, top: positions[app].top }} onMouseDown={onFocus}><header className="titlebar"><span>▥ {title}</span><div><button aria-label={`Свернуть ${title}`} onClick={(e) => { e.stopPropagation(); onMinimize(); }}>_</button><button aria-label={`Закрыть ${title}`} onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button></div></header><nav className="menubar">Файл　 Правка　 Вид　 Справка</nav><div className="window-content">{children}</div><div className="window-status">MEMORIA REMOTE VOLUME · READ ONLY</div></section>;
}
function windowTitle(app: AppId) { return ({ readme: "ПРОЧТИ_МЕНЯ — Блокнот", files: "Проводник — RECOVERY", terminal: "Командная строка", archive: "Архиватор", log: "system.log", help: "Справка MEMORIA", browser: "Pikanichok Navigator 0.8.14" })[app]; }

function Readme({ onContinue }: { onContinue: () => void }) { return <article className="document letter"><div className="stamp">URGENT<br/><b>14 MAR</b></div><p className="mono-meta">RECOVERY NOTE / НЕ ОТПРАВЛЯТЬ ПО ПОЧТЕ</p><h1>Если ты это читаешь — резервный канал сработал.</h1><p>Кто-то получил доступ к моему компьютеру. Я успел перенести сюда несколько файлов, связанных с наследством, но часть данных удалена.</p><p>Начни с первой фотографии. Система сохранила только правую половину времени, а левую кто-то удалил вместе с журналом пользователя.</p><p>Чтобы открыть архив, придётся восстановить недостающий фрагмент и соединить обе половины.</p><p className="signature">— твой брат<br/><small>P.S. Если увидишь пользователя <b>unknown_17</b>, отключись.</small></p><button className="system-button" onClick={onContinue}>Открыть файлы →</button></article>; }

function FileExplorer({ selected, setSelected, restored, openArchive }: { selected: FileId; setSelected: (id: FileId) => void; restored: boolean; openArchive: () => void }) {
  const list: FileId[] = ["photo", "note", "log", "epstein", "archive", ...(restored ? ["deleted" as FileId] : [])];
  return <div className="explorer"><aside><b>RECOVERY (C:)</b><span>└─ documents</span><span>└─ archive</span><span>└─ system</span><span className="muted">└─ .trash</span></aside><div className="file-area"><div className="file-grid">{list.map((id) => <button key={id} className={`${selected === id ? "selected" : ""} ${id === "epstein" ? "locked-clue" : ""}`} onClick={() => setSelected(id)} onDoubleClick={() => id === "archive" && openArchive()}><span>{files[id].icon}</span><em>{files[id].name}</em></button>)}</div><FilePreview id={selected} restored={restored} openArchive={openArchive} /></div></div>;
}

function FilePreview({ id, restored, openArchive }: { id: FileId; restored: boolean; openArchive: () => void }) {
  if (id === "photo") return <div className="preview"><div className="corrupt-photo"><span><b>??</b>:14</span><i>LEFT SECTOR LOST</i></div><p><b>IMG_A7.corrupt</b></p><p>Левая часть отметки времени уничтожена. Уцелели только минуты: <b>14</b>.</p></div>;
  if (id === "note") return <div className="preview"><p><b>заметка_без_даты.txt</b></p><p>«Ключ — это полное время первой фотографии: часы, затем минуты. Часы остались в удалённом журнале».</p></div>;
  if (id === "log") return <div className="preview"><p><b>system.log</b></p><pre>[??:14] login: unknown_17{`\n`}[??:17] delete: user_fragment.log</pre></div>;
  if (id === "deleted") return <div className="preview"><p><b>user_fragment.log</b> · восстановлен</p><pre>HOUR_FRAGMENT = 03{`\n`}KEY_FORMAT = HHMM</pre></div>;
  if (id === "epstein") return <div className="preview locked-preview"><p><b className="clue-red">.Jeffrey_Epstein_year</b></p><p>Доступ запрещён системной политикой.</p><pre>PERMISSION: ROOT_ONLY{`\n`}CONTENT: [ENCRYPTED]</pre></div>;
  if (id === "archive") return <div className="preview"><p><b>НАСЛЕДСТВО.arc</b></p><p>Зашифрованный архив. Требуется четырёхзначный ключ.</p><button className="system-button" onClick={openArchive}>Открыть архив</button></div>;
  return <div className="preview"><p>{restored ? "Фрагмент восстановлен." : "Файл недоступен."}</p></div>;
}

function Archive({ restored, code, setCode, unlock, done, openLink, openCryptoLink }: { restored: boolean; code: string; setCode: (v: string) => void; unlock: () => void; done: boolean; openLink: () => void; openCryptoLink: () => void }) {
  if (done) return <div className="archive-unpacked"><div className="archive-header"><div className="seal">I</div><div><p className="eyebrow">КОНТЕЙНЕР РАСШИФРОВАН</p><h2>НАСЛЕДСТВО.arc</h2></div></div><p>В архиве обнаружено четыре объекта:</p><div className="archive-files"><button onDoubleClick={openLink} onClick={openLink}><span>◎</span><b>ENTRY_POINT.url</b><small>pika://oblako-foto/xxx-228-lox/</small></button><button onDoubleClick={openCryptoLink} onClick={openCryptoLink}><span>₿</span><b>WALLET_RECOVERY.url</b><small>pika://crypto-ne-naebalovo-100%/walet/526967148866</small></button><div><span>▤</span><b>browser_note.txt</b><small>«Обычные браузеры этого адреса не увидят»</small></div><div><span>◇</span><b>signature.key</b><small>PIKA LEGACY CERTIFICATE</small></div></div><div className="archive-tip">Откройте URL-файл, чтобы перейти на соответствующий PIKA-узел.</div></div>;
  return <div className="archive"><div className="lock">▣</div><p className="eyebrow">AES LEGACY CONTAINER</p><h2>НАСЛЕДСТВО.arc</h2><p>Архив повреждён, но заголовок читается. Введите четырёхзначный ключ.</p><label>КЛЮЧ ДОСТУПА<input maxLength={5} value={code} onChange={(e) => setCode(e.target.value)} placeholder="_ _ _ _" /></label><button className="system-button danger" onClick={unlock}>РАСШИФРОВАТЬ</button><small>{restored ? "Удалённый фрагмент восстановлен: часы = 03, формат = HHMM. Минуты ищите на первой фотографии." : "В корзине обнаружен удалённый фрагмент. Его можно восстановить через терминал."}</small></div>;
}

type BrowserView = "home" | "cloud" | "crypto" | "notfound";
type BrowserTab = { id: number; title: string; address: string; view: BrowserView };

function Pikanichok({ page, navKey }: { page: "home" | "cloud" | "crypto"; navKey: number }) {
  const [cloudPassword, setCloudPassword] = useState("");
  const [cloudOpen, setCloudOpen] = useState(false);
  const [cloudError, setCloudError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [seedError, setSeedError] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const cloudAddress = "pika://oblako-foto/xxx-228-lox/";
  const cryptoAddress = "pika://crypto-ne-naebalovo-100%/walet/526967148866";
  const requestedTab: BrowserTab = page === "crypto" ? { id: 2, title: "Crypto Wallet", address: cryptoAddress, view: "crypto" } : { id: 2, title: "ОблакоФото", address: cloudAddress, view: "cloud" };
  const initialTabs: BrowserTab[] = page === "home" ? [{ id: 1, title: "Pikanet", address: "pika://home", view: "home" }] : [{ id: 1, title: "Pikanet", address: "pika://home", view: "home" }, requestedTab];
  const [tabs, setTabs] = useState<BrowserTab[]>(initialTabs);
  const [activeId, setActiveId] = useState(page === "cloud" ? 2 : 1);
  const active = tabs.find((tab) => tab.id === activeId) || tabs[0];
  const [address, setAddress] = useState(active.address);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);

  useEffect(() => setAddress(active.address), [active.id, active.address]);
  useEffect(() => {
    if (page === "home" || navKey === 0) return;
    setTabs((current) => {
      const targetAddress = page === "crypto" ? cryptoAddress : cloudAddress;
      const existing = current.find((tab) => tab.view === page && tab.address.replace(/\/$/, "") === targetAddress.replace(/\/$/, ""));
      if (existing) {
        setActiveId(existing.id);
        return current;
      }
      const id = Math.max(...current.map((tab) => tab.id), 0) + 1;
      setActiveId(id);
      return [...current, { id, title: page === "crypto" ? "Crypto Wallet" : "ОблакоФото", address: targetAddress, view: page }];
    });
  }, [page, navKey]);

  function applyAddress(value: string) {
    const normalized = value.trim() || "pika://home";
    const view: BrowserView = normalized === "pika://home" ? "home" : normalized.replace(/\/$/, "") === cloudAddress.replace(/\/$/, "") ? "cloud" : normalized.replace(/\/$/, "") === cryptoAddress.replace(/\/$/, "") ? "crypto" : "notfound";
    const title = view === "home" ? "Pikanet" : view === "cloud" ? "ОблакоФото" : view === "crypto" ? "Crypto Wallet" : "Узел не найден";
    setTabs((current) => current.map((tab) => tab.id === activeId ? { ...tab, address: normalized, view, title } : tab));
    setAddress(normalized);
  }

  function requestNavigation() {
    const target = address.trim() || "pika://home";
    if (target === active.address) return;
    if (target === "pika://home") applyAddress(target); else setPendingAddress(target);
  }

  function newTab() {
    const id = Math.max(...tabs.map((tab) => tab.id), 0) + 1;
    setTabs((current) => [...current, { id, title: "Новая вкладка", address: "pika://home", view: "home" }]);
    setActiveId(id);
  }

  const cloudPhotos = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.png", "10.jpg", "11.png", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg"];

  function verifySeed() {
    const normalized = seedPhrase.toLowerCase().replace(/ё/g, "е").replace(/[^а-яa-z\s]/g, " ").replace(/\s+/g, " ").trim();
    const correct = "слово не воробей вообще ничто не воробей кроме самого воробья";
    if (normalized === correct) { setWalletOpen(true); setSeedError(false); }
    else setSeedError(true);
  }

  return <div className="pika-browser"><div className="pika-tabs">{tabs.map((tab) => <button key={tab.id} className={tab.id === activeId ? "active" : ""} onClick={() => setActiveId(tab.id)}><span>{tab.view === "cloud" ? "▧" : "◎"}</span>{tab.title}<i onClick={(e) => { e.stopPropagation(); if (tabs.length === 1) return; const remaining = tabs.filter((item) => item.id !== tab.id); setTabs(remaining); if (tab.id === activeId) setActiveId(remaining[remaining.length - 1].id); }}>×</i></button>)}<button className="new-tab" onClick={newTab}>+</button></div><div className="pika-toolbar"><button>←</button><button>→</button><button onClick={() => applyAddress(active.address)}>↻</button><input className="pika-address" value={address} onChange={(e) => setAddress(e.target.value)} onFocus={(e) => e.currentTarget.select()} onKeyDown={(e) => e.key === "Enter" && requestNavigation()} aria-label="Адрес PIKA"/><button onClick={requestNavigation}>ПЕРЕЙТИ</button></div>{active.view === "home" && <div className="pika-page pika-home"><div className="pika-logo">PIKANICHOK <small>NAVIGATOR 0.8.14</small></div><div className="home-orbit">◎</div><h1>Добро пожаловать в Pikanet</h1><p>Устаревшая распределённая сеть. Для перехода введите адрес PIKA или откройте совместимую ссылку.</p><div className="home-links"><span>КАТАЛОГ УЗЛОВ — недоступен</span><span>ПОЧТА — соединение отсутствует</span><span>АРХИВ СЕТИ — требуется адрес</span></div></div>}{active.view === "cloud" && <div className="pika-page cloud-page"><div className="cloud-brand">ОБЛАКО<span>ФОТО</span> <small>PIKA STORAGE SERVICE</small></div>{cloudOpen ? <div className="cloud-vault"><div className="cloud-photos">{cloudPhotos.map((photo, index) => <button key={photo} className={`photo-card distortion-${index % 6}`} onClick={() => setSelectedPhoto(photo)} aria-label={`Открыть фотографию ${photo}`}><img src={`/cloud-photos/${photo}`} alt=""/><span>IMG_{String(index + 1).padStart(4, "0")}.{photo.split(".").pop()}</span></button>)}</div>{selectedPhoto && <div className="photo-viewer" onClick={() => setSelectedPhoto(null)}><button aria-label="Закрыть">×</button><img src={`/cloud-photos/${selectedPhoto}`} alt={`Фотография ${selectedPhoto}`}/><small>{selectedPhoto} · щёлкните, чтобы закрыть</small></div>}</div> : <div className="cloud-login"><div className="cloud-lock">▣</div><p className="eyebrow">ЗАЩИЩЁННОЕ ОБЛАЧНОЕ ХРАНИЛИЩЕ</p><h1>Требуется пароль</h1><label>ПАРОЛЬ<input autoFocus inputMode="numeric" maxLength={4} value={cloudPassword} onChange={(e) => { setCloudPassword(e.target.value.replace(/\D/g, "")); setCloudError(false); }} onKeyDown={(e) => { if (e.key === "Enter") { if (cloudPassword === "6766") setCloudOpen(true); else setCloudError(true); } }} placeholder="••••" /></label><button className="system-button" onClick={() => { if (cloudPassword === "6766") setCloudOpen(true); else setCloudError(true); }}>ОТКРЫТЬ ХРАНИЛИЩЕ</button>{cloudError && <p className="cloud-error">Неверный пароль. Доступ записан в журнал.</p>}<small>Подсказка владельца: «dva chisla, chetyre tsifry»</small></div>}</div>}{active.view === "crypto" && <div className="pika-page wallet-page"><div className="wallet-brand">₿ CRYPTO-NE-NAEBALOVO <small>LEGACY WALLET RECOVERY</small></div>{walletOpen ? <div className="wallet-panel wallet-success"><p className="eyebrow">WALLET 526967148866</p><div className="wallet-ok">✓</div><h1>Кошелёк восстановлен</h1><p>Seed-фраза подтверждена. Локальное хранилище ключей разблокировано.</p><div className="wallet-balance"><small>ДОСТУПНЫЙ БАЛАНС</small><b>0.0314 BTC</b><span>≈ [КУРС НЕДОСТУПЕН]</span></div></div> : <div className="wallet-panel"><p className="eyebrow">WALLET 526967148866</p><h1>Восстановление кошелька</h1><p>Введите seed-фразу, спрятанную в фотографиях облачного хранилища.</p><textarea value={seedPhrase} onChange={(e) => { setSeedPhrase(e.target.value); setSeedError(false); }} placeholder="слова через пробел" rows={4}/><div className="seed-count">Слов обнаружено: {seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0}</div><button className="system-button danger" onClick={verifySeed}>ВОССТАНОВИТЬ ДОСТУП</button>{seedError && <p className="wallet-error">SEED CHECKSUM INVALID · проверьте слова и их порядок</p>}</div>}</div>}{active.view === "notfound" && <div className="pika-page pika-notfound"><div className="pika-logo">PIKANICHOK <small>NETWORK ERROR</small></div><div className="notfound-code">404</div><h1>Узел не найден</h1><p>Адрес <code>{active.address}</code> не отвечает или никогда не существовал.</p><pre>PIKA_DNS: NO_ROUTE{`\n`}ATTEMPTS: 3{`\n`}CACHE: EMPTY</pre></div>}<div className="pika-status">{active.address} · PIKA driver active</div>{pendingAddress && <div className="browser-confirm"><div><h3>Вы уверены, что хотите перейти на этот сайт?</h3><code>{pendingAddress}</code><p>Безопасность этого PIKA-узла не проверена.</p><footer><button onClick={() => setPendingAddress(null)}>Отмена</button><button className="danger" onClick={() => { applyAddress(pendingAddress); setPendingAddress(null); }}>Перейти</button></footer></div></div>}</div>;
}
