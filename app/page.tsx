"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AppId = "readme" | "files" | "terminal" | "archive" | "log" | "help" | "browser" | "mail";
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
  const [hackInProgress, setHackInProgress] = useState(false);
  const [protocolError, setProtocolError] = useState(false);
  const [malware, setMalware] = useState(false);
  const [linkWarning, setLinkWarning] = useState<string | null>(null);
  const [browserPage, setBrowserPage] = useState<"home" | "cloud" | "crypto" | "hackshop">("home");
  const [browserNavKey, setBrowserNavKey] = useState(0);
  const [mailArrived, setMailArrived] = useState(false);
  const [mailUnread, setMailUnread] = useState(false);
  const [mailToast, setMailToast] = useState(false);
  const [shellExtended, setShellExtended] = useState(false);
  const [shellRestoring, setShellRestoring] = useState(false);
  const [shellProgress, setShellProgress] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("Канал нестабилен");

  useEffect(() => {
    const saved = localStorage.getItem("memoria-progress");
    if (saved === "chapter1") {
      setBooted(true); setChapterDone(true);
    }
    if (localStorage.getItem("memoria-fragment-restored") === "true") setRestored(true);
    if (localStorage.getItem("memoria-pikanichok") === "installed") {
      setBrowserInstalled(true); setInstallState("done");
    }
    if (localStorage.getItem("memoria-mail-arrived") === "true") setMailArrived(true);
    if (localStorage.getItem("memoria-mail-unread") === "true") setMailUnread(true);
    if (localStorage.getItem("memoria-shell-extended") === "true") {
      setShellExtended(true);
      setTerminal(["MEMORIA shell v2.0 · EXTENDED MODE", "Введите help для списка команд."]);
    }
    const receiveMail = () => { setMailArrived(true); setMailUnread(true); setMailToast(true); setTimeout(() => setMailToast(false), 12000); };
    window.addEventListener("memoria-mail-arrived", receiveMail);
    return () => window.removeEventListener("memoria-mail-arrived", receiveMail);
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
    if (app === "terminal" && shellRestoring && !window.confirm("Восстановление ещё выполняется. Закрытие терминала может повредить модуль. Всё равно закрыть окно?")) return;
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

  function startHack(target: "archive" | "cloud" | "wallet", duration: number) {
    setHackInProgress(true);
    const labels = { archive: "inheritance.arc", cloud: "PIKA CLOUD AUTH", wallet: "WALLET 526967148866" };
    const redLogs: Record<number, string> = {
      4: "[RED]FIREWALL: активная контрмера обнаружена",
      8: "[RED]ACCESS DENIED · ключевой слот заблокирован",
      12: "[RED]CONNECTION LOST · повторное подключение через relay-17",
      16: "[RED]TRACE WARNING: источник сканирования раскрыт",
      19: "[RED]КРИТИЧЕСКАЯ ОШИБКА: перебор мог завершиться неудачей",
    };
    for (let step = 1; step <= 20; step++) {
      setTimeout(() => {
        const percent = step * 5;
        const bar = "#".repeat(step) + ".".repeat(20 - step);
        const lines = [`HACK ${labels[target]} [${bar}] ${percent}%`, redLogs[step] || `worker-${String((step % 6) + 1).padStart(2, "0")}: перебор блока ${step * 4096}...`];
        if (step === 20) {
          if (target === "archive") {
            lines.push("Взлом завершён. Заголовок архива расшифрован.", "Ключ доступа внедрён: inheritance.arc открыт.");
            setChapterDone(true); localStorage.setItem("memoria-progress", "chapter1");
          }
          if (target === "cloud") lines.push("Взлом завершён. Извлечён пароль: 6766");
          if (target === "wallet") {
            lines.push("Аппаратный ключ эмулирован. Кошелёк разблокирован.");
            localStorage.setItem("memoria-wallet-hacked", "true");
            window.dispatchEvent(new Event("memoria-wallet-hacked"));
          }
          setHackInProgress(false);
        }
        setTerminal((value) => [...value, ...lines]);
      }, Math.round((duration / 20) * step));
    }
  }

  function runCommand() {
    const raw = command.trim();
    const cmd = raw.toLowerCase();
    let response = `Команда не найдена: ${raw}`;
    if (!raw || shellRestoring) return;
    setCommandHistory((items) => [...items, raw]);
    if (cmd === "help") response = shellExtended ? "Базовые: help, clear, dir, ls, open <файл>, cat <файл>, status, whoami, history, recover <файл>, pkg <действие>, pikanichok, hack <url>\n\nУстановка Pikanichok:\npkg info pikanichok-browser\n→ pkg install pikanichok-browser\n\nРасширенные: lookup <объект>, trace <адрес>, inspect <объект>, decrypt-log <файл>, system-map, mail-header, wallet-info" : "Команды: help, clear, dir, ls, open <файл>, cat <файл>, status, whoami, history, recover <файл>, pkg <действие>, pikanichok, hack <url>\n\nУстановка Pikanichok:\npkg info pikanichok-browser\n→ pkg install pikanichok-browser";
    if (cmd === "dir") response = "README.txt  system.log  .trash  inheritance.arc  terminal_notes";
    if (cmd === "whoami") response = "recovery_guest [read-only] · session MEM-0314";
    if (cmd === "history") response = commandHistory.length ? commandHistory.map((item, index) => `${index + 1}  ${item}`).join("\n") : "История команд пуста.";
    if (cmd.startsWith("open ")) response = `Запрос на открытие: ${raw.slice(5)}\nИспользуйте проводник для просмотра объекта.`;
    if (cmd === "ls") response = "README.txt  system.log  .trash/user_fragment.log  inheritance.arc";
    if (cmd === "status") response = "Том RECOVERY: 63%  |  Последний вход: unknown_17  |  отметка времени повреждена";
    if (cmd === "cat system.log") response = "[??:14] login: unknown_17\n[??:17] deleted: user_fragment.log\n[??:18] archive locked";
    if (cmd === "cat user_fragment.log" || cmd === "cat .trash/user_fragment.log") response = restored ? "HOUR_FRAGMENT = 03\nKEY_FORMAT = HHMM" : "Ошибка: файл помечен как удалённый. Используйте recover.";
    const restoreCommand = /^restore-shell\s+(?:--module\s+(?:extended|ext)\s+--source\s+recovery_04|extended\s+recovery_04)$/i.test(raw.replace(/\s+/g, " "));
    if (restoreCommand) {
      if (shellExtended) response = "Extended shell уже установлен. Повторное восстановление не требуется.";
      else {
        response = "[00:00] Checking recovery source...";
        setShellRestoring(true); setShellProgress(2);
        const recoveryLogs = [
          [1800, 9, "[00:04] Source recovery_04 found."],
          [3900, 18, "[00:09] Verifying module signature..."],
          [7100, 27, "[00:15] Warning: system files incomplete."],
          [9700, 41, "[00:22] Recovering analysis libraries..."],
          [13300, 54, "[00:31] Restoring network index..."],
          [16400, 66, "[00:39] Loading identity correlation module..."],
          [19700, 79, "[00:47] Registering LOOKUP command..."],
          [22100, 90, "[00:54] Extended shell installed."],
          [24400, 97, "[00:58] Restarting terminal service..."],
          [26000, 100, "[01:00] COMPLETE."],
        ] as const;
        recoveryLogs.forEach(([delay, progress, line], index) => setTimeout(() => {
          setShellProgress(progress); setTerminal((lines) => [...lines, line]);
          if (index === recoveryLogs.length - 1) {
            localStorage.setItem("memoria-shell-extended", "true");
            setTimeout(() => { setShellExtended(true); setShellRestoring(false); setTerminal(["MEMORIA shell v2.0 · EXTENDED MODE", "Analysis module LOOKUP registered.", "Введите help для списка команд."]); setNotice("Terminal — Extended Mode"); }, 1100);
          }
        }, delay));
      }
    }
    if (shellExtended && cmd.startsWith("lookup")) response = cmd === "lookup" ? "LOOKUP: требуется идентификатор объекта." : `LOOKUP ${raw.slice(7).trim()}: объект принят модулем анализа. Данные появятся в следующей главе.`;
    if (shellExtended && ["trace","inspect","decrypt-log","system-map","mail-header","wallet-info"].some((name) => cmd === name || cmd.startsWith(name + " "))) response = `${cmd.split(" ")[0].toUpperCase()}: модуль установлен, источник данных пока недоступен.`;
    if (cmd === "pkg search protocol:pika" || cmd === "pkg search pika") response = "Подключение к legacy.memoria... OK\nСинхронизация индекса пакетов... OK\n\nНайдено: 2\npikanichok-browser  0.8.14  legacy  [PIKA, HTTP]\npikaview-lite       0.3.1   unsupported";
    if (cmd === "pkg info pikanichok-browser") response = "Пакет: pikanichok-browser\nНазвание: Pikanichok Navigator\nВерсия: 0.8.14\nРазмер загрузки: 14.8 MB\nИздатель: PIKA Systems\nПодпись: ПРОСРОЧЕНА\nПротоколы: HTTP, PIKA, MEM, SIXSEVEN\n\nДля установки выполните:\n→ pkg install pikanichok-browser";
    if (cmd.startsWith("hack ")) {
      const target = raw.slice(5).trim().toLowerCase().replace(/\/$/, "");
      if (hackInProgress) response = "HACK BUSY: другой процесс взлома уже выполняется.";
      else if (["inheritance.arc", "наследство.arc"].includes(target)) { response = "Эксплойт ARCHIVE-LEGACY найден. Начинаю атаку (примерно 2 минуты)..."; startHack("archive", 120000); }
      else if (target === "pika://oblako-foto/xxx-228-lox") { response = "Уязвимость PIKA-AUTH-08 найдена. Начинаю перебор (примерно 3 минуты)..."; startHack("cloud", 180000); }
      else if (target === "pika://crypto-ne-naebalovo-100%/walet/526967148866") { response = "Аппаратное шифрование обнаружено. Запускаю эмуляцию ключа (примерно 5 минут)..."; startHack("wallet", 300000); }
      else response = `Сканирование ${raw.slice(5).trim()}...\nУязвимости не обнаружены.`;
    }
    if (cmd === "pkg install universal-hack-device") {
      response = "Получение universal-hack-device... 100%\nПроверка подписи... ПРОПУЩЕНА\nУстановка kernel-access-module...\nЗапуск устройства...";
      setTimeout(() => setMalware(true), 2200);
    }
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
      localStorage.setItem("memoria-fragment-restored", "true");
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
        <DesktopIcon icon="✉" label="Почта" badge={mailUnread} onClick={() => { setMailUnread(false); localStorage.setItem("memoria-mail-unread", "false"); openWindow("mail"); }} />
        {browserInstalled && <DesktopIcon icon="◎" label="Pikanichok" onClick={() => { setBrowserPage("home"); openWindow("browser"); }} />}
      </section>

      {zOrder.map((app, index) => windows[app] === "open" && <Window key={app} title={app === "terminal" && shellExtended ? "Terminal — Extended Mode" : windowTitle(app)} active={zOrder[zOrder.length - 1] === app} layer={index} app={app} onFocus={() => focusWindow(app)} onClose={() => closeWindow(app)} onMinimize={() => minimizeWindow(app)}>
        {app === "readme" && <Readme onContinue={() => openWindow("files")} />}
        {app === "files" && <FileExplorer selected={selectedFile} setSelected={setSelectedFile} restored={restored} openArchive={() => openWindow("archive")} />}
        {app === "terminal" && <div className={`terminal ${shellExtended ? "terminal-extended" : ""}`}><div className="terminal-output">{terminal.map((line, i) => <TerminalLine key={i} line={line} />)}<div ref={terminalEndRef} /></div>{shellRestoring && <div className="shell-progress"><div><i style={{ width: `${shellProgress}%` }} /></div><span>RESTORE EXTENDED SHELL · {shellProgress}%</span></div>}<div className="terminal-input"><span>{shellExtended ? "C:\\EXTENDED>" : "C:\\RECOVERY>"}</span><input disabled={shellRestoring} value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCommand()} placeholder={shellRestoring ? "terminal service busy..." : ""} aria-label="Команда терминала" /></div></div>}
        {app === "archive" && <Archive restored={restored} code={archiveCode} setCode={setArchiveCode} unlock={unlockArchive} done={chapterDone} openLink={() => { if (browserInstalled) setLinkWarning("pika://oblako-foto/xxx-228-lox/"); else setProtocolError(true); }} openCryptoLink={() => { if (browserInstalled) setLinkWarning("pika://crypto-ne-naebalovo-100%/walet/526967148866"); else setProtocolError(true); }} />}
        {app === "log" && <pre className="text-file">[??:14:08] LOGIN unknown_17\n[??:17:42] DELETE user_fragment.log\n[??:18:01] LOCK inheritance.arc\n[??:18:07] SESSION LOST</pre>}
        {app === "help" && <HelpDocument />}
        {app === "mail" && <MailClient hasMail={mailArrived} />}
        {app === "browser" && <Pikanichok page={browserPage} navKey={browserNavKey} />}
      </Window>)}

      {protocolError && <div className="protocol-error" role="alertdialog" aria-label="Ошибка протокола"><header>MEMORIA NETWORK SERVICE <button onClick={() => setProtocolError(false)}>×</button></header><div className="error-body"><div className="error-icon">!</div><div><h3>Невозможно открыть этот адрес</h3><p>В системе отсутствует обработчик протокола <b>PIKA</b>.</p><pre>Адрес: pika://oblako-foto/xxx-228-lox/{`\n`}Код ошибки: NO_PROTOCOL_HANDLER</pre><p className="error-hint">Совместимое программное обеспечение может находиться в старых репозиториях.</p><code>pkg search protocol:pika</code></div></div><footer><button className="system-button" onClick={() => setProtocolError(false)}>Закрыть</button></footer></div>}
      {linkWarning && <div className="link-warning" role="alertdialog" aria-label="Подтверждение перехода"><header>ПРЕДУПРЕЖДЕНИЕ БЕЗОПАСНОСТИ</header><div className="link-warning-body"><div className="warning-icon">!</div><div><h3>Вы уверены, что хотите перейти на этот сайт?</h3><p>Адрес находится вне защищённой области MEMORIA:</p><code>{linkWarning}</code><small>Подлинность и безопасность узла не проверены.</small></div></div><footer><button className="system-button" onClick={() => setLinkWarning(null)}>Отмена</button><button className="system-button danger" onClick={() => { const target = linkWarning.includes("crypto-ne-naebalovo") ? "crypto" : linkWarning.includes("blackbox-market") ? "hackshop" : "cloud"; setLinkWarning(null); setBrowserPage(target); setBrowserNavKey((value) => value + 1); openWindow("browser"); }}>Перейти</button></footer></div>}
      {malware && <MalwareStorm onClose={() => { localStorage.removeItem("memoria-progress"); localStorage.removeItem("memoria-fragment-restored"); localStorage.removeItem("memoria-pikanichok"); localStorage.removeItem("memoria-wallet-hacked"); localStorage.removeItem("memoria-mail-arrived"); localStorage.removeItem("memoria-mail-unread"); location.reload(); }} />}

      <div className="status-toast"><i className={chapterDone ? "ok" : ""} /> {notice}</div>
      {mailToast && <button className="mail-toast" onClick={() => { setMailToast(false); setMailUnread(false); localStorage.setItem("memoria-mail-unread", "false"); openWindow("mail"); }}><span>✉</span><div><b>Новое сообщение</b><p>unknown17@onallmail.net</p><small>KEY ACCEPTED</small></div><i>×</i></button>}
      <footer className="taskbar">
        <button className="start" onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }}><span>◆</span> ПУСК</button>
        {zOrder.map((app) => windows[app] && <button key={app} className={`task-button ${windows[app] === "minimized" ? "is-minimized" : zOrder[zOrder.length - 1] === app ? "is-active" : ""}`} onClick={() => toggleTaskWindow(app)}>{windowTitle(app)}</button>)}
        <div className="tray"><span>▥</span><span>{time}</span></div>
      </footer>
      {startOpen && <div className="start-menu" onClick={(e) => e.stopPropagation()}><div className="start-brand">MEMORIA <small>4.1</small></div><button onClick={() => { openWindow("files"); setStartOpen(false); }}>▧ Проводник</button><button onClick={() => { openWindow("terminal"); setStartOpen(false); }}>&gt;_ Терминал</button><button onClick={() => { setMailUnread(false); localStorage.setItem("memoria-mail-unread", "false"); openWindow("mail"); setStartOpen(false); }}>✉ Почта</button>{browserInstalled && <button onClick={() => { setBrowserPage("home"); openWindow("browser"); setStartOpen(false); }}>◎ Pikanichok Navigator</button>}<button onClick={() => { openWindow("help"); setStartOpen(false); }}>? Справка</button><div className="start-divider" /><button onClick={() => { localStorage.removeItem("memoria-progress"); localStorage.removeItem("memoria-fragment-restored"); localStorage.removeItem("memoria-pikanichok"); localStorage.removeItem("memoria-wallet-hacked"); localStorage.removeItem("memoria-mail-arrived"); localStorage.removeItem("memoria-mail-unread"); location.reload(); }}>↻ Сбросить сеанс</button></div>}
      <div className="scanlines" />
    </main>
  );
}

const chainTransactions = [
  ["03:14:17","TX-41A7-17AF","OWNER","A1-8C17","67.660000","0.000314","block 031466"],
  ["03:14:29","TX-41B1-92D0","A1-8C17","B7-17AF","67.659686","0.000314","memo: relay"],
  ["03:14:42","TX-41C2-110A","B7-17AF","C2-0F17","25.000000","0.000157","fragment 1/3"],
  ["03:14:43","TX-41C8-17AF","B7-17AF","C8-761C","22.659372","0.000157","fragment 2/3"],
  ["03:14:44","TX-41C9-771B","B7-17AF","C9-44D2","20.000000","0.000157","fragment 3/3"],
  ["03:15:01","TX-41D2-C2AF","C2-0F17","D4-17AF","24.999843","0.000157","merge: 17AF"],
  ["03:15:02","TX-41D8-2CC1","C8-761C","D4-17AF","22.659215","0.000157","merge: 17AF"],
  ["03:15:17","TX-41U7-17AF","D4-17AF","U17-0NALL","47.658744","0.000314","route: 04 / U17"],
  ["02:52:04","TX-88A1-CC20","Q4-19AB","A1-8C17","0.150000","0.001200","refund"],
  ["03:01:11","TX-91F0-777A","M2-DEAD","B7-17AF","4.200000","0.003100","inactive input"],
  ["03:07:40","TX-0021-FA11","C2-0F17","X5-009A","0.010000","0.006800","probe"],
  ["03:08:16","TX-0022-FA12","X5-009A","C2-0F17","0.002000","0.005900","partial refund"],
  ["03:16:31","TX-77C8-A010","C8-761C","N8-4410","0.070000","0.004200","service fee"],
  ["03:18:55","TX-77C9-A011","C9-44D2","N9-4411","19.990000","0.009800","cold storage"],
  ["03:20:03","TX-341A-8F20","D4-17AF","K2-0007","0.004000","0.003700","dust"],
  ["03:25:48","TX-341B-8F21","K2-0007","D4-17AF","0.000100","0.003500","failed return"],
  ["01:11:09","TX-AB10-0011","V8-1313","W2-2020","12.600000","0.012000","batch payroll"],
  ["01:15:44","TX-AB11-0012","W2-2020","Z9-9090","6.300000","0.011000","split"],
  ["02:02:17","TX-0C17-AD00","R4-1717","S6-1818","47.000000","0.070000","legacy bridge"],
  ["02:12:32","TX-0C18-AD01","S6-1818","R4-1717","46.100000","0.800000","return"],
  ["03:11:06","TX-3100-0A1A","T1-4040","C9-44D2","1.000000","0.100000","unrelated deposit"],
  ["03:17:17","TX-1717-BEEF","U7-FAKE","U17-DECOY","47.658000","0.000900","memo: 17A7"],
  ["04:04:04","TX-4040-0000","U17-DECOY","NULL","0.000000","0.000000","inactive address"],
  ["05:20:10","TX-5510-AAAA","P3-5500","L8-7712","3.141500","0.042000","exchange payout"],
] as const;

function BlockchainExplorer({ onBack, onSolved }: { onBack: () => void; onSolved: (address: string) => void }) {
  const [selected, setSelected] = useState<string>("TX-41A7-17AF");
  const [marked, setMarked] = useState<string[]>([]);
  const [candidate, setCandidate] = useState("");
  const [result, setResult] = useState<"idle" | "wrong" | "right">("idle");
  const tx = chainTransactions.find((row) => row[1] === selected) || chainTransactions[0];
  const addresses = Array.from(new Set(chainTransactions.flatMap((row) => [row[2], row[3]]))).filter((a) => !["OWNER","NULL"].includes(a));
  function toggleMark(address: string) { setMarked((items) => items.includes(address) ? items.filter((item) => item !== address) : [...items, address]); }
  function verify() { if (candidate === "U17-0NALL") { setResult("right"); localStorage.setItem("unknown17WalletAddress", candidate); onSolved(candidate); } else setResult("wrong"); }
  return <div className="chain-explorer"><header><button onClick={onBack}>← КОШЕЛЁК</button><div><b>MEMORIA BLOCK EXPLORER</b><small>Все записи принадлежат игровой сети</small></div><span><i /> NODE 04 ONLINE</span></header><section className="chain-summary"><div><small>ИСХОДНАЯ ТРАНЗАКЦИЯ</small><b>TX-41A7-17AF</b></div><div><small>ПОХИЩЕНО</small><b>67.660000 BTC</b></div><div><small>ОПЕРАЦИЙ В ВЫБОРКЕ</small><b>{chainTransactions.length}</b></div></section><div className="chain-workspace"><main><div className="chain-flow"><button onClick={() => setCandidate("A1-8C17")}>OWNER → A1</button><span>→</span><button onClick={() => setCandidate("B7-17AF")}>B7</button><span>→</span><div><button onClick={() => setCandidate("C2-0F17")}>C2</button><button onClick={() => setCandidate("C8-761C")}>C8</button><button onClick={() => setCandidate("C9-44D2")}>C9</button></div><span>→</span><button onClick={() => setCandidate("D4-17AF")}>D4</button><span>→</span><button className="chain-unknown" onClick={() => setCandidate("U17-0NALL")}>?</button></div><div className="chain-table-wrap"><table><thead><tr><th>Время</th><th>TXID</th><th>Откуда</th><th>Куда</th><th>Сумма</th><th>Комиссия</th></tr></thead><tbody>{chainTransactions.map((row) => <tr key={row[1]} className={selected === row[1] ? "selected" : ""} onClick={() => setSelected(row[1])}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td>{row[5]}</td></tr>)}</tbody></table></div></main><aside><h2>ДЕТАЛИ ОПЕРАЦИИ</h2><dl><dt>TXID</dt><dd>{tx[1]}</dd><dt>Время</dt><dd>{tx[0]}</dd><dt>Вход</dt><dd>{tx[2]}</dd><dt>Выход</dt><dd>{tx[3]}</dd><dt>Сумма</dt><dd>{tx[4]} BTC</dd><dt>Комиссия</dt><dd>{tx[5]} BTC</dd><dt>Технические данные</dt><dd>{tx[6]}</dd></dl><button onClick={() => toggleMark(tx[3])}>{marked.includes(tx[3]) ? "★ УБРАТЬ ОТМЕТКУ" : "☆ ОТМЕТИТЬ АДРЕС"}</button><h2>ПОДОЗРИТЕЛЬНЫЕ</h2><div className="chain-marks">{marked.length ? marked.map((item) => <button key={item} onClick={() => setCandidate(item)}>★ {item}</button>) : <p>Адреса ещё не отмечены.</p>}</div><label>КОНЕЧНЫЙ АДРЕС<select value={candidate} onChange={(e) => { setCandidate(e.target.value); setResult("idle"); }}><option value="">— выбрать —</option>{addresses.map((item) => <option key={item}>{item}</option>)}</select></label><button className="chain-check" onClick={verify} disabled={!candidate}>ПРОВЕРИТЬ АДРЕС</button>{result === "wrong" && <p className="chain-wrong">Цепочка обрывается или сумма не сходится. Проверьте время, комиссию и повторяющийся фрагмент.</p>}{result === "right" && <div className="chain-right"><b>АДРЕС UNKNOWN17 НАЙДЕН</b><code>{candidate}</code><button onClick={() => navigator.clipboard?.writeText(candidate)}>КОПИРОВАТЬ АДРЕС</button><small>Сохранено как unknown17WalletAddress</small></div>}</aside></div></div>;
}

function WalletInterface({ stage, setStage, auditRow, setAuditRow, auditDifference, setAuditDifference, auditError, setAuditError, openFoundWallet, onUnknownAddress }: { stage: WalletStage; setStage: React.Dispatch<React.SetStateAction<WalletStage>>; auditRow: string; setAuditRow: (value: string) => void; auditDifference: string; setAuditDifference: (value: string) => void; auditError: boolean; setAuditError: (value: boolean) => void; openFoundWallet: () => void; onUnknownAddress?: (address: string) => void }) {
  const [displayBalance, setDisplayBalance] = useState(67.660314);
  const [refreshed, setRefreshed] = useState(0);
  useEffect(() => {
    if (stage !== "balance") { setDisplayBalance(0.000314); return; }
    setDisplayBalance(67.660314);
    let interval: ReturnType<typeof setInterval> | undefined;
    const startDrain = setTimeout(() => { interval = setInterval(() => setDisplayBalance((value) => Math.max(0.000314, value * 0.68 - 0.00001)), 170); }, 1800);
    return () => { clearTimeout(startDrain); if (interval) clearInterval(interval); };
  }, [stage]);
  if (stage === "trace") return <BlockchainExplorer onBack={() => setStage("drained")} onSolved={(address) => onUnknownAddress?.(address)} />;
  if (stage === "audit") return <div className="legacy-wallet"><div className="legacy-wallet-title"><b>MEMORIA COIN CLIENT</b><span>ПРОВЕРКА ЖУРНАЛА</span></div><div className="audit-view legacy-audit"><button className="system-button" onClick={() => setStage("drained")}>← Вернуться</button><h1>Журнал операций</h1><p>В одной проводке дебет не равен кредиту. Найдите строку и рассчитайте расхождение.</p><table><thead><tr><th></th><th>№</th><th>Дебет</th><th>Кредит</th></tr></thead><tbody>{[["401","21.400000","21.400000"],["405","18.120000","18.120000"],["409","12.083614","12.083614"],["417","8.038100","8.006700"],["421","5.050000","5.050000"],["433","3.000000","3.000000"]].map((row) => <tr key={row[0]} className={auditRow === row[0] ? "selected-audit" : ""} onClick={() => { setAuditRow(row[0]); setAuditError(false); }}><td>◉</td><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table><label>РАСХОЖДЕНИЕ, BTC<input value={auditDifference} onChange={(e) => { setAuditDifference(e.target.value); setAuditError(false); }} placeholder="0.000000"/></label><button className="system-button" onClick={() => { const value = Number(auditDifference.replace(",", ".")); if (auditRow === "417" && Math.abs(value - 0.0314) < 0.0000001) setStage("solved"); else setAuditError(true); }}>ЗАКРЫТЬ АУДИТ</button>{auditError && <p className="wallet-error">Баланс не сходится. Проверьте выбранную проводку и расчёт.</p>}</div></div>;
  if (stage === "solved") return <div className="legacy-wallet"><div className="legacy-wallet-title"><b>MEMORIA COIN CLIENT</b><span>ПРОВЕРКА ЗАВЕРШЕНА</span></div><div className="audit-solved legacy-solved"><div className="wallet-ok">✓</div><h1>Расхождение найдено</h1><p>Номер проводки + сумма расхождения + подтверждения сети:</p><code>417 + 0314 + 6</code><small>ОБНАРУЖЕН НОВЫЙ СЧЁТ</small><button onClick={openFoundWallet}>pika://crypto-ne-naebalovo-100%/walet/41703146</button></div></div>;
  const drained = stage === "drained";
  return <div className={`legacy-wallet ${stage === "balance" ? "is-syncing" : ""}`}><div className="legacy-wallet-title"><b>MEMORIA COIN CLIENT 2.4</b><span>WALLET: RECOVERY_MAIN</span></div><div className="legacy-wallet-toolbar"><button onClick={() => setRefreshed((value) => value + 1)}>↻ ОБНОВИТЬ</button><button>↗ ПЕРЕВОД</button><button>↙ ПОПОЛНИТЬ</button><button>▤ ЭКСПОРТ</button><div className="legacy-network"><i /> {stage === "balance" ? "СИНХРОНИЗАЦИЯ" : "ПОДКЛЮЧЕНО · 6 PEERS"}</div></div><div className="legacy-wallet-body"><section className="legacy-account"><div><small>НАЗВАНИЕ КОШЕЛЬКА</small><b>Наследство / основной счёт</b></div><div><small>АДРЕС</small><code>bc1q-memoria-5269-6714-8866-u17x-0314</code></div></section><section className="legacy-balance"><small>ДОСТУПНЫЙ БАЛАНС</small><strong>{displayBalance.toFixed(6)} BTC</strong><span>Курс: 1 BTC = 64 850.21 USD</span><b>≈ {(displayBalance * 64850.21).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</b>{stage === "balance" && <div className="legacy-sync-line"><i /> Синхронизация блоков... интерфейс может не отвечать</div>}</section><section className="legacy-history"><header><h2>ИСТОРИЯ ТРАНЗАКЦИЙ</h2><span>Последнее обновление: {refreshed ? "только что" : "03:14:08"}</span></header><table><thead><tr><th>Дата</th><th>Тип</th><th>Адрес / описание</th><th>Статус</th><th>Сумма</th></tr></thead><tbody>{drained && <tr className="legacy-outgoing" onClick={() => setStage("trace")}><td>сейчас</td><td>ИСХОДЯЩАЯ</td><td>A1-8C17 · TX-41A7-17AF</td><td>6/6</td><td>−67.660000 BTC</td></tr>}<tr><td>14.03 03:14</td><td>ВХОДЯЩАЯ</td><td>bc1q...0314</td><td>ПОДТВЕРЖДЕНО</td><td className="legacy-positive">+52.400000 BTC</td></tr><tr><td>11.03 17:42</td><td>ОБМЕН</td><td>ETH → BTC</td><td>ПОДТВЕРЖДЕНО</td><td className="legacy-positive">+15.260314 BTC</td></tr><tr><td>03.03 06:17</td><td>КОМИССИЯ</td><td>NETWORK FEE</td><td>ПОДТВЕРЖДЕНО</td><td>−0.000314 BTC</td></tr></tbody></table>{drained && <div className="legacy-investigation-actions"><button className="legacy-audit-button" onClick={() => setStage("trace")}>ОТСЛЕДИТЬ ПЕРЕВОД</button><button className="legacy-audit-button" onClick={() => setStage("audit")}>ПРОВЕРИТЬ ПРОВОДКУ</button></div>}</section></div><footer><span>СЕТЬ: MEMORIA-BTC LEGACY</span><span>БЛОК: 031466</span><span>{stage === "balance" ? "SYNCING..." : "READY"}</span></footer></div>;
}

function DesktopIcon({ icon, label, onClick, badge = false }: { icon: string; label: string; onClick: () => void; badge?: boolean }) { return <button className="desktop-icon" onDoubleClick={onClick} onClick={onClick}><span>{icon}</span>{badge && <b className="desktop-badge">1</b>}<em>{label}</em></button>; }
function TerminalLine({ line }: { line: string }) {
  if (line.startsWith("[RED]")) return <div className="terminal-alert">{line.slice(5)}</div>;
  const parts = line.split("SIXSEVEN");
  return <div>{parts.map((part, index) => <span key={index}>{part}{index < parts.length - 1 && <b className="clue-red">SIXSEVEN</b>}</span>)}</div>;
}
function MalwareStorm({ onClose }: { onClose: () => void }) {
  const [visible, setVisible] = useState(1);
  const [closed, setClosed] = useState<number[]>([]);
  const [rebooting, setRebooting] = useState(false);
  const ads = ["ВЫ ВЫИГРАЛИ 1 000 000 ₽!", "СКАЧАТЬ RAM БЕСПЛАТНО", "HOT SINGLES В ВАШЕЙ СЕТИ", "УСКОРИТЬ КОМПЬЮТЕР НА 900%", "ВАШ АНТИВИРУС УСТАРЕЛ", "КУПИТЬ BITCOIN БЕЗ СМС", "UNKNOWN_17 ХОЧЕТ В ЧАТ"];
  useEffect(() => { const timer = setInterval(() => setVisible((value) => Math.min(value + 1, 24)), 520); return () => clearInterval(timer); }, []);
  function closeAd(index: number) {
    const next = [...closed, index];
    setClosed(next);
    if (next.length >= 6) { setRebooting(true); setTimeout(onClose, 2200); }
  }
  if (rebooting) return <div className="fake-reboot"><b>MEMORIA FATAL ERROR</b><p>REMOTE ACCESS LOST</p><span>Перезагрузка и восстановление исходного состояния...</span><i /></div>;
  return <div className="malware-storm">{Array.from({ length: visible }, (_, index) => !closed.includes(index) && <div key={index} className={`malware-window ad-${index % 4}`} style={{ left: `${(index * 17) % 76}%`, top: `${(index * 29) % 70}%`, zIndex: 200 + index, transform: `rotate(${(index % 5) - 2}deg)` }}><header>РЕКЛАМА <button onClick={() => closeAd(index)}>×</button></header><div><b>{index % 2 ? "$" : "!"}</b><span>{ads[index % ads.length]}<small>Нажмите здесь, пока не поздно</small></span></div></div>)}<div className="malware-counter">Закрыто окон: {closed.length} · Активно: {visible - closed.length}</div></div>;
}
function Window({ title, active, layer, app, onClose, onMinimize, onFocus, children }: { title: string; active: boolean; layer: number; app: AppId; onClose: () => void; onMinimize: () => void; onFocus: () => void; children: React.ReactNode }) {
  const positions: Record<AppId, { left: string; top: string }> = { readme: { left: "48%", top: "47%" }, files: { left: "52%", top: "50%" }, terminal: { left: "55%", top: "54%" }, archive: { left: "50%", top: "49%" }, log: { left: "54%", top: "46%" }, help: { left: "46%", top: "52%" }, browser: { left: "51%", top: "48%" }, mail: { left: "49%", top: "51%" } };
  return <section className={`window ${active ? "window-active" : "window-inactive"}`} style={{ zIndex: 10 + layer, left: positions[app].left, top: positions[app].top }} onMouseDown={onFocus}><header className="titlebar"><span>▥ {title}</span><div><button aria-label={`Свернуть ${title}`} onClick={(e) => { e.stopPropagation(); onMinimize(); }}>_</button><button aria-label={`Закрыть ${title}`} onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button></div></header><nav className="menubar">Файл　 Правка　 Вид　 Справка</nav><div className="window-content">{children}</div><div className="window-status">MEMORIA REMOTE VOLUME · READ ONLY</div></section>;
}
function windowTitle(app: AppId) { return ({ readme: "ПРОЧТИ_МЕНЯ — Блокнот", files: "Проводник — RECOVERY", terminal: "Командная строка", archive: "Архиватор", log: "system.log", help: "Справка MEMORIA", browser: "Pikanichok Navigator 0.8.14", mail: "MEMORIA Mail" })[app]; }

function Readme({ onContinue }: { onContinue: () => void }) { return <article className="document letter"><div className="stamp">URGENT<br/><b>14 MAR</b></div><p className="mono-meta">RECOVERY NOTE / НЕ ОТПРАВЛЯТЬ ПО ПОЧТЕ</p><h1>Если ты это читаешь — резервный канал сработал.</h1><p>Кто-то получил доступ к моему компьютеру. Я успел перенести сюда несколько файлов, связанных с наследством, но часть данных удалена.</p><p>Начни с первой фотографии. Система сохранила только правую половину времени, а левую кто-то удалил вместе с журналом пользователя.</p><p>Чтобы открыть архив, придётся восстановить недостающий фрагмент и соединить обе половины.</p><button className="system-button" onClick={onContinue}>Открыть файлы →</button></article>; }

function HelpDocument() {
  return <article className="document help-document"><p className="mono-meta">MEMORIA RECOVERY SYSTEM · USER MANUAL</p><h1>Справка MEMORIA</h1><p>Вы подключены к повреждённой резервной копии удалённого компьютера. Исследуйте рабочий стол, открывайте файлы и сопоставляйте найденные сведения. Некоторые объекты повреждены, удалены, зашифрованы или намеренно спрятаны.</p><h3>Основные правила</h3><ul><li>Открывайте файлы и ссылки обычным или двойным щелчком.</li><li>Свёрнутые программы остаются на панели задач. Закрытое окно можно открыть повторно.</li><li>Записывайте числа, слова, адреса и необычные названия файлов. Они могут понадобиться значительно позже.</li><li>Не каждая найденная подсказка является правильной. В системе присутствуют ложные следы.</li><li>Перед вводом паролей обращайте внимание на требуемый формат.</li></ul><p>Терминал используется для просмотра, восстановления, установки и исследования данных. Чтобы узнать подробнее и увидеть список доступных команд, откройте терминал и введите:</p><pre>help</pre><p>Команды вводятся вручную и выполняются клавишей Enter. Для некоторых команд необходимо указать имя файла.</p><h3>Браузер Pikanichok</h3><p>Адреса <code>pika://</code> не открываются без совместимого браузера. В Pikanichok можно вводить адреса вручную, создавать вкладки и переключаться между ними. Переход на неизвестные узлы может иметь последствия.</p><h3>Рекомендации</h3><ul><li>Лучше проходить игру с блокнотом или заметками.</li><li>Если задача кажется невозможной, вернитесь к ранее найденным данным.</li><li>Не обновляйте страницу во время длительной операции.</li><li>Если система начала вести себя странно, возможно, это результат вашего действия, а не ошибка игры.</li></ul></article>;
}

function MailClient({ hasMail }: { hasMail: boolean }) {
  const [folder, setFolder] = useState("Входящие");
  const [opened, setOpened] = useState(false);
  const folders = [{ name: "Входящие", icon: "▤", count: hasMail ? 1 : 0 }, { name: "Отправленные", icon: "↗", count: 0 }, { name: "Черновики", icon: "▧", count: 0 }, { name: "Спам", icon: "!", count: 0 }];
  const showMail = folder === "Входящие" && hasMail;
  return <div className="mail-client"><header><div className="mail-logo">M</div><b>MEMORIA Mail</b><button>Написать</button><span className="mail-sync"><i /> Синхронизация завершена</span></header><div className="mail-layout"><aside>{folders.map((item) => <button key={item.name} className={folder === item.name ? "active" : ""} onClick={() => { setFolder(item.name); setOpened(false); }}><span>{item.icon}</span>{item.name}{item.count > 0 && <b>{item.count}</b>}</button>)}<div className="mail-account"><i>R</i><span>recovery@memoria.local<small>LEGACY IMAP</small></span></div></aside><main>{opened && showMail ? <article className="mail-message"><button onClick={() => setOpened(false)}>← Назад</button><p className="eyebrow">ВХОДЯЩЕЕ СООБЩЕНИЕ</p><h1>KEY ACCEPTED</h1><div className="mail-from"><b>Unknown_17</b><span>unknown17@onallmail.net</span><time>03:14:17</time></div><p>Спасибо.</p><p>Я знал, что резервная копия повреждена, но не знал, где владелец спрятал последнюю часть seed-фразы.</p><p>Ты сделал то, что не смог сделать я.<br/>Ты открыл кошелёк.<br/>Остальное я сделал сам.</p><p>Не пытайся вернуть средства. К моменту, когда ты прочитаешь это письмо, они уже пройдут через несколько адресов.</p><p>Но можешь попробовать.<br/>Мне интересно, насколько далеко ты зайдёшь.</p><p className="mail-signature">— Unknown_17</p><details className="mail-tech"><summary>Технические данные сообщения</summary><pre>Message-ID: &lt;U17.031417.4F9A@onallmail.net&gt;{`\n`}Date: 03:14:17 +0300{`\n`}Received: relay-04.onallmail.net{`\n`}X-Route: 04{`\n`}X-Mailer: ONALL Legacy Mail 1.7{`\n`}Signature: U17</pre></details></article> : <><div className="mail-list-head"><h2>{folder}</h2><button>↻ Обновить</button></div>{showMail ? <button className="mail-row unread" onClick={() => setOpened(true)}><i>●</i><div><b>Unknown_17</b><span>KEY ACCEPTED</span></div><p>Спасибо. Ты открыл кошелёк…</p><time>сейчас</time></button> : <div className="empty-mail"><div>✉</div><h2>Писем нет</h2><p>В папке «{folder}» пока нет сообщений.</p><small>Последняя синхронизация: только что</small></div>}</>}</main></div><footer>Подключено · recovery@memoria.local · TLS устарел</footer></div>;
}

function FileExplorer({ selected, setSelected, restored, openArchive }: { selected: FileId; setSelected: (id: FileId) => void; restored: boolean; openArchive: () => void }) {
  const list: FileId[] = ["photo", "note", "log", "epstein", "archive", ...(restored ? ["deleted" as FileId] : [])];
  return <div className="explorer"><aside><b>RECOVERY (C:)</b><span>└─ documents</span><span>└─ archive</span><span>└─ system</span><span className="muted">└─ .trash</span></aside><div className="file-area"><div className="file-grid">{list.map((id) => <button key={id} className={`${selected === id ? "selected" : ""} ${id === "epstein" ? "locked-clue" : ""}`} onClick={() => setSelected(id)} onDoubleClick={() => id === "archive" && openArchive()}><span>{files[id].icon}</span><em>{files[id].name}</em></button>)}</div><FilePreview id={selected} restored={restored} openArchive={openArchive} /></div></div>;
}

function FilePreview({ id, restored, openArchive }: { id: FileId; restored: boolean; openArchive: () => void }) {
  if (id === "photo") return <div className="preview"><div className="corrupt-photo"><span><b>??</b>:14</span><i>LEFT SECTOR LOST</i></div><p><b>IMG_A7.corrupt</b></p><p>Левая часть отметки времени уничтожена. Уцелели только минуты: <b>14</b>.</p></div>;
  if (id === "note") return <div className="preview"><p><b>заметка_без_даты.txt</b></p><p>«Ключ — это полное время первой фотографии: часы, затем минуты. Часы остались в удалённом журнале».</p></div>;
  if (id === "log") return <div className="preview"><p><b>system.log</b></p><pre>[??:14] login: unknown_17{`\n`}[??:17] delete: user_fragment.log</pre></div>;
  if (id === "deleted") return restored ? <div className="preview"><p><b>user_fragment.log</b> · восстановлен</p><pre>HOUR_FRAGMENT = 03{`\n`}KEY_FORMAT = HHMM</pre></div> : <div className="preview"><p><b>user_fragment.log</b> · удалён</p><p>Содержимое недоступно. Запись файловой системы можно попытаться восстановить через терминал.</p><pre>STATUS: DELETED{`\n`}CONTENT: [UNAVAILABLE]</pre></div>;
  if (id === "epstein") return <div className="preview locked-preview"><p><b className="clue-red">.Jeffrey_Epstein_year</b></p><p>Доступ запрещён системной политикой.</p><pre>PERMISSION: ROOT_ONLY{`\n`}CONTENT: [ENCRYPTED]</pre></div>;
  if (id === "archive") return <div className="preview"><p><b>НАСЛЕДСТВО.arc</b></p><p>Зашифрованный архив. Требуется четырёхзначный ключ.</p><button className="system-button" onClick={openArchive}>Открыть архив</button></div>;
  return <div className="preview"><p>{restored ? "Фрагмент восстановлен." : "Файл недоступен."}</p></div>;
}

function Archive({ restored, code, setCode, unlock, done, openLink, openCryptoLink }: { restored: boolean; code: string; setCode: (v: string) => void; unlock: () => void; done: boolean; openLink: () => void; openCryptoLink: () => void }) {
  if (done) return <div className="archive-unpacked"><div className="archive-header"><div className="seal">I</div><div><p className="eyebrow">КОНТЕЙНЕР РАСШИФРОВАН</p><h2>НАСЛЕДСТВО.arc</h2></div></div><p>В архиве обнаружено четыре объекта:</p><div className="archive-files"><button onDoubleClick={openLink} onClick={openLink}><span>◎</span><b>ENTRY_POINT.url</b><small>pika://oblako-foto/xxx-228-lox/</small></button><button onDoubleClick={openCryptoLink} onClick={openCryptoLink}><span>₿</span><b>WALLET_RECOVERY.url</b><small>pika://crypto-ne-naebalovo-100%/walet/526967148866</small></button><div><span>▤</span><b>browser_note.txt</b><small>«Обычные браузеры этого адреса не увидят»</small></div><div><span>◇</span><b>signature.key</b><small>PIKA LEGACY CERTIFICATE</small></div></div><div className="archive-tip">Откройте URL-файл, чтобы перейти на соответствующий PIKA-узел.</div></div>;
  return <div className="archive"><div className="lock">▣</div><p className="eyebrow">AES LEGACY CONTAINER</p><h2>НАСЛЕДСТВО.arc</h2><p>Архив повреждён, но заголовок читается. Введите четырёхзначный ключ.</p><label>КЛЮЧ ДОСТУПА<input maxLength={5} value={code} onChange={(e) => setCode(e.target.value)} placeholder="_ _ _ _" /></label><button className="system-button danger" onClick={unlock}>РАСШИФРОВАТЬ</button><small>{restored ? "Удалённый фрагмент восстановлен: часы = 03, формат = HHMM. Минуты ищите на первой фотографии." : "В корзине обнаружен удалённый фрагмент. Его можно восстановить через терминал."}</small></div>;
}

type BrowserView = "home" | "cloud" | "crypto" | "porno" | "hackshop" | "notfound";
type BrowserTab = { id: number; title: string; address: string; view: BrowserView };
type WalletStage = "balance" | "drained" | "trace" | "audit" | "solved";

function Pikanichok({ page, navKey }: { page: "home" | "cloud" | "crypto" | "hackshop"; navKey: number }) {
  const [cloudPassword, setCloudPassword] = useState("");
  const [cloudOpen, setCloudOpen] = useState(false);
  const [cloudError, setCloudError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [commandSelected, setCommandSelected] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [seedError, setSeedError] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [walletStage, setWalletStage] = useState<WalletStage>("balance");
  const [auditRow, setAuditRow] = useState("");
  const [auditDifference, setAuditDifference] = useState("");
  const [auditError, setAuditError] = useState(false);
  const cloudAddress = "pika://oblako-foto/xxx-228-lox/";
  const cryptoAddress = "pika://crypto-ne-naebalovo-100%/walet/526967148866";
  const pornoAddress = "pika://porno";
  const hackshopAddress = "pika://blackbox-market/device/universal-hack";
  const requestedTab: BrowserTab = page === "crypto" ? { id: 2, title: "Crypto Wallet", address: cryptoAddress, view: "crypto" } : page === "hackshop" ? { id: 2, title: "BLACKBOX Market", address: hackshopAddress, view: "hackshop" } : { id: 2, title: "ОблакоФото", address: cloudAddress, view: "cloud" };
  const initialTabs: BrowserTab[] = page === "home" ? [{ id: 1, title: "Pikanet", address: "pika://home", view: "home" }] : [{ id: 1, title: "Pikanet", address: "pika://home", view: "home" }, requestedTab];
  const [tabs, setTabs] = useState<BrowserTab[]>(initialTabs);
  const [activeId, setActiveId] = useState(page === "home" ? 1 : 2);
  const active = tabs.find((tab) => tab.id === activeId) || tabs[0];
  const [address, setAddress] = useState(active.address);
  const [pendingAddress, setPendingAddress] = useState<string | null>(null);

  function finishWalletDrain() {
    setWalletStage("drained");
    localStorage.setItem("memoria-mail-arrived", "true");
    localStorage.setItem("memoria-mail-unread", "true");
    window.dispatchEvent(new Event("memoria-mail-arrived"));
  }

  useEffect(() => setAddress(active.address), [active.id, active.address]);
  useEffect(() => {
    let drainTimer: ReturnType<typeof setTimeout> | undefined;
    const unlockFromHack = () => {
      setWalletOpen(true);
      setWalletStage("balance");
      setSeedError(false);
      drainTimer = setTimeout(finishWalletDrain, 4500);
    };
    if (localStorage.getItem("memoria-wallet-hacked") === "true") unlockFromHack();
    window.addEventListener("memoria-wallet-hacked", unlockFromHack);
    return () => { window.removeEventListener("memoria-wallet-hacked", unlockFromHack); if (drainTimer) clearTimeout(drainTimer); };
  }, []);
  useEffect(() => {
    if (page === "home" || navKey === 0) return;
    setTabs((current) => {
      const targetAddress = page === "crypto" ? cryptoAddress : page === "hackshop" ? hackshopAddress : cloudAddress;
      const existing = current.find((tab) => tab.view === page && tab.address.replace(/\/$/, "") === targetAddress.replace(/\/$/, ""));
      if (existing) {
        setActiveId(existing.id);
        return current;
      }
      const id = Math.max(...current.map((tab) => tab.id), 0) + 1;
      setActiveId(id);
      return [...current, { id, title: page === "crypto" ? "Crypto Wallet" : page === "hackshop" ? "BLACKBOX Market" : "ОблакоФото", address: targetAddress, view: page }];
    });
  }, [page, navKey]);

  function applyAddress(value: string) {
    const normalized = value.trim() || "pika://home";
    const comparable = normalized.toLowerCase().replace(/\/$/, "");
    const view: BrowserView = comparable === "pika://home" ? "home" : comparable === cloudAddress.replace(/\/$/, "") ? "cloud" : comparable === cryptoAddress.replace(/\/$/, "") ? "crypto" : comparable === pornoAddress ? "porno" : comparable === hackshopAddress ? "hackshop" : "notfound";
    const title = view === "home" ? "Pikanet" : view === "cloud" ? "ОблакоФото" : view === "crypto" ? "Crypto Wallet" : view === "porno" ? "PornoHub" : view === "hackshop" ? "BLACKBOX Market" : "Узел не найден";
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

  const cloudPhotos = [
    { file: "13.jpg" }, { file: "2.jpg", word: "Сегодня" }, { file: "18.jpg", word: "люди" },
    { file: "6.jpg" }, { file: "15.jpg" }, { file: "5.jpg", word: "намного" },
    { file: "11.png" }, { file: "8.jpg", word: "дешевле" }, { file: "1.jpg" },
    { file: "19.jpg", word: "чем" }, { file: "12.jpg" },
    { file: "14.jpg" }, { file: "7.jpg" }, { file: "20.jpg", word: "одежда" },
    { file: "9.png" }, { file: "4.jpg" }, { file: "17.jpg" }, { file: "10.jpg" },
  ];

  function verifySeed() {
    const normalized = seedPhrase.toLowerCase().replace(/ё/g, "е").replace(/[^а-яa-z\s]/g, " ").replace(/\s+/g, " ").trim();
    const correct = "слово не воробей вообще ничто не воробей кроме самого воробья";
    if (normalized === correct) { setWalletOpen(true); setWalletStage("balance"); setSeedError(false); setTimeout(finishWalletDrain, 4500); }
    else setSeedError(true);
  }

  return <div className="pika-browser"><div className="pika-tabs">{tabs.map((tab) => <button key={tab.id} className={tab.id === activeId ? "active" : ""} onClick={() => setActiveId(tab.id)}><span>{tab.view === "cloud" ? "▧" : "◎"}</span>{tab.title}<i onClick={(e) => { e.stopPropagation(); if (tabs.length === 1) return; const remaining = tabs.filter((item) => item.id !== tab.id); setTabs(remaining); if (tab.id === activeId) setActiveId(remaining[remaining.length - 1].id); }}>×</i></button>)}<button className="new-tab" onClick={newTab}>+</button></div><div className="pika-toolbar"><button>←</button><button>→</button><button onClick={() => applyAddress(active.address)}>↻</button><input className="pika-address" value={address} onChange={(e) => setAddress(e.target.value)} onFocus={(e) => e.currentTarget.select()} onKeyDown={(e) => e.key === "Enter" && requestNavigation()} aria-label="Адрес PIKA"/><button onClick={requestNavigation}>ПЕРЕЙТИ</button></div>{active.view === "home" && <div className="pika-page pika-home"><div className="pika-logo">PIKANICHOK <small>NAVIGATOR 0.8.14</small></div><div className="home-orbit">◎</div><h1>Добро пожаловать в Pikanet</h1><p>Устаревшая распределённая сеть. Для перехода введите адрес PIKA или откройте совместимую ссылку.</p><div className="home-links"><span>КАТАЛОГ УЗЛОВ — недоступен</span><span>ПОЧТА — соединение отсутствует</span><span>АРХИВ СЕТИ — требуется адрес</span></div></div>}{active.view === "cloud" && <div className="pika-page cloud-page"><div className="cloud-brand">ОБЛАКО<span>ФОТО</span> <small>PIKA STORAGE SERVICE</small></div>{cloudOpen ? <div className="cloud-vault"><div className="cloud-photos"><button className="photo-card hack-file-card" onClick={() => setPendingAddress(hackshopAddress)} aria-label="Открыть FREE HACK DEVICE"><div className="hack-file-icon">⚡</div><b>FREE_HACK_DEVICE.url</b><small>100% FREE · взломает что угодно</small><span>PIKA LINK</span></button>{cloudPhotos.map((photo, index) => <button key={photo.file} className={`photo-card distortion-${index % 6}`} onClick={() => setSelectedPhoto(photo.file)} aria-label={`Открыть фотографию ${photo.file}`}><img src={`/cloud-photos/${photo.file}`} alt=""/>{photo.word && <b className="decoy-word">{photo.word}</b>}<span>IMG_{String(index + 1).padStart(4, "0")}.{photo.file.split(".").pop()}</span></button>)}</div><button className="manual-file-card" onClick={() => { setManualOpen(true); setCommandCopied(false); }}><span>▤</span><div><b>service_manual_04.txt</b><small>1.2 KB · изменён давно</small></div></button>{selectedPhoto && <div className="photo-viewer" onClick={() => setSelectedPhoto(null)}><button aria-label="Закрыть">×</button><img src={`/cloud-photos/${selectedPhoto}`} alt={`Фотография ${selectedPhoto}`}/><small>{selectedPhoto} · щёлкните, чтобы закрыть</small></div>}</div> : <div className="cloud-login"><div className="cloud-lock">▣</div><p className="eyebrow">ЗАЩИЩЁННОЕ ОБЛАЧНОЕ ХРАНИЛИЩЕ</p><h1>Требуется пароль</h1><label>ПАРОЛЬ<input autoFocus inputMode="numeric" maxLength={4} value={cloudPassword} onChange={(e) => { setCloudPassword(e.target.value.replace(/\D/g, "")); setCloudError(false); }} onKeyDown={(e) => { if (e.key === "Enter") { if (cloudPassword === "6766") setCloudOpen(true); else setCloudError(true); } }} placeholder="••••" /></label><button className="system-button" onClick={() => { if (cloudPassword === "6766") setCloudOpen(true); else setCloudError(true); }}>ОТКРЫТЬ ХРАНИЛИЩЕ</button>{cloudError && <p className="cloud-error">Неверный пароль. Доступ записан в журнал.</p>}<small>Подсказка владельца: «dva chisla, chetyre tsifry»</small></div>}</div>}{active.view === "crypto" && <div className="pika-page wallet-page"><div className="wallet-brand">₿ CRYPTO-NE-NAEBALOVO <small>LEGACY WALLET RECOVERY</small></div>{walletOpen ? <WalletInterface stage={walletStage} setStage={setWalletStage} auditRow={auditRow} setAuditRow={setAuditRow} auditDifference={auditDifference} setAuditDifference={setAuditDifference} auditError={auditError} setAuditError={setAuditError} openFoundWallet={() => setPendingAddress("pika://crypto-ne-naebalovo-100%/walet/41703146")} /> : <div className="wallet-panel"><p className="eyebrow">WALLET 526967148866</p><h1>Пароль от кошелька</h1><p>Нужна seed фраза</p><textarea value={seedPhrase} onChange={(e) => { setSeedPhrase(e.target.value); setSeedError(false); }} placeholder="слова через пробел" rows={4}/><div className="seed-count">Слов обнаружено: {seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0}</div><button className="system-button danger" onClick={verifySeed}>ВОССТАНОВИТЬ ДОСТУП</button>{seedError && <p className="wallet-error">SEED CHECKSUM INVALID · проверьте слова и их порядок</p>}</div>}</div>}{active.view === "porno" && <div className="pika-page porno-page"><header><b>Porno</b><span>Hub</span><small>PRIVATE VIDEO ARCHIVE</small></header><div className="porno-content"><div className="porno-video"><img src="/pashalka.jpg" alt="Секретная фотография"/><div className="fake-controls"><button>▶</button><div></div><span>00:00 / 00:17</span><button>▣</button></div></div><h2>Сосед по комнате устал после тяжёлого дня</h2><p>1 просмотр · загружено пользователем unknown_17</p></div></div>}{active.view === "hackshop" && <div className="pika-page hackshop-page"><header>BLACKBOX <b>MARKET</b><small>NO REFUNDS · NO QUESTIONS</small></header><div className="hack-product"><div className="hack-device">▣<i>⚡</i></div><div><p className="eyebrow">UNIVERSAL ACCESS DEVICE v6.6</p><h1>Взломает что угодно*</h1><p>Обход паролей, кошельков и PIKA-узлов одним пакетом.</p><pre>pkg install universal-hack-device</pre><small>* Производитель не отвечает за потерю данных, личности, денег и операционной системы.</small></div></div></div>}{active.view === "notfound" && <div className="pika-page pika-notfound"><div className="pika-logo">PIKANICHOK <small>NETWORK ERROR</small></div><div className="notfound-code">404</div><h1>Узел не найден</h1><p>Адрес <code>{active.address}</code> не отвечает или никогда не существовал.</p><pre>PIKA_DNS: NO_ROUTE{`\n`}ATTEMPTS: 3{`\n`}CACHE: EMPTY</pre></div>}{manualOpen && <div className="manual-overlay" onClick={() => setManualOpen(false)}><article onClick={(e) => e.stopPropagation()}><header><b>service_manual_04.txt — Блокнот</b><button onClick={() => setManualOpen(false)}>×</button></header><div><p>Расширенный режим терминала отключён после повреждения системы.</p><p>Для повторной активации выполнить команду восстановления:</p><button className={`manual-command ${commandSelected ? "selected" : ""}`} onClick={() => { setCommandSelected(true); localStorage.setItem("memoria-game-clipboard", "restore-shell --module extended --source recovery_04"); }}>restore-shell --module extended --source recovery_04</button><button className="manual-copy" onClick={() => { const value = "restore-shell --module extended --source recovery_04"; localStorage.setItem("memoria-game-clipboard", value); navigator.clipboard?.writeText(value); setCommandSelected(true); setCommandCopied(true); }}>КОПИРОВАТЬ КОМАНДУ</button>{commandCopied && <small className="manual-copied">Скопировано в игровой буфер обмена</small>}<p>Восстановление может занять некоторое время.<br/>После завершения перезапустить терминал.</p><p>Не использовать режим анализа без идентификатора объекта.</p><footer>Analysis module: <b>LOOKUP</b></footer></div></article></div>}<div className="pika-status">{active.address} · PIKA driver active</div>{pendingAddress && <div className="browser-confirm"><div><h3>Вы уверены, что хотите перейти на этот сайт?</h3><code>{pendingAddress}</code><p>Безопасность этого PIKA-узла не проверена.</p><footer><button onClick={() => setPendingAddress(null)}>Отмена</button><button className="danger" onClick={() => { applyAddress(pendingAddress); setPendingAddress(null); }}>Перейти</button></footer></div></div>}</div>;
}
