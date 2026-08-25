mod overview;

use std::{env, net::SocketAddr};

use axum::{
    Router,
    http::{StatusCode, Uri, header},
    response::{Html, IntoResponse, Redirect},
    routing::get,
};
use overview::{OverviewScenario, render_overview};

const STYLES: &str = include_str!("../assets/styles.css");
const SCRIPT: &str = include_str!("../assets/app.js");

#[tokio::main]
async fn main() {
    let port = env::var("BURNCLOUD_UI_PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(3001);
    let address = SocketAddr::from(([127, 0, 0, 1], port));

    let listener = tokio::net::TcpListener::bind(address)
        .await
        .unwrap_or_else(|error| panic!("failed to bind BurnCloud UI at {address}: {error}"));

    println!("BurnCloud Rust UI: http://{address}/buyer/overview");
    axum::serve(listener, app())
        .await
        .expect("BurnCloud UI server stopped unexpectedly");
}

fn app() -> Router {
    Router::new()
        .route(
            "/",
            get(|| async { Redirect::temporary("/buyer/overview") }),
        )
        .route(
            "/buyer",
            get(|| async { Redirect::temporary("/buyer/overview") }),
        )
        .route("/buyer/overview", get(overview_page))
        .route("/assets/styles.css", get(styles))
        .route("/assets/app.js", get(script))
        .fallback(not_found)
}

async fn overview_page(uri: Uri) -> Html<String> {
    let scenario = OverviewScenario::from_query(uri.query());
    Html(render_overview(scenario))
}

async fn styles() -> impl IntoResponse {
    ([(header::CONTENT_TYPE, "text/css; charset=utf-8")], STYLES)
}

async fn script() -> impl IntoResponse {
    (
        [(header::CONTENT_TYPE, "text/javascript; charset=utf-8")],
        SCRIPT,
    )
}

async fn not_found() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        Html(
            r#"<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面尚未迁移 - BurnCloud</title><link rel="stylesheet" href="/assets/styles.css"><body><main class="standalone-message"><div><span class="eyebrow">RUST UI MIGRATION</span><h1>这个页面尚未迁移</h1><p>当前 Rust 版本已完成 Buyer Overview。其余页面会在后续迁移中接入。</p><a class="button primary" href="/buyer/overview">返回概览</a></div></main></body></html>"#,
        ),
    )
}
