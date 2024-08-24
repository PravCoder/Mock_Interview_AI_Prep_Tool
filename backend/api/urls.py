from django.urls import path
from . import views

urlpatterns = [

    path("create-job/", views.create_job, name="create_job"),
    path("get-jobs/", views.get_jobs, name="get_jobs"),
    path("delete-job/<str:pk>/", views.delete_job, name="delete_job"),
    path("get-job-one/<str:pk>/", views.get_job_one, name="get_job_one"),

    path("create-interview/<str:pk>/", views.create_interview, name="create_interview"),

    path("get-interviews-in-job/<str:pk>/", views.get_interviews_in_job, name="get-interviews-in-job"),


    # TESTING PURPOSES ONLY BELOW
    path("get-foo/", views.get_foo, name="get-foo"),
    path("create-foo/", views.create_foo, name="create-foo"),
]