# IntelliMail/backend/app.py

import os
import zipfile
import fitz 
import json
import time 
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
CORS(app)


try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("Chave de API do Gemini não encontrada no arquivo .env")
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-2.5-flash')
except Exception as e:
    print(f"Erro ao configurar o cliente Gemini: {e}")
    model = None


def read_txt_content(stream):
    return stream.read().decode("utf-8", errors='ignore')

def read_pdf_content(stream):
    try:
        pdf_document = fitz.open(stream=stream.read(), filetype="pdf")
        text = "".join(page.get_text() for page in pdf_document)
        return text
    except Exception as e:
        print(f"Erro ao ler PDF: {e}")
        return ""

def get_emails_from_zip(stream):
    emails = []
    try:
        with zipfile.ZipFile(stream, "r") as zip_ref:
            for file_name in sorted(zip_ref.namelist()):
                content = ""
                with zip_ref.open(file_name) as file:
                    if file_name.endswith(".txt"):
                        content = file.read().decode("utf-8", errors='ignore')
                    elif file_name.endswith(".pdf"):
                        pdf_bytes = file.read()
                        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
                        content = "".join(page.get_text() for page in pdf_document)
                if content:
                    emails.append(content)
    except Exception as e:
        print(f"Erro ao processar ZIP: {e}")
    return emails

def analyze_content_with_ia(content, personalization_instruction, custom_prompt):
    try:
        prompt = f"""
                # Papel e Objetivo
                    Você é um assistente de IA especialista em classificar e-mails para maximizar a produtividade de um profissional.

                # Instruções Gerais
                    1. Analise o e-mail fornecido abaixo.
                    2. Seu objetivo é extrair o assunto (subject), a categoria (category) e criar uma sugestão de resposta (suggestion).
                    3. A 'category' deve ser estritamente 'Produtivo' ou 'Improdutivo'.
                    4. A 'suggestion' deve ser uma resposta objetiva e clara ao e-mail.
                    5. Leve em conta as seguintes instruções personalizadas para guiar sua análise:
                        - Instrução de Personalização: {personalization_instruction}
                        - Instrução Adicional do Usuário: "{custom_prompt}"

                # Definições das Categorias
                    Use a "Instrução Adicional do Usuário" como o critério principal para sua decisão.
                    - **Produtivo:** E-mails que exigem uma ação direta, estão relacionados a tarefas importantes, agendamentos essenciais, discussões de projetos, ou vêm de contatos prioritários (equipe, gestores), de acordo com a personalização.
                    - **Improdutivo:** E-mails como newsletters, promoções, notificações automáticas, spam, ou qualquer comunicação que não esteja alinhada com as prioridades definidas na personalização.

                # Raciocínio Passo a Passo (Seu Processo Interno)
                    Antes de gerar o JSON, pense da seguinte forma:
                        1. Qual é o propósito central deste e-mail?
                        2. Baseado na "Instrução Adicional do Usuário" e nas "Definições das Categorias", este e-mail exige uma ação prioritária?
                        3. Portanto, qual é a categoria correta?
                        4. Qual é a resposta ou ação mais eficiente?
                        5. Busque sempre adicionar um cumprimento + a "Instrução de Personalização" ao final do e-mail. Ex: "Atenciosamente, [Instrução de Personalização]"

                # Formato da Saída
                    Retorne APENAS um objeto JSON válido, com as chaves 'subject', 'category' e 'suggestion'. Não inclua nenhum texto ou explicação fora do objeto JSON.

                # E-mail para Análise
                ---
                {content}
                ---
        """
        response = model.generate_content(prompt)
        cleaned_text = response.text.strip().replace('```json', '').replace('```', '')
        return json.loads(cleaned_text)
    except Exception as e:
        print(f"Erro ao analisar com a IA: {e}")
        return {
            "subject": "Erro na Análise", "category": "Indefinido",
            "suggestion": f"Não foi possível processar este e-mail. Erro: {e}"
        }

@app.route("/api/process", methods=["POST"])
def process_email():
    if not model:
        return jsonify({"error": "Modelo Gemini não foi inicializado."}), 500

    mode = request.form.get("mode", "Pessoal")
    user_name = request.form.get("userName", "")
    user_lastname = request.form.get("userLastname", "")
    company_name = request.form.get("companyName", "")
    custom_prompt = request.form.get("custom_prompt", "")

    full_name = f"{user_name} {user_lastname}".strip()
    custom_prompt = custom_prompt.replace("{full_name}", full_name)
    custom_prompt = custom_prompt.replace("{company_name}", company_name)
    
    personalization_instruction = ""
    if mode == "Empresarial" and company_name:
        personalization_instruction = f"A sugestão de resposta deve ser em tom profissional, claro e representando a empresa '{company_name}'."
    elif mode == "Pessoal" and user_name:
        personalization_instruction = f"A sugestão de resposta deve ser em primeira pessoa, não precisa ser tão formal, e deve ser como se fosse escrita por '{full_name}'."

    emails_to_process = []
    
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        if file.filename.endswith(".zip"):
            emails_to_process = get_emails_from_zip(file.stream)
        elif file.filename.endswith(".txt"):
            emails_to_process.append(read_txt_content(file.stream))
        elif file.filename.endswith(".pdf"):
            emails_to_process.append(read_pdf_content(file.stream))
        else:
            return jsonify({"error": "Formato de arquivo não suportado"}), 400
    else:
        content = request.form.get("email_text", "")
        if content:
            emails_to_process.append(content)

    if not emails_to_process:
        return jsonify({"error": "Nenhum conteúdo para analisar"}), 400

    results = []
    for email_content in emails_to_process:
        response_data = analyze_content_with_ia(email_content, personalization_instruction, custom_prompt)
        
        response_data['content'] = email_content
        response_data['created_at'] = time.strftime('%d/%m/%Y %H:%M')
        response_data['status'] = 'Processado'
        
        results.append(response_data)
        time.sleep(1) 
    
    return jsonify({"message": f"{len(results)} e-mail(s) processado(s) com sucesso!", "processed_emails": results})
