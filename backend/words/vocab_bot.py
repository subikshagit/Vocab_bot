from dotenv import load_dotenv
import os
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI   # ✅ LangChain OpenAI wrapper (works with OpenRouter)

# Load environment variables
load_dotenv()

def get_ai_definition(word: str) -> str:
    """
    Returns a detailed dictionary-style definition for a given word.
    Uses OpenRouter (via LangChain + ChatOpenAI).
    """

    # ✅ Verify API key
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return "❌ OPENROUTER_API_KEY not found in environment"

    # ✅ Prompt template for dictionary definition
    definition_template = """
    You are an AI-powered dictionary.

    Provide a detailed definition for the word: "{word}"

    Please include:
    1. The part of speech (noun, verb, adjective, etc.)
    2. A clear, beginner-friendly explanation
    3. One example sentence using the word
    4. (Optional) Related synonyms or antonyms
    """

    definition_prompt = PromptTemplate(
        input_variables=["word"],
        template=definition_template
    )

    # ✅ LLM setup (using OpenRouter endpoint)
    llm = ChatOpenAI(
        model="openai/gpt-4.1-mini",   # You can swap with "openai/gpt-4.1" or other OpenRouter-supported models
        temperature=0.5,
        max_tokens=500,
        openai_api_base="https://openrouter.ai/api/v1",
        openai_api_key=api_key,
    )

    # ✅ Combine prompt + model
    chain = definition_prompt | llm

    try:
        # Run chain with the input word
        response = chain.invoke({"word": word})
        return response.content.strip()
    except Exception as e:
        return f"⚠️ Error fetching definition: {str(e)}"
