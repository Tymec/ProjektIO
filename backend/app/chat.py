
# trzeba podlaczyc

import openai
import os
from django.shortcuts import render
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')


def chatbot(request):
    response = None
    openai.api_key = api_key
    if request.method == 'POST' and api_key is not None:
        user_input = request.POST.get('user_input')
        prompt = f"Recomend 10 products for a user that says this {user_input}"
        response = openai.Completion.create(
            engine="davinci",
            prompt=prompt,
            max_tokens=100,
            temperature=0.5,

        )
        print(response)
        chatbot_response = response['choices'][0]['text']
    return render(request, 'chat_display.jsx', {"response": chatbot_response})




