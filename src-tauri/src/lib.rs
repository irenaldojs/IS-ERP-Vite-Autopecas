mod db;
mod models;
mod product_repository;
mod commands;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            db::init_db(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            commands::criar_produto,
            commands::atualizar_produto,
            commands::deletar_produto,
            commands::buscar_produto,
            commands::listar_produtos,
            commands::criar_categoria,
            commands::listar_categorias,
            commands::criar_grupo,
            commands::listar_grupos,
            commands::criar_fabricante,
            commands::listar_fabricantes,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

