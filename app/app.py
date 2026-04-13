import os
from openai import OpenAI
from flask import Flask, jsonify
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app) # Enables Cross-Origin Resource Sharing

@app.route('/data', methods=['GET'])
def get_data():
    response = supabase.table('Teste').select("*").execute()
    return jsonify(response.data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)