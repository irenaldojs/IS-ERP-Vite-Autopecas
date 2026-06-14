use tauri::AppHandle;
use crate::models::*;
use crate::db::{get_connection, log_error};
use crate::product_repository::ProductRepository;
use rusqlite::params;

fn handle_db_op<T, F>(app_handle: &AppHandle, contexto: &str, query: Option<&str>, op: F) -> Result<T, String>
where
    F: FnOnce() -> Result<T, String>,
{
    op().map_err(|e| {
        let _ = log_error(app_handle, contexto, query, &e);
        e
    })
}

#[tauri::command]
pub fn criar_produto(app_handle: AppHandle, produto: Produto) -> Result<i64, String> {
    handle_db_op(&app_handle, "criar_produto", Some("INSERT INTO produto / TRANSACTION"), || {
        let mut conn = get_connection(&app_handle)?;
        ProductRepository::insert_produto(&mut conn, produto)
    })
}

#[tauri::command]
pub fn atualizar_produto(app_handle: AppHandle, produto: Produto) -> Result<(), String> {
    handle_db_op(&app_handle, "atualizar_produto", Some("UPDATE produto / TRANSACTION"), || {
        let mut conn = get_connection(&app_handle)?;
        ProductRepository::update_produto(&mut conn, produto)
    })
}

#[tauri::command]
pub fn deletar_produto(app_handle: AppHandle, id: i64) -> Result<(), String> {
    handle_db_op(&app_handle, "deletar_produto", Some("DELETE FROM produto WHERE id = ?"), || {
        let mut conn = get_connection(&app_handle)?;
        ProductRepository::delete_produto(&mut conn, id)
    })
}

#[tauri::command]
pub fn buscar_produto(app_handle: AppHandle, id: i64) -> Result<Option<Produto>, String> {
    handle_db_op(&app_handle, "buscar_produto", Some("SELECT FROM produto WHERE id = ?"), || {
        let conn = get_connection(&app_handle)?;
        ProductRepository::get_produto_by_id(&conn, id)
    })
}

#[tauri::command]
pub fn listar_produtos(app_handle: AppHandle, query_search: Option<String>) -> Result<Vec<Produto>, String> {
    handle_db_op(&app_handle, "listar_produtos", Some("SELECT FROM produto WHERE ..."), || {
        let conn = get_connection(&app_handle)?;
        ProductRepository::list_produtos(&conn, query_search)
    })
}

// Comandos auxiliares

#[tauri::command]
pub fn criar_categoria(app_handle: AppHandle, descricao: String) -> Result<i64, String> {
    handle_db_op(&app_handle, "criar_categoria", Some("INSERT INTO produto_categoria"), || {
        let conn = get_connection(&app_handle)?;
        conn.execute(
            "INSERT INTO produto_categoria (descricao) VALUES (?1)",
            params![descricao],
        )
        .map_err(|e| e.to_string())?;
        Ok(conn.last_insert_rowid())
    })
}

#[tauri::command]
pub fn listar_categorias(app_handle: AppHandle) -> Result<Vec<ProdutoCategoria>, String> {
    handle_db_op(&app_handle, "listar_categorias", Some("SELECT FROM produto_categoria"), || {
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
    })
}

#[tauri::command]
pub fn criar_grupo(
    app_handle: AppHandle,
    categoria_id: i64,
    grupo_parent_id: Option<i64>,
    descricao: Option<String>,
) -> Result<i64, String> {
    handle_db_op(&app_handle, "criar_grupo", Some("INSERT INTO produto_grupo"), || {
        let conn = get_connection(&app_handle)?;
        conn.execute(
            "INSERT INTO produto_grupo (categoria_id, grupo_parent_id, descricao) VALUES (?1, ?2, ?3)",
            params![categoria_id, grupo_parent_id, descricao],
        )
        .map_err(|e| e.to_string())?;
        Ok(conn.last_insert_rowid())
    })
}

#[tauri::command]
pub fn listar_grupos(app_handle: AppHandle) -> Result<Vec<ProdutoGrupo>, String> {
    handle_db_op(&app_handle, "listar_grupos", Some("SELECT FROM produto_grupo"), || {
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
    })
}

#[tauri::command]
pub fn criar_fabricante(app_handle: AppHandle, nome: String) -> Result<i64, String> {
    handle_db_op(&app_handle, "criar_fabricante", Some("INSERT INTO produto_fabricante"), || {
        let conn = get_connection(&app_handle)?;
        conn.execute(
            "INSERT INTO produto_fabricante (nome) VALUES (?1)",
            params![nome],
        )
        .map_err(|e| e.to_string())?;
        Ok(conn.last_insert_rowid())
    })
}

#[tauri::command]
pub fn listar_fabricantes(app_handle: AppHandle) -> Result<Vec<ProdutoFabricante>, String> {
    handle_db_op(&app_handle, "listar_fabricantes", Some("SELECT FROM produto_fabricante"), || {
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
    })
}

#[tauri::command]
pub fn atualizar_categoria(app_handle: AppHandle, id: i64, descricao: String) -> Result<(), String> {
    handle_db_op(&app_handle, "atualizar_categoria", Some("UPDATE produto_categoria"), || {
        let conn = get_connection(&app_handle)?;
        conn.execute(
            "UPDATE produto_categoria SET descricao = ?1 WHERE id = ?2",
            params![descricao, id],
        )
        .map_err(|e| e.to_string())?;
        Ok(())
    })
}

#[tauri::command]
pub fn atualizar_grupo(
    app_handle: AppHandle,
    id: i64,
    categoria_id: i64,
    grupo_parent_id: Option<i64>,
    descricao: Option<String>,
) -> Result<(), String> {
    handle_db_op(&app_handle, "atualizar_grupo", Some("UPDATE produto_grupo"), || {
        let conn = get_connection(&app_handle)?;
        conn.execute(
            "UPDATE produto_grupo SET categoria_id = ?1, grupo_parent_id = ?2, descricao = ?3 WHERE id = ?4",
            params![categoria_id, grupo_parent_id, descricao, id],
        )
        .map_err(|e| e.to_string())?;
        Ok(())
    })
}

#[tauri::command]
pub fn atualizar_fabricante(app_handle: AppHandle, id: i64, nome: String) -> Result<(), String> {
    handle_db_op(&app_handle, "atualizar_fabricante", Some("UPDATE produto_fabricante"), || {
        let conn = get_connection(&app_handle)?;
        conn.execute(
            "UPDATE produto_fabricante SET nome = ?1 WHERE id = ?2",
            params![nome, id],
        )
        .map_err(|e| e.to_string())?;
        Ok(())
    })
}

#[tauri::command]
pub fn listar_logs(app_handle: AppHandle) -> Result<Vec<LogEntry>, String> {
    crate::db::obter_logs(&app_handle)
}

#[tauri::command]
pub fn limpar_logs(app_handle: AppHandle) -> Result<(), String> {
    crate::db::limpar_logs(&app_handle)
}
