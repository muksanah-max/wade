(() => {
  if (window.__WADE_PROBE_INJECTED__) return;
  window.__WADE_PROBE_INJECTED__ = true;

  const btn = document.createElement("button");
  btn.textContent = "🔬 Wade 抓取";
  btn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
    padding: 10px 16px; background: #ff2d55; color: #fff;
    border: none; border-radius: 999px; font-size: 13px; font-weight: 600;
    cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
  `;
  document.body.appendChild(btn);

  btn.addEventListener("click", async () => {
    btn.textContent = "抓取中...";
    try {
      const report = collect();
      showModal(report);
      try {
        await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
        btn.textContent = "✓ 已复制";
      } catch {
        btn.textContent = "(剪贴板失败)";
      }
      console.log("=== Wade Probe Report ===", report);
    } catch (e) {
      btn.textContent = "出错";
      console.error("[Wade]", e);
    } finally {
      setTimeout(() => (btn.textContent = "🔬 Wade 抓取"), 2500);
    }
  });

  function collect() {
    return {
      url: location.href,
      host: location.hostname,
      timestamp: new Date().toISOString(),
      page_title: document.title,
      video_elements: probeVideos(),
      subtitles: probeSubtitles(),
      stats_candidates: probeStats(),
      author_candidates: probeAuthor(),
      og_and_meta: probeMeta(),
      structured_data: probeStructured(),
    };
  }

  function probeVideos() {
    return Array.from(document.querySelectorAll("video")).map((v) => ({
      src: v.src || v.currentSrc || v.querySelector("source")?.src || "",
      duration_seconds: v.duration,
      paused: v.paused,
      has_text_tracks: (v.textTracks?.length ?? 0) > 0,
      text_track_count: v.textTracks?.length ?? 0,
    }));
  }

  function probeSubtitles() {
    const result = { found: false, source: null, cues_count: 0, samples: [], note: "" };

    for (const v of document.querySelectorAll("video")) {
      if (!v.textTracks?.length) continue;
      for (const track of v.textTracks) {
        if (track.cues?.length) {
          result.found = true;
          result.source = "video.textTrack";
          result.cues_count = track.cues.length;
          result.lang = track.language;
          result.label = track.label;
          result.samples = Array.from(track.cues)
            .slice(0, 8)
            .map((c) => ({ start: round(c.startTime), end: round(c.endTime), text: c.text }));
          return result;
        }
      }
    }

    // DOM 扫描兜底
    const candidates = document.querySelectorAll(
      '[class*="subtitle"], [class*="caption"], [class*="lyric"], [class*="Subtitle"], [class*="Caption"]',
    );
    if (candidates.length) {
      result.source = "dom-scan";
      result.note = `找到 ${candidates.length} 个疑似字幕容器`;
      result.samples = Array.from(candidates)
        .slice(0, 6)
        .map((el) => ({
          class_name: String(el.className).slice(0, 120),
          text: el.textContent?.trim().slice(0, 200) || "",
        }));
    } else {
      result.note = "未找到字幕轨道或字幕容器";
    }
    return result;
  }

  function probeStats() {
    const probes = {
      likes: ['[data-e2e*="like-count"]', '[data-e2e*="like"]', '[class*="digg"]', '[class*="LikeText"]', '[class*="like-text"]'],
      comments: ['[data-e2e*="comment-count"]', '[data-e2e*="comment"]', '[class*="CommentText"]', '[class*="comment-text"]'],
      shares: ['[data-e2e*="share-count"]', '[data-e2e*="share"]', '[class*="ShareText"]'],
      collects: ['[data-e2e*="collect"]', '[data-e2e*="favorite"]', '[class*="CollectText"]'],
    };
    const out = {};
    for (const [key, sels] of Object.entries(probes)) {
      out[key] = [];
      for (const sel of sels) {
        document.querySelectorAll(sel).forEach((el) => {
          const text = el.textContent?.trim();
          if (!text || text.length > 80) return;
          out[key].push({ selector: sel, text });
        });
        if (out[key].length >= 3) break;
      }
      if (out[key].length === 0) out[key] = null;
    }
    return out;
  }

  function probeAuthor() {
    const sels = [
      '[data-e2e*="user-name"]',
      '[data-e2e*="author"]',
      '[class*="author"]',
      '[class*="Author"]',
      '[class*="nickname"]',
    ];
    const out = [];
    for (const sel of sels) {
      document.querySelectorAll(sel).forEach((el) => {
        const text = el.textContent?.trim();
        if (text && text.length < 60) out.push({ selector: sel, text });
      });
      if (out.length >= 5) break;
    }
    return out;
  }

  function probeMeta() {
    const out = {};
    document
      .querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="keywords"], meta[name="twitter:title"], meta[name="twitter:description"]')
      .forEach((m) => {
        const key = m.getAttribute("property") || m.getAttribute("name");
        out[key] = m.getAttribute("content")?.slice(0, 300);
      });
    return out;
  }

  function probeStructured() {
    const results = [];

    // 抖音网页版的 RENDER_DATA（URL-encoded JSON）
    const rd = document.querySelector("script#RENDER_DATA");
    if (rd) {
      const raw = rd.textContent || "";
      let parsed = null;
      let parseError = null;
      try {
        parsed = JSON.parse(decodeURIComponent(raw));
      } catch (e1) {
        try {
          parsed = JSON.parse(raw);
        } catch (e2) {
          parseError = e2.message;
        }
      }
      results.push({
        source: "RENDER_DATA (douyin)",
        bytes: raw.length,
        parsed_top_keys: parsed ? Object.keys(parsed).slice(0, 20) : null,
        sample_preview: parsed ? truncateObject(parsed, 2) : raw.slice(0, 400),
        parse_error: parseError,
      });
    }

    // TikTok 的全局 hydration data
    const tk = document.querySelector("script#__UNIVERSAL_DATA_FOR_REHYDRATION__");
    if (tk) {
      let parsed = null;
      try { parsed = JSON.parse(tk.textContent || ""); } catch (e) {}
      results.push({
        source: "TIKTOK_UNIVERSAL_DATA",
        bytes: (tk.textContent || "").length,
        parsed_top_keys: parsed ? Object.keys(parsed).slice(0, 20) : null,
        sample_preview: parsed ? truncateObject(parsed, 2) : (tk.textContent || "").slice(0, 400),
      });
    }

    // JSON-LD（部分页面有）
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
      let parsed = null;
      try { parsed = JSON.parse(s.textContent || ""); } catch (e) {}
      if (parsed) results.push({ source: "JSON-LD", data: parsed });
    });

    // SIGI_STATE（TikTok 老版可能有）
    const sigi = document.querySelector("script#SIGI_STATE");
    if (sigi) {
      results.push({ source: "SIGI_STATE", bytes: (sigi.textContent || "").length, sample_preview: (sigi.textContent || "").slice(0, 400) });
    }

    return results;
  }

  // 工具：递归截断对象，避免输出过大
  function truncateObject(obj, depth) {
    if (depth <= 0) return Array.isArray(obj) ? `[Array(${obj.length})]` : typeof obj === "object" && obj ? `{...${Object.keys(obj).length} keys}` : obj;
    if (Array.isArray(obj)) return obj.slice(0, 3).map((x) => truncateObject(x, depth - 1));
    if (obj && typeof obj === "object") {
      const out = {};
      for (const k of Object.keys(obj).slice(0, 15)) out[k] = truncateObject(obj[k], depth - 1);
      return out;
    }
    if (typeof obj === "string") return obj.length > 200 ? obj.slice(0, 200) + "..." : obj;
    return obj;
  }

  function round(n) {
    return Math.round(n * 100) / 100;
  }

  function showModal(report) {
    document.getElementById("wade-probe-modal")?.remove();
    const modal = document.createElement("div");
    modal.id = "wade-probe-modal";
    modal.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: min(720px, 92vw); max-height: 80vh; z-index: 2147483647;
      background: #fff; border-radius: 12px; padding: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.3); overflow: hidden;
      display: flex; flex-direction: column; gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
    `;
    modal.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong style="font-size:14px">Wade 抓取结果（已复制到剪贴板）</strong>
        <button id="wade-probe-close" style="border:none;background:#eee;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:12px">关闭</button>
      </div>
      <pre id="wade-probe-pre" style="margin:0;padding:12px;background:#fafafa;border:1px solid #eee;border-radius:8px;white-space:pre-wrap;word-break:break-all;font-family:'SF Mono',Menlo,monospace;font-size:11px;line-height:1.5;overflow:auto;flex:1"></pre>
    `;
    document.body.appendChild(modal);
    document.getElementById("wade-probe-pre").textContent = JSON.stringify(report, null, 2);
    document.getElementById("wade-probe-close").addEventListener("click", () => modal.remove());
  }
})();
