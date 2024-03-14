import azure.cognitiveservices.speech as speechsdk
from pytube import YouTube
import os
import subprocess
import openai
import random
import whisper
import re
import json
from werkzeug.utils import secure_filename
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from pytube.exceptions import AgeRestrictedError
from pydub import AudioSegment
import math
import concurrent.futures
import logging
import time
import pydub

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

azure_connection_string = 'DefaultEndpointsProtocol=https;AccountName=eduaistorage;AccountKey=JJ5hey8NTb8I+afO+CsZanvCpKBrvE2eCwkniwA37wOorTQkYHBKawWc9YCP6XIeQChVbQ18dD9++AStAeuqVA==;EndpointSuffix=core.windows.net'
container_name = 'eduaistorage'

# Summarize text with GPT-3.5
#def summarize_text_with_gpt(text, openai_api_key):
#    openai.api_key = openai_api_key
#    try:
#        response = openai.Completion.create(
#            engine="gpt-4-turbo-preview",
#            prompt="Summarize the following text:\n\n" + text,
#            max_tokens=550
#        )
#        return response['choices'][0]['text'].strip()
#    except Exception as e:
#        print("Error with OpenAI request:", e)
#        return ""


def summarize_text_with_gpt(text, openai_api_key):
    openai.api_key = openai_api_key

    try:
        chat_response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",  # Use the correct model identifier for GPT-4 turbo chat
            messages=[
                {"role": "system", "content": "You are a highly efficient summarizer."},
                {"role": "user", "content": f"Please summarize this text: {text}"}
            ],
            temperature=0.5,  # You can adjust temperature for creativity control
            max_tokens=550,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )

        # Extracting and returning the summary from the chat response
        return chat_response.choices[0].message['content'].strip()
    except Exception as e:
        print("Error with OpenAI Chat request:", e)
        return ""



def generate_essay_feedback(essay_text, openai_api_key):
    openai.api_key = openai_api_key

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",  # Adjust the model as necessary
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an intelligent assistant skilled in English composition and analysis. "
                        "Your task is to provide detailed feedback on the submitted essay. "
                        "Focus on structure, grammar, style, content relevance and depth, and originality. "
                        "Offer constructive suggestions for improvement and predict the possible grade based on common academic standards."
                    )
                },
                {
                    "role": "user",
                    "content": f"Here's the essay:\n\n{essay_text}\n\nProvide feedback and improvement suggestions."
                }
            ],
            temperature=0.7,
            max_tokens=2000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )

        feedback_content = response.choices[0].message['content']
        print(feedback_content)

        return feedback_content
    except Exception as e:
        print(f"An error occurred while generating essay feedback: {e}")
        return "An error occurred"


def generate_study_guide(text, openai_api_key):
    openai.api_key = openai_api_key

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a highly intelligent assistant with expertise in creating educational content. "
                        "Your task is to analyze the provided educational material and generate a structured study guide. "
                        "The guide should include: \n\n"
                        "1. A brief summary that encapsulates the main themes and ideas.\n"
                        "2. A list of key concepts mentioned in the material, each accompanied by a concise explanation or definition.\n"
                        "3. A set of practice questions that cover the material comprehensively, including multiple choice, true/false, and short answer questions. "
                        "Provide correct answers and brief explanations for each question.\n"
                        "4. An overview of important dates and figures mentioned in the material, with a brief explanation of their significance.\n\n"
                        "Organize the study guide clearly and logically, ensuring it serves as an effective learning tool for students seeking to understand and remember the material."
                    )
                },
                {
                    "role": "user",
                    "content": f"Here's the educational material:\n\n{text}\n\nGenerate the study guide now."
                }
            ],
            temperature=0.5,
            max_tokens=2000,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )

        guide_content = response.choices[0].message['content']
        print(guide_content)

        return guide_content
    except Exception as e:
        print(f"An error occurred while generating the study guide: {e}")
        return "An error occurred"



#def get_transcript(youtube_url, transcript_option):
    # Download the YouTube video's audio
#    downloaded_audio = az_test.download_youtube_audio(youtube_url)

    # Convert the audio to WAV format
#    converted_audio = az_test.convert_to_wav(downloaded_audio)

    # Transcribe the audio using Whisper
#    transcription = az_test.transcribe_with_whisper(converted_audio)

    # Extract the requested portion of the transcript
#    selected_transcript = extract_transcript_portion(transcription, transcript_option)

#    return selected_transcript


def generate_flash_card(transcript, openai_api_key):
    openai.api_key = openai_api_key

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",  # Adjust model as necessary
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a sophisticated educational assistant designed to facilitate learning. "
                        "Your current task is to analyze the provided educational material and generate flashcards that succinctly capture the essence of the content. "
                        "Each flashcard should contain: \n\n"
                        "1. A clear and engaging question that prompts recall or application of a specific concept from the material.\n"
                        "2. A concise, accurate answer that provides insight or clarification, enhancing the learner's understanding.\n"
                        "3. A brief explanation or fact to enrich the answer, where applicable, making the flashcard not just a tool for memorization, but also for learning.\n\n"
                        "Ensure that the flashcards cover a broad range of topics from the material, are easy to understand, and are crafted to aid in effective study and retention."
                    )
                },
                {
                    "role": "user",
                    "content": f"Here's the educational material:\n\n{transcript}\n\nPlease generate the flashcards now."
                }
            ],
            temperature=0.5,
            max_tokens=1500,  # Adjust based on the desired number and depth of flashcards
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
        )

        flash_cards_content = response.choices[0].message['content']
        print(flash_cards_content)

        return flash_cards_content
    except Exception as e:
        print(f"An error occurred while generating the flash cards: {e}")
        return "An error occurred"


def download_from_azure_blob(blob_name):
    blob_service_client = BlobServiceClient.from_connection_string(azure_connection_string)
    blob_client = blob_service_client.get_blob_client(container=container_name, blob=blob_name)
    download_folder = "downloads"

    if not os.path.exists(download_folder):
        os.makedirs(download_folder)

    download_file_path = os.path.join(download_folder, blob_name)
    with open(download_file_path, "wb") as download_file:
        download_file.write(blob_client.download_blob().readall())

    return download_file_path

# Generate quiz questions from a transcript


def generate_quiz_from_transcript(transcription, openai_api_key):
    openai.api_key = openai_api_key

    # Refined instructions with explicit formatting requirements
    system_prompt = (
        "You are an advanced assistant tasked with creating educational quiz content based on the provided text. "
        "Generate 10 multiple-choice questions following this exact format:\n\n"
        "1. Question text?\n"
        "A) Option A\n"
        "B) Option B\n"
        "C) Option C\n"
        "D) Option D\n"
        "**Correct Answer: B) Option B.** Explanation for why Option B is correct.\n\n"
        "Each question should have four options labeled A, B, C, and D. After presenting the options, "
        "indicate the correct answer in bold with '**Correct Answer:**', followed by the letter of the correct option, "
        "the option text, and a brief explanation. Maintain this structure consistently across all questions. "
        "Avoid unnecessary line breaks, keep the content compact and clear, and ensure the response is engaging, "
        "informative, and accurately reflects the provided content. Do not use the words 'transcript' or 'text' within the questions."
    )

    try:
        chat_response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",  # Update to use the appropriate and latest model name
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Content:\n{transcription}"}
            ],
            temperature=0.5,
            max_tokens=1500,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )

        # Extract and format the quiz questions from the chat response
        quiz_questions = chat_response.choices[0].message['content'].strip()
        return quiz_questions
    except Exception as e:
        print(f"Error while generating quiz questions with GPT-4 Chat: {e}")
        return ""

# Get explanation for an answer
def get_explanation_for_answer(question, correct_answer, openai_api_key):
    openai.api_key = openai_api_key
    try:
        explanation_response = openai.Completion.create(
            engine="gpt-4-turbo-preview",
            prompt=f"Provide an explanation for the answer '{correct_answer}' to the question: {question}" ,
            max_tokens=250
        )
        return explanation_response['choices'][0]['text'].strip()
    except Exception as e:
        print("Error while generating explanation:", e)
        return ""


def download_youtube_audio(youtube_url, download_folder="downloads"):
    try:
        yt = YouTube(youtube_url)
        if yt.age_restricted:
            return True, None  # Indicate that the video is age-restricted
        video_stream = yt.streams.filter(file_extension='mp4').first()
        if not os.path.exists(download_folder):
            os.makedirs(download_folder)
        downloaded_file = os.path.join(download_folder, f"{yt.title}.mp4")

        if os.path.exists(downloaded_file):
            os.remove(downloaded_file)

        video_stream.download(output_path=download_folder, filename=f"{yt.title}.mp4")
        return False, downloaded_file
    except AgeRestrictedError:
        return True, None


def parse_quiz_questions(quiz_questions_text):
    # Split the text into separate questions using regex
    questions_split = re.split(r'\n(?=\d+\.)', quiz_questions_text.strip())
    quiz_questions = []

    for question_text in questions_split:
        if question_text.strip():
            # Split question text and options
            # Assuming the last line is 'Answer: <option>'
            parts = question_text.strip().split('\n')
            question = parts[0].strip()  # The first line is the question
            options = parts[1:-1]  # Options are in between question and answer
            answer = parts[-1].strip() if len(parts) > 1 else None  # Last line is the answer

            # Remove the option labels (A), (B), (C), (D)
            parsed_options = [re.sub(r'^[A-D]\)', '', option, flags=re.IGNORECASE).strip() for option in options if option.strip()]

            quiz_questions.append({
                'text': question,
                'options': parsed_options,
                'answer': re.sub(r'Answer: [A-D]\)', '', answer, flags=re.IGNORECASE).strip() if answer else None
            })

    return quiz_questions

# Convert video to WAV format
def convert_to_wav(input_file):
    output_file = os.path.splitext(input_file)[0] + '.wav'
    subprocess.run(['ffmpeg', '-y', '-i', input_file, '-ab', '160k', '-ar', '44100', '-vn', output_file])
    return output_file


def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    # Check if the directory string is not empty
    if directory and not os.path.exists(directory):
        os.makedirs(directory)

def split_audio(audio_path, chunk_length_ms='60000'):
    # Ensure chunk_length_ms is an integer
    chunk_length_ms = int(chunk_length_ms)
    
    audio = AudioSegment.from_file(audio_path)
    chunk_count = math.ceil(len(audio) / chunk_length_ms)
    
    # Define the path for the chunks folder
    chunks_folder = "chunks/"
    if not os.path.exists(chunks_folder):
        os.makedirs(chunks_folder)
    
    chunk_paths = []
    for i in range(chunk_count):
        chunk_start_ms = i * chunk_length_ms
        chunk_end_ms = min(len(audio), (i + 1) * chunk_length_ms)
        chunk = audio[chunk_start_ms:chunk_end_ms]
        chunk_path = os.path.join(chunks_folder, f"{os.path.basename(audio_path)}_chunk{i}.wav")
        chunk.export(chunk_path, format="wav")
        chunk_paths.append(chunk_path)
        logging.info(f"Chunk created and exported: {chunk_path}")
    return chunk_paths

def transcribe_with_whisper(audio_filename, output_dir="transcriptions"):
    # Capture the start time for the chunk
    start_time_chunk = time.time()
    
    logging.info(f"Starting transcription for {audio_filename}...")
    model = whisper.load_model("base")
    result = model.transcribe(audio_filename)
    transcription = result["text"]
    
    # Calculate the elapsed time for the chunk
    elapsed_time_chunk = time.time() - start_time_chunk
    logging.info(f"Completed transcription for {audio_filename} in {elapsed_time_chunk:.2f} seconds")
    
    # Ensure the output directory exists
    ensure_dir(output_dir)
    
    # Construct the path for the output text file based on the audio filename
    output_file_path = os.path.join(output_dir, os.path.basename(audio_filename).replace(".wav", ".txt"))
    
    # Write the transcription to the text file
    with open(output_file_path, 'w', encoding='utf-8') as file:
        file.write(transcription)
    
    logging.info(f"Transcription for {audio_filename} written to {output_file_path}")
    
    return transcription, elapsed_time_chunk

def transcribe_audio_chunks(audio_path, chunk_length_ms=60000, output_dir="transcriptions"):
    chunk_paths = split_audio(audio_path, chunk_length_ms)
    transcriptions = [None] * len(chunk_paths)  # Pre-allocate list with None
    total_elapsed_time = 0

    with concurrent.futures.ThreadPoolExecutor() as executor:
        # Create a future for each chunk
        future_to_index = {executor.submit(transcribe_with_whisper, chunk_path, output_dir): i for i, chunk_path in enumerate(chunk_paths)}

        for future in concurrent.futures.as_completed(future_to_index):
            index = future_to_index[future]
            transcription, elapsed_time_chunk = future.result()
            transcriptions[index] = transcription  # Place transcription in the correct order
            total_elapsed_time += elapsed_time_chunk

    # Join all chunk transcriptions into a full transcription, skipping None values
    full_transcription = " ".join(filter(None, transcriptions))
    
    logging.info(f"Total transcription time for all chunks: {total_elapsed_time:.2f} seconds")
    
    return full_transcription, total_elapsed_time




def infer_correct_answers(quiz_questions, openai_api_key):
    correct_answers = []
    for question in quiz_questions:
        prompt = f"Which is the correct answer for the following multiple-choice question?\n\nQuestion: {question['question']}\nOptions:\n"
        for i, option in enumerate(question['options'], start=1):
            prompt += f"{chr(96+i)}) {option}\n"
        
        try:
            response = openai.Completion.create(
                engine="gpt-3.5-turbo-instruct",
                prompt=prompt,
                max_tokens=20,
                openai_api_key=openai_api_key
            )
            inferred_answer = response['choices'][0]['text'].strip().lower()
            # Assuming the response is in the form of 'a', 'b', 'c', 'd', etc.
            correct_answers.append(inferred_answer)
        except Exception as e:
            print(f"Error while inferring correct answer for a question: {e}")
            correct_answers.append('unknown')  # Placeholder in case of an error

    return correct_answers


def interactive_quiz(quiz_questions, openai_api_key):
    random.shuffle(quiz_questions)  # Shuffle the questions
    user_answers = []  # List to store user's answers

    for question in quiz_questions:
        print(question['question'])
        options = question['options']
        random.shuffle(options)  # Shuffle the options for variety

        # Create a dictionary to store explanations for each option
        explanations = {}

        for i, option in enumerate(options, start=1):
            print(f"{chr(96+i)}) {option}")

            # Provide an explanation for each option
            explanation = get_explanation_for_option(question, option, openai_api_key)
            explanations[chr(96+i)] = explanation

        user_answer = input("Your answer: ").strip().lower()
        while user_answer not in [chr(96+i) for i in range(1, len(options) + 1)]:
            print("Please choose a valid option (A, B, C, etc.)")
            user_answer = input("Your answer: ").strip().lower()

        # Print the explanation for the chosen option
        print(f"Explanation for {user_answer}: {explanations[user_answer]}\n")

        # Collect user's answer
        user_answers.append(user_answer)

    return user_answers


# Reusing the previously defined grade_quiz function
def grade_quiz(correct_answers, user_answers):
    correct_count = sum(1 for correct, user in zip(correct_answers, user_answers) if correct == user)
    total_questions = len(correct_answers)
    grade = (correct_count / total_questions) * 100

    if grade >= 90:
        comment = "Excellent work!"
    elif grade >= 75:
        comment = "Good job, but there's room for improvement."
    elif grade >= 50:
        comment = "Passed, but you might need to study more."
    else:
        comment = "Needs improvement. Keep trying!"

    return grade, comment

def get_explanation_for_option(question, option, openai_api_key):
    openai.api_key = openai_api_key
    try:
        explanation_response = openai.Completion.create(
            engine="gpt-3.5-turbo-instruct",
            prompt=f"Provide an explanation for choosing option '{option}' in the question: {question['question']}",
            max_tokens=100
        )
        return explanation_response['choices'][0]['text'].strip()
    except Exception as e:
        print("Error while generating explanation:", e)
        return ""

def read_quiz_questions(file_path):
    quiz_questions = []
    with open(file_path, 'r') as file:
        lines = file.readlines()

    current_question = {}
    for line in lines:
        line = line.strip()
        if not line:
            continue  # Skip empty lines

        if line.endswith('?'):
            # Start of a new question
            if current_question:
                quiz_questions.append(current_question)
            current_question = {'question': line, 'options': []}
        else:
            # Option line
            current_question['options'].append(line)

    # Add the last question
    if current_question:
        quiz_questions.append(current_question)

    return quiz_questions


def main():
    openai_api_key = "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"
    #speech_key = ""
    #region = ""

    youtube_url = "https://www.youtube.com/watch?v=c0m6yaGlZh4"
    downloaded_video = download_youtube_audio(youtube_url)
    converted_audio = convert_to_wav(downloaded_video)

    transcription = transcribe_with_whisper(converted_audio)
    summary = summarize_text_with_gpt(transcription, openai_api_key)
    quiz_questions_text = generate_quiz_from_transcript(transcription, openai_api_key)

    quiz_questions_file_path = 'generated_quiz_questions.txt'

    with open(quiz_questions_file_path, 'w') as file:
        file.write(quiz_questions_text)

    quiz_questions = read_quiz_questions(quiz_questions_file_path)

    # Infer Correct Answers
    correct_answers = infer_correct_answers(quiz_questions, openai_api_key)

    # Conduct the Quiz
    user_answers = interactive_quiz(quiz_questions, openai_api_key)

    # Grade the Quiz
    grade, comment = grade_quiz(correct_answers, user_answers)

    # Display the Grade and Comment
    print(f"Your grade: {grade}%")
    print(f"Comment: {comment}")
# Main program
openai_api_key = "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"
#speech_key = "09616798480a46338e81e994c9489a2a"
#region = "francecentral"

#youtube_url = "https://www.youtube.com/watch?v=c0m6yaGlZh4"
#downloaded_video = download_youtube_audio(youtube_url)
#converted_audio = convert_to_wav(downloaded_video)

#transcription = transcribe_with_whisper(converted_audio)

#print("Transcription:", transcription)

#summary = summarize_text_with_gpt(transcription, openai_api_key)
#print("Summary:", summary)

#quiz_questions_text = generate_quiz_from_summary(summary, openai_api_key)
#print("Generated Quiz Questions:\n", quiz_questions_text)


#quiz_questions_file_path = 'generated_quiz_questions.txt'

#with open(quiz_questions_file_path, 'w') as file:
#    file.write(quiz_questions_text)


#quiz_questions = read_quiz_questions(quiz_questions_file_path)

# Infer Correct Answers
#correct_answers = infer_correct_answers(quiz_questions, openai_api_key)

# Conduct the Quiz
#user_answers = interactive_quiz(quiz_questions, openai_api_key)

# Grade the Quiz
#grade, comment = grade_quiz(correct_answers, user_answers)

# Display the Grade and Comment
#print(f"Your grade: {grade}%")
#print(f"Comment: {comment}")

if __name__ == '__main__':
    main()
