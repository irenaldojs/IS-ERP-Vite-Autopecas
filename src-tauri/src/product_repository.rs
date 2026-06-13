use rusqlite::{params, Connection, Result};
use crate::models::*;
use chrono::Utc;

pub struct ProductRepository;

impl ProductRepository {
    pub fn insert_produto(conn: &mut Connection, produto: Produto) -> Result<i64, String> {
        let now = Utc::now().to_rfc3339();
        
        let tx = conn.transaction().map_err(|e| e.to_string())?;

        // 1. Criar lista de aplicação se necessário
        let mut aplicacao_lista_id = produto.aplicacao_lista_id;
        if aplicacao_lista_id.is_none() && produto.aplicacoes.is_some() {
            tx.execute("INSERT INTO produto_aplicacao_lista DEFAULT VALUES", [])
                .map_err(|e| e.to_string())?;
            aplicacao_lista_id = Some(tx.last_insert_rowid());
        }

        // 2. Inserir produto base
        tx.execute(
            "INSERT INTO produto (
                codigo, descricao, descricao_complementar, grupo_id, marca_id, aplicacao_lista_id,
                codigo_original, referencia, codigo_barras, peso_liquido, peso_bruto,
                altura, largura, comprimento, ativo, criado_em, atualizado_em
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)",
            params![
                produto.codigo,
                produto.descricao,
                produto.descricao_complementar,
                produto.grupo_id,
                produto.marca_id,
                aplicacao_lista_id,
                produto.codigo_original,
                produto.referencia,
                produto.codigo_barras,
                produto.peso_liquido,
                produto.peso_bruto,
                produto.altura,
                produto.largura,
                produto.comprimento,
                if produto.ativo { 1 } else { 0 },
                now,
                now
            ],
        ).map_err(|e| e.to_string())?;

        let produto_id = tx.last_insert_rowid();

        // 3. Inserir Preço
        if let Some(preco) = produto.preco {
            tx.execute(
                "INSERT INTO produto_preco (
                    produto_id, custo_compra, custo_impostos, preco_venda, simetria_preco,
                    margem_lucro, markup, preco_promocional, promocao_inicio, promocao_fim, atualizado_em
                ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
                params![
                    produto_id,
                    preco.custo_compra,
                    preco.custo_impostos,
                    preco.preco_venda,
                    preco.simetria_preco,
                    preco.margem_lucro,
                    preco.markup,
                    preco.preco_promocional,
                    preco.promocao_inicio,
                    preco.promocao_fim,
                    now
                ],
            ).map_err(|e| e.to_string())?;
        }

        // 4. Inserir Estoques
        if let Some(estoques) = produto.estoque {
            for est in estoques {
                tx.execute(
                    "INSERT INTO produto_estoque (
                        produto_id, filial_id, estoque_atual, estoque_reservado, estoque_disponivel,
                        estoque_minimo, estoque_maximo, controla_estoque, rua, prateleira, nivel, posicao, atualizado_em
                    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
                    params![
                        produto_id,
                        est.filial_id,
                        est.estoque_atual,
                        est.estoque_reservado,
                        est.estoque_disponivel,
                        est.estoque_minimo,
                        est.estoque_maximo,
                        if est.controla_estoque { 1 } else { 0 },
                        est.rua,
                        est.prateleira,
                        est.nivel,
                        est.posicao,
                        now
                    ],
                ).map_err(|e| e.to_string())?;
            }
        }

        // 5. Inserir Fiscal
        if let Some(fiscal) = produto.fiscal {
            tx.execute(
                "INSERT INTO produto_fiscal (
                    produto_id, ncm, cest, origem_mercadoria, csosn, cst_icms, cst_pis, cst_cofins, cst_ipi,
                    aliquota_icms, aliquota_icms_st, aliquota_pis, aliquota_cofins, aliquota_ipi,
                    cfop_saida, cfop_entrada, criado_em, atualizado_em
                ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)",
                params![
                    produto_id,
                    fiscal.ncm,
                    fiscal.cest,
                    fiscal.origem_mercadoria,
                    fiscal.csosn,
                    fiscal.cst_icms,
                    fiscal.cst_pis,
                    fiscal.cst_cofins,
                    fiscal.cst_ipi,
                    fiscal.aliquota_icms,
                    fiscal.aliquota_icms_st,
                    fiscal.aliquota_pis,
                    fiscal.aliquota_cofins,
                    fiscal.aliquota_ipi,
                    fiscal.cfop_saida,
                    fiscal.cfop_entrada,
                    now,
                    now
                ],
            ).map_err(|e| e.to_string())?;
        }

        // 6. Inserir Especificações
        if let Some(specs) = produto.especificacoes {
            for spec in specs {
                tx.execute(
                    "INSERT INTO produto_especificacao (produto_id, tipo_id, especificacao) VALUES (?1, ?2, ?3)",
                    params![produto_id, spec.tipo_id, spec.especificacao],
                ).map_err(|e| e.to_string())?;
            }
        }

        // 7. Inserir Referências
        if let Some(refs) = produto.referencias {
            for r in refs {
                tx.execute(
                    "INSERT INTO produto_referencia (produto_id, fabricante_id, codigo_referencia) VALUES (?1, ?2, ?3)",
                    params![produto_id, r.fabricante_id, r.codigo_referencia],
                ).map_err(|e| e.to_string())?;
            }
        }

        // 8. Inserir Aplicações
        if let Some(app_id) = aplicacao_lista_id {
            if let Some(apps) = produto.aplicacoes {
                for app in apps {
                    tx.execute(
                        "INSERT INTO produto_aplicacao (lista_id, modelo, ano_inicial, ano_final, detalhes) VALUES (?1, ?2, ?3, ?4, ?5)",
                        params![app_id, app.modelo, app.ano_inicial, app.ano_final, app.detalhes],
                    ).map_err(|e| e.to_string())?;
                }
            }
        }

        // 9. Inserir Imagens
        if let Some(imgs) = produto.imagens {
            for img in imgs {
                let img_id = if let Some(id) = img.id {
                    id
                } else {
                    tx.execute("INSERT INTO imagem (url_imagem) VALUES (?1)", params![img.url_imagem])
                        .map_err(|e| e.to_string())?;
                    tx.last_insert_rowid()
                };

                tx.execute(
                    "INSERT INTO produto_imagem (produto_id, imagem_id) VALUES (?1, ?2)",
                    params![produto_id, img_id],
                ).map_err(|e| e.to_string())?;
            }
        }

        tx.commit().map_err(|e| e.to_string())?;

        Ok(produto_id)
    }

    pub fn update_produto(conn: &mut Connection, produto: Produto) -> Result<(), String> {
        let id = produto.id.ok_or_else(|| "ID do produto é obrigatório para atualização".to_string())?;
        let now = Utc::now().to_rfc3339();

        let tx = conn.transaction().map_err(|e| e.to_string())?;

        // 1. Atualizar produto base
        tx.execute(
            "UPDATE produto SET 
                codigo = ?1, descricao = ?2, descricao_complementar = ?3, grupo_id = ?4, marca_id = ?5,
                codigo_original = ?6, referencia = ?7, codigo_barras = ?8, peso_liquido = ?9, peso_bruto = ?10,
                altura = ?11, largura = ?12, comprimento = ?13, ativo = ?14, atualizado_em = ?15
             WHERE id = ?16",
            params![
                produto.codigo,
                produto.descricao,
                produto.descricao_complementar,
                produto.grupo_id,
                produto.marca_id,
                produto.codigo_original,
                produto.referencia,
                produto.codigo_barras,
                produto.peso_liquido,
                produto.peso_bruto,
                produto.altura,
                produto.largura,
                produto.comprimento,
                if produto.ativo { 1 } else { 0 },
                now,
                id
            ],
        ).map_err(|e| e.to_string())?;

        // 2. Atualizar Preço (apaga e reinsere ou atualiza)
        tx.execute("DELETE FROM produto_preco WHERE produto_id = ?1", params![id]).map_err(|e| e.to_string())?;
        if let Some(preco) = produto.preco {
            tx.execute(
                "INSERT INTO produto_preco (
                    produto_id, custo_compra, custo_impostos, preco_venda, simetria_preco,
                    margem_lucro, markup, preco_promocional, promocao_inicio, promocao_fim, atualizado_em
                ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
                params![
                    id,
                    preco.custo_compra,
                    preco.custo_impostos,
                    preco.preco_venda,
                    preco.simetria_preco,
                    preco.margem_lucro,
                    preco.markup,
                    preco.preco_promocional,
                    preco.promocao_inicio,
                    preco.promocao_fim,
                    now
                ],
            ).map_err(|e| e.to_string())?;
        }

        // 3. Atualizar Estoques
        tx.execute("DELETE FROM produto_estoque WHERE produto_id = ?1", params![id]).map_err(|e| e.to_string())?;
        if let Some(estoques) = produto.estoque {
            for est in estoques {
                tx.execute(
                    "INSERT INTO produto_estoque (
                        produto_id, filial_id, estoque_atual, estoque_reservado, estoque_disponivel,
                        estoque_minimo, estoque_maximo, controla_estoque, rua, prateleira, nivel, posicao, atualizado_em
                    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
                    params![
                        id,
                        est.filial_id,
                        est.estoque_atual,
                        est.estoque_reservado,
                        est.estoque_disponivel,
                        est.estoque_minimo,
                        est.estoque_maximo,
                        if est.controla_estoque { 1 } else { 0 },
                        est.rua,
                        est.prateleira,
                        est.nivel,
                        est.posicao,
                        now
                    ],
                ).map_err(|e| e.to_string())?;
            }
        }

        // 4. Atualizar Fiscal
        tx.execute("DELETE FROM produto_fiscal WHERE produto_id = ?1", params![id]).map_err(|e| e.to_string())?;
        if let Some(fiscal) = produto.fiscal {
            tx.execute(
                "INSERT INTO produto_fiscal (
                    produto_id, ncm, cest, origem_mercadoria, csosn, cst_icms, cst_pis, cst_cofins, cst_ipi,
                    aliquota_icms, aliquota_icms_st, aliquota_pis, aliquota_cofins, aliquota_ipi,
                    cfop_saida, cfop_entrada, criado_em, atualizado_em
                ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18)",
                params![
                    id,
                    fiscal.ncm,
                    fiscal.cest,
                    fiscal.origem_mercadoria,
                    fiscal.csosn,
                    fiscal.cst_icms,
                    fiscal.cst_pis,
                    fiscal.cst_cofins,
                    fiscal.cst_ipi,
                    fiscal.aliquota_icms,
                    fiscal.aliquota_icms_st,
                    fiscal.aliquota_pis,
                    fiscal.aliquota_cofins,
                    fiscal.aliquota_ipi,
                    fiscal.cfop_saida,
                    fiscal.cfop_entrada,
                    fiscal.criado_em.unwrap_or(now.clone()),
                    now
                ],
            ).map_err(|e| e.to_string())?;
        }

        // 5. Atualizar Especificações
        tx.execute("DELETE FROM produto_especificacao WHERE produto_id = ?1", params![id]).map_err(|e| e.to_string())?;
        if let Some(specs) = produto.especificacoes {
            for spec in specs {
                tx.execute(
                    "INSERT INTO produto_especificacao (produto_id, tipo_id, especificacao) VALUES (?1, ?2, ?3)",
                    params![id, spec.tipo_id, spec.especificacao],
                ).map_err(|e| e.to_string())?;
            }
        }

        // 6. Atualizar Referências
        tx.execute("DELETE FROM produto_referencia WHERE produto_id = ?1", params![id]).map_err(|e| e.to_string())?;
        if let Some(refs) = produto.referencias {
            for r in refs {
                tx.execute(
                    "INSERT INTO produto_referencia (produto_id, fabricante_id, codigo_referencia) VALUES (?1, ?2, ?3)",
                    params![id, r.fabricante_id, r.codigo_referencia],
                ).map_err(|e| e.to_string())?;
            }
        }

        // 7. Atualizar Aplicações (Se houver lista associada)
        if let Some(app_id) = produto.aplicacao_lista_id {
            tx.execute("DELETE FROM produto_aplicacao WHERE lista_id = ?1", params![app_id]).map_err(|e| e.to_string())?;
            if let Some(apps) = produto.aplicacoes {
                for app in apps {
                    tx.execute(
                        "INSERT INTO produto_aplicacao (lista_id, modelo, ano_inicial, ano_final, detalhes) VALUES (?1, ?2, ?3, ?4, ?5)",
                        params![app_id, app.modelo, app.ano_inicial, app.ano_final, app.detalhes],
                    ).map_err(|e| e.to_string())?;
                }
            }
        } else if produto.aplicacoes.is_some() {
            // Se não tinha lista mas agora tem aplicações, cria uma lista
            tx.execute("INSERT INTO produto_aplicacao_lista DEFAULT VALUES", [])
                .map_err(|e| e.to_string())?;
            let new_list_id = tx.last_insert_rowid();

            tx.execute(
                "UPDATE produto SET aplicacao_lista_id = ?1 WHERE id = ?2",
                params![new_list_id, id],
            ).map_err(|e| e.to_string())?;

            if let Some(apps) = produto.aplicacoes {
                for app in apps {
                    tx.execute(
                        "INSERT INTO produto_aplicacao (lista_id, modelo, ano_inicial, ano_final, detalhes) VALUES (?1, ?2, ?3, ?4, ?5)",
                        params![new_list_id, app.modelo, app.ano_inicial, app.ano_final, app.detalhes],
                    ).map_err(|e| e.to_string())?;
                }
            }
        }

        // 8. Atualizar Imagens
        tx.execute("DELETE FROM produto_imagem WHERE produto_id = ?1", params![id]).map_err(|e| e.to_string())?;
        if let Some(imgs) = produto.imagens {
            for img in imgs {
                let img_id = if let Some(img_id) = img.id {
                    img_id
                } else {
                    tx.execute("INSERT INTO imagem (url_imagem) VALUES (?1)", params![img.url_imagem])
                        .map_err(|e| e.to_string())?;
                    tx.last_insert_rowid()
                };

                tx.execute(
                    "INSERT INTO produto_imagem (produto_id, imagem_id) VALUES (?1, ?2)",
                    params![id, img_id],
                ).map_err(|e| e.to_string())?;
            }
        }

        tx.commit().map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn delete_produto(conn: &mut Connection, id: i64) -> Result<(), String> {
        // Obter aplicacao_lista_id antes de deletar
        let aplicacao_lista_id: Option<i64> = conn
            .query_row(
                "SELECT aplicacao_lista_id FROM produto WHERE id = ?1",
                params![id],
                |row| row.get(0),
            )
            .ok();

        let tx = conn.transaction().map_err(|e| e.to_string())?;

        // Deletar produto (e os dependentes via ON DELETE CASCADE)
        tx.execute("DELETE FROM produto WHERE id = ?1", params![id])
            .map_err(|e| e.to_string())?;

        // Deletar a lista de aplicações se existia
        if let Some(list_id) = aplicacao_lista_id {
            tx.execute("DELETE FROM produto_aplicacao_lista WHERE id = ?1", params![list_id])
                .map_err(|e| e.to_string())?;
        }

        tx.commit().map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn get_produto_by_id(conn: &Connection, id: i64) -> Result<Option<Produto>, String> {
        let mut stmt = conn
            .prepare(
                "SELECT 
                    p.id, p.codigo, p.descricao, p.descricao_complementar, p.grupo_id,
                    g.descricao as grupo_descricao, c.descricao as categoria_descricao,
                    p.marca_id, f.nome as marca_nome, p.aplicacao_lista_id, p.codigo_original,
                    p.referencia, p.codigo_barras, p.peso_liquido, p.peso_bruto,
                    p.altura, p.largura, p.comprimento, p.ativo, p.criado_em, p.atualizado_em
                 FROM produto p
                 LEFT JOIN produto_grupo g ON p.grupo_id = g.id
                 LEFT JOIN produto_categoria c ON g.categoria_id = c.id
                 LEFT JOIN produto_fabricante f ON p.marca_id = f.id
                 WHERE p.id = ?1",
            )
            .map_err(|e| e.to_string())?;

        let produto_opt = stmt
            .query_row(params![id], |row| {
                let ativo_int: i64 = row.get(18)?;
                Ok(Produto {
                    id: Some(row.get(0)?),
                    codigo: row.get(1)?,
                    descricao: row.get(2)?,
                    descricao_complementar: row.get(3)?,
                    grupo_id: row.get(4)?,
                    grupo_descricao: row.get(5)?,
                    categoria_descricao: row.get(6)?,
                    marca_id: row.get(7)?,
                    marca_nome: row.get(8)?,
                    aplicacao_lista_id: row.get(9)?,
                    codigo_original: row.get(10)?,
                    referencia: row.get(11)?,
                    codigo_barras: row.get(12)?,
                    peso_liquido: row.get(13)?,
                    peso_bruto: row.get(14)?,
                    altura: row.get(15)?,
                    largura: row.get(16)?,
                    comprimento: row.get(17)?,
                    ativo: ativo_int == 1,
                    criado_em: Some(row.get(19)?),
                    atualizado_em: Some(row.get(20)?),
                    estoque: None,
                    preco: None,
                    fiscal: None,
                    especificacoes: None,
                    referencias: None,
                    aplicacoes: None,
                    imagens: None,
                })
            })
            .ok();

        let mut produto = match produto_opt {
            Some(p) => p,
            None => return Ok(None),
        };

        // Carregar preços
        let preco_opt = conn
            .query_row(
                "SELECT 
                    id, custo_compra, custo_impostos, preco_venda, simetria_preco,
                    margem_lucro, markup, preco_promocional, promocao_inicio, promocao_fim, atualizado_em
                 FROM produto_preco WHERE produto_id = ?1",
                params![id],
                |row| {
                    Ok(ProdutoPreco {
                        id: Some(row.get(0)?),
                        produto_id: Some(id),
                        custo_compra: row.get(1)?,
                        custo_impostos: row.get(2)?,
                        preco_venda: row.get(3)?,
                        simetria_preco: row.get(4)?,
                        margem_lucro: row.get(5)?,
                        markup: row.get(6)?,
                        preco_promocional: row.get(7)?,
                        promocao_inicio: row.get(8)?,
                        promocao_fim: row.get(9)?,
                        atualizado_em: Some(row.get(10)?),
                    })
                },
            )
            .ok();
        produto.preco = preco_opt;

        // Carregar estoques
        let mut est_stmt = conn
            .prepare(
                "SELECT 
                    id, filial_id, estoque_atual, estoque_reservado, estoque_disponivel,
                    estoque_minimo, estoque_maximo, controla_estoque, rua, prateleira, nivel, posicao, atualizado_em
                 FROM produto_estoque WHERE produto_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        let estoques_iter = est_stmt
            .query_map(params![id], |row| {
                let controla: i64 = row.get(7)?;
                Ok(ProdutoEstoque {
                    id: Some(row.get(0)?),
                    produto_id: Some(id),
                    filial_id: row.get(1)?,
                    estoque_atual: row.get(2)?,
                    estoque_reservado: row.get(3)?,
                    estoque_disponivel: row.get(4)?,
                    estoque_minimo: row.get(5)?,
                    estoque_maximo: row.get(6)?,
                    controla_estoque: controla == 1,
                    rua: row.get(8)?,
                    prateleira: row.get(9)?,
                    nivel: row.get(10)?,
                    posicao: row.get(11)?,
                    atualizado_em: Some(row.get(12)?),
                })
            })
            .map_err(|e| e.to_string())?;

        let mut estoques = Vec::new();
        for est in estoques_iter {
            estoques.push(est.map_err(|e| e.to_string())?);
        }
        produto.estoque = Some(estoques);

        // Carregar fiscal
        let fiscal_opt = conn
            .query_row(
                "SELECT 
                    id, ncm, cest, origem_mercadoria, csosn, cst_icms, cst_pis, cst_cofins, cst_ipi,
                    aliquota_icms, aliquota_icms_st, aliquota_pis, aliquota_cofins, aliquota_ipi,
                    cfop_saida, cfop_entrada, criado_em, atualizado_em
                 FROM produto_fiscal WHERE produto_id = ?1",
                params![id],
                |row| {
                    Ok(ProdutoFiscal {
                        id: Some(row.get(0)?),
                        produto_id: Some(id),
                        ncm: row.get(1)?,
                        cest: row.get(2)?,
                        origem_mercadoria: row.get(3)?,
                        csosn: row.get(4)?,
                        cst_icms: row.get(5)?,
                        cst_pis: row.get(6)?,
                        cst_cofins: row.get(7)?,
                        cst_ipi: row.get(8)?,
                        aliquota_icms: row.get(9)?,
                        aliquota_icms_st: row.get(10)?,
                        aliquota_pis: row.get(11)?,
                        aliquota_cofins: row.get(12)?,
                        aliquota_ipi: row.get(13)?,
                        cfop_saida: row.get(14)?,
                        cfop_entrada: row.get(15)?,
                        criado_em: Some(row.get(16)?),
                        atualizado_em: Some(row.get(17)?),
                    })
                },
            )
            .ok();
        produto.fiscal = fiscal_opt;

        // Carregar especificações
        let mut spec_stmt = conn
            .prepare(
                "SELECT 
                    pe.id, pe.tipo_id, pe.especificacao, ts.tipo_spec
                 FROM produto_especificacao pe
                 JOIN produto_tipo_especificacao ts ON pe.tipo_id = ts.id
                 WHERE pe.produto_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        let specs_iter = spec_stmt
            .query_map(params![id], |row| {
                Ok(ProdutoEspecificacao {
                    id: Some(row.get(0)?),
                    produto_id: id,
                    tipo_id: row.get(1)?,
                    especificacao: row.get(2)?,
                    tipo_especificacao: Some(row.get(3)?),
                })
            })
            .map_err(|e| e.to_string())?;

        let mut specs = Vec::new();
        for spec in specs_iter {
            specs.push(spec.map_err(|e| e.to_string())?);
        }
        produto.especificacoes = Some(specs);

        // Carregar referências
        let mut ref_stmt = conn
            .prepare(
                "SELECT 
                    r.id, r.fabricante_id, f.nome, r.codigo_referencia
                 FROM produto_referencia r
                 JOIN produto_fabricante f ON r.fabricante_id = f.id
                 WHERE r.produto_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        let refs_iter = ref_stmt
            .query_map(params![id], |row| {
                Ok(ProdutoReferencia {
                    id: Some(row.get(0)?),
                    produto_id: id,
                    fabricante_id: row.get(1)?,
                    fabricante_nome: Some(row.get(2)?),
                    codigo_referencia: row.get(3)?,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut referencias = Vec::new();
        for r in refs_iter {
            referencias.push(r.map_err(|e| e.to_string())?);
        }
        produto.referencias = Some(referencias);

        // Carregar aplicações
        if let Some(lista_id) = produto.aplicacao_lista_id {
            let mut app_stmt = conn
                .prepare(
                    "SELECT id, modelo, ano_inicial, ano_final, detalhes
                     FROM produto_aplicacao WHERE lista_id = ?1",
                )
                .map_err(|e| e.to_string())?;

            let apps_iter = app_stmt
                .query_map(params![lista_id], |row| {
                    Ok(ProdutoAplicacao {
                        id: Some(row.get(0)?),
                        lista_id,
                        modelo: row.get(1)?,
                        ano_inicial: row.get(2)?,
                        ano_final: row.get(3)?,
                        detalhes: row.get(4)?,
                    })
                })
                .map_err(|e| e.to_string())?;

            let mut aplicacoes = Vec::new();
            for app in apps_iter {
                aplicacoes.push(app.map_err(|e| e.to_string())?);
            }
            produto.aplicacoes = Some(aplicacoes);
        }

        // Carregar imagens
        let mut img_stmt = conn
            .prepare(
                "SELECT i.id, i.url_imagem
                 FROM produto_imagem pi
                 JOIN imagem i ON pi.imagem_id = i.id
                 WHERE pi.produto_id = ?1",
            )
            .map_err(|e| e.to_string())?;

        let imgs_iter = img_stmt
            .query_map(params![id], |row| {
                Ok(Imagem {
                    id: Some(row.get(0)?),
                    url_imagem: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut imagens = Vec::new();
        for img in imgs_iter {
            imagens.push(img.map_err(|e| e.to_string())?);
        }
        produto.imagens = Some(imagens);

        Ok(Some(produto))
    }

    pub fn list_produtos(conn: &Connection, query_search: Option<String>) -> Result<Vec<Produto>, String> {
        let sql = if let Some(ref search) = query_search {
            format!(
                "SELECT 
                    p.id, p.codigo, p.descricao, p.descricao_complementar, p.grupo_id,
                    g.descricao as grupo_descricao, c.descricao as categoria_descricao,
                    p.marca_id, f.nome as marca_nome, p.aplicacao_lista_id, p.codigo_original,
                    p.referencia, p.codigo_barras, p.peso_liquido, p.peso_bruto,
                    p.altura, p.largura, p.comprimento, p.ativo, p.criado_em, p.atualizado_em
                 FROM produto p
                 LEFT JOIN produto_grupo g ON p.grupo_id = g.id
                 LEFT JOIN produto_categoria c ON g.categoria_id = c.id
                 LEFT JOIN produto_fabricante f ON p.marca_id = f.id
                 WHERE p.codigo LIKE '%{}%' OR p.descricao LIKE '%{}%' OR p.codigo_original LIKE '%{}%'",
                search.replace("'", "''"), search.replace("'", "''"), search.replace("'", "''")
            )
        } else {
            "SELECT 
                p.id, p.codigo, p.descricao, p.descricao_complementar, p.grupo_id,
                g.descricao as grupo_descricao, c.descricao as categoria_descricao,
                p.marca_id, f.nome as marca_nome, p.aplicacao_lista_id, p.codigo_original,
                p.referencia, p.codigo_barras, p.peso_liquido, p.peso_bruto,
                p.altura, p.largura, p.comprimento, p.ativo, p.criado_em, p.atualizado_em
             FROM produto p
             LEFT JOIN produto_grupo g ON p.grupo_id = g.id
             LEFT JOIN produto_categoria c ON g.categoria_id = c.id
             LEFT JOIN produto_fabricante f ON p.marca_id = f.id".to_string()
        };

        let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;

        let p_iter = stmt
            .query_map([], |row| {
                let ativo_int: i64 = row.get(18)?;
                Ok(Produto {
                    id: Some(row.get(0)?),
                    codigo: row.get(1)?,
                    descricao: row.get(2)?,
                    descricao_complementar: row.get(3)?,
                    grupo_id: row.get(4)?,
                    grupo_descricao: row.get(5)?,
                    categoria_descricao: row.get(6)?,
                    marca_id: row.get(7)?,
                    marca_nome: row.get(8)?,
                    aplicacao_lista_id: row.get(9)?,
                    codigo_original: row.get(10)?,
                    referencia: row.get(11)?,
                    codigo_barras: row.get(12)?,
                    peso_liquido: row.get(13)?,
                    peso_bruto: row.get(14)?,
                    altura: row.get(15)?,
                    largura: row.get(16)?,
                    comprimento: row.get(17)?,
                    ativo: ativo_int == 1,
                    criado_em: Some(row.get(19)?),
                    atualizado_em: Some(row.get(20)?),
                    estoque: None,
                    preco: None,
                    fiscal: None,
                    especificacoes: None,
                    referencias: None,
                    aplicacoes: None,
                    imagens: None,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut produtos = Vec::new();
        for p in p_iter {
            let mut prod = p.map_err(|e| e.to_string())?;
            let id = prod.id.unwrap();

            // Adicionar dados simplificados de preço e estoque na listagem
            let preco_opt = conn
                .query_row(
                    "SELECT 
                        id, custo_compra, custo_impostos, preco_venda, simetria_preco,
                        margem_lucro, markup, preco_promocional, promocao_inicio, promocao_fim, atualizado_em
                     FROM produto_preco WHERE produto_id = ?1",
                    params![id],
                    |row| {
                        Ok(ProdutoPreco {
                            id: Some(row.get(0)?),
                            produto_id: Some(id),
                            custo_compra: row.get(1)?,
                            custo_impostos: row.get(2)?,
                            preco_venda: row.get(3)?,
                            simetria_preco: row.get(4)?,
                            margem_lucro: row.get(5)?,
                            markup: row.get(6)?,
                            preco_promocional: row.get(7)?,
                            promocao_inicio: row.get(8)?,
                            promocao_fim: row.get(9)?,
                            atualizado_em: Some(row.get(10)?),
                        })
                    },
                )
                .ok();
            prod.preco = preco_opt;

            let mut est_stmt = conn
                .prepare(
                    "SELECT 
                        id, filial_id, estoque_atual, estoque_reservado, estoque_disponivel,
                        estoque_minimo, estoque_maximo, controla_estoque, rua, prateleira, nivel, posicao, atualizado_em
                     FROM produto_estoque WHERE produto_id = ?1",
                )
                .map_err(|e| e.to_string())?;

            let estoques_iter = est_stmt
                .query_map(params![id], |row| {
                    let controla: i64 = row.get(7)?;
                    Ok(ProdutoEstoque {
                        id: Some(row.get(0)?),
                        produto_id: Some(id),
                        filial_id: row.get(1)?,
                        estoque_atual: row.get(2)?,
                        estoque_reservado: row.get(3)?,
                        estoque_disponivel: row.get(4)?,
                        estoque_minimo: row.get(5)?,
                        estoque_maximo: row.get(6)?,
                        controla_estoque: controla == 1,
                        rua: row.get(8)?,
                        prateleira: row.get(9)?,
                        nivel: row.get(10)?,
                        posicao: row.get(11)?,
                        atualizado_em: Some(row.get(12)?),
                    })
                })
                .map_err(|e| e.to_string())?;

            let mut estoques = Vec::new();
            for est in estoques_iter {
                estoques.push(est.map_err(|e| e.to_string())?);
            }
            prod.estoque = Some(estoques);

            produtos.push(prod);
        }

        Ok(produtos)
    }
}
