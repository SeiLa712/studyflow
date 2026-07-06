import os
import sys
import json
import mysql.connector
from datetime import date, datetime, timedelta

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass


def converter_json(valor):
    if isinstance(valor, (datetime, date)):
        return valor.isoformat()
    return valor


def buscar_colunas_tarefas(cursor):
    cursor.execute("SHOW COLUMNS FROM tarefas")
    colunas = cursor.fetchall()
    return [coluna["Field"] for coluna in colunas]


def tabela_existe(cursor, nome_tabela):
    cursor.execute("SHOW TABLES LIKE %s", (nome_tabela,))
    resultado = cursor.fetchone()
    return resultado is not None


def contar_por_prioridade(tarefas):
    resultado = {
        "alta": 0,
        "media": 0,
        "baixa": 0
    }

    for tarefa in tarefas:
        prioridade = tarefa.get("prioridade") or "media"

        if prioridade in resultado:
            resultado[prioridade] += 1

    return resultado


def melhor_dia_da_semana(tarefas_semana):
    dias_pt = {
        0: "segunda-feira",
        1: "terça-feira",
        2: "quarta-feira",
        3: "quinta-feira",
        4: "sexta-feira",
        5: "sábado",
        6: "domingo"
    }

    contagem = {}

    for tarefa in tarefas_semana:
        criado_em = tarefa.get("created_at")

        if not criado_em:
            continue

        indice_dia = criado_em.weekday()
        nome_dia = dias_pt[indice_dia]

        contagem[nome_dia] = contagem.get(nome_dia, 0) + 1

    if not contagem:
        return {
            "dia": "Sem dados",
            "total": 0
        }

    melhor = max(contagem, key=contagem.get)

    return {
        "dia": melhor,
        "total": contagem[melhor]
    }


def calcular_risco_tarefa(tarefa, hoje):
    if tarefa.get("concluida"):
        return None

    data_vencimento = tarefa.get("data_vencimento")

    if not data_vencimento:
        return None

    dias_restantes = (data_vencimento - hoje).days
    prioridade = tarefa.get("prioridade") or "media"

    if dias_restantes < 0:
        return {
            "risco": "Alto",
            "motivo": "Atividade atrasada"
        }

    if prioridade == "alta" and dias_restantes <= 6:
        return {
            "risco": "Alto",
            "motivo": "Alta prioridade e vencimento próximo"
        }

    if prioridade == "media" and dias_restantes <= 4:
        return {
            "risco": "Médio",
            "motivo": "Prioridade média e vencimento próximo"
        }

    if prioridade == "baixa" and dias_restantes <= 2:
        return {
            "risco": "Médio",
            "motivo": "Vencimento muito próximo"
        }

    return {
        "risco": "Baixo",
        "motivo": "Sem urgência imediata"
    }


def calcular_score(
    total_criadas,
    total_concluidas,
    total_atrasadas,
    riscos_altos,
    total_minutos_foco,
    metas_concluidas=0,
    total_metas=0
):
    score = 50

    score += total_criadas * 3
    score += total_concluidas * 10
    score += min(total_minutos_foco // 25, 10) * 3

    if total_metas > 0:
        score += metas_concluidas * 5

    score -= total_atrasadas * 12
    score -= riscos_altos * 6

    if score > 100:
        score = 100

    if score < 0:
        score = 0

    if score >= 80:
        status = "Excelente"
        mensagem = "Sua organização semanal está muito boa."
    elif score >= 60:
        status = "Boa"
        mensagem = "Você está mantendo uma boa produtividade."
    elif score >= 40:
        status = "Atenção"
        mensagem = "Sua semana precisa de mais organização."
    else:
        status = "Crítica"
        mensagem = "Existem muitas tarefas atrasadas ou em risco."

    return {
        "valor": int(score),
        "status": status,
        "mensagem": mensagem
    }


def gerar_sugestoes(
    total_criadas,
    total_pendentes,
    total_atrasadas,
    riscos_altos,
    prioridade_contagem,
    total_minutos_foco
):
    sugestoes = []

    if total_criadas == 0:
        sugestoes.append(
            "Você ainda não criou atividades nesta semana. Planeje algumas tarefas para manter sua rotina de estudos organizada."
        )

    if total_atrasadas > 0:
        sugestoes.append(
            f"Você possui {total_atrasadas} atividade(s) atrasada(s). Priorize resolver essas tarefas antes de criar novas."
        )

    if riscos_altos > 0:
        sugestoes.append(
            f"Você possui {riscos_altos} atividade(s) com risco alto. Foque nelas primeiro."
        )

    if (
        prioridade_contagem["alta"] > prioridade_contagem["media"]
        and prioridade_contagem["alta"] > prioridade_contagem["baixa"]
    ):
        sugestoes.append(
            "A maioria das suas atividades está em alta prioridade. Tente dividir melhor as tarefas para evitar acúmulo."
        )

    if total_pendentes >= 8:
        sugestoes.append(
            "Você tem muitas atividades pendentes. Uma boa estratégia é separar as tarefas em blocos menores usando o Pomodoro."
        )

    if total_minutos_foco == 0:
        sugestoes.append(
            "Nenhuma sessão Pomodoro foi concluída nesta semana. Tente registrar pelo menos uma sessão de foco."
        )

    if total_minutos_foco >= 100:
        sugestoes.append(
            "Você acumulou um bom tempo de foco nesta semana. Continue usando o Pomodoro para manter o ritmo."
        )

    return sugestoes


def analisar_kanban(cards_kanban):
    por_coluna = {}

    for card in cards_kanban:
        coluna = card.get("coluna") or "Sem coluna"
        por_coluna[coluna] = por_coluna.get(coluna, 0) + 1

    if por_coluna:
        coluna_mais_cheia = max(por_coluna, key=por_coluna.get)
        total_coluna = por_coluna[coluna_mais_cheia]
    else:
        coluna_mais_cheia = "Sem dados"
        total_coluna = 0

    sugestao = "Nenhum card encontrado no Kanban."

    if total_coluna > 0:
        sugestao = f"A coluna com mais cards é '{coluna_mais_cheia}', com {total_coluna} card(s)."

    return {
        "total_cards": len(cards_kanban),
        "por_coluna": por_coluna,
        "coluna_mais_cheia": coluna_mais_cheia,
        "total_coluna_mais_cheia": total_coluna,
        "sugestao": sugestao
    }


def buscar_metas(cursor, id_usuario):
    if not tabela_existe(cursor, "metas_semanais"):
        return []

    sql = """
        SELECT
            id,
            titulo,
            descricao,
            tipo,
            valor_meta,
            unidade,
            created_at
        FROM metas_semanais
        WHERE id_usuario = %s
          AND ativo = TRUE
        ORDER BY created_at DESC
    """

    cursor.execute(sql, (id_usuario,))
    return cursor.fetchall()


def calcular_progresso_meta(
    meta,
    total_concluidas,
    total_minutos_foco,
    total_atrasadas
):
    tipo = meta.get("tipo")

    valor_meta = meta.get("valor_meta")

    if valor_meta is None:
        valor_meta = 1

    valor_meta = int(valor_meta)

    if tipo != "atrasos" and valor_meta <= 0:
        valor_meta = 1

    if tipo == "tarefas":
        valor_atual = total_concluidas
    elif tipo == "foco":
        valor_atual = total_minutos_foco
    elif tipo == "atrasos":
        valor_atual = total_atrasadas
    else:
        valor_atual = 0

    if tipo == "atrasos":
        if valor_atual <= valor_meta:
            porcentagem = 100
            status = "Dentro da meta"
        else:
            porcentagem = 0
            status = "Meta ultrapassada"
    else:
        porcentagem = round((valor_atual / valor_meta) * 100)

        if porcentagem >= 100:
            porcentagem = 100
            status = "Meta concluída"
        elif porcentagem >= 70:
            status = "Quase lá"
        elif porcentagem >= 40:
            status = "Em andamento"
        else:
            status = "Precisa de atenção"

    return {
        "id": meta.get("id"),
        "titulo": meta.get("titulo"),
        "descricao": meta.get("descricao"),
        "tipo": tipo,
        "valor_meta": valor_meta,
        "valor_atual": valor_atual,
        "unidade": meta.get("unidade") or "unidades",
        "porcentagem": porcentagem,
        "status": status
    }


def analisar_metas(
    cursor,
    id_usuario,
    total_concluidas,
    total_minutos_foco,
    total_atrasadas
):
    metas = buscar_metas(cursor, id_usuario)

    metas_calculadas = []

    for meta in metas:
        metas_calculadas.append(
            calcular_progresso_meta(
                meta,
                total_concluidas,
                total_minutos_foco,
                total_atrasadas
            )
        )

    total_metas = len(metas_calculadas)

    metas_concluidas = len([
        meta for meta in metas_calculadas
        if meta.get("porcentagem", 0) >= 100
    ])

    if total_metas > 0:
        progresso_medio = round(
            sum(
                meta.get("porcentagem", 0)
                for meta in metas_calculadas
            ) / total_metas
        )
    else:
        progresso_medio = 0

    sugestoes = []

    if total_metas == 0:
        sugestoes.append(
            "Você ainda não possui metas semanais cadastradas. Crie metas para acompanhar melhor sua evolução."
        )
    else:
        metas_em_atencao = [
            meta for meta in metas_calculadas
            if meta.get("status") in [
                "Precisa de atenção",
                "Meta ultrapassada"
            ]
        ]

        if metas_concluidas == total_metas:
            sugestoes.append(
                "Você concluiu todas as metas da semana. Excelente consistência!"
            )

        if metas_em_atencao:
            sugestoes.append(
                f"Você possui {len(metas_em_atencao)} meta(s) que precisam de atenção. Revise sua rotina para melhorar o desempenho."
            )

        if progresso_medio >= 70 and metas_concluidas < total_metas:
            sugestoes.append(
                "Seu progresso nas metas está bom. Foque nas metas restantes para fechar a semana melhor."
            )

    return {
        "total_metas": total_metas,
        "metas_concluidas": metas_concluidas,
        "progresso_medio": progresso_medio,
        "lista": metas_calculadas,
        "sugestoes": sugestoes
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "erro": "ID do usuário não informado"
        }, ensure_ascii=True))
        sys.exit(1)

    id_usuario = sys.argv[1]

    semanas_atras = 0

    if len(sys.argv) >= 3:
        try:
            semanas_atras = int(sys.argv[2])
        except ValueError:
            semanas_atras = 0

    if semanas_atras < 0:
        semanas_atras = 0

    hoje = date.today()

    fim_semana = hoje - timedelta(days=semanas_atras * 7)
    inicio_semana = fim_semana - timedelta(days=6)

    conexao = mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "StudyFlow")
    )

    cursor = conexao.cursor(dictionary=True)

    colunas_tarefas = buscar_colunas_tarefas(cursor)
    tem_concluida_em = "concluida_em" in colunas_tarefas

    if tem_concluida_em:
        sql_tarefas = """
            SELECT
                id,
                nome,
                descricao,
                prioridade,
                data_vencimento,
                concluida,
                concluida_em,
                created_at
            FROM tarefas
            WHERE id_usuario = %s
        """
    else:
        sql_tarefas = """
            SELECT
                id,
                nome,
                descricao,
                prioridade,
                data_vencimento,
                concluida,
                NULL AS concluida_em,
                created_at
            FROM tarefas
            WHERE id_usuario = %s
        """

    cursor.execute(sql_tarefas, (id_usuario,))
    tarefas = cursor.fetchall()

    sql_kanban = """
        SELECT
            kc.id,
            kc.titulo,
            kc.descricao,
            kc.prioridade,
            kc.data_entrega,
            kc.progresso,
            kc.created_at,
            col.nome AS coluna
        FROM kanban_cards kc
        INNER JOIN kanban_colunas col
            ON col.id = kc.id_coluna
        INNER JOIN kanbans k
            ON k.id = col.id_kanban
        WHERE k.id_usuario = %s
          AND kc.ativo = TRUE
          AND col.ativo = TRUE
          AND k.ativo = TRUE
    """

    cursor.execute(sql_kanban, (id_usuario,))
    cards_kanban = cursor.fetchall()

    total_minutos_foco = 0
    total_sessoes_foco = 0
    media_por_sessao = 0

    if tabela_existe(cursor, "pomodoro_sessoes"):
        sql_foco = """
            SELECT
                COALESCE(SUM(duracao_min), 0) AS total_minutos,
                COUNT(*) AS total_sessoes
            FROM pomodoro_sessoes
            WHERE id_usuario = %s
              AND DATE(created_at) BETWEEN %s AND %s
        """

        cursor.execute(
            sql_foco,
            (
                id_usuario,
                inicio_semana,
                fim_semana
            )
        )

        foco_resultado = cursor.fetchone()

        total_minutos_foco = int(
            foco_resultado.get("total_minutos") or 0
        )

        total_sessoes_foco = int(
            foco_resultado.get("total_sessoes") or 0
        )

        if total_sessoes_foco > 0:
            media_por_sessao = round(
                total_minutos_foco / total_sessoes_foco,
                1
            )

    tarefas_semana = []

    for tarefa in tarefas:
        criado_em = tarefa.get("created_at")

        if criado_em and inicio_semana <= criado_em.date() <= fim_semana:
            tarefas_semana.append(tarefa)

    tarefas_concluidas_semana = []

    for tarefa in tarefas:
        concluida = tarefa.get("concluida")
        concluida_em = tarefa.get("concluida_em")

        if concluida and concluida_em:
            if inicio_semana <= concluida_em.date() <= fim_semana:
                tarefas_concluidas_semana.append(tarefa)
        elif concluida:
            tarefas_concluidas_semana.append(tarefa)

    tarefas_pendentes = [
        tarefa for tarefa in tarefas
        if not tarefa.get("concluida")
    ]

    tarefas_atrasadas = []

    for tarefa in tarefas_pendentes:
        data_vencimento = tarefa.get("data_vencimento")

        if data_vencimento and data_vencimento < hoje:
            tarefas_atrasadas.append(tarefa)

    prioridade_contagem = contar_por_prioridade(tarefas_semana)

    riscos = []

    for tarefa in tarefas_pendentes:
        risco = calcular_risco_tarefa(tarefa, hoje)

        if risco:
            riscos.append({
                "id": tarefa.get("id"),
                "nome": tarefa.get("nome"),
                "prioridade": tarefa.get("prioridade"),
                "data_vencimento": tarefa.get("data_vencimento"),
                "risco": risco["risco"],
                "motivo": risco["motivo"]
            })

    riscos_ordenados = sorted(
        riscos,
        key=lambda item: (
            0
            if item["risco"] == "Alto"
            else 1
            if item["risco"] == "Médio"
            else 2,
            item["data_vencimento"] or hoje
        )
    )

    riscos_altos = len([
        item for item in riscos
        if item["risco"] == "Alto"
    ])

    total_criadas = len(tarefas_semana)
    total_concluidas = len(tarefas_concluidas_semana)
    total_pendentes = len(tarefas_pendentes)
    total_atrasadas = len(tarefas_atrasadas)

    kanban = analisar_kanban(cards_kanban)

    metas = analisar_metas(
        cursor,
        id_usuario,
        total_concluidas,
        total_minutos_foco,
        total_atrasadas
    )

    score = calcular_score(
        total_criadas,
        total_concluidas,
        total_atrasadas,
        riscos_altos,
        total_minutos_foco,
        metas.get("metas_concluidas", 0),
        metas.get("total_metas", 0)
    )

    sugestoes = gerar_sugestoes(
        total_criadas,
        total_pendentes,
        total_atrasadas,
        riscos_altos,
        prioridade_contagem,
        total_minutos_foco
    )

    sugestoes.extend(
        metas.get("sugestoes", [])
    )

    if not sugestoes:
        sugestoes.append(
            "Sua semana está organizada. Continue acompanhando suas atividades, metas e calendário."
        )

    relatorio = {
        "periodo": {
            "inicio": inicio_semana,
            "fim": fim_semana
        },
        "resumo": {
            "atividades_criadas": total_criadas,
            "atividades_concluidas": total_concluidas,
            "atividades_pendentes": total_pendentes,
            "atividades_atrasadas": total_atrasadas,
            "riscos_altos": riscos_altos,
            "metas_concluidas": metas.get("metas_concluidas", 0),
            "total_metas": metas.get("total_metas", 0),
            "progresso_metas": metas.get("progresso_medio", 0)
        },
        "foco": {
            "total_minutos": total_minutos_foco,
            "total_horas": round(total_minutos_foco / 60, 1),
            "total_sessoes": total_sessoes_foco,
            "media_por_sessao": media_por_sessao
        },
        "prioridades": prioridade_contagem,
        "melhor_dia": melhor_dia_da_semana(tarefas_semana),
        "score": score,
        "sugestoes": sugestoes,
        "riscos": riscos_ordenados[:8],
        "kanban": kanban,
        "metas": metas
    }

    cursor.close()
    conexao.close()

    print(
        json.dumps(
            relatorio,
            default=converter_json,
            ensure_ascii=True
        )
    )


if __name__ == "__main__":
    main()
