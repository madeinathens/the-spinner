export const en = {
  // ─── NAV ───
  nav: {
    home: 'HOME',
    sip: 'SIP',
    book: 'THE BOOK',
    ladder: 'LADDER',
    spin: 'SPIN A DATE',
    admin: 'ADMIN',
  },

  // ─── HOME ───
  home: {
    mark: 'THE ATHENS PROTOCOL · BASE MAINNET · 330',
    title: 'THE SPINNER',
    titleEm: "— Penelope's Loom, Re-Threaded —",
    sub: 'A book that weaves and unweaves the past — paying and counter-paying into the present, and into tomorrow’s page that has not yet opened.',
    cta_sip: 'Sip a haiku · 0.08 OWNER',
    cta_book: 'Read the Book',
    cta_ladder: 'See the Ladder',
    eq1: '(−) × (−) = +',
    eq2: 'PAST IS CURRENCY',
    sectionA_num: 'CHAPTER I · WHAT IS A SIP',
    sectionA_title: 'A page of the book that responds.',
    sectionA_p1:
      'A sip is a haiku — up to 140 characters — that you sign and send into the loom along with a 0.08 OWNER tip. It is recorded on Base Mainnet, forever.',
    sectionA_p2:
      'One of the four admins (madeinathens, nftable, beecoin, syntropy) replies to your sip with their own signed haiku. The reply is gasless. The book gives back what it received.',
    sectionA_p3:
      'You wove a thread into yesterday. The admin weaves one back today. Together, the two haiku form one woven page that did not exist before.',
    sectionB_num: 'CHAPTER II · THE LOOM IS LIVE',
    sectionB_title: 'Read the contract, and you read the page being woven.',
  },

  // ─── SIP PAGE ───
  sip: {
    title: 'COMPOSE A SIP',
    sub: 'A haiku of the present, paid into the past.',
    placeholder: 'Write your haiku · up to 140 characters',
    char_count: 'characters',
    nft_label: 'NFT id',
    nft_help: 'Optional · enter 0 for a sip without an NFT',
    tip_label: 'Tip',
    cost_owner: 'OWNER',
    sign_btn: 'Sign & Send',
    sending: 'Weaving...',
    success: 'Your sip is on the loom',
    err_wallet: 'Connect a wallet first',
    err_chain: 'Switch to Base Mainnet',
    err_sacred: 'NFT #16 is sacred — excluded from the cycle',
    err_balance: 'Not enough OWNER Coin to tip',
    err_haiku: 'Haiku is invalid',
    explainer_title: 'How the sip works',
    step1: 'You sign the haiku off-chain (free) — EIP-712.',
    step2: 'The Generator submits the signature on-chain.',
    step3: '0.08 OWNER moves from your wallet to the SPINNER.',
    step4: 'An admin replies with their own signed haiku — gasless.',
    approve_btn: 'Approve OWNER',
    approve_pending: 'Approving...',
  },

  // ─── BOOK ───
  book: {
    title: 'THE BOOK',
    sub: 'Every page that has ever been woven, and the replies that wove them back.',
    no_sips: 'No sips have been woven yet. Be the first.',
    loading: 'Reading the chain...',
    by: 'by',
    on: 'on',
    reply_label: 'Reply',
    no_reply: 'Awaiting reply from an admin',
    sip_label: 'SIP',
    show_replies: 'Show replies',
    hide_replies: 'Hide replies',
    import_btn: 'Import replies (JSON)',
    export_btn: 'Export replies',
  },

  // ─── LADDER ───
  ladder: {
    title: 'THE MITOTIC LADDER',
    sub: '33 steps · 0.10 OWNER each · 56.10 total · the cell divides as the page is read.',
    step: 'Step',
    value: 'Value',
    cumulative: 'Cumulative',
    state_active: 'WEAVING',
    state_frozen: 'FROZEN',
    treasury_owner: 'TREASURY · OWNER',
    treasury_eth: 'TREASURY · ETH',
    sacred: 'Sacred NFT #16 — excluded from the cycle',
  },

  // ─── ADMIN ───
  admin: {
    title: 'ADMIN · REPLY TO SIPS',
    sub: 'Sign a haiku response. The reply is off-chain — no gas.',
    not_admin: 'Connected wallet is not an authorized admin.',
    select_sip: 'Select a sip to reply to',
    placeholder: 'Your reply haiku · up to 140 characters',
    sign_btn: 'Sign Reply',
    saved: 'Reply saved & verified',
    no_pending: 'No sips awaiting reply',
  },

  // ─── COMMON ───
  common: {
    connect: 'Connect wallet',
    disconnect: 'Disconnect',
    wrong_network: 'Wrong network',
    switch_to_base: 'Switch to Base',
    on_chain: 'on-chain · live',
    view_tx: 'View tx',
    view_addr: 'View on Basescan',
    powered: 'madeinathens.eth © 2012—2026 · BASE MAINNET 8453',
    qed: 'Q.E.D.',
  },

  // ─── ADMIN LABELS ───
  admins: {
    madeinathens: 'madeinathens.eth · the hand at the loom',
    nftable: 'nftable.eth · the keeper of threads',
    beecoin: 'beecoin.eth · the pollinator',
    syntropy: 'syntropy.eth · the order from chaos',
  },

  // ─── LLM PROMPT (copy & paste to any AI to explain the project) ───
  llm: {
    title: 'EXPLAIN THIS TO YOUR LLM',
    sub: 'Copy this prompt. Paste it into any AI. It will understand.',
    copy_btn: 'Copy prompt',
    copied: 'Copied ✓',
  },

  // ─── SPIN YOUR DATE ───
  spin: {
    title: 'SPIN YOUR DATE',
    sub: 'Reserve a moment of the past. Gift a future surprise. The loom that weaves remembers — without cost, without weight.',
    intro_title: 'A signed promise, anchored to a physical receipt.',
    intro_p1: 'A receiptClear is a 1:1 binding between a real-world event (a coffee, a donut, a book, a ride) and a wallet that may, one day, claim it.',
    intro_p2: 'You hash the receipt on-chain via keccak256 — the receipt itself never leaves your keeping. You sign EIP-712 — gasless, eternal. The recipient holds the proof.',
    intro_p3: 'It is a gift. It is a reservation. It is the loom retroactively folding tomorrow into yesterday.',
    wallet_label: 'Recipient wallet',
    wallet_help: 'The address that will hold this dated promise · 0x... or ENS name',
    receipt_label: 'Receipt label · physical reference',
    receipt_help: 'Examples: receipt #1234, sale id, IPFS CID of the photo, "morning coffee 04/05", or any text. Will be hashed via keccak256.',
    note_label: 'Note (optional)',
    note_help: 'A short message to bind to the gift · ≤140 chars',
    sign_btn: 'Sign receiptClear',
    pending: 'Signing...',
    success: 'Receipt signed & saved',
    err_invalid_addr: 'Invalid wallet address',
    err_empty_receipt: 'Receipt label cannot be empty',
    hash_label: 'Receipt hash (keccak256)',
    saved_title: 'YOUR SIGNED RECEIPTS',
    no_saved: 'No receipts signed yet.',
    download_btn: 'Download as JSON',
    examples_title: 'WHAT IS THIS GOOD FOR',
    ex1_title: 'Reservation',
    ex1_text: 'Reserve a Saturday coffee at Zosimadon 31. The barista holds the signature; you hold the proof.',
    ex2_title: 'Surprise gift',
    ex2_text: 'Sign a receipt for a friend\'s wallet. They discover it later — a moment from your past, woven into their future.',
    ex3_title: 'Augmented present',
    ex3_text: 'Bind a real receipt (a book, a ticket, a meal) to its on-chain twin. The thing exists twice — in matter and in math.',
    ex4_title: 'Legacy thread',
    ex4_text: 'A signed clear is a private notary act. No gas. No registry. Just two wallets and a hash.',
  },
}

// Structural type — string values, not literals — so el.ts can supply different strings
type DeepStringShape<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringShape<T[K]>
}
export type I18nDict = DeepStringShape<typeof en>
