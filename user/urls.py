from django.urls import path
from .views import signup, login, protected_view, add_address

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('protected/', protected_view, name='protected'),
    path('address/', add_address, name='add_address')
]
