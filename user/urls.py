from django.urls import path
from .views import signup, login, protected_view, logout

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('protected/', protected_view, name='protected'),
    path('logout/', logout, name='logout'),
]
