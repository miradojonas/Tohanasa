import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# ✅ Clé API Gemini (à remplacer si besoin)
GEMINI_API_KEY = ""

# Configuration de l'API Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Fonction qui envoie un message à Gemini
def ask_gemini(message):
    try:
        model = genai.GenerativeModel(model_name="models/gemini-1.5-flash")
        response = model.generate_content(message)

        # Vérifie et extrait le texte de la réponse
        if response and response.candidates:
            return response.candidates[0].content.parts[0].text
        else:
            return "Je n'ai pas pu générer de réponse."
    except Exception as e:
        print("Erreur Gemini :", e)
        return "Une erreur est survenue lors de la génération de la réponse."

# Vue Django du chatbot
@csrf_exempt  # ❗ Utile pour tests avec React sans token CSRF
def chatbot(request):
    if request.method == 'POST':
        message = request.POST.get('message')
        if not message:
            return JsonResponse({'error': 'Aucun message reçu'}, status=400)

        response_text = ask_gemini(message)
        return JsonResponse({'message': message, 'response': response_text})

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)
