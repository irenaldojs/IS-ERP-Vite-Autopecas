use rusqlite::{Connection, Result};
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

pub fn get_db_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir).map_err(|e| e.to_string())?;
    }
    
    Ok(app_data_dir.join("is_erp.db"))
}

pub fn get_connection(app_handle: &AppHandle) -> Result<Connection, String> {
    let db_path = get_db_path(app_handle)?;
    Connection::open(db_path).map_err(|e| e.to_string())
}

pub fn init_db(app_handle: &AppHandle) -> Result<(), String> {
    let mut conn = get_connection(app_handle)?;
    
    // Habilitar chaves estrangeiras
    conn.execute("PRAGMA foreign_keys = ON;", [])
        .map_err(|e| e.to_string())?;

    let migrations = vec![
        r#"
        CREATE TABLE IF NOT EXISTS produto_categoria (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_grupo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria_id INTEGER NOT NULL REFERENCES produto_categoria(id),
            grupo_parent_id INTEGER REFERENCES produto_grupo(id) ON DELETE SET NULL,
            descricao TEXT
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_fabricante (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_aplicacao_lista (
            id INTEGER PRIMARY KEY AUTOINCREMENT
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS carro_montadora (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS carro_modelo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            montadora_id INTEGER NOT NULL REFERENCES carro_montadora(id) ON DELETE CASCADE,
            nome TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_aplicacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lista_id INTEGER NOT NULL REFERENCES produto_aplicacao_lista(id) ON DELETE CASCADE,
            modelo TEXT NOT NULL,
            ano_inicial INTEGER,
            ano_final INTEGER,
            detalhes TEXT
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS imagem (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url_imagem TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT NOT NULL UNIQUE,
            descricao TEXT,
            descricao_complementar TEXT,
            grupo_id INTEGER NOT NULL REFERENCES produto_grupo(id),
            marca_id INTEGER NOT NULL REFERENCES produto_fabricante(id),
            aplicacao_lista_id INTEGER REFERENCES produto_aplicacao_lista(id) ON DELETE SET NULL,
            codigo_original TEXT NOT NULL,
            referencia TEXT,
            codigo_barras TEXT,
            peso_liquido REAL,
            peso_bruto REAL,
            altura REAL,
            largura REAL,
            comprimento REAL,
            ativo INTEGER NOT NULL DEFAULT 1,
            criado_em TEXT NOT NULL,
            atualizado_em TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_imagem (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
            imagem_id INTEGER NOT NULL REFERENCES imagem(id) ON DELETE CASCADE
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_tipo_especificacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo_spec TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_especificacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
            tipo_id INTEGER NOT NULL REFERENCES produto_tipo_especificacao(id),
            especificacao TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_referencia (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
            fabricante_id INTEGER NOT NULL REFERENCES produto_fabricante(id),
            codigo_referencia TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_fiscal (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
            ncm TEXT NOT NULL,
            cest TEXT,
            origem_mercadoria INTEGER NOT NULL,
            csosn TEXT,
            cst_icms TEXT,
            cst_pis TEXT,
            cst_cofins TEXT,
            cst_ipi TEXT,
            aliquota_icms REAL,
            aliquota_icms_st REAL,
            aliquota_pis REAL,
            aliquota_cofins REAL,
            aliquota_ipi REAL,
            cfop_saida TEXT,
            cfop_entrada TEXT,
            criado_em TEXT NOT NULL,
            atualizado_em TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
            filial_id INTEGER NOT NULL,
            estoque_atual REAL NOT NULL DEFAULT 0,
            estoque_reservado REAL NOT NULL DEFAULT 0,
            estoque_disponivel REAL NOT NULL DEFAULT 0,
            estoque_minimo REAL NOT NULL DEFAULT 0,
            estoque_maximo REAL,
            controla_estoque INTEGER NOT NULL DEFAULT 1,
            rua TEXT,
            prateleira TEXT,
            nivel TEXT,
            posicao TEXT,
            atualizado_em TEXT NOT NULL
        );
        "#,
        r#"
        CREATE TABLE IF NOT EXISTS produto_preco (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL REFERENCES produto(id) ON DELETE CASCADE,
            custo_compra REAL NOT NULL DEFAULT 0,
            custo_impostos REAL NOT NULL DEFAULT 0,
            preco_venda REAL NOT NULL DEFAULT 0,
            simetria_preco REAL,
            margem_lucro REAL,
            markup REAL,
            preco_promocional REAL,
            promocao_inicio TEXT,
            promocao_fim TEXT,
            atualizado_em TEXT NOT NULL
        );
        "#,
        // Índices
        "CREATE INDEX IF NOT EXISTS idx_produto_codigo ON produto(codigo);",
        "CREATE INDEX IF NOT EXISTS idx_produto_codigo_barras ON produto(codigo_barras);",
        "CREATE INDEX IF NOT EXISTS idx_produto_grupo_id ON produto(grupo_id);",
        "CREATE INDEX IF NOT EXISTS idx_produto_marca_id ON produto(marca_id);",
        "CREATE INDEX IF NOT EXISTS idx_produto_estoque_produto_id ON produto_estoque(produto_id);",
        "CREATE INDEX IF NOT EXISTS idx_produto_preco_produto_id ON produto_preco(produto_id);",
    ];

    let tx = conn.transaction().map_err(|e| e.to_string())?;
    for migration in migrations {
        tx.execute(migration, []).map_err(|e| e.to_string())?;
    }
    tx.commit().map_err(|e| e.to_string())?;

    Ok(())
}
