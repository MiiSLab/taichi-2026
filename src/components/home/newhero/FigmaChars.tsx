import type { CSSProperties } from "react";
import svgPaths from "./NewHeroPage/svg-grp56gbav9";

const F = "#FB4105";
const P = svgPaths as Record<string, string>;

function Char({
  keys,
  viewBox,
  style,
}: {
  keys: string[];
  viewBox: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      fill="none"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    >
      {keys.map((k) => (
        <path key={k} d={P[k]} fill={F} />
      ))}
    </svg>
  );
}

// ── Group1  viewBox 102.516 × 109.857 ──────────────────────────────────────
const K1 = [
  "p6693800","p4ebc570","p22ee7680","p26baaa80","p39109300","p20bf6400",
  "p333fda00","p3d0fd180","p10c96600","p2b7d6a80","p173fdc00","p99d1980",
  "p396b9300","p38fb3530","p1ab31100","p2aec79c0","p2923b400","p22a885c0",
  "p3e57b9f1","p2697bb00","p178ee5f0","p3b1f0480","p28339680","p6426e00",
  "p27585100","p34dafb00","p1876180","p23030580","p964d800","p2f8c6f80",
  "pffc4680","p314a6d00","p33c9fb00","p2a6b4a00","p3d274500","p14691000",
  "p30dc6200","p18317880","p1eff4f80","p29c08280","p2bafac00","p8857280",
  "p29b86000","pc0af100","p8b8e100","p36eed100","p295eac00","p11c84d00",
  "p3735de00","p4e5e6c0","pee40680","p1f3d4d00","p16da1000","p180f5700",
  "p1e398200","p27336200","p3263fcc0","p2b1d1400","p706ae00","p18141280",
  "p314c80","p14752880","p1baee900","pbd3c700","p39963980","pd6ef180",
  "p395e9f00","pcceb480","p26ab1f00","p253bbe00","p305b5f00","p3e538780",
  "p2bb2a500","p34160c00","p35140600","p1963ed70","p2e64fb00","p26f64f0",
  "p89d4100","p303c5e00","p1dc4ff00","p2f31eb00","p2b1ca600","p2541fdf0",
  "p3eeaec00","p1761f200","pb35bf00","p2c709600",
];
export function FigmaChar1({ style }: { style?: CSSProperties }) {
  return <Char keys={K1} viewBox="0 0 102.516 109.857" style={style} />;
}

// ── Group2  viewBox 102.529 × 73.237 ───────────────────────────────────────
const K2 = [
  "p3290600","p7362f00","p60b5e00","p22c09800","p19a64000","p67ab500",
  "p26a2900","p300ee280","p2b05af80","p3724e100","p37696e80","pa5df860",
  "p1644ad00","p2e30b600","p1cfc9c00","p1e585300","p1e142800","pb291e00",
  "p10bfecb0","p239c300","p3223b180","p1978d780","p35f1900","pd7998e0",
  "p355a27d0","p32698b00","p2db15500","p35af9b00","p472c400","p280ffa00",
  "pd85a300","p26b18f00","pc846700","p94c3fc0","p3c471100","p1abbbb00",
  "p2df340e0","p2138aa00","p5cc7dc0","p7b84f40","p3f0b0900","p18250c00",
  "p2cbaec00","p34c49d80","p35301000","pd20d500","p39aeea00",
];
export function FigmaChar2({ style }: { style?: CSSProperties }) {
  return <Char keys={K2} viewBox="0 0 102.529 73.237" style={style} />;
}

// ── Group3  viewBox 124.497 × 109.857 ──────────────────────────────────────
const K3 = [
  "p5ac5c40","p1f88cc00","p14cf5e00","p8d8e5c0","p8507480","p27b4780",
  "p9520000","p963b00","p21dcf980","p28ab2f00","p3c71eb00","p30723380",
  "p16b01b00","p10c95a00","p3b81c280","p34508680","p3aa12400","p15948200",
  "p15416580","p2f5c8e80","p1a382380","p19daf780","p2d98a480","p236a9a00",
  "p35723080","p8f02400","p2a066940","p18843400","p270475c0","p6462c00",
  "pe9c2000","p23b11900","p20828d70","p3a5ce500","p2b507670","p36990080",
  "p26f344b0","p2ee9b600","p2bd87a00","p21c18600","p12565780","p72b92f0",
  "p174cbc00","p3bdde500","p39af72e0","p1a9a5280","pb13da80","p1cd82f00",
  "p2f126e00","p10ea3800","p15521300","p170f4400","p3c5d1400","p10b96e70",
  "p819e280","p3cc72000","p2b2fd100","p7055080","p2e0c6530","p2f64100",
  "p23a79c0","p165cccc0","p1962f380","p28ae5b00","p2b22cf00","pcb2c680",
  "p22e35680","p19282700","p20ea6a00","p1ab5e300","p37342700","p34b6a00",
  "p2f86fc40","pe489780","pe2faa70","p2882f540","p13b45400","p1b44c680",
  "pba16880","p7c77100","p1aba000","p35f79200","p1cf37800","p3cbb3f0",
  "p39f23080","p224c6b80","p2225a800","pc7d200","p2efb1b80","p268d00",
  "p257c0600","p18fb2f0","peb2ae30","p282ff00","p2c3c4c00",
];
export function FigmaChar3({ style }: { style?: CSSProperties }) {
  return <Char keys={K3} viewBox="0 0 124.497 109.857" style={style} />;
}

// ── Group5  viewBox 102.539 × 109.857 ──────────────────────────────────────
const K5 = [
  "p5453700","p14cf5e00","pe127a00","pf82d680","p27b4780","p173a0e00",
  "p34497200","pa687a00","p1039b000","p31bcbb00","p2e88ff00","p1ba81eb0",
  "p109b5870","p1d09480","p34f40900","p1057f380","p2cc88300","p1d06f40",
  "pc892740","pf5deb00","pd4b1ef0","p29d42100","p2a5fef00","p308995f0",
  "p6fe6100","p2306d500","pe0b7880","p38667c00","p3a491070","p1610d080",
  "pe96c500","p35f1d3f0","pb226d80","p35342280","p23b11900","p1902f800",
  "p94fcf00","p12653700","p20828d70","p3a5ce500","p36990080","p27f11240",
  "p245aaa80","p1d1c8d00","p3bdde500","p174cbc00","p17bd6970","pf2a5c0",
  "p127998c0","p29450100","p11358f00","p2af18b00","p214c2200","p2f912e00",
  "p8adfd70","p1fa23b80","p3df06900","p2c79c80","p1a41cf80","p18c66700",
  "pb329e00","p245bdf80","p4774c0","p3dda7f40","p32d61200","p271f9200",
  "p274c2200","p21c84200","p2c504e00","p23dcf500","p49c7a00","p39f23080",
  "p1a7af432","pe2faa70","p2882f540","pba16880","p1eba2280","p3cbb3f0",
  "p2e76d000","p18f32c00","p1b44c680","p2c3c4c00","p1fa8df00","p18d15380",
  "p1a9e2600","p2225a800","p27e0f7f0","p2efb1b80","pbed5880","p2b451200",
  "pc7d200","p1f95a000","p268d00","p29adf280","p33521880","p3f4e6eb0",
  "p31d10f00","pc702ce0","p3e856e80",
];
export function FigmaChar5({ style }: { style?: CSSProperties }) {
  return <Char keys={K5} viewBox="0 0 102.539 109.857" style={style} />;
}

// ── Group6  viewBox 117.162 × 109.857 ──────────────────────────────────────
const K6 = [
  "p2e3c3280","p15167300","p110aba00","p3699c00","p31a8ea20","p1b239500",
  "p2169ab00","p16dacb80","p4719780","p2dec500","p515cc00","p32bc5780",
  "p289fc700","p235cf300","p31838b70","p4271740","pf176480","p366d40f2",
  "p2e8bcf80","p165f5c00","p24b9f800","p1be95840","p678c700","p3db5c900",
  "p19be06f0","pe0fef80","p1d202080","p1eed0600","p1d59a600","p19ab1100",
  "p1f552a80","p1957e900","p1c5d3c00","p1c249e00","p2f1ebf00","p1c63c2c0",
  "pe2c8100","pfe160f0","p1b7c580","p80a0400","p1d621880","p1cfb2a80",
  "p3e8f4d00","p11829200","pbf31800","p24276f30","p631580","p225b3500",
  "p2f77af80","p14030900","p2b8c100","p14b98b00","p3fa61580","pff0cc00",
  "p39d96500","pee87400","p98a00","p19738cf0","p28a9c670","p13385900",
  "p2a8c7800","p39175900","p32bfc000","p325c6300","p2aca45c0","p14230780",
  "p3a1efb00","p1e49cd00","p194fe040","p219df480","p1458a500","p1effbe00",
  "p37429100","p28b71780","p424d280","p215fe300","pc530100","p385edef0",
  "p197c2560","p3793c000","p29bfc1c0","p2b985280","p3d286040","pc73b980",
  "p30f1fa00","p193ef4f1","p35cdcc80","p1a020a80",
];
export function FigmaChar6({ style }: { style?: CSSProperties }) {
  return <Char keys={K6} viewBox="0 0 117.162 109.857" style={style} />;
}

// ── Group8  viewBox 102.535 × 109.853 ──────────────────────────────────────
const K8 = [
  "pb283180","p19712fd2","p2f58880","p3135f000","pe116170","p2cd35180",
  "p584d800","p56d1e00","p2118bdc0","p16411380","pdf6c7f0","p2664800",
  "pe50300","p7710200","p1bb03d80","p2d023500","p15e63010","pb1e8580",
  "p2d99f200","p302a600","p6854100","p28e19400","p2d05a100","pd504a00",
  "p3bdd7700","p24784b60","p2df8cf80","p10a95670","p66ffe00","p12aad480",
  "p9bec080","p15c9e400","p1364200","pb0ade00","p673e640","p3f6f7700",
  "p6b5ee80","p141d6d00","p2180fb00","p28c826f0","p279e4600","pd6c0080",
  "pd30dd80","p2b51200","p1ba8c600","p383e8080","p392f4f00","p6ca0300",
  "p12da700","p164e37f2","p2f39f500","p6af9d00","pbccdb00","p1e2b21b0",
  "p3fff8580","p27a0d700","p3de9a180","p247e1f80","p185a0a80","p706f100",
  "p3f30d600","p2abb9b00","pcbac490","p1d679700","p165cc700","p20d4b800",
  "pc1b5500","pee12a00","p26ada100","p117b2a00","p377ef180","p10f59980",
  "p9485e80","p29293e10","p2e074c00","p267e5080","p8d85e70","p1d24780",
  "p30d01570","p3a74fb80","p2d52f800","p2ff78700","p1279cc80","p21b2b600",
  "p32d40500","p35618900","p29391500","p37ae200","p80d6a80","p141fd9f0",
  "p335f2a80","p2ddf9880","p13fb0e00","p20ed6000","p1e7dbc70","p1a93440",
  "p6d3d880",
];
export function FigmaChar8({ style }: { style?: CSSProperties }) {
  return <Char keys={K8} viewBox="0 0 102.535 109.853" style={style} />;
}
