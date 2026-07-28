import { detectETravelIntent, type ETravelIntent } from "./intents";

/**
 * SuperAgent intent routing.
 *
 * Deliberately dumb keyword matching — the MVP has no model behind it. What it
 * does have is Taglish tolerance: "pakicheck yung sss ko", "magkano contribution
 * ko", and "check my sss contributions" all land on the same intent.
 */
export type AgentIntent =
  | "etravel"
  | "sss"
  | "philhealth"
  | "psa"
  | "pagibig"
  | "vault"
  | "memory"
  | "greeting"
  | "fallback";

/** Which generative-UI card the agent renders with its reply, if any. */
export type CardKind = "sss" | "philhealth" | "psa" | "etravel" | null;

export interface AgentTurn {
  intent: AgentIntent;
  reply: string;
  card: CardKind;
  /** Follow-up chips offered under the reply. */
  suggestions: string[];
  /** Agencies the swarm touched — shown as working state before the reply. */
  working: string[];
  /** Present only for the eTravel card, which is built from the message itself. */
  etravel?: ETravelIntent;
}

const MATCHERS: { intent: AgentIntent; patterns: RegExp }[] = [
  { intent: "sss", patterns: /\bsss\b|social security|contribution|kontribusyon|hulog|prn|salary loan/i },
  { intent: "philhealth", patterns: /philhealth|phil health|konsulta|health insurance|ospital|hospital|dependent/i },
  { intent: "psa", patterns: /\bpsa\b|birth|kapanganakan|nso|secpa|cenomar|marriage cert|birth certificate/i },
  { intent: "pagibig", patterns: /pag-?ibig|pagibig|mp2|housing loan|hdmf/i },
  { intent: "vault", patterns: /vault|document|dokumento|upload|\bid\b|file/i },
  { intent: "memory", patterns: /naalala|remember|alam mo|memory|profile ko/i },
  { intent: "greeting", patterns: /^(hi|hello|kumusta|kamusta|musta|hoy|uy)\b/i },
];

export function detectIntent(input: string): AgentIntent {
  const text = input.trim();
  if (!text) return "fallback";
  for (const m of MATCHERS) if (m.patterns.test(text)) return m.intent;
  return "fallback";
}

/** The connected profile, so replies never assert facts about a guest. */
export interface AgentUser {
  name: string;
  verified: boolean;
}

export function respond(input: string, user?: AgentUser): AgentTurn {
  const knowsYou = user?.verified ?? false;

  // eTravel is checked first: its trigger words ("flight", "departure") are
  // specific enough that a match should win over the generic matchers.
  const travel = detectETravelIntent(input);
  if (travel) {
    return {
      intent: "etravel",
      card: "etravel",
      etravel: travel,
      working: ["Vault", "DFA", "eTravel", "Bureau of Immigration"],
      reply: "",
      suggestions: [],
    };
  }

  const intent = detectIntent(input);

  switch (intent) {
    case "sss":
      return {
        intent,
        card: "sss",
        working: ["SSS"],
        reply:
          "Tapos na boss — kinuha ko na ang record mo sa SSS. Up to date ka, 6 na buwan straight na naka-post, P1,350 kada buwan galing sa RBS Labs Inc. Heto ang buong listahan:",
        suggestions: ["Download PDF", "Bayaran ang July due", "Check salary loan eligibility"],
      };
    case "philhealth":
      return {
        intent,
        card: "philhealth",
        working: ["PhilHealth"],
        reply:
          "Active ang PhilHealth mo, boss — kasama ang 3 dependents mo, valid hanggang Dec 2026. Wala kang kailangang habulin ngayon:",
        suggestions: ["Add a dependent", "Find Konsulta provider", "Check case rate coverage"],
      };
    case "psa":
      return {
        intent,
        card: "psa",
        working: ["PSA"],
        reply:
          "Naka-file na ang PSA birth certificate request mo — tracking EGOV-2026-8891. Nasa verifying pa, ready for pickup by July 30. Bantayan ko na lang para sa iyo:",
        suggestions: ["Change to delivery", "Escalate this request", "Request CENOMAR too"],
      };
    case "pagibig":
      return {
        intent,
        card: null,
        working: ["Pag-IBIG"],
        reply:
          "Konektado na ang Pag-IBIG mo, boss — P200/mo membership savings, tuloy-tuloy mula 2015. Hindi pa naka-wire ang MP2 at housing loan sa MVP na ito, pero kaya ko nang sabihin kung kailan ka mag-qualify. Gusto mo bang bantayan ko ang MP2 dividend release?",
        suggestions: ["Check my SSS instead", "Track PSA request", "What do you remember about me?"],
      };
    case "vault":
      return {
        intent,
        card: null,
        working: [],
        reply:
          "Nasa Vault sa kanan ang mga dokumento mo — SSS_ID.pdf, PhilHealth_ID.png, at Valid_ID.jpg. Naka-encrypt lahat dito mismo sa device mo (AES-GCM), walang kopya sa server. Pindutin lang ang + Add Doc kung may idadagdag ka.",
        suggestions: ["Check my SSS contributions", "Track my PSA request", "Show my PhilHealth"],
      };
    case "memory":
      return {
        intent,
        card: null,
        working: [],
        reply: knowsYou
          ? `Naalala ko: ${user?.name}, naka-link na ang PhilSys ID mo, at P1,350/buwan ang SSS mo. Nasa "Naalala ko" panel sa kanan ang buong listahan — kaya hindi na kita tinatanong ulit.`
          : "Wala pa akong naaalala tungkol sa iyo, boss — guest ka pa. Pindutin ang Connect ID para ma-link ang pangalan at ID mo; doon lang ako magsisimulang matuto, at sa device mo lang naka-save.",
        suggestions: knowsYou
          ? ["Check my SSS contributions", "Show my PhilHealth", "Request PSA birth certificate"]
          : ["Check my SSS contributions", "Show my PhilHealth"],
      };
    case "greeting":
      return {
        intent,
        card: null,
        working: [],
        reply:
          knowsYou
            ? `Kumusta ${user?.name?.split(" ")[0]}! Nandito lang ako. Pwede kitang tulungan sa SSS, PhilHealth, Pag-IBIG, PSA, eTravel at DFA — sabihin mo lang kung ano ang kailangan.`
            : "Kumusta boss! Nandito lang ako. Pwede kitang tulungan sa SSS, PhilHealth, Pag-IBIG, at PSA — sabihin mo lang kung ano ang kailangan.",
        suggestions: ["Check my SSS contributions", "Show my PhilHealth", "Request PSA birth certificate"],
      };
    default:
      return {
        intent: "fallback",
        card: null,
        working: [],
        reply:
          "Hindi ko pa yata kaya 'yan sa MVP na ito, boss. Ang naka-connect sa akin ngayon: SSS, PhilHealth, Pag-IBIG, PSA, Bureau of Immigration (eTravel), at DFA. Subukan mo: “check my sss contributions”, “philhealth status ko”, o “request PSA birth certificate”.",
        suggestions: ["Check my SSS contributions", "Show my PhilHealth", "Request PSA birth certificate"],
      };
  }
}
