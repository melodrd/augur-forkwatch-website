import type { SiteCopy } from "./types";

// =============================================================================
// Korean translation (machine-assisted). Crypto-native register.
// Glossary: fork=포크, migration=마이그레이션, self-custody wallet=본인 지갑,
// deadline=마감, universe=유니버스.
// Do NOT translate: REP / REPv1 / REPv2 / REPv2_Yes_1, tickers, URLs, exchange
// names, statuses, or deadlines. Only prose is translated here.
// =============================================================================
export const ko = {
  meta: {
    title: "ForkWatch — 오거 포크 상태 대시보드",
    description:
      "ForkWatch는 오거(Augur) 리부트를 위한 공개 REP 보유자 안전 및 포크 상태 대시보드입니다.",
    keywords: [
      "오거",
      "ForkWatch",
      "REP",
      "REP 토큰",
      "포크 대시보드",
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
      "exchange-support": "거래소",
      check: "REP 확인",
    },
  },
  wordmark: {
    homeAriaLabel: "ForkWatch 홈",
  },
  overview: {
    eyebrow: "포크 상태",
    title: "오거 포크가 진행 중입니다",
    subtitle:
      "포크 시기가 다가옴에 따라 마이그레이션 일정과 REP 마이그레이션 진행 상황을 추적하세요.",
    faq: {
      "what-is-happening": {
        question: "무슨 일이 일어나고 있나요?",
        answer:
          "오거의 오라클이 포크에 진입합니다. REP 보유자는 자신이 유효하다고 믿는 결과로 REP을 옮겨 승리하는 유니버스를 결정합니다.",
        ctaLabel: "공식 포크 공지",
      },
      "what-to-do": {
        question: "무엇을 해야 하나요?",
        answer:
          "REPv1 또는 REPv2를 보유하고 있다면 본인 지갑으로 옮기고 마감 전에 마이그레이션을 완료하세요. 그렇지 않으면 REP을 복구할 수 없게 될 수 있습니다.",
        ctaLabel: "마이그레이션 안내",
      },
      "how-urgent": {
        question: "얼마나 긴급한가요?",
        answer:
          "매우 긴급합니다. 마이그레이션 기간이 지금 열려 있습니다. 지갑에서 REPv1 또는 REPv2를 확인하고 안내를 읽은 뒤, REP이 무가치해지지 않도록 마감 전에 마이그레이션하세요.",
        ctaLabel: "마이그레이션 웹사이트",
      },
    },
  },
  migrationCard: {
    ariaLabel: "마이그레이션 카운트다운",
    eyebrow: "마이그레이션 마감",
    timeRemaining: "남은 시간",
    liveCountdown: "실시간 카운트다운",
    units: {
      days: "일",
      hours: "시간",
      minutes: "분",
      seconds: "초",
    },
    countdownSrText: ({ days, hours, minutes, seconds }) =>
      `REP 마이그레이션까지 남은 시간: ${days}일 ${hours}시간 ${minutes}분 ${seconds}초.`,
    timelineTitle: "60일 타임라인",
    timelineAriaLabel: ({ start, end, now }) =>
      `${start}부터 ${end}까지의 타임라인. 현재 시각은 ${now}입니다.`,
    now: "현재",
    start: "시작",
    deadline: "마감",
    cutoffTime: "마감 시각",
    utcLabel: "UTC",
    localLabel: "현지",
    warningLabel: "경고",
    warningBody:
      "마감 전에 REP을 마이그레이션하지 않으면 REP은 무가치한 것으로 간주됩니다.",
    nextActionLabel: "다음 단계",
    nextActionBody:
      "먼저 지갑에 REPv1 또는 REPv2가 있는지 확인한 다음, 마이그레이션 안내를 읽고 타이머가 0이 되기 전에 마이그레이션하세요. 마이그레이션 후에는 주소가 의도한 목적지 REP 토큰을 보유하고 있는지 확인하세요.",
    checkRepButton: "REP 확인",
    migrationInstructions: "마이그레이션 안내",
    migrationWebsite: "마이그레이션 웹사이트",
    loadingDeadline: "이더리움 메인넷에서 마감 정보를 불러오는 중",
    deadlineUnavailableShort: "마감 정보를 일시적으로 사용할 수 없음",
    deadlineUnavailable: "마감 정보를 사용할 수 없음",
  },
  progressBar: {
    ariaLabel: "마이그레이션된 REP",
    eyebrow: "마이그레이션된 REP",
    progressUnavailable: "진행 상황을 사용할 수 없음",
    loading: "불러오는 중...",
    loadingStatus:
      "가장 최근 예약 업데이트에서 마이그레이션 진행 상황을 불러오는 중입니다.",
    fileUnavailable:
      "마이그레이션 진행 상황을 일시적으로 사용할 수 없습니다. ForkWatch가 정적 마이그레이션 진행 파일을 읽지 못했습니다.",
    readFailedWithDuration: (duration) =>
      `가장 최근 예약된 이더리움 읽기가 실패했습니다. ${duration} 전의 마지막 성공한 읽기를 표시합니다.`,
    readFailed:
      "가장 최근 예약된 이더리움 읽기가 실패했습니다. 마지막으로 성공한 읽기를 표시합니다.",
    ethReadUnavailable:
      "마이그레이션 진행 상황을 일시적으로 사용할 수 없습니다. ForkWatch가 가장 최근 예약 업데이트 중 이더리움 메인넷을 읽지 못했습니다.",
    progressDescription: (percent) =>
      `전체 REP 공급량 중 ${percent} 마이그레이션됨`,
    lastCheckedPending: "마지막 확인: 대기 중",
    lastChecked: (timestamp) => `마지막 확인: ${timestamp}`,
  },
  scamWarning: {
    eyebrow: "보안",
    title: "사기 경고",
    body: "아무도 대신 REP을 마이그레이션해 주지 않습니다. 마이그레이션 처리, 자금 복구, 지갑 검증을 대신해 준다고 주장하는 사칭자, 가짜 웹사이트, 요청하지 않은 메시지를 조심하세요. 지갑을 연결하기 전에 항상 URL을 확인하고, 지갑 비밀 정보를 누구와도 공유하지 마세요.",
  },
  exchangeSupport: {
    eyebrow: "거래소 지원",
    title: "포크 지원 트래커",
    trackedExchanges: "추적 중인 거래소",
    explainAriaLabel: (title) => `설명: ${title}`,
    groups: {
      "will-support": {
        title: "포크를 지원할 예정",
        action: "출금 불필요",
        body: "여기에 표시된 거래소는 포크 지원을 확인했습니다. 마이그레이션만을 위해 출금할 필요는 없지만, 거래소의 공식 안내와 마감을 여전히 따르세요.",
        emptyLabel: "아직 확인된 거래소가 없습니다.",
      },
      "will-not-support": {
        title: "포크 미지원 예정",
        action: "출금 필요",
        body: "여기에 표시된 거래소는 포크를 지원하지 않습니다. REP을 본인 지갑으로 출금하고 마감 전에 직접 마이그레이션을 완료하세요.",
        emptyLabel: "아직 확인된 거래소가 없습니다.",
      },
      "not-confirmed": {
        title: "아직 확인되지 않음",
        action: "곧 출금 및 마이그레이션",
        body: "지원 여부가 확인되지 않았습니다. 미해결로 간주하세요. 가능한 한 빨리 본인 지갑으로 출금하고 마이그레이션하는 것을 권장합니다.",
        emptyLabel: "추적 중인 미확인 거래소가 없습니다.",
      },
    },
    upbitNotice: {
      badge: "긴급",
      title: "업비트는 포크를 지원하지 않습니다",
      body: "업비트(KRW 마켓 포함) 이용자는 REP을 본인 지갑으로 직접 출금한 뒤, 마감 전에 스스로 마이그레이션을 완료해야 합니다. 마감까지 마이그레이션하지 않으면 보유한 REP은 무가치해집니다. 업비트는 대신 마이그레이션을 처리해 주지 않습니다.",
    },
  },
  repChecker: {
    sectionEyebrow: "REP 조회",
    sectionTitle: "지갑 보유 REP 확인",
    balanceCheckTitle: "REP 잔액 확인",
    addressLabel: "이더리움 주소",
    checkButton: "REP 확인",
    checkingButton: "확인 중...",
    scopeCards: {
      whyItMatters: {
        title: "이 확인이 중요한 이유",
        body: "REP은 일부 지갑 UI, 특히 오래된 REPv1 잔액에서는 표시되지 않을 수 있으므로, 주소를 직접 확인하면 포크 마감 전에 보유한 것을 확인하는 데 도움이 됩니다. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
      scope: {
        title: "범위",
        body: "이더리움 메인넷만 확인합니다. 거래소, 수탁기관, L2, 브리지, 스마트 컨트랙트에 보관된 REP, 기타 체인은 확인하지 않습니다. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
      warning: {
        title: "경고",
        body: "마이그레이션 조치를 취하기 전에 주소를 다시 확인하고 신뢰할 수 있는 출처로 세부 정보를 확인하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
    },
    checking: {
      eyebrow: "확인 중",
      title: "이더리움 메인넷 읽는 중",
      body: "주소에서 REPv1 및 REPv2 잔액을 확인하는 중입니다. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
    },
    resultNotice: {
      deadlineAction: "마감 조치",
      details: "세부 정보",
    },
    warningLabel: "경고",
    scopeNote: {
      eyebrow: "범위 안내",
      body: "이 도구는 이더리움 메인넷의 REPv1 및 REPv2 잔액만 확인합니다. 관련 주소를 붙여넣고 지원되는 경우가 아니라면 거래소, 수탁기관, 브리지, L2, 기타 체인, 래핑된 REP, 붙여넣는 것을 잊은 지갑, LP 포지션은 확인하지 않습니다. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      liability:
        "조치를 취하기 전에 신뢰할 수 있는 출처로 다시 확인하세요. 이 도구는 정보 제공 목적으로만 제공되며, 손실된 REP을 포함한 손실에 대해 책임지지 않습니다. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
    },
    addressField: "주소",
    checkedThrough: ({ date, endpoint }) =>
      `${endpoint}을(를) 통해 ${date}에 확인함.`,
    results: {
      both: {
        title: "이 지갑은 마이그레이션이 필요합니다",
        action:
          "이 주소에는 REPv1과 REPv2가 모두 있습니다. 먼저 REPv1 잔액을 REPv2로 전환한 다음, 마감 전에 전체 REPv2 잔액을 의도한 포크 결과로 마이그레이션하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
        warning:
          "마감 전에 마이그레이션하지 않으면 이 REP 토큰은 무가치해집니다.",
      },
      error: {
        title: "이더리움 메인넷을 확인할 수 없음",
        body: "잔액 확인에 실패했습니다. 나중에 다시 시도하거나 이더리움 블록 익스플로러에서 직접 확인하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
      invalid: {
        title: "잘못된 이더리움 주소",
        body: "유효한 이더리움 주소를 입력하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
      none: {
        title: "이더리움 메인넷 REP을 찾을 수 없음",
        body: "확인한 주소에서 이더리움 메인넷의 REPv1 또는 REPv2를 찾지 못했습니다. REP이 있을 것으로 예상했다면 오래된 지갑, 거래소/수탁기관 계정, 브리지, 다른 네트워크, 붙여넣는 것을 잊었을 수 있는 주소를 확인하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
      partial: {
        title: "REP 확인 미완료",
        body: "ForkWatch가 이 주소의 지원되는 모든 REP 토큰을 읽지 못했습니다. 이를 확실한 결과로 여기지 마세요. 나중에 다시 시도하거나 신뢰할 수 있는 블록 익스플로러에서 각 토큰을 직접 확인하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
      repv1: {
        title: "REPv1 마이그레이션 필요",
        action:
          "이 주소에는 REPv1이 있습니다. 먼저 REPv1을 REPv2로 전환한 다음, 마감 전에 REPv2를 의도한 포크 결과로 마이그레이션하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
        warning:
          "마감 전에 마이그레이션하지 않으면 이 REP 토큰은 무가치해집니다.",
      },
      repv2: {
        title: "REPv2 마이그레이션 필요",
        action:
          "이 주소에는 REPv2가 있습니다. 마감 전에 REPv2를 의도한 포크 결과로 마이그레이션하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
        warning:
          "마감 전에 마이그레이션하지 않으면 이 REP 토큰은 무가치해집니다.",
      },
      repv2Yes1: {
        title: "설정된 목적지 REP 발견",
        body: "이 주소는 REPv2_Yes_1을 보유하고 있습니다. 마이그레이션이 성공한 것으로 보이지만, 이 결과에 의존하기 전에 신뢰할 수 있는 블록 익스플로러와 다른 출처를 확인하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      },
    },
    actions: {
      migrationInstructions: "마이그레이션 안내",
      checkAnother: "다른 주소 확인",
      migrationWebsite: "마이그레이션 웹사이트",
    },
    guideWarning: {
      verifyUrl:
        "공식 출처를 통해 URL이 올바른지 확인한 다음, 지갑을 연결하기 전에 매번 도메인과 TLS 자물쇠 아이콘을 확인하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      neverShareSecrets:
        "시드 문구, 개인 키, 복구 단어를 절대 입력하거나 공유하지 마세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      startFromBookmark:
        "무언가 이상하다고 느껴지면 탭을 닫고 신뢰할 수 있는 북마크에서 다시 시작하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
    },
    guideDialog: {
      eyebrow: "사기 확인",
      title: "연결하기 전에 잠시 멈추고 확인하세요",
      confirmLabel: "이해했습니다",
    },
    messages: {
      invalidAddress:
        "유효한 이더리움 주소를 입력하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      rpcError:
        "지금은 이더리움 메인넷을 확인할 수 없습니다. 나중에 다시 시도하세요. 자세한 내용은 마이그레이션 가이드를 확인하세요.",
      tokenReadError: "이 토큰 잔액을 읽을 수 없습니다.",
      balanceUnavailable: "사용 불가",
    },
  },
  footer: {
    summaryAriaLabel: "ForkWatch 요약",
    summary:
      "오거 리부트를 위한 공개 REP 보유자 안전, 마이그레이션 진행 상황, 포크 상태 모니터링.",
    noticeTitle: "고지",
    noticeBody:
      "교육 목적으로만 제공됩니다. 투자, 트레이딩, 법률, 세무 또는 재무 조언이 아닙니다.",
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
      "오거 또는 Lituus의 누구도 마이그레이션을 돕기 위해 DM을 보내지 않습니다. 시드 문구, 개인 키, 복구 단어를 절대 입력하지 마세요.",
  },
  duration: {
    lessThanMinute: "1분 미만",
    minutes: (value) => `${value}분`,
    hours: (value) => `${value}시간`,
    days: (value) => `${value}일`,
  },
} satisfies SiteCopy;
