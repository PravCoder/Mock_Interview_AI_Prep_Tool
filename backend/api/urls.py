from django.urls import path
from . import views

urlpatterns = [

    path("create-job/", views.create_job, name="create_job"),
    path("get-jobs/", views.get_jobs, name="get_jobs"),
    path("delete-job/<str:pk>/", views.delete_job, name="delete_job"),

    # TESTING PURPOSES ONLY BELOW
    path("get-foo/", views.get_foo, name="get-foo"),
    path("create-foo/", views.create_foo, name="create-foo"),
]