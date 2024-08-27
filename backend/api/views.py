from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, JobSerializer, InterviewSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Job, Interview
from rest_framework.response import Response
from django.http import HttpResponse



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
    interview.status = "in progress"
    interview.save()
    interview_serializer = InterviewSerializer(interview)

    return Response({"interview":interview_serializer.data})



# TESTING PURPOSES ONLY BELOW
foo_db = ["foo1","foo1","foo1","foo1","foo1" ]
@api_view(["GET"]) # his view function will respond to HTTP GET requests. When a GET request is made to the corresponding URL (e.g., /api/hello-world/), this function will be invoked
def get_foo(request):
    print(f"USER: {request.user}")
    for user in User.objects.all():
        print(user)

    user_serializer = UserSerializer(request.user)
    return Response({'foo_list': foo_db, "user":user_serializer.data["email"]})

@api_view(["POST"]) # his view function will respond to HTTP GET requests. When a GET request is made to the corresponding URL (e.g., /api/hello-world/), this function will be invoked
def create_foo(request):
    print("HELLOasdasdasdasdasdasdasdasdas")
    content = request.data["content"]
    foo_db.append(content)
    return Response({'foo_list': foo_db})