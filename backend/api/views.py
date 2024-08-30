from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, JobSerializer, InterviewSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Job, Interview
from rest_framework.response import Response
from django.http import HttpResponse
# OPENAI STUFF
from dotenv import load_dotenv, find_dotenv
import os
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

    
    return Response({"message":"succesfully created interview"})


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