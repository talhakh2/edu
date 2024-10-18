from flask import Flask, request, jsonify, render_template, session, send_from_directory
from werkzeug.utils import secure_filename
import azure_speechtotext_test as az_test
import logging
from azure.storage.blob import BlobServiceClient
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from pytube.exceptions import AgeRestrictedError
from azure_speechtotext_test import download_youtube_audio


openai_api_key = ""

# Now you can use the download_youtube_audio function in the current script

def create_app():
#    app = Flask(__name__)
    app = Flask(__name__, static_folder='build', static_url_path='/')
    
    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    @app.route('/generate-quiz', methods=['POST'])
    def generate_quiz():
        try:
            data = request.json
            print("Received data:", data)  # Print received data
            youtube_url = data.get('youtube_url')
            if not youtube_url:
                return jsonify({'error': 'No YouTube URL provided'}), 400
            print("YouTube URL:", youtube_url)  # Print YouTube URL

        # Steps 2 & 3: Download, Convert and Transcribe
            downloaded_audio = az_test.download_youtube_audio(youtube_url)
            print("Downloaded Audio:", downloaded_audio)  # Print downloaded audio status
            if downloaded_audio[0]:  # Check if video is age-restricted
                return jsonify({'error': 'Age-restricted video'}), 400
            converted_audio = az_test.convert_to_wav(downloaded_audio[1])
            print("Converted Audio:", converted_audio)  # Print converted audio
            transcription = az_test.transcribe_with_whisper(converted_audio)
            print("Transcription:", transcription)  # Print transcription

        # Step 4: Generate Quiz
            quiz_questions_text = az_test.generate_quiz_from_transcript(transcription, az_test.openai_api_key)
            print("Quiz Questions Text:", quiz_questions_text)  # Print quiz questions text
            if not quiz_questions_text:
                return jsonify({'error': 'Failed to generate quiz questions'}), 500
            else:
            # Return the quiz questions text as a JSON response without parsing
                return jsonify({'questions_text': quiz_questions_text})

        except Exception as e:
            print("Error:", e)  # Print the exception
            return jsonify({'error': str(e)}), 500



    @app.route('/generate_essay_feedback', methods=['POST'])
    def handle_generate_essay_feedback():
        try:
            data = request.json
            if not data or 'essay_text' not in data:
                return jsonify({'error': 'No essay text provided'}), 400

            essay_text = data['essay_text']

            feedback = generate_essay_feedback(essay_text, openai_api_key)

            return jsonify({'feedback': feedback})

        except Exception as e:
            return jsonify({'error': f"An error occurred: {str(e)}"}), 500


    @app.route('/generate_study_guide', methods=['POST'])
    def generate_study_guide():
        try:
            data = request.json
            print("Received data:", data)  # Print received data
            youtube_url = data.get('youtube_url')
            if not youtube_url:
                return jsonify({'error': 'No YouTube URL provided'}), 400
            print("YouTube URL:", youtube_url)  # Print YouTube URL

        # Steps 2 & 3: Download, Convert and Transcribe
            downloaded_audio = az_test.download_youtube_audio(youtube_url)
            print("Downloaded Audio:", downloaded_audio)  # Print downloaded audio status
            if downloaded_audio[0]:  # Check if video is age-restricted
                return jsonify({'error': 'Age-restricted video'}), 400
            converted_audio = az_test.convert_to_wav(downloaded_audio[1])
            print("Converted Audio:", converted_audio)  # Print converted audio
            transcription = az_test.transcribe_with_whisper(converted_audio)
            print("Transcription:", transcription)  # Print transcription

        # Step 4: Generate Study Guide
            study_guide = az_test.generate_study_guide(transcription, az_test.openai_api_key)
            print("Generated Study Guide:", study_guide)  
            if not study_guide:
                return jsonify({'error': 'Failed to generate study guide'}), 500
            else:
                
                return jsonify({'study_guide': study_guide})

        except Exception as e:
            print("Error:", e)  # Print the exception
            return jsonify({'error': str(e)}), 500


    @app.route('/generate-flash-cards', methods=['POST'])
    def generate_flash_cards():
        try:
            data = request.json
            print("Received data:", data)  # Print received data
            youtube_url = data.get('youtube_url')
            if not youtube_url:
                return jsonify({'error': 'No YouTube URL provided'}), 400
            print("YouTube URL:", youtube_url)  # Print YouTube URL

        # Steps 2 & 3: Download, Convert and Transcribe
            downloaded_audio = az_test.download_youtube_audio(youtube_url)
            print("Downloaded Audio:", downloaded_audio)  # Print downloaded audio status
            if downloaded_audio[0]:  # Check if video is age-restricted
                return jsonify({'error': 'Age-restricted video'}), 400
            converted_audio = az_test.convert_to_wav(downloaded_audio[1])
            print("Converted Audio:", converted_audio)  # Print converted audio
            transcription = az_test.transcribe_with_whisper(converted_audio)
            print("Transcription:", transcription)  # Print transcription

        # Step 4: Generate Flash Cards
            flash_cards = az_test.generate_flash_card(transcription, az_test.openai_api_key)
            print("Generated Flash Cards:", flash_cards)  # Print generated flash cards
            if not flash_cards:
                return jsonify({'error': 'Failed to generate flash cards'}), 500
            else:
                # Return the generated flash cards as a JSON response
                return jsonify({'flash_cards': flash_cards})

        except Exception as e:
            print("Error:", e)  # Print the exception
            return jsonify({'error': str(e)}), 500



    @app.route('/process_youtube_url', methods=['POST'])
    def process_youtube_url():
        data = request.json
        youtube_url = data.get('youtube_url')
        output_choice = data.get('output_choice')

        is_age_restricted, downloaded_video = az_test.download_youtube_audio(youtube_url)
        if is_age_restricted:
            return jsonify({'error': 'The video is age-restricted and cannot be processed.'}), 400
        converted_audio = az_test.convert_to_wav(downloaded_video)
        transcription = az_test.transcribe_with_whisper(converted_audio)


        if output_choice == 'transcript':
            return jsonify(transcript=transcription)
        elif output_choice == 'summary':
            summary = az_test.summarize_text_with_gpt(transcription, az_test.openai_api_key)
            return jsonify(summary=summary)

        elif output_choice == 'quiz':
            transcription = az_test.transcribe_with_whisper(converted_audio)
            quiz_questions_text = az_test.generate_quiz_from_transcript(transcription, az_test.openai_api_key)
            #quiz_questions = az_test.parse_quiz_questions(quiz_questions_text)
            #correct_answers = az_test.infer_correct_answers(quiz_questions, az_test.openai_api_key)

            return jsonify(quiz_questions=quiz_questions_text)
        else:
        # Handle unexpected output_choice values
            return jsonify({'error': 'Invalid output choice provided.'}), 400

    @app.route('/upload_video', methods=['POST'])
    def upload_video():
        uploaded_file = request.files.get('file')

        if uploaded_file:
            filename = secure_filename(uploaded_file.filename)
            upload_folder = "uploads"
            if not os.path.exists(upload_folder):
                os.makedirs(upload_folder)
            file_path = os.path.join(upload_folder, filename)
            uploaded_file.save(file_path)

            upload_to_azure_blob(file_path, filename)
            converted_audio = convert_to_wav(file_path)
            transcription = transcribe_with_whisper(converted_audio)
            summary = summarize_text_with_gpt(transcription)
            quiz_questions_text = generate_quiz_from_summary(summary)
            quiz_questions = parse_quiz_questions(quiz_questions_text)
            correct_answers = infer_correct_answers(quiz_questions)

            processed_data = {
                'transcription': transcription,
                'summary': summary,
                'quiz_questions': quiz_questions,
                'correct_answers': correct_answers
            }

            response_data = {
                'message': 'Video file uploaded and processed successfully',
                'processed_data': processed_data
            }
            return jsonify(response_data)
        else:
            return jsonify({'error': 'No file uploaded'})

    @app.route('/process_video_url', methods=['POST'])
    def process_video_url():
        data = request.json
        video_url = data.get('video_url')
        response_data = {'message': 'Video URL processed successfully'}
        return jsonify(response_data)

    @app.route('/submit_answers', methods=['POST'])
    def submit_answers():
        user_answers = request.json.get('answers')
        grade, comment = az_test.grade_quiz(correct_answers, user_answers)
        return jsonify(grade=grade, comment=comment)


    def extract_transcript_portion(transcript, option):
        options = {
            'whole': lambda x: x,
            'first_half': lambda x: extract_portion(x, 0, 0.5),
            'second_half': lambda x: extract_portion(x, 0.5, 1),
            'first_quarter': lambda x: extract_portion(x, 0, 0.25),
            'second_quarter': lambda x: extract_portion(x, 0.25, 0.5),
            'third_quarter': lambda x: extract_portion(x, 0.5, 0.75),
            'last_quarter': lambda x: extract_portion(x, 0.75, 1)
        }
        return options.get(option, lambda x: x)(transcript)

    def extract_portion(transcript, start_ratio, end_ratio):
        lines = transcript.split('\n')
        start = int(len(lines) * start_ratio)
        end = int(len(lines) * end_ratio)
        return '\n'.join(lines[start:end])

    return app

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
