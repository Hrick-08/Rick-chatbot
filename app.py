from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')

    try:
        # If user asks for the bot's name
        if "your name" in user_message.lower() or "who are you" in user_message.lower():
            bot_response = "My name is Rick, your virtual assistant."
        else:
            response = model.generate_content(user_message)
            bot_response = response.text if response and hasattr(response, 'text') else "I'm unable to respond right now."

    except Exception as e:
        print(f"Error: {e}")
        bot_response = "Sorry, I'm experiencing issues. Please try again later."

    return jsonify({'response': bot_response})

if __name__ == '__main__':
    app.run(debug=True)
