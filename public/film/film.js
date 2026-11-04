(function(){
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// animations-v3.jsx — continuous-composition animation engine.
//
// THE MODEL: the animation is ONE element tree rendered as a pure function
// of one authored-time axis. Nothing mounts or unmounts at section
// boundaries, so any element can move, morph, or persist across them by
// ordinary interpolation. The scene list (OM_SCENES) is the user-control
// view — names, order, playback durations — and the engine derives the cue
// table from it, so structure has exactly one source and cannot drift.
//
// API INDEX (every export is a window global):
//   <CompositionStage width height scenes={window.OM_SCENES}
//                     playback={window.OM_PLAYBACK} bg>
//     <Piece />   — ONE component, the whole animation
//   </CompositionStage>
//   useComposition() -> {T, CUES, time, duration, authoredTotal, playing}
//     T: authored seconds (warped per-section by user trims/speeds) —
//        key ALL choreography to T, never to wall-clock time
//     CUES: {SectionName: authoredStart} derived from OM_SCENES; an unknown
//        name returns NaN and raises a preview-only badge (never exports);
//        duplicate section names bind to the first occurrence
//   <Shot from={CUES.Build} to={CUES.Close}> — children visible between two
//     authored times (an authored hard cut in one line); children stay
//     mounted (media keeps its readiness) and are hidden outside the window
//   <Captions items={[{at, until?, text}, ...]} /> — ONE caption element,
//     at most one visible at a time, keyed to T; 'until' defaults to the
//     next item's 'at'; a last item with no 'until' stays to the end
//   WATERCOLOR (only when the Watercolor illustration skill is active —
//   otherwise ignore these entries). A painting is a function(p) written
//   against the paint kit, on a width x height sheet; it needs
//   watercolor_kit.js loaded by a <script> tag before this engine, must
//   be a stable function defined once (module scope, never an inline
//   arrow), and every component below renders <img> elements, so it all
//   exports by construction.
//   <WatercolorPainting painting={fn} from={CUES.X} to={CUES.Y} width height
//     seed scale quality style /> — the painting assembled from its own
//     STROKES: each wash / ink line / splatter is a separate layer
//     stacked over the paper, appearing in painting order between two
//     authored times (washes bloom in, ink draws tip to tail). This is the
//     default way to show a watercolor being painted. It keeps the sheet's
//     aspect ratio (size it with style, e.g. {position:'absolute', left,
//     top, width}). scale is the layers' render resolution over width x
//     height (default 1, a deliberate weight-over-dpi trade — raise it
//     toward the zoom factor if the composition zooms into the painting,
//     or toward the devicePixelRatio for a hero-sized sheet); quality is
//     0..1 layer image quality (default 0.92; 1 is the encoder's maximum).
//   useWatercolorLayers(fn, {width, height, seed, scale, quality}) -> L
//     (null if the kit isn't loaded — load watercolor_kit.js before the
//     engine — or if the painting fails to build) — the painting taken apart into strokes, for
//     choreography beyond in-order painting: L.count strokes, L.kind(i)
//     ('wash' | 'gradedWash' | 'glaze' | 'ink' | 'hatch' | 'splatter' |
//     'dryStroke' | 'reserve' | 'caption'), L.span(i) = the stroke's
//     {from, to} share of the painting's 0..1 timeline; call L.warm()
//     once after load so finished strokes pre-render off the critical
//     path (WatercolorPainting does this itself). Compose with:
//   <WatercolorSheet layers={L} style>children</WatercolorSheet> — the
//     paper the strokes sit on (keeps the sheet's aspect ratio), and
//   <WatercolorStroke index={i} at={0..1} style /> — stroke i as its own
//     element, placed where it was painted; at is its painting progress
//     (0 hidden, 1 finished — drive it from T with animate()); style lets
//     you move, scale, rotate, or fade the stroke (transform / opacity).
//     Strokes are paint, so they multiply: overlapping strokes darken
//     where they cross, as in the still image, within a few 8-bit levels
//     (tighter still at quality 1). The sheet clips to its
//     box — for strokes that fly in from outside it, set
//     style={{overflow: 'visible'}} on the WatercolorSheet. 'reserve' strokes
//     are erasures (lifted paper) — keep them where they were painted and
//     reveal them in order after the strokes they erase; moving an erase
//     around has no sensible meaning.
//   <WatercolorReveal painting={fn} from={CUES.X} to={CUES.Y} width height
//     seed steps scale format quality style />, or <WatercolorReveal
//     frames={[src, ...]} from to /> — the whole painting as ONE flat
//     image that paints on (frames pre-baked in the background, so it is
//     the lightest option and the one to zoom or pan over as a single
//     picture). Prefer WatercolorPainting when the strokes themselves
//     should appear one by one or be individually animated. format is
//     the image MIME type (default image/jpeg), quality 0..1 (default
//     0.88). Frames bake at width x height times scale (default: the
//     device pixel ratio, capped at 2) — if the composition zooms INTO
//     the painting, raise scale toward the maximum zoom so frames stay
//     crisp. The kit caps a sheet at ~12M pixels and the components clamp
//     scale to stay under it; exported video sharpness also depends on
//     the export dialog's own resolution choice.
//   Motion: Easing.{linear, easeIn|Out|InOutQuad/Cubic/Quart/Expo/Sine,
//     easeIn|Out|InOutBack, easeOutElastic}, interpolate(input, output, ease),
//     animate({from, to, start, end, ease}) -> fn(T), clamp(v, min, max)
//   Plumbing (rarely needed): Stage, PlaybackBar, TimelineContext,
//     useTime, useTimeline
//   Seek event (host/export transport): 'data-om-seek-to-time-frame',
//     detail {time, sync, playing} — the stage owns it; never implement it
//     yourself
//
// THE AUTHORING CONTRACT — this is what makes the host timeline's trim and
// speed gestures write back into YOUR file, so follow it exactly:
//   1. Declare the scene list as a JSON string literal in a plain inline
//      <script> of the main document (NOT type="text/babel", NOT a sibling
//      .jsx — only vanilla inline scripts are addressable for write-back):
//        <script>window.OM_SCENES = '[{"name":"Opening","dur":3,"desc":"The logo fades in and the title settles"},{"name":"Build","dur":5,"desc":"Bars grow to their final values"}]';</script>
//      Give every entry a "desc": one short plain-words sentence saying
//      what happens in that section. The user reads it in the timeline's
//      section popover — keep it true whenever you edit the section.
//   2. Pass the string through untouched:
//        <CompositionStage scenes={window.OM_SCENES} ...>
//   3. ALSO declare the playback setting the same way:
//        <script>window.OM_PLAYBACK = '{"mode":"loop"}';</script>
//      and pass it through untouched (values: '{"mode":"loop"}' or
//      '{"mode":"times","count":N}'; omitting keeps loop behavior but
//      leaves the host Repeat control read-only for this document).
//   IMPORTANT — the exportable-video contract: CompositionStage/Stage OWNS
//   it (the data-om-exportable-video-with-duration-secs attribute, the
//   data-om-seek-to-time-frame listener, the svg/foreignObject wrapper,
//   and font inlining). NEVER put the exportable attribute on any other
//   element — a second "exportable root" makes the host timeline and the
//   video exporter bind to the wrong element, and playback control /
//   export silently break.
//
// HOW TIME WORKS: each OM_SCENES entry is a named slice of the authored
// timeline. CUES.Name is that section's authored start (the running sum of
// authored lengths, in literal order). useComposition().T is the authored
// clock: when the user trims or speeds a section on the host timeline, the
// engine replays that section's SAME authored slice over the new playback
// length — your choreography retimes, never cuts off. The optional "nat"
// field on an entry is the engine's authored-length anchor — the host
// timeline stamps it on the first retime; don't set it by hand.
//
// CUE-FIRST DISCIPLINE (what makes a piece read as one continuous video):
//   1. Write the OM_SCENES literal FIRST — it is the piece's outline.
//   2. One helper component per section for readability, but ALL of them
//      render ALL the time inside the one tree, keyed to CUES — never
//      conditionally mounted per section.
//   3. Define exactly three motion helpers up front (e.g.
//      MOTION = {enter, draw, pop} wrapping Easing curves) and use no
//      easing or transform outside them; one caption element, one visible
//      at a time (<Captions> has this built in).
//   A shared element that crosses a boundary is just motion whose start
//   and end straddle a cue: animate({from, to, start: CUES.Build - 0.4,
//   end: CUES.Build + 0.6})(T) glides through the boundary, and a user
//   slowing either section slows the glide without breaking it.
//
// RENDER FROM T ONLY: the exporter seeks each frame with a synchronous
// commit and may serialize the stage the moment the seek event returns —
// anything painted from useEffect or your own requestAnimationFrame lags
// that commit and exports stale. Render everything visible from T and this
// is automatic. A seeked frame is a deterministic render at that time.
//
// HARD CUTS are content now, not structure: wrap a shot's elements in
// <Shot from to> (visibility toggles at the cues; children stay mounted so
// images and videos hold their readiness). Shot also doubles as the
// perf gate for heavy far-away beats.
//
// LOOP SEAMS are the one surviving boundary rule: a looping piece shows
// its last authored frame immediately before its first — make them match
// (settle your choreography by authoredTotal, open it at 0).
//
// DIAGNOSTICS: choreography that references an unknown section name (a
// rename or deletion in OM_SCENES) shows a badge below the stage in the
// preview, outside the exportable svg — visible in preview screenshots,
// never in the exported video. An OM_SCENES section with no choreography
// keyed to it is a valid empty beat, not an error.
/* END USAGE */

// ─────────────────────────────────────────────────────────────────────────────

// ── Easing functions (hand-rolled, Popmotion-style) ─────────────────────────
// All easings take t ∈ [0,1] and return eased t ∈ [0,1] (may overshoot for back/elastic).
const Easing = {
  linear: t => t,
  // Quad
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  // Cubic
  easeInCubic: t => t * t * t,
  easeOutCubic: t => --t * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  // Quart
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - --t * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  // Expo
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeInOutExpo: t => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return 0.5 * Math.pow(2, 20 * t - 10);
    return 1 - 0.5 * Math.pow(2, -20 * t + 10);
  },
  // Sine
  easeInSine: t => 1 - Math.cos(t * Math.PI / 2),
  easeOutSine: t => Math.sin(t * Math.PI / 2),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  // Back (overshoot)
  easeOutBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInBack: t => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeInOutBack: t => {
    const c1 = 1.70158,
      c2 = c1 * 1.525;
    return t < 0.5 ? Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  // Elastic
  easeOutElastic: t => {
    const c4 = 2 * Math.PI / 3;
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

// ── Core interpolation helpers ──────────────────────────────────────────────

// Clamp a value to [min, max]
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// interpolate([0, 0.5, 1], [0, 100, 50], ease?) -> fn(t)
// Popmotion-style: linearly maps t across input keyframes to output values,
// with optional easing per segment (single fn or array of fns).
function interpolate(input, output, ease = Easing.linear) {
  return t => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        const easeFn = Array.isArray(ease) ? ease[i] || Easing.linear : ease;
        const eased = easeFn(local);
        return output[i] + (output[i + 1] - output[i]) * eased;
      }
    }
    return output[output.length - 1];
  };
}

// animate({from, to, start, end, ease})(t) — simpler single-segment tween.
// Returns `from` before `start`, `to` after `end`.
function animate({
  from = 0,
  to = 1,
  start = 0,
  end = 1,
  ease = Easing.easeInOutCubic
}) {
  return t => {
    if (t <= start) return from;
    if (t >= end) return to;
    const local = (t - start) / (end - start);
    return from + (to - from) * ease(local);
  };
}

// ── Timeline context ────────────────────────────────────────────────────────

const TimelineContext = React.createContext({
  time: 0,
  duration: 10,
  playing: false
});
const useTime = () => React.useContext(TimelineContext).time;
const useTimeline = () => React.useContext(TimelineContext);

// How long a marked (detail.playing === true) host seek keeps the
// external-playback latch alive with no successor. The host play bar's
// seek pump is one-in-flight/latest-wins, so its inter-seek gap is tens
// of milliseconds in the worst case — 400ms is far above that, so a
// marked stream that dies mid-play decays the latch promptly.
var SS_EXT_PLAY_MS = 400;

// ── Font inlining ───────────────────────────────────────────────────────────
// Copy every @font-face rule from the page into a <style> inside the svg's
// foreignObject, with font URLs rewritten to data: URLs. Makes the svg
// self-describing so serializing it alone (video export fast path) still
// renders with the right fonts. Sets data-om-fonts-inlined on the svg when
// done so the exporter can wait for it.

function useInlineFontsInto(svgRef) {
  React.useEffect(() => {
    const svg = svgRef.current;
    const host = svg && svg.querySelector('foreignObject > div');
    if (!svg || !host) return;
    let cancelled = false;
    (async () => {
      const rules = [];
      for (const ss of document.styleSheets) {
        let cssRules;
        try {
          cssRules = ss.cssRules;
        } catch {
          // Cross-origin sheet without crossorigin attr (e.g. the standard
          // fonts.googleapis.com <link>) — fetch the CSS text directly and
          // regex-extract the @font-face blocks.
          if (ss.href) {
            try {
              const txt = await fetch(ss.href).then(r => {
                if (!r.ok) throw 0;
                return r.text();
              });
              for (const ff of txt.match(/@font-face\s*{[^}]*}/g) || []) rules.push({
                css: ff,
                base: ss.href
              });
            } catch {}
          }
          continue;
        }
        if (!cssRules) continue;
        for (const r of cssRules) {
          if (r.type === CSSRule.FONT_FACE_RULE) {
            rules.push({
              css: r.cssText,
              base: ss.href || location.href
            });
          }
        }
      }
      const toDataURL = url => fetch(url).then(r => {
        if (!r.ok) throw 0;
        return r.blob();
      }).then(b => new Promise(res => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => res(url);
        fr.readAsDataURL(b);
      })).catch(() => url);
      const parts = await Promise.all(rules.map(async ({
        css,
        base
      }) => {
        const re = /url\((['"]?)([^'")]+)\1\)/g;
        let out = css,
          m;
        while (m = re.exec(css)) {
          const u = m[2];
          if (u.startsWith('data:')) continue;
          let abs;
          try {
            abs = new URL(u, base).href;
          } catch {
            continue;
          }
          out = out.split(m[0]).join(`url("${await toDataURL(abs)}")`);
        }
        return out;
      }));
      if (cancelled || !parts.length) {
        svg.setAttribute('data-om-fonts-inlined', 'true');
        return;
      }
      const style = document.createElement('style');
      style.textContent = parts.join('\n');
      host.insertBefore(style, host.firstChild);
      svg.setAttribute('data-om-fonts-inlined', 'true');
    })();
    return () => {
      cancelled = true;
    };
  }, []);
}
function Stage({
  width = 1280,
  height = 720,
  duration = 10,
  background = '#f6f4ef',
  fps = 60,
  loop = true,
  autoplay = true,
  // Parsed playback object ({mode:'loop'} | {mode:'times',count:N}) or
  // null. When present it overrides the legacy loop prop — CompositionStage
  // passes the validated value from the OM_PLAYBACK authoring contract.
  playback = null,
  persistKey = 'animstage-v3',
  children
}) {
  // Props arrive as strings when Stage is mounted via <x-import> (DC
  // projects) — coerce so style={{width}} gets a number React can px-ify.
  width = +width || 1280;
  height = +height || 720;
  duration = +duration || 10;
  fps = +fps || 60;
  if (typeof loop === 'string') loop = loop !== 'false';
  if (typeof autoplay === 'string') autoplay = autoplay !== 'false';
  const playTimes = playback && playback.mode === 'times' ? playback.count : null;
  const loopEff = playback ? playback.mode === 'loop' : loop;
  const [time, setTime] = React.useState(() => {
    try {
      const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0');
      return isFinite(v) ? clamp(v, 0, duration) : 0;
    } catch {
      return 0;
    }
  });
  const [playing, setPlaying] = React.useState(autoplay);
  // The external-playback latch: true while the HOST play bar is driving
  // time forward as genuine continuous playback (its play-loop seeks
  // carry detail.playing === true). The engine's own clock stays paused
  // the whole time — exactly one clock ever drives — so this is a
  // separate bit, not a second meaning for `playing`. Set and cleared
  // in the seek handler below; decays via SS_EXT_PLAY_MS when the
  // marked stream stops without a parting unmarked seek.
  const [extPlay, setExtPlay] = React.useState(false);
  const extPlayTimerRef = React.useRef(null);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const stageRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastTsRef = React.useRef(null);

  // Persist playhead
  React.useEffect(() => {
    try {
      localStorage.setItem(persistKey + ':t', String(time));
    } catch {}
  }, [time, persistKey]);

  // Auto-scale to fit viewport
  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 44; // playback bar height
      const s = Math.min(el.clientWidth / width, (el.clientHeight - barH) / height);
      setScale(Math.max(0.05, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [width, height]);

  // Passes completed since playback last started. Lives in a ref so the
  // per-frame wrap can count without re-running this effect; reset on
  // every (re)start so a fresh play (or a host restart) gets the full
  // run count again.
  const passesRef = React.useRef(0);

  // Animation loop
  React.useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      return;
    }
    passesRef.current = 0;
    const step = ts => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        let next = t + dt;
        if (next >= duration) {
          if (playTimes !== null) {
            // Play N times then hold the last frame — the partial pass a
            // mid-timeline start produces counts as a pass, so the piece
            // never runs longer than N full durations.
            passesRef.current += 1;
            if (passesRef.current >= playTimes) {
              next = duration;
              setPlaying(false);
            } else {
              next = next % duration;
            }
          } else if (loopEff) {
            next = next % duration;
          } else {
            next = duration;
            setPlaying(false);
          }
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [playing, duration, loopEff, playTimes]);

  // Keyboard: space = play/pause, ← → = seek
  React.useEffect(() => {
    const onKey = e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.code === 'ArrowRight') {
        setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      } else if (e.key === '0' || e.code === 'Home') {
        setTime(0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  // Video-export protocol + the editor's play bar: hosts dispatch this
  // event per frame; pause + sync the playhead so the frame shows exactly
  // that timestamp. The host play bar marks its play-loop seeks with
  // detail.playing === true — the mark latches extPlay (playback is
  // playback even when a host clock drives it), while ANY unmarked seek
  // (scrub, step, export frame, the transport's pause park) clears the
  // latch in the same commit it retimes, so a seeked frame still renders
  // exactly one scene's state. The engine's own clock pauses either way.
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    // Sync-seek capability: a dispatcher that marks its seek with
    // detail.sync === true gets the commit applied via ReactDOM.flushSync,
    // so the stage DOM reflects the seeked frame the moment dispatchEvent
    // returns. The video exporter keys off the data-om-sync-seek
    // advertisement to drop its two-display-refresh settle (that wait only
    // exists to let React's async commit land — serialization needs the
    // committed DOM, not the paint). Feature-detected: a runtime without
    // ReactDOM.flushSync never advertises and every seek takes the async
    // path. Unmarked seeks (scrubs, the host play bar) stay async — a
    // forced sync render per pointermove would tax the editor for no one.
    const canSyncSeek = typeof ReactDOM !== 'undefined' && typeof ReactDOM.flushSync === 'function';
    const onSeek = e => {
      const apply = () => {
        setPlaying(false);
        const hostPlay = !!(e.detail && e.detail.playing === true);
        if (extPlayTimerRef.current) {
          clearTimeout(extPlayTimerRef.current);
          extPlayTimerRef.current = null;
        }
        if (hostPlay) {
          // Watchdog: the latch is only as alive as its seek stream. If the
          // host stops without a parting seek (tab jank, bar unmount), the
          // latch decays on its own rather than stranding extPlaying true.
          extPlayTimerRef.current = setTimeout(() => {
            extPlayTimerRef.current = null;
            setExtPlay(false);
          }, SS_EXT_PLAY_MS);
        }
        setExtPlay(hostPlay);
        setTime(clamp(e.detail.time, 0, duration));
      };
      // flushSync is safe here: a native DOM listener runs outside React's
      // lifecycle, and the exporter's dispatchEvent is synchronous, so the
      // commit lands in the same JS task — the engine's own rAF loop can
      // never interleave between seek and serialize.
      if (canSyncSeek && e.detail && e.detail.sync === true) {
        ReactDOM.flushSync(apply);
      } else {
        apply();
      }
    };
    el.addEventListener('data-om-seek-to-time-frame', onSeek);
    if (canSyncSeek) el.setAttribute('data-om-sync-seek', 'true');
    return () => {
      el.removeEventListener('data-om-seek-to-time-frame', onSeek);
      el.removeAttribute('data-om-sync-seek');
      if (extPlayTimerRef.current) {
        clearTimeout(extPlayTimerRef.current);
        extPlayTimerRef.current = null;
      }
      // Drop the latch too: this cleanup runs on every duration change
      // (an agent edit can retime mid-host-play, no gesture involved) and
      // the new effect instance arms no watchdog — clearing only the
      // timer could strand extPlay true forever if the marked stream died
      // in the gap. Fail toward cut: the next marked seek re-latches.
      setExtPlay(false);
    };
  }, [duration]);

  // Inline @font-face rules into the svg's foreignObject so the svg is
  // self-describing — serializing it alone (for video export) then renders
  // with the right fonts. Sets data-om-fonts-inlined once done.
  useInlineFontsInto(canvasRef);
  const displayTime = hoverTime != null ? hoverTime : time;
  const ctxValue = React.useMemo(
  // extPlaying is ADDITIVE: "time is advancing under an external
  // driver's continuous playback". `playing` keeps meaning the
  // engine's OWN clock — the hidden PlaybackBar glyph (and through it
  // the host's clock-reporter/adoption channel) reads that — and
  // CompositionClock is the one consumer that widens to either.
  () => ({
    time: displayTime,
    duration,
    playing,
    extPlaying: extPlay,
    setTime,
    setPlaying
  }), [displayTime, duration, playing, extPlay]);
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      ref: stageRef,
      "data-om-starter": "animations-v3",
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#0a0a0a',
        fontFamily: 'Inter, system-ui, sans-serif'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0
      }
    }, /*#__PURE__*/React.createElement("svg", {
      ref: canvasRef,
      width: width,
      height: height,
      "data-om-exportable-video-with-duration-secs": duration,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        flexShrink: 0,
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("foreignObject", {
      x: "0",
      y: "0",
      width: "100%",
      height: "100%"
    }, /*#__PURE__*/React.createElement("div", {
      xmlns: "http://www.w3.org/1999/xhtml",
      style: {
        width,
        height,
        background,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement(TimelineContext.Provider, {
      value: ctxValue
    }, children))))), /*#__PURE__*/React.createElement(PlaybackBar, {
      time: displayTime,
      actualTime: time,
      duration: duration,
      playing: playing,
      onPlayPause: () => setPlaying(p => !p),
      onReset: () => {
        setTime(0);
      },
      onSeek: t => setTime(t),
      onHover: t => setHoverTime(t)
    }))
  );
}

// ── Playback bar ────────────────────────────────────────────────────────────
// Play/pause, return-to-begin, scrub track, time display.
// Uses fixed-width time fields so layout doesn't thrash.

function PlaybackBar({
  time,
  duration,
  playing,
  onPlayPause,
  onReset,
  onSeek,
  onHover
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const timeFromEvent = React.useCallback(e => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    return x * duration;
  }, [duration]);
  const onTrackMove = e => {
    if (!trackRef.current) return;
    const t = timeFromEvent(e);
    if (dragging) {
      onSeek(t);
    } else {
      onHover(t);
    }
  };
  const onTrackLeave = () => {
    if (!dragging) onHover(null);
  };
  const onTrackDown = e => {
    setDragging(true);
    const t = timeFromEvent(e);
    onSeek(t);
    onHover(null);
  };
  React.useEffect(() => {
    if (!dragging) return;
    const onUp = () => setDragging(false);
    const onMove = e => {
      if (!trackRef.current) return;
      const t = timeFromEvent(e);
      onSeek(t);
    };
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [dragging, timeFromEvent, onSeek]);
  const pct = duration > 0 ? time / duration * 100 : 0;
  const fmt = t => {
    const total = Math.max(0, t);
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const cs = Math.floor(total * 100 % 100);
    return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };
  const mono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace';
  return /*#__PURE__*/React.createElement("div", {
    "data-omelette-chrome": true,
    style: {
      // Slimmed to visually match the host editor bar's basic row (the
      // single-scrubber look): transport first, tighter metrics, quieter
      // chrome. Shown only outside the app — the host bar suppresses this
      // whenever it is present.
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 12px',
      background: 'rgba(20,20,20,0.92)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      width: '100%',
      maxWidth: 680,
      alignSelf: 'center',
      borderRadius: 6,
      color: '#f6f4ef',
      fontFamily: 'Inter, system-ui, sans-serif',
      userSelect: 'none',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    onClick: onPlayPause,
    title: "Play/pause (space)"
  }, playing ? /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "2",
    width: "3",
    height: "10",
    fill: "currentColor"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2l9 5-9 5V2z",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement(IconButton, {
    onClick: onReset,
    title: "Return to start (0)"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2v10M12 2L5 7l7 5V2z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'right',
      color: '#f6f4ef'
    }
  }, fmt(time)), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onMouseMove: onTrackMove,
    onMouseLeave: onTrackLeave,
    onMouseDown: onTrackDown,
    style: {
      flex: 1,
      height: 22,
      position: 'relative',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 4,
      background: 'rgba(255,255,255,0.12)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      width: `${pct}%`,
      height: 4,
      background: 'oklch(72% 0.12 250)',
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: `${pct}%`,
      top: '50%',
      width: 12,
      height: 12,
      marginLeft: -6,
      marginTop: -6,
      background: '#fff',
      borderRadius: 6,
      boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: mono,
      fontSize: 12,
      fontVariantNumeric: 'tabular-nums',
      width: 64,
      textAlign: 'left',
      color: 'rgba(246,244,239,0.55)'
    }
  }, fmt(duration)), typeof VideoEncoder !== 'undefined' && /*#__PURE__*/React.createElement(IconButton, {
    title: "Export video",
    onClick: () => window.parent.postMessage({
      type: 'omelette:request-video-export'
    }, '*')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 2v7m0 0L4 6m3 3l3-3M2 12h10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))));
}
function IconButton({
  children,
  onClick,
  title
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    title: title,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 24,
      height: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 5,
      color: '#f6f4ef',
      cursor: 'pointer',
      padding: 0,
      transition: 'background 120ms'
    }
  }, children);
}

// ── Scene-list plumbing ──────────────────────────────────────────────────
// Guest-side validation of a scene list (the engine's own inputs: the
// authored prop, and host-dispatched updates). Mirrors the host parser's
// shape rules and constants — keep in sync with parseTimelineScenes in
// apps/web/src/shared/timeline.ts (16KB raw cap, 50 entries, dur finite in
// (0, 300]); returns null on any violation.
function ssParse(raw) {
  if (typeof raw !== 'string' || !raw || raw.length > 16 * 1024) return null;
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 50) return null;
  for (var i = 0; i < parsed.length; i++) {
    var s = parsed[i];
    if (typeof s !== 'object' || s === null) return null;
    if (typeof s.name !== 'string' || typeof s.dur !== 'number') return null;
    if (!isFinite(s.dur) || s.dur <= 0 || s.dur > 300) return null;
  }
  return parsed;
}

// Guest-side validation of the playback value — mirrors the host parser
// (shared/timeline.ts parseTimelinePlayback): {"mode":"loop"} or
// {"mode":"times","count":1..99}, strict all-or-nothing, null otherwise.
// Callers treat null as the loop default.
function ppParse(raw) {
  if (typeof raw !== 'string' || !raw || raw.length > 256) return null;
  var parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
  var keys = Object.keys(parsed);
  if (parsed.mode === 'loop') return keys.length === 1 ? {
    mode: 'loop'
  } : null;
  if (parsed.mode === 'times') {
    if (keys.length !== 2) return null;
    var c = parsed.count;
    if (typeof c !== 'number' || c !== Math.floor(c) || c < 1 || c > 99) return null;
    return {
      mode: 'times',
      count: c
    };
  }
  return null;
}

// Stamps the playback attribute VERBATIM from the authored raw string (the
// host's write-back anchors on that exact value) and listens for the
// host's post-write update event. Same shape as SceneSync; only rendered
// when the document authors a playback literal — an absent contract means
// the attribute stays absent and the document plays its default.
function PlaybackSync(props) {
  var ref = React.useRef(null);
  var raw = props.raw;
  var onUpdate = props.onUpdate;
  React.useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var root = el.closest('[data-om-exportable-video-with-duration-secs]');
    if (!root) return;
    root.setAttribute('data-om-timeline-playback', raw);
    var onEvent = function (e) {
      var next = e && e.detail;
      if (ppParse(next)) onUpdate(next);
    };
    root.addEventListener('data-om-timeline-playback-update', onEvent);
    return function () {
      root.removeEventListener('data-om-timeline-playback-update', onEvent);
      root.removeAttribute('data-om-timeline-playback');
    };
  }, [raw, onUpdate]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'none'
    }
  });
}

// Renders inside the Stage (so it can reach the exportable root via
// closest()): stamps the scenes attribute VERBATIM from the current raw
// string — the host's write-back anchors on that exact value — and listens
// for the host's post-write update event.
function SceneSync(props) {
  var ref = React.useRef(null);
  var raw = props.raw;
  var onUpdate = props.onUpdate;
  React.useEffect(function () {
    var el = ref.current;
    if (!el) return;
    var root = el.closest('[data-om-exportable-video-with-duration-secs]');
    if (!root) return;
    root.setAttribute('data-om-timeline-scenes', raw);
    var onEvent = function (e) {
      var next = e && e.detail;
      // Ignore anything that doesn't validate — a bad update must not tear
      // down a working composition.
      if (ssParse(next)) onUpdate(next);
    };
    root.addEventListener('data-om-timeline-scenes-update', onEvent);
    return function () {
      root.removeEventListener('data-om-timeline-scenes-update', onEvent);
      root.removeAttribute('data-om-timeline-scenes');
    };
  }, [raw, onUpdate]);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'none'
    }
  });
}

// ── Continuous composition ──────────────────────────────────────────────

var CompositionContext = React.createContext(null);
function useComposition() {
  var ctx = React.useContext(CompositionContext);
  if (!ctx) throw new Error('useComposition() must be called inside <CompositionStage>');
  return ctx;
}
function ccDerive(scenes) {
  var playStart = 0;
  var authStart = 0;
  var sections = [];
  var table = Object.create(null);
  for (var i = 0; i < scenes.length; i++) {
    var s = scenes[i];
    var nat = typeof s.nat === 'number' && isFinite(s.nat) && s.nat > 0 ? s.nat : s.dur;
    sections.push({
      name: s.name,
      playStart: playStart,
      dur: s.dur,
      authStart: authStart,
      nat: nat
    });
    if (!Object.prototype.hasOwnProperty.call(table, s.name)) {
      table[s.name] = Math.round(authStart * 1000) / 1000;
    }
    playStart += s.dur;
    authStart += nat;
  }
  return {
    sections: sections,
    table: table,
    total: Math.round(playStart * 1000) / 1000,
    authoredTotal: Math.round(authStart * 1000) / 1000
  };
}
function ccWarp(d, t) {
  var ss = d.sections;
  if (ss.length === 0) return 0;
  var idx = ss.length - 1;
  for (var i = 0; i < ss.length; i++) {
    if (t < ss[i].playStart + ss[i].dur) {
      idx = i;
      break;
    }
  }
  var s = ss[idx];
  var local = Math.min(Math.max(t - s.playStart, 0), s.dur);
  var T = s.authStart + (s.dur > 0 ? local * (s.nat / s.dur) : 0);
  return Math.min(T, d.authoredTotal);
}
var CC_META = Object.assign(Object.create(null), {
  toString: 1,
  toLocaleString: 1,
  valueOf: 1,
  toJSON: 1,
  then: 1,
  constructor: 1,
  hasOwnProperty: 1,
  isPrototypeOf: 1,
  propertyIsEnumerable: 1,
  default: 1
});
function ccCueProxy(table, unknownRef) {
  if (typeof Proxy !== 'function') return table;
  return new Proxy(table, {
    get: function (target, prop) {
      if (typeof prop !== 'string' || prop in target) return target[prop];
      if (CC_META[prop] || prop.indexOf('@@') === 0) return Object.prototype[prop];
      unknownRef.current[prop] = true;
      return NaN;
    }
  });
}
function CcUnknownWatch(props) {
  var tl = useTimeline();
  React.useEffect(function () {
    var next = Object.keys(props.unknownRef.current).sort().join(', ');
    if (next !== props.badge) props.setBadge(next);
  }, [tl.time]);
  return null;
}
function CompositionClock(props) {
  var tl = useTimeline();
  var d = props.derived;
  var T = ccWarp(d, tl.time);
  var value = React.useMemo(function () {
    return {
      T: T,
      CUES: props.cues,
      time: tl.time,
      duration: tl.duration,
      authoredTotal: d.authoredTotal,
      playing: tl.playing || tl.extPlaying === true
    };
  }, [T, props.cues, tl.time, tl.duration, d, tl.playing, tl.extPlaying]);
  return /*#__PURE__*/React.createElement(CompositionContext.Provider, {
    value: value
  }, props.children);
}
function Shot(props) {
  var c = useComposition();
  var from = +props.from;
  var to = props.to == null ? Infinity : +props.to;
  var on = isFinite(from) && c.T >= from && c.T < to;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      visibility: on ? 'visible' : 'hidden'
    }
  }, props.children);
}
var CAPTION_FADE = 0.18;
function Captions(props) {
  var c = useComposition();
  var t = c.T;
  var items = (props.items || []).filter(function (it) {
    return it && isFinite(+it.at);
  }).sort(function (a, b) {
    return a.at - b.at;
  });
  var active = null;
  var end = Infinity;
  for (var i = 0; i < items.length; i++) {
    if (t < items[i].at) break;
    active = items[i];
    end = typeof active.until === 'number' && isFinite(active.until) ? active.until : i + 1 < items.length ? items[i + 1].at : Infinity;
  }
  if (!active || t >= end) return null;
  var o = Math.min(1, (t - active.at) / CAPTION_FADE);
  if (isFinite(end)) o = Math.min(o, (end - t) / CAPTION_FADE);
  o = Math.max(0, Math.min(1, o));
  return /*#__PURE__*/React.createElement("div", {
    "data-om-caption": true,
    style: Object.assign({
      position: 'absolute',
      left: '8%',
      right: '8%',
      bottom: '7%',
      textAlign: 'center',
      opacity: o,
      pointerEvents: 'none',
      font: '500 30px Inter, system-ui, sans-serif',
      color: '#f6f4ef',
      textShadow: '0 1px 14px rgba(0,0,0,0.45)'
    }, props.style)
  }, active.text);
}
function CompositionStage(props) {
  var width = +props.width || 1280;
  var height = +props.height || 720;
  var bg = props.bg || '#0b0b0e';
  var autoplay = props.autoplay == null ? true : String(props.autoplay) !== 'false';
  var loop = props.loop == null ? true : String(props.loop) !== 'false';
  var state = React.useState(props.scenes);
  var raw = state[0];
  var setRaw = state[1];
  var scenes = React.useMemo(function () {
    return ssParse(raw);
  }, [raw]);
  var pstate = React.useState(props.playback);
  var praw = pstate[0];
  var setPraw = pstate[1];
  var pb = React.useMemo(function () {
    return ppParse(praw);
  }, [praw]);
  var unknownRef = React.useRef({});
  var badgeState = React.useState('');
  var badge = badgeState[0];
  var setBadge = badgeState[1];
  var derived = React.useMemo(function () {
    unknownRef.current = {};
    return scenes ? ccDerive(scenes) : null;
  }, [scenes]);
  var cues = React.useMemo(function () {
    return derived ? ccCueProxy(derived.table, unknownRef) : null;
  }, [derived]);
  React.useEffect(function () {
    var next = Object.keys(unknownRef.current).sort().join(', ');
    if (next !== badge) setBadge(next);
  });
  if (!scenes) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0e',
        color: '#c96442',
        font: '500 16px Inter, system-ui, sans-serif',
        textAlign: 'center'
      }
    }, "animations-v3: the scenes prop isn't a valid JSON scene list", /*#__PURE__*/React.createElement("br", null), "(expected '[", '{', "\"name\":\"\u2026\",\"dur\":N", '}', ", \u2026]')");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Stage, {
    width: width,
    height: height,
    duration: derived.total,
    background: bg,
    autoplay: autoplay,
    loop: loop,
    playback: pb
  }, /*#__PURE__*/React.createElement(SceneSync, {
    raw: raw,
    onUpdate: setRaw
  }), typeof praw === 'string' && praw !== '' && /*#__PURE__*/React.createElement(PlaybackSync, {
    raw: praw,
    onUpdate: setPraw
  }), /*#__PURE__*/React.createElement(CompositionClock, {
    derived: derived,
    cues: cues
  }, props.children), /*#__PURE__*/React.createElement(CcUnknownWatch, {
    unknownRef: unknownRef,
    badge: badge,
    setBadge: setBadge
  })), badge !== '' &&
  /*#__PURE__*/
  // Sibling of Stage, outside the exportable <svg>: visible in the
  // preview (and its screenshots), never in the exported video.
  React.createElement("div", {
    "data-om-unknown-cues": true,
    style: {
      position: 'absolute',
      left: 12,
      bottom: 56,
      zIndex: 10,
      padding: '6px 10px',
      borderRadius: 6,
      background: 'rgba(0,0,0,0.72)',
      color: '#e8906a',
      font: '500 12px Inter, system-ui, sans-serif',
      pointerEvents: 'none'
    }
  }, "choreography references unknown section", badge.indexOf(',') >= 0 ? 's' : '', ": ", badge));
}

// Strokes as layers: paint multiplies, so stroke images stacked with
// mix-blend-mode:multiply over the paper reproduce the flat render.

var WC_PIXEL_CAP = 11000000;
function wcLayerOpts(props) {
  var w = +props.width || 900,
    h = +props.height || 1200;
  var askScale = +props.scale || 1;
  return {
    width: w,
    height: h,
    scale: Math.min(askScale, Math.sqrt(WC_PIXEL_CAP / (w * h))),
    seed: props.seed == null ? undefined : +props.seed,
    quality: props.quality == null ? undefined : +props.quality
  };
}
var wcWarned = {};
function wcWarnOnce(key, message, err) {
  if (wcWarned[key]) return;
  wcWarned[key] = true;
  console.warn(message, err);
}
function useWatercolorLayers(painting, opts) {
  var kit = window.WatercolorKit;
  if (typeof painting !== 'function' || !kit || typeof kit.layers !== 'function') return null;
  try {
    return kit.layers(painting, wcLayerOpts(opts || {}));
  } catch (e) {
    wcWarnOnce('layers:' + e, 'watercolor painting failed to build; rendering the fallback sheet', e);
    return null;
  }
}
var WatercolorSheetContext = React.createContext(null);
function WatercolorSheet(props) {
  var L = props.layers || null;
  var style = Object.assign({
    position: 'relative',
    display: 'block',
    width: '100%',
    aspectRatio: L ? L.width + ' / ' + L.height : '3 / 4',
    isolation: 'isolate',
    overflow: 'hidden'
  }, props.style);
  if (!L) {
    return /*#__PURE__*/React.createElement("div", {
      style: Object.assign(style, {
        background: '#f4f1e8',
        color: '#8a8270',
        font: '12px system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      })
    }, "watercolor-kit.js not loaded (or the painting failed to build)");
  }
  return /*#__PURE__*/React.createElement(WatercolorSheetContext.Provider, {
    value: L
  }, /*#__PURE__*/React.createElement("div", {
    style: style,
    "data-om-watercolor-sheet": true
  }, /*#__PURE__*/React.createElement("img", {
    src: L.paper,
    alt: props.alt || '',
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      display: 'block'
    }
  }), props.children));
}
function WatercolorStroke(props) {
  var fromSheet = React.useContext(WatercolorSheetContext);
  var L = props.layers || fromSheet;
  if (!L) return null;
  var i = +props.index;
  if (!(i >= 0) || i >= L.count) return null;
  var at = props.at == null ? 1 : clamp(+props.at, 0, 1);
  if (!(at > 0)) return null;
  var box, src;
  try {
    box = L.box(i);
    src = box ? L.src(i, at) : null;
  } catch (e) {
    wcWarnOnce('stroke:' + i + ':' + e, 'watercolor stroke ' + i + ' failed to render; skipping it', e);
    return null;
  }
  if (!box || !src) return null;
  var style = Object.assign({
    position: 'absolute',
    display: 'block',
    left: box.x * 100 + '%',
    top: box.y * 100 + '%',
    width: box.w * 100 + '%',
    height: box.h * 100 + '%',
    mixBlendMode: L.kind(i) === 'reserve' ? 'normal' : 'multiply',
    pointerEvents: 'none'
  }, props.style);
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    "data-om-watercolor-stroke": i,
    "data-om-stroke-kind": L.kind(i),
    style: style
  });
}

// The default watercolor moment: the painting assembled from its strokes,
// each appearing in painting order (a pure function of T).
function WatercolorPainting(props) {
  var c = useComposition();
  var from = +props.from || 0;
  var to = props.to == null ? from + 6 : +props.to;
  var u = clamp((c.T - from) / Math.max(to - from, 0.001), 0, 1);
  var eased = Easing.easeInOutQuad(u);
  var L = useWatercolorLayers(props.painting, props);
  var tick = React.useState(0)[1];
  var warmed = React.useRef(null);
  React.useEffect(function () {
    if (!L || typeof L.warm !== 'function') return;
    var p = L.warm();
    if (warmed.current === p) return;
    var live = true;
    p.then(function () {
      warmed.current = p;
      if (live) tick(function (x) {
        return x + 1;
      });
    });
    return function () {
      live = false;
    };
  }, [L && L.paper, props.painting]);
  var strokes = [];
  if (L) {
    for (var i = 0; i < L.count; i++) {
      var sp = L.span(i);
      var at = clamp((eased - sp.from) / Math.max(sp.to - sp.from, 1e-6), 0, 1);
      if (at <= 0) break;
      strokes.push( /*#__PURE__*/React.createElement(WatercolorStroke, {
        key: i,
        layers: L,
        index: i,
        at: at
      }));
    }
  }
  return /*#__PURE__*/React.createElement(WatercolorSheet, {
    layers: L,
    style: props.style,
    alt: props.alt
  }, strokes);
}

// Paint-on watercolor reveal as a pure function of T — an <img> with a data:
// URL (the exporter serializes those as-is; a live canvas would export blank).
function WatercolorReveal(props) {
  var c = useComposition();
  var from = +props.from || 0;
  var to = props.to == null ? from + 6 : +props.to;
  var u = clamp((c.T - from) / Math.max(to - from, 0.001), 0, 1);
  var style = Object.assign({
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  }, props.style);
  var frames = Array.isArray(props.frames) && props.frames.length ? props.frames : null;
  var steps = frames ? frames.length - 1 : Math.max(1, Math.round(+props.steps || 36));
  var i = Math.min(steps, Math.round(Easing.easeInOutQuad(u) * steps));
  var painting = typeof props.painting === 'function' ? props.painting : null;
  var kit = window.WatercolorKit;
  var w = +props.width || 900,
    h = +props.height || 1200;
  var askScale = +props.scale || Math.min(2, window.devicePixelRatio || 1);
  var opts = {
    width: w,
    height: h,
    scale: Math.min(askScale, Math.sqrt(11000000 / (w * h))),
    seed: props.seed == null ? undefined : +props.seed,
    steps: steps,
    type: props.format || 'image/jpeg',
    quality: props.quality == null ? 0.88 : +props.quality
  };
  var key = opts.width + 'x' + opts.height + '#' + opts.seed + '@' + opts.scale + '/' + steps + ':' + opts.type + '/' + opts.quality;
  var cache = React.useRef({
    fn: null,
    key: '',
    frames: {},
    baking: false
  }).current;
  var tick = React.useState(0)[1];
  if (cache.fn !== painting && String(cache.fn) !== String(painting) || cache.key !== key) {
    cache.key = key;
    cache.frames = {};
    cache.baking = false;
  }
  cache.fn = painting;
  React.useEffect(function () {
    if (frames || cache.baking || !painting || !kit || typeof kit.bake !== 'function') return;
    cache.baking = true;
    var target = cache.frames;
    try {
      kit.bake(painting, opts, function (n, _t, url) {
        target[n] = url;
      }).then(function (all) {
        if (cache.frames !== target) return;
        for (var n = 0; n < all.length; n++) target[n] = all[n];
        tick(function (x) {
          return x + 1;
        });
      }).catch(function () {
        /* failed bake: the guarded lazy path below still renders */
      });
    } catch (e) {
      /* oversized painting: the guarded lazy path below still renders */
    }
  });
  if (frames) return /*#__PURE__*/React.createElement("img", {
    src: frames[i],
    alt: props.alt || '',
    style: style
  });
  if (!kit || !painting) {
    return /*#__PURE__*/React.createElement("div", {
      style: Object.assign({
        width: '100%',
        height: '100%',
        background: '#f4f1e8',
        color: '#8a8270',
        font: '12px system-ui, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }, props.style)
    }, "watercolor-kit.js not loaded (or no painting function)");
  }
  if (!cache.frames[i]) {
    try {
      cache.frames[i] = kit.frame(painting, Object.assign({}, opts, {
        at: i / steps
      }));
    } catch (e) {
      return /*#__PURE__*/React.createElement("div", {
        style: Object.assign({
          width: '100%',
          height: '100%',
          background: '#f4f1e8',
          color: '#8a8270',
          font: '12px system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }, props.style)
      }, "painting too large to render (", String(e && e.message).slice(0, 80), ")");
    }
  }
  return /*#__PURE__*/React.createElement("img", {
    src: cache.frames[i],
    alt: props.alt || '',
    style: style
  });
}
Object.assign(window, {
  Easing,
  interpolate,
  animate,
  clamp,
  TimelineContext,
  useTime,
  useTimeline,
  Stage,
  PlaybackBar,
  CompositionStage,
  useComposition,
  Shot,
  Captions,
  WatercolorReveal,
  WatercolorPainting,
  WatercolorSheet,
  WatercolorStroke,
  useWatercolorLayers
});
})();
(function(){
// Luneblaze brochure film — 16:9 motion graphics, all 16 brochure pages.
const W = 1920,
  H = 1080;
const TEAL = '#17AEB9',
  TTL = '#0F98A8',
  INK = '#1E2B30',
  NAVY = '#1F2A55',
  BROWN = '#5A4A38';
const PALE = '#BFE5E9',
  MIST = '#E9F6F7',
  CREAM = '#FAF6EE',
  YEL = '#F6D27A';
const HEAD = "'Bebas Neue', sans-serif",
  SANS = "'Montserrat', sans-serif";
const LOGO = 'assets/logo.png',
  CAMPUS = 'assets/campus.png';
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const prog = (t, a, b) => cl((t - a) / (b - a), 0, 1);
const MOTION = {
  enter: (t, a, d = 0.6) => Easing.easeOutCubic(prog(t, a, a + d)),
  pop: (t, a, d = 0.6) => Easing.easeOutBack(prog(t, a, a + d)),
  glide: (t, a, d = 0.6) => Easing.easeInOutCubic(prog(t, a, a + d))
};
const track = (t, keys) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, va] = keys[i],
      [b, vb] = keys[i + 1];
    if (t <= b) return va + (vb - va) * MOTION.glide(t, a, b - a);
  }
  return keys[keys.length - 1][1];
};
const mix = (a, b, p) => a + (b - a) * p;
const A = (x, y, extra) => ({
  position: 'absolute',
  left: x,
  top: y,
  ...extra
});
const up = (p, d = 28) => ({
  opacity: cl(p, 0, 1),
  transform: `translateY(${(1 - p) * d}px)`
});
const popS = p => ({
  opacity: cl(p * 1.4, 0, 1),
  transform: `scale(${mix(0.86, 1, p)})`
});

/* ---------- shared backdrop: warm paper, drifting pastel light, brand-swirl rings ---------- */
const ARCS = [{
  r: 230,
  w: 22,
  len: 0.6,
  sp: 7,
  o: 0.07
}, {
  r: 320,
  w: 2,
  len: 0.8,
  sp: -5,
  o: 0.16
}, {
  r: 410,
  w: 12,
  len: 0.42,
  sp: 4,
  o: 0.06
}, {
  r: 520,
  w: 2,
  len: 0.7,
  sp: -3,
  o: 0.12
}];
function Backdrop({
  T
}) {
  const b = (cx, cy, r, c, ph) => /*#__PURE__*/React.createElement("div", {
    style: A(cx + Math.sin(T * 0.25 + ph) * 60 - r, cy + Math.cos(T * 0.2 + ph) * 40 - r, {
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${c} 0%, rgba(255,255,255,0) 68%)`
    })
  });
  return /*#__PURE__*/React.createElement("div", {
    style: A(0, 0, {
      width: W,
      height: H,
      background: CREAM,
      overflow: 'hidden'
    })
  }, b(1650, 120, 520, 'rgba(243,195,91,0.30)', 0), b(180, 980, 560, 'rgba(238,140,118,0.18)', 2), b(1250, 1050, 420, 'rgba(187,168,236,0.20)', 4), b(520, 80, 380, 'rgba(23,174,185,0.14)', 1), /*#__PURE__*/React.createElement("div", {
    style: A(0, 0, {
      width: W,
      height: H,
      backgroundImage: 'radial-gradient(circle, rgba(90,74,56,0.13) 1.4px, transparent 1.8px)',
      backgroundSize: '40px 40px',
      backgroundPosition: `${T * 5}px ${T * 2.5}px`
    })
  }), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: A(0, 0)
  }, /*#__PURE__*/React.createElement("g", {
    transform: `translate(1700 860)`
  }, ARCS.map((a, i) => {
    const c = 2 * Math.PI * a.r;
    return /*#__PURE__*/React.createElement("circle", {
      key: i,
      r: a.r,
      fill: "none",
      stroke: BROWN,
      strokeOpacity: a.o,
      strokeWidth: a.w,
      strokeLinecap: "round",
      strokeDasharray: `${c * a.len} ${c}`,
      transform: `rotate(${i * 61 + T * a.sp})`
    });
  }))));
}

/* ---------- OPENER (cover) ---------- */
function Tiles({
  T
}) {
  const tiles = [{
    x: 0,
    y: 0,
    r: '0 100% 0 100%',
    c: '#F7D677'
  }, {
    x: 100,
    y: 0,
    r: '100% 0 100% 0',
    c: '#F8C9A6'
  }, {
    x: 0,
    y: 100,
    r: '100% 0 100% 0',
    c: '#F8C9A6'
  }, {
    x: 100,
    y: 100,
    r: '0 100% 0 100%',
    c: '#F7D677'
  }];
  return tiles.map((t, i) => {
    const s = MOTION.pop(T, 0.25 + i * 0.1, 0.5);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: A(t.x, t.y, {
        width: 100,
        height: 100,
        background: t.c,
        opacity: 0.75 * cl(s * 1.5, 0, 1),
        borderRadius: t.r,
        transform: `scale(${s})`
      })
    });
  });
}
function Logo({
  T,
  C
}) {
  const reveal = MOTION.enter(T, 0.3, 0.9);
  const w = track(T, [[C.Headline - 0.1, 820], [C.Headline + 0.6, 380]]);
  const x = track(T, [[C.Headline - 0.1, (W - 820) / 2], [C.Headline + 0.6, 240]]);
  const y = track(T, [[C.Headline - 0.1, 430], [C.Headline + 0.6, 46]]);
  const s = mix(0.94, 1, MOTION.enter(T, 0.3, 1.4));
  return /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    style: A(x, y, {
      width: w,
      height: w / 4,
      transformOrigin: '0% 50%',
      transform: `scale(${s})`,
      clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`
    })
  });
}
function Headline({
  T,
  C
}) {
  const s0 = C.Headline + 0.2;
  const x = track(T, [[C.Domains, 210], [C.Domains + 0.7, 110], [C.Hero, 110], [C.Hero + 0.7, 230]]);
  const y = track(T, [[C.Domains, 300], [C.Domains + 0.7, 420], [C.Impact, 420], [C.Impact + 0.6, 380], [C.Hero, 380], [C.Hero + 0.7, 210]]);
  const sc = track(T, [[C.Domains, 1], [C.Domains + 0.7, 0.5]]);
  const op = track(T, [[C.Impact, 1], [C.Impact + 0.5, 0], [C.Hero, 0], [C.Hero + 0.6, 1]]);
  const words = [['DRIVE', INK], ['SCHOOL', TEAL], ['QUALITY', TEAL]];
  const sub = MOTION.enter(T, s0 + 0.55, 0.6),
    rule = MOTION.glide(T, s0 + 0.75, 0.7),
    pill = MOTION.pop(T, s0 + 1.0, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: 1500,
      transformOrigin: '0 0',
      transform: `scale(${sc})`,
      opacity: op,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 34,
      fontFamily: HEAD,
      fontSize: 210,
      lineHeight: 0.92,
      letterSpacing: 2
    }
  }, words.map(([w, c], i) => {
    const p = MOTION.enter(T, s0 + i * 0.12, 0.65);
    return /*#__PURE__*/React.createElement("div", {
      key: w,
      style: {
        overflow: 'hidden',
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: c,
        transform: `translateY(${(1 - p) * 105}%)`
      }
    }, w));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 36,
      color: '#222',
      ...up(sub, 18)
    }
  }, "AI-Powered Quality Systems. Measurable Progress. Continuous Improvement"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      height: 5,
      borderRadius: 3,
      width: 900 * rule,
      background: TEAL
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      padding: '22px 64px',
      borderRadius: 70,
      border: `2px solid ${TEAL}`,
      background: '#fff',
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 38,
      lineHeight: 1.22,
      color: '#333',
      textAlign: 'center',
      letterSpacing: 0.5,
      ...popS(pill)
    }
  }, "with AI-Powered, End-to-End Quality Management", /*#__PURE__*/React.createElement("br", null), "For Schools & School Groups"));
}
const DOMAINS = [{
  name: 'Curriculum, Pedagogy and Assessment',
  pct: 40,
  c: '#F4AE84',
  big: true
}, {
  name: 'Infrastructure',
  pct: 10,
  c: '#6CC5AE'
}, {
  name: 'Human Resources',
  pct: 10,
  c: '#F4AE84'
}, {
  name: 'Inclusive Practices',
  pct: 10,
  c: '#A9CF8E'
}, {
  name: 'Management & Governance',
  pct: 10,
  c: '#A9CF8E'
}, {
  name: 'Leadership',
  pct: 10,
  c: '#F3C35B'
}, {
  name: 'Beneficiary Satisfaction',
  pct: 10,
  c: '#EE8C76'
}];
function Domains({
  T,
  C
}) {
  const d0 = C.Domains;
  const cx = track(T, [[d0, 1500], [d0 + 0.7, 1370], [C.Hero, 1370], [C.Hero + 0.7, 1450]]);
  const cy = track(T, [[C.Hero, 545], [C.Hero + 0.7, 385]]);
  const sc = track(T, [[d0 + 0.2, 0.8], [d0 + 0.9, 0.84], [C.Impact, 0.86], [C.Impact + 0.5, 0.76], [C.Hero, 0.76], [C.Hero + 0.7, 0.56]]);
  const op = track(T, [[d0, 0], [d0 + 0.3, 1], [C.Impact, 1], [C.Impact + 0.45, 0], [C.Hero, 0], [C.Hero + 0.5, 1]]);
  const ring = MOTION.glide(T, d0 + 0.15, 0.8),
    core = MOTION.pop(T, d0 + 0.35, 0.6);
  const R = 360,
    circ = 2 * Math.PI * 200;
  return /*#__PURE__*/React.createElement("div", {
    style: A(cx, cy, {
      width: 0,
      height: 0,
      transform: `scale(${sc})`,
      opacity: op
    })
  }, DOMAINS.map((d, i) => {
    const a = i * 360 / 7,
      rad = a * Math.PI / 180,
      t0 = d0 + 0.6 + i * 0.2;
    const p = MOTION.pop(T, t0, 0.6);
    const hl = Math.pow(Math.sin(Math.PI * prog(T, d0 + 2.1 + i * 0.13, d0 + 2.55 + i * 0.13)), 2);
    const size = d.big ? 250 : 200;
    const dist = mix(250, d.big ? R + 20 : R, MOTION.enter(T, t0, 0.7));
    const px = Math.sin(rad) * dist,
      py = -Math.cos(rad) * dist;
    const pct = Math.round(d.pct * MOTION.enter(T, t0 + 0.1, 0.8));
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: d.name
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 8,
        height: (R - 230) * MOTION.enter(T, t0 + 0.1, 0.5),
        background: d.c,
        borderRadius: 4,
        transformOrigin: '50% 0',
        transform: `rotate(${a + 180}deg) translate(-4px, 222px)`
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(px - size / 2, py - size / 2, {
        width: size,
        height: size,
        transform: `scale(${p * (1 + 0.07 * hl)})`,
        opacity: cl(p * 1.5, 0, 1)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: size,
        height: size,
        borderRadius: 54,
        background: d.c,
        transform: `rotate(${a + 45}deg)`,
        boxShadow: `0 ${12 + 14 * hl}px ${30 + 20 * hl}px rgba(60,50,40,${0.1 + 0.1 * hl})`
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: size,
        height: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: d.big ? 84 : 72,
        height: d.big ? 84 : 72,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: d.big ? 30 : 25,
        color: '#2b2b2b'
      }
    }, pct, "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: d.big ? 190 : 160,
        textAlign: 'center',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: d.big ? 20 : 19,
        lineHeight: 1.2,
        color: '#2f2f2f',
        textWrap: 'balance'
      }
    }, d.name))));
  }), /*#__PURE__*/React.createElement("svg", {
    width: "460",
    height: "460",
    style: A(-230, -230, {
      overflow: 'visible'
    })
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "230",
    cy: "230",
    r: "200",
    fill: "none",
    stroke: TEAL,
    strokeWidth: "30",
    strokeLinecap: "round",
    strokeDasharray: circ,
    strokeDashoffset: circ * (1 - ring),
    transform: "rotate(-90 230 230)"
  })), /*#__PURE__*/React.createElement("div", {
    style: A(-168, -168, {
      width: 336,
      height: 336,
      borderRadius: '50%',
      background: '#fff',
      border: `2px solid ${PALE}`,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${core})`
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 150,
      lineHeight: 1,
      color: INK
    }
  }, "7"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 48,
      letterSpacing: 2,
      color: INK
    }
  }, "DOMAINS")));
}
const ACCRED = ['SQAAF', 'NABET', 'QUALITY ASSURANCE', 'INSTITUTIONAL EXCELLENCE'];
const LINE = 'Building a future where quality is measured, managed and continuously improved.';
function Impact({
  T,
  C
}) {
  const i0 = C.Impact,
    camH = 2010 / (1394 / 265);
  const rise = track(T, [[i0 + 0.1, H + 20], [i0 + 0.9, H - camH]]);
  const drift = track(T, [[i0 + 0.1, -10], [C.Accreditation, -80]]);
  const wave = track(T, [[i0 + 0.1, 0], [C.Accreditation, 120]]);
  const bx = track(T, [[C.Hero, 960], [C.Hero + 0.7, 605]]);
  const by = track(T, [[C.Hero, 330], [C.Hero + 0.7, 520]]);
  const bs = track(T, [[C.Hero, 1], [C.Hero + 0.7, 0.44]]);
  const mask = 'linear-gradient(to bottom, transparent 0%, #000 22%)';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
    src: CAMPUS,
    style: A(drift, rise, {
      width: 2010,
      height: camH,
      mixBlendMode: 'multiply',
      WebkitMaskImage: mask,
      maskImage: mask
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: A(-300 - wave, rise + camH - 70, {
      width: 2700,
      height: 220,
      borderRadius: '50%',
      background: '#7FD2D8',
      opacity: 0.85
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: A(-500 + wave * 1.6, rise + camH - 40, {
      width: 3000,
      height: 220,
      borderRadius: '50%',
      background: TEAL
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: A(bx, by, {
      width: 0,
      height: 0,
      transform: `scale(${bs})`
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(-900, -50, {
      width: 1800,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 34
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      padding: '16px 40px',
      borderRadius: 22,
      background: '#fff',
      opacity: MOTION.enter(T, i0 + 0.2, 0.4),
      fontFamily: SANS,
      fontStyle: 'italic',
      fontWeight: 800,
      fontSize: 48,
      color: TEAL,
      whiteSpace: 'nowrap'
    }
  }, ACCRED.map((w, k) => {
    const p = MOTION.enter(T, i0 + 0.3 + k * 0.16, 0.5);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: w
    }, k > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 4,
        height: 48,
        background: TEAL,
        opacity: p,
        transform: 'skewX(-12deg)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: up(p, 24)
    }, w));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0 11px',
      fontFamily: SANS,
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: 38,
      color: '#222'
    }
  }, LINE.split(' ').map((w, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'inline-block',
      ...up(MOTION.enter(T, i0 + 0.95 + k * 0.05, 0.45), 12)
    }
  }, w))))));
}

/* ---------- PAGE SYSTEM ---------- */
function Head({
  T,
  s,
  title,
  sub,
  size = 112
}) {
  const arc = MOTION.glide(T, s + 0.1, 0.8),
    tp = MOTION.enter(T, s + 0.2, 0.7);
  const sp = MOTION.enter(T, s + 0.55, 0.6),
    rule = MOTION.glide(T, s + 0.7, 0.8);
  const circ = 2 * Math.PI * 56,
    ry = 190 + sub.length * 35 + 12;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    width: "140",
    height: "140",
    style: A(66, 34)
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "70",
    cy: "70",
    r: "56",
    fill: "none",
    stroke: TEAL,
    strokeWidth: "5",
    strokeLinecap: "round",
    strokeDasharray: circ,
    strokeDashoffset: circ * (1 - 0.7 * arc),
    transform: "rotate(95 70 70)"
  })), /*#__PURE__*/React.createElement("div", {
    style: A(128, 66, {
      overflow: 'hidden',
      paddingTop: 4
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HEAD,
      fontSize: size,
      lineHeight: 1,
      color: TTL,
      letterSpacing: 0.5,
      whiteSpace: 'nowrap',
      transform: `translateY(${(1 - tp) * 105}%)`
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: A(132, 188, {
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 24,
      letterSpacing: 4,
      color: BROWN,
      lineHeight: 1.45,
      ...up(sp, 14)
    })
  }, sub.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: A(132, ry, {
      display: 'flex',
      alignItems: 'center'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 880 * rule,
      height: 2,
      background: BROWN
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 9,
      height: 9,
      background: BROWN,
      transform: 'rotate(45deg)',
      opacity: rule > 0.97 ? 1 : 0
    }
  })));
}
function Callout({
  T,
  at,
  x = 160,
  y,
  w = 1600,
  size = 26,
  children
}) {
  const p = MOTION.pop(T, at, 0.6);
  return /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: w,
      boxSizing: 'border-box',
      padding: '18px 40px',
      borderRadius: 24,
      background: YEL,
      border: '2px solid #3A3226',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.4,
      color: '#3A3226',
      textAlign: 'center',
      textWrap: 'balance',
      ...popS(p)
    })
  }, children);
}
function Label({
  T,
  at,
  x,
  y,
  children,
  center
}) {
  const p = MOTION.enter(T, at, 0.5);
  return /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 22,
      letterSpacing: 3,
      color: TTL,
      ...(center ? {
        width: 0,
        display: 'flex',
        justifyContent: 'center',
        whiteSpace: 'nowrap'
      } : {}),
      ...up(p, 12)
    })
  }, children);
}
// offset-plate card used across pages
function Plate({
  x,
  y,
  w,
  h,
  c,
  p,
  r = 22,
  bg = '#fff',
  children,
  pad = 24
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: w,
      height: h,
      ...popS(p)
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(10, 12, {
      width: w,
      height: h,
      borderRadius: r,
      background: c
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: A(0, 0, {
      width: w,
      height: h,
      borderRadius: r,
      background: bg,
      border: `2px solid ${c}`,
      boxSizing: 'border-box',
      padding: pad,
      boxShadow: '0 14px 30px rgba(60,50,40,0.08)'
    })
  }, children));
}
const T_TITLE = {
  fontFamily: SANS,
  fontWeight: 700,
  color: NAVY,
  lineHeight: 1.22,
  textWrap: 'balance'
};
const T_BODY = {
  fontFamily: SANS,
  fontWeight: 500,
  color: '#3b3b3b',
  lineHeight: 1.4,
  textWrap: 'pretty'
};
const Num = ({
  n,
  c,
  s = 56,
  f = 30,
  fg = INK
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: s,
    height: s,
    flexShrink: 0,
    borderRadius: 12,
    background: c,
    color: fg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: SANS,
    fontWeight: 800,
    fontSize: f
  }
}, n);

/* 02 */
const P2 = [['01', 'Regulatory Readiness', 'Prepare systematically for prescribed assessments, documentation requirements and onsite inspections.', '#F3C35B'], ['02', 'Parent & Stakeholder Confidence', 'Demonstrate a commitment to structured processes, transparent practices and continuous improvement.', '#A9CF8E'], ['03', 'Consistency Beyond Individuals', 'Establish documented systems that sustain institutional quality despite changes in staff or leadership.', '#EE8C76'], ['04', 'Measurable Institutional Performance', 'Evaluate performance across quality domains to understand strengths, identify gaps and prioritize action.', '#F4AE84'], ['05', 'Structured Improvement Planning', 'Translate assessment findings into actionable improvement plans with clear ownership, timelines and resource allocation.', '#F3C35B'], ['06', 'Continuous Institutional Growth', 'Build on every assessment cycle to strengthen processes, improve outcomes and raise quality standards over time.', '#6CC5AE']];
function PAccreditation({
  T,
  s
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "SCHOOL ACCREDITATION MATTERS",
    sub: ['Accreditation Is Not Just a Certificate. It Is a System for Sustained Quality.']
  }), /*#__PURE__*/React.createElement(Label, {
    T: T,
    at: s + 0.9,
    x: W / 2,
    y: 278,
    center: true
  }, "WHY ACCREDITATION IS NECESSARY"), P2.map(([n, t, d, c], i) => /*#__PURE__*/React.createElement(Plate, {
    key: n,
    x: 120 + i % 3 * 570,
    y: 330 + Math.floor(i / 3) * 265,
    w: 540,
    h: 235,
    c: c,
    p: MOTION.pop(T, s + 1.1 + i * 0.16)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'center',
      height: 64
    }
  }, /*#__PURE__*/React.createElement(Num, {
    n: n,
    c: c
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...T_TITLE,
      fontSize: 25
    }
  }, t)), /*#__PURE__*/React.createElement("div", {
    style: {
      ...T_BODY,
      fontSize: 19,
      marginTop: 14
    }
  }, d))), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 2.6,
    y: 890
  }, "The goal is not simply to achieve accreditation.", /*#__PURE__*/React.createElement("br", null), "It is to build an institution that consistently demonstrates quality."));
}
/* 03 */
const P3 = [['Institutional Reputation', 'Assessment and publicly reported grading outcomes influence how parents, stakeholders and the wider community perceive a school.', '#F3C35B', '#FCEFC2'], ['Admissions & Competitive Positioning', 'Strong institutional systems and demonstrable quality can reinforce parent confidence and support long-term school growth.', '#6CC5AE', '#C8E6CB'], ['Structured Quality Measurement', 'Domain-wise assessment helps leadership understand institutional strengths, identify gaps and establish improvement priorities.', '#F4AE84', '#FDEDE4'], ['Accountability & Governance', 'Clearly defined responsibilities, documented processes and measurable progress strengthen accountability across the institution.', '#EE8C76', '#FBDADA'], ['Continuous Improvement', 'Regular monitoring and evidence-based decision-making help schools move from one-time preparation to sustained quality enhancement.', '#6CC5AE', '#C4F0E6']];
function PWhySQAAF({
  T,
  s
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "WHY SQAAF",
    sub: ['Long-Term Institutions Are Built on Strong Quality Systems.']
  }), /*#__PURE__*/React.createElement("div", {
    style: A(132, 320, {
      width: 580,
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      ...T_BODY,
      fontSize: 24,
      ...up(MOTION.enter(T, s + 0.9), 20)
    })
  }, /*#__PURE__*/React.createElement("div", null, "SQAAF provides schools with a structured framework to assess institutional practices, identify improvement areas and strengthen quality across key domains."), /*#__PURE__*/React.createElement("div", null, "With assessment and inspection outcomes gaining importance, schools need to move beyond documentation and develop systems that make quality measurable and sustainable.")), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.2,
    x: 132,
    y: 780,
    w: 580,
    size: 23
  }, "SQAAF should not be treated as an annual documentation exercise. It should become part of how a school operates, evaluates itself and improves."), P3.map(([t, d, c, bg], i) => {
    const p = MOTION.enter(T, s + 1.1 + i * 0.22, 0.7);
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      style: A(780, 312 + i * 138, {
        width: 1020,
        height: 120,
        borderRadius: 60,
        border: `2px solid ${c}`,
        background: '#fff',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '0 36px 0 12px',
        opacity: p,
        transform: `translateX(${(1 - p) * 120}px)`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 96,
        height: 96,
        borderRadius: '50%',
        background: bg,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: HEAD,
        fontSize: 52,
        color: INK,
        transform: `scale(${MOTION.pop(T, s + 1.3 + i * 0.22)})`
      }
    }, '0' + (i + 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T_TITLE,
        color: '#2A2A2A',
        fontSize: 27
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        ...T_BODY,
        color: '#2D3A6B',
        fontSize: 18,
        marginTop: 4
      }
    }, d)));
  }));
}
/* 04 */
const P4 = [['01', 'Manual & Paper-Based Processes', 'Traditional documentation methods make tracking, updating, and retrieval inefficient.', '#F3C35B'], ['02', 'Disorganized Documentation & Evidence', 'Scattered records and unstructured evidence make inspections stressful and difficult to manage.', '#EE8C76'], ['03', 'Faculty Workload & Time Constraints', 'Significant faculty hours are consumed in meetings & maintaining compliance records.', '#A9CF8E'], ['04', 'Unclear Progress & Accountability', 'Absence of real-time monitoring makes it difficult to measure readiness and stakeholder accountability.', '#EE8C76'], ['05', 'Last-Minute Inspection Preparation', 'Ensuring staff preparedness for inspections remains a constant challenge.', '#F3C35B'], ['06', 'Continuous Training Requirement', 'SQAAF Implementation needs training of faculties and regular handholding', '#F4AE84']];
function PChallenges({
  T,
  s
}) {
  const hub = MOTION.pop(T, s + 0.9, 0.7),
    cx = 960,
    cy = 560;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "THE CHALLENGES SCHOOLS FACE",
    sub: ['Completing Self-Assessment Is Not the Same as Implementing SQAAF.']
  }), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: A(0, 0)
  }, P4.map((c, i) => {
    const left = i < 3,
      yy = 315 + i % 3 * 170 + 75,
      x1 = left ? 680 : 1240,
      x2 = left ? cx - 175 : cx + 175;
    const p = MOTION.glide(T, s + 1.3 + i * 0.15, 0.5);
    return /*#__PURE__*/React.createElement("line", {
      key: i,
      x1: x2,
      y1: cy,
      x2: mix(x2, x1, p),
      y2: mix(cy, yy, p),
      stroke: c[3],
      strokeWidth: "3",
      strokeDasharray: "2 8",
      strokeLinecap: "round"
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: A(cx - 175, cy - 175, {
      width: 350,
      height: 350,
      borderRadius: '50%',
      transform: `scale(${hub})`
    })
  }, /*#__PURE__*/React.createElement("svg", {
    width: "350",
    height: "350",
    style: A(0, 0)
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "175",
    cy: "175",
    r: "168",
    fill: "none",
    stroke: TEAL,
    strokeWidth: "2",
    strokeDasharray: "4 10",
    transform: `rotate(${T * 12} 175 175)`
  })), /*#__PURE__*/React.createElement("img", {
    src: "assets/p4-hub.png",
    style: A(25, 25, {
      width: 300,
      height: 300,
      borderRadius: '50%'
    })
  })), /*#__PURE__*/React.createElement(Label, {
    T: T,
    at: s + 1.4,
    x: cx,
    y: 752,
    center: true
  }, "SIX KEY CHALLENGES"), P4.map(([n, t, d, c], i) => /*#__PURE__*/React.createElement(Plate, {
    key: n,
    x: i < 3 ? 120 : 1240,
    y: 315 + i % 3 * 170,
    w: 560,
    h: 150,
    c: c,
    p: MOTION.pop(T, s + 1.5 + i * 0.15),
    pad: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Num, {
    n: n,
    c: c,
    s: 50,
    f: 26
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...T_TITLE,
      fontSize: 22
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      ...T_BODY,
      fontSize: 17,
      marginTop: 6
    }
  }, d))))), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.0,
    y: 830,
    size: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800
    }
  }, "THE CORE PROBLEM"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, "Schools do not simply need more documents. They need a structured system that connects people, processes, evidence and outcomes.")), /*#__PURE__*/React.createElement("div", {
    style: A(0, 992, {
      width: W,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 30,
      color: TTL,
      ...up(MOTION.enter(T, s + 3.8), 16)
    })
  }, "The shift required: From managing paperwork to managing quality."));
}
/* 05 */
const P5 = [['Centralized Documentation & Evidence', 'Organize documents, policies, records and supporting evidence in one structured digital environment.'], ['Real-Time Progress Tracking', 'Monitor progress across every domain in real time. Identify gaps early and keep improvement efforts on track.'], ['Clear Ownership & Accountability', 'Assign responsibilities to the right stakeholders and track tasks, evidence submissions and completion status.'], ['Continuous Inspection Readiness', 'Monitor documentation and implementation progress throughout the year instead of relying on last-minute preparation.'], ['Standardized Quality Processes', 'Establish repeatable workflows, documented procedures and consistent practices across departments and campuses.']];
function PSolution({
  T,
  s
}) {
  const band = MOTION.glide(T, s + 1.0, 1.6);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "THE LUNEBLAZE SOLUTION",
    sub: ['One Structured System. Every Quality Requirement. Continuous Improvement.']
  }), /*#__PURE__*/React.createElement(Label, {
    T: T,
    at: s + 0.9,
    x: W / 2,
    y: 292,
    center: true
  }, "WHAT LUNEBLAZE ENABLES"), /*#__PURE__*/React.createElement("div", {
    style: A(288, 440, {
      width: 1344 * band,
      height: 16,
      borderRadius: 8,
      background: 'linear-gradient(90deg, #F9B233, #3DB58A, #F9B233, #3DB58A, #F9B233)'
    })
  }), P5.map(([t, d], i) => {
    const x = 120 + i * 336,
      c = i % 2 ? '#6CC5AE' : '#F3C35B',
      p = MOTION.pop(T, s + 1.1 + i * 0.32);
    const tx = MOTION.enter(T, s + 1.3 + i * 0.32, 0.6);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: t
    }, /*#__PURE__*/React.createElement("div", {
      style: A(x + 168 - 82, 366, {
        width: 164,
        height: 164,
        borderRadius: '50%',
        background: c,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${p})`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 126,
        height: 126,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: HEAD,
        fontSize: 78,
        color: '#1F4A50'
      }
    }, i + 1)), /*#__PURE__*/React.createElement("div", {
      style: A(x + 18, 560, {
        width: 300,
        textAlign: 'center',
        ...up(tx, 20)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T_TITLE,
        color: '#1F4A50',
        fontSize: 24
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        ...T_BODY,
        fontSize: 18,
        marginTop: 10,
        color: '#555'
      }
    }, d)));
  }), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.4,
    y: 815,
    size: 24
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800
    }
  }, "BUILT FOR MORE THAN COMPLIANCE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 500
    }
  }, "Luneblaze helps institutions embed quality into their everyday operations, making improvement a continuous institutional practice rather than a periodic exercise.")), /*#__PURE__*/React.createElement("div", {
    style: A(0, 990, {
      width: W,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 30,
      color: TTL,
      ...up(MOTION.enter(T, s + 4.1), 16)
    })
  }, "Measure quality. Strengthen systems. Improve continuously."));
}
/* 06 */
const P6 = [['QUALITY SYSTEMS', '#F7D677', ['Document & Evidence Management', 'Workflow & Core Learning Team Management', 'SQAAF Implementation, Compliance & Portal Filing', 'Standardized Policies, SOPs & Quality Frameworks']], ['QUALITY EXCELLENCE', '#EE8C76', ['24×7 Expert Assistance', 'Mock Audits & Readiness Assessments', 'Classroom Observations & Teaching Assessments', 'Trainings & Capacity Building']], ['QUALITY GOVERNANCE', '#A9CF8E', ['AI-Powered Quality Dashboard', 'Continuous Monitoring with Readiness Score™', 'School Rankings & Group Benchmarking', 'Performance Analytics & Executive Reports']]];
function PEcosystem({
  T,
  s
}) {
  const ph = MOTION.enter(T, s + 0.7, 0.9),
    kb = mix(1.12, 1.0, prog(T, s + 0.7, s + 7));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "THE LUNEBLAZE QUALITY ECOSYSTEM",
    sub: ['Building the Quality Muscle Inside Every Institution.']
  }), /*#__PURE__*/React.createElement("div", {
    style: A(120, 305, {
      width: 700,
      height: 394,
      borderRadius: 28,
      overflow: 'hidden',
      clipPath: `inset(0 ${(1 - ph) * 100}% 0 0 round 28px)`,
      boxShadow: '0 24px 50px rgba(60,50,40,0.18)'
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/p6-photo.png",
    style: {
      width: 700,
      height: 394,
      transform: `scale(${kb})`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: A(124, 722, {
      width: 690,
      ...T_BODY,
      fontSize: 19,
      ...up(MOTION.enter(T, s + 1.4), 16)
    })
  }, "Luneblaze is an AI-powered, end-to-end accreditation and quality management platform that combines digital infrastructure, expert assistance and performance intelligence to help educational institutions build sustainable quality systems."), /*#__PURE__*/React.createElement(Label, {
    T: T,
    at: s + 1.5,
    x: 1325,
    y: 300,
    center: true
  }, "THREE ESSENTIAL PILLARS"), P6.map(([h, c, items], k) => {
    const x = 860 + k * 320,
      hp = MOTION.pop(T, s + 1.7 + k * 0.35);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: h
    }, /*#__PURE__*/React.createElement("div", {
      style: A(x, 345, {
        width: 300,
        height: 64,
        borderRadius: '20px 20px 0 0',
        background: c,
        border: '2px solid #3A3226',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 21,
        color: '#2A2A2A',
        ...popS(hp)
      })
    }, h), items.map((it, j) => /*#__PURE__*/React.createElement("div", {
      key: it,
      style: A(x, 420 + j * 100, {
        width: 300,
        height: 90,
        borderRadius: 16,
        background: '#fff',
        border: `2px solid ${c}`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 16px',
        ...T_BODY,
        fontSize: 19,
        color: '#444',
        ...up(MOTION.enter(T, s + 1.9 + k * 0.35 + j * 0.1, 0.5), 20)
      })
    }, it)));
  }), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.6,
    y: 880,
    size: 25
  }, /*#__PURE__*/React.createElement("i", null, "From compliance to capability. From assessment to improvement.", /*#__PURE__*/React.createElement("br", null), "From individual effort to institutional excellence.")));
}
/* 07–09 capability grids */
const CAPC = ['#EE8C76', '#F3C35B', '#BBA8EC', '#6CC5AE'];
function CapGrid({
  T,
  s,
  items,
  h = 225,
  y0 = 305
}) {
  return items.map(([t, bs], i) => {
    const x = 120 + i % 2 * 860,
      y = y0 + Math.floor(i / 2) * (h + 25),
      c = CAPC[i];
    return /*#__PURE__*/React.createElement(Plate, {
      key: t,
      x: x,
      y: y,
      w: 820,
      h: h,
      c: c,
      bg: "#FFFDF8",
      p: MOTION.pop(T, s + 1.0 + i * 0.22),
      pad: 22
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 24,
        height: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120,
        height: 120,
        borderRadius: 18,
        background: c,
        border: '2px solid #2A2A2A',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 54,
        color: '#3A3A3A'
      }
    }, '0' + (i + 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...T_TITLE,
        color: '#262626',
        fontSize: 24
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, bs.map((b, j) => /*#__PURE__*/React.createElement("div", {
      key: j,
      style: {
        display: 'flex',
        gap: 10,
        ...T_BODY,
        fontSize: 17,
        lineHeight: 1.3,
        ...up(MOTION.enter(T, s + 1.3 + i * 0.22 + j * 0.08, 0.4), 8)
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: c,
        fontWeight: 900
      }
    }, "\u25CF"), /*#__PURE__*/React.createElement("span", null, b)))))));
  });
}
const P7 = [['Document & Evidence Management', ['Centralized document and evidence repository', 'Ready-to-use policies, SOPs and templates', 'Structured evidence collection aligned with Standards', 'Easy access, organization and tracking of records']], ['Workflow & Core Learning Team Management', ['Create domain-wise Core Learning Teams (CLTs) and focus groups', 'Assign tasks and responsibilities to relevant stakeholders', 'Coordinate collaboration, documentation and evidence sharing', 'Track ownership and implementation progress']], ['SQAAF Implementation, Compliance & Portal Filing', ['Structured support throughout the SQAAF implementation journey', 'Organize activities across quality domains and standards', 'Coordinate stakeholder responsibilities and implementation milestones', 'Support compliance activities and prescribed portal submissions']], ['Standardized Policies, SOPs & Quality Frameworks', ['Develop and organize institutional policies and SOPs', 'Establish consistent processes across departments', 'Promote standardized practices across campuses', 'Build a documented foundation for continuous improvement']]];
const P8 = [['Expert Assistance & Implementation Support', ['Guidance on documentation and quality requirements', 'Assistance with implementation-related queries', 'Support for identifying and resolving documentation gaps', 'Expert guidance throughout the implementation journey']], ['Mock Audits & Readiness Assessments', ['Simulate SQAAF & NABET Assessments and inspection scenarios', 'Evaluate documentation and evidence availability', 'Identify gaps against applicable requirements', 'Establish priorities for corrective action and readiness improvement']], ['Classroom Observations & Teaching Assessments', ['Structured classroom observation support', 'Review teaching-learning practices against defined parameters', 'Identify opportunities for pedagogical improvement', 'Generate actionable insights to support teaching quality']], ['Trainings & Capacity Building', ['Training for school leaders, teachers and implementation teams', 'Stakeholder engagement and feedback collection', 'Support for understanding roles and responsibilities', 'Monthly Webinars to strengthen implementation practices']]];
const P9 = [['AI-Powered Quality Dashboard', ['AI-driven insights across quality frameworks', 'Centralized view of institutional quality performance', 'Automated identification of gaps and improvement areas', 'Real-time dashboards for leadership decisions']], ['Continuous Monitoring with Readiness Score', ['Track progress across quality domains and standards', 'Monitor evidence availability and compliance status', 'Identify pending activities and implementation gaps', 'Assess readiness continuously throughout the quality journey']], ['School Rankings & Group Benchmarking', ['Compare quality performance across schools and campuses', 'Benchmark against defined quality standards', 'Identify high-performing institutions and areas needing support', 'Support targeted improvement initiatives across school groups']], ['Performance Analytics & Executive Reports', ['Generate structured reports on institutional performance', 'Present progress and improvement priorities to leadership', 'Track trends across assessment and implementation cycles', 'Support evidence-informed planning and review']]];
function PSystems({
  T,
  s
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "QUALITY SYSTEMS",
    sub: ['The Infrastructure That Makes Quality Repeatable.', 'Turn Framework Requirements into Everyday Institutional Practices.']
  }), /*#__PURE__*/React.createElement(CapGrid, {
    T: T,
    s: s,
    items: P7,
    y0: 320
  }), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.0,
    y: 850
  }, "Less fragmentation. Clearer accountability. Stronger institutional systems."));
}
function PExcellence({
  T,
  s
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "QUALITY EXCELLENCE",
    sub: ['Where Expert Guidance Turns Systems into Outcomes.', 'Technology Provides the Structure. Expertise Drives Implementation.']
  }), /*#__PURE__*/React.createElement(CapGrid, {
    T: T,
    s: s,
    items: P8,
    y0: 320
  }), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.0,
    y: 850
  }, "Better-prepared teams, more structured implementation and greater confidence in assessment readiness."));
}
const RS = [['Documentation Status', 'tracking the status of required documents and supporting evidence.'], ['Staff Inclusivity', 'assessing staff participation in quality initiatives.'], ['Audit Frequency', 'monitoring the regularity of institutional audits.']];
function PGovernance({
  T,
  s
}) {
  const sp = MOTION.enter(T, s + 2.6, 0.6);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "QUALITY GOVERNANCE",
    sub: ['See Exactly Where Every Institution Stands.', 'Measure Progress. Identify Gaps. Make Data Driven Decisions.']
  }), /*#__PURE__*/React.createElement(CapGrid, {
    T: T,
    s: s,
    items: P9,
    y0: 310,
    h: 205
  }), /*#__PURE__*/React.createElement("div", {
    style: A(120, 770, {
      width: 1690,
      height: 100,
      borderRadius: 24,
      background: INK,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 16px 0 30px',
      boxSizing: 'border-box',
      ...up(sp, 20)
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 19,
      lineHeight: 1.3,
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: YEL,
      fontWeight: 800
    }
  }, "The Readiness Score"), " evaluates institutional readiness across three key parameters."), RS.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      flex: 1,
      height: 76,
      borderRadius: 16,
      background: '#fff',
      padding: '8px 18px',
      boxSizing: 'border-box',
      ...popS(MOTION.pop(T, s + 2.9 + i * 0.18))
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...T_TITLE,
      color: '#1a1a1a',
      fontSize: 19
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      ...T_BODY,
      fontSize: 16,
      lineHeight: 1.25
    }
  }, d)))), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.6,
    y: 905
  }, "Measure what matters. Act where it counts. Improve what comes next."));
}
/* 10 */
const P10 = [['Quality Process Mapping & Framework Implementation', '#F4AE84'], ['Documentation & Evidence Management', '#4FB3C2'], ['Policies, SOPs & Quality Manual Support', '#4FB3C2'], ['Gap Assessment & Improvement Planning', '#F4AE84'], ['Workflow & Stakeholder Management', '#F3C35B'], ['Real-Time Progress & Quality Monitoring', '#EE8C76'], ['Corrective & Preventive Action Tracking', '#A9CF8E'], ['Mock Audits & Accreditation Readiness Assessment', '#F4AE84'], ['Continuous Improvement & Compliance Monitoring', '#A9CF8E'], ['Expert Advisory & Accreditation Support', '#EE8C76']];
const STEPS = ['Assess', 'Plan', 'Implement', 'Monitor', 'Review', 'Improve'];
function PNABET({
  T,
  s
}) {
  const bar = MOTION.enter(T, s + 2.6, 0.5);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "NABET ACCREDITATION",
    sub: ['Build Quality Systems That Go Beyond Documentation.', 'A Structured Approach to NABET Accreditation Readiness.']
  }), /*#__PURE__*/React.createElement(Label, {
    T: T,
    at: s + 0.9,
    x: W / 2,
    y: 300,
    center: true
  }, "OUR NABET ACCREDITATION SUPPORT"), P10.map(([t, c], i) => {
    const dark = c === '#4FB3C2';
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      style: A(120 + i % 5 * 340, 350 + Math.floor(i / 5) * 175, {
        width: 320,
        height: 155,
        ...popS(MOTION.pop(T, s + 1.0 + i * 0.1))
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 10, {
        width: 320,
        height: 155,
        borderRadius: 24,
        background: c,
        filter: 'brightness(0.88)',
        border: '2px solid #2A2A2A',
        boxSizing: 'border-box'
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 320,
        height: 155,
        borderRadius: 24,
        background: c,
        border: '2px solid #2A2A2A',
        boxSizing: 'border-box',
        padding: '0 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 14
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: HEAD,
        fontSize: 46,
        color: dark ? '#fff' : 'rgba(42,42,42,0.45)'
      }
    }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
      style: {
        ...T_TITLE,
        fontSize: 20,
        fontWeight: 600,
        color: dark ? '#fff' : '#1a1a1a'
      }
    }, t)));
  }), /*#__PURE__*/React.createElement("div", {
    style: A(120, 720, {
      width: 1680,
      height: 86,
      borderRadius: 43,
      background: INK,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 40px',
      boxSizing: 'border-box',
      ...up(bar, 20)
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 28,
      color: YEL,
      marginRight: 16
    }
  }, "OUR APPROACH:"), STEPS.map((st, i) => {
    const p = MOTION.enter(T, s + 2.9 + i * 0.2, 0.4);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: st
    }, i > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontSize: 30,
        color: YEL,
        opacity: p
      }
    }, "\u2192"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 32,
        color: '#fff',
        ...up(p, 14)
      }
    }, st));
  })), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 4.2,
    y: 860
  }, "NABET accreditation requires institutions to move beyond documentation and establish structured, measurable, and continuously improving quality processes."));
}
/* 11 */
const P11 = [['Group Quality Score', 'Track the overall quality performance of the entire school group.', '#4FB3C2'], ['School Rankings', 'Identify top-performing schools and campuses that need additional support.', '#A9CF8E'], ['SQAAF Readiness Score', "Measure each school's readiness for quality implementation and inspections.", '#F4AE84'], ['Domain-wise Performance', 'Compare performance across all 7 SQAAF Domains and 84 Standards.', '#F3C35B'], ['Compliance & Risk Alerts', 'Receive early warnings for missing evidence, pending activities, and compliance gaps.', '#F3C35B'], ['Documentation Status', 'Monitor documentation completion and evidence availability across every campus.', '#F4AE84'], ['Classroom Observation Insights', 'Track teaching quality through structured classroom observations and analytics.', '#A9CF8E'], ['Executive Reports', 'Generate board-ready reports for Trustees, Chairpersons, and Management.', '#4FB3C2']];
function PGroups({
  T,
  s
}) {
  const net = MOTION.pop(T, s + 0.8, 0.8),
    fl = Math.sin(T * 1.6) * 6;
  const kw = ['Standardization', 'Visibility', 'Accountability', 'Benchmarking', 'Scalability'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "SCHOOL GROUPS & FRANCHISE NETWORKS",
    sub: ['One Quality Vision. Every Campus. Measurable Progress.', 'Standardize Quality Across Your Entire School Network.'],
    size: 104
  }), /*#__PURE__*/React.createElement("div", {
    style: A(100, 318 + fl, {
      width: 760,
      height: 530,
      borderRadius: 30,
      background: '#fff',
      overflow: 'hidden',
      boxShadow: '0 20px 44px rgba(60,50,40,0.12)',
      ...popS(net)
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/p11-network.png",
    style: A(0, 8, {
      width: 760,
      height: 513
    })
  })), /*#__PURE__*/React.createElement(Label, {
    T: T,
    at: s + 1.2,
    x: 900,
    y: 318
  }, "ONE DASHBOARD. GROUP-WIDE VISIBILITY."), P11.map(([t, d, c], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: A(900 + i % 2 * 460, 362 + Math.floor(i / 2) * 120, {
      width: 440,
      height: 108,
      borderRadius: 18,
      background: '#fff',
      border: '2px solid #E6DDCC',
      boxSizing: 'border-box',
      overflow: 'hidden',
      ...popS(MOTION.pop(T, s + 1.4 + i * 0.12))
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: c,
      padding: '8px 18px',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 20,
      color: '#1a1a1a'
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      ...T_BODY,
      fontSize: 16,
      padding: '6px 18px',
      lineHeight: 1.3
    }
  }, d))), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: s + 3.2,
    y: 885,
    size: 26
  }, "Monitor every school. Measure every standard. Strengthen quality across the network."), /*#__PURE__*/React.createElement("div", {
    style: A(0, 992, {
      width: W,
      display: 'flex',
      justifyContent: 'center',
      gap: 18,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 28,
      color: TTL
    })
  }, kw.map((k, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: k
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: MOTION.enter(T, s + 3.8 + i * 0.15)
    }
  }, "|"), /*#__PURE__*/React.createElement("span", {
    style: up(MOTION.enter(T, s + 3.8 + i * 0.15, 0.4), 12)
  }, k)))));
}
/* 12 */
const VS = [['Documents Creation', 'Structured systems creation', '#F3C35B'], ['Consultant Dependency', 'Platform-driven', '#F4AE84'], ['Last-minute panic', 'Continuous readiness', '#EE8C76'], ['Scattered files', 'Central repository', '#A9CF8E'], ['Periodic progress updates', 'Real-time progress tracking', '#6CC5AE'], ['Isolated improvement activities', 'Structured, continuous improvement', '#F4AE84']];
const HOW = [['System Setup', '#F3C35B'], ['CLT Creation', '#A9CF8E'], ['Initial Training', '#6CC5AE'], ['Document & Evidence Creation', '#4FB3C2'], ['Real-Time Tracking', '#4FB3C2'], ['Progress Reporting', '#F3C35B'], ['Monthly Trainings', '#EE8C76'], ['Audit Readiness', '#EE8C76']];
function PWhyLuneblaze({
  T,
  s
}) {
  const split = s + 9.6;
  const aOut = MOTION.glide(T, split - 0.3, 0.5),
    bIn = MOTION.enter(T, split, 0.6);
  const path = MOTION.glide(T, split + 0.2, 2.0);
  const xs = [360, 760, 1160, 1560];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "WHY LUNEBLAZE",
    sub: ['Building Institutional Systems for Sustainable Accreditation Success.', 'Beyond Consultancy. Beyond Software. A Complete Quality Ecosystem.']
  }), /*#__PURE__*/React.createElement("div", {
    style: A(0, 0, {
      width: W,
      height: H,
      opacity: 1 - aOut,
      transform: `translateY(${-aOut * 60}px)`
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(0, 315, {
      width: W,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 120,
      ...up(MOTION.enter(T, s + 0.2), 16)
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 640,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 44,
      color: '#444'
    }
  }, "Traditional Approach"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HEAD,
      fontSize: 80,
      color: INK,
      width: 80,
      textAlign: 'center'
    }
  }, "VS"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 640,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 44,
      color: TTL
    }
  }, "Luneblaze Platform")), /*#__PURE__*/React.createElement("div", {
    style: A(958, 430, {
      width: 4,
      height: 520 * MOTION.glide(T, s + 0.4, 1.4),
      background: INK,
      borderRadius: 2
    })
  }), VS.map(([l, r, c], i) => {
    const y = 420 + i * 92,
      pl = MOTION.enter(T, s + 0.5 + i * 0.18, 0.5),
      pr = MOTION.pop(T, s + 0.9 + i * 0.22, 0.55);
    const pill = (txt, side, p) => /*#__PURE__*/React.createElement("div", {
      style: A(side ? 1040 : 240, y, {
        width: 640,
        height: 74,
        borderRadius: 37,
        background: c,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexDirection: side ? 'row' : 'row-reverse',
        justifyContent: 'space-between',
        padding: '0 30px',
        boxSizing: 'border-box',
        opacity: cl(p, 0, 1),
        transform: `translateX(${(1 - p) * (side ? 80 : -80)}px)`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 25,
        color: '#2A2A2A'
      }
    }, txt), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 34,
        color: 'rgba(30,43,48,0.5)'
      }
    }, '0' + (i + 1)));
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: l
    }, pill(l, false, pl), pill(r, true, pr), /*#__PURE__*/React.createElement("div", {
      style: A(946, y + 23, {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: c,
        border: `4px solid ${INK}`,
        boxSizing: 'border-box',
        transform: `scale(${pr})`
      })
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: A(0, 0, {
      width: W,
      height: H,
      opacity: bIn,
      transform: `translateY(${(1 - bIn) * 60}px)`
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(0, 315, {
      width: W,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 40,
      color: INK
    })
  }, "How Luneblaze Works"), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: A(0, 0)
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 260 500 L 1560 500 Q 1760 500 1760 640 Q 1760 780 1560 780 L 260 780",
    fill: "none",
    stroke: TEAL,
    strokeOpacity: "0.35",
    strokeWidth: "14",
    strokeLinecap: "round",
    pathLength: "1",
    strokeDasharray: "1",
    strokeDashoffset: 1 - path
  })), HOW.map(([t, c], i) => {
    const row = i < 4 ? 0 : 1,
      x = row ? xs[7 - i] : xs[i],
      y = row ? 690 : 410,
      p = MOTION.pop(T, split + 0.3 + i * 0.22);
    return /*#__PURE__*/React.createElement("div", {
      key: t,
      style: A(x - 110, y, {
        width: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        ...popS(p)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 130,
        height: 150,
        background: c,
        clipPath: 'polygon(50% 0, 100% 18%, 100% 78%, 50% 100%, 0 78%, 0 18%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 48,
        color: '#fff'
      }
    }, '0' + (i + 1)), /*#__PURE__*/React.createElement("div", {
      style: {
        ...T_TITLE,
        color: '#1a1a1a',
        fontSize: 22,
        textAlign: 'center'
      }
    }, t));
  }), /*#__PURE__*/React.createElement("div", {
    style: A(0, 985, {
      width: W,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 30,
      color: TTL,
      ...up(MOTION.enter(T, split + 2.4), 16)
    })
  }, "Building Institutional Systems for Sustainable Accreditation Success")));
}
/* 13 */
const PARTNERS = ['FATHER AGNEL GROUP OF SCHOOLS', 'SHALOM GROUP OF SCHOOLS', 'GAYATRI GROUP OF SCHOOLS', 'HOLY CHILD GROUP OF SCHOOLS', 'GD GOENKA SCHOOL', "ST. MICHAEL'S SCHOOL", 'CHINMAYA VIDYALAYA', 'EVERGREEN PUBLIC SCHOOL', 'LIVINGSTONE FOUNDATION INTERNATIONAL', 'SMS ACADEMY OF CENTRAL EDUCATION'];
const PINS = [[262, 590], [315, 615], [290, 700], [336, 712], [384, 715], [672, 720], [145, 780], [465, 790], [290, 870], [255, 1025]];
// circular crop of a brochure logo badge (source crops are 150px with the badge centred, ~68px across)
const Badge = ({
  src,
  d,
  ring = PALE
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    width: d,
    height: d,
    borderRadius: '50%',
    overflow: 'hidden',
    position: 'relative',
    background: '#fff',
    flexShrink: 0,
    boxShadow: `0 0 0 4px ${ring}, 0 10px 24px rgba(30,43,48,0.16)`
  }
}, /*#__PURE__*/React.createElement("img", {
  src: src,
  style: A(-(d * 150 / 66 - d) / 2, -(d * 150 / 66 - d) / 2, {
    width: d * 150 / 66,
    height: d * 150 / 66
  })
}));
function PPresence({
  T,
  s
}) {
  const g0 = s + 10.4; // global-reach beat
  const out = MOTION.glide(T, g0 - 0.5, 0.6),
    gin = MOTION.enter(T, g0, 0.7);
  const mp = MOTION.enter(T, s + 0.1, 0.9);
  const MX = 120,
    MY = 300,
    MS = 0.86; // map panel placement
  const pin = ([x, y]) => [MX + 14 + (x - 50) * MS, MY + 6 + (y - 440) * MS];
  const stat = (n, suf, l, y, at) => {
    const p = MOTION.pop(T, at),
      v = Math.round(n * MOTION.enter(T, at, 1.4));
    return /*#__PURE__*/React.createElement("div", {
      style: A(780, y, {
        width: 270,
        height: 150,
        borderRadius: 26,
        background: INK,
        boxSizing: 'border-box',
        padding: '20px 28px',
        ...popS(p)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: HEAD,
        fontSize: 84,
        lineHeight: 0.9,
        color: YEL
      }
    }, v, suf), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 21,
        color: '#fff',
        marginTop: 6
      }
    }, l));
  };
  // world beat geometry (p13-world crop 640x320 shown at 1.9x)
  const WX = 560,
    WY = 300,
    WS = 1.6;
  const wp = (x, y) => [WX + x * WS, WY + y * WS];
  const IN = wp(440, 172),
    AE = wp(395, 128),
    NG = wp(305, 166);
  const arc = (p1, p2, at, lift) => {
    const mx = (p1[0] + p2[0]) / 2,
      my = Math.min(p1[1], p2[1]) - lift,
      d = MOTION.glide(T, at, 0.9);
    return /*#__PURE__*/React.createElement("path", {
      d: `M ${p1[0]} ${p1[1]} Q ${mx} ${my} ${p2[0]} ${p2[1]}`,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "5",
      strokeLinecap: "round",
      pathLength: "1",
      strokeDasharray: "1",
      strokeDashoffset: 1 - d
    });
  };
  const gCard = (src, name, country, x, y, at, w) => /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: 330,
      borderRadius: 26,
      background: '#fff',
      padding: 22,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 20px 44px rgba(30,43,48,0.16)',
      border: `3px solid ${TEAL}`,
      ...popS(MOTION.pop(T, at, 0.7))
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    style: {
      width: w,
      height: 160 * w / 200
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 24,
      color: INK,
      textAlign: 'center'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 22,
      color: TTL
    }
  }, country));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "OUR PRESENCE & INSTITUTIONAL PARTNERS",
    sub: ['Trusted by Educational Institutions. Building Quality Across Borders.'],
    size: 104
  }), /*#__PURE__*/React.createElement("div", {
    style: A(0, 0, {
      width: W,
      height: H,
      opacity: 1 - out,
      transform: `translateY(${-out * 50}px)`
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(MX, MY, {
      width: 620,
      height: 690,
      borderRadius: 34,
      background: 'rgb(222,238,240)',
      overflow: 'hidden',
      clipPath: `circle(${mp * 140}% at 40% 40%)`
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/p13-map.png",
    style: A(14, 6, {
      width: 700 * MS,
      height: 790 * MS,
      transform: `scale(${mix(1.1, 1, mp)})`,
      transformOrigin: '45% 40%'
    })
  })), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: A(0, 0, {
      pointerEvents: 'none'
    })
  }, PINS.map((p, i) => {
    const [x, y] = pin(p),
      at = s + 0.9 + i * 0.22;
    const r1 = prog(T, at, at + 1.4),
      loop = ((T - at) % 2.4 + 2.4) % 2.4 / 2.4;
    return /*#__PURE__*/React.createElement("g", {
      key: i,
      opacity: T > at ? 1 : 0
    }, /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: 10 + 50 * r1,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "3",
      opacity: 1 - r1
    }), T > at + 1.4 && /*#__PURE__*/React.createElement("circle", {
      cx: x,
      cy: y,
      r: 10 + 34 * loop,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "2",
      opacity: 0.6 * (1 - loop)
    }));
  })), stat(100, '+', 'Institutions Served', 330, s + 1.2), stat(10, '+', 'Years Served', 505, s + 1.5), /*#__PURE__*/React.createElement("div", {
    style: A(780, 690, {
      width: 270,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 1.4,
      color: '#555',
      ...up(MOTION.enter(T, s + 2.2), 14)
    })
  }, "Partner schools across India, from the north to Nagaland and Karnataka."), /*#__PURE__*/React.createElement("div", {
    style: A(1100, 300, {
      width: 700,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 26,
      letterSpacing: 2,
      color: INK,
      ...up(MOTION.enter(T, s + 1.6), 14)
    })
  }, "OUR ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: TTL
    }
  }, "INSTITUTIONAL"), " PARTNERS"), PARTNERS.map((p, i) => {
    const col = i % 2,
      row = Math.floor(i / 2),
      at = s + 2.0 + i * 0.24,
      pp = MOTION.pop(T, at, 0.7);
    const fl = Math.sin(T * 1.4 + i) * 3;
    return /*#__PURE__*/React.createElement("div", {
      key: p,
      style: A(1100 + col * 355, 352 + row * 126 + fl, {
        width: 340,
        height: 110,
        borderRadius: 55,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 18px 0 10px',
        boxSizing: 'border-box',
        boxShadow: '0 8px 20px rgba(30,43,48,0.08)',
        opacity: cl(pp * 1.4, 0, 1),
        transform: `translateX(${(1 - MOTION.enter(T, at, 0.6)) * 80}px) scale(${mix(0.85, 1, pp)})`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: `scale(${pp}) rotate(${(1 - pp) * -40}deg)`
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      src: `assets/pl-${i + 1}.png`,
      d: 88,
      ring: i % 2 ? PALE : '#F6E3B4'
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 17,
        lineHeight: 1.25,
        color: '#1a1a1a',
        textWrap: 'balance'
      }
    }, p));
  })), /*#__PURE__*/React.createElement("div", {
    style: A(0, 0, {
      width: W,
      height: H,
      opacity: gin,
      transform: `translateY(${(1 - gin) * 50}px)`,
      pointerEvents: 'none'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(132, 290, {
      fontFamily: HEAD,
      fontSize: 84,
      lineHeight: 1,
      color: TTL
    })
  }, "GLOBAL REACH"), /*#__PURE__*/React.createElement("div", {
    style: A(136, 372, {
      width: 380,
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 22,
      lineHeight: 1.45,
      letterSpacing: 3,
      color: BROWN
    })
  }, "Partnering Beyond borders for a global impact"), /*#__PURE__*/React.createElement("div", {
    style: A(WX - 10, WY - 10, {
      width: 640 * WS + 20,
      height: 320 * WS + 20,
      borderRadius: 30,
      background: '#fff',
      boxShadow: '0 20px 44px rgba(30,43,48,0.10)'
    })
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/p13-world.png",
    style: A(WX, WY, {
      width: 640 * WS,
      height: 320 * WS
    })
  }), /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: A(0, 0)
  }, arc(IN, AE, g0 + 0.6, 90), arc(IN, NG, g0 + 0.9, 150), [IN, AE, NG].map(([x, y], k) => {
    const p = MOTION.pop(T, g0 + 0.5 + k * 0.4);
    return /*#__PURE__*/React.createElement("circle", {
      key: k,
      cx: x,
      cy: y,
      r: 12 * p,
      fill: k ? YEL : TEAL,
      stroke: INK,
      strokeWidth: "3"
    });
  })), gCard('assets/gl-1.png', 'INDIAN LANGUAGE SCHOOL', 'Nigeria', 140, 520, g0 + 1.6, 150), gCard('assets/gl-2.png', 'AL AIN JUNIORS SCHOOL', 'UAE', 1500, 560, g0 + 1.9, 190)), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: g0 + 2.6,
    x: 560,
    y: 965,
    w: 800,
    size: 26
  }, "Trusted by Educational Institutions Globally"));
}
/* 14 */
const ADV = [['Ms. Kalyani Dixit', 'Former Founder - Principal and Director'], ['Ms Mini Johny', 'Master Trainer - CBSE · District Coordinator for Training CoE Bengaluru'], ['Dr. Kshma Swarnkar', 'CBSE Resource Person · AI & Edtech Expert'], ['Ms. Archana Awade', 'General Manager - Aditya Birla Education Academy · Former Deputy Head - Podar Innovation Centre'], ['Ms. Sumithra Singh', 'Academic Consultant & Teacher Trainer · Former Literature Subject Coordinator'], ['Mr. Naresh Sharma', 'CBSE Resource Person · UNESCO Health and Wellness Master Trainer'], ['Ms. Manjit Malik', 'Academic Auditor · Education & School Quality Consultant'], ['Dr. Rakhee Chaudhary', 'Accreditation & Quality Assurance Expert · Curriculum Innovator'], ['Mr. Narender Kumar', 'CBSE Master Trainer & Lead Facilitator · Counselor at Manodarpan'], ['Dr. Deepti Chaturvedi', 'CBSE Resource Person · Founder Principal'], ['Dr. Abhishek Sharma', 'Advanced Lean Six Sigma Certified Trainer · CBSE Resource Person'], ['Dr. Manjari Tejpal', 'CBSE Resource Person & SQAAF Trainer · UNESCO NCERT Master Trainer'], ['Mr. Jeeson Sunny', 'CBSE SQAAF - PAT Member · Principal and CBSE Resource Person'], ['Ms. Mohita Jain', 'CBSE Resource Person · Career and Guidance Counsellor'], ['Dr. Jyoti Prakash Tripathy', 'CBSE Resource Person, District Coordinator (Training & Examination)'], ['Dr. Bani Godara', 'CBSE School Principal · CBSE Manual Reviewer']];
function PAdvisors({
  T,
  s
}) {
  const split = s + 9.0;
  const beat = k => {
    const st = k ? split : s + 0.9,
      out = k ? 0 : MOTION.glide(T, split - 0.35, 0.45);
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: k ? MOTION.enter(T, split, 0.4) : 1 - out
      })
    }, ADV.slice(k * 8, k * 8 + 8).map(([n, r], i) => {
      const p = MOTION.pop(T, st + i * 0.12, 0.6);
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: A(120 + i % 4 * 425, 318 + Math.floor(i / 4) * 310, {
          width: 400,
          height: 290,
          borderRadius: 24,
          background: '#fff',
          boxSizing: 'border-box',
          padding: 16,
          display: 'flex',
          gap: 18,
          boxShadow: '0 14px 32px rgba(60,50,40,0.10)',
          ...popS(p)
        })
      }, /*#__PURE__*/React.createElement("img", {
        src: `assets/adv-${k * 8 + i + 1}.png`,
        style: {
          width: 170,
          height: 258,
          objectFit: 'cover',
          borderRadius: 16,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          ...T_TITLE,
          color: '#2A2A2A',
          fontSize: 22
        }
      }, n), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 40,
          height: 3,
          background: YEL
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          ...T_BODY,
          fontSize: 16,
          color: '#555',
          lineHeight: 1.35
        }
      }, r)));
    }));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "OUR ADVISORS",
    sub: ['Guided by Experience. Strengthened by Expertise.', 'A Collective of 50+ Education Leaders, Quality Experts & Practitioners across the Globe.']
  }), beat(0), beat(1), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: split + 1.6,
    y: 965,
    size: 24
  }, "Practical experience. Domain expertise. A shared commitment to quality education."));
}
/* 15 */
const TESTI = [['Mohammad Gaffar', 'Principal', 'AL AIN Juniors School, UAE', '“Luneblaze’s guidance during our SQAAF implementation was invaluable. Their structured documentation support, responsive team, and user-friendly portal made the entire process smooth and efficient.”', '#F3C35B'], ['Kusum K P', 'Principal', 'SMS Academy of Central Education, Karnataka', '“Our SQAAF implementation gained clarity and momentum after partnering with Luneblaze. The structured portal, intuitive dashboard, and timely support helped our team stay aligned with CBSE timelines and manage documentation efficiently.”', '#EE8C76'], ["Fr. Roy D'Sa", 'Principal', 'Fr. Agnel Group of Schools', '“Luneblaze’s support during our SQAAF implementation was invaluable. Their structured documentation system and intuitive platform made compliance manageable and efficient for our team.”', '#A9CF8E'], ['Dr. Andrew Aohato', 'Principal', 'Livingstone Foundation International School, Nagaland', '“Luneblaze has been an integral part of our SQAAF journey. Their tech-based platform streamlined automation and documentation, providing well-structured, tailored solutions that made accreditation implementation seamless.”', '#6CC5AE'], ['Pradumna Chaturvedi', 'Managing Director', 'Gayatri Group of Schools, Agra', '“Luneblaze has brought structure and clarity to our quality assurance journey. The user-friendly portal, streamlined documentation, progress tracking, and timely expert support have helped us manage SQAAF requirements more effectively continuously strengthening our school processes and overall quality”', '#EE8C76'], ['Vandana Bhatia', 'Principal', 'Holy Child Group of Schools, Faridabad', '“Luneblaze’s technology-driven systems have streamlined our accreditation and assessment processes, significantly enhancing quality and efficiency in our school.”', '#6CC5AE']];
function PTestimonials({
  T,
  s
}) {
  const split = s + 12.0;
  const beat = k => {
    const st = k ? split : s + 0.9,
      out = k ? 0 : MOTION.glide(T, split - 0.35, 0.45);
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: k ? MOTION.enter(T, split, 0.4) : 1 - out
      })
    }, TESTI.slice(k * 3, k * 3 + 3).map(([n, r, sc, q, c], i) => {
      const p = MOTION.pop(T, st + i * 0.2, 0.6),
        qp = MOTION.enter(T, st + 0.4 + i * 0.2, 0.8);
      return /*#__PURE__*/React.createElement(Plate, {
        key: n,
        x: 130 + i * 565,
        y: 340,
        w: 530,
        h: 500,
        c: c,
        p: p,
        pad: 30
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 20,
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: `assets/t-${k * 3 + i + 1}.png`,
        style: {
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: `4px solid ${c}`,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          ...T_TITLE,
          fontSize: 26
        }
      }, n), /*#__PURE__*/React.createElement("div", {
        style: {
          ...T_BODY,
          fontSize: 19,
          color: NAVY
        }
      }, r), /*#__PURE__*/React.createElement("div", {
        style: {
          ...T_BODY,
          fontWeight: 700,
          fontSize: 16,
          color: '#6B7280',
          marginTop: 4
        }
      }, sc))), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 2,
          background: '#3A3226',
          margin: '20px 0',
          width: `${qp * 100}%`
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          ...T_BODY,
          fontSize: 19,
          lineHeight: 1.5,
          color: '#333',
          textAlign: 'center',
          opacity: qp
        }
      }, q));
    }));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Head, {
    T: T,
    s: s,
    title: "TESTIMONIALS",
    sub: ['Trusted by School Leaders. Proven Through Partnership.', 'What Educational Institutions Say About Luneblaze']
  }), beat(0), beat(1), /*#__PURE__*/React.createElement(Callout, {
    T: T,
    at: split + 1.8,
    x: 460,
    y: 905,
    w: 1000,
    size: 26
  }, "Trusted by School Leaders for Seamless SQAAF Implementation"), /*#__PURE__*/React.createElement("div", {
    style: A(0, 995, {
      width: W,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 28,
      color: TTL,
      ...up(MOTION.enter(T, split + 2.4), 14)
    })
  }, "Your institution could be our next quality success story."));
}
/* 16 */
function PContact({
  T,
  s
}) {
  const lp = MOTION.enter(T, s + 0.3, 0.9),
    card = MOTION.pop(T, s + 1.0, 0.7),
    qr = MOTION.pop(T, s + 1.4, 0.7);
  const lines = ['Build Systems That Make Quality Continuous.', 'Move Beyond Compliance & Build a Culture of Quality.'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    style: A(W / 2 - 260, 60, {
      width: 520,
      height: 130,
      clipPath: `inset(0 ${(1 - lp) * 100}% 0 0)`
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: A(W / 2 - 400, 205, {
      width: 800,
      height: 76,
      borderRadius: 20,
      background: TEAL,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 36,
      color: '#fff',
      ...popS(MOTION.pop(T, s + 0.7))
    })
  }, "Ready to Transform School Quality?"), /*#__PURE__*/React.createElement("div", {
    style: A(200, 320, {
      width: 1520,
      height: 470,
      borderRadius: 40,
      background: INK,
      boxShadow: '0 30px 60px rgba(30,30,30,0.25)',
      ...popS(card)
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(30, 30, {
      width: 420,
      height: 410,
      borderRadius: 30,
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/p16-qr.png",
    style: {
      width: 300,
      height: 300,
      transform: `scale(${qr})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 22px',
      borderRadius: 12,
      background: '#6CC5AE',
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 24,
      color: '#1a1a1a'
    }
  }, "Scan to Book a DEMO")), /*#__PURE__*/React.createElement("div", {
    style: A(510, 50, {
      width: 960
    })
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 1.25,
      color: '#fff',
      marginBottom: 16,
      ...up(MOTION.enter(T, s + 1.5 + i * 0.3), 20)
    }
  }, l)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 50,
      marginTop: 30,
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 30,
      color: '#fff',
      ...up(MOTION.enter(T, s + 2.2), 16)
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: YEL
    }
  }, "\u2709"), "\xA0 schools@luneblaze.com"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: YEL
    }
  }, "\u2706"), "\xA0 +91 8810418840")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 2,
      background: 'rgba(255,255,255,0.5)',
      margin: '28px 0 20px',
      width: 900 * MOTION.glide(T, s + 2.4, 0.6)
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 26,
      color: '#E9F6F7',
      ...up(MOTION.enter(T, s + 2.6), 12)
    }
  }, "Drive School Quality with AI-Powered End to End Solutions"))), /*#__PURE__*/React.createElement("div", {
    style: A(W / 2 - 540, 812, {
      width: 1080,
      height: 164,
      borderRadius: 24,
      background: '#fff',
      overflow: 'hidden',
      ...up(MOTION.enter(T, s + 2.8), 20)
    })
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/p16-badges.png",
    style: A(20, 6, {
      width: 1040,
      height: 152
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: A(0, 990, {
      width: W,
      textAlign: 'center',
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 34,
      color: TTL,
      ...up(MOTION.enter(T, s + 8.0), 14)
    })
  }, "Measure Quality. Strengthen Systems. Inspire Excellence."));
}
const PAGES = [['Accreditation', PAccreditation, '#F7D677'], ['WhySQAAF', PWhySQAAF, '#6CC5AE'], ['Challenges', PChallenges, '#EE8C76'], ['Solution', PSolution, '#F3C35B'], ['Ecosystem', PEcosystem, '#BBA8EC'], ['Systems', PSystems, '#EE8C76'], ['Excellence', PExcellence, '#F3C35B'], ['Governance', PGovernance, '#BBA8EC'], ['NABET', PNABET, '#6CC5AE'], ['Groups', PGroups, '#F4AE84'], ['WhyLuneblaze', PWhyLuneblaze, '#F7D677'], ['Presence', PPresence, '#6CC5AE'], ['Advisors', PAdvisors, '#EE8C76'], ['Testimonials', PTestimonials, '#BBA8EC'], ['Contact', PContact, '#F7D677']];
const INTRO = 1.8;
const TITLES = {
  Accreditation: 'School Accreditation Matters',
  WhySQAAF: 'Why SQAAF',
  Challenges: 'The Challenges Schools Face',
  Solution: 'The Luneblaze Solution',
  Ecosystem: 'The Quality Ecosystem',
  Systems: 'Quality Systems',
  Excellence: 'Quality Excellence',
  Governance: 'Quality Governance',
  NABET: 'NABET Accreditation',
  Groups: 'School Groups & Networks',
  WhyLuneblaze: 'Why Luneblaze',
  Presence: 'Presence & Partners',
  Advisors: 'Our Advisors',
  Testimonials: 'Testimonials',
  Contact: 'Book a Demo'
};
const F = (at, x, y, z) => [at, x, y, z];
const FOCUS = {
  Accreditation: {
    end: 19.5,
    stops: [F(3.4, 690, 450, 1.55), F(6.4, 1250, 450, 1.55), F(9.4, 690, 715, 1.55), F(12.4, 1250, 715, 1.55), F(15.4, 960, 930, 1.5), F(18, 960, 540, 1)]
  },
  WhySQAAF: {
    end: 15.5,
    stops: [F(3.4, 600, 600, 1.6), F(6.8, 1290, 450, 1.55), F(10.2, 1290, 730, 1.55), F(13.8, 960, 540, 1)]
  },
  Challenges: {
    end: 15.8,
    stops: [F(3.8, 640, 560, 1.5), F(7.4, 1280, 560, 1.5), F(11, 960, 900, 1.5), F(14.2, 960, 540, 1)]
  },
  Solution: {
    end: 16.2,
    stops: [F(4.2, 662, 560, 1.45), F(7.8, 1258, 560, 1.45), F(11.4, 960, 880, 1.45), F(14.6, 960, 540, 1)]
  },
  Ecosystem: {
    end: 15.6,
    stops: [F(4, 600, 560, 1.6), F(7.6, 1301, 560, 1.55), F(11.2, 960, 880, 1.5), F(14, 960, 540, 1)]
  },
  Systems: {
    end: 17.4,
    stops: [F(3.8, 565, 450, 1.7), F(6.8, 1355, 450, 1.7), F(9.8, 565, 690, 1.7), F(12.8, 1355, 690, 1.7), F(15.8, 960, 540, 1)]
  },
  Excellence: {
    end: 17.4,
    stops: [F(3.8, 565, 450, 1.7), F(6.8, 1355, 450, 1.7), F(9.8, 565, 690, 1.7), F(12.8, 1355, 690, 1.7), F(15.8, 960, 540, 1)]
  },
  Governance: {
    end: 19.8,
    stops: [F(3.8, 565, 420, 1.7), F(6.8, 1355, 420, 1.7), F(9.8, 565, 650, 1.7), F(12.8, 1355, 650, 1.7), F(15.8, 960, 860, 1.5), F(18.4, 960, 540, 1)]
  },
  NABET: {
    end: 16,
    stops: [F(4.2, 640, 520, 1.55), F(7.6, 1300, 520, 1.55), F(11, 960, 800, 1.4), F(14.4, 960, 540, 1)]
  },
  Groups: {
    end: 15.8,
    stops: [F(4, 619, 580, 1.55), F(7.6, 1320, 480, 1.6), F(11.2, 960, 900, 1.45), F(14.2, 960, 540, 1)]
  },
  WhyLuneblaze: {
    end: 16.6,
    stops: [F(4.8, 700, 640, 1.45), F(7.4, 1220, 640, 1.45), F(9.2, 960, 540, 1), F(12.6, 960, 600, 1.12), F(15.2, 960, 540, 1)]
  },
  Presence: {
    end: 17.0,
    stops: [F(4.0, 610, 640, 1.42), F(6.8, 1300, 640, 1.42), F(9.4, 960, 540, 1), F(13.0, 960, 560, 1.06), F(15.8, 960, 540, 1)]
  },
  Advisors: {
    end: 18.6,
    stops: [F(3, 662, 620, 1.45), F(5.8, 1258, 620, 1.45), F(8.4, 960, 540, 1), F(11.4, 662, 620, 1.45), F(14.2, 1258, 620, 1.45), F(17, 960, 540, 1)]
  },
  Testimonials: {
    end: 23.6,
    stops: [F(3.6, 549, 590, 1.75), F(6.4, 960, 590, 1.75), F(9.2, 1371, 590, 1.75), F(11.4, 960, 540, 1), F(13.6, 549, 590, 1.75), F(16.4, 960, 590, 1.75), F(19.2, 1371, 590, 1.75), F(22, 960, 540, 1)]
  },
  Contact: {
    end: 10.5,
    stops: [F(4.2, 960, 555, 1.07), F(7.4, 960, 540, 1)]
  }
};
function clampCam(c) {
  const hw = 960 / c.z,
    hh = 540 / c.z;
  return {
    z: c.z,
    cx: cl(c.cx, hw, W - hw),
    cy: cl(c.cy, hh, H - hh)
  };
}
function camAt(stops, t) {
  let c = {
    cx: 960,
    cy: 540,
    z: 1
  };
  for (const [at, x, y, z] of stops) {
    const p = MOTION.glide(t, at, 0.9);
    c = {
      cx: mix(c.cx, x, p),
      cy: mix(c.cy, y, p),
      z: mix(c.z, z, p)
    };
  }
  return clampCam(c);
}
const camStyle = (c, extra = 1) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: W,
  height: H,
  transformOrigin: '0 0',
  transform: `translate(960px,540px) scale(${c.z * extra}) translate(${-c.cx}px,${-c.cy}px)`
});

// Chapter card: two-layer ink + accent sweep, big chapter number, kinetic title.
function ChapterCard({
  T,
  b,
  i,
  name,
  accent
}) {
  if (T < b - 0.6 || T > b + INTRO + 0.15) return null;
  const inP = MOTION.glide(T, b - 0.55, 0.55),
    outP = MOTION.glide(T, b + INTRO - 0.5, 0.55);
  const leaving = T > b + INTRO - 0.5;
  const x = leaving ? mix(0, -W - 700, outP) : mix(W + 500, 0, inP);
  const xa = leaving ? mix(0, -W - 700, MOTION.glide(T, b + INTRO - 0.42, 0.55)) : mix(W + 500, 0, MOTION.glide(T, b - 0.6, 0.5));
  const words = TITLES[name].toUpperCase().split(' ');
  const n = String(i + 2).padStart(2, '0');
  const numP = MOTION.enter(T, b - 0.1, 0.8),
    kick = MOTION.enter(T, b + 0.05, 0.5),
    line = MOTION.glide(T, b + 0.3, 0.7);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: A(xa - 260, -60, {
      width: W + 520,
      height: H + 120,
      background: accent,
      transform: 'skewX(-10deg)'
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: A(x - 200, -60, {
      width: W + 400,
      height: H + 120,
      background: INK,
      transform: 'skewX(-10deg)',
      overflow: 'hidden'
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: A(x, 0, {
      width: W,
      height: H,
      overflow: 'hidden'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: A(1160, 120, {
      fontFamily: HEAD,
      fontSize: 760,
      lineHeight: 1,
      color: TEAL,
      opacity: 0.22 * numP,
      transform: `translateX(${(1 - numP) * 160}px)`
    })
  }, n), /*#__PURE__*/React.createElement("div", {
    style: A(160, 330, {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: 8,
      color: accent,
      ...up(kick, 16)
    })
  }, "CHAPTER ", n, " / 16"), /*#__PURE__*/React.createElement("div", {
    style: A(156, 380, {
      width: 1500,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0 28px',
      fontFamily: HEAD,
      fontSize: 168,
      lineHeight: 0.98,
      color: '#fff'
    })
  }, words.map((w, k) => {
    const p = MOTION.enter(T, b + 0.08 + k * 0.09, 0.6);
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        overflow: 'hidden',
        paddingTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: `translateY(${(1 - p) * 105}%)`
      }
    }, w));
  })), /*#__PURE__*/React.createElement("div", {
    style: A(160, 760, {
      width: 420 * line,
      height: 8,
      borderRadius: 4,
      background: accent
    })
  })));
}
function LogoMark({
  T
}) {
  const p = MOTION.pop(T, 0.2, 0.8);
  return /*#__PURE__*/React.createElement("img", {
    src: "assets/luneblaze-icon.png",
    style: A(W - 136, 30, {
      width: 96,
      height: 96,
      opacity: cl(p * 1.4, 0, 1),
      transform: `scale(${p}) rotate(${(1 - p) * -90}deg)`,
      filter: 'drop-shadow(0 4px 10px rgba(30,43,48,0.15))'
    })
  });
}
function Progress({
  T,
  C,
  total
}) {
  const start = C.Accreditation;
  if (T < start - 0.6) return null;
  const vis = MOTION.enter(T, start + INTRO - 0.4, 0.5);
  let cur = 0;
  PAGES.forEach(([n], i) => {
    if (T >= C[n]) cur = i;
  });
  const p = cl((T - start) / (total - start), 0, 1);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: A(0, H - 8, {
      width: W,
      height: 8,
      background: 'rgba(30,43,48,0.08)',
      opacity: vis
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${p * 100}%`,
      height: 8,
      background: TEAL
    }
  }), PAGES.map(([n], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: A((C[n] - start) / (total - start) * W, 0, {
      width: 3,
      height: 8,
      background: CREAM
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: A(W - 740, 38, {
      width: 580,
      display: 'flex',
      justifyContent: 'flex-end',
      opacity: vis
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 20px',
      borderRadius: 24,
      background: 'rgba(250,246,238,0.94)',
      boxShadow: '0 6px 18px rgba(30,43,48,0.10)',
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: 3,
      color: 'rgba(30,43,48,0.6)',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: TTL
    }
  }, String(cur + 2).padStart(2, '0'), " / 16"), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, TITLES[PAGES[cur][0]].toUpperCase()))));
}
function PageShot({
  T,
  C,
  i
}) {
  const [name, Comp] = PAGES[i];
  const s = C[name],
    cs = s + INTRO,
    e = i + 1 < PAGES.length ? C[PAGES[i + 1][0]] : 1e9;
  if (T < s - 0.7 || T > e + 0.1) return null;
  const cam = camAt(FOCUS[name].stops, T - cs);
  const drift = mix(1, 1.015, prog(T, cs, e));
  return /*#__PURE__*/React.createElement("div", {
    style: camStyle(cam, drift)
  }, /*#__PURE__*/React.createElement(Comp, {
    T: T,
    s: cs
  }));
}
/* ---------- voice-over ---------- */
const VO = [['Brand', 0.3, 'Luneblaze. Inducing quality in education.'], ['Headline', 0.2, 'Drive school quality, with AI-powered quality systems for schools and school groups.'], ['Domains', 0.3, 'Seven domains, from curriculum and pedagogy to leadership and inclusion, measured as one system.'], ['Impact', 0.2, 'Aligned with SQAAF and NABET. Building a future where quality is measured, managed, and continuously improved.'], ['Accreditation', 0.5, 'Accreditation is not just a certificate. It is a system for sustained quality.'], ['WhySQAAF', 0.5, 'Long-term institutions are built on strong quality systems: reputation, positioning, measurement, accountability, and continuous improvement.'], ['Challenges', 0.5, 'Yet many schools struggle with paper-based processes, scattered evidence, heavy workloads, and last-minute inspection pressure.'], ['Solution', 0.5, 'The Luneblaze solution: one structured system for every quality requirement, with continuous improvement built in.'], ['Ecosystem', 0.5, 'One integrated ecosystem, built on three pillars: quality systems, quality excellence, and quality governance.'], ['Systems', 0.5, 'Quality systems give schools the infrastructure that makes quality repeatable.'], ['Excellence', 0.5, 'Quality excellence brings expert guidance that turns systems into outcomes.'], ['Governance', 0.5, 'Quality governance shows exactly where every institution stands, with a continuous Readiness Score.'], ['NABET', 0.5, 'For NABET accreditation, a structured approach: assess, plan, implement, monitor, review, and improve.'], ['Groups', 0.5, 'For school groups and franchise networks: one quality vision, every campus, measurable progress.'], ['WhyLuneblaze', 0.5, 'Beyond consultancy. Beyond software. A complete quality ecosystem, from system setup to audit readiness.'], ['Presence', 0.5, 'Trusted by more than one hundred institutions across India, and partnering beyond borders, from Nigeria to the UAE.'], ['Advisors', 0.5, 'Guided by a collective of more than fifty education leaders and quality experts.'], ['Testimonials', 0.5, 'And trusted by school leaders for seamless SQAAF implementation.'], ['Contact', 0.5, 'Ready to transform school quality? Scan to book a demo with Luneblaze.']];
window.LUNEBLAZE_VO = VO;
function pickVoice() {
  const vs = window.speechSynthesis && speechSynthesis.getVoices() || [];
  return vs.find(v => /en-GB/.test(v.lang) && /female|Serena|Kate|Libby|Sonia/i.test(v.name)) || vs.find(v => /en-(GB|IN)/.test(v.lang)) || vs.find(v => /^en/.test(v.lang)) || null;
}
function useNarration(T, C, playing, on) {
  const last = React.useRef(T);
  React.useEffect(() => {
    const ss = window.speechSynthesis;
    if (!ss) return;
    const prev = last.current;
    last.current = T;
    if (!on || !playing || T < prev || T - prev > 0.5) {
      if (!playing || T < prev) ss.cancel();
      return;
    }
    VO.forEach(([sec, off, text]) => {
      const at = C[sec] + off;
      if (prev < at && T >= at) {
        const u = new SpeechSynthesisUtterance(text);
        const v = pickVoice();
        if (v) u.voice = v;
        u.rate = 1.04;
        ss.speak(u);
      }
    });
  }, [T, playing, on]);
  React.useEffect(() => () => window.speechSynthesis && speechSynthesis.cancel(), []);
}
function VoiceTrack({
  T,
  playing,
  dur
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (Math.abs(v.currentTime - T) > 0.25) v.currentTime = T;
    if (playing && v.paused) v.play().catch(() => {});
    if (!playing && !v.paused) v.pause();
  }, [T, playing]);
  return /*#__PURE__*/React.createElement("video", {
    ref: ref,
    src: "assets/voiceover.mp3",
    preload: "auto",
    playsInline: true,
    "data-om-exportable-video-play-start": "0",
    "data-om-exportable-video-play-end": dur,
    style: A(0, 0, {
      width: 1,
      height: 1,
      opacity: 0
    })
  });
}
const clipSrc = i => `assets/vo/${String(i + 1).padStart(2, '0')}.mp3`;
const lineDur = text => 0.6 + text.split(' ').length * 0.4;
function useClipNarration(T, C, playing, on) {
  const last = React.useRef(T),
    have = React.useRef({}),
    live = React.useRef([]);
  React.useEffect(() => {
    VO.forEach((_, i) => fetch(clipSrc(i), {
      method: 'HEAD'
    }).then(r => {
      have.current[i] = r.ok;
    }).catch(() => {}));
  }, []);
  const stopAll = () => {
    live.current.forEach(a => a.pause());
    live.current = [];
    window.speechSynthesis && speechSynthesis.cancel();
  };
  React.useEffect(() => {
    const prev = last.current;
    last.current = T;
    if (!on || !playing || T < prev || T - prev > 0.5) {
      if (!playing || T < prev || !on) stopAll();
      return;
    }
    VO.forEach(([sec, off, text], i) => {
      const at = C[sec] + off;
      if (!(prev < at && T >= at)) return;
      if (have.current[i]) {
        const a = new Audio(clipSrc(i));
        a.play().catch(() => {});
        live.current.push(a);
      } else if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        const v = pickVoice();
        if (v) u.voice = v;
        u.rate = 1.04;
        speechSynthesis.speak(u);
      }
    });
  }, [T, playing, on]);
  React.useEffect(() => stopAll, []);
}
function Captions({
  T,
  C
}) {
  let cur = null;
  VO.forEach(([sec, off, text]) => {
    const at = C[sec] + off;
    if (T >= at && T < at + lineDur(text) + 0.4) cur = {
      at,
      text
    };
  });
  if (!cur) return null;
  const words = cur.text.split(' '),
    d = lineDur(cur.text);
  const vis = Math.min(MOTION.enter(T, cur.at, 0.3), 1 - MOTION.enter(T, cur.at + d, 0.4));
  return /*#__PURE__*/React.createElement("div", {
    style: A(0, H - 96, {
      width: W,
      display: 'flex',
      justifyContent: 'center',
      opacity: vis,
      transform: `translateY(${(1 - vis) * 12}px)`,
      pointerEvents: 'none'
    })
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1500,
      padding: '12px 30px',
      borderRadius: 18,
      background: 'rgba(30,43,48,0.92)',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0 9px',
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 28,
      lineHeight: 1.35,
      color: '#fff'
    }
  }, words.map((w, k) => {
    const lit = T >= cur.at + 0.3 + k / words.length * (d - 0.6);
    return /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        color: lit ? '#fff' : 'rgba(255,255,255,0.5)'
      }
    }, w);
  })));
}
function Piece({
  fx
}) {
  const {
    T,
    CUES: C,
    playing,
    authoredTotal
  } = useComposition();
  useClipNarration(T, C, playing, fx.voice === 'Voice clips');
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": `t=${Math.floor(T)}s`,
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: CREAM
    }
  }, /*#__PURE__*/React.createElement(Backdrop, {
    T: T
  }), T < C.Accreditation + 0.1 && /*#__PURE__*/React.createElement(Shot, {
    from: 0,
    to: C.Accreditation
  }, /*#__PURE__*/React.createElement(Impact, {
    T: T,
    C: C
  }), /*#__PURE__*/React.createElement(Domains, {
    T: T,
    C: C
  }), /*#__PURE__*/React.createElement(Headline, {
    T: T,
    C: C
  }), /*#__PURE__*/React.createElement(Logo, {
    T: T,
    C: C
  }), /*#__PURE__*/React.createElement(Tiles, {
    T: T
  })), PAGES.map((pg, i) => /*#__PURE__*/React.createElement(PageShot, {
    key: pg[0],
    T: T,
    C: C,
    i: i
  })), /*#__PURE__*/React.createElement(Progress, {
    T: T,
    C: C,
    total: authoredTotal
  }), PAGES.map(([n,, c], i) => /*#__PURE__*/React.createElement(ChapterCard, {
    key: n,
    T: T,
    b: C[n],
    i: i,
    name: n,
    accent: c
  })), /*#__PURE__*/React.createElement(LogoMark, {
    T: T
  }), fx.captions && /*#__PURE__*/React.createElement(Captions, {
    T: T,
    C: C
  }), fx.voice === 'Recorded file' && /*#__PURE__*/React.createElement(VoiceTrack, {
    T: T,
    playing: playing,
    dur: authoredTotal
  }));
}
function LuneblazeFilmV3() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CompositionStage, {
    width: W,
    height: H,
    scenes: window.OM_SCENES,
    playback: window.OM_PLAYBACK,
    bg: CREAM
  }, /*#__PURE__*/React.createElement(Piece, {
    fx: t
  })), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Voice-over"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Narration",
    value: t.voice,
    options: ['Voice clips', 'Recorded file', 'Off'],
    onChange: v => setTweak('voice', v)
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Captions",
    value: t.captions,
    onChange: v => setTweak('captions', v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Motion"
  }), /*#__PURE__*/React.createElement(TweakToggle, {
    label: "Motion editor",
    value: t.motionEditor,
    onChange: v => setTweak('motionEditor', v)
  })));
}
window.LuneblazeFilmV3 = LuneblazeFilmV3;
window.LB = {
  W,
  H,
  INTRO,
  PAGES,
  TITLES,
  FOCUS,
  VO,
  camAt,
  clampCam,
  camStyle,
  mix,
  MOTION,
  cl,
  A,
  CREAM,
  INK,
  TEAL,
  TTL,
  SANS,
  HEAD,
  Backdrop,
  Impact,
  Domains,
  Headline,
  Logo,
  Tiles,
  pickVoice
};
})();
(() => {
  // Luneblaze pitch film — story-driven cut. Reuses cover + helpers from window.LB (luneblaze-film-v3.jsx).
  const LB = window.LB;
  const {
    W,
    H,
    MOTION,
    cl,
    A,
    mix,
    CREAM,
    INK,
    TEAL,
    TTL,
    SANS,
    HEAD,
    camAt,
    camStyle,
    pickVoice
  } = LB;
  const YEL = '#F6D27A',
    SUN = '#F3C35B',
    CORAL = '#EE8C76',
    PEACH = '#F4AE84',
    SAGE = '#A9CF8E',
    MINT = '#6CC5AE',
    LILAC = '#BBA8EC',
    PALE = '#BFE5E9';
  const MARK = 'assets/luneblaze-icon.png';
  const prog = (t, a, b) => cl((t - a) / (b - a), 0, 1);
  const en = (t, a, d = 0.6) => MOTION.enter(t, a, d),
    pp = (t, a, d = 0.6) => MOTION.pop(t, a, d),
    gl = (t, a, d = 0.6) => MOTION.glide(t, a, d);
  const up = (p, d = 28) => ({
    opacity: cl(p, 0, 1),
    transform: `translateY(${(1 - p) * d}px)`
  });
  const popS = (p, from = 0.8) => ({
    opacity: cl(p * 1.5, 0, 1),
    transform: `scale(${mix(from, 1, p)})`
  });
  function Words({
    t,
    at,
    text,
    size = 110,
    y,
    x = 0,
    w = W,
    align = 'center',
    color = INK,
    hi = TTL,
    font = HEAD,
    weight = 400,
    step = 0.08
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: A(x, y, {
        width: w,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.24,
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1,
        color
      })
    }, text.split(' ').map((wd, k) => {
      const p = en(t, at + k * step, 0.65),
        h = wd.startsWith('*');
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        style: {
          overflow: 'hidden',
          padding: `${size * 0.08}px 0 ${size * 0.04}px`
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          color: h ? hi : color,
          transform: `translateY(${(1 - p) * 115}%)`
        }
      }, wd.replace(/\*/g, '')));
    }));
  }
  const Sub = ({
    t,
    at,
    y,
    children,
    color = '#4a4a4a',
    size = 30,
    x = 0,
    w = W,
    align = 'center',
    out,
    weight = 600
  }) => /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: w,
      textAlign: align,
      fontFamily: SANS,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.35,
      color,
      textWrap: 'balance',
      ...up(en(t, at, 0.6) * (out == null ? 1 : 1 - gl(t, out, 0.5)), 18)
    })
  }, children);
  function Card({
    x,
    y,
    w,
    h,
    c,
    p,
    n,
    title: rawTitle,
    sub
  }) {
    const title = typeof rawTitle === 'string' ? rawTitle.split(' ').map((w, i) => i > 0 && /^(and|or|of|the|to|in|on|for|a|an|at|by|with|per|from|&)$/.test(w) ? w : w.split('-').map(q => q.charAt(0).toUpperCase() + q.slice(1)).join('-')).join(' ') : rawTitle;
    return /*#__PURE__*/React.createElement("div", {
      style: A(x, y, {
        width: w,
        height: h,
        ...popS(p)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(8, 10, {
        width: w,
        height: h,
        borderRadius: 22,
        background: c
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: w,
        height: h,
        borderRadius: 22,
        background: '#fff',
        border: `2px solid ${c}`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 22px',
        boxShadow: '0 14px 30px rgba(30,43,48,0.10)'
      })
    }, n != null && /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 14,
        background: c,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: HEAD,
        fontSize: 34,
        color: INK
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 24,
        lineHeight: 1.15,
        color: INK
      }
    }, title), sub && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: 18,
        lineHeight: 1.3,
        color: '#555',
        marginTop: 4
      }
    }, sub))));
  }
  const Badge = ({
    src,
    d
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: d,
      height: d,
      borderRadius: '50%',
      overflow: 'hidden',
      position: 'relative',
      background: '#fff',
      boxShadow: `0 0 0 4px ${TEAL}, 0 10px 24px rgba(30,43,48,0.16)`
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    style: {
      width: d,
      height: d,
      display: 'block'
    }
  }));
  const Ring = ({
    cx,
    cy,
    t,
    at,
    r0 = 140,
    r1 = 520,
    c = TEAL
  }) => {
    const p = prog(t, at, at + 1.1);
    if (p <= 0 || p >= 1) return null;
    const r = mix(r0, r1, Easing.easeOutCubic(p));
    return /*#__PURE__*/React.createElement("div", {
      style: A(cx - r, cy - r, {
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `4px solid ${c}`,
        opacity: 1 - p,
        boxSizing: 'border-box'
      })
    });
  };

  /* 1 — Hook */
  /* 0a — Open: dark iris into the wordmark */
  function SOpen({
    t,
    T
  }) {
    const ic = pp(t, 0.1, 0.7),
      iris = gl(t, 0.75, 0.9),
      mv = gl(t, 0.95, 0.8),
      wipe = gl(t, 1.3, 0.8);
    const R = mix(0, 2300, iris),
      fadeC = en(t, 2.2, 0.6);
    const LX = 410,
      LY = 330,
      LW = 1100,
      sc = LW / 1600;
    const ecx = LX + 203 * sc,
      ecy = LY + 200 * sc,
      esz = 300 * sc * 1.1;
    const sz = mix(320, esz, mv) * ic,
      icx = mix(960, ecx, mv),
      icy = mix(540, ecy, mv),
      ul = gl(t, 2.6, 0.8);
    return /*#__PURE__*/React.createElement(React.Fragment, null, iris < 1 && /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        background: INK
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(260, -160, {
        width: 1400,
        height: 1400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(23,174,185,0.35) 0%, rgba(23,174,185,0) 65%)',
        opacity: ic
      })
    })), /*#__PURE__*/React.createElement(Ring, {
      cx: 960,
      cy: 540,
      t: t,
      at: 0.35,
      r0: 160,
      r1: 760
    }), /*#__PURE__*/React.createElement(Ring, {
      cx: 960,
      cy: 540,
      t: t,
      at: 0.55,
      r0: 160,
      r1: 600,
      c: YEL
    }), /*#__PURE__*/React.createElement("div", {
      style: A(960 - R, 540 - R, {
        width: 2 * R,
        height: 2 * R,
        borderRadius: '50%',
        background: CREAM,
        opacity: 1 - fadeC
      })
    }), /*#__PURE__*/React.createElement("img", {
      src: "assets/logo.png",
      style: A(LX, LY, {
        width: LW,
        height: LW / 4,
        clipPath: `inset(0 ${(1 - wipe) * 78}% 0 22%)`
      })
    }), /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: A(icx - sz / 2, icy - sz / 2, {
        width: sz,
        height: sz
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(W / 2 - 300 * ul, LY + LW / 4 + 18, {
        width: 600 * ul,
        height: 6,
        borderRadius: 3,
        background: YEL
      })
    }));
  }
  /* 0b — Promise: what Luneblaze is */
  function SPromise({
    t,
    T
  }) {
    const card = pp(t, 1.9, 0.9),
      fill = gl(t, 2.4, 2.0) * 0.86,
      gr = 110,
      gc = 2 * Math.PI * gr,
      fl = k => Math.sin(T * 1.4 + k) * 6;
    const rows = [['Documentation', 0.9, SUN], ['Training', 0.74, MINT], ['Audits', 0.82, CORAL]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.5,
      x: 120,
      w: 960,
      align: "left",
      y: 256,
      size: 160,
      text: "Drive *School* *Quality*"
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 1.5,
      x: 120,
      w: 960,
      align: "left",
      y: 600,
      size: 100,
      step: 0.14,
      text: "Inspire *Excellence*"
    }), /*#__PURE__*/React.createElement("div", {
      style: A(126, 735, {
        display: 'flex',
        gap: 12
      })
    }, ['AI-Powered Quality Systems', 'Measurable Progress', 'Continuous Improvement'].map((c, k) => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        borderRadius: 30,
        background: '#fff',
        border: `2px solid ${[SUN, MINT, CORAL][k]}`,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 21,
        color: INK,
        whiteSpace: 'nowrap',
        ...popS(pp(t, 2.4 + k * 0.25))
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: [SUN, MINT, CORAL][k],
        color: INK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 900
      }
    }, "\u2713"), c))), /*#__PURE__*/React.createElement("div", {
      style: A(126, 815, {
        padding: '14px 30px',
        borderRadius: 40,
        background: '#E8F7F8',
        border: `2px solid ${TEAL}`,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 25,
        color: INK,
        whiteSpace: 'nowrap',
        ...popS(pp(t, 3.4, 0.7))
      })
    }, "End-to-End Quality Management For Schools & School Groups"), /*#__PURE__*/React.createElement("div", {
      style: A(1110, 250 + fl(0), {
        width: 660,
        height: 420,
        borderRadius: 32,
        background: '#fff',
        boxShadow: '0 30px 70px rgba(30,43,48,0.16)',
        ...popS(card)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(36, 30, {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 24,
        color: INK
      })
    }, "School Quality Score"), /*#__PURE__*/React.createElement("div", {
      style: A(36, 64, {
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 17,
        color: '#7a8a8f'
      })
    }, "Live \xB7 all 7 domains"), /*#__PURE__*/React.createElement("svg", {
      width: "300",
      height: "300",
      style: A(30, 100)
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "150",
      cy: "150",
      r: gr,
      fill: "none",
      stroke: "#EEF2F3",
      strokeWidth: "26"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "150",
      cy: "150",
      r: gr,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "26",
      strokeLinecap: "round",
      strokeDasharray: `${gc * fill} ${gc}`,
      transform: "rotate(-90 150 150)"
    })), /*#__PURE__*/React.createElement("div", {
      style: A(30, 100, {
        width: 300,
        height: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: HEAD,
        fontSize: 96,
        color: INK
      })
    }, Math.round(fill * 100)), rows.map(([l, v, c], k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: A(360, 140 + k * 82, {
        width: 260
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 19,
        color: INK
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        height: 14,
        borderRadius: 7,
        background: '#EEF2F3',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${v * gl(t, 2.7 + k * 0.25, 1.2) * 100}%`,
        height: 14,
        borderRadius: 7,
        background: c
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      style: A(1420, 180 + fl(3), {
        padding: '14px 24px',
        borderRadius: 30,
        background: YEL,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 20,
        color: INK,
        boxShadow: '0 12px 26px rgba(30,43,48,0.14)',
        ...popS(pp(t, 3.3))
      })
    }, "AI insight: 3 gaps to fix"), /*#__PURE__*/React.createElement("div", {
      style: A(1250, 700 + fl(2), {
        padding: '16px 26px',
        borderRadius: 30,
        background: INK,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 22,
        color: '#fff',
        boxShadow: '0 12px 26px rgba(30,43,48,0.2)',
        ...popS(pp(t, 4.4))
      })
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: YEL
      }
    }, "\u2713"), "\xA0 Inspection ready"));
  }
  /* 0c — Seven domains as one weighted ring */
  const DOM7 = [['Curriculum, Pedagogy & Assessment', 40, PEACH], ['Infrastructure', 10, SAGE], ['Human Resources', 10, SUN], ['Inclusive Practices', 10, LILAC], ['Management & Governance', 10, MINT], ['Leadership', 10, YEL], ['Beneficiary Satisfaction', 10, CORAL]];
  function SDomains7({
    t,
    T
  }) {
    const cx = 1300,
      cy = 560,
      R = 250,
      c = 2 * Math.PI * R,
      oc = 2 * Math.PI * (R + 70),
      close = gl(t, 4.0, 1.0),
      core = pp(t, 0.5, 0.8);
    let a0 = -90;
    const segs = DOM7.map(([n, pct, col], k) => {
      const deg = pct * 3.6,
        s = {
          n,
          pct,
          col,
          a: a0,
          deg,
          k
        };
      a0 += deg;
      return s;
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: A(120, 150, {
        fontFamily: HEAD,
        fontSize: 470,
        lineHeight: 1,
        color: TTL,
        ...popS(pp(t, 0.3, 0.8), 0.6)
      })
    }, "7"), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.7,
      x: 136,
      w: 720,
      align: "left",
      y: 620,
      size: 96,
      text: "Quality *Domains*"
    }), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 4.1,
      x: 140,
      w: 680,
      align: "left",
      y: 760,
      size: 40,
      weight: 800,
      color: INK
    }, "Measured as one system."), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, segs.map(s => {
      const p = gl(t, 1.85 + s.k * 0.26, 0.5),
        len = (s.deg - 2.4) / 360 * c * p;
      return /*#__PURE__*/React.createElement("circle", {
        key: s.n,
        cx: cx,
        cy: cy,
        r: R,
        fill: "none",
        stroke: s.col,
        strokeWidth: "96",
        strokeDasharray: `${len} ${c}`,
        transform: `rotate(${s.a + 1.2} ${cx} ${cy})`
      });
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: R + 70,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "5",
      strokeLinecap: "round",
      strokeDasharray: `${oc * close} ${oc}`,
      transform: `rotate(-90 ${cx} ${cy})`
    })), /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: cy,
      t: t,
      at: 4.6,
      r0: R + 70,
      r1: R + 260
    }), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 150, cy - 150, {
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 50px rgba(23,174,185,0.22)',
        transform: `scale(${core})`
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: {
        width: 200,
        height: 200
      }
    })), segs.map(s => {
      const m = (s.a + s.deg / 2) * Math.PI / 180,
        x = cx + Math.cos(m) * 450,
        y = cy + Math.sin(m) * 375,
        p = pp(t, 2.05 + s.k * 0.26, 0.6);
      return /*#__PURE__*/React.createElement("div", {
        key: s.n,
        style: A(x - 120, y - 40, {
          width: 240,
          textAlign: 'center',
          ...popS(p)
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: HEAD,
          fontSize: 46,
          lineHeight: 1,
          color: INK
        }
      }, s.pct, "%"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.2,
          color: '#3b4a4f',
          textWrap: 'balance'
        }
      }, s.n));
    }));
  }
  /* 0d — Frameworks */
  function SFrameworks({
    t,
    T
  }) {
    const B = [['SQAAF', 'School Quality Assessment & Assurance Framework', TEAL, '#fff', 520, 1.0], ['NABET', 'National Accreditation Board for Education & Training', YEL, INK, 1400, 3.7]];
    const mid = pp(t, 0.4, 0.7);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.15,
      y: 110,
      size: 90,
      text: "Aligned with"
    }), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, B.map(([n,, c,, x, at]) => {
      const p = gl(t, at + 0.2, 0.6);
      return /*#__PURE__*/React.createElement("line", {
        key: n,
        x1: 960,
        y1: 540,
        x2: mix(960, x, p),
        y2: 540,
        stroke: c,
        strokeWidth: "6",
        strokeDasharray: "2 14",
        strokeLinecap: "round"
      });
    })), /*#__PURE__*/React.createElement("div", {
      style: A(860, 440, {
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 20px 50px rgba(30,43,48,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${mid})`
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: {
        width: 140,
        height: 140
      }
    })), B.map(([n, full, c, fg, x, at]) => {
      const p = pp(t, at, 0.8);
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: n
      }, /*#__PURE__*/React.createElement(Ring, {
        cx: x,
        cy: 540,
        t: t,
        at: at + 0.1,
        r0: 210,
        r1: 380,
        c: c
      }), /*#__PURE__*/React.createElement("div", {
        style: A(x - 210, 330, {
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: c,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 30px 60px rgba(30,43,48,0.18)',
          fontFamily: HEAD,
          fontSize: 170,
          color: fg,
          opacity: cl(p * 1.5, 0, 1),
          transform: `scale(${p}) rotate(${(1 - p) * -20}deg)`
        })
      }, n), /*#__PURE__*/React.createElement("div", {
        style: A(x - 300, 790, {
          width: 600,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 28,
          lineHeight: 1.3,
          color: INK,
          textWrap: 'balance',
          ...up(en(t, at + 0.5, 0.6), 16)
        })
      }, full));
    }));
  }
  function SHook({
    t
  }) {
    const u = gl(t, 4.9, 0.8);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.3,
      y: 300,
      size: 130,
      text: "Every school promises quality."
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 3.55,
      y: 480,
      size: 190,
      step: 0.16,
      text: "*Very* *few* *can* *prove* *it.*"
    }), /*#__PURE__*/React.createElement("div", {
      style: A(W / 2 - 340 * u, 730, {
        width: 680 * u,
        height: 12,
        borderRadius: 6,
        background: YEL
      })
    }));
  }
  /* 2 — Accreditation: certificate becomes a system */
  const ACC = [['Ready for inspection', 'Assessments, documents, onsite visits', SUN], ['Stakeholder confidence', 'Transparent, structured practice', SAGE], ['Beyond individuals', 'Systems that outlast staff changes', CORAL], ['Measurable performance', 'Strengths and gaps, by domain', PEACH], ['Planned improvement', 'Owners, timelines, resources', SUN], ['Continuous growth', 'Stronger with every cycle', MINT]];
  function SAccreditation({
    t,
    T
  }) {
    const cx = 960,
      cy = 620,
      m = gl(t, 3.5, 0.9),
      core = pp(t, 3.9, 0.8),
      c0 = pp(t, 0.6, 0.7);
    const rows = [440, 620, 800];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.2,
      y: 70,
      size: 92,
      text: "Accreditation isn't just a certificate."
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 3.75,
      y: 175,
      size: 92,
      text: "It's a *system* for sustained quality."
    }), m < 1 && /*#__PURE__*/React.createElement("div", {
      style: A(cx - 260, cy - 180, {
        width: 520,
        height: 360,
        opacity: (1 - m) * cl(c0 * 1.4, 0, 1),
        transform: `scale(${mix(0.85, 1, c0) * mix(1, 0.3, m)}) rotate(${mix(-3, 25, m)}deg)`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 520,
        height: 360,
        borderRadius: 20,
        background: '#fff',
        border: `8px solid ${YEL}`,
        boxSizing: 'border-box',
        boxShadow: '0 24px 50px rgba(30,43,48,0.16)'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 46, {
        width: 504,
        textAlign: 'center',
        fontFamily: HEAD,
        fontSize: 70,
        color: INK,
        letterSpacing: 4
      })
    }, "CERTIFICATE"), [150, 185, 220].map((y, k) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: A(80, y, {
        width: k === 2 ? 220 : 344,
        height: 12,
        borderRadius: 6,
        background: '#E8E1D3'
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: A(370, 210, {
        width: 104,
        height: 104,
        borderRadius: '50%',
        background: SUN,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 48,
        color: INK
      })
    }, "\u2713"))), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, ACC.map((_, k) => {
      const left = k < 3,
        y = rows[k % 3],
        x2 = left ? 570 : 1350,
        x1 = cx + (left ? -170 : 170),
        p = gl(t, 4.8 + k * 0.75, 0.5);
      return /*#__PURE__*/React.createElement("line", {
        key: k,
        x1: x1,
        y1: cy,
        x2: mix(x1, x2, p),
        y2: mix(cy, y, p),
        stroke: ACC[k][2],
        strokeWidth: "4",
        strokeDasharray: "2 10",
        strokeLinecap: "round"
      });
    })), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 170, cy - 170, {
        width: 340,
        height: 340,
        borderRadius: '50%',
        background: '#fff',
        border: `10px solid ${TEAL}`,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${core})`,
        boxShadow: '0 20px 50px rgba(23,174,185,0.25)'
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: {
        width: 236,
        height: 236,
        display: 'block',
        transform: `scale(${1 + 0.03 * Math.sin(T * 1.6)})`
      }
    })), /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: cy,
      t: t,
      at: 4.0,
      r0: 170,
      r1: 420
    }), ACC.map(([ti, su, c], k) => /*#__PURE__*/React.createElement(Card, {
      key: ti,
      x: k < 3 ? 150 : 1350,
      y: rows[k % 3] - 60,
      w: 420,
      h: 120,
      c: c,
      n: '0' + (k + 1),
      title: ti,
      sub: su,
      p: pp(t, 5.0 + k * 0.75)
    })));
  }
  /* 3 — Stakes: quality is public now */
  const STK = [['Reputation', 'How your community sees you', SUN], ['Admissions', 'Parent confidence & growth', PEACH], ['Measured quality', 'Strengths & gaps, by domain', CORAL], ['Accountability', 'Clear roles, documented process', LILAC], ['Continuous improvement', 'From one-time prep to habit', MINT]];
  function SStakes({
    t
  }) {
    const base = 900,
      bars = STK.map((_, k) => ({
        x: 230 + k * 300,
        h: 220 + k * 70
      })),
      line = gl(t, 7.2, 1.4);
    const BAR = [2.5, 4.0, 4.9, 5.6, 6.3];
    const p0 = [bars[0].x + 40, base - bars[0].h - 60],
      p1 = [bars[4].x + 250, base - bars[4].h - 70];
    const tip = [mix(p0[0], p1[0], line), mix(p0[1], p1[1], line)],
      ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180 / Math.PI;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.2,
      y: 70,
      size: 110,
      text: "Under SQAAF, quality is *public.*"
    }), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 0.8,
      y: 212,
      size: 34,
      weight: 800,
      color: TTL
    }, "Schools Are Graded From A+ to C as per Their Quality Standard"), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 1.4,
      y: 268,
      size: 28,
      out: 8.4
    }, "It Shapes Reputation, Admissions and Accountability."), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 8.8,
      y: 268,
      size: 28,
      weight: 700,
      color: INK
    }, "Not a Yearly Exercise. A Way of Running the School."), bars.map((b, k) => {
      const r = gl(t, BAR[k] - 0.3, 0.8),
        tx = en(t, BAR[k] + 0.2, 0.5),
        [ti, su, c] = STK[k];
      return /*#__PURE__*/React.createElement("div", {
        key: ti,
        style: A(b.x, base - b.h * r, {
          width: 260,
          height: b.h * r,
          borderRadius: '24px 24px 6px 6px',
          background: c,
          overflow: 'hidden',
          boxSizing: 'border-box',
          padding: '16px 20px'
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          ...up(tx, 14)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: HEAD,
          fontSize: 64,
          lineHeight: 1,
          color: 'rgba(30,43,48,0.55)'
        }
      }, '0' + (k + 1)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 24,
          lineHeight: 1.15,
          color: INK,
          marginTop: 6
        }
      }, ti), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 17,
          lineHeight: 1.3,
          color: '#2f3a3e',
          marginTop: 6
        }
      }, su)));
    }), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, line > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: p0[0],
      y1: p0[1],
      x2: tip[0] - Math.cos(ang * Math.PI / 180) * 20,
      y2: tip[1] - Math.sin(ang * Math.PI / 180) * 20,
      stroke: INK,
      strokeWidth: "7",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("g", {
      transform: `translate(${tip[0]} ${tip[1]}) rotate(${ang})`
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 6 0 L -30 -19 L -22 0 L -30 19 Z",
      fill: INK,
      strokeLinejoin: "round"
    })), /*#__PURE__*/React.createElement("circle", {
      cx: p0[0],
      cy: p0[1],
      r: "9",
      fill: INK
    }))));
  }
  /* 4 — Problem (dark) */
  const PAPERS = Array.from({
    length: 16
  }, (_, k) => ({
    x: 600 + k * 137 % 560,
    y: 400 + k * 89 % 260,
    r: k * 53 % 50 - 25
  }));
  const PROB = [['Paper-based processes', 'Hard to track, update, retrieve', SUN], ['Scattered evidence', 'Inspections become stressful', CORAL], ['Overloaded faculty', 'Hours lost to meetings & records', PEACH], ['No real-time visibility', 'Unclear progress and ownership', SAGE], ['Last-minute panic', 'Staff never quite inspection-ready', MINT], ['Constant retraining', 'Teams need regular handholding', LILAC]];
  function Sheet({
    x,
    y,
    r,
    s = 1,
    o = 1
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: A(x, y, {
        width: 170,
        height: 220,
        borderRadius: 8,
        background: '#fff',
        boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
        opacity: o,
        transform: `rotate(${r}deg) scale(${s})`,
        boxSizing: 'border-box',
        padding: '26px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      })
    }, [1, 0.8, 1, 0.6, 0.9].map((w, k) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        height: 9,
        width: `${w * 100}%`,
        borderRadius: 5,
        background: '#DDD6C8'
      }
    })));
  }
  function SProblem({
    t,
    T
  }) {
    const rows = [290, 490, 690];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        background: INK
      })
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.5,
      y: 80,
      size: 120,
      color: "#fff",
      hi: YEL,
      step: 0.32,
      text: "But quality still lives on *paper.*"
    }), PAPERS.map((p, k) => {
      const f = pp(t, 2.6 + k * 0.1, 0.7),
        jit = t > 5 ? Math.sin(T * 14 + k) * 1.4 : 0;
      return /*#__PURE__*/React.createElement(Sheet, {
        key: k,
        x: p.x,
        y: mix(p.y - 1100, p.y, f),
        r: p.r + jit,
        o: t > 2.6 + k * 0.1 ? 1 : 0
      });
    }), PROB.map(([ti, su, c], k) => {
      const p = pp(t, [3.6, 4.4, 6.1, 7.0, 7.8, 9.6][k], 0.5),
        left = k < 3;
      return /*#__PURE__*/React.createElement("div", {
        key: ti,
        style: A(left ? 110 : 1510, rows[k % 3], {
          width: 300,
          height: 160,
          background: c,
          borderRadius: 6,
          boxSizing: 'border-box',
          padding: 22,
          boxShadow: '0 16px 30px rgba(0,0,0,0.3)',
          opacity: cl(p * 1.6, 0, 1),
          transform: `scale(${mix(1.5, 1, p)}) rotate(${k % 2 ? 3 : -3}deg)`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 25,
          lineHeight: 1.15,
          color: INK
        }
      }, ti), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 18,
          lineHeight: 1.3,
          color: '#2f3a3e',
          marginTop: 8
        }
      }, su));
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 10.6,
      y: 888,
      size: 46,
      font: SANS,
      weight: 800,
      color: "#fff",
      hi: YEL,
      step: 0.05,
      text: "Schools don't need more documents. They need *one* *system.*"
    }));
  }
  /* 5 — Turn: paperwork collapses into Luneblaze */
  const ENB = [['One home for evidence', 'Documents, policies, records', SUN], ['Real-time tracking', 'Every domain, gaps spotted early', MINT], ['Clear ownership', 'Right task, right person, tracked', CORAL], ['Always inspection-ready', 'All year, not last minute', SAGE], ['Standard processes', 'Repeatable across campuses', LILAC]];
  const ENB_POS = [[110, 360], [110, 620], [1390, 360], [1390, 620], [750, 800]];
  function STurn({
    t,
    T
  }) {
    const cx = 960,
      cy = 560,
      suck = gl(t, 0.3, 0.9),
      lg = pp(t, 1.0, 0.9),
      strike = gl(t, 3.7, 0.5);
    const M2 = gl(t, 7.4, 0.8),
      fo = gl(t, 7.3, 0.6),
      ly = cy - 170 * M2;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: 1 - fo
      })
    }, suck < 1 && Array.from({
      length: 10
    }, (_, k) => {
      const a = k * 36 * Math.PI / 180,
        r = mix(560, 0, suck);
      return /*#__PURE__*/React.createElement(Sheet, {
        key: k,
        x: cx - 85 + Math.cos(a) * r,
        y: cy - 110 + Math.sin(a) * r * 0.7,
        r: k * 33 + suck * 200,
        s: mix(0.7, 0.05, suck),
        o: 1 - prog(t, 1.2, 1.5)
      });
    }), /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: cy,
      t: t,
      at: 1.1,
      r0: 150,
      r1: 700
    }), /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: cy,
      t: t,
      at: 1.4,
      r0: 150,
      r1: 560,
      c: YEL
    }), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, ENB_POS.map(([x, y], k) => {
      const p = gl(t, 5.2 + k * 0.35, 0.5),
        tx = x + 210,
        ty = y + 60;
      return /*#__PURE__*/React.createElement("line", {
        key: k,
        x1: cx,
        y1: cy,
        x2: mix(cx, tx, p),
        y2: mix(cy, ty, p),
        stroke: TEAL,
        strokeWidth: "4",
        strokeDasharray: "2 10",
        strokeLinecap: "round"
      });
    }))), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 150, cy - 150, {
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 24px 60px rgba(23,174,185,0.3)',
        transform: `translateY(${-170 * M2}px) scale(${lg * mix(1, 0.8, M2)})`
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: {
        width: 236,
        height: 236,
        display: 'block'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: 1 - fo
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        opacity: 1 - 0.45 * strike
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 2.4,
      y: 60,
      size: 92,
      color: "#6f6f6f",
      text: "From managing paperwork"
    })), /*#__PURE__*/React.createElement("div", {
      style: A(W / 2 - 460, 118, {
        width: 920 * strike,
        height: 8,
        borderRadius: 4,
        background: CORAL
      })
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 4.0,
      y: 165,
      size: 110,
      text: "to managing *quality.*"
    }), ENB.map(([ti, su, c], k) => /*#__PURE__*/React.createElement(Card, {
      key: ti,
      x: ENB_POS[k][0],
      y: ENB_POS[k][1],
      w: 420,
      h: 120,
      c: c,
      n: '0' + (k + 1),
      title: ti,
      sub: su,
      p: pp(t, 5.4 + k * 0.35)
    }))), t > 7.3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: ly,
      t: t,
      at: 7.9,
      r0: 150,
      r1: 620
    }), /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: ly,
      t: t,
      at: 8.3,
      r0: 150,
      r1: 480,
      c: YEL
    }), (() => {
      const r0 = 150 * mix(1, 0.8, M2),
        DC = [SUN, MINT, CORAL, SAGE, LILAC, PEACH, TEAL],
        R1 = r0 + 40,
        R2 = r0 + 78,
        C1 = 2 * Math.PI * R1,
        seg = C1 / 7;
      const pulse = 1 + 0.035 * Math.sin(T * 2.6) * en(t, 9.2, 0.6),
        rot = (t - 7.9) * 6,
        glow = en(t, 7.8, 0.8);
      const chips = [['Quality Systems', SUN, -330, 0], ['Quality Excellence', CORAL, 0, -R2 - 52], ['Quality Governance', MINT, 330, 0]];
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: A(cx - 420, ly - 420, {
          width: 840,
          height: 840,
          borderRadius: '50%',
          opacity: glow,
          background: 'radial-gradient(circle, rgba(23,174,185,0.20) 0%, rgba(246,210,122,0.14) 38%, rgba(255,255,255,0) 66%)'
        })
      }), /*#__PURE__*/React.createElement("svg", {
        width: W,
        height: H,
        style: A(0, 0)
      }, /*#__PURE__*/React.createElement("g", {
        transform: `translate(${cx} ${ly}) scale(${pulse}) rotate(${rot})`
      }, DC.map((c, k) => {
        const d = gl(t, 7.9 + k * 0.16, 0.5),
          len = (seg - 14) * d;
        return /*#__PURE__*/React.createElement("circle", {
          key: k,
          r: R1,
          fill: "none",
          stroke: c,
          strokeWidth: "24",
          strokeLinecap: "round",
          strokeDasharray: `${len} ${C1}`,
          transform: `rotate(${-90 + k * 360 / 7 + 3})`
        });
      }), /*#__PURE__*/React.createElement("circle", {
        r: R2,
        fill: "none",
        stroke: TEAL,
        strokeOpacity: "0.35",
        strokeWidth: "2",
        strokeDasharray: "3 12"
      }), Array.from({
        length: 3
      }, (_, k) => {
        const a = T * 0.7 + k * 2 * Math.PI / 3;
        return /*#__PURE__*/React.createElement("circle", {
          key: k,
          cx: Math.cos(a) * R2,
          cy: Math.sin(a) * R2,
          r: "8",
          fill: [SUN, CORAL, MINT][k],
          opacity: en(t, 8.9, 0.5)
        });
      }))), chips.map(([l, c, dx, dy], k) => /*#__PURE__*/React.createElement("div", {
        key: l,
        style: A(cx + dx - 140, ly + dy - 24, {
          width: 280,
          display: 'flex',
          justifyContent: 'center',
          ...popS(pp(t, 8.9 + k * 0.25, 0.6))
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 20px',
          borderRadius: 26,
          background: '#fff',
          border: `2px solid ${c}`,
          boxShadow: '0 10px 24px rgba(30,43,48,0.10)',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 20,
          color: INK,
          whiteSpace: 'nowrap'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: c
        }
      }), l))));
    })(), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 7.8,
      y: 600,
      size: 84,
      text: "Building the"
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 8.3,
      y: 690,
      size: 190,
      text: "*Quality* *Muscle*"
    }), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 9.3,
      y: 905,
      size: 40,
      weight: 800,
      color: INK
    }, "in Schools")));
  }
  /* 8a — Group intro: many schools, many problems → one connected network */
  const GSCH = [['Different standards', SUN], ['No group-wide view', CORAL], ['Scattered evidence', PEACH], ['Uneven readiness', LILAC], ['Reports on email & Excel', SAGE], ['Leadership blind spots', MINT]];
  function SGroupIntro({
    t,
    T
  }) {
    const GO = 2.6,
      tOut = gl(t, GO - 0.5, 0.5);
    return /*#__PURE__*/React.createElement(React.Fragment, null, t < GO + 0.1 && /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        opacity: 1 - tOut,
        transform: `translateY(${-tOut * 60}px)`
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.2,
      y: 330,
      size: 130,
      text: "Running a *group* of schools?"
    }), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 0.9,
      y: 510
    }, "One Quality Vision. Every Campus. Measurable Progress.")), t > GO - 0.4 && /*#__PURE__*/React.createElement(SGroupIntroBody, {
      t: t - GO,
      T: T
    }));
  }
  const GT = [2.4, 3.9, 5.45, 6.95, 7.6, 8.25];
  function SGroupIntroBody({
    t,
    T
  }) {
    const cx = 960,
      cy = 560,
      RX = 640,
      RY = 250,
      RES = 10.8;
    const fix = gl(t, RES, 0.9),
      hub = pp(t, RES + 0.2, 0.8),
      t1 = 1 - gl(t, RES - 0.4, 0.5),
      t2 = en(t, RES + 0.3, 0.6);
    const pos = GSCH.map((_, k) => {
      const a = (-60 + k * 60) * Math.PI / 180;
      return [cx + Math.cos(a) * RX, cy + Math.sin(a) * RY];
    });
    const tagY = k => k === 0 || k === 5 ? pos[k][1] - 118 : pos[k][1] + 70;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        opacity: t1
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.3,
      y: 50,
      size: 104,
      text: "Many schools. *Many* *problems.*",
      hi: CORAL
    })), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        opacity: t2
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: RES + 0.4,
      y: 50,
      size: 100,
      text: "One vision. One standard. *Every* *school.*"
    })), /*#__PURE__*/React.createElement("div", {
      style: A(0, 182, {
        width: W,
        display: 'flex',
        justifyContent: 'center',
        gap: 14
      })
    }, [['Centralize Quality', SUN], ['Standardize Operations', MINT], ['Accelerate SQAAF Readiness', CORAL]].map(([l, col], k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 22px',
        borderRadius: 30,
        background: '#fff',
        border: `2px solid ${col}`,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 22,
        color: INK,
        ...popS(pp(t, RES + 1.6 + k * 0.25))
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: col
      }
    }), l))), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, pos.map(([x, y], k) => [1, 3].map(d => {
      const [x2, y2] = pos[(k + d) % 6],
        p = gl(t, 1.0 + k * 0.15, 0.6),
        jit = Math.sin(T * 6 + k * 2 + d) * 6;
      return /*#__PURE__*/React.createElement("line", {
        key: k + '-' + d,
        x1: x,
        y1: y,
        x2: mix(x, x2, p) + jit,
        y2: mix(y, y2, p) - jit,
        stroke: CORAL,
        strokeWidth: "3",
        strokeDasharray: "6 14",
        opacity: 0.55 * (1 - fix)
      });
    })), pos.map(([x, y], k) => {
      const p = gl(t, RES + 0.4 + k * 0.1, 0.5);
      return /*#__PURE__*/React.createElement("line", {
        key: 'h' + k,
        x1: x,
        y1: y,
        x2: mix(x, cx, p),
        y2: mix(y, cy, p),
        stroke: TEAL,
        strokeWidth: "5",
        strokeLinecap: "round",
        opacity: fix
      });
    }), t > RES + 1.2 && pos.map(([x, y], k) => {
      const q = (T * 0.55 + k * 0.17) % 1;
      return /*#__PURE__*/React.createElement("circle", {
        key: 'd' + k,
        cx: mix(x, cx, q),
        cy: mix(y, cy, q),
        r: "9",
        fill: YEL,
        stroke: INK,
        strokeWidth: "2",
        opacity: Math.sin(q * Math.PI)
      });
    })), /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: cy,
      t: t,
      at: RES + 0.3,
      r0: 130,
      r1: 520
    }), /*#__PURE__*/React.createElement(Ring, {
      cx: cx,
      cy: cy,
      t: t,
      at: RES + 0.6,
      r0: 130,
      r1: 400,
      c: YEL
    }), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 130, cy - 130, {
        width: 260,
        height: 260,
        borderRadius: '50%',
        background: TEAL,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 24px 60px rgba(23,174,185,0.35)',
        transform: `scale(${hub})`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: HEAD,
        fontSize: 64,
        lineHeight: 1,
        color: '#fff'
      }
    }, "ONE PORTAL"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 20,
        color: '#E6F7F8',
        marginTop: 6
      }
    }, "for every campus")), pos.map(([x, y], k) => {
      const p = pp(t, 0.6 + k * 0.15, 0.6),
        shake = (1 - fix) * Math.sin(T * 9 + k * 2) * 3 * en(t, GT[k], 0.3),
        ok = fix > 0.5;
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        style: A(x - 58 + shake, y - 58, {
          width: 116,
          height: 116,
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 0 5px ${ok ? TEAL : '#E3DCCF'}, 0 14px 30px rgba(30,43,48,0.14)`,
          transform: `scale(${p})`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 54,
          height: 50,
          background: ok ? TEAL : '#9AA6AA',
          clipPath: 'polygon(50% 0, 100% 42%, 100% 100%, 62% 100%, 62% 68%, 38% 68%, 38% 100%, 0 100%, 0 42%)'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: A(78, -4, {
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: ok ? '#2FB57C' : CORAL,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 22,
          transform: `scale(${pp(t, ok ? RES + 0.6 + k * 0.1 : GT[k], 0.5)})`
        })
      }, ok ? '✓' : '!'));
    }), GSCH.map(([l, c], k) => {
      const p = pp(t, GT[k], 0.6),
        st = gl(t, RES - 0.9 + k * 0.05, 0.4);
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: A(pos[k][0] - 170, tagY(k), {
          width: 340,
          display: 'flex',
          justifyContent: 'center',
          opacity: cl(p * 1.5, 0, 1) * t1,
          transform: `scale(${mix(0.8, 1, p)})`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          padding: '10px 20px',
          borderRadius: 26,
          background: '#fff',
          border: `2px solid ${c}`,
          boxShadow: '0 10px 22px rgba(30,43,48,0.10)',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 21,
          color: INK,
          whiteSpace: 'nowrap'
        }
      }, l, /*#__PURE__*/React.createElement("span", {
        style: A(16, '50%', {
          width: `calc(${st * 100}% - 32px)`,
          height: 3,
          background: CORAL,
          borderRadius: 2
        })
      })));
    }));
  }
  /* 5a — Live portal screens (rebuilt from the product screenshots) */
  const LpPCard = ({
    x,
    y,
    w,
    h,
    p = 1,
    pad = 16,
    children,
    style
  }) => /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: w,
      height: h,
      borderRadius: 14,
      background: '#fff',
      border: '1px solid #E6ECEE',
      boxShadow: '0 6px 16px rgba(30,43,48,0.05)',
      boxSizing: 'border-box',
      padding: pad,
      overflow: 'hidden',
      ...popS(p, 0.94),
      ...style
    })
  }, children);
  const PBar = ({
    v,
    c = TEAL,
    hgt = 8
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: hgt,
      borderRadius: hgt / 2,
      background: '#EEF2F3',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${cl(v, 0, 1) * 100}%`,
      height: hgt,
      borderRadius: hgt / 2,
      background: c
    }
  }));
  const PH = ({
    title,
    sub,
    right
  }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: A(24, 18, {
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 22,
      color: INK
    })
  }, title), sub && /*#__PURE__*/React.createElement("div", {
    style: A(24, 48, {
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 13,
      color: '#7a8a8f'
    })
  }, sub), right);
  const ptx = (s, wt = 600, c = INK) => ({
    fontFamily: SANS,
    fontWeight: wt,
    fontSize: s,
    color: c
  });
  const Btn = ({
    x,
    y,
    w,
    label,
    press,
    done,
    doneLabel,
    ghost
  }) => /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: w,
      height: 34,
      borderRadius: 9,
      background: done ? '#2FB57C' : ghost ? '#fff' : TEAL,
      border: ghost ? `1.5px solid ${TEAL}` : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...ptx(13, 700, ghost && !done ? TTL : '#fff'),
      transform: `scale(${1 - 0.08 * Math.sin(Math.PI * cl(press || 0, 0, 1))})`,
      boxShadow: '0 4px 10px rgba(23,174,185,0.18)'
    })
  }, done ? doneLabel : label);
  const LpNAV = ['Dashboard', 'Documents & Evidence', 'Workflow & CLT', 'Progress & Maturity', 'Readiness Score', 'Expert & Webinars', 'Improvement Plans', 'Self-Assessment', 'Observations & Audits'];
  function PDash({
    lt
  }) {
    const c = en(lt, 0.2, 1.4);
    const K = [['SQAAF Progress', Math.round(84 * c) + '%', TEAL, 0.84], ['Documents', Math.round(34 * c) + '/132', SUN, 34 / 132], ['Evidences', Math.round(23 * c) + '/162', MINT, 23 / 162], ['Readiness Score', Math.round(400 * c), CORAL, 400 / 900]];
    const D = [72, 69, 87, 82, 97, 67, 96],
      R = [['Evidence uploaded', 'Domain 1.2.3'], ['Document approved', 'Policy Document'], ['CLT meeting completed', 'July Meeting'], ['Improvement plan updated', 'Domain 3']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Good Afternoon",
      sub: "SQAAF \xB7 School Quality Assessment & Assurance Framework"
    }), K.map(([l, v, col, f], i) => /*#__PURE__*/React.createElement(LpPCard, {
      key: l,
      x: 24 + i * 196,
      y: 84,
      w: 182,
      h: 124,
      p: pp(lt, 0.05 + i * 0.08, 0.5)
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 600, '#6b7b80')
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(32, 800),
        margin: '8px 0 12px'
      }
    }, v), /*#__PURE__*/React.createElement(PBar, {
      v: f * c,
      c: col
    }))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 224,
      w: 480,
      h: 340,
      p: pp(lt, 0.3, 0.5),
      pad: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(16, 800)
    }, "Progress Domain Wise"), D.map((v, k) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        ...ptx(13, 600, '#51626A')
      }
    }, "Domain ", k + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(PBar, {
      v: v / 100 * gl(lt, 0.4 + k * 0.08, 0.8)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        textAlign: 'right',
        ...ptx(13, 700, TTL)
      }
    }, Math.round(v * gl(lt, 0.4 + k * 0.08, 0.8)), "%")))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 520,
      y: 224,
      w: 276,
      h: 340,
      p: pp(lt, 0.4, 0.5),
      pad: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(16, 800)
    }, "Recent Activities"), R.map(([a, b], k) => /*#__PURE__*/React.createElement("div", {
      key: a,
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 16,
        ...up(en(lt, 0.7 + k * 0.25, 0.4), 10)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 8,
        background: '#E3F6EC',
        color: '#2FB57C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(14, 900, '#2FB57C')
      }
    }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 700)
    }, a), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 500, '#8a989d')
    }, b))))));
  }
  function PReady({
    lt
  }) {
    const press = prog(lt, 0.15, 0.5),
      c = gl(lt, 0.5, 1.4),
      score = Math.round(788 * c);
    const G = [['Documentation', 87, [['Completeness', 34, 40], ['Evidence', 23, 30], ['Level', 18, 20]], '#2FB57C'], ['Staff Inclusivity', 74, [['Participation', 28, 35], ['Engagement', 19, 25], ['Distribution', 12, 20]], '#E0A100'], ['Audit', 80, [['External', 36, 40], ['Internal', 22, 30], ['Surprise', 14, 20]], '#2FB57C']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Readiness Dashboard",
      sub: "SQAAF \u2014 School Quality Assessment & Assurance Framework 2025",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 660,
        y: 20,
        w: 136,
        label: press > 0 && press < 1 ? '↻ Calculating…' : '↻ Recalculate',
        press: press
      })
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 84,
      w: 772,
      h: 140,
      p: pp(lt, 0.05, 0.5),
      pad: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(16, 800)
    }, "Readiness Score"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '3px 10px',
        borderRadius: 10,
        background: '#E3F6EC',
        ...ptx(12, 700, '#2FB57C')
      }
    }, "Excellent")), /*#__PURE__*/React.createElement("div", {
      style: A(20, 56, {
        width: 520,
        height: 14,
        borderRadius: 7,
        background: 'linear-gradient(90deg,#EF4444,#F59E0B,#EAB308,#22C55E)'
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(20 + 520 * (788 / 900) * c - 11, 52, {
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(20, 80, {
        display: 'flex',
        justifyContent: 'space-between',
        width: 520,
        ...ptx(11, 600, '#8a989d')
      })
    }, /*#__PURE__*/React.createElement("span", null, "Poor"), /*#__PURE__*/React.createElement("span", null, "Average"), /*#__PURE__*/React.createElement("span", null, "Good"), /*#__PURE__*/React.createElement("span", null, "Excellent")), /*#__PURE__*/React.createElement("div", {
      style: A(580, 34, {
        textAlign: 'center',
        width: 170
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(54, 800)
    }, score), /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 500, '#7a8a8f')
    }, "out of 900 \xB7 ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#E0A100',
        fontWeight: 800
      }
    }, "Level 3")))), G.map(([t2, tot, rows, col], i) => /*#__PURE__*/React.createElement(LpPCard, {
      key: t2,
      x: 24 + i * 262,
      y: 240,
      w: 248,
      h: 250,
      p: pp(lt, 0.25 + i * 0.1, 0.5),
      pad: 18
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(16, 800)
    }, t2), rows.map(([l, a, b], k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        ...ptx(12, 600, '#51626A')
      }
    }, /*#__PURE__*/React.createElement("span", null, l), /*#__PURE__*/React.createElement("span", null, Math.round(a * gl(lt, 0.6 + k * 0.1, 0.9)), "/", b)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(PBar, {
      v: a / b * gl(lt, 0.6 + k * 0.1, 0.9)
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 10,
        background: col === '#2FB57C' ? '#E3F6EC' : '#FEF3C7',
        ...ptx(13, 800, col)
      }
    }, Math.round(tot * c), " / 100"))));
  }
  function PImprove({
    lt
  }) {
    const rows = [['Improve classroom observation practices', ['Conduct peer observation visits once per term', 'Introduce structured feedback forms', 'Share best practices across departments']], ['Staff professional development through targeted workshops', ['Plan termly training calendar', 'Nominate department mentors']], ['Curriculum alignment and mapping across year levels', ['Review curriculum alignment documentation', 'Map assessment gaps across subjects']]];
    let n = 0;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Self Improvement Plans",
      sub: "01 \u2014 Teaching, Learning & Assessment",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 680,
        y: 20,
        w: 116,
        label: "\u2B06 Upload SAR",
        ghost: true
      })
    }), [['Maturity Level', 'Level 2 — Transitional', 2, '#2FB57C', '#E9F8EF'], ['Aspirational Level', 'Level 4 — Dynamic', 4, '#E0A100', '#FFF7E6']].map(([l, v, nseg, col, bg], i) => /*#__PURE__*/React.createElement(LpPCard, {
      key: l,
      x: 24 + i * 394,
      y: 78,
      w: 378,
      h: 92,
      p: pp(lt, 0.05 + i * 0.1, 0.5),
      style: {
        background: bg,
        border: `1.5px solid ${col}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 700, col)
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        margin: '8px 0'
      }
    }, [0, 1, 2, 3].map(s => /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        flex: 1,
        height: 7,
        borderRadius: 4,
        background: s < nseg * gl(lt, 0.3 + i * 0.2, 0.7) ? col : `${col}33`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: ptx(15, 600, col)
    }, v))), rows.map(([area, acts], r) => {
      const y = 186 + r * 128,
        doneAll = r === 0 && lt > 1.6;
      return /*#__PURE__*/React.createElement(LpPCard, {
        key: area,
        x: 24,
        y: y,
        w: 772,
        h: 116,
        p: pp(lt, 0.3 + r * 0.1, 0.5),
        pad: 14,
        style: {
          background: doneAll ? '#ECFBF2' : '#fff',
          border: `1px solid ${doneAll ? '#9EE0B8' : '#E6ECEE'}`
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: A(14, 14, {
          width: 30,
          ...ptx(18, 800, doneAll ? '#2FB57C' : '#8a989d')
        })
      }, r + 1), /*#__PURE__*/React.createElement("div", {
        style: A(50, 14, {
          width: 240,
          ...ptx(14, 600)
        })
      }, area), /*#__PURE__*/React.createElement("div", {
        style: A(300, 10, {
          width: 450
        })
      }, acts.map(a => {
        const at = 0.5 + n++ * 0.22,
          on = lt > at && r < 2 || r === 2 && lt > at;
        return /*#__PURE__*/React.createElement("div", {
          key: a,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `2px solid ${on ? '#2FB57C' : '#C9D3D6'}`,
            background: on ? '#2FB57C' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...ptx(11, 900, '#fff'),
            transform: `scale(${on ? 1 + 0.2 * Math.sin(Math.PI * prog(lt, at, at + 0.25)) : 1})`
          }
        }, on ? '✓' : ''), /*#__PURE__*/React.createElement("div", {
          style: ptx(13, 500, on ? '#6b7b80' : INK)
        }, a));
      }), doneAll && /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(12, 700, '#2FB57C'),
          ...up(en(lt, 1.6, 0.4), 6)
        }
      }, "\u2713 All actions completed")));
    }));
  }
  function PSurvey({
    lt
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Surveys",
      sub: "Manage and monitor all your survey forms",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 640,
        y: 20,
        w: 156,
        label: "+ Create New Form",
        press: prog(lt, 1.7, 2.0)
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 78, {
        display: 'flex',
        gap: 22,
        ...ptx(14, 700, '#6b7b80')
      })
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: TTL,
        borderBottom: `3px solid ${TEAL}`,
        paddingBottom: 6
      }
    }, "All Forms 12"), /*#__PURE__*/React.createElement("span", null, "Active ", Math.min(8, 5 + Math.floor(en(lt, 0.4, 1.2) * 3.99))), /*#__PURE__*/React.createElement("span", null, "Inactive ", Math.max(4, 7 - Math.floor(en(lt, 0.4, 1.2) * 3.99)))), [['Annual Staff Satisfaction Survey', 23], ['Parent Feedback — Term 2', 41], ['Student Wellbeing Check-in', 58], ['Infrastructure Needs Survey', 17]].map(([n2, resp], i) => {
      const on = lt > 0.5 + i * 0.3,
        sw = gl(lt, 0.5 + i * 0.3, 0.3),
        x = 24 + i % 2 * 394,
        y = 118 + Math.floor(i / 2) * 220;
      return /*#__PURE__*/React.createElement(LpPCard, {
        key: n2,
        x: x,
        y: y,
        w: 378,
        h: 204,
        p: pp(lt, 0.1 + i * 0.08, 0.5),
        pad: 18
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 220,
          ...ptx(16, 700)
        }
      }, n2), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 44,
          height: 24,
          borderRadius: 12,
          background: on ? '#22C55E' : '#D5DDE0',
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: A(2 + 20 * sw, 2, {
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff'
        })
      })), /*#__PURE__*/React.createElement("span", {
        style: ptx(12, 700, on ? '#22C55E' : '#8a989d')
      }, on ? 'Active' : 'Inactive'))), /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(13, 500, '#6b7b80'),
          marginTop: 8
        }
      }, "Collect feedback and track responses in real time."), /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(12, 600, '#6b7b80'),
          marginTop: 12
        }
      }, "Created Jan 5, 2025 \xB7 ", Math.round(resp * en(lt, 0.6 + i * 0.3, 1.2)), " Responses"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8,
          marginTop: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '8px 16px',
          borderRadius: 8,
          background: TEAL,
          ...ptx(13, 700, '#fff')
        }
      }, "View Form"), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '8px 14px',
          borderRadius: 8,
          border: '1px solid #E0E6E8',
          ...ptx(13, 600, '#51626A')
        }
      }, "Responses ", Math.round(resp * en(lt, 0.6 + i * 0.3, 1.2)))));
    }));
  }
  function PMeet({
    lt,
    T
  }) {
    const sec = 38 * 60 + Math.floor(lt * 4),
      rem = prog(lt, 1.3, 1.6),
      att = [['SA', 'Sarah Ahmed', '#3B82F6'], ['JM', 'James Mitchell', '#7B6CF0'], ['PS', 'Priya Sharma', '#2FB57C']];
    const Card = ({
      x,
      head,
      hc,
      hbg,
      title,
      foot,
      p
    }) => /*#__PURE__*/React.createElement(LpPCard, {
      x: x,
      y: 84,
      w: 378,
      h: 330,
      p: p,
      pad: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 44,
        background: hbg,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 8,
        ...ptx(13, 700, hc)
      }
    }, head), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 700, '#8a989d')
    }, "AGENDA"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(15, 800),
        marginTop: 4
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(12, 500, '#6b7b80'),
        marginTop: 6
      }
    }, "Reviewing term outcomes and aligning with school improvement targets."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 12
      }
    }, ['Mon, 14 Jul', '10:00 AM', '60 min'].map(c => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        padding: '5px 10px',
        borderRadius: 8,
        background: '#F1F5F6',
        ...ptx(11, 600, '#51626A')
      }
    }, c))), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(12, 600, '#51626A'),
        marginTop: 14
      }
    }, "4 Attendees"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 8
      }
    }, att.map(([i2, nm, c], k) => /*#__PURE__*/React.createElement("div", {
      key: i2,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transform: `scale(${pp(lt, 0.4 + k * 0.15, 0.4)})`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: c,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(11, 800, '#fff')
      }
    }, i2), /*#__PURE__*/React.createElement("span", {
      style: ptx(11, 600)
    }, nm.split(' ')[0])))), foot));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Meeting Dashboard",
      right: /*#__PURE__*/React.createElement("div", {
        style: A(250, 22, {
          padding: '4px 12px',
          borderRadius: 12,
          background: '#FDE2E2',
          ...ptx(13, 700, '#E5484D'),
          opacity: 0.6 + 0.4 * Math.abs(Math.sin(T * 3))
        })
      }, "\u25CF 1 Live")
    }), /*#__PURE__*/React.createElement(Card, {
      x: 24,
      p: pp(lt, 0.05, 0.5),
      hbg: "#F25F4C",
      hc: "#fff",
      head: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          whiteSpace: 'nowrap'
        }
      }, "\u25CF Happening RIGHT NOW"), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          padding: '2px 8px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.25)',
          whiteSpace: 'nowrap'
        }
      }, Math.floor(sec / 60), ":", String(sec % 60).padStart(2, '0'), " elapsed")),
      title: "Q3 Academic Performance Review"
    }), /*#__PURE__*/React.createElement(Card, {
      x: 418,
      p: pp(lt, 0.2, 0.5),
      hbg: "#E7F8F2",
      hc: "#139A74",
      head: "\uD83D\uDD14 Starting in 45 minutes",
      title: "Safeguarding & Child Protection Review",
      foot: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 8,
          marginTop: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          padding: '8px 0',
          textAlign: 'center',
          borderRadius: 8,
          border: '1px solid #E0E6E8',
          ...ptx(12, 600, '#51626A')
        }
      }, "Reschedule"), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          padding: '8px 0',
          textAlign: 'center',
          borderRadius: 8,
          background: rem >= 1 ? '#2FB57C' : '#FFF4CC',
          ...ptx(12, 700, rem >= 1 ? '#fff' : '#9A6B00'),
          transform: `scale(${1 - 0.08 * Math.sin(Math.PI * rem)})`
        }
      }, rem >= 1 ? '✓ Reminder set' : 'Remind Me'))
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 430,
      w: 772,
      h: 130,
      p: pp(lt, 0.35, 0.5),
      pad: 16
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(15, 800)
    }, "Previous Meetings"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 12
      }
    }, ['Year 7 Transition Planning', 'Parent-Teacher Coordination', 'Staff Onboarding Session'].map((m, k) => /*#__PURE__*/React.createElement("div", {
      key: m,
      style: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        background: '#ECFBF2',
        ...up(en(lt, 0.6 + k * 0.15, 0.4), 8)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 700, '#2FB57C')
    }, "\u2713 Meeting completed"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(13, 700),
        marginTop: 4
      }
    }, m), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(11, 600, '#3B82F6'),
        marginTop: 4
      }
    }, "Minutes of Meeting \u2192"))))));
  }
  function PMature({
    lt
  }) {
    const step = 1 + Math.floor(gl(lt, 0.8, 1.2) * 2.01),
      L = ['Incipient', 'Transient', 'Stable', 'Dynamic'];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "SQAAF Records",
      sub: "Maturity & aspirational levels for every cycle",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 696,
        y: 20,
        w: 100,
        label: "+ Create"
      })
    }), [['SQAAF 2023', 45, 71, 'Level 2'], ['SQAAF 2024-25', 62, 84, 'Level 3']].map(([n2, comp, rs, lv], i) => {
      const c = gl(lt, 0.3 + i * 0.2, 1.1),
        ang = -90 + 180 * (rs / 100) * c;
      return /*#__PURE__*/React.createElement(LpPCard, {
        key: n2,
        x: 24 + i * 394,
        y: 84,
        w: 378,
        h: 230,
        p: pp(lt, 0.05 + i * 0.1, 0.5),
        pad: 18
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: ptx(20, 800)
      }, n2), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '3px 10px',
          borderRadius: 10,
          background: '#FFF1DE',
          whiteSpace: 'nowrap',
          ...ptx(12, 700, '#E08A00')
        }
      }, "\uD83C\uDFC6 ", lv)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 8,
          marginTop: 12
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: ptx(40, 800)
      }, Math.round(comp * c)), /*#__PURE__*/React.createElement("span", {
        style: ptx(16, 600, '#6b7b80')
      }, "% Completed")), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 8
        }
      }, /*#__PURE__*/React.createElement(PBar, {
        v: comp / 100 * c,
        hgt: 10
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginTop: 14
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: "110",
        height: "62",
        viewBox: "0 0 110 62"
      }, Array.from({
        length: 14
      }, (_, k) => {
        const a = Math.PI + k / 13 * Math.PI,
          col = `hsl(${k / 13 * 120},75%,50%)`;
        return /*#__PURE__*/React.createElement("line", {
          key: k,
          x1: 55 + Math.cos(a) * 40,
          y1: 56 + Math.sin(a) * 40,
          x2: 55 + Math.cos(a) * 52,
          y2: 56 + Math.sin(a) * 52,
          stroke: col,
          strokeWidth: "5",
          strokeLinecap: "round"
        });
      }), /*#__PURE__*/React.createElement("line", {
        x1: "55",
        y1: "56",
        x2: 55 + Math.cos((ang - 90) * Math.PI / 180) * 34,
        y2: 56 + Math.sin((ang - 90) * Math.PI / 180) * 34,
        stroke: TEAL,
        strokeWidth: "4",
        strokeLinecap: "round"
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: ptx(26, 800)
      }, Math.round(rs * c), "%"), /*#__PURE__*/React.createElement("div", {
        style: ptx(13, 700, '#2FB57C')
      }, rs > 75 ? 'Excellent' : 'Good'), /*#__PURE__*/React.createElement("div", {
        style: ptx(11, 500, '#8a989d')
      }, "Readiness Score"))));
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 330,
      w: 772,
      h: 150,
      p: pp(lt, 0.4, 0.5),
      pad: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(16, 800)
    }, "Maturity journey"), /*#__PURE__*/React.createElement("div", {
      style: A(60, 84, {
        width: 650,
        height: 4,
        background: '#E6ECEE'
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(60, 84, {
        width: 650 * ((step - 1) / 3) + 0,
        height: 4,
        background: '#E0A100'
      })
    }), L.map((l, k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: A(60 + k * (650 / 3) - 40, 66, {
        width: 80,
        textAlign: 'center'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        margin: '0 auto',
        borderRadius: '50%',
        background: k < step ? '#E0A100' : '#fff',
        border: `3px solid ${k < step ? '#E0A100' : '#D5DDE0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(14, 800, k < step ? '#fff' : '#8a989d'),
        boxSizing: 'border-box'
      }
    }, k + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(12, 600, '#51626A'),
        marginTop: 6
      }
    }, l)))));
  }
  function PEvid({
    lt
  }) {
    const tab = lt > 1.5 ? 1 : 0,
      T7 = ['Curriculum & Pedagogy', 'Infrastructure', 'Human Resource', 'Inclusive Practices', 'Management'];
    const S = [['1.1 Curriculum Planning', 0.92], ['1.2 Teaching Learning Processes', 0.8], ['1.3 Skill-based & Vocational Programmes', 0.66], ['1.4 Physical Education & Sports', 0.74], ['1.5 Values and Ethos', 0.58]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "SQAAF 2024-25",
      sub: "Evidence by domain and standard",
      right: /*#__PURE__*/React.createElement("div", {
        style: A(680, 22, {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
          ...ptx(14, 800, '#E08A00')
        })
      }, "\uD83C\uDFC6 Level 2")
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 80, {
        display: 'flex',
        gap: 6
      })
    }, T7.map((l, k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        padding: '9px 14px',
        borderRadius: '10px 10px 0 0',
        background: k === tab ? TEAL : '#EEF2F3',
        ...ptx(13, 700, k === tab ? '#fff' : '#51626A')
      }
    }, l))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 118,
      w: 772,
      h: 420,
      p: 1,
      pad: 0,
      style: {
        borderRadius: '0 14px 14px 14px'
      }
    }, S.map(([l, v], k) => {
      const f = gl(lt, 0.3 + k * 0.15, 0.9),
        fin = lt > 0.9 + k * 0.2;
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: {
          padding: '16px 20px',
          borderBottom: '1px solid #EEF2F3',
          ...up(en(lt, 0.1 + k * 0.08, 0.4), 8)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: ptx(14, 700)
      }, "\u203A ", l), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 'auto',
          padding: '3px 10px',
          borderRadius: 10,
          background: fin ? '#E3F6EC' : '#FFF4CC',
          ...ptx(11, 700, fin ? '#2FB57C' : '#9A6B00')
        }
      }, fin ? '✓ Finalized' : 'In Process'), /*#__PURE__*/React.createElement("span", {
        style: {
          width: 40,
          textAlign: 'right',
          ...ptx(12, 800, TTL)
        }
      }, Math.round(v * f * 100), "%")), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 10
        }
      }, /*#__PURE__*/React.createElement(PBar, {
        v: v * f,
        hgt: 5
      })));
    })), lt > 0.7 && /*#__PURE__*/React.createElement("div", {
      style: A(480, 490, {
        padding: '12px 18px',
        borderRadius: 12,
        background: INK,
        whiteSpace: 'nowrap',
        ...ptx(13, 700, '#fff'),
        boxShadow: '0 12px 24px rgba(30,43,48,0.25)',
        ...up(en(lt, 0.7, 0.4) * (1 - en(lt, 2.0, 0.3)), 14)
      })
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: YEL
      }
    }, "\u2B06"), "\xA0 Evidence uploaded \xB7 Standard 1.2"));
  }
  function PReport({
    lt
  }) {
    const F = ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'All Time'],
      sel = lt > 0.5 ? 2 : 1,
      dl = prog(lt, 1.0, 1.9);
    const RP = [['Q3 Progress Report — Term 2, 2024', '#EDE9FE'], ['Q2 Progress Report — Term 1, 2024', '#DBEAFE'], ['Q1 Progress Report — Term 3, 2023', '#FEF3C7'], ['Q4 Progress Report — Term 4, 2023', '#E3F6EC'], ['Monthly Report — June 2024', '#E3F6EC']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Reports",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 666,
        y: 20,
        w: 130,
        label: "\u2B07 Download All",
        ghost: true
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 74, {
        display: 'flex',
        gap: 4,
        padding: 4,
        borderRadius: 10,
        background: '#EEF2F3'
      })
    }, F.map((f, k) => /*#__PURE__*/React.createElement("div", {
      key: f,
      style: {
        padding: '6px 14px',
        borderRadius: 8,
        background: k === sel ? TEAL : 'transparent',
        ...ptx(13, 700, k === sel ? '#fff' : '#6b7b80')
      }
    }, f))), RP.map(([l, bg], k) => /*#__PURE__*/React.createElement(LpPCard, {
      key: l,
      x: 24,
      y: 124 + k * 86,
      w: 772,
      h: 74,
      p: pp(lt, 0.1 + k * 0.08, 0.5),
      pad: 14
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 10,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(18, 700, '#51626A')
      }
    }, "\u25A4"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(14, 800)
    }, l), /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 500, '#8a989d')
    }, "Submitted \xB7 2.4 MB")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        padding: '4px 10px',
        borderRadius: 10,
        background: '#FFF1DE',
        ...ptx(11, 700, '#E08A00')
      }
    }, "Level 2"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 14px',
        borderRadius: 8,
        border: `1.5px solid ${TEAL}`,
        ...ptx(12, 700, TTL)
      }
    }, "Preview"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 130,
        height: 34,
        borderRadius: 8,
        overflow: 'hidden',
        background: k === 0 && dl >= 1 ? '#2FB57C' : TEAL,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(12, 700, '#fff')
      }
    }, k === 0 && dl > 0 && dl < 1 && /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: `${dl * 100}%`,
        height: 34,
        background: 'rgba(255,255,255,0.25)'
      })
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative'
      }
    }, k === 0 ? dl >= 1 ? '✓ Downloaded' : dl > 0 ? `Downloading ${Math.round(dl * 100)}%` : '⬇ Download PDF' : '⬇ Download PDF'))))));
  }
  function PTemplates({
    lt
  }) {
    const cats = ['All', 'Policies', 'SOPs', 'Registers', 'Formats'],
      sel = lt > 0.6 ? 1 : 0,
      use = prog(lt, 1.5, 1.9);
    const D = [['Admission Policy', 'Domain 6 · Management', SUN], ['Child Protection Policy', 'Domain 4 · Inclusive', CORAL], ['Assessment Policy', 'Domain 1 · Curriculum', MINT], ['Staff Code of Conduct', 'Domain 3 · Human Resource', LILAC], ['Health & Safety SOP', 'Domain 2 · Infrastructure', PEACH], ['Grievance Redressal', 'Domain 7 · Satisfaction', SAGE]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Document Templates",
      sub: "250+ ready-to-use templates mapped to SQAAF standards",
      right: /*#__PURE__*/React.createElement("div", {
        style: A(560, 20, {
          width: 236,
          height: 34,
          borderRadius: 9,
          border: '1px solid #E0E6E8',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          ...ptx(13, 500, '#8a989d')
        })
      }, "\uD83D\uDD0D\xA0 ", 'Search policy…'.slice(0, Math.floor(en(lt, 0.2, 0.6) * 15)))
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 80, {
        display: 'flex',
        gap: 8
      })
    }, cats.map((c, k) => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        padding: '6px 14px',
        borderRadius: 16,
        background: k === sel ? TEAL : '#EEF2F3',
        ...ptx(13, 700, k === sel ? '#fff' : '#51626A')
      }
    }, c))), D.map(([n, d, c], k) => {
      const x = 24 + k % 3 * 260,
        y = 124 + Math.floor(k / 3) * 214,
        sel0 = k === 0;
      return /*#__PURE__*/React.createElement(LpPCard, {
        key: n,
        x: x,
        y: y,
        w: 246,
        h: 200,
        p: pp(lt, 0.15 + k * 0.08, 0.5),
        pad: 16,
        style: {
          border: sel0 && use > 0 ? `2px solid ${TEAL}` : '1px solid #E6ECEE'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: 70,
          borderRadius: 10,
          background: `${c}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 44,
          height: 54,
          borderRadius: 6,
          background: '#fff',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          padding: 8,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 5
        }
      }, [1, 0.7, 1, 0.5].map((w2, j) => /*#__PURE__*/React.createElement("div", {
        key: j,
        style: {
          height: 4,
          width: `${w2 * 100}%`,
          borderRadius: 2,
          background: c
        }
      })))), /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(15, 800),
          marginTop: 12
        }
      }, n), /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(12, 500, '#8a989d'),
          marginTop: 2
        }
      }, d), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 12,
          display: 'flex',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          padding: '7px 0',
          textAlign: 'center',
          borderRadius: 8,
          border: '1px solid #E0E6E8',
          ...ptx(12, 600, '#51626A')
        }
      }, "Preview"), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          padding: '7px 0',
          textAlign: 'center',
          borderRadius: 8,
          background: sel0 && use >= 1 ? '#2FB57C' : TEAL,
          ...ptx(12, 700, '#fff'),
          transform: sel0 ? `scale(${1 - 0.08 * Math.sin(Math.PI * use)})` : 'none'
        }
      }, sel0 && use >= 1 ? '✓ Added' : 'Use template')));
    }));
  }
  function PWorkflow({
    lt
  }) {
    const cols = [['To do', '#8a989d'], ['In progress', '#3B82F6'], ['In review', '#E0A100'], ['Approved', '#2FB57C']];
    const tasks = [['Upload fire safety audit', 'RK', '#F25F4C', 0, 2], ['Update admission policy', 'PS', '#2FB57C', 1, 3], ['CLT meeting minutes', 'JM', '#7B6CF0', 1, 2], ['Teacher training records', 'SA', '#3B82F6', 2, 3], ['Parent survey analysis', 'AK', '#E0A100', 0, 1], ['Infrastructure checklist', 'NV', '#139A74', 3, 3]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Workflow Management",
      sub: "Core Learning Team \xB7 tasks, owners & approvals",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 660,
        y: 20,
        w: 136,
        label: "+ Assign Task",
        press: prog(lt, 0.2, 0.5)
      })
    }), cols.map(([c, col], k) => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: A(24 + k * 194, 80, {
        width: 182,
        height: 480,
        borderRadius: 14,
        background: '#EEF3F4'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...ptx(13, 800, col)
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: col
      }
    }), c.toUpperCase()))), tasks.map(([n, ini, ac, from, to], k) => {
      const mv = gl(lt, 0.7 + k * 0.18, 0.6),
        col = mix(from, to, mv),
        rowOf = cIdx => tasks.filter((x, j) => j < k && (mv > 0.5 ? x[4] : x[3]) === cIdx).length;
      const x = 24 + col * 194 + 8,
        y = 124 + (mv > 0.5 ? tasks.slice(0, k).filter(x2 => x2[4] === to).length : tasks.slice(0, k).filter(x2 => x2[3] === from).length) * 98;
      const done = mv > 0.5 && to === 3;
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: A(x, y, {
          width: 166,
          height: 86,
          borderRadius: 10,
          background: '#fff',
          boxShadow: mv > 0.05 && mv < 0.95 ? '0 14px 28px rgba(30,43,48,0.18)' : '0 2px 6px rgba(30,43,48,0.06)',
          padding: 10,
          boxSizing: 'border-box',
          transform: `rotate(${Math.sin(Math.PI * mv) * 3}deg)`,
          ...popS(pp(lt, 0.1 + k * 0.06, 0.4))
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: ptx(13, 700)
      }, n), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: ac,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...ptx(10, 800, '#fff')
        }
      }, ini), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '2px 8px',
          borderRadius: 8,
          background: done ? '#E3F6EC' : '#F1F5F6',
          ...ptx(10, 700, done ? '#2FB57C' : '#6b7b80')
        }
      }, done ? '✓ Approved' : 'Due 12 Aug')));
    }));
  }
  function PProgress({
    lt
  }) {
    const D = [['Curriculum, Pedagogy & Assessment', 72, 86], ['Infrastructure', 69, 78], ['Human Resources', 87, 90], ['Inclusive Practices', 82, 88], ['Management & Governance', 64, 81], ['Leadership', 67, 74], ['Beneficiary Satisfaction', 60, 79]];
    const g = gl(lt, 1.3, 1.2),
      ov = Math.round(mix(72, 82, g) * en(lt, 0.2, 1.0));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Progress Tracking",
      sub: "Live across all 7 SQAAF domains",
      right: /*#__PURE__*/React.createElement("div", {
        style: A(620, 20, {
          display: 'flex',
          gap: 4,
          padding: 4,
          borderRadius: 10,
          background: '#EEF2F3'
        })
      }, ['This term', 'This year'].map((f, k) => /*#__PURE__*/React.createElement("div", {
        key: f,
        style: {
          padding: '6px 12px',
          borderRadius: 8,
          background: k === 0 ? TEAL : 'transparent',
          ...ptx(12, 700, k === 0 ? '#fff' : '#6b7b80')
        }
      }, f)))
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 82,
      w: 250,
      h: 478,
      p: pp(lt, 0.05, 0.5),
      pad: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(15, 800)
    }, "Overall progress"), /*#__PURE__*/React.createElement("svg", {
      width: "210",
      height: "210",
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "105",
      cy: "105",
      r: "84",
      fill: "none",
      stroke: "#EEF2F3",
      strokeWidth: "20"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "105",
      cy: "105",
      r: "84",
      fill: "none",
      stroke: TEAL,
      strokeWidth: "20",
      strokeLinecap: "round",
      strokeDasharray: `${2 * Math.PI * 84 * ov / 100} 999`,
      transform: "rotate(-90 105 105)"
    }), /*#__PURE__*/React.createElement("text", {
      x: "105",
      y: "118",
      textAnchor: "middle",
      style: {
        ...ptx(44, 800)
      },
      fill: INK
    }, ov, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        padding: '8px 12px',
        borderRadius: 10,
        background: '#E3F6EC',
        ...ptx(13, 700, '#2FB57C'),
        opacity: en(lt, 1.6, 0.4)
      }
    }, "\u25B2 +10% since last month"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: '8px 12px',
        borderRadius: 10,
        background: '#FDE8E8',
        ...ptx(13, 700, '#E5484D'),
        opacity: en(lt, 2.0, 0.4)
      }
    }, "\u26A0 2 domains need attention")), /*#__PURE__*/React.createElement(LpPCard, {
      x: 290,
      y: 82,
      w: 506,
      h: 478,
      p: pp(lt, 0.15, 0.5),
      pad: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(15, 800)
    }, "Domain-wise progress"), D.map(([n, a, b], k) => {
      const v = mix(a, b, g) * gl(lt, 0.3 + k * 0.08, 0.8),
        low = mix(a, b, g) < 80 && lt > 2.0;
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: {
          marginTop: 16
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          ...ptx(12, 600, '#51626A')
        }
      }, /*#__PURE__*/React.createElement("span", null, n), /*#__PURE__*/React.createElement("span", {
        style: {
          color: low ? '#E5484D' : TTL,
          fontWeight: 800
        }
      }, Math.round(v), "%")), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 6
        }
      }, /*#__PURE__*/React.createElement(PBar, {
        v: v / 100,
        c: low ? CORAL : TEAL
      })));
    })));
  }
  function PImproveGen({
    lt
  }) {
    const press = prog(lt, 0.2, 0.55),
      gen = gl(lt, 0.6, 0.6);
    const A2 = [['Introduce structured classroom observation forms', 'Academic Coordinator', 'Aug 30'], ['Run peer-observation visits once per term', 'Heads of Department', 'Sep 15'], ['Map assessment gaps across year levels', 'Exam Cell', 'Sep 30'], ['Plan termly staff training calendar', 'Principal', 'Oct 10']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Improvement Plans",
      sub: "Domain 1 \xB7 Curriculum, Pedagogy & Assessment",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 620,
        y: 20,
        w: 176,
        label: press > 0 && press < 1 ? '✨ Generating…' : '✨ Generate with AI',
        press: press,
        done: lt > 1.0,
        doneLabel: "\u2713 Plan generated"
      })
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 80,
      w: 772,
      h: 84,
      p: pp(lt, 0.05, 0.5),
      pad: 16,
      style: {
        background: '#FFF7E6',
        border: '1.5px solid #F3C35B'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 800, '#B07A00')
    }, "GAP IDENTIFIED"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(15, 700),
        marginTop: 6
      }
    }, "Classroom observation is irregular and not documented consistently.")), A2.map(([a, o, d], k) => {
      const p = pp(lt, 0.8 + k * 0.22, 0.5),
        ck = lt > 2.2 + k * 0.2;
      return /*#__PURE__*/React.createElement(LpPCard, {
        key: a,
        x: 24,
        y: 180 + k * 92,
        w: 772,
        h: 80,
        p: gen > 0 ? p : 0,
        pad: 14
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 22,
          height: 22,
          borderRadius: 6,
          border: `2px solid ${ck ? '#2FB57C' : '#C9D3D6'}`,
          background: ck ? '#2FB57C' : '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...ptx(13, 900, '#fff')
        }
      }, ck ? '✓' : ''), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: ptx(14, 700)
      }, a), /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(12, 500, '#8a989d'),
          marginTop: 3
        }
      }, "Owner \xB7 ", o)), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '4px 10px',
          borderRadius: 8,
          background: '#F1F5F6',
          ...ptx(12, 600, '#51626A')
        }
      }, "Due ", d), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '4px 10px',
          borderRadius: 8,
          background: k < 2 ? '#FDE8E8' : '#FFF4CC',
          ...ptx(11, 700, k < 2 ? '#E5484D' : '#9A6B00')
        }
      }, k < 2 ? 'High' : 'Medium')));
    }));
  }
  const Av = ({
    i,
    c,
    d = 30,
    f = 11
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      width: d,
      height: d,
      borderRadius: '50%',
      background: c,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...ptx(f, 800, '#fff')
    }
  }, i);
  function PWorkflowCLT({
    lt
  }) {
    const S = [['Total Members', 7, '#3B82F6', '#E8F0FE'], ['Authorized', 1, '#E0A100', '#FFF4DE'], ['CLT Members', 2, TEAL, '#E3F6F7'], ['FG Members', 4, '#7B6CF0', '#EFECFD']];
    const M = [['SR', 'Sara Reynolds', 'Academic Coordinator', '', '#F4AE84', null, 0, 'Not set'], ['NC', 'Natali Craig', 'HOD Science', 'CLT', '#6CC5AE', 'Domain 1 · Curriculum', 70, 'Dec 15, 2025'], ['DC', 'Drew Cano', 'Exam Cell Head', 'CLT', '#4FB3C2', 'Domain 6 · Management', 90, 'Oct 25, 2025'], ['KM', 'Kate Morrison', 'Librarian', 'FG', '#BBA8EC', 'Domain 2 · Infrastructure', 40, 'Jan 10, 2026'], ['OD', 'Orlando Diggs', 'Sports Head', 'FG', '#F3C35B', 'Domain 4 · Inclusive', 25, 'Feb 20, 2026'], ['AL', 'Andi Lane', 'Counsellor', 'FG', '#EE8C76', 'Domain 7 · Satisfaction', 50, 'Mar 05, 2026']];
    const asg = prog(lt, 1.1, 1.4),
      tab = lt > 2.1 ? 1 : 0;
    const cols = [16, 230, 300, 500, 640];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Authorized Users",
      sub: "People assigned to work here \u2014 assign as CLT or FG members",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 650,
        y: 20,
        w: 146,
        label: "+ Add Member",
        press: prog(lt, 0.2, 0.5)
      })
    }), S.map(([l, n, c, bg], i) => /*#__PURE__*/React.createElement(LpPCard, {
      key: l,
      x: 24 + i * 196,
      y: 80,
      w: 182,
      h: 66,
      p: pp(lt, 0.05 + i * 0.07, 0.5),
      pad: 12
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 10,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(18, 800, c)
      }
    }, "\u25CF"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(22, 800)
    }, Math.round(n * en(lt, 0.2, 0.8))), /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 500, '#6b7b80')
    }, l))))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 160,
      w: 772,
      h: 420,
      p: pp(lt, 0.2, 0.5),
      pad: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 44,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 26,
        padding: '0 18px',
        borderBottom: '1px solid #EEF2F3'
      }
    }, [['All Members', 7], ['CLT Members', 2], ['FG Members', 4]].map(([l, n], k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        paddingBottom: 10,
        borderBottom: k === tab ? `3px solid ${TEAL}` : '3px solid transparent',
        ...ptx(13, 700, k === tab ? TTL : '#6b7b80')
      }
    }, l, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 4,
        padding: '1px 7px',
        borderRadius: 8,
        background: '#EEF2F3',
        ...ptx(11, 700, '#6b7b80')
      }
    }, n)))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 34,
        position: 'relative',
        borderBottom: '1px solid #EEF2F3'
      }
    }, ['MEMBER', 'TEAM', 'DOMAIN ASSIGNED', 'PROGRESS', 'DEADLINE'].map((h2, k) => /*#__PURE__*/React.createElement("div", {
      key: h2,
      style: A(cols[k], 11, ptx(11, 700, '#8a989d'))
    }, h2))), M.filter(m => !tab || m[3] === 'CLT').map(([i, n, r, team, c, dom, pr, dl], k) => {
      const first = i === 'SR',
        domain = first ? asg >= 1 ? 'Domain 3 · Human Resource' : null : dom,
        pv = first ? asg >= 1 ? 10 * gl(lt, 1.4, 0.8) : 0 : pr * gl(lt, 0.5 + k * 0.1, 0.9);
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: {
          height: 56,
          position: 'relative',
          borderBottom: '1px solid #F1F4F5',
          background: first && asg > 0 && asg < 1 ? '#FFFBEF' : '#fff',
          ...up(en(lt, 0.3 + k * 0.08, 0.4), 8)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: A(cols[0], 12, {
          display: 'flex',
          alignItems: 'center',
          gap: 10
        })
      }, /*#__PURE__*/React.createElement(Av, {
        i: i,
        c: c,
        d: 32
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: ptx(13, 700)
      }, n), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          ...ptx(11, 500, '#8a989d')
        }
      }, r, team && /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '0 6px',
          borderRadius: 6,
          background: team === 'CLT' ? '#E3F6F7' : '#EFECFD',
          ...ptx(10, 700, team === 'CLT' ? TTL : '#7B6CF0')
        }
      }, team)))), /*#__PURE__*/React.createElement("div", {
        style: A(cols[1], 16, {
          display: 'flex'
        })
      }, [c, '#C9D3D6'].map((cc, j) => /*#__PURE__*/React.createElement("div", {
        key: j,
        style: {
          marginLeft: j ? -6 : 0,
          border: '2px solid #fff',
          borderRadius: '50%'
        }
      }, /*#__PURE__*/React.createElement(Av, {
        i: j ? '+2' : i,
        c: cc,
        d: 24,
        f: 9
      })))), /*#__PURE__*/React.createElement("div", {
        style: A(cols[2], 18, {})
      }, domain ? /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          ...ptx(12, 600)
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: c
        }
      }), domain) : /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '4px 10px',
          borderRadius: 7,
          border: `1.5px solid ${TEAL}`,
          ...ptx(11, 700, TTL),
          display: 'inline-block',
          transform: `scale(${1 - 0.1 * Math.sin(Math.PI * asg)})`
        }
      }, "+ Assign")), /*#__PURE__*/React.createElement("div", {
        style: A(cols[3], 14, {
          width: 110
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: ptx(11, 700)
      }, Math.round(pv), "%"), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 4
        }
      }, /*#__PURE__*/React.createElement(PBar, {
        v: pv / 100,
        hgt: 5
      }))), /*#__PURE__*/React.createElement("div", {
        style: A(cols[4], 19, ptx(12, 600, '#51626A'))
      }, "\uD83D\uDCC5 ", first && asg < 1 ? 'Not set' : first ? 'Nov 30, 2025' : dl));
    })));
  }
  function PImprovePlan({
    lt
  }) {
    const typed = 'Plan termly staff training calendar',
      ty = typed.slice(0, Math.floor(prog(lt, 1.3, 2.2) * typed.length)),
      save = prog(lt, 2.5, 2.8);
    const R = [['Improve classroom observation practices', 'High', 'Aug 30, 25', ['Conduct peer observation visits once per term', 'Introduce structured feedback forms', 'Share best practices across departments']], ['Staff professional development through targeted workshops', 'High', 'Jun 30, 25', null], ['Curriculum alignment and mapping across year levels', 'Medium', 'Sep 15, 25', ['Review curriculum alignment documentation', 'Map assessment gaps across subjects']]];
    let n = 0;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Self Improvement Plans",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 680,
        y: 16,
        w: 116,
        label: "\u2B06 Upload SAR",
        ghost: true
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 52, {
        width: 772,
        textAlign: 'center',
        ...ptx(15, 800)
      })
    }, "01 \u2014 Teaching, Learning & Assessment ", /*#__PURE__*/React.createElement("span", {
      style: ptx(13, 500, '#6b7b80')
    }, "\xA0\u203A\xA0 1.1 \u2014 Teaching & Learning Strategies")), [['Maturity Level', 'Level 2 — Transitional', 2, '#2FB57C', '#E9F8EF'], ['Aspirational Level', 'Level 4 — Dynamic', 4, '#E0A100', '#FFF7E6']].map(([l, v, ns, col, bg], i) => /*#__PURE__*/React.createElement(LpPCard, {
      key: l,
      x: 24 + i * 394,
      y: 82,
      w: 378,
      h: 72,
      p: pp(lt, 0.05 + i * 0.1, 0.5),
      pad: 12,
      style: {
        background: bg,
        border: `1.5px solid ${col}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 700, col)
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        margin: '7px 0'
      }
    }, [0, 1, 2, 3].map(k => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        background: k < ns * gl(lt, 0.3 + i * 0.2, 0.7) ? col : `${col}33`
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        ...ptx(14, 600, col)
      }
    }, /*#__PURE__*/React.createElement("span", null, v), /*#__PURE__*/React.createElement("span", {
      style: ptx(11, 600, col)
    }, ns, " / 4")))), /*#__PURE__*/React.createElement("div", {
      style: A(24, 166, {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 700)
    }, "Convenor / Team"), /*#__PURE__*/React.createElement("div", {
      style: ptx(10, 500, '#8a989d')
    }, "Involved in this plan")), [['AK', 'Aisha Khan', 'Lead Teacher', '#2FB57C'], ['JM', 'James Mitchell', 'Dept. Coordinator', '#3B82F6'], ['PS', 'Priya Sharma', 'HOD English', '#7B6CF0'], ['RK', 'Rahul Kumar', 'Exam Cell', '#E0A100']].map(([i, nm, r, c], k) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 150,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 8px',
        borderRadius: 10,
        background: '#F1F6FB',
        ...popS(pp(lt, 0.4 + k * 0.1, 0.4))
      }
    }, /*#__PURE__*/React.createElement(Av, {
      i: i,
      c: c,
      d: 26,
      f: 10
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 700)
    }, nm), /*#__PURE__*/React.createElement("div", {
      style: ptx(10, 500, '#8a989d')
    }, r))))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 216,
      w: 772,
      h: 336,
      p: pp(lt, 0.2, 0.5),
      pad: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 32,
        position: 'relative',
        background: '#F7F9FA',
        borderBottom: '1px solid #EEF2F3'
      }
    }, [['No.', 12], ['Area of Improvement', 50], ['Priority', 262], ['Timeline', 340], ['Proposed Action', 440]].map(([h2, x]) => /*#__PURE__*/React.createElement("div", {
      key: h2,
      style: A(x, 9, ptx(11, 700, '#8a989d'))
    }, h2))), R.map(([area, pri, tl, acts], r) => {
      const doneAll = r === 0 && lt > 1.1;
      return /*#__PURE__*/React.createElement("div", {
        key: area,
        style: {
          height: 100,
          position: 'relative',
          borderBottom: '1px solid #EEF2F3',
          background: doneAll ? '#F0FBF4' : '#fff'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: A(0, 0, {
          width: 32,
          height: 100,
          background: doneAll ? '#22A565' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...ptx(13, 800, doneAll ? '#fff' : '#8a989d')
        })
      }, r + 1), /*#__PURE__*/React.createElement("div", {
        style: A(44, 22, {
          width: 200,
          padding: '8px 10px',
          borderRadius: 8,
          border: '1px solid #E0E6E8',
          ...ptx(12, 600)
        })
      }, area), /*#__PURE__*/React.createElement("div", {
        style: A(262, 36, {
          padding: '5px 10px',
          borderRadius: 7,
          border: '1px solid #E0E6E8',
          ...ptx(12, 700, pri === 'High' ? '#E5484D' : '#E08A00')
        })
      }, pri, " \u25BE"), /*#__PURE__*/React.createElement("div", {
        style: A(340, 36, {
          padding: '5px 10px',
          borderRadius: 7,
          border: '1px solid #E0E6E8',
          ...ptx(12, 600, '#51626A')
        })
      }, "\uD83D\uDCC5 ", tl), /*#__PURE__*/React.createElement("div", {
        style: A(440, 10, {
          width: 316,
          height: 80,
          padding: '8px 10px',
          borderRadius: 8,
          border: `1px solid ${r === 1 && lt > 1.2 ? TEAL : '#E0E6E8'}`,
          boxSizing: 'border-box',
          background: '#fff'
        })
      }, acts ? acts.map(a => {
        const at = 0.4 + n++ * 0.22,
          on = lt > at;
        return /*#__PURE__*/React.createElement("div", {
          key: a,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            marginBottom: 5
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 13,
            height: 13,
            borderRadius: 3,
            border: `2px solid ${on ? '#22A565' : '#C9D3D6'}`,
            background: on ? '#22A565' : '#fff',
            ...ptx(8, 900, '#fff'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        }, on ? '✓' : ''), /*#__PURE__*/React.createElement("span", {
          style: ptx(11, 500, on ? '#6b7b80' : INK)
        }, a));
      }) : /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 7
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 13,
          height: 13,
          borderRadius: 3,
          border: '2px dashed #C9D3D6'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: ptx(12, 600, ty ? INK : '#9aa6aa')
      }, ty || 'Type an action and press Enter…'), lt > 1.2 && /*#__PURE__*/React.createElement("span", {
        style: {
          width: 2,
          height: 15,
          background: TEAL,
          opacity: Math.round(lt * 3) % 2
        }
      })), doneAll && /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(11, 700, '#22A565'),
          ...up(en(lt, 1.1, 0.3), 5)
        }
      }, "\u2713 All actions completed"), r === 1 && /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(10, 500, '#8a989d'),
          marginTop: 6
        }
      }, "\u2295 Each line becomes a traceable action item")));
    })), /*#__PURE__*/React.createElement("div", {
      style: A(24, 560, {
        width: 772,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 18px',
        borderRadius: 8,
        border: '1px solid #E0E6E8',
        ...ptx(13, 600, '#51626A')
      }
    }, "\u2190 Previous"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px',
        borderRadius: 8,
        background: save >= 1 ? '#22A565' : TEAL,
        ...ptx(13, 700, '#fff'),
        transform: `scale(${1 - 0.08 * Math.sin(Math.PI * save)})`
      }
    }, save >= 1 ? '✓ Plan saved' : '💾 Save Plan'), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 18px',
        borderRadius: 8,
        border: '1px solid #E0E6E8',
        ...ptx(13, 600, '#51626A')
      }
    }, "Next \u2192")));
  }
  function PExpert({
    lt,
    T
  }) {
    const att = Math.round(247 * en(lt, 0.3, 1.2)),
      join = prog(lt, 2.3, 2.6),
      reg = prog(lt, 1.4, 1.7),
      dl = prog(lt, 2.7, 3.0);
    const chip = (txt, bg, col) => /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '3px 9px',
        borderRadius: 10,
        background: bg,
        whiteSpace: 'nowrap',
        ...ptx(10, 700, col)
      }
    }, txt);
    const UP = [['assets/web-up1.png', 'Effective Classroom Management Techniques', 'Starting in 45 Minutes', '#FFF4CC', '#9A6B00', '20 Mar · 4:00 PM', 'Dr. Sarah Ahmed · 124 Registered'], ['assets/web-up2.png', 'Inclusive Education: Strategies & Tools', 'Starting in 3 Days', '#E3F6EC', '#22A565', '23 Mar · 2:00 PM', 'Prof. James Mitchell · 87 Registered']];
    const CO = [['assets/web-c1.png', 'Digital Tools for Personalized Learning', 'Priya Sharma · 142 Attended'], ['assets/web-c1.png', 'Digital Tools for Classroom Assessment', 'Priya Sharma · 118 Attended'], ['assets/web-c3.png', 'Building Resilience in Young Learners', 'Tom Rivera · 98 Attended']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Webinar Dashboard",
      sub: "Expert Assistance & Monthly Webinars",
      right: /*#__PURE__*/React.createElement("div", {
        style: A(706, 20, {
          padding: '4px 12px',
          borderRadius: 12,
          background: '#FDE2E2',
          whiteSpace: 'nowrap',
          ...ptx(12, 700, '#E5484D'),
          opacity: 0.6 + 0.4 * Math.abs(Math.sin(T * 3))
        })
      }, "\u25CF 1 Live")
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 74, {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        ...ptx(13, 700)
      })
    }, "Ongoing ", chip('● LIVE', '#FDE2E2', '#E5484D')), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 98,
      w: 400,
      h: 292,
      p: pp(lt, 0.05, 0.5),
      pad: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 120,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/web-live.png",
      style: {
        width: 400,
        height: 138,
        objectFit: 'cover',
        transform: `scale(${1 + 0.04 * en(lt, 0, 3)})`
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 26,
        background: '#F2361D',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        whiteSpace: 'nowrap',
        ...ptx(11, 700, '#fff')
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: 0.5 + 0.5 * Math.abs(Math.sin(T * 3))
      }
    }, "\u25CF"), "\xA0 LIVE NOW \xB7 This Webinar Is Happening Right Now"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, chip('▶ Webinar', '#E8F0FE', '#3B82F6'), chip(`👥 ${att} Attending`, '#E3F6EC', '#22A565')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(9, 700, '#8a989d')
    }, "TOPIC"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(14, 800),
        lineHeight: 1.2
      }
    }, "Modern Teaching Methodologies for 2025"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(10, 500, '#6b7b80'),
        marginTop: 3
      }
    }, "AI-Driven Classrooms, Hybrid Learning and Student Engagement.")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '9px 14px',
        borderRadius: 10,
        background: join >= 1 ? '#22A565' : '#F2361D',
        whiteSpace: 'nowrap',
        ...ptx(12, 700, '#fff'),
        boxShadow: '0 6px 14px rgba(242,54,29,0.25)',
        transform: `scale(${1 - 0.08 * Math.sin(Math.PI * join)})`
      }
    }, join >= 1 ? '✓ Joined' : '▶ Join Live Webinar'), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(9, 600, '#E5484D'),
        marginTop: 4
      }
    }, "Started 12 Min Ago"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 8
      }
    }, ['📅 Today, 18 Mar', '🕚 11:00 AM', '⏱ 90 Min', 'Dr. Sarah Ahmed'].map(m => chip(m, '#F1F5F6', '#51626A'))))), /*#__PURE__*/React.createElement("div", {
      style: A(436, 74, ptx(13, 700))
    }, "Upcoming Webinars"), UP.map(([img, ti, st, bg, col, d, sp], k) => /*#__PURE__*/React.createElement(LpPCard, {
      key: ti,
      x: 436,
      y: 98 + k * 148,
      w: 360,
      h: 140,
      p: pp(lt, 0.2 + k * 0.12, 0.5),
      pad: 10
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: img,
      style: {
        width: 118,
        height: 80,
        objectFit: 'cover',
        borderRadius: 8,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, chip('🔔 ' + st, bg, col), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(12, 800),
        marginTop: 6,
        lineHeight: 1.25
      }
    }, ti), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(10, 600, '#6b7b80'),
        marginTop: 4
      }
    }, d), /*#__PURE__*/React.createElement("div", {
      style: ptx(10, 500, '#8a989d')
    }, sp))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '6px 0',
        textAlign: 'center',
        borderRadius: 8,
        background: k === 0 && reg >= 1 ? '#22A565' : '#05AFC4',
        ...ptx(11, 700, '#fff'),
        transform: k === 0 ? `scale(${1 - 0.06 * Math.sin(Math.PI * reg)})` : 'none'
      }
    }, k === 0 && reg >= 1 ? '✓ Registered' : '👤 Register Now'))), /*#__PURE__*/React.createElement("div", {
      style: A(24, 400, ptx(13, 700))
    }, "Completed Webinars"), CO.map(([img, ti, sp], k) => /*#__PURE__*/React.createElement(LpPCard, {
      key: ti,
      x: 24 + k * 260,
      y: 424,
      w: 252,
      h: 150,
      p: pp(lt, 0.4 + k * 0.1, 0.5),
      pad: 8
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: img,
      style: {
        width: 84,
        height: 60,
        objectFit: 'cover',
        borderRadius: 6,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, chip('✓ Webinar Completed', '#E3F6EC', '#22A565'), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(11, 800),
        marginTop: 5,
        lineHeight: 1.2
      }
    }, ti))), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(10, 500, '#8a989d'),
        marginTop: 6
      }
    }, sp), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '6px 0',
        textAlign: 'center',
        borderRadius: 7,
        background: '#E8F0FE',
        whiteSpace: 'nowrap',
        ...ptx(10, 700, '#3B82F6')
      }
    }, "\u25B6 Watch Recording"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        padding: '6px 0',
        textAlign: 'center',
        borderRadius: 7,
        background: k === 0 && dl >= 1 ? '#22A565' : '#E3F6EC',
        whiteSpace: 'nowrap',
        ...ptx(10, 700, k === 0 && dl >= 1 ? '#fff' : '#22A565'),
        transform: k === 0 ? `scale(${1 - 0.08 * Math.sin(Math.PI * dl)})` : 'none'
      }
    }, k === 0 && dl >= 1 ? '✓ Downloaded' : '⬇ Certificate')))));
  }
  function PSelfAssess({
    lt,
    T
  }) {
    const fill = gl(lt, 0.2, 1.0),
      xfer = prog(lt, 1.2, 2.6),
      done = lt > 2.6,
      run = prog(lt, 0.05, 0.3);
    const D = ['Curriculum & Pedagogy', 'Infrastructure', 'Human Resources', 'Inclusive Practices', 'Management & Governance', 'Leadership', 'Beneficiary Satisfaction'];
    const LX = 24,
      LW = 300,
      RX = 560,
      cy = 225;
    const x1 = LX + LW,
      x2 = RX + 118 - 75 + 8;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Automated SQAAF Self-Assessment",
      sub: "SAR Auto-Filled From Your Evidence and Sent Straight to CBSE",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 626,
        y: 20,
        w: 170,
        label: done ? '✓ Submitted' : xfer > 0 ? '⇄ Syncing…' : '⚙ Run Self-Assessment',
        press: run,
        done: done,
        doneLabel: "\u2713 Submitted to CBSE"
      })
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: LX,
      y: 80,
      w: LW,
      h: 440,
      p: pp(lt, 0.05, 0.5),
      pad: 16
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: {
        width: 34,
        height: 34
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(15, 800, TTL)
    }, "Luneblaze Portal"), /*#__PURE__*/React.createElement("div", {
      style: ptx(10, 600, '#8a989d')
    }, "Self-Assessment Report \xB7 2025-26"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 6,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: ptx(30, 800)
    }, Math.round(84 * fill)), /*#__PURE__*/React.createElement("span", {
      style: ptx(12, 600, '#6b7b80')
    }, "/ 84 Standards Auto-Filled")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(PBar, {
      v: fill,
      c: "#E0A100"
    })), D.map((d, k) => {
      const on = fill * 7 > k + 0.5;
      return /*#__PURE__*/React.createElement("div", {
        key: d,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 11
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: on ? '#22A565' : '#EEF2F3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...ptx(10, 900, '#fff'),
          transform: `scale(${on ? 1 : 0.85})`
        }
      }, on ? '✓' : ''), /*#__PURE__*/React.createElement("span", {
        style: ptx(12, 600, on ? INK : '#9aa6aa')
      }, d));
    })), /*#__PURE__*/React.createElement("svg", {
      width: "820",
      height: "604",
      style: A(0, 0, {
        pointerEvents: 'none'
      })
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x1 + 8} ${cy} C ${x1 + 90} ${cy - 70}, ${x2 - 90} ${cy - 70}, ${x2 - 8} ${cy}`,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "4",
      strokeDasharray: "4 10",
      strokeLinecap: "round",
      opacity: en(lt, 0.8, 0.4),
      style: {
        strokeDashoffset: -T * 40
      }
    }), xfer > 0 && !done && [0, 1, 2, 3].map(k => {
      const q = ((lt - 1.2) * 0.9 + k * 0.25) % 1,
        bx = Math.pow(1 - q, 3) * (x1 + 8) + 3 * Math.pow(1 - q, 2) * q * (x1 + 90) + 3 * (1 - q) * q * q * (x2 - 90) + q ** 3 * (x2 - 8),
        by = Math.pow(1 - q, 3) * cy + 3 * Math.pow(1 - q, 2) * q * (cy - 70) + 3 * (1 - q) * q * q * (cy - 70) + q ** 3 * cy;
      return /*#__PURE__*/React.createElement("g", {
        key: k,
        transform: `translate(${bx} ${by})`,
        opacity: Math.sin(q * Math.PI)
      }, /*#__PURE__*/React.createElement("rect", {
        x: "-13",
        y: "-16",
        width: "26",
        height: "32",
        rx: "4",
        fill: "#fff",
        stroke: "#E0A100",
        strokeWidth: "2.5"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "-7",
        y1: "-6",
        x2: "7",
        y2: "-6",
        stroke: "#E0A100",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "-7",
        y1: "0",
        x2: "7",
        y2: "0",
        stroke: "#E0A100",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "-7",
        y1: "6",
        x2: "3",
        y2: "6",
        stroke: "#E0A100",
        strokeWidth: "2"
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: A(x1 + 20, cy + 40, {
        width: x2 - x1 - 40,
        textAlign: 'center',
        opacity: en(lt, 1.0, 0.4)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 800, done ? '#22A565' : TTL)
    }, done ? '✓ Transfer Complete' : xfer > 0 ? `Sending SAR… ${Math.round(xfer * 100)}%` : 'Secure Connection'), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(PBar, {
      v: xfer,
      c: done ? '#22A565' : TEAL,
      hgt: 6
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(9, 600, '#8a989d'),
        marginTop: 6,
        whiteSpace: 'nowrap'
      }
    }, "\uD83D\uDD12 Encrypted \xB7 84 Standards")), /*#__PURE__*/React.createElement("div", {
      style: A(RX, 150, {
        width: 236,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...popS(pp(lt, 0.6, 0.6))
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 150,
        height: 150
      }
    }, done && /*#__PURE__*/React.createElement("div", {
      style: A(-12, -12, {
        width: 174,
        height: 174,
        borderRadius: '50%',
        border: '3px solid #22A565',
        opacity: 1 - prog(lt, 2.6, 3.4),
        transform: `scale(${1 + 0.3 * prog(lt, 2.6, 3.4)})`
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: '#1F2A55',
        border: '6px solid #F3C35B',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 16px 34px rgba(31,42,85,0.3)'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(34, 900, '#F3C35B')
    }, "CBSE"), /*#__PURE__*/React.createElement("div", {
      style: ptx(9, 600, '#E8E3D0')
    }, "Central Board of"), /*#__PURE__*/React.createElement("div", {
      style: ptx(9, 600, '#E8E3D0')
    }, "Secondary Education")), done && /*#__PURE__*/React.createElement("div", {
      style: A(108, 104, {
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#22A565',
        border: '3px solid #fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(20, 900, '#fff'),
        transform: `scale(${pp(lt, 2.6, 0.5)})`
      })
    }, "\u2713")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(15, 800),
        marginTop: 14
      }
    }, "CBSE SQAAF Portal"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        padding: '6px 12px',
        borderRadius: 10,
        background: done ? '#E3F6EC' : '#F1F5F6',
        whiteSpace: 'nowrap',
        ...ptx(11, 700, done ? '#22A565' : '#6b7b80')
      }
    }, done ? '✓ SAR Received · Ref #SQ-25-0418' : 'Awaiting Submission')));
  }
  function PObserve({
    lt
  }) {
    const C2 = [['Lesson Planning', 4.5], ['Student Engagement', 4.0], ['Questioning Techniques', 3.5], ['Assessment for Learning', 4.0], ['Classroom Management', 4.5]];
    const g = gl(lt, 0.4, 1.4),
      avg = C2.reduce((a, b) => a + b[1], 0) / C2.length * g,
      aud = lt > 2.0;
    const AU = [['Internal Audit', 'Completed · 12 Jul', true], ['Mock SQAAF Audit', aud ? 'Completed · 9 Aug' : 'Scheduled · 9 Aug', aud], ['Surprise Audit', 'Planned · Sep', false]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Classroom Observations & Audits",
      sub: "Structured observations \xB7 Mock, internal & surprise audits"
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 80,
      w: 460,
      h: 480,
      p: pp(lt, 0.05, 0.5),
      pad: 18
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Av, {
      i: "PS",
      c: "#7B6CF0",
      d: 42,
      f: 14
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(15, 800)
    }, "Ms. Priya Sharma"), /*#__PURE__*/React.createElement("div", {
      style: ptx(12, 500, '#8a989d')
    }, "Grade 7 \xB7 Science \xB7 Observed by Principal")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(28, 800, TTL)
    }, avg.toFixed(1)), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 600, '#8a989d')
    }, "out of 5"))), C2.map(([n2, v], k) => {
      const f = gl(lt, 0.4 + k * 0.15, 0.8);
      return /*#__PURE__*/React.createElement("div", {
        key: n2,
        style: {
          marginTop: 22
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          ...ptx(13, 600, '#51626A')
        }
      }, /*#__PURE__*/React.createElement("span", null, n2), /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#E0A100',
          letterSpacing: 2
        }
      }, '★★★★★'.slice(0, Math.round(v * f)), /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#DCE3E5'
        }
      }, '★★★★★'.slice(Math.round(v * f))))), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 6
        }
      }, /*#__PURE__*/React.createElement(PBar, {
        v: v / 5 * f,
        c: "#E07A5F"
      })));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 24,
        padding: '10px 12px',
        borderRadius: 10,
        background: '#E3F6EC',
        ...ptx(12, 700, '#22A565'),
        opacity: en(lt, 1.8, 0.4)
      }
    }, "\u2713 Feedback shared with teacher \xB7 Action plan created")), /*#__PURE__*/React.createElement(LpPCard, {
      x: 500,
      y: 80,
      w: 296,
      h: 480,
      p: pp(lt, 0.15, 0.5),
      pad: 18
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(15, 800)
    }, "Audit Tracker"), AU.map(([n2, d, ok], k) => /*#__PURE__*/React.createElement("div", {
      key: n2,
      style: {
        marginTop: 16,
        padding: 14,
        borderRadius: 12,
        border: `1.5px solid ${ok ? '#9EE0B8' : '#E0E6E8'}`,
        background: ok ? '#F0FBF4' : '#fff',
        ...up(en(lt, 0.3 + k * 0.15, 0.4), 8)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        background: ok ? '#22A565' : '#EEF2F3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(13, 900, ok ? '#fff' : '#8a989d'),
        transform: k === 1 ? `scale(${1 + 0.25 * Math.sin(Math.PI * prog(lt, 2.0, 2.3))})` : 'none'
      }
    }, ok ? '✓' : k + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(14, 800)
    }, n2), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 600, ok ? '#22A565' : '#8a989d')
    }, d))))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        ...ptx(12, 600, '#51626A')
      }
    }, "Gaps found"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(30, 800, '#E5484D')
      }
    }, aud ? 3 : 5), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 500, '#8a989d')
    }, aud ? '2 closed after mock audit' : 'from internal audit')));
  }
  function PTracking({
    lt
  }) {
    const F = ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'All Time'],
      sel = lt > 0.4 ? 2 : 1,
      c = en(lt, 0.3, 1.4),
      dl = prog(lt, 2.2, 2.6);
    const K = [['Total Login Activity', 265, '', '+18%', '#7B6CF0', '#EFECFD', '⇥'], ['Total Time Spent', 84, 'h 17m', '+12%', '#9B59D6', '#F3EAFB', '◷'], ['Evidence Collected', 1200, '', '+8%', '#22A565', '#E3F6EC', '▤'], ['Documents Finalized', 941, '', '-3%', '#E0A100', '#FFF4DE', '⎘'], ['Readiness Score', 688, '', '+9%', '#7B6CF0', '#EFECFD', '▁▃▅'], ['Webinars Attended', 42, '', '+14%', '#3B82F6', '#E8F0FE', '▶'], ['Meetings Completed', 18, '', '+6%', '#22A565', '#E3F6EC', '☺'], ['Audit Score', 688, ' / 900', '+5%', '#E0A100', '#FFF4DE', '☑']];
    const pts = [[0, 92], [12, 70], [32, 18], [48, 70], [62, 52], [78, 74], [92, 20], [100, 60]];
    const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x * 3.4} ${y * 1.3}`).join(' ');
    const B = [['July', 75, '#3B82F6'], ['August', 89, TEAL], ['September', 60, '#22A565']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Tracking",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 652,
        y: 14,
        w: 144,
        label: dl >= 1 ? '✓ Downloaded' : '⬇ Download Report',
        press: dl,
        done: dl >= 1,
        doneLabel: "\u2713 Downloaded",
        ghost: true
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 58, {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        ...ptx(12, 600, '#6b7b80')
      })
    }, "Duration:", /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 2,
        padding: 3,
        borderRadius: 9,
        background: '#EEF2F3'
      }
    }, F.map((f, k) => /*#__PURE__*/React.createElement("div", {
      key: f,
      style: {
        padding: '5px 11px',
        borderRadius: 7,
        background: k === sel ? TEAL : 'transparent',
        ...ptx(11, 700, k === sel ? '#fff' : '#6b7b80')
      }
    }, f))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 8,
        padding: '5px 12px',
        borderRadius: 8,
        border: `1.5px solid ${TEAL}`,
        whiteSpace: 'nowrap',
        ...ptx(12, 700, TTL)
      }
    }, "\uD83D\uDCC5 Q3 2025")), K.map(([l, v, suf, d, col, bg, ic], i) => {
      const x = 24 + i % 4 * 196,
        y = 98 + Math.floor(i / 4) * 82,
        n = Math.round(v * c);
      return /*#__PURE__*/React.createElement(LpPCard, {
        key: l,
        x: x,
        y: y,
        w: 184,
        h: 72,
        p: pp(lt, 0.05 + i * 0.05, 0.4),
        pad: 10
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10,
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 38,
          height: 38,
          borderRadius: 10,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...ptx(14, 800, col)
        }
      }, ic), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: ptx(20, 800)
      }, n.toLocaleString('en-IN'), suf), /*#__PURE__*/React.createElement("div", {
        style: ptx(10, 600, '#6b7b80')
      }, l), /*#__PURE__*/React.createElement("div", {
        style: ptx(9, 600, d.startsWith('-') ? '#E5484D' : '#22A565')
      }, d, " vs last period"))));
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 268,
      w: 384,
      h: 300,
      p: pp(lt, 0.4, 0.5),
      pad: 16
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(14, 700)
    }, "Login Activity"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '2px 8px',
        borderRadius: 8,
        background: '#FDE8E8',
        ...ptx(10, 700, '#E5484D'),
        opacity: en(lt, 1.6, 0.4)
      }
    }, "\u26A0 Many FG Users = 0 Activity")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(28, 800),
        marginTop: 6
      }
    }, Math.round(1284 * c).toLocaleString('en-IN')), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 500, '#8a989d')
    }, "Total Logins This Month"), /*#__PURE__*/React.createElement("svg", {
      width: "352",
      height: "150",
      style: {
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "lgT",
      x1: "0",
      x2: "0",
      y1: "0",
      y2: "1"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#22C3D6",
      stopOpacity: "0.35"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#22C3D6",
      stopOpacity: "0"
    }))), [0, 1, 2, 3].map(k => /*#__PURE__*/React.createElement("line", {
      key: k,
      x1: "0",
      x2: "340",
      y1: k * 40 + 10,
      y2: k * 40 + 10,
      stroke: "#EEF2F3"
    })), /*#__PURE__*/React.createElement("path", {
      d: path + ' L 340 130 L 0 130 Z',
      fill: "url(#lgT)",
      opacity: gl(lt, 0.8, 1.2)
    }), /*#__PURE__*/React.createElement("path", {
      d: path,
      fill: "none",
      stroke: "#22C3D6",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      pathLength: "1",
      strokeDasharray: "1",
      strokeDashoffset: 1 - gl(lt, 0.6, 1.4)
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        ...ptx(10, 600, '#8a989d')
      }
    }, /*#__PURE__*/React.createElement("span", null, "July"), /*#__PURE__*/React.createElement("span", null, "August"), /*#__PURE__*/React.createElement("span", null, "September"))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 420,
      y: 268,
      w: 376,
      h: 300,
      p: pp(lt, 0.5, 0.5),
      pad: 16
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(14, 700)
    }, "Total Time Spent"), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '2px 8px',
        borderRadius: 8,
        background: '#E3F6EC',
        ...ptx(10, 700, '#22A565')
      }
    }, "\u2197 +12% vs Last Month")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(28, 800),
        marginTop: 6
      }
    }, Math.round(284 * c), "h 36m"), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 500, '#8a989d')
    }, "Total Learning Time This Month"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: 150,
        marginTop: 10,
        borderBottom: '1px solid #EEF2F3'
      }
    }, B.map(([m, v, col], k) => {
      const g = gl(lt, 0.8 + k * 0.2, 0.9);
      return /*#__PURE__*/React.createElement("div", {
        key: m,
        style: {
          width: 54,
          height: 150,
          position: 'relative',
          borderRadius: 8,
          background: `${col}18`
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: A(0, 150 - 150 * (v / 100) * g, {
          width: 54,
          height: 150 * (v / 100) * g,
          borderRadius: 8,
          background: col
        })
      }), /*#__PURE__*/React.createElement("div", {
        style: A(0, 150 - 150 * (v / 100) * g - 18, {
          width: 54,
          textAlign: 'center',
          ...ptx(11, 700, col),
          opacity: g
        })
      }, Math.round(v * g), "%"));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: 6,
        ...ptx(10, 600, '#8a989d')
      }
    }, B.map(([m]) => /*#__PURE__*/React.createElement("span", {
      key: m
    }, m)))));
  }
  function PAuditSchedule({
    lt
  }) {
    const c = en(lt, 0.4, 1.4),
      sc = (74.9 * c).toFixed(1),
      vr = prog(lt, 2.3, 2.6);
    const D = [['Teaching & Learning', 78, TEAL], ['Research & Innovation', 65, '#EE7A3B'], ['Student Support', 82, '#22A565'], ['Infrastructure', 71, TEAL], ['Governance', 88, '#22A565'], ['Industry Connect', 60, '#EE7A3B']];
    const NS = ['Review and Approve the Audit Report', 'Submit Response to Improvement Areas', 'Draft Action Plan for Low-Scoring Domains', 'Await Official Accreditation Certificate'];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PH, {
      title: "Audit Schedule",
      sub: "Plan, Assign and Track All Audit Activities",
      right: /*#__PURE__*/React.createElement(Btn, {
        x: 666,
        y: 16,
        w: 130,
        label: "+ Schedule Audit"
      })
    }), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 80,
      w: 478,
      h: 314,
      p: pp(lt, 0.05, 0.5),
      pad: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 14px',
        whiteSpace: 'nowrap',
        ...ptx(13, 800, '#14532D')
      }
    }, "\uD83D\uDEE1 Audit Completed", /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 'auto',
        padding: '3px 9px',
        borderRadius: 10,
        background: '#E3F6EC',
        whiteSpace: 'nowrap',
        ...ptx(10, 700, '#22A565')
      }
    }, "\u25CF Completed"), /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '6px 12px',
        borderRadius: 16,
        background: vr >= 1 ? '#22A565' : TEAL,
        whiteSpace: 'nowrap',
        ...ptx(11, 700, '#fff'),
        transform: `scale(${1 - 0.08 * Math.sin(Math.PI * vr)})`
      }
    }, vr >= 1 ? '✓ Opened' : '▤ View Report')), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 160,
        background: '#1BA8B8',
        position: 'relative',
        padding: '14px 16px',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.18)',
        ...ptx(10, 600, '#fff')
      }
    }, "\u2713 SQAAF Accreditation \xB7 FY 2025-26"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...ptx(20, 800, '#fff'),
        marginTop: 8
      }
    }, "Audit Successfully Completed"), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 500, 'rgba(255,255,255,0.8)')
    }, "Wednesday, 12 November 2025 \xB7 On-Site Visit \xB7 Full Day"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 22,
        marginTop: 12
      }
    }, [[`${sc}%`, 'Overall Score', '#fff'], [`${Math.round(6 * c)} / 8`, 'Standards Cleared', '#fff'], ['Accredited', 'Accreditation Status', '#7CFFA8']].map(([v, l, col]) => /*#__PURE__*/React.createElement("div", {
      key: l
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(20, 800, col)
    }, v), /*#__PURE__*/React.createElement("div", {
      style: ptx(10, 500, 'rgba(255,255,255,0.8)')
    }, l)))), /*#__PURE__*/React.createElement("div", {
      style: A(370, 26, {
        width: 92,
        height: 92,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        border: '2px solid rgba(255,255,255,0.4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${pp(lt, 0.5, 0.6)})`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(24, 800, '#fff')
    }, sc), /*#__PURE__*/React.createElement("div", {
      style: ptx(10, 500, 'rgba(255,255,255,0.8)')
    }, "/ 100"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        padding: '14px 12px'
      }
    }, D.map(([l, v, col], k) => {
      const g = gl(lt, 0.7 + k * 0.1, 0.8);
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: {
          flex: 1,
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: ptx(15, 800, col)
      }, Math.round(v * g), "%"), /*#__PURE__*/React.createElement("div", {
        style: {
          ...ptx(8, 600, '#6b7b80'),
          whiteSpace: 'nowrap'
        }
      }, l), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 5
        }
      }, /*#__PURE__*/React.createElement(PBar, {
        v: v / 100 * g,
        c: col,
        hgt: 4
      })));
    }))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 514,
      y: 80,
      w: 282,
      h: 196,
      p: pp(lt, 0.2, 0.5),
      pad: 14
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        ...ptx(13, 800, '#14532D')
      }
    }, "\u2611 Next Steps"), NS.map((n2, k) => /*#__PURE__*/React.createElement("div", {
      key: n2,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 10,
        ...up(en(lt, 0.9 + k * 0.2, 0.4), 6)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: k < 2 ? '#E3F6F7' : '#FFF1E6',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(10, 800, k < 2 ? TTL : '#EE7A3B')
      }
    }, k + 1), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 600, '#334')
    }, n2)))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 514,
      y: 288,
      w: 282,
      h: 106,
      p: pp(lt, 0.3, 0.5),
      pad: 14
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 800, '#14532D')
    }, "\u24D8 Audit Information"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px 10px',
        marginTop: 8
      }
    }, [['Audit Date', '12 Nov 2025'], ['Mode', 'On-Site Visit'], ['Lead Auditor', 'Dr. Rajesh Kumar'], ['Framework', 'SQAAF 2025']].map(([a, b]) => /*#__PURE__*/React.createElement("div", {
      key: a
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(9, 600, '#8a989d')
    }, a), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 700)
    }, b))))), /*#__PURE__*/React.createElement(LpPCard, {
      x: 24,
      y: 406,
      w: 772,
      h: 162,
      p: pp(lt, 0.4, 0.5),
      pad: 14
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 800, '#14532D')
    }, "\u25A6 Audit Report Sections"), /*#__PURE__*/React.createElement("div", {
      style: ptx(10, 600, '#8a989d')
    }, "8 Sections \u2014 Click Any to Open")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
        marginTop: 10
      }
    }, [['1. Introduction', '#E3F6F7'], ['2. Scope of Audit', '#EEF0FB'], ['3. Audit Methodology', '#FFF4E6'], ['4. Key Findings', '#EEF0FB'], ['5. Score Card', '#E3F6EC'], ['6. SWOT Analysis', '#E3F6F7'], ['7. Graphs & Analytics', '#EEF0FB'], ['8. Conclusion', '#FDECEF']].map(([l, bg], k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        height: 46,
        borderRadius: 10,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        ...ptx(11, 700),
        ...popS(pp(lt, 1.2 + k * 0.1, 0.4))
      }
    }, l, /*#__PURE__*/React.createElement("span", {
      style: {
        color: TTL
      }
    }, "\u2192"))))));
  }
  function PortalScreen({
    j,
    lt,
    T,
    w,
    h
  }) {
    const MW = w - 200,
      TB = 52,
      Comp = [PDash, PEvid, PWorkflowCLT, PTracking, PReady, PExpert, PImprovePlan, PSelfAssess, PAuditSchedule][j];
    return /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: w,
        height: h,
        background: '#F4F7F8'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 200,
        height: h,
        background: '#fff',
        borderRight: '1px solid #E6ECEE'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(18, 16, {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        ...ptx(18, 800, TTL)
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: {
        width: 28,
        height: 28
      }
    }), "Luneblaze"), LpNAV.map((n2, k) => /*#__PURE__*/React.createElement("div", {
      key: n2,
      style: A(10, 64 + k * 42, {
        width: 180,
        height: 34,
        borderRadius: 10,
        background: k === j ? TEAL : 'transparent',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        ...ptx(13, k === j ? 700 : 600, k === j ? '#fff' : '#51626A')
      })
    }, n2)), /*#__PURE__*/React.createElement("div", {
      style: A(12, h - 62, {
        width: 176,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingTop: 12,
        borderTop: '1px solid #EEF2F3'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#F4AE84,#EE8C76)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(13, 800, '#fff'),
        boxShadow: '0 0 0 2px #fff, 0 0 0 4px #F4D5C4'
      }
    }, "MA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 700)
    }, "Mayank Arora"), /*#__PURE__*/React.createElement("div", {
      style: ptx(11, 600, '#8a989d')
    }, "Principal \xB7 Admin")))), /*#__PURE__*/React.createElement("div", {
      style: A(200, 0, {
        width: MW,
        height: TB,
        background: '#fff',
        borderBottom: '1px solid #E6ECEE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 14,
        padding: '0 20px',
        boxSizing: 'border-box'
      })
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...ptx(16, 400, '#8a989d')
      }
    }, "\uD83D\uDD14"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '4px 12px 4px 4px',
        borderRadius: 22,
        background: '#F4F7F8'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: '#1F2A55',
        border: '2px solid #F3C35B',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...ptx(10, 800, '#F3C35B')
      }
    }, "MPS"), /*#__PURE__*/React.createElement("div", {
      style: ptx(13, 800)
    }, "Mayank Public School"))), /*#__PURE__*/React.createElement("div", {
      style: A(200, TB, {
        width: MW,
        height: h - TB,
        overflow: 'hidden'
      })
    }, /*#__PURE__*/React.createElement(Comp, {
      lt: lt,
      T: T
    })));
  }
  /* 5b — Single-school portal workflow */
  const SCH_SCREENS = [['dashboard', 0, 0, 'dashboard'], ['evidence', 0, 0, 'documents-evidence'], ['workflow', 0, 0, 'workflow-clt'], ['maturity', 0, 0, 'progress-maturity'], ['readiness', 0, 0, 'readiness-score'], ['expert', 0, 0, 'expert-webinars'], ['improvement', 0, 0, 'improvement-plans'], ['selfassess', 0, 0, 'self-assessment'], ['observe', 0, 0, 'observations-audits']];
  const SCH_ITEMS = [['Documents and Evidence Management', 'Every policy, document and evidence file, organised by SQAAF standard.', SUN, 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6'], ['Workflow & CLT Management', 'Build CLT and focus groups, assign domains and track every owner.', '#3B82F6', 'M4 6h6v6H4zM14 12h6v6h-6zM10 9h4v6'], ['Track Progress & Maturity Levels', 'Live progress and maturity levels across every domain and cycle.', '#2FB57C', 'M4 20h16M6 16l4-5 3 3 5-7'], ['Readiness Score', 'Documentation, staff inclusivity and audits in one live score.', TEAL, 'M9 4h6v3H9zM7 6H5v15h14V6h-2M9 14l2 2 4-4'], ['Expert Assistance & Webinars', '24×7 expert help and monthly webinars for your teams.', CORAL, 'M4 5h16v11H9l-5 4zM8 9h8M8 12h5'], ['Improvement Plans Generation', 'Turn every gap into an action plan with owners and timelines.', '#7B6CF0', 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6'], ['Automated SQAAF Self-Assessment', 'Self-assessment auto-filled from your evidence, ready to submit.', '#E0A100', 'M5 4h14v16H5zM8 9l2 2 4-4M8 15h8'], ['Classroom Observations & Audits', 'Structured observations plus mock, internal and surprise audits.', '#E07A5F', 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 100 6 3 3 0 000-6z']];
  function SSchool({
    t,
    T
  }) {
    const IT = [3.8, 6.0, 8.5, 12.7, 14.4, 16.8, 19.5, 21.7],
      S0 = IT[0],
      END = 24.8;
    const open = k => en(t, IT[k], 0.45) * (1 - (k + 1 < IT.length ? en(t, IT[k + 1], 0.45) : 0));
    const LX = 80,
      LW = 700,
      LY = 230,
      RH = 64,
      GAP = 10,
      EXP = 62;
    const ys = [];
    let yy = LY;
    SCH_ITEMS.forEach((_, k) => {
      ys.push(yy);
      yy += RH + EXP * open(k) + GAP;
    });
    const WX = 830,
      WY = 226,
      WW = 1020,
      WH = 704,
      BAR = 44,
      CH = WH - BAR,
      win = pp(t, 0.9, 0.9);
    const cur = IT.reduce((a, s, k) => t >= s ? k + 1 : a, 0);
    const keys = [[S0 - 1.2, 1400, 700]];
    IT.forEach((s, k) => {
      keys.push([s - 0.55, LX + LW - 120, ys[k] + RH / 2]);
      keys.push([s + 0.1, LX + LW - 120, ys[k] + RH / 2]);
    });
    const [cx, cy] = kf(t, keys),
      curV = en(t, S0 - 1.2, 0.4) * (1 - en(t, END - 0.3, 0.4));
    const click = IT.map(s => prog(t, s - 0.15, s + 0.4)).find(p => p > 0 && p < 1);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: A(LX + 2, 66, {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 20,
        letterSpacing: 6,
        color: TTL,
        ...up(en(t, 0.2), 10)
      })
    }, "INSIDE EVERY SCHOOL"), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.35,
      x: LX,
      w: 1200,
      align: "left",
      y: 96,
      size: 96,
      text: "One portal. *Every* *workflow.*"
    }), SCH_ITEMS.map(([ti, d, c, ic], k) => {
      const o = open(k),
        on = cur === k + 1,
        rp = en(t, 1.0 + k * 0.1, 0.5);
      return /*#__PURE__*/React.createElement("div", {
        key: ti,
        style: A(LX, ys[k], {
          width: LW,
          height: RH + EXP * o,
          borderRadius: 22,
          boxSizing: 'border-box',
          overflow: 'hidden',
          background: o > 0.02 ? `rgba(234,247,248,${o})` : '#fff',
          border: `2px solid ${o > 0.5 ? TEAL : '#E3E9EB'}`,
          boxShadow: `0 ${8 + 10 * o}px ${20 + 16 * o}px rgba(30,43,48,${0.05 + 0.07 * o})`,
          opacity: rp,
          transform: `translateX(${(1 - rp) * -40}px)`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: A(14, 9, {
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${c}1F`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        })
      }, /*#__PURE__*/React.createElement("svg", {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: c,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: ic
      }))), /*#__PURE__*/React.createElement("div", {
        style: A(74, 0, {
          height: RH,
          display: 'flex',
          alignItems: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 23,
          color: INK,
          whiteSpace: 'nowrap'
        })
      }, ti), /*#__PURE__*/React.createElement("svg", {
        width: "22",
        height: "22",
        viewBox: "0 0 24 24",
        style: A(LW - 50, 21, {
          transform: `rotate(${180 * o}deg)`
        })
      }, /*#__PURE__*/React.createElement("path", {
        d: "M6 9l6 6 6-6",
        fill: "none",
        stroke: on ? TEAL : c,
        strokeWidth: "2.4",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })), /*#__PURE__*/React.createElement("div", {
        style: A(74, RH - 8, {
          width: LW - 120,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 17,
          lineHeight: 1.45,
          color: '#4a5a5f',
          opacity: o,
          transform: `translateY(${(1 - o) * 10}px)`
        })
      }, d));
    }), /*#__PURE__*/React.createElement("div", {
      style: A(WX, WY + (1 - win) * 120, {
        width: WW,
        height: WH,
        borderRadius: 22,
        overflow: 'hidden',
        background: '#fff',
        opacity: cl(win * 1.6, 0, 1),
        boxShadow: '0 40px 90px rgba(24,43,51,0.22), 0 0 0 1px rgba(24,43,51,0.08)'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: WW,
        height: BAR,
        background: '#F5F8F9',
        borderBottom: '1px solid #E6ECEE',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 18px',
        boxSizing: 'border-box'
      })
    }, ['#FF6159', '#FFBD2E', '#28C941'].map(c => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: c
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 18,
        width: 460,
        height: 26,
        borderRadius: 8,
        background: '#fff',
        border: '1px solid #E6ECEE',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 13,
        color: '#6b7b80'
      }
    }, "portal.luneblaze.com/", SCH_SCREENS[cur][3])), SCH_SCREENS.map(([n, w, h], j) => {
      const st = j === 0 ? 0.9 : IT[j - 1],
        nx = j < IT.length ? IT[j] : 1e9,
        vis = (j === 0 ? 1 : en(t, st, 0.5)) * (1 - en(t, nx, 0.5));
      if (vis <= 0) return null;
      const ih = WW * h / w,
        pan = Math.max(0, Math.min(ih - CH, 620)) * gl(t, st + 0.6, Math.max(0.5, nx - st - 1.0));
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: A(0, BAR, {
          width: WW,
          height: CH,
          overflow: 'hidden',
          background: '#fff',
          opacity: vis,
          transform: `translateX(${(1 - (j === 0 ? 1 : en(t, st, 0.5))) * 70}px)`
        })
      }, /*#__PURE__*/React.createElement(PortalScreen, {
        j: j,
        lt: t - st,
        T: T,
        w: WW,
        h: CH
      }));
    })), curV > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, click != null && /*#__PURE__*/React.createElement("div", {
      style: A(cx - 40 * click - 8, cy - 40 * click - 8, {
        width: 16 + 80 * click,
        height: 16 + 80 * click,
        borderRadius: '50%',
        border: `4px solid ${TEAL}`,
        opacity: 1 - click,
        boxSizing: 'border-box'
      })
    }), /*#__PURE__*/React.createElement("svg", {
      width: "46",
      height: "54",
      viewBox: "0 0 34 40",
      style: A(cx - 5, cy - 3, {
        opacity: curV,
        transform: `scale(${click != null ? 0.88 : 1})`,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      })
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 2 L4 30 L11 23 L16 35 L21 33 L16 21 L26 21 Z",
      fill: "#fff",
      stroke: INK,
      strokeWidth: "2.4",
      strokeLinejoin: "round"
    }))));
  }
  /* 6 — Three pillars, camera visits each */
  const PIL = [['QUALITY SYSTEMS', 'Makes quality repeatable', SUN, [['Document & evidence hub', 'Policies, SOPs, templates, records'], ['Core Learning Teams', 'Tasks, owners, collaboration'], ['SQAAF implementation', 'Milestones through portal filing'], ['Policies, SOPs & frameworks', 'Consistent across departments']]], ['QUALITY EXCELLENCE', 'Turns systems into outcomes', CORAL, [['24×7 expert assistance', 'Answers through the journey'], ['Mock audits', 'SQAAF & NABET readiness checks'], ['Classroom observations', 'Teaching quality, with insight'], ['Trainings & webinars', 'Leaders, teachers, teams']]], ['QUALITY GOVERNANCE', 'Shows where every school stands', MINT, [['AI quality dashboard', 'Gaps spotted automatically'], ['Readiness Score™', 'Monitored continuously'], ['Rankings & benchmarking', 'Across schools and campuses'], ['Executive reports', 'Board-ready, evidence-based']]]];
  function SPillars({
    t
  }) {
    const PA = [2.6, 5.5, 9.0],
      A0 = PA[0],
      END = 14.4;
    const cam = camAt([[PA[0], 400, 560, 1.3], [PA[1], 960, 560, 1.3], [PA[2], 1520, 560, 1.3], [END, 960, 540, 1]], t);
    const dimAll = en(t, A0, 0.6) * (1 - en(t, END, 0.6));
    return /*#__PURE__*/React.createElement("div", {
      style: camStyle(cam)
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        opacity: 1 - dimAll
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.2,
      y: 60,
      size: 110,
      text: "One ecosystem. *Three* *pillars.*"
    })), PIL.map(([h, tag, c, items], k) => {
      const x = 160 + k * 560,
        hp = pp(t, 0.9 + k * 0.4, 0.7),
        bp = gl(t, 1.2 + k * 0.4, 0.9);
      const a = PA[k],
        seen = en(t, a, 0.6),
        fp = gl(t, a, 1.5),
        lp = k < 2 ? gl(t, a + 1.7, 0.7) : 0,
        nc = k < 2 ? PIL[k + 1][2] : c;
      const d = 'M' + x + ' 375 V849 Q' + x + ' 875 ' + (x + 26) + ' 875 H' + (x + 454) + ' Q' + (x + 480) + ' 875 ' + (x + 480) + ' 849 V375';
      return /*#__PURE__*/React.createElement("div", {
        key: h,
        style: A(0, 0, {
          width: W,
          height: H,
          opacity: 1 - 0.65 * dimAll * (1 - seen)
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: A(x, 225, {
          width: 480,
          height: 150,
          borderRadius: '26px 26px 0 0',
          background: c,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          ...popS(hp)
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: HEAD,
          fontSize: 64,
          lineHeight: 1,
          color: INK
        }
      }, h), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 22,
          color: INK
        }
      }, tag)), /*#__PURE__*/React.createElement("div", {
        style: A(x, 375, {
          width: 480,
          height: 500 * bp,
          background: '#fff',
          borderRadius: '0 0 26px 26px',
          overflow: 'hidden'
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          background: c,
          opacity: 0.16 * fp
        }
      })), /*#__PURE__*/React.createElement("svg", {
        width: W,
        height: H,
        style: A(0, 0, {
          overflow: 'visible'
        })
      }, /*#__PURE__*/React.createElement("path", {
        d: d,
        fill: "none",
        stroke: c,
        strokeOpacity: "0.35",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: d,
        fill: "none",
        stroke: c,
        strokeWidth: "6",
        strokeLinecap: "round",
        pathLength: "1",
        strokeDasharray: "1",
        strokeDashoffset: 1 - fp
      }), k < 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
        x1: x + 480,
        y1: 625,
        x2: x + 480 + 80 * lp,
        y2: 625,
        stroke: c,
        strokeWidth: "8",
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: x + 480,
        cy: 625,
        r: 12 * cl(lp * 3, 0, 1),
        fill: c
      }), /*#__PURE__*/React.createElement("circle", {
        cx: x + 560,
        cy: 625,
        r: 12 * cl(lp * 3 - 2, 0, 1),
        fill: nc
      }))), items.map(([ti, su], j) => /*#__PURE__*/React.createElement(Card, {
        key: ti,
        x: x + 20,
        y: 390 + j * 120,
        w: 430,
        h: 108,
        c: c,
        n: '0' + (j + 1),
        title: ti,
        sub: su,
        p: pp(t, a + 0.4 + j * 0.3)
      })));
    }));
  }
  /* 7 — Readiness Score */
  const RS = [['Documentation status', 'Required documents & evidence', 0.86, SUN], ['Staff inclusivity', 'Participation in quality work', 0.72, CORAL], ['Audit frequency', 'Regularity of institutional audits', 0.8, MINT]];
  function SReadiness({
    t
  }) {
    const cx = 540,
      cy = 650,
      r = 300,
      fill = gl(t, 1.0, 3.6) * 0.84;
    const arc = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0, {
        opacity: en(t, 0.4, 0.6)
      })
    }, /*#__PURE__*/React.createElement("path", {
      d: arc,
      fill: "none",
      stroke: "#E6DDCC",
      strokeWidth: "50",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: arc,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "50",
      strokeLinecap: "round",
      pathLength: "1",
      strokeDasharray: "1",
      strokeDashoffset: 1 - fill
    })), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 5, cy - (r - 70), {
        width: 10,
        height: r - 70,
        borderRadius: 5,
        background: INK,
        transformOrigin: '50% 100%',
        transform: `rotate(${-90 + 180 * fill}deg)`,
        opacity: en(t, 0.6)
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 22, cy - 22, {
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: INK,
        opacity: en(t, 0.6)
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 300, cy + 50, {
        width: 600,
        textAlign: 'center',
        ...up(en(t, 1.0), 16)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: HEAD,
        fontSize: 84,
        lineHeight: 1,
        color: INK
      }
    }, "READINESS SCORE\u2122"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 24,
        color: TTL,
        marginTop: 6
      }
    }, "monitored continuously")), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.3,
      x: 1000,
      w: 820,
      align: "left",
      y: 170,
      size: 100,
      text: "Know how ready you are. *Every* *day.*"
    }), RS.map(([ti, su, v, c], k) => {
      const y = 500 + k * 130,
        p = en(t, 2.6 + k * 0.5, 0.5),
        f = gl(t, 2.9 + k * 0.5, 1.3);
      return /*#__PURE__*/React.createElement("div", {
        key: ti,
        style: A(1000, y, {
          width: 780,
          ...up(p, 16)
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 16
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 28,
          color: INK
        }
      }, ti), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 19,
          color: '#555'
        }
      }, su)), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 14,
          width: 760,
          height: 20,
          borderRadius: 10,
          background: '#E6DDCC',
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: `${v * f * 100}%`,
          height: 20,
          borderRadius: 10,
          background: c
        }
      })));
    }));
  }
  /* 8 — NABET */
  const STEPS = ['Assess', 'Plan', 'Implement', 'Monitor', 'Review', 'Improve'];
  const NAB = ['Quality process mapping', 'Documentation & evidence', 'Policies, SOPs & quality manual', 'Gap assessment & planning', 'Workflow & stakeholders', 'Real-time monitoring', 'Corrective & preventive actions', 'Mock audits & readiness', 'Continuous compliance', 'Expert advisory & support'];
  const NABC = [SUN, MINT, CORAL, SAGE, LILAC];
  function SNABET({
    t
  }) {
    const cx = 500,
      cy = 640,
      R = 220,
      ring = gl(t, 1.4, 1.4),
      local = t > 3 ? (t - 3) / 0.9 % 6 : -9;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.2,
      x: 120,
      w: 1700,
      align: "left",
      y: 70,
      size: 130,
      text: "Going for *NABET?*"
    }), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 0.9,
      x: 124,
      w: 1000,
      align: "left",
      y: 222
    }, "A structured path that goes beyond documentation."), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: R,
      fill: "none",
      stroke: TEAL,
      strokeWidth: "6",
      pathLength: "1",
      strokeDasharray: "1",
      strokeDashoffset: 1 - ring,
      transform: `rotate(-90 ${cx} ${cy})`
    })), /*#__PURE__*/React.createElement("div", {
      style: A(cx - 120, cy - 60, {
        width: 240,
        textAlign: 'center',
        fontFamily: HEAD,
        fontSize: 56,
        lineHeight: 1,
        color: INK,
        ...up(en(t, 1.6), 12)
      })
    }, "OUR", /*#__PURE__*/React.createElement("br", null), "APPROACH"), STEPS.map((s, k) => {
      const a = (-90 + k * 60) * Math.PI / 180,
        x = cx + Math.cos(a) * R,
        y = cy + Math.sin(a) * R,
        p = pp(t, 1.6 + k * 0.2);
      const w = cl(1 - Math.abs(local - k - 0.4) * 1.4, 0, 1);
      return /*#__PURE__*/React.createElement("div", {
        key: s,
        style: A(x - 75, y - 75, {
          width: 150,
          height: 150,
          transform: `scale(${p * (1 + 0.12 * w)})`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: A(0, 0, {
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: '#fff',
          border: `4px solid ${TEAL}`,
          boxSizing: 'border-box'
        })
      }), /*#__PURE__*/React.createElement("div", {
        style: A(0, 0, {
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: TEAL,
          opacity: w
        })
      }), /*#__PURE__*/React.createElement("div", {
        style: A(0, 0, {
          width: 150,
          height: 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: HEAD,
          fontSize: 38,
          color: w > 0.5 ? '#fff' : INK
        })
      }, s));
    }), /*#__PURE__*/React.createElement("div", {
      style: A(940, 290, {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 20,
        letterSpacing: 3,
        color: TTL,
        ...up(en(t, 3.0), 10)
      })
    }, "OUR NABET SUPPORT"), NAB.map((n, k) => {
      const c = NABC[k % 5],
        p = pp(t, 3.2 + k * 0.22);
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: A(940 + k % 2 * 440, 335 + Math.floor(k / 2) * 110, {
          width: 420,
          height: 92,
          borderRadius: 18,
          background: '#fff',
          border: `2px solid ${c}`,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 18px',
          boxShadow: '0 10px 22px rgba(30,43,48,0.08)',
          ...popS(p)
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 48,
          height: 48,
          borderRadius: 12,
          background: c,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: HEAD,
          fontSize: 28,
          color: INK
        }
      }, String(k + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 21,
          lineHeight: 1.2,
          color: INK
        }
      }, n));
    }));
  }
  /* 9 — School groups: the real Luneblaze portal, demonstrated */
  const PF = "'Inter', system-ui, sans-serif",
    PT = '#13B5B2',
    PI = '#182B33',
    PM = '#5B6B74',
    PB = '#F5F7F8';
  const ST = {
    Excellent: ['#E7F7EE', '#22A565'],
    Good: ['#EAF1FE', '#4C8DF6'],
    'At Risk': ['#FEF3E2', '#E8841C'],
    Critical: ['#FEECE9', '#F0653E']
  };
  const TOP = [['Delhi Public School', 'North', 92, 12], ['DAV Public School', 'North', 91, 11], ['Modern School', 'East', 90, 10], ['Army Public School', 'West', 90, 9], ['Ryan International School', 'South', 89, 9], ['Springdale School', 'Central', 88, 8], ['Green Valley School', 'North', 38, -8]];
  const stOf = r => r >= 80 ? 'Excellent' : r >= 60 ? 'Good' : r >= 45 ? 'At Risk' : 'Critical';
  const kf = (t, keys) => {
    if (t <= keys[0][0]) return keys[0].slice(1);
    for (let i = 0; i < keys.length - 1; i++) {
      const [a, ...va] = keys[i],
        [b, ...vb] = keys[i + 1];
      if (t <= b) {
        const p = gl(t, a, b - a);
        return va.map((v, k) => mix(v, vb[k], p));
      }
    }
    return keys[keys.length - 1].slice(1);
  };
  const PCard = ({
    x,
    y,
    w,
    h,
    children,
    p = 1,
    pad = 18
  }) => /*#__PURE__*/React.createElement("div", {
    style: A(x, y, {
      width: w,
      height: h,
      borderRadius: 18,
      background: '#fff',
      border: '1px solid #E6ECEE',
      boxSizing: 'border-box',
      padding: pad,
      boxShadow: '0 1px 2px rgba(24,43,51,0.04)',
      ...up(p, 18)
    })
  }, children);
  const NAV = [['Dashboard', 0], ['Submission', 1], ['Training & Guidance', 2], ['Governance & Insights', 3], ['Readiness Ranking', 4, true], ['School Profile', 5, true], ['Progress', 6], ['Audit', 7]];
  function Sidebar({
    active
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: A(0, 44, {
        width: 260,
        height: 776,
        background: '#fff',
        borderRight: '1px solid #E6ECEE',
        boxSizing: 'border-box',
        padding: '18px 14px'
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/logo.png",
      style: {
        width: 168,
        height: 42,
        display: 'block',
        margin: '0 0 20px 6px'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 36,
        borderRadius: 10,
        background: '#F0F4F5',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        fontFamily: PF,
        fontSize: 13,
        color: '#9AA7AE',
        marginBottom: 16
      }
    }, "Search"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, NAV.map(([l, k, sub]) => {
      const on = active === k;
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: {
          height: sub ? 36 : 42,
          borderRadius: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: sub ? '0 12px 0 34px' : '0 14px',
          background: on ? PT : 'transparent',
          color: on ? '#fff' : sub ? PM : '#3A4A52',
          fontFamily: PF,
          fontSize: sub ? 13 : 14,
          fontWeight: on ? 700 : 500,
          boxShadow: on ? '0 6px 14px rgba(19,181,178,0.3)' : 'none'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: sub ? 6 : 16,
          height: sub ? 6 : 16,
          borderRadius: sub ? '50%' : 4,
          background: on ? '#fff' : sub ? 'currentColor' : '#C9D3D7',
          flexShrink: 0
        }
      }), l);
    })), /*#__PURE__*/React.createElement("div", {
      style: A(14, 690, {
        width: 232,
        height: 62,
        borderRadius: 14,
        border: '1px solid #E6ECEE',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 12px',
        boxSizing: 'border-box'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: PI,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: PF,
        fontWeight: 700,
        fontSize: 14
      }
    }, "MA"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 700,
        fontSize: 14,
        color: PI
      }
    }, "Mayank Arora"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontSize: 12,
        color: PM
      }
    }, "Super Admin"))));
  }
  function PHead({
    title,
    sub,
    right
  }) {
    return /*#__PURE__*/React.createElement(PCard, {
      x: 24,
      y: 20,
      w: 1192,
      h: 92,
      pad: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 25,
        letterSpacing: -0.5,
        color: PI
      }
    }, title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontSize: 14,
        color: PM,
        marginTop: 4
      }
    }, sub)), right));
  }
  function Screen1({
    t
  }) {
    const kpis = [['Total Schools', 220, '', 'Active schools', '#4C8DF6', '#EAF1FE'], ['Avg. Readiness Score', 583, '/900', '▲ 33 pts vs last month', PT, '#E3F6F5'], ['Schools Improving', 155, '', '70% of total', '#22A565', '#E7F7EE'], ['Schools At Risk', 88, '', '40% of total', '#F0653E', '#FEECE9'], ['Avg. Maturity Level', 2.4, '', 'Stable', '#8B5CF6', '#F1EBFE']];
    const g = gl(t, 4.2, 1.6),
      circ = Math.PI * 170;
    const bands = [['Excellent', 46, '#22A565'], ['Good', 86, '#4C8DF6'], ['At Risk', 54, '#F5B945'], ['Critical', 34, '#EF5350']];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PHead, {
      title: "All Schools Dashboard",
      sub: "Monitor and track performance across all schools",
      right: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 12,
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: 50,
          borderRadius: 12,
          background: '#E3F6F5',
          border: '1px solid #BFE9E8',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 800,
          fontSize: 22,
          color: '#0F8E8C'
        }
      }, "220"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: 1,
          color: '#0F8E8C'
        }
      }, "SCHOOLS")), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 50,
          borderRadius: 12,
          border: '1px solid #E6ECEE',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 30,
          height: 30,
          borderRadius: '50%',
          background: '#F5A524',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: PF,
          fontWeight: 800,
          fontSize: 13
        }
      }, "G"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 700,
          fontSize: 14,
          color: PI
        }
      }, "Gayatri Public"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 700,
          fontSize: 11,
          color: '#E8841C'
        }
      }, "Premium"))))
    }), kpis.map(([l, v, suf, sub, c, bg], k) => {
      const p = en(t, 3.0 + k * 0.18, 0.6),
        n = v * en(t, 3.2 + k * 0.18, 1.3);
      return /*#__PURE__*/React.createElement(PCard, {
        key: l,
        x: 24 + k * 242,
        y: 130,
        w: 228,
        h: 126,
        p: p
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 44,
          height: 44,
          borderRadius: 12,
          background: bg,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 16,
          height: 16,
          borderRadius: 5,
          border: `3px solid ${c}`
        }
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 800,
          fontSize: 32,
          color: PI,
          lineHeight: 1
        }
      }, v % 1 ? n.toFixed(1) : Math.round(n), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 16,
          color: '#9AA7AE',
          fontWeight: 600
        }
      }, suf)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 600,
          fontSize: 13,
          color: '#3A4A52',
          marginTop: 8,
          whiteSpace: 'nowrap'
        }
      }, l), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 600,
          fontSize: 12,
          color: k === 1 ? '#22A565' : PM,
          marginTop: 4
        }
      }, sub))));
    }), /*#__PURE__*/React.createElement(PCard, {
      x: 24,
      y: 274,
      w: 590,
      h: 480,
      p: en(t, 3.8, 0.6)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 19,
        color: PI
      }
    }, "Readiness Ranking"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 700,
        fontSize: 13,
        color: '#22A565',
        marginTop: 4
      }
    }, "\u25B2 33 pts this month"), /*#__PURE__*/React.createElement("svg", {
      width: "554",
      height: "250",
      style: A(18, 80)
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 107 220 A 170 170 0 0 1 447 220",
      fill: "none",
      stroke: "#EEF2F3",
      strokeWidth: "34",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 107 220 A 170 170 0 0 1 447 220",
      fill: "none",
      stroke: PT,
      strokeWidth: "34",
      strokeLinecap: "round",
      strokeDasharray: `${circ * 0.648 * g} ${circ}`
    })), /*#__PURE__*/React.createElement("div", {
      style: A(0, 230, {
        width: 590,
        textAlign: 'center'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 52,
        color: PI,
        lineHeight: 1
      }
    }, Math.round(583 * g), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 22,
        color: '#9AA7AE'
      }
    }, "/900")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 600,
        fontSize: 14,
        color: PM,
        marginTop: 6
      }
    }, "Group readiness score")), /*#__PURE__*/React.createElement("div", {
      style: A(24, 380, {
        width: 542,
        display: 'flex',
        gap: 10
      })
    }, bands.map(([l, n, c], k) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        flex: 1,
        borderRadius: 12,
        background: PB,
        padding: '10px 12px',
        ...up(en(t, 5.2 + k * 0.12, 0.5), 10)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: PF,
        fontWeight: 600,
        fontSize: 12,
        color: PM
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: c
      }
    }), l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 22,
        color: PI,
        marginTop: 4
      }
    }, n))))), /*#__PURE__*/React.createElement(PCard, {
      x: 632,
      y: 274,
      w: 584,
      h: 480,
      p: en(t, 4.0, 0.6)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 19,
        color: PI
      }
    }, "Top Performing Schools"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 700,
        fontSize: 13,
        color: PT
      }
    }, "View all")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        marginTop: 22
      }
    }, TOP.slice(0, 6).map(([n, r, v], k) => {
      const p = en(t, 4.4 + k * 0.15, 0.5),
        f = gl(t, 4.6 + k * 0.15, 1.0);
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: {
          ...up(p, 10)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: PF,
          fontSize: 14
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          color: PI
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#9AA7AE',
          marginRight: 10
        }
      }, k + 1), n), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 800,
          color: '#22A565'
        }
      }, v, "%")), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 7,
          height: 8,
          borderRadius: 4,
          background: '#EEF2F3'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: `${v * f}%`,
          height: 8,
          borderRadius: 4,
          background: '#22A565'
        }
      })));
    }))));
  }
  function Screen2({
    t
  }) {
    const cols = [['School', 360], ['Region', 140], ['Readiness', 270], ['Score', 120], ['Status', 150], ['Growth', 110]];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PHead, {
      title: "Readiness Ranking",
      sub: "Compare readiness across every school in the group",
      right: /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10
        }
      }, ['Monthly', 'All Regions'].map(l => /*#__PURE__*/React.createElement("div", {
        key: l,
        style: {
          height: 42,
          borderRadius: 11,
          border: '1px solid #E6ECEE',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          fontFamily: PF,
          fontWeight: 600,
          fontSize: 14,
          color: PI
        }
      }, l, " \u25BE")))
    }), /*#__PURE__*/React.createElement("div", {
      style: A(24, 130, {
        width: 1192,
        height: 64,
        borderRadius: 16,
        background: '#FEF3E2',
        border: '1px solid #F8D9A8',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 20px',
        boxSizing: 'border-box',
        opacity: cl(pp(t, 2.2, 0.6) * 1.5, 0, 1),
        transform: `translateY(${(1 - pp(t, 2.2, 0.6)) * -16}px)`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: '#E8841C',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 18
      }
    }, "!"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 700,
        fontSize: 16,
        color: '#8A4A0B'
      }
    }, "88 schools need attention"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 500,
        fontSize: 15,
        color: '#8A4A0B'
      }
    }, "Missing evidence and pending activities detected in 3 domains"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        fontFamily: PF,
        fontWeight: 700,
        fontSize: 14,
        color: '#E8841C'
      }
    }, "Review \u2192")), /*#__PURE__*/React.createElement(PCard, {
      x: 24,
      y: 212,
      w: 1192,
      h: 542,
      p: en(t, 0.5, 0.6),
      pad: 0
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: 52,
        alignItems: 'center',
        padding: '0 24px',
        borderBottom: '1px solid #EEF2F3',
        fontFamily: PF,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 1,
        color: '#9AA7AE'
      }
    }, cols.map(([c, w]) => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        width: w
      }
    }, c.toUpperCase()))), TOP.map(([n, rg, r, gr], k) => {
      const p = en(t, 0.9 + k * 0.16, 0.5),
        f = gl(t, 1.1 + k * 0.16, 1.0),
        [bg, fg] = ST[stOf(r)],
        hl = k === 0 && t > 5.6;
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: {
          display: 'flex',
          height: 66,
          alignItems: 'center',
          padding: '0 24px',
          borderBottom: '1px solid #F2F5F6',
          background: hl ? '#E3F6F5' : 'transparent',
          fontFamily: PF,
          fontSize: 15,
          color: PI,
          opacity: p,
          transform: `translateX(${(1 - p) * 40}px)`
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 360,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontWeight: 600
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 30,
          height: 30,
          borderRadius: 9,
          background: k < 3 ? '#FFF4D6' : PB,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 13,
          color: k < 3 ? '#B7791F' : PM
        }
      }, k === 6 ? 218 : k + 1), n), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 140,
          color: PM
        }
      }, rg), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 270,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 180,
          height: 8,
          borderRadius: 4,
          background: '#EEF2F3'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: `${r * f}%`,
          height: 8,
          borderRadius: 4,
          background: fg
        }
      })), /*#__PURE__*/React.createElement("b", null, r, "%")), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 120,
          fontWeight: 700
        }
      }, Math.round(r * 9), /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#9AA7AE',
          fontWeight: 500
        }
      }, "/900")), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 150
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '5px 12px',
          borderRadius: 8,
          background: bg,
          color: fg,
          fontWeight: 700,
          fontSize: 13
        }
      }, stOf(r))), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 110,
          fontWeight: 700,
          color: gr > 0 ? '#22A565' : '#F0653E'
        }
      }, gr > 0 ? '▲ ' : '▼ ', Math.abs(gr), "%"));
    })));
  }
  function Screen3({
    t
  }) {
    const params = [['Documentation Status', 373, 405, '#4C8DF6'], ['Staff Inclusivity', 207, 225, '#22A565'], ['Audit Frequency', 248, 270, '#F5A524']];
    const doms = [['Curriculum, Pedagogy & Assessment', 94], ['Infrastructure', 88], ['Human Resources', 91], ['Inclusive Practices', 86], ['Management & Governance', 93], ['Leadership', 95], ['Beneficiary Satisfaction', 89]];
    const btn = t > 3.4 && t < 3.7,
      toast = pp(t, 3.8, 0.5) * (1 - en(t, 6.6, 0.4)),
      ring = gl(t, 0.6, 1.4),
      C = 2 * Math.PI * 70;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PHead, {
      title: "Delhi Public School",
      sub: "North Region \xB7 Rank 1 of 220 \xB7 Level 4 Dynamic",
      right: /*#__PURE__*/React.createElement("div", {
        style: {
          height: 46,
          borderRadius: 12,
          background: PT,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          fontFamily: PF,
          fontWeight: 700,
          fontSize: 15,
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 18px rgba(19,181,178,0.35)',
          transform: `scale(${btn ? 0.94 : 1})`
        }
      }, "\u2913 Executive Report")
    }), /*#__PURE__*/React.createElement(PCard, {
      x: 24,
      y: 130,
      w: 430,
      h: 300,
      p: en(t, 0.4, 0.6)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 18,
        color: PI
      }
    }, "Readiness Score\u2122"), /*#__PURE__*/React.createElement("svg", {
      width: "180",
      height: "180",
      style: A(125, 70)
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "90",
      cy: "90",
      r: "70",
      fill: "none",
      stroke: "#EEF2F3",
      strokeWidth: "18"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "90",
      cy: "90",
      r: "70",
      fill: "none",
      stroke: PT,
      strokeWidth: "18",
      strokeLinecap: "round",
      strokeDasharray: `${C * 0.92 * ring} ${C}`,
      transform: "rotate(-90 90 90)"
    })), /*#__PURE__*/React.createElement("div", {
      style: A(0, 128, {
        width: 430,
        textAlign: 'center',
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 36,
        color: PI
      })
    }, Math.round(828 * ring), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#9AA7AE',
        fontWeight: 600
      }
    }, "of 900"))), /*#__PURE__*/React.createElement(PCard, {
      x: 472,
      y: 130,
      w: 744,
      h: 300,
      p: en(t, 0.6, 0.6)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 18,
        color: PI
      }
    }, "Score Breakdown"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
        marginTop: 30
      }
    }, params.map(([l, v, m, c], k) => {
      const f = gl(t, 1.0 + k * 0.25, 1.0);
      return /*#__PURE__*/React.createElement("div", {
        key: l
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: PF,
          fontSize: 15
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          color: PI
        }
      }, l), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 800,
          color: PI
        }
      }, Math.round(v * f), /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#9AA7AE',
          fontWeight: 500
        }
      }, "/", m))), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 9,
          height: 12,
          borderRadius: 6,
          background: '#EEF2F3'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: `${v / m * 100 * f}%`,
          height: 12,
          borderRadius: 6,
          background: c
        }
      })));
    }))), /*#__PURE__*/React.createElement(PCard, {
      x: 24,
      y: 448,
      w: 800,
      h: 306,
      p: en(t, 1.2, 0.6)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 18,
        color: PI
      }
    }, "Domain-wise Performance ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 13,
        color: PM,
        marginLeft: 8
      }
    }, "7 domains \xB7 84 standards")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 22,
        height: 200,
        marginTop: 20,
        padding: '0 10px'
      }
    }, doms.map(([l, v], k) => {
      const f = gl(t, 1.6 + k * 0.12, 0.9);
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontWeight: 800,
          fontSize: 13,
          color: PI,
          opacity: f
        }
      }, v, "%"), /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          height: 150 * (v / 100) * f,
          borderRadius: '8px 8px 3px 3px',
          background: k % 2 ? '#7FD6D4' : PT
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: PF,
          fontSize: 10.5,
          lineHeight: 1.2,
          color: PM,
          textAlign: 'center',
          height: 26
        }
      }, l.split(' ')[0]));
    }))), /*#__PURE__*/React.createElement(PCard, {
      x: 842,
      y: 448,
      w: 374,
      h: 306,
      p: en(t, 1.4, 0.6)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 18,
        color: PI
      }
    }, "Classroom Observations"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 800,
        fontSize: 46,
        color: PI,
        marginTop: 18
      }
    }, Math.round(46 * en(t, 1.8, 1.2))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PF,
        fontWeight: 600,
        fontSize: 14,
        color: '#22A565'
      }
    }, "\u25B2 18% teaching quality this term"), /*#__PURE__*/React.createElement("svg", {
      width: "330",
      height: "90",
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement("polyline", {
      points: "0,80 55,66 110,70 165,48 220,40 275,26 330,12",
      fill: "none",
      stroke: PT,
      strokeWidth: "4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      pathLength: "1",
      strokeDasharray: "1",
      strokeDashoffset: 1 - gl(t, 2.0, 1.4)
    }))), /*#__PURE__*/React.createElement("div", {
      style: A(820, 690, {
        height: 50,
        borderRadius: 14,
        background: PI,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 20px',
        fontFamily: PF,
        fontWeight: 600,
        fontSize: 15,
        boxShadow: '0 12px 30px rgba(24,43,51,0.3)',
        opacity: cl(toast * 1.5, 0, 1),
        transform: `translateY(${(1 - toast) * 20}px)`
      })
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#22A565',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13
      }
    }, "\u2713"), "Board-ready report generated \xB7 PDF"));
  }
  const TAGS = [[4.6, 'AI Powered Group Quality Dashboard'], [6.0, 'Continuous Quality Monitoring (Readiness Score)'], [11.8, 'Group Schools Rankings & Benchmarking'], [12.8, 'Groupwide Standard Policies & SOPs'], [17.8, 'School-wise Performance'], [19.4, 'Groupwide Compliance & Risk Alerts'], [21.0, 'Analytics & Progress Reports']];
  const GW = [[0, 0], [2.3, 2.3], [4.2, 4.6], [5.4, 6.0], [6.6, 7.0], [6.9, 8.4], [7.4, 9.9], [7.6, 10.2], [7.9, 10.6], [9.0, 11.8], [9.8, 12.8], [10.0, 15.5], [10.4, 16.5], [10.7, 16.9], [11.4, 17.8], [12.4, 19.4], [13.2, 21.0], [15.0, 22.3], [17.0, 24]];
  const warp = (t, M) => {
    if (t <= M[0][0]) return t;
    for (let i = 0; i < M.length - 1; i++) {
      const [a, oa] = M[i],
        [b, ob] = M[i + 1];
      if (t <= b) return oa + (ob - oa) * ((t - a) / (b - a));
    }
    const [a, oa] = M[M.length - 1];
    return oa + (t - a);
  };
  function SGroups({
    t: tn,
    T
  }) {
    const t = warp(tn + 2.0, GW);
    const GS = 0.74,
      GX = 750,
      GY = 236,
      win = gl(t, 2.3, 1.1),
      tOut = gl(t, 2.0, 0.6);
    const scr = t < 10.6 ? 0 : t < 16.9 ? 1 : 2,
      sStart = [2.8, 10.6, 16.9][scr],
      st = t - sStart,
      sw = en(t, sStart, 0.5);
    const cam = camAt([[5.0, 1180, 470, 1.12], [8.3, 960, 540, 1], [18.2, 1180, 470, 1.1], [22.3, 960, 540, 1]], t);
    const sideY = 44 + 18 + 42 + 20 + 36 + 16 + 4 * 46 + 18;
    const [cx, cy] = kf(t, [[8.4, 1400, 800], [9.9, 140, sideY], [10.4, 140, sideY], [15.6, 504, 44 + 212 + 52 + 33], [16.6, 504, 44 + 212 + 52 + 33], [19.6, 1370, 110], [22, 1370, 110]]);
    const click = [10.2, 16.5, 20.3].map(c => prog(t, c, c + 0.5)).find(p => p > 0 && p < 1);
    const curV = en(t, 8.4, 0.3) * (1 - en(t, 22, 0.3));
    const SCR = [Screen1, Screen2, Screen3][scr];
    const list = en(t, 2.6, 0.7);
    let active = -1;
    TAGS.forEach(([at], k) => {
      if (t >= at) active = k;
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: list
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 2.5,
      x: 70,
      w: 660,
      align: "left",
      y: 56,
      size: 84,
      text: "Every campus. *One* *portal.*"
    }), /*#__PURE__*/React.createElement("div", {
      style: A(74, 250, {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: 4,
        color: '#8a7d6c'
      })
    }, "WHAT YOUR GROUP SEES"), TAGS.map(([at, l], k) => {
      const on = t >= at,
        tick = pp(t, at, 0.55),
        cur = k === active,
        row = en(t, 2.8 + k * 0.08, 0.5);
      return /*#__PURE__*/React.createElement("div", {
        key: l,
        style: A(40, 290 + k * 72, {
          width: 690,
          height: 60,
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 18px',
          boxSizing: 'border-box',
          background: cur ? '#fff' : 'transparent',
          boxShadow: cur ? '0 14px 30px rgba(30,43,48,0.12)' : 'none',
          border: cur ? `2px solid ${TEAL}` : '2px solid transparent',
          opacity: row,
          transform: `translateX(${(1 - row) * -30 + (cur ? 10 : 0)}px)`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 32,
          height: 32,
          borderRadius: '50%',
          flexShrink: 0,
          position: 'relative',
          border: `3px solid ${on ? TEAL : '#CFC6B6'}`,
          boxSizing: 'border-box',
          background: on ? TEAL : '#fff'
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: "26",
        height: "26",
        viewBox: "0 0 26 26",
        style: A(0, 0)
      }, /*#__PURE__*/React.createElement("path", {
        d: "M6 13.5 L11 18 L20 8.5",
        fill: "none",
        stroke: "#fff",
        strokeWidth: "3.4",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pathLength: "1",
        strokeDasharray: "1",
        strokeDashoffset: 1 - tick
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: on ? 800 : 600,
          fontSize: 19,
          color: on ? INK : '#a49a8a',
          whiteSpace: 'nowrap'
        }
      }, l));
    })), /*#__PURE__*/React.createElement("div", {
      style: camStyle(cam)
    }, /*#__PURE__*/React.createElement("div", {
      style: A(GX, GY + (1 - win) * 500, {
        width: 1500,
        height: 820,
        transformOrigin: '0 0',
        transform: `scale(${GS * mix(0.9, 1, win)})`,
        opacity: cl(win * 2, 0, 1)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 1500,
        height: 820,
        borderRadius: 18,
        overflow: 'hidden',
        background: PB,
        boxShadow: '0 40px 90px rgba(24,43,51,0.28), 0 0 0 1px rgba(24,43,51,0.08)'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 1500,
        height: 44,
        background: '#fff',
        borderBottom: '1px solid #E6ECEE',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 18px',
        boxSizing: 'border-box'
      })
    }, ['#FF6159', '#FFBD2E', '#28C941'].map(c => /*#__PURE__*/React.createElement("div", {
      key: c,
      style: {
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: c
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 20,
        width: 520,
        height: 28,
        borderRadius: 8,
        background: '#F0F4F5',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        fontFamily: PF,
        fontSize: 13,
        color: PM
      }
    }, "\uD83D\uDD12\xA0 portal.luneblaze.com/", ['dashboard', 'readiness-ranking', 'schools/delhi-public-school'][scr])), /*#__PURE__*/React.createElement(Sidebar, {
      active: [0, 4, 5][scr]
    }), /*#__PURE__*/React.createElement("div", {
      style: A(260, 44, {
        width: 1240,
        height: 776,
        opacity: sw,
        transform: `translateY(${(1 - sw) * 14}px)`
      })
    }, /*#__PURE__*/React.createElement(SCR, {
      t: st
    }))), curV > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, click != null && /*#__PURE__*/React.createElement("div", {
      style: A(cx - 40 * click - 8, cy - 40 * click - 8, {
        width: 16 + 80 * click,
        height: 16 + 80 * click,
        borderRadius: '50%',
        border: `4px solid ${PT}`,
        opacity: 1 - click,
        boxSizing: 'border-box'
      })
    }), /*#__PURE__*/React.createElement("svg", {
      width: "46",
      height: "54",
      viewBox: "0 0 34 40",
      style: A(cx - 5, cy - 3, {
        opacity: curV,
        transform: `scale(${click != null ? 0.88 : 1})`,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
      })
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 2 L4 30 L11 23 L16 35 L21 33 L16 21 L26 21 Z",
      fill: "#fff",
      stroke: PI,
      strokeWidth: "2.4",
      strokeLinejoin: "round"
    }))))));
  }
  /* 10 — Why Luneblaze: one character frame, six rows that flip from the old way to the Luneblaze way */
  const SHIFT = [['Creating documents', 'Building structured systems', SUN], ['Depending on consultants', 'Platform-driven quality', PEACH], ['Last-minute panic', 'Continuous readiness', CORAL], ['Scattered files', 'One central repository', SAGE], ['Periodic updates', 'Real-time progress tracking', MINT], ['Isolated fixes', 'Continuous improvement', LILAC]];
  function IconDot({
    src,
    d = 56,
    c
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: d,
        height: d,
        borderRadius: '50%',
        background: '#fff',
        flexShrink: 0,
        boxShadow: `0 0 0 3px ${c}`,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: src,
      style: {
        width: d,
        height: d,
        display: 'block'
      }
    }));
  }
  function SShift({
    t,
    T
  }) {
    const CV = 9.6,
      STEP = 0.85;
    const fr = pp(t, 0.5, 0.9),
      morph = gl(t, CV - 0.3, 1.0),
      stress = t < CV ? en(t, 2.4, 0.6) : 1 - morph;
    const OLD = k => 2.3 + k * 0.85;
    const FX = 110,
      FY = 270,
      FS = 560,
      kb = mix(1.12, 1.0, prog(t, CV, CV + 10));
    const lab = gl(t, CV - 0.1, 0.6),
      RX = 760,
      RY = 300,
      RH = 92;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.1,
      y: 40,
      size: 110,
      text: "Why *Luneblaze?*"
    }), /*#__PURE__*/React.createElement(Sub, {
      t: t,
      at: 0.7,
      y: 168,
      color: TTL,
      weight: 800,
      size: 28
    }, "Beyond Consultancy. Beyond Software. A Complete Quality Ecosystem."), /*#__PURE__*/React.createElement("div", {
      style: A(FX, FY, {
        width: FS,
        height: FS,
        ...popS(fr, 0.7)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(-18, -18, {
        width: FS + 36,
        height: FS + 36,
        borderRadius: mix(FS, 46, morph),
        border: `4px dashed ${CORAL}`,
        boxSizing: 'border-box',
        transform: `rotate(${T * 9 * (1 - morph)}deg)`,
        opacity: 0.7 * (1 - morph)
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(-12, -12, {
        width: FS + 24,
        height: FS + 24,
        borderRadius: mix(FS, 42, morph),
        border: `6px solid ${TEAL}`,
        boxSizing: 'border-box',
        opacity: morph
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: FS,
        height: FS,
        borderRadius: mix(FS / 2, 32, morph),
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(30,43,48,0.20)',
        background: '#fff',
        transform: `rotate(${Math.sin(T * 8) * 0.7 * stress}deg)`
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/p4-hub.png",
      style: A(0, 0, {
        width: FS,
        height: FS,
        opacity: 1 - morph
      })
    }), /*#__PURE__*/React.createElement("img", {
      src: "assets/p6-photo.png",
      style: A(-(FS * 1.777 - FS) * 0.42, 0, {
        width: FS * 1.777,
        height: FS,
        opacity: morph,
        transform: `scale(${kb})`,
        transformOrigin: '50% 50%'
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: A(FS / 2, FS - 26, {
        width: 0,
        display: 'flex',
        justifyContent: 'center'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 54,
        minWidth: 330
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 330,
        height: 54,
        borderRadius: 27,
        background: INK,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: 3,
        opacity: en(t, 1.0) * (1 - lab),
        transform: `translateY(${lab * -16}px)`
      })
    }, "THE TRADITIONAL WAY"), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: 330,
        height: 54,
        borderRadius: 27,
        background: TEAL,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: 3,
        opacity: lab,
        transform: `translateY(${(1 - lab) * 16}px)`,
        boxShadow: '0 12px 26px rgba(23,174,185,0.35)'
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: {
        width: 30,
        height: 30,
        background: '#fff',
        borderRadius: '50%'
      }
    }), "THE LUNEBLAZE WAY")))), /*#__PURE__*/React.createElement(Ring, {
      cx: FX + FS / 2,
      cy: FY + FS / 2,
      t: t,
      at: CV + 0.2,
      r0: 300,
      r1: 640
    }), /*#__PURE__*/React.createElement("div", {
      style: A(RX, RY - 46, {
        width: 1060,
        display: 'flex',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 17,
        letterSpacing: 3,
        ...up(en(t, 1.2), 10)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 430,
        color: '#8a7d6c'
      }
    }, "BEFORE"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        color: TTL,
        opacity: en(t, CV + 0.4)
      }
    }, "WITH LUNEBLAZE")), SHIFT.map(([l, r, c], k) => {
      const y = RY + k * RH,
        p = pp(t, OLD(k), 0.55),
        conv = CV + 0.5 + k * STEP;
      const st = gl(t, conv, 0.45),
        ar = gl(t, conv + 0.2, 0.4),
        np = pp(t, conv + 0.4, 0.6),
        glow = Math.sin(Math.PI * prog(t, conv + 0.4, conv + 1.4));
      const shake = t < conv ? Math.sin(T * 9 + k * 2) * 2.5 * stress : 0;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: l
      }, /*#__PURE__*/React.createElement("div", {
        style: A(RX + shake, y, {
          width: 430,
          height: 76,
          borderRadius: 38,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 22px 0 10px',
          boxSizing: 'border-box',
          background: `rgba(255,255,255,${1 - 0.75 * st})`,
          border: `2px solid ${st > 0.5 ? '#E2DACB' : c}`,
          boxShadow: `0 10px 22px rgba(30,43,48,${0.10 * (1 - st)})`,
          opacity: cl(p * 1.5, 0, 1),
          transform: `translateX(${(1 - p) * -40}px) scale(${mix(1, 0.94, st)})`,
          transformOrigin: '0 50%'
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          filter: `grayscale(${st})`,
          opacity: mix(1, 0.6, st)
        }
      }, /*#__PURE__*/React.createElement(IconDot, {
        src: `assets/wl-old-${k + 1}.png`,
        c: c
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 22,
          color: st > 0.5 ? '#9b9387' : INK,
          whiteSpace: 'nowrap'
        }
      }, l, /*#__PURE__*/React.createElement("span", {
        style: A(-4, '52%', {
          width: `calc(${st * 100}% + 8px)`,
          height: 3,
          borderRadius: 2,
          background: CORAL
        })
      }))), /*#__PURE__*/React.createElement("svg", {
        width: "70",
        height: "76",
        style: A(RX + 430, y)
      }, /*#__PURE__*/React.createElement("line", {
        x1: "12",
        y1: "38",
        x2: 12 + 34 * ar,
        y2: "38",
        stroke: TEAL,
        strokeWidth: "5",
        strokeLinecap: "round"
      }), ar > 0.6 && /*#__PURE__*/React.createElement("path", {
        d: "M 44 28 L 56 38 L 44 48",
        fill: "none",
        stroke: TEAL,
        strokeWidth: "5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        opacity: (ar - 0.6) / 0.4
      })), /*#__PURE__*/React.createElement("div", {
        style: A(RX + 500, y, {
          width: 560,
          height: 76,
          borderRadius: 38,
          background: c,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 22px 0 10px',
          boxSizing: 'border-box',
          boxShadow: `0 ${12 + 10 * glow}px ${26 + 20 * glow}px rgba(30,43,48,${0.14 + 0.1 * glow})`,
          opacity: cl(np * 1.5, 0, 1),
          transform: `translateX(${(1 - np) * 50}px) scale(${mix(0.85, 1, np) * (1 + 0.03 * glow)})`,
          transformOrigin: '0 50%'
        })
      }, /*#__PURE__*/React.createElement(IconDot, {
        src: `assets/wl-new-${k + 1}.png`,
        c: "#fff"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 23,
          color: INK,
          whiteSpace: 'nowrap'
        }
      }, r), /*#__PURE__*/React.createElement("div", {
        style: {
          marginLeft: 'auto',
          width: 34,
          height: 34,
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${pp(t, conv + 0.8, 0.5)})`
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: "20",
        height: "20",
        viewBox: "0 0 20 20"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M4 10.5 L8.5 14.5 L16 6",
        fill: "none",
        stroke: INK,
        strokeWidth: "3",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })))));
    }));
  }
  /* 11 — Trust */
  const PARTNERS = ['Father Agnel Group of Schools', 'Shalom Group of Schools', 'Gayatri Group of Schools', 'Holy Child Group of Schools', 'GD Goenka School', "St. Michael's School", 'Chinmaya Vidyalaya', 'Evergreen Public School', 'Livingstone Foundation Intl.', 'SMS Academy of Central Education'];
  const PINS = [[262, 590], [315, 615], [290, 700], [336, 712], [384, 715], [672, 720], [145, 780], [465, 790], [290, 870], [255, 1025]];
  function STrust({
    t,
    T
  }) {
    // map geometry (p13-map.png is the brochure map cropped at page x50,y440; 700x790)
    const MS = 0.92,
      MX = 150,
      MY = 205;
    const pin = ([x, y]) => [MX + (x - 50) * MS, MY + (y - 440) * MS];
    const mapIn = en(t, 0.3, 1.0),
      G = 10.4,
      out = gl(t, G - 0.6, 0.8),
      gin = en(t, G, 0.8);
    const n1 = Math.round(100 * en(t, 1.4, 1.8)),
      n2 = Math.round(10 * en(t, 1.8, 1.4)),
      cnt = en(t, 1.2) * (1 - gl(t, 4.5, 0.5));
    const slot = k => [1070 + k % 2 * 380, 236 + Math.floor(k / 2) * 150];
    // world (p13-world.png 640x320)
    const WX = 520,
      WY = 300,
      WS = 1.4,
      wp = (x, y) => [WX + x * WS, WY + y * WS];
    const IN = wp(440, 172),
      AE = wp(395, 128),
      NG = wp(305, 166);
    const arc = (p1, p2, at, lift) => {
      const d = gl(t, at, 1.0),
        mx = (p1[0] + p2[0]) / 2,
        my = Math.min(p1[1], p2[1]) - lift;
      return /*#__PURE__*/React.createElement("path", {
        d: `M ${p1[0]} ${p1[1]} Q ${mx} ${my} ${p2[0]} ${p2[1]}`,
        fill: "none",
        stroke: TEAL,
        strokeWidth: "6",
        strokeLinecap: "round",
        pathLength: "1",
        strokeDasharray: "1",
        strokeDashoffset: 1 - d
      });
    };
    const gcard = (src, name, country, x, y, at, w) => /*#__PURE__*/React.createElement("div", {
      style: A(x, y, {
        width: 330,
        borderRadius: 26,
        background: '#fff',
        padding: 20,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 20px 44px rgba(30,43,48,0.16)',
        border: `3px solid ${TEAL}`,
        ...popS(pp(t, at, 0.7))
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: src,
      style: {
        width: w,
        height: 0.8 * w,
        objectFit: 'contain'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 22,
        color: INK,
        textAlign: 'center'
      }
    }, name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 21,
        color: TTL
      }
    }, country));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: 1 - out,
        transform: `scale(${mix(1, 0.9, out)})`
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 0.1,
      x: 1040,
      w: 720,
      align: "left",
      y: 74,
      size: 84,
      text: "Trusted *across* *India.*"
    }), /*#__PURE__*/React.createElement("div", {
      style: A(MX - 20, MY - 10, {
        width: 700 * MS + 40,
        height: 790 * MS + 20,
        borderRadius: 36,
        background: 'rgb(222,238,240)',
        overflow: 'hidden',
        clipPath: mapIn < 1 ? `circle(${mapIn * 110}% at 40% 45%)` : 'none'
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/p13-map.png",
      style: A(20, 10, {
        width: 700 * MS,
        height: 790 * MS,
        transform: `scale(${mix(1.15, 1, mapIn)})`,
        transformOrigin: '45% 45%'
      })
    })), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0, {
        pointerEvents: 'none'
      })
    }, PINS.map((p, k) => {
      const [x, y] = pin(p),
        at = 1.2 + k * 0.3,
        [sx, sy] = slot(k),
        fly = gl(t, 4.8 + k * 0.32, 0.9);
      const r1 = prog(t, at, at + 1.2),
        loop = ((t - at) % 2.2 + 2.2) % 2.2 / 2.2;
      return /*#__PURE__*/React.createElement("g", {
        key: k,
        opacity: t > at ? 1 : 0
      }, (() => {
        const hp = pp(t, at, 0.6),
          HR = 29,
          ty = y + 54 * MS;
        return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ellipse", {
          cx: x,
          cy: ty,
          rx: 6 + 34 * loop,
          ry: (6 + 34 * loop) * 0.38,
          fill: "none",
          stroke: YEL,
          strokeWidth: "3",
          opacity: t > at ? 0.9 * (1 - loop) : 0
        }), /*#__PURE__*/React.createElement("ellipse", {
          cx: x,
          cy: ty,
          rx: 7 * hp,
          ry: 3 * hp,
          fill: INK,
          opacity: "0.35"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: x,
          cy: y,
          r: HR + 30 * r1,
          fill: "none",
          stroke: YEL,
          strokeWidth: "4",
          opacity: 1 - r1
        }), /*#__PURE__*/React.createElement("circle", {
          cx: x,
          cy: y,
          r: HR * hp,
          fill: "none",
          stroke: YEL,
          strokeWidth: "5"
        }), /*#__PURE__*/React.createElement("circle", {
          cx: x,
          cy: y,
          r: HR * hp + 4,
          fill: "none",
          stroke: INK,
          strokeWidth: "1.5",
          opacity: "0.5"
        }));
      })(), fly > 0 && /*#__PURE__*/React.createElement("path", {
        d: `M ${x} ${y} C ${x + 200} ${y - 60}, ${sx - 160} ${sy + 55}, ${sx + 10} ${sy + 55}`,
        fill: "none",
        stroke: TEAL,
        strokeOpacity: "0.35",
        strokeWidth: "2.5",
        strokeDasharray: "3 8",
        pathLength: "1"
      }));
    })), /*#__PURE__*/React.createElement("div", {
      style: A(1070, 300, {
        display: 'flex',
        gap: 60,
        opacity: cnt,
        transform: `translateY(${(1 - cnt) * 20}px)`
      })
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: HEAD,
        fontSize: 240,
        lineHeight: 1,
        color: TTL
      }
    }, n1, "+"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 28,
        color: INK
      }
    }, "institutions served")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: HEAD,
        fontSize: 240,
        lineHeight: 1,
        color: TTL
      }
    }, n2, "+"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 28,
        color: INK
      }
    }, "years of experience"))), PARTNERS.map((name, k) => {
      const [px, py] = pin(PINS[k]),
        [sx, sy] = slot(k),
        at = 4.8 + k * 0.32,
        f = gl(t, at, 0.9),
        land = pp(t, at + 0.7, 0.5);
      if (t < at) return null;
      const bx = mix(px - 55, sx, f),
        by = mix(py - 55, sy, f) - Math.sin(f * Math.PI) * 120;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: name
      }, /*#__PURE__*/React.createElement("div", {
        style: A(sx + 40, sy + 18, {
          width: 320,
          height: 84,
          borderRadius: 42,
          background: '#fff',
          boxShadow: '0 8px 20px rgba(30,43,48,0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px 0 90px',
          boxSizing: 'border-box',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.2,
          color: INK,
          textWrap: 'balance',
          opacity: land,
          transform: `translateX(${(1 - land) * -30}px)`
        })
      }, name), /*#__PURE__*/React.createElement("div", {
        style: A(bx, by, {
          transform: `scale(${mix(0.4, 1, f)}) rotate(${(1 - f) * -180}deg)`
        })
      }, /*#__PURE__*/React.createElement(Badge, {
        src: `assets/school-${k + 1}.png`,
        d: 120
      })));
    })), t > G - 0.2 && /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: gin,
        transform: `scale(${mix(1.1, 1, gin)})`
      })
    }, /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: G + 0.1,
      y: 60,
      size: 110,
      text: "And *beyond* *borders.*"
    }), /*#__PURE__*/React.createElement("div", {
      style: A(WX - 12, WY - 12, {
        width: 640 * WS + 24,
        height: 320 * WS + 24,
        borderRadius: 30,
        background: '#fff',
        boxShadow: '0 20px 44px rgba(30,43,48,0.10)'
      })
    }), /*#__PURE__*/React.createElement("img", {
      src: "assets/p13-world.png",
      style: A(WX, WY, {
        width: 640 * WS,
        height: 320 * WS,
        clipPath: `inset(0 ${(1 - en(t, G + 0.2, 1.0)) * 100}% 0 0)`
      })
    }), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, arc(IN, AE, G + 1.5, 80), arc(IN, NG, G + 2.6, 140), [IN, AE, NG].map(([x, y], k) => {
      const p = pp(t, [G + 0.8, G + 2.2, G + 3.3][k]),
        loop = (T * 0.8 + k * 0.3) % 1;
      return /*#__PURE__*/React.createElement("g", {
        key: k
      }, /*#__PURE__*/React.createElement("circle", {
        cx: x,
        cy: y,
        r: 14 + 30 * loop,
        fill: "none",
        stroke: TEAL,
        strokeWidth: "2",
        opacity: p * (1 - loop)
      }), k ? /*#__PURE__*/React.createElement("circle", {
        cx: x,
        cy: y,
        r: 20 * p,
        fill: "none",
        stroke: YEL,
        strokeWidth: "5"
      }) : /*#__PURE__*/React.createElement("circle", {
        cx: x,
        cy: y,
        r: 12 * p,
        fill: TEAL,
        stroke: "#fff",
        strokeWidth: "3"
      }));
    })), gcard('assets/gl-2.png', 'Al Ain Juniors School', 'UAE', 1450, 470, G + 2.0, 170), gcard('assets/gl-1.png', 'Indian Language School', 'Nigeria', 140, 470, G + 3.1, 140)));
  }
  /* 12 — Finale */
  function SFinale({
    t,
    T
  }) {
    const dark = en(t, 0, 0.6),
      aOut = gl(t, 5.8, 0.6),
      bIn = en(t, 6.3, 0.5),
      bOut = gl(t, 10.0, 0.5),
      iris = gl(t, 10.1, 1.0);
    const R = mix(0, 2300, iris),
      cream = 1 - en(t, 11.6, 0.6),
      scan = (Math.sin(T * 2.2) + 1) / 2,
      ul = gl(t, 9.2, 0.8);
    const PROM = [['MEASURE', 'Quality', SUN, 0.45], ['STRENGTHEN', 'Systems', MINT, 2.15], ['INSPIRE', 'Excellence', CORAL, 4.0]];
    const pill = (icon, text, y, at) => {
      const p = en(t, at, 0.6);
      return /*#__PURE__*/React.createElement("div", {
        style: A(880, y, {
          width: 640,
          height: 92,
          borderRadius: 46,
          background: '#E8F7F8',
          border: `2px solid ${TEAL}`,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '0 14px',
          boxSizing: 'border-box',
          boxShadow: '0 14px 30px rgba(23,174,185,0.14)',
          opacity: p,
          transform: `translateX(${(1 - p) * 60}px)`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: TEAL,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          color: '#fff'
        }
      }, icon), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 32,
          color: INK
        }
      }, text));
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, iris < 1 && /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: dark,
        overflow: 'hidden'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(-300, -400, {
        width: 1400,
        height: 1400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(23,174,185,0.12) 0%, rgba(23,174,185,0) 65%)'
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(1000, 300, {
        width: 1300,
        height: 1300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(246,210,122,0.18) 0%, rgba(246,210,122,0) 65%)'
      })
    }), /*#__PURE__*/React.createElement("svg", {
      width: W,
      height: H,
      style: A(0, 0)
    }, [300, 420, 560].map((r, k) => {
      const cc = 2 * Math.PI * r;
      return /*#__PURE__*/React.createElement("circle", {
        key: r,
        cx: 960,
        cy: 540,
        r: r,
        fill: "none",
        stroke: TEAL,
        strokeOpacity: 0.10 + k * 0.03,
        strokeWidth: k === 1 ? 14 : 2,
        strokeLinecap: "round",
        strokeDasharray: `${cc * 0.55} ${cc}`,
        transform: `rotate(${k * 70 + T * (k % 2 ? -6 : 8)} 960 540)`
      });
    })), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: 1 - aOut,
        transform: `translateY(${-aOut * 60}px)`
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: A(0, 190, {
        width: W,
        textAlign: 'center',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: 8,
        color: TTL,
        ...up(en(t, 0.2), 12)
      })
    }, "THE LUNEBLAZE PROMISE"), PROM.map(([big, small, c, at], k) => {
      const p = pp(t, at, 0.7);
      return /*#__PURE__*/React.createElement("div", {
        key: big,
        style: A(200 + k * 520, 290, {
          width: 480,
          height: 440,
          borderRadius: 34,
          background: '#fff',
          boxShadow: '0 24px 50px rgba(30,43,48,0.10)',
          border: `2px solid ${c}`,
          boxSizing: 'border-box',
          padding: '36px 34px',
          overflow: 'hidden',
          opacity: cl(p * 1.5, 0, 1),
          transform: `translateY(${(1 - p) * 90}px) scale(${mix(0.86, 1, p)})`
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: A(0, 0, {
          width: 480,
          height: 14,
          background: c
        })
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: HEAD,
          fontSize: 64,
          lineHeight: 1,
          color: c,
          marginTop: 10
        }
      }, '0' + (k + 1)), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 124,
          marginTop: 120,
          display: 'flex',
          alignItems: 'flex-end',
          fontFamily: HEAD,
          fontSize: k === 1 ? 96 : 124,
          lineHeight: 1,
          color: INK,
          whiteSpace: 'nowrap'
        }
      }, big), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.2,
          color: TTL,
          marginTop: 6
        }
      }, small));
    })), /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H,
        opacity: bIn * (1 - bOut)
      })
    }, /*#__PURE__*/React.createElement(Ring, {
      cx: 960,
      cy: 540,
      t: t,
      at: 6.4,
      r0: 200,
      r1: 900,
      c: YEL
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 6.4,
      y: 300,
      size: 150,
      color: INK,
      hi: TTL,
      text: "Move beyond compliance."
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 8.1,
      y: 470,
      size: 150,
      color: INK,
      hi: TTL,
      text: "Build a *culture* *of* *quality.*"
    }), /*#__PURE__*/React.createElement("div", {
      style: A(W / 2 - 520 * ul, 680, {
        width: 1040 * ul,
        height: 10,
        borderRadius: 5,
        background: YEL
      })
    }))), iris > 0 && /*#__PURE__*/React.createElement("div", {
      style: A(960 - R, 540 - R, {
        width: 2 * R,
        height: 2 * R,
        borderRadius: '50%',
        background: CREAM,
        opacity: cream
      })
    }), t > 10.3 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("img", {
      src: "assets/logo.png",
      style: A(W / 2 - 280, 46, {
        width: 560,
        height: 140,
        clipPath: `inset(0 ${(1 - gl(t, 10.6, 0.8)) * 100}% 0 0)`
      })
    }), /*#__PURE__*/React.createElement(Words, {
      t: t,
      at: 11.0,
      y: 200,
      size: 86,
      text: "Ready to transform *school* *quality?*"
    }), /*#__PURE__*/React.createElement("div", {
      style: A(400, 330, {
        width: 400,
        height: 410,
        borderRadius: 34,
        background: '#fff',
        border: `4px solid ${TEAL}`,
        boxSizing: 'border-box',
        boxShadow: '0 24px 50px rgba(30,43,48,0.14)',
        overflow: 'hidden',
        ...popS(pp(t, 11.3, 0.8))
      })
    }, /*#__PURE__*/React.createElement("img", {
      src: "assets/p16-qr.png",
      style: A(51, 22, {
        width: 290,
        height: 290
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(51, 22 + scan * 284, {
        width: 290,
        height: 6,
        borderRadius: 3,
        background: TEAL,
        opacity: 0.55,
        boxShadow: `0 0 18px ${TEAL}`
      })
    }), /*#__PURE__*/React.createElement("div", {
      style: A(40, 330, {
        width: 312,
        height: 52,
        borderRadius: 14,
        background: YEL,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 22,
        color: INK
      })
    }, "Scan to book a demo")), /*#__PURE__*/React.createElement("div", {
      style: A(884, 345, {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 20,
        letterSpacing: 6,
        color: TTL,
        ...up(en(t, 11.6), 10)
      })
    }, "GET IN TOUCH"), pill('✉', 'schools@luneblaze.com', 385, 11.8), pill('✆', '+91 8810418840', 495, 12.05), /*#__PURE__*/React.createElement("div", {
      style: A(884, 618, {
        width: 700,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 30,
        lineHeight: 1.3,
        color: INK,
        ...up(en(t, 12.4), 14)
      })
    }, "Move beyond compliance.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        color: TTL
      }
    }, "Build a culture of quality.")), /*#__PURE__*/React.createElement("div", {
      style: A(W / 2 - 520, 762, {
        width: 1040,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        ...up(en(t, 12.7), 12)
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 2,
        background: 'linear-gradient(90deg, rgba(23,174,185,0), rgba(23,174,185,0.5))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: 6,
        color: TTL
      }
    }, "RECOGNISED & SUPPORTED BY"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 2,
        background: 'linear-gradient(90deg, rgba(23,174,185,0.5), rgba(23,174,185,0))'
      }
    })), [['assets/badge-1.png', 'EdTech Innovation'], ['assets/badge-2.png', 'UN SDG-4 Aligned'], ['assets/badge-3.png', 'Govt. of India Startup']].map(([src, cap], k) => {
      const p = pp(t, 12.9 + k * 0.22, 0.7),
        fl = Math.sin(T * 1.3 + k * 1.7) * 4;
      return /*#__PURE__*/React.createElement("div", {
        key: src,
        style: A(W / 2 - 520 + k * 360, 800 + fl, {
          width: 320,
          height: 150,
          borderRadius: 26,
          background: '#fff',
          boxSizing: 'border-box',
          padding: '12px 10px 0',
          boxShadow: '0 18px 40px rgba(30,43,48,0.12), 0 0 0 1px rgba(23,174,185,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'hidden',
          opacity: cl(p * 1.5, 0, 1),
          transform: `translateY(${(1 - p) * 40}px) scale(${mix(0.85, 1, p)})`
        })
      }, /*#__PURE__*/React.createElement("img", {
        src: src,
        style: {
          width: 236,
          height: 107,
          objectFit: 'contain'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: A(0, 122, {
          width: 320,
          height: 28,
          background: k === 1 ? YEL : TEAL,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: 2,
          color: k === 1 ? INK : '#fff'
        })
      }, cap.toUpperCase()));
    })));
  }

  /* ---------- narration + captions ---------- */
  const VO = [["Open", 0.3, "This is Luneblaze. Inducing quality in education.", "vo-01"], ["Promise", 0.4, "Drive school quality. Inspire excellence. AI-powered, end-to-end quality management for schools and school groups.", "vo-02"], ["Domains", 0.3, "It measures all seven SQAAF domains, from curriculum to leadership, as one connected system.", "vo-03"], ["Frameworks", 0.2, "Fully aligned with SQAAF and NABET.", "vo-04"], ["Hook", 0.3, "Every school promises quality. But very few can prove it.", "vo-05"], ["Accreditation", 0.4, "Accreditation isn't a certificate on the wall. It's a system: inspection-ready, trusted by parents, and always improving.", "vo-06"], ["Stakes", 0.4, "Under SQAAF, schools are graded from A plus to C, as per their quality standard. That grade drives reputation, admissions and accountability. So quality has to be measured, every single day.", "vo-07"], ["Problem", 0.4, "Yet in most schools, quality still lives on paper. Evidence is scattered, teachers are overloaded, and every inspection means last-minute panic.", "vo-08"], ["Turn", 0.4, "Luneblaze changes that. From managing paperwork, to managing quality.", "vo-09"], ["Turn", 7.8, "Building the quality muscle in every school.", "vo-10"], ["School", 0.4, "Inside each school, everything runs on one portal. Documents and evidence. Workflow and CLT management. Progress and maturity levels.", "vo-11"], ["School", 13.0, "A live readiness score. Expert help and webinars. Improvement plans in one click. Automated self-assessment. And classroom observations and audits.", "vo-12"], ["Pillars", 0.4, "It all stands on three pillars. Quality systems make it repeatable. Quality excellence turns systems into results. And quality governance shows where every school stands.", "vo-13"], ["Readiness", 0.4, "So you always know exactly how ready you are.", "vo-14"], ["GroupIntro", 2.4, "Now picture a whole group of schools. Different standards, no shared view, scattered evidence, and readiness that changes from campus to campus.", "vo-15"], ["GroupIntro", 13.3, "Luneblaze connects them all. One vision. One standard. Every school.", "vo-16"], ["Groups", 0.4, "On one group dashboard, see every campus at a glance, rank schools by readiness, catch risks early, and share board-ready reports.", "vo-17"], ["Shift", 0.4, "Why Luneblaze? Because the old way wears your people down. With Luneblaze, quality becomes a continuous system your whole team owns.", "vo-18"], ["Trust", 0.4, "Trusted by more than a hundred institutions across India.", "vo-19"], ["Trust", 10.6, "And beyond borders, in the UAE and Nigeria.", "vo-20"], ["Finale", 0.4, "Measure quality. Strengthen systems. Inspire excellence.", "vo-21"], ["Finale", 6.4, "Move beyond compliance, and build a culture of quality.", "vo-22"], ["Finale", 11.3, "Scan the code to book your demo with Luneblaze.", "vo-23"]];
  window.LUNEBLAZE_STORY_VO = VO;
  const clipSrc = i => `assets/vo-new/${String(i + 1).padStart(2, '0')}.mp3`;
  const CLIP_DUR = {
    "vo-10": 3.28,
    "vo-11": 11.04,
    "vo-12": 12.32,
    "vo-13": 13.36,
    "vo-14": 3.52,
    "vo-15": 10.8,
    "vo-16": 5.84,
    "vo-17": 9.6,
    "vo-18": 10.08,
    "vo-19": 4,
    "vo-20": 4,
    "vo-21": 5.68,
    "vo-22": 4.64,
    "vo-23": 3.04,
    "vo-01": 4.72,
    "vo-02": 9.12,
    "vo-03": 6.96,
    "vo-04": 3.2,
    "vo-05": 5.44,
    "vo-06": 9.12,
    "vo-07": 14.96,
    "vo-08": 10.8,
    "vo-09": 5.04
  };
  const lineDur = text => {
    const v = VO.find(x => x[2] === text);
    if (!v) return 0.6 + text.split(' ').length * 0.4;
    if (v[5] != null) return v[5] - v[4];
    return CLIP_DUR[v[3]] || 0.6 + text.split(' ').length * 0.4;
  };
  // one pre-mixed track (assets/vo-story/voiceover-full.wav), every clip already placed at its cue; synced to the timeline so it also exports
  const VO_PARTS = [['export/audio/Luneblaze-Full-Mix.mp3', 0]];
  // Preview playback goes through Web Audio (media elements don't load in the preview);
  // the hidden <video> stays as the export audio marker.
  const VOA = {
    ctx: null,
    buf: null,
    src: null,
    startedAt: 0,
    offset: 0,
    loading: null
  };
  function voLoad() {
    if (VOA.loading) return VOA.loading;
    VOA.ctx = VOA.ctx || new (window.AudioContext || window.webkitAudioContext)();
    VOA.loading = Promise.all(VO_PARTS.map(([u]) => fetch(u).then(r => r.arrayBuffer()).then(ab => VOA.ctx.decodeAudioData(ab)))).then(bufs => {
      const sr = bufs[0].sampleRate,
        len = Math.round(VO_PARTS[VO_PARTS.length - 1][1] * sr) + bufs[bufs.length - 1].length;
      const all = VOA.ctx.createBuffer(1, len, sr),
        ch = all.getChannelData(0);
      bufs.forEach((b, i) => ch.set(b.getChannelData(0), Math.round(VO_PARTS[i][1] * sr)));
      VOA.buf = all;
      return all;
    });
    return VOA.loading;
  }
  function voStop() {
    if (VOA.src) {
      try {
        VOA.src.stop();
      } catch (e) {}
      VOA.src.disconnect();
      VOA.src = null;
    }
  }
  function voStart(at) {
    if (!VOA.buf || !VOA.ctx || VOA.ctx.state !== 'running') return;
    voStop();
    if (at >= VOA.buf.duration) return;
    const n = VOA.ctx.createBufferSource();
    n.buffer = VOA.buf;
    n.connect(VOA.ctx.destination);
    n.start(0, Math.max(0, at));
    VOA.src = n;
    VOA.startedAt = VOA.ctx.currentTime;
    VOA.offset = at;
  }
  const voNow = () => VOA.offset + (VOA.ctx.currentTime - VOA.startedAt);
  function VoiceTrack({
    T,
    playing,
    dur
  }) {
    const [ready, setReady] = React.useState(!!VOA.buf),
      [locked, setLocked] = React.useState(true);
    const live = React.useRef({
      T,
      playing
    });
    live.current = {
      T,
      playing
    };
    const sync = () => {
      const {
        T,
        playing
      } = live.current;
      if (!VOA.buf || !VOA.ctx) return;
      setLocked(VOA.ctx.state !== 'running');
      if (!playing) {
        voStop();
        return;
      }
      if (!VOA.src || Math.abs(voNow() - T) > 0.2) voStart(T);
    };
    const unlock = () => {
      voLoad().then(() => VOA.ctx.resume()).then(() => {
        setLocked(VOA.ctx.state !== 'running');
        sync();
      }).catch(() => {});
    };
    React.useEffect(() => {
      voLoad().then(() => {
        setReady(true);
        setLocked(VOA.ctx.state !== 'running');
        sync();
      }).catch(() => {});
    }, []);
    React.useEffect(() => {
      if (playing && VOA.ctx && VOA.ctx.state !== 'running') VOA.ctx.resume().catch(() => {});
      sync();
    }, [T, playing, ready]);
    React.useEffect(() => {
      const h = () => unlock();
      ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'].forEach(e => window.addEventListener(e, h, true));
      try {
        window.parent && window.parent.addEventListener && window.parent.addEventListener('pointerdown', h, true);
      } catch (e) {}
      return () => {
        window.removeEventListener('pointerdown', h, true);
        window.removeEventListener('keydown', h, true);
        voStop();
      };
    }, []);
    return /*#__PURE__*/React.createElement(React.Fragment, null, VO_PARTS.map(([u, st], i) => /*#__PURE__*/React.createElement("video", {
      key: u,
      src: u,
      preload: "none",
      playsInline: true,
      "data-om-exportable-video-play-start": st,
      "data-om-exportable-video-play-end": i + 1 < VO_PARTS.length ? VO_PARTS[i + 1][1] : dur,
      style: A(0, 0, {
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: 'none'
      })
    })));
  }
  function useNarration(T, C, playing, on) {
    const last = React.useRef(T),
      have = React.useRef({}),
      live = React.useRef([]);
    React.useEffect(() => {
      VO.forEach((_, i) => fetch(clipSrc(i), {
        method: 'HEAD'
      }).then(r => {
        have.current[i] = r.ok;
      }).catch(() => {}));
    }, []);
    const stopAll = () => {
      live.current.forEach(a => a.pause());
      live.current = [];
      window.speechSynthesis && speechSynthesis.cancel();
    };
    React.useEffect(() => {
      const prev = last.current;
      last.current = T;
      if (!on || !playing || T < prev || T - prev > 0.5) {
        if (!playing || T < prev || !on) stopAll();
        return;
      }
      VO.forEach(([sec, off, text], i) => {
        const at = C[sec] + off;
        if (!(prev < at && T >= at)) return;
        if (have.current[i]) {
          const a = new Audio(clipSrc(i));
          a.play().catch(() => {});
          live.current.push(a);
        } else if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(text);
          const v = pickVoice();
          if (v) u.voice = v;
          u.rate = 1.04;
          speechSynthesis.speak(u);
        }
      });
    }, [T, playing, on]);
    React.useEffect(() => stopAll, []);
  }
  function Captions({
    T,
    C
  }) {
    let cur = null;
    VO.forEach(([sec, off, text]) => {
      const at = C[sec] + off;
      if (T >= at && T < at + lineDur(text) + 0.4) cur = {
        at,
        text
      };
    });
    if (!cur) return null;
    const words = cur.text.split(' '),
      d = lineDur(cur.text);
    const vis = Math.min(en(T, cur.at, 0.3), 1 - en(T, cur.at + d, 0.4));
    return /*#__PURE__*/React.createElement("div", {
      style: A(0, 0, {
        width: W,
        height: H - 30,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        opacity: vis,
        transform: `translateY(${(1 - vis) * 12}px)`,
        pointerEvents: 'none'
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1500,
        padding: '10px 28px',
        borderRadius: 18,
        background: 'rgba(30,43,48,0.92)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 9px',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 27,
        lineHeight: 1.35,
        color: '#fff'
      }
    }, words.map((w, k) => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        color: T >= cur.at + 0.3 + k / words.length * (d - 0.6) ? '#fff' : 'rgba(255,255,255,0.5)'
      }
    }, w))));
  }

  /* ---------- assembly ---------- */
  const TC = str => str.split(' ').map((w, i) => i > 0 && /^(and|or|of|the|to|in|on|for|a|an|at|by|with|per|from|&)$/.test(w) ? w : w.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('-')).join(' ');
  [ACC, STK, PROB, ENB, GSCH, RS].forEach(arr => arr.forEach(r => {
    r[0] = TC(r[0]);
  }));
  SHIFT.forEach(r => {
    r[0] = TC(r[0]);
    r[1] = TC(r[1]);
  });
  PIL.forEach(p => p[3].forEach(it => {
    it[0] = TC(it[0]);
  }));
  const ORDER = ['Open', 'Promise', 'Domains', 'Frameworks', 'Hook', 'Accreditation', 'Stakes', 'Problem', 'Turn', 'School', 'Pillars', 'Readiness', 'GroupIntro', 'Groups', 'Shift', 'Trust', 'Finale'];
  const COMP = {
    Open: SOpen,
    GroupIntro: SGroupIntro,
    School: SSchool,
    Promise: SPromise,
    Domains: SDomains7,
    Frameworks: SFrameworks,
    Hook: SHook,
    Accreditation: SAccreditation,
    Stakes: SStakes,
    Problem: SProblem,
    Turn: STurn,
    Pillars: SPillars,
    Readiness: SReadiness,
    NABET: SNABET,
    Groups: SGroups,
    Shift: SShift,
    Trust: STrust,
    Finale: SFinale
  };
  function Story({
    fx
  }) {
    const {
      T,
      CUES: C,
      playing,
      authoredTotal
    } = useComposition();
    const markV = en(T, C.Promise + 0.3, 0.6) * (1 - en(T, C.Finale - 0.3, 0.5)) * (1 - en(T, C.Pillars + 2.4, 0.4) * (1 - en(T, C.Pillars + 14.4, 0.5)));
    return /*#__PURE__*/React.createElement("div", {
      "data-screen-label": `t=${Math.floor(T)}s`,
      style: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: CREAM
      }
    }, /*#__PURE__*/React.createElement(LB.Backdrop, {
      T: T
    }), ORDER.map((n, i) => {
      const s = C[n],
        e = i + 1 < ORDER.length ? C[ORDER[i + 1]] : authoredTotal;
      if (s == null || T < s - 0.05 || T > e + 0.85) return null;
      const inP = en(T, s, 0.9),
        outP = i + 1 < ORDER.length ? gl(T, e - 0.1, 0.8) : 0,
        Comp = COMP[n];
      return /*#__PURE__*/React.createElement("div", {
        key: n,
        style: A(0, 0, {
          width: W,
          height: H,
          opacity: inP * (1 - outP),
          transform: `scale(${mix(1.06, 1, inP) * mix(1, 0.94, outP) * mix(1, 1.03, prog(T, s, e))})`
        })
      }, /*#__PURE__*/React.createElement(Comp, {
        t: T - s,
        T: T
      }));
    }), markV > 0 && /*#__PURE__*/React.createElement("img", {
      src: MARK,
      style: A(W - 136, 30, {
        width: 96,
        height: 96,
        opacity: markV,
        filter: 'drop-shadow(0 4px 10px rgba(30,43,48,0.15))'
      })
    }), fx.captions && /*#__PURE__*/React.createElement(Captions, {
      T: T,
      C: C
    }), fx.voice !== 'Off' && /*#__PURE__*/React.createElement(VoiceTrack, {
      T: T,
      playing: playing,
      dur: authoredTotal
    }));
  }
  function LuneblazeStory() {
    const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CompositionStage, {
      width: W,
      height: H,
      scenes: window.OM_SCENES,
      playback: window.OM_PLAYBACK,
      bg: CREAM
    }, /*#__PURE__*/React.createElement(Story, {
      fx: t
    })), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
      label: "Voice-over"
    }), /*#__PURE__*/React.createElement(TweakRadio, {
      label: "Narration",
      value: t.voice,
      options: ['Voice-over', 'Off'],
      onChange: v => setTweak('voice', v)
    }), /*#__PURE__*/React.createElement(TweakToggle, {
      label: "Captions",
      value: t.captions,
      onChange: v => setTweak('captions', v)
    }), /*#__PURE__*/React.createElement(TweakSection, {
      label: "Motion"
    }), /*#__PURE__*/React.createElement(TweakToggle, {
      label: "Motion editor",
      value: t.motionEditor,
      onChange: v => setTweak('motionEditor', v)
    })));
  }
  window.LuneblazeStory = LuneblazeStory;
  window.LBStory = {
    COMP,
    W,
    H,
    Backdrop: LB.Backdrop,
    CREAM
  };
})();