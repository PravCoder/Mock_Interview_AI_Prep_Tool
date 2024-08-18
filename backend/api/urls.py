from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"), # when path is visited load view
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("get-foo/", views.get_foo, name="get-foo"),
    path("create-foo/", views.create_foo, name="create-foo"),
]