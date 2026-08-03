import type { SiteCopy } from "./types";

// =============================================================================
// Korean translation (machine-assisted). Crypto-native register.
// Glossary: fork=포크, migration=마이그레이션, self-custody wallet=본인 지갑,
// deadline=마감, universe=유니버스.
// Do NOT translate: REP / REPv1 / REPv2 / REPv2_Yes_1 / REPv2_No_1, tickers,
// URLs, exchange names, statuses, or deadlines. Only prose is translated here.
// =============================================================================
export const ko = {
  meta: {
    title: "ForkWatch — 오거 포크 결과 및 REP 마이그레이션 수량",
    description:
      "오거 포크 기록, 기간 중 마이그레이션된 REP 수량, 지갑 보유 REP 잔액, 보안 안내 및 거래소 지원 기록을 확인하세요.",
    keywords: [
      "오거",
      "ForkWatch",
      "REP",
      "REP 토큰",
      "오거 포크 결과",
      "포크 기록",
      "예측 시장",
      "이더리움",
    ],
  },
  languageToggle: {
    ariaLabel: "언어",
    englishLabel: "영어",
    koreanLabel: "한국어",
    usFlagLabel: "미국 국기",
    koreanFlagLabel: "대한민국 국기",
  },
  header: {
    sectionNavAriaLabel: "페이지 섹션",
  },
  nav: {
    sectionLabels: {
      overview: "개요",
      "scam-warning": "사기 경고",
      "exchange-support": "거래소 기록",
      check: "REP 확인",
    },
  },
  wordmark: {
    homeAriaLabel: "ForkWatch 홈",
  },
  overview: {
    eyebrow: "포크 상태",
    titlePrefix: "오거 포크가",
    titlePreviousStatus: "진행 중입니다",
    titleStatus: "종료되었습니다",
    subtitle:
      "60일간의 포크 기간이 종료되었습니다. 마이그레이션된 REP 수량과 주소에 남아 있는 REP을 확인하고 포크 기록을 살펴보세요.",
    faq: {
      "what-is-happening": {
        question: "무슨 일이 있었나요?",
        answer:
          "오거에 포크가 있었습니다. REP 보유자에게는 60일의 마이그레이션 기간이 주어졌고 그 기간은 종료되었습니다. 이 페이지는 이제 주요 일정과 이동한 수량을 남겨 두는 기록 보관소입니다.",
        ctaLabel: "공식 포크 공지",
      },
      "what-to-do": {
        question: "지금 무엇을 할 수 있나요?",
        answer:
          "마이그레이션 기간이 종료되어 이제 마이그레이션은 불가능하며, 부모 유니버스에 남은 REP은 가치가 없을 것으로 예상됩니다. 읽기 전용 조회 도구로 이더리움 메인넷 주소의 REPv1, REPv2, 마이그레이션된 REP은 계속 확인할 수 있습니다.",
        ctaLabel: "이전 마이그레이션 가이드 보기",
      },
      "how-urgent": {
        question: "아직 REPv2가 있다면 어떻게 하나요?",
        answer:
          "마이그레이션하지 못하고 REPv1이나 REPv2를 그대로 보유하고 있다면 이제 할 수 있는 일은 없습니다. 기간은 다시 열리지 않습니다. 아래 읽기 전용 조회 도구로 주소에 무엇이 남아 있는지는 확인할 수 있습니다. 늦은 마이그레이션이나 복구를 제안하는 연락은 사기이므로 주의하세요.",
        ctaLabel: "내 REP 확인하기",
      },
    },
  },
  migrationCard: {
    start: "시작",
    deadline: "종료",
    cutoffTime: "포크 종료 시각",
    utcLabel: "UTC",
    localLabel: "현지",
    ended: {
      ariaLabel: "오거 포크 기간 종료",
      eyebrow: "포크 상태",
      badge: "종료",
      title: "마이그레이션 기간이 종료되었습니다",
      body: "60일간의 기간이 모두 끝났으며 이제 REP을 마이그레이션할 수 없습니다. ForkWatch는 읽기 전용 기록으로 계속 제공됩니다.",
      timelineTitle: "완료된 60일 타임라인",
      timelineAriaLabel: ({ start, end }) =>
        `60일 포크 타임라인은 ${start}부터 ${end}까지 진행된 후 종료되었습니다.`,
      timelineMarker: "종료",
      warningLabel: "잠깐, 안전 안내",
      warningBody:
        "마이그레이션 기간은 다시 열리지 않습니다. 늦은 마이그레이션, REP 복구 또는 대체 REP 수령을 제안하는 메시지, 웹사이트, 토큰을 믿지 마세요.",
      nextActionLabel: "지금 할 수 있는 일",
      nextActionBody:
        "읽기 전용 조회 도구로 이더리움 메인넷 주소의 REP을 확인하세요.",
      checkRepButton: "REP 잔액 확인",
      migrationInstructions: "공식 가이드 보기(기록)",
    },
  },
  progressBar: {
    progressUnavailable: "공급량을 확인할 수 없음",
    loading: "공급량 불러오는 중...",
    loadingStatus:
      "이더리움에서 두 마이그레이션 REP 토큰의 공급량을 읽는 중입니다.",
    fileUnavailable:
      "마이그레이션된 REP 합계를 일시적으로 확인할 수 없습니다. ForkWatch가 저장된 이더리움 데이터를 읽지 못했습니다.",
    readFailed:
      "최근 이더리움 데이터 읽기에 실패하여 마지막으로 기록된 두 토큰의 수량을 표시합니다.",
    ethReadUnavailable:
      "최근 업데이트 중 이더리움 메인넷에 연결할 수 없어 마이그레이션된 REP 합계를 일시적으로 확인할 수 없습니다.",
    lastCheckedPending: "업데이트 시각을 확인할 수 없음",
    lastChecked: (timestamp) => `이더리움 데이터 업데이트: ${timestamp}`,
    ended: {
      ariaLabel: "오거 포크의 REP 마이그레이션 수량",
      eyebrow: "마이그레이션 결과",
      amountLabel: "마이그레이션된 REP 합계",
      supplyTitle: "기존 공급량 대비",
      supplyDescription: (percent) =>
        `기존 REP 공급량 1,100만 개 중 ${percent}가 두 자식 유니버스로 이동했습니다.`,
      sourceLabel: (timestamp) => `이더리움 데이터 업데이트: ${timestamp}`,
      blockLabel: (blockNumber) => `블록 ${blockNumber}`,
      outcomeSectionLabel: "자식 유니버스별 마이그레이션 수량",
      outcomeSectionTitle: "REP 이동 결과",
      yesOutcomeLabel: "Yes 자식 유니버스",
      noOutcomeLabel: "No 자식 유니버스",
      tokenSupplyLabel: "마이그레이션 수량",
      tokenContractLabel: "토큰 컨트랙트",
      childUniverseLabel: "자식 유니버스",
      parentUniverseLabel: "부모 유니버스",
      etherscanLabel: "Etherscan에서 보기",
    },
  },
  scamWarning: {
    eyebrow: "보안",
    title: "늦은 마이그레이션 및 복구 사기",
    body: "포크 기간은 종료되었으며 누구도 이를 다시 열 수 없습니다. 늦은 마이그레이션, 기존 REP 복구 또는 지갑 검증이 가능하다고 주장하는 사칭자, 가짜 웹사이트, 대체 토큰, 요청하지 않은 메시지를 믿지 마세요. 시드 문구, 개인 키, 복구 단어를 절대 공유하지 마세요.",
  },
  exchangeSupport: {
    eyebrow: "거래소 기록",
    title: "과거 포크 지원 현황",
    trackedExchanges: "기록된 거래소 상태",
    archiveNotice:
      "이 섹션은 포크 마감 전에 발표된 거래소 지원 내용을 보존한 기록입니다. 현재 출금, 마이그레이션 또는 계정 안내가 아닙니다. 계정별 정보는 각 거래소의 공식 고객지원 채널에서 확인하세요.",
    explainAriaLabel: (title) => `과거 정보: ${title}`,
    groups: {
      "will-support": {
        title: "포크 지원을 공지함",
        action: "과거 공지",
        body: "여기에 표시된 거래소는 마감 전에 포크를 지원할 예정이라고 공지했습니다. 이 기록은 개별 계정이나 잔액이 실제로 어떻게 처리되었는지 확인하지 않습니다.",
        emptyLabel: "지원 거래소로 기록된 곳이 없습니다.",
      },
      "will-not-support": {
        title: "포크 미지원을 공지함",
        action: "과거 공지",
        body: "여기에 표시된 거래소는 마감 전에 포크를 지원하지 않을 예정이라고 공지했습니다. 이 기록은 현재 출금 또는 마이그레이션 안내가 아닙니다.",
        emptyLabel: "미지원 거래소로 기록된 곳이 없습니다.",
      },
      "not-confirmed": {
        title: "지원 여부가 확인되지 않았음",
        action: "과거 상태",
        body: "여기에 표시된 거래소는 마감 전까지 포크 지원 여부가 확인되지 않았습니다. 현재 계정이나 잔액에 관한 문의는 거래소에 직접 확인하세요.",
        emptyLabel: "과거 미확인 상태로 기록된 거래소가 없습니다.",
      },
    },
    upbitNotice: {
      badge: "기록",
      title: "업비트는 포크 미지원을 공지했습니다",
      body: "업비트는 마감 전에 KRW 마켓을 포함한 REP 포크를 지원하지 않는다고 공지했습니다. 이 항목은 당시 공지를 보존한 기록이며, 현재 출금 또는 마이그레이션 안내가 아닙니다.",
    },
  },
  repChecker: {
    sectionEyebrow: "포크 후 REP 조회",
    sectionTitle: "지갑 보유 REP 검토",
    balanceCheckTitle: "읽기 전용 REP 잔액 확인",
    addressLabel: "이더리움 주소",
    checkButton: "REP 확인",
    checkingButton: "확인 중...",
    migratedRepYesLabel: "마이그레이션된 REP (Yes)",
    migratedRepNoLabel: "마이그레이션된 REP (No)",
    archiveNotice:
      "포크 기간은 종료되었습니다. 이 도구는 잔액만 읽으며 REP을 마이그레이션, 이동, 수령 또는 복구할 수 없습니다.",
    scopeCards: {
      whyItMatters: {
        title: "이 확인이 중요한 이유",
        body: "REP은 일부 지갑 UI, 특히 오래된 REPv1 잔액에서 표시되지 않을 수 있습니다. 주소를 직접 조회하면 포크 후 해당 주소에 남아 있는 REPv1, REPv2 또는 마이그레이션된 REP을 확인할 수 있습니다.",
      },
      scope: {
        title: "범위",
        body: "이더리움 메인넷의 REPv1, REPv2, 마이그레이션된 REP만 확인합니다. 거래소, 수탁기관, L2, 브리지, 다른 주소나 스마트 컨트랙트가 보유한 REP 및 기타 체인은 확인하지 않습니다.",
      },
      warning: {
        title: "경고",
        body: "잔액 결과는 입력한 주소만 확인합니다. 신뢰할 수 있는 온체인 출처에서 주소, 토큰 컨트랙트, 잔액을 다시 확인하세요.",
      },
    },
    checking: {
      eyebrow: "확인 중",
      title: "이더리움 메인넷 읽는 중",
      body: "이 주소의 REPv1, REPv2, 마이그레이션된 REP 잔액을 확인하는 중입니다. 이 읽기 전용 조회는 지갑을 연결하거나 트랜잭션을 요청하지 않습니다.",
    },
    resultNotice: {
      deadlineAction: "포크 후 확인 결과",
      details: "세부 정보",
    },
    warningLabel: "경고",
    scopeNote: {
      eyebrow: "범위 안내",
      body: "이 도구는 이더리움 메인넷의 REPv1, REPv2, 마이그레이션된 REP 잔액만 확인합니다. 관련 주소를 입력하고 토큰이 지원되는 경우가 아니라면 거래소, 수탁기관, 브리지, L2, 기타 체인, 래핑된 REP, 다른 지갑 주소, LP 포지션은 확인하지 않습니다.",
      liability:
        "신뢰할 수 있는 온체인 출처에서 결과를 다시 확인하세요. 이 읽기 전용 도구는 정보 제공 목적으로만 제공되며 토큰을 마이그레이션하거나 복구할 수 없습니다. 손실된 REP을 포함한 손실에 대해 책임지지 않습니다.",
    },
    addressField: "주소",
    checkedThrough: ({ date, endpoint }) =>
      `${endpoint}을(를) 통해 ${date}에 확인함.`,
    results: {
      both: {
        title: "REPv1 및 REPv2 발견",
        action:
          "이 주소에는 REPv1과 REPv2가 모두 남아 있습니다. 읽기 전용 조회 도구는 잔액을 표시할 수 있지만 이를 변경하거나 복구할 수 없습니다.",
        warning:
          "기간이 종료되어 이 잔액은 더 이상 포크를 통해 마이그레이션할 수 없습니다. 늦은 마이그레이션이나 복구를 제안하는 연락에 주의하세요.",
      },
      error: {
        title: "이더리움 메인넷을 확인할 수 없음",
        body: "읽기 전용 잔액 확인에 실패했습니다. 나중에 다시 시도하거나 신뢰할 수 있는 이더리움 블록 익스플로러에서 REPv1, REPv2, 마이그레이션된 REP을 직접 확인하세요.",
      },
      invalid: {
        title: "잘못된 이더리움 주소",
        body: "유효한 이더리움 메인넷 주소를 입력하세요. ForkWatch는 시드 문구, 개인 키 또는 지갑 연결을 요구하지 않습니다.",
      },
      legacyAndMigrated: {
        title: "마이그레이션된 REP과 기존 REP 발견",
        action:
          "이 주소에는 마이그레이션된 REP과 함께 REPv1 및/또는 REPv2가 남아 있습니다. 기존 REP 잔액은 마이그레이션 기간 종료 후에도 남아 있습니다.",
        warning:
          "기존 REP은 더 이상 포크를 통해 마이그레이션할 수 없습니다. 늦은 마이그레이션이나 복구를 제안하는 연락에 주의하세요.",
      },
      none: {
        title: "이더리움 메인넷 REP을 찾을 수 없음",
        body: "이 주소에서 이더리움 메인넷의 REPv1, REPv2 또는 마이그레이션된 REP을 찾지 못했습니다. REP이 있을 것으로 예상했다면 다른 지갑 주소, 거래소나 수탁기관 계정, 브리지, 다른 네트워크, 스마트 컨트랙트 포지션을 확인하세요.",
      },
      partial: {
        title: "REP 확인 미완료",
        body: "ForkWatch가 이 주소의 지원되는 모든 REP 토큰을 읽지 못했습니다. 이를 완전한 포크 후 결과로 여기지 마세요. 나중에 다시 시도하거나 신뢰할 수 있는 블록 익스플로러에서 각 토큰 컨트랙트를 직접 확인하세요.",
      },
      repv1: {
        title: "REPv1 발견",
        action:
          "이 주소에는 REPv1이 남아 있습니다. 읽기 전용 조회 도구는 잔액을 표시할 수 있지만 이를 변경하거나 복구할 수 없습니다.",
        warning:
          "기간이 종료되어 이 잔액은 더 이상 포크를 통해 마이그레이션할 수 없습니다. 늦은 마이그레이션이나 복구를 제안하는 연락에 주의하세요.",
      },
      repv2: {
        title: "REPv2 발견",
        action:
          "이 주소에는 REPv2가 남아 있습니다. 읽기 전용 조회 도구는 잔액을 표시할 수 있지만 이를 변경하거나 복구할 수 없습니다.",
        warning:
          "기간이 종료되어 이 잔액은 더 이상 포크를 통해 마이그레이션할 수 없습니다. 늦은 마이그레이션이나 복구를 제안하는 연락에 주의하세요.",
      },
      migrated: {
        title: "마이그레이션된 REP 발견",
        body: "이 주소에는 포크 마이그레이션 기간 중 하나 이상의 자식 유니버스 토큰으로 이동한 REP이 있습니다. 이 결과는 입력한 주소만 확인하므로 사용한 다른 지갑이나 계정도 확인하세요.",
      },
    },
    actions: {
      migrationInstructions: "공식 마이그레이션 가이드(기록)",
      checkAnother: "다른 주소 확인",
    },
    guideWarning: {
      verifyUrl:
        "공식 마이그레이션 가이드를 과거 참고 자료로 엽니다. ForkWatch를 떠나기 전에 도메인과 HTTPS/TLS 자물쇠를 확인하세요.",
      neverShareSecrets:
        "시드 문구, 개인 키, 복구 단어를 절대 입력하거나 공유하지 마세요. 포크 후 잔액 조회나 기록 열람에는 이러한 정보가 필요하지 않습니다.",
      startFromBookmark:
        "늦은 마이그레이션 또는 복구를 제공한다고 주장하면 탭을 닫고 신뢰할 수 있는 북마크에서 다시 시작하세요.",
    },
    guideDialog: {
      eyebrow: "기록 링크 확인",
      title: "공식 가이드를 열기 전에 확인하세요",
      confirmLabel: "이해했습니다",
    },
    messages: {
      invalidAddress:
        "유효한 이더리움 메인넷 주소를 입력하세요. 시드 문구나 개인 키는 절대 입력하지 마세요.",
      rpcError:
        "지금은 이더리움 메인넷을 확인할 수 없습니다. 나중에 다시 시도하거나 신뢰할 수 있는 블록 익스플로러를 이용하세요.",
      tokenReadError: "이 토큰 잔액을 읽을 수 없습니다.",
      balanceUnavailable: "사용 불가",
    },
  },
  footer: {
    summaryAriaLabel: "ForkWatch 요약",
    summary:
      "오거 리부트를 위한 포크 후 REP 보유자 보안 안내, 마이그레이션된 REP 공급량, 지갑 잔액 조회 및 포크 기록.",
    noticeTitle: "기록 안내",
    noticeBody:
      "과거 기록 및 교육 목적으로만 제공됩니다. 온체인 데이터와 공식 출처를 직접 확인하세요. 투자, 트레이딩, 법률, 세무 또는 재무 조언이 아닙니다.",
  },
  safetyDialog: {
    cancelLabel: "취소",
    eyebrow: "외부 링크 확인",
    closeAriaLabel: (title) => `${title} 닫기`,
  },
  externalLink: {
    confirmLabel: "외부 사이트로 계속",
    title: "ForkWatch를 떠나기 전에 잠시 멈추고 확인하세요",
    warningPrimary:
      "외부 사이트를 여는 중입니다. 지갑을 연결하거나 조치를 취하기 전에 도메인, HTTPS/TLS 자물쇠, 공식 출처를 확인하세요.",
    warningSecondary:
      "오거 또는 Lituus의 누구도 늦은 마이그레이션이나 REP 복구를 제안하는 DM을 보내지 않습니다. 시드 문구, 개인 키, 복구 단어를 절대 입력하지 마세요.",
  },
} satisfies SiteCopy;
