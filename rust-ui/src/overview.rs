#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum OverviewScenario {
    Healthy,
    LowBalance,
    CriticalBalance,
    Exhausted,
    Empty,
    PartialFailure,
    Unknown,
    Loading,
}

impl OverviewScenario {
    pub fn from_query(query: Option<&str>) -> Self {
        let requested = query.and_then(|query| {
            query.split('&').find_map(|pair| {
                let (key, value) = pair.split_once('=')?;
                (key == "state").then_some(value)
            })
        });

        match requested {
            Some("low") => Self::LowBalance,
            Some("critical") => Self::CriticalBalance,
            Some("exhausted") => Self::Exhausted,
            Some("empty") => Self::Empty,
            Some("partial") => Self::PartialFailure,
            Some("unknown") => Self::Unknown,
            Some("loading") => Self::Loading,
            _ => Self::Healthy,
        }
    }
}

struct Metric<'a> {
    label: &'a str,
    value: &'a str,
    detail: &'a str,
    status: Option<(&'a str, &'a str)>,
}

struct PageState<'a> {
    conclusion: &'a str,
    conclusion_tone: &'a str,
    primary_label: &'a str,
    primary_href: &'a str,
    metrics: [Metric<'a>; 4],
    attention: Option<Attention<'a>>,
    show_onboarding: bool,
    show_models: bool,
    show_activity: bool,
}

struct Attention<'a> {
    title: &'a str,
    description: &'a str,
    action: &'a str,
}

pub fn render_overview(scenario: OverviewScenario) -> String {
    if scenario == OverviewScenario::Loading {
        return render_shell(render_loading(), scenario);
    }

    let state = page_state(scenario);
    let mut content = String::with_capacity(24_000);

    content.push_str(&format!(
        r#"<header class="page-header">
          <div class="page-heading"><p class="eyebrow">BUYER WORKSPACE</p><h1>概览</h1><p>查看今日用量、账户余额与 API 服务状态。</p></div>
          <a class="button primary" href="{}">{}</a>
        </header>
        <section class="conclusion {}" aria-label="账户使用结论">
          {}<div><strong>{}</strong><p>{}</p></div>
        </section>"#,
        state.primary_href,
        state.primary_label,
        state.conclusion_tone,
        status_icon(state.conclusion_tone),
        state.conclusion,
        conclusion_detail(scenario),
    ));

    content.push_str(r#"<section class="metrics" aria-label="今日核心指标">"#);
    for metric in &state.metrics {
        content.push_str(&render_metric(metric));
    }
    content.push_str("</section>");

    if let Some(attention) = state.attention {
        content.push_str(&format!(
            r#"<section id="attention" class="attention" role="alert">
              <div class="attention-copy">{}<div><p class="section-kicker">需要处理</p><h2>{}</h2><p>{}</p></div></div>
              <a class="button warning" href="/buyer/billing">{}</a>
            </section>"#,
            icon("alert-triangle"),
            attention.title,
            attention.description,
            attention.action,
        ));
    }

    if state.show_onboarding {
        content.push_str(render_onboarding());
    }
    if state.show_models {
        content.push_str(render_models());
    }
    if state.show_activity {
        content.push_str(render_activity());
    }

    render_shell(content, scenario)
}

fn page_state(scenario: OverviewScenario) -> PageState<'static> {
    match scenario {
        OverviewScenario::Healthy => PageState {
            conclusion: "你的 API 使用情况正常。",
            conclusion_tone: "healthy",
            primary_label: "浏览模型",
            primary_href: "/buyer/marketplace",
            metrics: healthy_metrics("$128.50", "余额充足", "healthy", "预计可使用约 9 天"),
            attention: None,
            show_onboarding: false,
            show_models: true,
            show_activity: true,
        },
        OverviewScenario::LowBalance => PageState {
            conclusion: "账户余额偏低。",
            conclusion_tone: "warning",
            primary_label: "立即充值",
            primary_href: "/buyer/billing",
            metrics: healthy_metrics("$18.42", "余额偏低", "warning", "按当前用量预计不足 2 天"),
            attention: Some(Attention {
                title: "余额可能在 48 小时内用尽",
                description: "届时新的 API 请求可能受限。BurnCloud 会继续监控消耗，你需要补充余额以保持服务连续。",
                action: "充值余额",
            }),
            show_onboarding: false,
            show_models: true,
            show_activity: true,
        },
        OverviewScenario::CriticalBalance => PageState {
            conclusion: "账户余额已进入临界状态。",
            conclusion_tone: "critical",
            primary_label: "立即充值",
            primary_href: "/buyer/billing",
            metrics: healthy_metrics("$4.12", "余额临界", "critical", "按当前用量预计不足 8 小时"),
            attention: Some(Attention {
                title: "余额即将用尽",
                description: "生产请求可能在今天内被暂停。BurnCloud 已发送余额提醒，你需要充值才能避免服务中断。",
                action: "立即充值",
            }),
            show_onboarding: false,
            show_models: true,
            show_activity: true,
        },
        OverviewScenario::Exhausted => PageState {
            conclusion: "账户余额已用尽。",
            conclusion_tone: "critical",
            primary_label: "恢复服务",
            primary_href: "/buyer/billing",
            metrics: [
                Metric {
                    label: "今日消费",
                    value: "$14.28",
                    detail: "截至今天 14:32",
                    status: None,
                },
                Metric {
                    label: "账户余额",
                    value: "$0.00",
                    detail: "请求保护已启用",
                    status: Some(("余额用尽", "critical")),
                },
                Metric {
                    label: "API 可用性",
                    value: "已暂停",
                    detail: "充值后可恢复请求",
                    status: Some(("需要处理", "critical")),
                },
                Metric {
                    label: "今日 Token",
                    value: "184 万",
                    detail: "62 万输入 · 122 万输出",
                    status: None,
                },
            ],
            attention: Some(Attention {
                title: "新的 API 请求已暂停",
                description: "余额不足触发了账户保护，现有数据不会受影响。完成充值后，BurnCloud 将自动恢复请求。",
                action: "充值并恢复",
            }),
            show_onboarding: false,
            show_models: true,
            show_activity: true,
        },
        OverviewScenario::Empty => PageState {
            conclusion: "你的工作区已准备好，可以开始首次调用。",
            conclusion_tone: "info",
            primary_label: "添加余额",
            primary_href: "/buyer/billing",
            metrics: [
                Metric {
                    label: "今日消费",
                    value: "暂无用量",
                    detail: "发送首次请求后显示",
                    status: None,
                },
                Metric {
                    label: "账户余额",
                    value: "尚未充值",
                    detail: "添加余额后即可调用",
                    status: Some(("待设置", "neutral")),
                },
                Metric {
                    label: "API 可用性",
                    value: "等待调用",
                    detail: "创建密钥后开始监控",
                    status: Some(("未检测", "neutral")),
                },
                Metric {
                    label: "今日 Token",
                    value: "暂无用量",
                    detail: "发送首次请求后显示",
                    status: None,
                },
            ],
            attention: None,
            show_onboarding: true,
            show_models: false,
            show_activity: false,
        },
        OverviewScenario::PartialFailure => PageState {
            conclusion: "部分用量数据暂时不可用。",
            conclusion_tone: "warning",
            primary_label: "查看调用日志",
            primary_href: "/buyer/logs",
            metrics: [
                Metric {
                    label: "今日消费",
                    value: "暂不可用",
                    detail: "账单数据正在重试",
                    status: Some(("数据延迟", "warning")),
                },
                Metric {
                    label: "账户余额",
                    value: "$128.50",
                    detail: "余额数据更新于 1 分钟前",
                    status: Some(("余额充足", "healthy")),
                },
                Metric {
                    label: "API 可用性",
                    value: "99.99%",
                    detail: "最近 24 小时",
                    status: Some(("服务正常", "healthy")),
                },
                Metric {
                    label: "今日 Token",
                    value: "暂不可用",
                    detail: "用量数据正在重试",
                    status: Some(("数据延迟", "warning")),
                },
            ],
            attention: None,
            show_onboarding: false,
            show_models: true,
            show_activity: true,
        },
        OverviewScenario::Unknown => PageState {
            conclusion: "暂时无法确认账户使用状态。",
            conclusion_tone: "critical",
            primary_label: "重新加载",
            primary_href: "/buyer/overview",
            metrics: [
                Metric {
                    label: "今日消费",
                    value: "未知",
                    detail: "账单数据无法确认",
                    status: Some(("不可用", "critical")),
                },
                Metric {
                    label: "账户余额",
                    value: "未知",
                    detail: "不会将未知余额显示为零",
                    status: Some(("不可用", "critical")),
                },
                Metric {
                    label: "API 可用性",
                    value: "未知",
                    detail: "服务状态无法确认",
                    status: Some(("不可用", "critical")),
                },
                Metric {
                    label: "今日 Token",
                    value: "未知",
                    detail: "用量数据无法确认",
                    status: Some(("不可用", "critical")),
                },
            ],
            attention: Some(Attention {
                title: "关键账户数据暂时无法获取",
                description: "余额与服务状态目前无法确认。BurnCloud 未将未知状态判定为正常，请重新加载后再决定是否继续调用。",
                action: "前往账单",
            }),
            show_onboarding: false,
            show_models: false,
            show_activity: false,
        },
        OverviewScenario::Loading => unreachable!("loading has a dedicated renderer"),
    }
}

fn healthy_metrics(
    balance: &'static str,
    balance_status: &'static str,
    balance_tone: &'static str,
    balance_detail: &'static str,
) -> [Metric<'static>; 4] {
    [
        Metric {
            label: "今日消费",
            value: "$14.28",
            detail: "比昨天同期高 8.4%",
            status: None,
        },
        Metric {
            label: "账户余额",
            value: balance,
            detail: balance_detail,
            status: Some((balance_status, balance_tone)),
        },
        Metric {
            label: "API 可用性",
            value: "99.99%",
            detail: "最近 24 小时",
            status: Some(("服务正常", "healthy")),
        },
        Metric {
            label: "今日 Token",
            value: "184 万",
            detail: "62 万输入 · 122 万输出",
            status: None,
        },
    ]
}

fn conclusion_detail(scenario: OverviewScenario) -> &'static str {
    match scenario {
        OverviewScenario::Healthy => "余额与服务状态均正常，目前无需处理。",
        OverviewScenario::LowBalance => "API 仍可正常调用，但建议尽快充值。",
        OverviewScenario::CriticalBalance => "生产请求存在中断风险，需要现在处理。",
        OverviewScenario::Exhausted => "新的请求已暂停，充值后将自动恢复。",
        OverviewScenario::Empty => "添加余额、选择模型并创建密钥即可开始。",
        OverviewScenario::PartialFailure => "已确认余额和服务正常，其余数据正在重试。",
        OverviewScenario::Unknown => "关键数据不可用，页面不会用零值或正常状态代替。",
        OverviewScenario::Loading => "",
    }
}

fn render_metric(metric: &Metric<'_>) -> String {
    let status = metric.status.map_or_else(String::new, |(label, tone)| {
        format!(
            r#"<span class="status {}"><span></span>{}</span>"#,
            tone, label
        )
    });

    format!(
        r#"<article class="metric"><div class="metric-label"><span>{}</span>{}</div><strong>{}</strong><p>{}</p></article>"#,
        metric.label, status, metric.value, metric.detail,
    )
}

fn render_models() -> &'static str {
    r#"<section class="content-section" aria-labelledby="models-title">
      <div class="section-header"><div><p class="section-kicker">当前服务</p><h2 id="models-title">正在使用的模型</h2><p>今日产生调用的主要模型与服务状态。</p></div><a class="text-link" href="/buyer/marketplace">查看全部模型 <span aria-hidden="true">→</span></a></div>
      <div class="table-wrap"><table><thead><tr><th>模型</th><th>服务等级</th><th>今日 Token</th><th>今日费用</th><th>服务状态</th><th><span class="sr-only">操作</span></th></tr></thead><tbody>
        <tr><td data-label="模型"><span class="model-mark">D</span><span><strong>DeepSeek V3</strong><small>DeepSeek</small></span></td><td data-label="服务等级"><span class="tier">标准</span></td><td data-label="今日 Token">112.04 万</td><td data-label="今日费用">$8.20</td><td data-label="服务状态"><span class="status healthy"><span></span>服务正常</span></td><td><a class="row-action" href="/buyer/playground">测试</a></td></tr>
        <tr><td data-label="模型"><span class="model-mark">R</span><span><strong>DeepSeek R1</strong><small>DeepSeek</small></span></td><td data-label="服务等级"><span class="tier performance">性能</span></td><td data-label="今日 Token">41.02 万</td><td data-label="今日费用">$4.90</td><td data-label="服务状态"><span class="status healthy"><span></span>服务正常</span></td><td><a class="row-action" href="/buyer/playground">测试</a></td></tr>
        <tr><td data-label="模型"><span class="model-mark">Q</span><span><strong>Qwen 2.5 72B</strong><small>Qwen</small></span></td><td data-label="服务等级"><span class="tier">标准</span></td><td data-label="今日 Token">31.00 万</td><td data-label="今日费用">$1.18</td><td data-label="服务状态"><span class="status healthy"><span></span>服务正常</span></td><td><a class="row-action" href="/buyer/playground">测试</a></td></tr>
      </tbody></table></div>
    </section>"#
}

fn render_activity() -> &'static str {
    r#"<section class="content-section" aria-labelledby="activity-title">
      <div class="section-header"><div><p class="section-kicker">账户摘要</p><h2 id="activity-title">最近动态</h2><p>与账户和服务连续性相关的重要事件。</p></div><a class="text-link" href="/buyer/logs">查看调用日志 <span aria-hidden="true">→</span></a></div>
      <ol class="activity-list">
        <li><span class="activity-icon success" aria-hidden="true">$</span><div><strong>充值 $100.00 已到账</strong><p>账户余额已更新，收据可在账单页查看。</p></div><time datetime="2026-08-25T14:20:00+08:00">12 分钟前</time></li>
        <li><span class="activity-icon info" aria-hidden="true">↗</span><div><strong>服务已自动恢复</strong><p>BurnCloud 已将流量切换到健康容量，无需你处理。</p></div><time datetime="2026-08-25T13:32:00+08:00">1 小时前</time></li>
        <li><span class="activity-icon" aria-hidden="true">K</span><div><strong>已创建生产环境 API 密钥</strong><p>密钥已启用，可调用标准与性能等级。</p></div><time datetime="2026-08-24">昨天</time></li>
      </ol>
    </section>"#
}

fn render_onboarding() -> &'static str {
    r#"<section class="onboarding" aria-labelledby="onboarding-title"><div><p class="section-kicker">开始使用</p><h2 id="onboarding-title">完成首次 API 调用</h2><p>你的工作区还没有用量记录。按顺序完成以下设置。</p></div><ol><li><span>1</span><strong>添加账户余额</strong><small>用于支付模型调用</small></li><li><span>2</span><strong>选择模型</strong><small>按成本与性能选择</small></li><li><span>3</span><strong>创建 API 密钥</strong><small>安全连接你的应用</small></li><li><span>4</span><strong>发送首次请求</strong><small>开始生成用量数据</small></li></ol></section>"#
}

fn render_loading() -> String {
    let metrics = (0..4).map(|_| r#"<div class="metric skeleton-card"><span class="skeleton short"></span><span class="skeleton value"></span><span class="skeleton medium"></span></div>"#).collect::<String>();
    format!(
        r#"<header class="page-header"><div class="page-heading"><p class="eyebrow">BUYER WORKSPACE</p><h1>概览</h1><p>查看今日用量、账户余额与 API 服务状态。</p></div></header><section class="conclusion loading" aria-live="polite" aria-busy="true"><span class="skeleton icon"></span><div><span class="skeleton medium"></span><span class="skeleton long"></span></div><span class="sr-only">正在加载账户使用状态</span></section><section class="metrics" aria-label="正在加载今日核心指标" aria-busy="true">{metrics}</section><section class="content-section loading-section"><span class="skeleton medium"></span><span class="skeleton long"></span><div class="skeleton block"></div></section>"#
    )
}

fn render_shell(content: String, scenario: OverviewScenario) -> String {
    let notification = if matches!(
        scenario,
        OverviewScenario::LowBalance
            | OverviewScenario::CriticalBalance
            | OverviewScenario::Exhausted
            | OverviewScenario::Unknown
    ) {
        format!(
            r##"<a class="notification" href="#attention" aria-label="1 条需要处理的通知">{}<span></span></a>"##,
            icon("bell")
        )
    } else {
        format!(
            r#"<a class="notification" href="/buyer/overview" aria-label="通知">{}</a>"#,
            icon("bell")
        )
    };

    format!(
        r##"<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="BurnCloud Buyer API 用量与账户概览"><title>Buyer Overview - BurnCloud</title><link rel="stylesheet" href="/assets/styles.css"><script src="/assets/app.js" defer></script></head><body>
        <div class="app-shell"><button class="mobile-menu" type="button" aria-label="打开导航" aria-controls="sidebar" aria-expanded="false">{}</button>{}<div class="sidebar-backdrop" data-close-sidebar></div>
        <div class="main-column"><header class="topbar"><button class="topbar-menu" type="button" aria-label="打开导航" aria-controls="sidebar" aria-expanded="false">{}</button><div class="topbar-spacer"></div><div class="autopilot"><span></span>Autopilot 已启用</div>{}<div class="profile"><span>BY</span><div><strong>burncloud.com</strong><small>Buyer</small></div></div></header><main id="main-content" tabindex="-1"><div class="page-wrap">{}</div></main></div></div></body></html>"##,
        icon("menu"),
        render_sidebar(scenario),
        icon("menu"),
        notification,
        content,
    )
}

fn render_sidebar(scenario: OverviewScenario) -> String {
    let nav = [
        ("概览", "/buyer/overview", "layout", true),
        ("操练场", "/buyer/playground", "terminal", false),
        ("模型市场", "/buyer/marketplace", "store", false),
        ("API 密钥", "/buyer/api-keys", "key", false),
        ("用量分析", "/buyer/usage", "chart", false),
        ("账单与余额", "/buyer/billing", "card", false),
        ("调用日志", "/buyer/logs", "logs", false),
    ];
    let links = nav
        .iter()
        .map(|(label, href, icon_name, active)| {
            format!(
                r#"<a href="{}"{}>{}<span>{}</span></a>"#,
                href,
                if *active {
                    " class=\"active\" aria-current=\"page\""
                } else {
                    ""
                },
                icon(icon_name),
                label
            )
        })
        .collect::<String>();
    let (balance, service, tone) = match scenario {
        OverviewScenario::LowBalance => ("$18.42", "余额偏低", "warning"),
        OverviewScenario::CriticalBalance => ("$4.12", "余额临界", "critical"),
        OverviewScenario::Exhausted => ("$0.00", "请求已暂停", "critical"),
        OverviewScenario::Empty => ("尚未充值", "等待首次调用", "neutral"),
        OverviewScenario::Unknown => ("未知", "状态无法确认", "neutral"),
        OverviewScenario::Loading => ("加载中", "正在检查状态", "neutral"),
        _ => ("$128.50", "API 服务正常", "healthy"),
    };
    format!(
        r#"<aside id="sidebar" class="sidebar"><div class="workspace"><div class="brand">{}<div><strong>BurnCloud</strong><small><span></span>Buyer 工作区</small></div></div><button type="button" class="sidebar-close" data-close-sidebar aria-label="关闭导航">{}</button></div><p class="mental-model">模型 → API → 用量 → 账单</p><nav aria-label="Buyer 导航">{}</nav><div class="sidebar-footer"><div><small>账户余额</small><strong>{}</strong><a href="/buyer/billing">充值</a></div><p class="{}"><span></span>{}</p></div></aside>"#,
        logo(),
        icon("x"),
        links,
        balance,
        tone,
        service
    )
}

fn logo() -> &'static str {
    r##"<svg class="logo" viewBox="0 0 24 24" aria-hidden="true"><path fill="#ed6a28" d="M17.8 10.1q-.6-.9-1.4-1.9S14.6 6.1 14.9 3c0 0-6.9 2.7-7 8.2 0 0-1-1.6-.8-4.6 0 0-2.2 2.1-2.5 5.5-2.1.7-3.8 2.5-3.8 4.3 0 2.5 2.7 4.6 5.9 4.6-2.4-.4-4.2-2-4.2-4 0-1.4.8-2.5 2-3.3q.1 1.1.5 2.4s1.2 3.8 5.4 4.8c1.2.3 2.5.2 3.7-.3 1.3-.6 2.8-1.8 2.8-4.5 0 0 .1-2.7-1.5-4.1 0 0 2.1 5-1.8 6.5-1.3.5-2.6.5-3.9 0-1.7-.7-3.8-2.5-3.5-7.2 0 0 1 3.4 3.2 4.7 0 0-2-5.8 3.9-9.8 0 0 .5 2.1 1.9 3.3.4.4 4 3.2 3.3 8 .7-.9 1.3-3.1.7-4.8 0 0-.1-.4-.4-.9 1.5.3 2.7 1.5 2.8 4.2.1 2.3-1.6 4.2-3.8 5 3-.4 5.4-2.7 5.4-5.6 0-2.8-2.2-5.1-5.4-5.3z"/></svg>"##
}

fn status_icon(tone: &str) -> &'static str {
    match tone {
        "healthy" => icon("check-circle"),
        "info" => icon("info"),
        "critical" => icon("alert-circle"),
        _ => icon("alert-triangle"),
    }
}

fn icon(name: &str) -> &'static str {
    match name {
        "menu" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>"#
        }
        "x" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>"#
        }
        "bell" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>"#
        }
        "layout" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>"#
        }
        "terminal" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 17 6-5-6-5M12 19h8"/></svg>"#
        }
        "store" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h18l-2-5H5L3 9Zm1 0v11h16V9M9 20v-6h6v6"/></svg>"#
        }
        "key" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/></svg>"#
        }
        "chart" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>"#
        }
        "card" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>"#
        }
        "logs" => {
            r#"<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6"/></svg>"#
        }
        "check-circle" => {
            r#"<svg class="state-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>"#
        }
        "info" => {
            r#"<svg class="state-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>"#
        }
        "alert-circle" => {
            r#"<svg class="state-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17h.01"/></svg>"#
        }
        "alert-triangle" => {
            r#"<svg class="state-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.3 3.8 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/></svg>"#
        }
        _ => "",
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_supported_scenarios_and_defaults_to_healthy() {
        assert_eq!(
            OverviewScenario::from_query(Some("state=low")),
            OverviewScenario::LowBalance
        );
        assert_eq!(
            OverviewScenario::from_query(Some("foo=bar&state=partial")),
            OverviewScenario::PartialFailure
        );
        assert_eq!(
            OverviewScenario::from_query(Some("state=invalid")),
            OverviewScenario::Healthy
        );
        assert_eq!(
            OverviewScenario::from_query(None),
            OverviewScenario::Healthy
        );
    }

    #[test]
    fn renders_metrics_in_contract_order() {
        let page = render_overview(OverviewScenario::Healthy);
        let metrics = page
            .split("<section class=\"metrics\"")
            .nth(1)
            .unwrap()
            .split("</section>")
            .next()
            .unwrap();
        let spend = metrics.find("今日消费").unwrap();
        let balance = metrics.find("账户余额").unwrap();
        let availability = metrics.find("API 可用性").unwrap();
        let tokens = metrics.find("今日 Token").unwrap();
        assert!(spend < balance && balance < availability && availability < tokens);
    }

    #[test]
    fn low_balance_promotes_top_up_and_shows_attention() {
        let page = render_overview(OverviewScenario::LowBalance);
        assert!(page.contains("账户余额偏低"));
        assert!(page.contains("id=\"attention\""));
        assert!(page.contains("class=\"button primary\" href=\"/buyer/billing\""));
    }

    #[test]
    fn unknown_values_are_not_presented_as_zero_or_healthy() {
        let page = render_overview(OverviewScenario::Unknown);
        let metrics = page
            .split("<section class=\"metrics\"")
            .nth(1)
            .unwrap()
            .split("</section>")
            .next()
            .unwrap();
        assert!(!metrics.contains("$0.00"));
        assert!(!metrics.contains("服务正常"));
        assert!(metrics.matches("value: \"未知\"").count() == 0);
        assert!(metrics.contains(">未知<"));
    }

    #[test]
    fn new_buyer_gets_onboarding_instead_of_zero_dashboard() {
        let page = render_overview(OverviewScenario::Empty);
        assert!(page.contains("完成首次 API 调用"));
        assert!(page.contains("添加余额"));
        assert!(!page.contains("$0.00"));
        assert!(!page.contains("正在使用的模型"));
    }

    #[test]
    fn buyer_page_does_not_expose_infrastructure_terms() {
        let page = render_overview(OverviewScenario::Healthy);
        for forbidden in ["GPU", "Supplier", "IDC", "Worker ID", "调度评分"] {
            assert!(
                !page.contains(forbidden),
                "found forbidden term: {forbidden}"
            );
        }
    }
}
