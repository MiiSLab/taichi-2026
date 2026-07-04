import type { CSSProperties } from "react";
import svgPaths from "./NewHeroPage/svg-grp56gbav9";

const P = svgPaths as Record<string, string>;
const F = "#FB4105";

// Self-contained reproduction of the BigBang component from the Figma design.
// aspect ratio 972 × 281 — use width: 100% and let height auto-size.
export default function BigBangSvg({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "972 / 281", ...style }}>
      {/* Blurred glow layer */}
      <div style={{ position: "absolute", inset: "-2.67% -0.77%" }}>
        <svg style={{ display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 987 296">
          <g filter="url(#bb_blur)">
            {["p55f7600","p20fe2480","p389bf4f0","p29b68680","p28b91b0","pc3ed600",
              "p105d1c40","p10c6f600","p2c75ffc0","p26c8ba80","pf064080","p3e181a00",
              "p1e6ad400","p9c09980","p23e43700","p1a594880","p3b244200","p2dc99790",
            ].map(k => <path key={k} d={P[k]} fill={F} />)}
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse"
              height="296" id="bb_blur" width="987" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feGaussianBlur result="effect1_foregroundBlur" stdDeviation="3.75" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Sharp top layer */}
      <svg style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%" }}
        fill="none" preserveAspectRatio="none" viewBox="0 0 972 281">
        <g>
          {["p285b7400","p1b49a880","p1b8f6500","p116fa300","p30fdcdb0","p3d615b80",
            "p19401500","p2dfec980","p19c1a900","p13e03b80","p34b3f940","pdc0d980",
            "pa142f00","p15088c00","p3f50ec00","p36af6000","p1ffd400","p382dcc00",
          ].map(k => <path key={k} d={P[k]} fill={F} />)}
        </g>
      </svg>
    </div>
  );
}
