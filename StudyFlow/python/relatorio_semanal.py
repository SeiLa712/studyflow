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

    if prioridade == "alta" and dias_restantes <= 2:
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


def calcular_score(total_criadas, total_concluidas, total_atrasadas, riscos_altos, total_minutos_foco):
    score = 50

    score += total_criadas * 3
    score += total_concluidas * 10
    score += min(total_minutos_foco // 25, 10) * 3

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


def gerar_sugestoes(total_criadas, total_pendentes, total_atrasadas, riscos_altos, prioridade_contagem, total_minutos_foco):
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

    if prioridade_contagem["alta"] > prioridade_contagem["media"] and prioridade_contagem["alta"] > prioridade_contagem["baixa"]:
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

    if not sugestoes:
        sugestoes.append(
            "Sua semana está organizada. Continue acompanhando suas atividades e mantendo o calendário atualizado."
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


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"erro": "ID do usuário não informado"}, ensure_ascii=True))
        sys.exit(1)

    id_usuario = sys.argv[1]

    hoje = date.today()
    inicio_semana = hoje - timedelta(days=6)
    fim_semana = hoje

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

        cursor.execute(sql_foco, (id_usuario, inicio_semana, fim_semana))
        foco_resultado = cursor.fetchone()

        total_minutos_foco = int(foco_resultado.get("total_minutos") or 0)
        total_sessoes_foco = int(foco_resultado.get("total_sessoes") or 0)

        if total_sessoes_foco > 0:
            media_por_sessao = round(total_minutos_foco / total_sessoes_foco, 1)

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
            0 if item["risco"] == "Alto" else 1 if item["risco"] == "Médio" else 2,
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

    score = calcular_score(
        total_criadas,
        total_concluidas,
        total_atrasadas,
        riscos_altos,
        total_minutos_foco
    )

    sugestoes = gerar_sugestoes(
        total_criadas,
        total_pendentes,
        total_atrasadas,
        riscos_altos,
        prioridade_contagem,
        total_minutos_foco
    )

    kanban = analisar_kanban(cards_kanban)

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
            "riscos_altos": riscos_altos
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
        "kanban": kanban
    }

    cursor.close()
    conexao.close()

    print(json.dumps(relatorio, default=converter_json, ensure_ascii=True))


if __name__ == "__main__":
    main()