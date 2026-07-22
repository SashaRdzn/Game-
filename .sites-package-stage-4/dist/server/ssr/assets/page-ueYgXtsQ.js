import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
//#region app/page.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var files = {
	readme: {
		name: "ПРОЧТИ_МЕНЯ.txt",
		icon: "▤",
		app: "readme"
	},
	photo: {
		name: "IMG_A7.corrupt",
		icon: "▧",
		app: "files"
	},
	note: {
		name: "заметка_без_даты.txt",
		icon: "▤",
		app: "files"
	},
	deleted: {
		name: "user_fragment.log",
		icon: "⌫",
		app: "files"
	},
	archive: {
		name: "НАСЛЕДСТВО.arc",
		icon: "▣",
		app: "archive"
	},
	log: {
		name: "system.log",
		icon: "≡",
		app: "log"
	}
};
var bootLines = [
	"MEMORIA RECOVERY BIOS 4.12",
	"Memory check ............ 640K OK",
	"Mounting remote volume .. DEGRADED",
	"Filesystem integrity .... 63%",
	"Unauthorized session .... DETECTED"
];
function Home() {
	const [booted, setBooted] = (0, import_react.useState)(false);
	const [bootStep, setBootStep] = (0, import_react.useState)(0);
	const [windows, setWindows] = (0, import_react.useState)({});
	const [zOrder, setZOrder] = (0, import_react.useState)([]);
	const [selectedFile, setSelectedFile] = (0, import_react.useState)("photo");
	const [startOpen, setStartOpen] = (0, import_react.useState)(false);
	const [terminal, setTerminal] = (0, import_react.useState)(["MEMORIA shell v1.7", "Введите help для списка команд."]);
	const [command, setCommand] = (0, import_react.useState)("");
	const [restored, setRestored] = (0, import_react.useState)(false);
	const [archiveCode, setArchiveCode] = (0, import_react.useState)("");
	const [chapterDone, setChapterDone] = (0, import_react.useState)(false);
	const [browserInstalled, setBrowserInstalled] = (0, import_react.useState)(false);
	const [installState, setInstallState] = (0, import_react.useState)("idle");
	const [protocolError, setProtocolError] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("Канал нестабилен");
	(0, import_react.useEffect)(() => {
		if (localStorage.getItem("memoria-progress") === "chapter1") {
			setBooted(true);
			setRestored(true);
			setChapterDone(true);
		}
		if (localStorage.getItem("memoria-pikanichok") === "installed") {
			setBrowserInstalled(true);
			setInstallState("done");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (booted || bootStep >= bootLines.length) return;
		const timer = setTimeout(() => setBootStep((v) => v + 1), 650);
		return () => clearTimeout(timer);
	}, [bootStep, booted]);
	const time = (0, import_react.useMemo)(() => new Intl.DateTimeFormat("ru", {
		hour: "2-digit",
		minute: "2-digit"
	}).format(/* @__PURE__ */ new Date()), []);
	function focusWindow(app) {
		setZOrder((order) => [...order.filter((id) => id !== app), app]);
	}
	function openWindow(app) {
		setWindows((current) => ({
			...current,
			[app]: "open"
		}));
		focusWindow(app);
	}
	function minimizeWindow(app) {
		setWindows((current) => ({
			...current,
			[app]: "minimized"
		}));
	}
	function closeWindow(app) {
		setWindows((current) => {
			const next = { ...current };
			delete next[app];
			return next;
		});
		setZOrder((order) => order.filter((id) => id !== app));
	}
	function toggleTaskWindow(app) {
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
		if (cmd === "pkg info pikanichok-browser") response = "Пакет: pikanichok-browser\nНазвание: Pikanichok Navigator\nВерсия: 0.8.14\nРазмер загрузки: 14.8 MB\nИздатель: PIKA Systems\nПодпись: ПРОСРОЧЕНА\nПротоколы: HTTP, PIKA, MEM";
		if (cmd === "pikanichok") if (browserInstalled) {
			response = "Запуск Pikanichok Navigator 0.8.14...";
			setTimeout(() => openWindow("browser"), 350);
		} else response = "'pikanichok' не является установленной программой.\nПодсказка: pkg search protocol:pika";
		if (cmd === "pkg install pikanichok-browser") if (browserInstalled) response = "pikanichok-browser 0.8.14 уже установлен.";
		else {
			response = "Чтение списков пакетов... готово\nПроверка зависимостей... готово\n\nБудут установлены:\n  legacy-certificates\n  pika-network-driver\n  pikanichok-browser\n\nНеобходимо загрузить: 14.8 MB\nПосле установки занято: 31.2 MB\nПодпись пакета просрочена. Продолжить? [Y/n]";
			setInstallState("awaiting");
		}
		if ((cmd === "y" || cmd === "yes") && installState === "awaiting") {
			response = "Подтверждение получено. Начинаю загрузку...";
			setInstallState("installing");
			const steps = [
				[500, "Получение legacy-certificates [###.................] 16%"],
				[1100, "Получение pika-network-driver [########............] 41%"],
				[1800, "Получение pikanichok-browser [##############......] 73%"],
				[2600, "archive-01: ошибка контрольной суммы"],
				[3300, "Переключение на зеркало archive-02... OK"],
				[4100, "Получение pikanichok-browser [####################] 100%"],
				[4700, "Настройка pika-network-driver... готово"],
				[5200, "Регистрация протокола pika://... готово"],
				[5700, "Создание ярлыка... готово\n\nPikanichok Navigator 0.8.14 установлен.\nКоманда запуска: pikanichok"]
			];
			steps.forEach(([delay, line], index) => setTimeout(() => {
				setTerminal((value) => [...value, line]);
				if (index === steps.length - 1) {
					setBrowserInstalled(true);
					setInstallState("done");
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
		if (cmd === "clear") {
			setTerminal([]);
			setCommand("");
			return;
		}
		setTerminal((v) => [
			...v,
			`C:\\RECOVERY> ${raw}`,
			...response.split("\n")
		]);
		setCommand("");
	}
	function unlockArchive() {
		const normalized = archiveCode.trim().toLowerCase().replace(/\s+/g, "");
		if ([
			"0314",
			"03:14",
			"314"
		].includes(normalized)) {
			setChapterDone(true);
			localStorage.setItem("memoria-progress", "chapter1");
			setNotice("Глава 1 завершена");
		} else setNotice("Ключ отклонён. Соедините фрагменты времени в формате HHMM");
	}
	if (!booted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "boot-screen",
		onClick: () => bootStep >= bootLines.length && setBooted(true),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "boot-box",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "boot-mark",
					children: "M"
				}),
				bootLines.slice(0, bootStep).map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: line }, line)),
				bootStep >= bootLines.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "boot-enter",
					onClick: () => setBooted(true),
					children: "[ НАЖМИТЕ, ЧТОБЫ ПОДКЛЮЧИТЬСЯ ]"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "cursor-block" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "desktop",
		onClick: () => startOpen && setStartOpen(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "desktop-watermark",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "MEMORIA" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "REMOTE RECOVERY SYSTEM" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "warning-strip",
				children: "ВНИМАНИЕ: целостность файловой системы 63% · соединение только для чтения"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "icons",
				"aria-label": "Рабочий стол",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopIcon, {
						icon: "▤",
						label: "ПРОЧТИ_МЕНЯ.txt",
						onClick: () => openWindow("readme")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopIcon, {
						icon: "▣",
						label: "НАСЛЕДСТВО.arc",
						onClick: () => openWindow("archive")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopIcon, {
						icon: "▧",
						label: "Мои файлы",
						onClick: () => openWindow("files")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopIcon, {
						icon: "⌫",
						label: "Корзина",
						onClick: () => {
							setSelectedFile("deleted");
							openWindow("files");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopIcon, {
						icon: ">_",
						label: "Терминал",
						onClick: () => openWindow("terminal")
					}),
					browserInstalled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopIcon, {
						icon: "◎",
						label: "Pikanichok",
						onClick: () => openWindow("browser")
					})
				]
			}),
			zOrder.map((app, index) => windows[app] === "open" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Window, {
				title: windowTitle(app),
				active: zOrder[zOrder.length - 1] === app,
				layer: index,
				app,
				onFocus: () => focusWindow(app),
				onClose: () => closeWindow(app),
				onMinimize: () => minimizeWindow(app),
				children: [
					app === "readme" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readme, { onContinue: () => openWindow("files") }),
					app === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileExplorer, {
						selected: selectedFile,
						setSelected: setSelectedFile,
						restored,
						openArchive: () => openWindow("archive")
					}),
					app === "terminal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "terminal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "terminal-output",
							children: terminal.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: line }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "terminal-input",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "C:\\RECOVERY>" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: command,
								onChange: (e) => setCommand(e.target.value),
								onKeyDown: (e) => e.key === "Enter" && runCommand(),
								"aria-label": "Команда терминала"
							})]
						})]
					}),
					app === "archive" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, {
						restored,
						code: archiveCode,
						setCode: setArchiveCode,
						unlock: unlockArchive,
						done: chapterDone,
						openLink: () => browserInstalled ? openWindow("browser") : setProtocolError(true)
					}),
					app === "log" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "text-file",
						children: "[??:14:08] LOGIN unknown_17\\n[??:17:42] DELETE user_fragment.log\\n[??:18:01] LOCK inheritance.arc\\n[??:18:07] SESSION LOST"
					}),
					app === "help" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "document",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Справка" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Исследуйте файлы двойным щелчком. Терминал понимает команды ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "help" }),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "ls" }),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "cat" }),
							", ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "status" }),
							" и ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "recover" }),
							"."
						] })]
					}),
					app === "browser" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pikanichok, {})
				]
			}, app)),
			protocolError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "protocol-error",
				role: "alertdialog",
				"aria-label": "Ошибка протокола",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: ["MEMORIA NETWORK SERVICE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setProtocolError(false),
						children: "×"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "error-body",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "error-icon",
							children: "!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Невозможно открыть этот адрес" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"В системе отсутствует обработчик протокола ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "PIKA" }),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", { children: [
								"Адрес: pika://inheritance/node-0314",
								`\n`,
								"Код ошибки: NO_PROTOCOL_HANDLER"
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "error-hint",
								children: "Совместимое программное обеспечение может находиться в старых репозиториях."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "pkg search protocol:pika" })
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "system-button",
						onClick: () => setProtocolError(false),
						children: "Закрыть"
					}) })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "status-toast",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: chapterDone ? "ok" : "" }),
					" ",
					notice
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "taskbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "start",
						onClick: (e) => {
							e.stopPropagation();
							setStartOpen(!startOpen);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◆" }), " ПУСК"]
					}),
					zOrder.map((app) => windows[app] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: `task-button ${windows[app] === "minimized" ? "is-minimized" : zOrder[zOrder.length - 1] === app ? "is-active" : ""}`,
						onClick: () => toggleTaskWindow(app),
						children: windowTitle(app)
					}, app)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "tray",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "▥" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: time })]
					})
				]
			}),
			startOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "start-menu",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "start-brand",
						children: ["MEMORIA ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "4.1" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							openWindow("files");
							setStartOpen(false);
						},
						children: "▧ Проводник"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							openWindow("terminal");
							setStartOpen(false);
						},
						children: ">_ Терминал"
					}),
					browserInstalled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							openWindow("browser");
							setStartOpen(false);
						},
						children: "◎ Pikanichok Navigator"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							openWindow("help");
							setStartOpen(false);
						},
						children: "? Справка"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "start-divider" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							localStorage.removeItem("memoria-progress");
							localStorage.removeItem("memoria-pikanichok");
							location.reload();
						},
						children: "↻ Сбросить сеанс"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scanlines" })
		]
	});
}
function DesktopIcon({ icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "desktop-icon",
		onDoubleClick: onClick,
		onClick,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: label })]
	});
}
function Window({ title, active, layer, app, onClose, onMinimize, onFocus, children }) {
	const positions = {
		readme: {
			left: "48%",
			top: "47%"
		},
		files: {
			left: "52%",
			top: "50%"
		},
		terminal: {
			left: "55%",
			top: "54%"
		},
		archive: {
			left: "50%",
			top: "49%"
		},
		log: {
			left: "54%",
			top: "46%"
		},
		help: {
			left: "46%",
			top: "52%"
		},
		browser: {
			left: "51%",
			top: "48%"
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `window ${active ? "window-active" : "window-inactive"}`,
		style: {
			zIndex: 10 + layer,
			left: positions[app].left,
			top: positions[app].top
		},
		onMouseDown: onFocus,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "titlebar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["▥ ", title] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": `Свернуть ${title}`,
					onClick: (e) => {
						e.stopPropagation();
						onMinimize();
					},
					children: "_"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": `Закрыть ${title}`,
					onClick: (e) => {
						e.stopPropagation();
						onClose();
					},
					children: "×"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "menubar",
				children: "Файл　 Правка　 Вид　 Справка"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "window-content",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "window-status",
				children: "MEMORIA REMOTE VOLUME · READ ONLY"
			})
		]
	});
}
function windowTitle(app) {
	return {
		readme: "ПРОЧТИ_МЕНЯ — Блокнот",
		files: "Проводник — RECOVERY",
		terminal: "Командная строка",
		archive: "Архиватор",
		log: "system.log",
		help: "Справка MEMORIA",
		browser: "Pikanichok Navigator 0.8.14"
	}[app];
}
function Readme({ onContinue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "document letter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stamp",
				children: [
					"URGENT",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "14 MAR" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mono-meta",
				children: "RECOVERY NOTE / НЕ ОТПРАВЛЯТЬ ПО ПОЧТЕ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Если ты это читаешь — резервный канал сработал." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Кто-то получил доступ к моему компьютеру. Я успел перенести сюда несколько файлов, связанных с наследством, но часть данных удалена." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Начни с первой фотографии. Система сохранила только правую половину времени, а левую кто-то удалил вместе с журналом пользователя." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Чтобы открыть архив, придётся восстановить недостающий фрагмент и соединить обе половины." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "signature",
				children: [
					"— твой брат",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
						"P.S. Если увидишь пользователя ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "unknown_17" }),
						", отключись."
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "system-button",
				onClick: onContinue,
				children: "Открыть файлы →"
			})
		]
	});
}
function FileExplorer({ selected, setSelected, restored, openArchive }) {
	const list = [
		"photo",
		"note",
		"log",
		"archive",
		...restored ? ["deleted"] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "explorer",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "RECOVERY (C:)" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "└─ documents" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "└─ archive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "└─ system" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "muted",
				children: "└─ .trash"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "file-area",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "file-grid",
				children: list.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: selected === id ? "selected" : "",
					onClick: () => setSelected(id),
					onDoubleClick: () => id === "archive" && openArchive(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: files[id].icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: files[id].name })]
				}, id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePreview, {
				id: selected,
				restored,
				openArchive
			})]
		})]
	});
}
function FilePreview({ id, restored, openArchive }) {
	if (id === "photo") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "preview",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "corrupt-photo",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "??" }), ":14"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: "LEFT SECTOR LOST" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "IMG_A7.corrupt" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				"Левая часть отметки времени уничтожена. Уцелели только минуты: ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "14" }),
				"."
			] })
		]
	});
	if (id === "note") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "preview",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "заметка_без_даты.txt" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "«Ключ — это полное время первой фотографии: часы, затем минуты. Часы остались в удалённом журнале»." })]
	});
	if (id === "log") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "preview",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "system.log" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", { children: [
			"[??:14] login: unknown_17",
			`\n`,
			"[??:17] delete: user_fragment.log"
		] })]
	});
	if (id === "deleted") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "preview",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "user_fragment.log" }), " · восстановлен"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", { children: [
			"HOUR_FRAGMENT = 03",
			`\n`,
			"KEY_FORMAT = HHMM"
		] })]
	});
	if (id === "archive") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "preview",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "НАСЛЕДСТВО.arc" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Зашифрованный архив. Требуется четырёхзначный ключ." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "system-button",
				onClick: openArchive,
				children: "Открыть архив"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "preview",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: restored ? "Фрагмент восстановлен." : "Файл недоступен." })
	});
}
function Archive({ restored, code, setCode, unlock, done, openLink }) {
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "archive-unpacked",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "archive-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "seal",
					children: "I"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "КОНТЕЙНЕР РАСШИФРОВАН"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "НАСЛЕДСТВО.arc" })] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "В архиве обнаружено три объекта:" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "archive-files",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onDoubleClick: openLink,
						onClick: openLink,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◎" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "ENTRY_POINT.url" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "pika://inheritance/node-0314" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "▤" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "browser_note.txt" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "«Обычные браузеры этого адреса не увидят»" })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◇" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "signature.key" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "PIKA LEGACY CERTIFICATE" })
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "archive-tip",
				children: "Дважды щёлкните ENTRY_POINT.url, чтобы открыть ссылку."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "archive",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lock",
				children: "▣"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "AES LEGACY CONTAINER"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "НАСЛЕДСТВО.arc" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Архив повреждён, но заголовок читается. Введите четырёхзначный ключ." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["КЛЮЧ ДОСТУПА", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				maxLength: 5,
				value: code,
				onChange: (e) => setCode(e.target.value),
				placeholder: "_ _ _ _"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "system-button danger",
				onClick: unlock,
				children: "РАСШИФРОВАТЬ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: restored ? "Удалённый фрагмент восстановлен: часы = 03, формат = HHMM. Минуты ищите на первой фотографии." : "В корзине обнаружен удалённый фрагмент. Его можно восстановить через терминал." })
		]
	});
}
function Pikanichok() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pika-browser",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pika-toolbar",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "←" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "→" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "↻" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pika-address",
						children: "pika://inheritance/node-0314"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: "ПЕРЕЙТИ" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pika-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pika-logo",
						children: ["PIKANICHOK ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "NAVIGATOR 0.8.14" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "certificate-warning",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "СЕРТИФИКАТ УЗЛА ПРОСРОЧЕН" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Последняя проверка: 6 214 дней назад" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Узел найден." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Доступ к следующему сектору установлен, но содержимое ещё не загружено." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pre", { children: [
						"NODE: INHERITANCE-0314",
						`\n`,
						"OWNER: [REDACTED]",
						`\n`,
						"REMOTE SESSION: ACTIVE"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "observer",
						children: "unknown_17: «Ты установила именно ту версию, которую я оставил»"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "system-button danger",
						children: "ПРОДОЛЖИТЬ НА СВОЙ РИСК"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pika-status",
				children: "Готово · защищённость соединения неизвестна"
			})
		]
	});
}
//#endregion
export { Home as default };
