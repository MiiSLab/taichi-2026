/**
 * Camera-ready PDF 對照表：發表名單 item.id → Google Drive 檔案 id。
 * 來源資料夾（公開）：https://drive.google.com/drive/folders/1Us8HKBKzqGcYWkQc17u5iqkbLigFOw4F
 * 檔名規則 TAICHI_2026_CameraReady_XXX<編號>.pdf，編號 = programLists 的 item.id。
 * 重新產生：抓 https://drive.google.com/embeddedfolderview?id=<資料夾id>#list
 * 的 HTML，取每個 entry 的檔名與檔案 id 即可（資料夾公開、免登入）。
 *
 * 54、126 兩檔在名單上沒有對應項目，保留無妨；
 * 9 / 19 / 37 / 53 / 90 / 96 / 109 名單有但作者未交 camera-ready，查表落空、不出 icon。
 * 13（Tactile Musical Track）依作者要求撤下（後續要投稿），重新產生時勿加回。
 */
export const CAMERA_READY_PDF: Record<string, string> = {
	'7': '1bFwXMERG3Xnf1lpQQzz08SN04mEDzvV8',
	'10': '1Kq9AvC2KWSaWRXY9zo58G0BjqG2CIzUI',
	'14': '1LxmXCdZgpPFYRyWwMFaVr9QgXkKjXSLb',
	'15': '1MN8A00zFAiz_ax3c4X1e1RFUZ_jkfYpN',
	'16': '1Z2bW3sZsvBisRg8uQsGmMS03i72Ae828',
	'17': '1niEwJ7XwY3Ag_DmLhVQx7Pkvqi2ZNozW',
	'21': '1DTf5fB4aCmF617M5kK7ilswrNQFl6s6f',
	'22': '1XT7OeAIsNBYQwu_cQcXCmznAFfHuotpR',
	'23': '1NXTRjjTEDI-z5OhNFQ3ApP4C7Y7XAVy3',
	'26': '1X-1db4s7sK-hg7P2BRPSYf7viPQ1V05r',
	'29': '1MlAfszjc71T850mcPEg2edqtSHHPsdCt',
	'30': '171q0gZ_gg72LZJtg0EqU5qh0jfrL7g4k',
	'31': '1ZLaWJWZmdBsRpytEyLWtSxW6ub7YkaVU',
	'32': '1WyMjsDm2Xy0FN91ZUMdzi5718V3zvVOW',
	'33': '1ovcUPb-kjSiLJw_MGIlAVIhyHDHLwWag',
	'35': '1J7bfMrTxXuCyxOQMKnj4vww10bnVaafC',
	'36': '1t0PuhQDDdDBbCyOFLLApmatrYSrVZqnz',
	'39': '1a0Cpnu9irra7cff0o6aEs5BROrq1Q8YA',
	'41': '1Jl0CAs8cm4QoJ5-8X9Su9m00Iv8AVTn_',
	'42': '1aQECKJmbL1iEXAhg69oMtKn9DC8PbGpf',
	'44': '11ncVRoVLS4LgWvAKb88aOk80w6iDMJG6',
	'45': '1VgRpNxNibhc_iUOMM2NZg4aP_5TEJ7CI',
	'47': '1JD4qDEtLuhAIzCubBBn5DLfFokxIfrk6',
	'48': '1k33KCgJ5bEzvdneIZgcR4IwHHsCyad6T',
	'49': '1sdq4C78hCs-plIUzglxFqmvTZWKuuZYq',
	'50': '14EiczNK_39zIr1IMJkUj8CYklhMTgzJz',
	'51': '1y2OKyI4llDMmLHlNE7uaQFiEU5meTlA9',
	'54': '15UYNuMNeJY27Oo5iA1Uz26DCEMWTX2zK',
	'56': '1NZ4McAB8r2W1kaSkij1zrV9buezCwbcl',
	'57': '1kxE_lq6vKjWTV8hbOcgtJMWR1HbLYlyV',
	'58': '11v5NUiyd4nKa3MVTguI1q_e3OFFFMDDq',
	'60': '14mcZphXeuNdA5Z0G8i89A8zjbop-PdeC',
	'61': '1W-98sSjcoT6WazUDJEcF0Zv0FYo2Jb3r',
	'67': '135x2II9dEFiTNrWeLGL8oteFckzlI-qI',
	'68': '11kNBSE4jROUZbnv74Evai-akgVOiqmk4',
	'69': '1bq75I9B0dUXuEkLNH5qskRX9UdkmYXZQ',
	'70': '1FQrYlAcsCKxM6OSRSZaB6qFs-fYvlXNS',
	'71': '1jhrsyFwbcynAYcT3_qPyoYI-OaPViHo9',
	'73': '1me5Uaab5hkDAhys1kDgt1hwgotFdJnNf',
	'74': '1NtIyEI92wKJSlisygDXiSMzqxyPHPmsd',
	'75': '1nndlbUARj13bftJuPj38-wMJTb77R7k9',
	'76': '1owDewX_REw5EbrZ26EyXiWhqeP9JB5Kz',
	'77': '1d0sgq91kmwoxsuQ7yWHp68HHw4a1R7TZ',
	'78': '1oOU5KunhNeJNXLWbD_JINuEaLKEFzpfb',
	'81': '12qOP0dvSlsCMYOsEErle0_HJ_ZGIWN6K',
	'82': '1dG9_XgmEbiRIxxpOABkBwK8UBF8afn6V',
	'86': '1_1u2Mm-UBFb971YNt_SDrCyKO631_qjz',
	'88': '1opLH6KSKTlCp5YR9pd5QJAwGvBjeEIUd',
	'89': '1WCGFkJqfXRDb3mlUDOvGbHSDBzANCsdj',
	'91': '12_5BtXRjjF67D2ZSru1tDEjTnSCG37IB',
	'95': '1oyiINNyHRsfEDmwA6QsMVqpJY5hm7vez',
	'98': '1-_HqS9f2FXfbS2cYk6UdCtgRg3aiHOMW',
	'101': '1X0HkkNAkul2pCAicXlgDdhBomAiJXvP5',
	'102': '18sn7Zf-T-vUCqHBMU6vk-5vhgsSCGbQr',
	'104': '1jeB0JTDWj4N8NRSVkJrtMBRtg1qt8jb8',
	'106': '1JK0MDKdOnPTKPtdJL0pqwNWj1_M-9Pi8',
	'107': '1xTzf-cDbz-yoL68iMKBcJ3PM7jWk8XlO',
	'111': '1F_qj39U4J-DRIrC-xc0zUq9rKgmtGwqW',
	'112': '1j5ILfWcjc6hAdrCPk7pLfxaWOv8HBXWg',
	'115': '1OoMblkelhcLaTJ9O5_uS5qpyzNeO4mJ9',
	'116': '197oFwLPi6pwtZsNRJVoiaQRd5BjrLsc7',
	'123': '1ciU_H_ZgrY8xuFgR4FnHa1LmxGUjHHlB',
	'124': '1BbjUe2zM0NgZq5BgsJUnMbmN_7P0Ao5o',
	'125': '1i5ULIZVVy8p4z56wiQ8pRXj7RRfQO7fx',
	'126': '1V8Sxt-6lu1wZgIq2NrBCubhY-FIp-S0J',
	'127': '1o9xV2qG5PLHwaEEJxqtcYds-JqxbrQnL',
};

/** item.id → Drive 預覽網址；沒交 camera-ready 的（與 OpenHCI / 論文獎）回 null，不出 icon */
export const cameraReadyUrl = (id: string | undefined): string | null =>
	(id && CAMERA_READY_PDF[id] ? `https://drive.google.com/file/d/${CAMERA_READY_PDF[id]}/view` : null);
