import openai
import sys
import json
import os

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv('OPENAI_API')

def classify_url(title, url):
    prompt = f"Classify the following URL and title into one of the categories: Entertainment, Study, Work, Personal, Important, Later, Shopping.\n\nURL: {url}\nTitle: {title}\nCategory: and just return the category name and nothing else. "

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant for bookmark organiser."},
            {"role": "user", "content": prompt}
        ]
    )
    return completion.choices[0].message.content.strip()

try:
    # Read input from Node.js
    input_data = json.loads(sys.stdin.read())
    title = input_data['title']
    url = input_data['url']

    # Get the category
    category = classify_url(title, url)

    # Output the result to Node.js
    print(json.dumps({"category": category}))
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
