import React, { useState } from "react";
import type { SupportedLanguage } from "storybook/internal/components";
import { SyntaxHighlighter } from "storybook/internal/components";
import { ensure, ThemeProvider, themes } from "storybook/theming";

export interface CodeFile {
  name: string;
  content: string;
  language: SupportedLanguage;
}

interface Props {
  files: CodeFile[];
  zipName: string;
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 8; j > 0; j--) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function buildZip(files: CodeFile[]): Uint8Array<ArrayBuffer> {
  const enc = new TextEncoder();
  const now = new Date();
  const dosDate =
    (((now.getFullYear() - 1980) & 0x7f) << 9) |
    (((now.getMonth() + 1) & 0x0f) << 5) |
    (now.getDate() & 0x1f);
  const dosTime =
    ((now.getHours() & 0x1f) << 11) |
    ((now.getMinutes() & 0x3f) << 5) |
    (Math.floor(now.getSeconds() / 2) & 0x1f);

  const chunks: Uint8Array[] = [];
  const centralDirs: Uint8Array[] = [];
  let offset = 0;

  for (const { name, content } of files) {
    const nameBytes = enc.encode(name);
    const data = enc.encode(content);
    const crc = crc32(data);
    const nameLen = nameBytes.length;
    const dataLen = data.length;

    const localHeader = new Uint8Array(new ArrayBuffer(30 + nameLen));
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, dosTime, true);
    lv.setUint16(12, dosDate, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataLen, true);
    lv.setUint32(22, dataLen, true);
    lv.setUint16(26, nameLen, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    const central = new Uint8Array(new ArrayBuffer(46 + nameLen));
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, dosTime, true);
    cv.setUint16(14, dosDate, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataLen, true);
    cv.setUint32(24, dataLen, true);
    cv.setUint16(28, nameLen, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    central.set(nameBytes, 46);

    chunks.push(localHeader, data);
    centralDirs.push(central);
    offset += 30 + nameLen + dataLen;
  }

  const cdSize = centralDirs.reduce((s, b) => s + b.length, 0);
  const eocd = new Uint8Array(new ArrayBuffer(22));
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const all = [...chunks, ...centralDirs, eocd];
  const total = all.reduce((s, b) => s + b.length, 0);
  const result = new Uint8Array(new ArrayBuffer(total));
  let pos = 0;
  for (const b of all) {
    result.set(b, pos);
    pos += b.length;
  }
  return result;
}

function actionBtnStyle(active: boolean): React.CSSProperties {
  return {
    padding: "4px 10px",
    border: "1px solid #d0d7de",
    borderRadius: "6px",
    background: active ? "#d1fae5" : "#f6f8fa",
    color: active ? "#065f46" : "#24292f",
    cursor: "pointer",
    fontSize: "12px",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    transition: "background 0.15s",
  };
}

export function CodeViewer({ files, zipName }: Props) {
  const [tab, setTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = files[tab];

  async function copy() {
    await navigator.clipboard.writeText(active.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const zip = buildZip(files);
    const blob = new Blob([zip], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${zipName}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,.12)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f6f8fa",
          borderBottom: "1px solid rgba(0,0,0,.1)",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          {files.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setTab(i)}
              style={{
                padding: "8px 16px",
                border: "none",
                borderBottom: i === tab ? "2px solid #0969da" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Consolas, monospace",
                fontSize: "12px",
                fontWeight: i === tab ? 600 : 400,
                color: i === tab ? "#0969da" : "#656d76",
                transition: "color 0.15s",
              }}
            >
              {f.name}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "6px", padding: "4px 8px" }}>
          <button onClick={() => void copy()} style={actionBtnStyle(copied)}>
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
          <button onClick={download} style={actionBtnStyle(false)}>
            ↓ Baixar ZIP
          </button>
        </div>
      </div>
      <ThemeProvider theme={ensure(themes.light)}>
        <SyntaxHighlighter language={active.language} showLineNumbers copyable={false}>
          {active.content}
        </SyntaxHighlighter>
      </ThemeProvider>
    </div>
  );
}
