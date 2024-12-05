from django.urls import path
from .views import signup, login, protected_view

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('protected/', protected_view, name='protected')
]
