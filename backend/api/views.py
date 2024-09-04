from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, JobSerializer, InterviewSerializer, QuestionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Job, Interview, Question
from rest_framework.response import Response
from django.http import HttpResponse
# OPENAI STUFF
from dotenv import load_dotenv, find_dotenv
import os, re
load_dotenv()
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
import json


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(["POST"])
def create_job(request):
    print(f"Create Job: {request.data}")

    user = request.user
    job_title = request.data["selectedJob"]
    jobs_exists = False
    for job in list(user.jobs.all()):
        if job.title.lower() == job_title.lower():
            jobs_exists = True

    if jobs_exists == False:
        new_job = Job(title=job_title)
        new_job.save()
        user.jobs.add(new_job)
        user.save() 

        return Response({"message":"success"})
    else:
        return Response({"message":"failure"})

@api_view(["POST"])
def delete_job(request, pk):
    user = request.user
    print(pk)
    job_to_delete = Job.objects.get(id=int(pk))
    job_to_delete.delete()

    return Response({"message":"job sucessfully deleted"})

@api_view(["GET"])
def get_jobs(request):
    user = request.user
    serialized_jobs = []
    for job in list(user.jobs.all()):
        job_serializer = JobSerializer(job)
        serialized_jobs.append(job_serializer.data)

    return Response({"jobs":serialized_jobs})

@api_view(["GET"])
def get_job_one(request, pk):
    job = Job.objects.get(id=int(pk))
    job_serializer = JobSerializer(job)
    return Response({"job":job_serializer.data})


@api_view(["POST"])
def create_interview(request, pk):  # id of job specific to user
    user = request.user 

    job = Job.objects.get(id=int(pk)) # get the type of job-category this interview is in

    job_title = request.data["job_title"]
    job_description = request.data["job_description"]
    company_name = request.data["company_name"]
    company_description = request.data["company_description"]
    resume = request.FILES.get("resume")
    print(f"REQUEST DATA: {request.data}")
    print(f"Resume: {resume}")

    resume = request.FILES.get("resume")

    file_data = resume.read()  # Read the contents of the file
    file_text = file_data.decode('utf-8')  # Convert bytes to string (if it's a text file)
    print(file_text)

    new_interview = Interview.objects.create(job_title=job_title, job_description=job_description, company_name=company_name, company_description=company_description, resume_text=file_text)
    new_interview.save()
    job.interviews.add(new_interview)
    job.save()

    # ***GET QUESTIONS FROM OPENAI MODEL***
    natural_language_description = get_interview_description(new_interview.id)  # get the job description, company information, and resume text associated with interview in one string
    
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # create the model using api-key

    template = """You are conducting a Mock Job Interview, given job description, company information, resume information.
    Input: {input}

    Output: Give me 10 questions that a interviewer might ask in a interview, where each question is on a newline sperate by 1). 
    """  # create template for prompt, TBD: X number of questions

    prompt = PromptTemplate.from_template(template) # create prompt object from template-string

    formatted_prompt = prompt.format(input=natural_language_description) # format the prompt
    response = llm.invoke(formatted_prompt)                              # model.invoke(prompt) gives the models response
    content = response.content                                           # get the content of the response       
    metadata = response.response_metadata                                # get the usage_metadata={'input_tokens': 769, 'output_tokens': 313, 'total_tokens': 1082}
    usage_metadata = response.usage_metadata                             # get usage data of prompt and answer

    print(content)
    print(f"{usage_metadata=}")

    # ***CREATE QUESTION OBJECTS*** -  how the response.content shouold be
    questions_texts = re.split(r'\d+\)\s', content)
    questions_texts = [q for q in questions_texts if q]     # questions_texts=['Can you walk me through your experience as a UI/UX Designer at Quest Consultants?\n', ....]
    print(f"{questions_texts=}")
    
    for i, prompt in enumerate(questions_texts):  # iterate every question text and creaste question object and add question object to newly created interview
        question_obj = Question(prompt=prompt, timestep=i)  
        question_obj.save()
        new_interview.questions.add(question_obj)
        new_interview.save()

    return Response({"message":"succesfully created interview"})

@api_view(["GET"])
def get_interview_questions(request, pk):  
    interview = Interview.objects.get(id=int(pk))

    serialized_questions = []
    for question in list(interview.questions.all()):
        question_serializer = QuestionSerializer(question)
        serialized_questions.append(question_serializer.data)

    return Response({"questions":serialized_questions})


@api_view(["GET"])
def get_interviews_in_job(request, pk):    
    user = request.user
    job = Job.objects.get(id=int(pk))
    job_serializer = JobSerializer(job)

    serialized_interviews = []
    for interview in list(job.interviews.all()):
        interview_serializer = InterviewSerializer(interview)
        serialized_interviews.append(interview_serializer.data)

    return Response({"job":job_serializer.data, "interviews":serialized_interviews})


@api_view(["GET"])
def get_interview(request, pk):  
    user = request.user
    interview = Interview.objects.get(id=int(pk))
    interview_serializer = InterviewSerializer(interview)

    return Response({"interview":interview_serializer.data})

@api_view(["POST"])
def start_interview(request, pk):  
    user = request.user
    interview = Interview.objects.get(id=int(pk))
    interview.status = "in_progress"
    interview.save()
    interview_serializer = InterviewSerializer(interview)

    return Response({"interview":interview_serializer.data})

def get_interview_description(interview_id):
    try:
        interview = Interview.objects.get(id=interview_id)
        return (
            f"Job description: {interview.job_description}\n"
            f"Company information: {interview.company_name}\n"
            f"{interview.company_description}\n"
            f"Resume of candidate: {interview.resume_text}"
        )
    except Interview.DoesNotExist:
        raise ValueError(f"Interview with id {interview_id} does not exist.")

    
# TESTING PURPOSES ONLY BELOW
foo_db = ["foo1","foo1","foo1","foo1","foo1" ]
@api_view(["GET"]) 
def get_foo(request):
    natural_language_description = get_interview_description(5)
    # LANGCHAIN TESTING
    llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    template = """You are conducting a Mock Job Interview, given job description, company information, resume information.
    Input: {input}

    Output: Give me 10 questions that a interviewer might ask in a interview.
    """

    prompt = PromptTemplate.from_template(template)

    formatted_prompt = prompt.format(input=natural_language_description)
    response = llm.invoke(formatted_prompt)
    content = response.content
    metadata = response.response_metadata # usage_metadata={'input_tokens': 769, 'output_tokens': 313, 'total_tokens': 1082}
    usage_metadata = response.usage_metadata

    print(content)
    print(f"{usage_metadata=}")

    return Response({})

@api_view(["POST"]) 
def create_foo(request):
    print("HELLOasdasdasdasdasdasdasdasdas")
    content = request.data["content"]
    foo_db.append(content)
    return Response({'foo_list': foo_db})