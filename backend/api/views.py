from django.shortcuts import render
from rest_framework import generics
from .serializers import UserSerializer, JobSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User, Job, Interview
from rest_framework.response import Response


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