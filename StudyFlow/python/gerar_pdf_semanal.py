import os
import sys
import json
from datetime import datetime

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)


def data_br(data):
    if not data:
        return "Sem data"

    partes = str(data).split("-")

    if len(partes) != 3:
        return str(data)

    return f"{partes[2]}/{partes[1]}/{partes[0]}"


def criar_pdf(dados, caminho_pdf):
    relatorio = dados.get("relatorio", {})

    periodo = relatorio.get("periodo", {})
    resumo = relatorio.get("resumo", {})
    foco = relatorio.get("foco", {})
    score = relatorio.get("score", {})
    prioridades = relatorio.get("prioridades", {})
    sugestoes = relatorio.get("sugestoes", [])
    riscos = relatorio.get("riscos", [])
    kanban = relatorio.get("kanban", {})
    metas = relatorio.get("metas", {})

    doc = SimpleDocTemplate(
        caminho_pdf,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    elementos = []

    titulo = Paragraph(
        "Relatório Semanal - StudyFlow",
        styles["Title"]
    )

    periodo_texto = Paragraph(
        f"Período analisado: {data_br(periodo.get('inicio'))} até {data_br(periodo.get('fim'))}",
        styles["Normal"]
    )

    elementos.append(titulo)
    elementos.append(Spacer(1, 12))
    elementos.append(periodo_texto)
    elementos.append(Spacer(1, 20))

    score_texto = Paragraph(
        f"<b>Score de Produtividade:</b> {score.get('valor', 0)}% - {score.get('status', 'Sem dados')}",
        styles["Heading2"]
    )

    score_msg = Paragraph(
        score.get("mensagem", "Nenhuma mensagem disponível."),
        styles["Normal"]
    )

    elementos.append(score_texto)
    elementos.append(score_msg)
    elementos.append(Spacer(1, 18))

    tabela_resumo = [
        ["Indicador", "Valor"],
        ["Atividades criadas", resumo.get("atividades_criadas", 0)],
        ["Atividades concluídas", resumo.get("atividades_concluidas", 0)],
        ["Atividades pendentes", resumo.get("atividades_pendentes", 0)],
        ["Atividades atrasadas", resumo.get("atividades_atrasadas", 0)],
        ["Riscos altos", resumo.get("riscos_altos", 0)],
        ["Tempo de foco", f"{foco.get('total_minutos', 0)} min"],
        ["Sessões Pomodoro", foco.get("total_sessoes", 0)],
        [
            "Metas concluídas",
            f"{resumo.get('metas_concluidas', 0)} / {resumo.get('total_metas', 0)}"
        ],
        [
            "Progresso médio das metas",
            f"{resumo.get('progresso_metas', 0)}%"
        ]
    ]

    tabela = Table(tabela_resumo, colWidths=[260, 180])
    tabela.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#6366f1")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("PADDING", (0, 0), (-1, -1), 8),
    ]))

    elementos.append(Paragraph("Resumo da Semana", styles["Heading2"]))
    elementos.append(tabela)
    elementos.append(Spacer(1, 18))

    tabela_prioridades = [
        ["Prioridade", "Quantidade"],
        ["Alta", prioridades.get("alta", 0)],
        ["Média", prioridades.get("media", 0)],
        ["Baixa", prioridades.get("baixa", 0)]
    ]

    tabela_p = Table(tabela_prioridades, colWidths=[260, 180])
    tabela_p.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111827")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("PADDING", (0, 0), (-1, -1), 8),
    ]))

    elementos.append(Paragraph("Atividades por Prioridade", styles["Heading2"]))
    elementos.append(tabela_p)
    elementos.append(Spacer(1, 18))

    elementos.append(Paragraph("Progresso das Metas", styles["Heading2"]))

    lista_metas = metas.get("lista", [])

    if lista_metas:
        resumo_metas = Paragraph(
            f"<b>Metas concluídas:</b> {metas.get('metas_concluidas', 0)} de {metas.get('total_metas', 0)} | "
            f"<b>Progresso médio:</b> {metas.get('progresso_medio', 0)}%",
            styles["Normal"]
        )

        elementos.append(resumo_metas)
        elementos.append(Spacer(1, 10))

        tabela_metas = [
            ["Meta", "Progresso", "Status"]
        ]

        for meta in lista_metas:
            titulo_meta = meta.get("titulo", "Sem título")
            valor_atual = meta.get("valor_atual", 0)
            valor_meta = meta.get("valor_meta", 0)
            unidade = meta.get("unidade", "")
            porcentagem = meta.get("porcentagem", 0)
            status = meta.get("status", "Sem status")

            tabela_metas.append([
                titulo_meta,
                f"{valor_atual} / {valor_meta} {unidade}",
                f"{porcentagem}% - {status}"
            ])

        tabela_m = Table(tabela_metas, colWidths=[190, 130, 160])
        tabela_m.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#6366f1")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("PADDING", (0, 0), (-1, -1), 8),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))

        elementos.append(tabela_m)

    else:
        elementos.append(
            Paragraph(
                "Nenhuma meta cadastrada para esta semana.",
                styles["Normal"]
            )
        )

    elementos.append(Spacer(1, 18))

    elementos.append(Paragraph("Sugestões Inteligentes", styles["Heading2"]))

    if sugestoes:
        for sugestao in sugestoes:
            elementos.append(
                Paragraph(f"• {sugestao}", styles["Normal"])
            )
            elementos.append(Spacer(1, 6))
    else:
        elementos.append(
            Paragraph("Nenhuma sugestão encontrada.", styles["Normal"])
        )

    elementos.append(Spacer(1, 18))

    elementos.append(Paragraph("Resumo do Kanban", styles["Heading2"]))

    elementos.append(
        Paragraph(
            f"Total de cards: {kanban.get('total_cards', 0)}",
            styles["Normal"]
        )
    )

    elementos.append(
        Paragraph(
            f"Coluna com mais cards: {kanban.get('coluna_mais_cheia', 'Sem dados')}",
            styles["Normal"]
        )
    )

    elementos.append(
        Paragraph(
            kanban.get("sugestao", "Nenhuma sugestão para o Kanban."),
            styles["Normal"]
        )
    )

    elementos.append(Spacer(1, 18))

    elementos.append(Paragraph("Riscos de Atraso", styles["Heading2"]))

    if riscos:
        for item in riscos:
            texto = (
                f"<b>{item.get('nome')}</b> - "
                f"{item.get('risco')} - "
                f"{item.get('motivo')} - "
                f"Vencimento: {data_br(item.get('data_vencimento'))}"
            )

            elementos.append(
                Paragraph(texto, styles["Normal"])
            )

            elementos.append(Spacer(1, 6))
    else:
        elementos.append(
            Paragraph("Nenhum risco encontrado.", styles["Normal"])
        )

    doc.build(elementos)


def main():
    entrada = sys.stdin.read()

    if not entrada:
        print(json.dumps({
            "erro": "Nenhum dado recebido"
        }, ensure_ascii=True))
        sys.exit(1)

    dados = json.loads(entrada)

    pasta_saida = sys.argv[1]

    os.makedirs(pasta_saida, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    nome_arquivo = f"relatorio-semanal-studyflow-{timestamp}.pdf"

    caminho_pdf = os.path.join(
        pasta_saida,
        nome_arquivo
    )

    criar_pdf(dados, caminho_pdf)

    print(json.dumps({
        "sucesso": True,
        "caminho": caminho_pdf,
        "nome": nome_arquivo
    }, ensure_ascii=True))


if __name__ == "__main__":
    main()