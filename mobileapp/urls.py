from django.urls import path
from . import views

urlpatterns = [
    path('',views.register,name = 'register'),
    path('login/',views.user_login,name = 'login'),
    path('index/',views.home,name='index'),
    path('logout/',views.logout_view,name='logout'),
    path('submit-review/',views.submit_review,name = 'submit_review'),
    path('get-reviews/', views.get_reviews, name='get_reviews'),
]