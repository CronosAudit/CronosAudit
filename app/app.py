import os
from openai import OpenAI
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

import httpx
original_init = httpx.Client.__init__
def new_init(self, *args, **kwargs):
    kwargs['verify'] = False
    original_init(self, *args, **kwargs)
httpx.Client.__init__ = new_init

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key: str = os.environ.get("NEXT_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    message = request.form.get('message', '')
    file = request.files.get('file')
    
    file_path = None
    if file:
        file_bytes = file.read()
        file_name = file.filename
        content_type = file.content_type
        
        # Uploading to Supabase
        try:
            supabase.storage.from_("arquivos_relatorio").upload(
                path=file_name,
                file=file_bytes,
                file_options={"content-type": content_type}
            )
            file_path = file_name
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": f"Erro no servidor ao enviar arquivo. Possível falta de permissão no Supabase. Detalhes: {e}"
            }), 400
        
    return jsonify({
        "status": "success",
        "message_received": message,
        "file_uploaded": file_path
    })

@app.route('/data', methods=['GET'])
def get_data():
    response = supabase.table('Teste').select("*").execute()
    return jsonify(response.data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)