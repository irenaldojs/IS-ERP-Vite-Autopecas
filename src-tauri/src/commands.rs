use tauri::AppHandle;
use crate::models::*;
use crate::db::get_connection;
use crate::product_repository::ProductRepository;
use rusqlite::params;

#[tauri::command]
pub fn criar_produto(app_handle: AppHandle, produto: Produto) -> Result<i64, String> {
    let mut conn = get_connection(&app_handle)?;
    ProductRepository::insert_produto(&mut conn, produto)
}

#[tauri::command]
pub fn atualizar_produto(app_handle: AppHandle, produto: Produto) -> Result<(), String> {
    let mut conn = get_connection(&app_handle)?;
    ProductRepository::update_produto(&mut conn, produto)
}

#[tauri::command]
pub fn deletar_produto(app_handle: AppHandle, id: i64) -> Result<(), String> {
    let mut conn = get_connection(&app_handle)?;
    ProductRepository::delete_produto(&mut conn, id)
}

#[tauri::command]
pub fn buscar_produto(app_handle: AppHandle, id: i64) -> Result<Option<Produto>, String> {
    let conn = get_connection(&app_handle)?;
    ProductRepository::get_produto_by_id(&conn, id)
}

#[tauri::command]
pub fn listar_produtos(app_handle: AppHandle, query_search: Option<String>) -> Result<Vec<Produto>, String> {
    let conn = get_connection(&app_handle)?;
    ProductRepository::list_produtos(&conn, query_search)
}

// Comandos auxiliares

#[tauri::command]
pub fn criar_categoria(app_handle: AppHandle, descricao: String) -> Result<i64, String> {
    let conn = get_connection(&app_handle)?;
    conn.execute(
        "INSERT INTO produto_categoria (descricao) VALUES (?1)",
        params![descricao],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn listar_categorias(app_handle: AppHandle) -> Result<Vec<ProdutoCategoria>, String> {
    let conn = get_connection(&app_handle)?;
    let mut stmt = conn.prepare("SELECT id, descricao FROM produto_categoria")
        .map_err(|e| e.to_string())?;
    
    let rows = stmt.query_map([], |row| {
        Ok(ProdutoCategoria {
            id: Some(row.get(0)?),
            descricao: row.get(1)?,
        })
    })
    .map_err(|e| e.to_string())?;

    let mut list = Vec::new();
    for r in rows {
        list.push(r.map_err(|e| e.to_string())?);
    }
    Ok(list)
}

#[tauri::command]
pub fn criar_grupo(
    app_handle: AppHandle,
    categoria_id: i64,
    grupo_parent_id: Option<i64>,
    descricao: Option<String>,
) -> Result<i64, String> {
    let conn = get_connection(&app_handle)?;
    conn.execute(
        "INSERT INTO produto_grupo (categoria_id, grupo_parent_id, descricao) VALUES (?1, ?2, ?3)",
        params![categoria_id, grupo_parent_id, descricao],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn listar_grupos(app_handle: AppHandle) -> Result<Vec<ProdutoGrupo>, String> {
    let conn = get_connection(&app_handle)?;
    let mut stmt = conn.prepare("SELECT id, categoria_id, grupo_parent_id, descricao FROM produto_grupo")
        .map_err(|e| e.to_string())?;
    
    let rows = stmt.query_map([], |row| {
        Ok(ProdutoGrupo {
            id: Some(row.get(0)?),
            categoria_id: row.get(1)?,
            grupo_parent_id: row.get(2)?,
            descricao: row.get(3)?,
        })
    })
    .map_err(|e| e.to_string())?;

    let mut list = Vec::new();
    for r in rows {
        list.push(r.map_err(|e| e.to_string())?);
    }
    Ok(list)
}

#[tauri::command]
pub fn criar_fabricante(app_handle: AppHandle, nome: String) -> Result<i64, String> {
    let conn = get_connection(&app_handle)?;
    conn.execute(
        "INSERT INTO produto_fabricante (nome) VALUES (?1)",
        params![nome],
    )
    .map_err(|e| e.to_string())?;
    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn listar_fabricantes(app_handle: AppHandle) -> Result<Vec<ProdutoFabricante>, String> {
    let conn = get_connection(&app_handle)?;
    let mut stmt = conn.prepare("SELECT id, nome FROM produto_fabricante")
        .map_err(|e| e.to_string())?;
    
    let rows = stmt.query_map([], |row| {
        Ok(ProdutoFabricante {
            id: Some(row.get(0)?),
            nome: row.get(1)?,
        })
    })
    .map_err(|e| e.to_string())?;

    let mut list = Vec::new();
    for r in rows {
        list.push(r.map_err(|e| e.to_string())?);
    }
    Ok(list)
}
