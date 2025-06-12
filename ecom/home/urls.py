from django.urls import path
from . import views

urlpatterns = [
    path('home/',views.home,name='home'),
    path('category/', views.category_view, name='category'),
    path('profile/',views.profile,name='profile'),
    path('update-profile/', views.update_profile, name='update_profile'),
    path('remove-profile-picture/', views.remove_profile_picture, name='remove_profile_picture'),
    path('product/<int:product_id>/', views.product_detail, name='product_detail'),
    path('contact/', views.contact, name='contact'),
    path('terms/', views.terms, name='terms'),
    path('about/', views.about, name='about'),
    path('food/', views.food, name='food'),
    path('arts/', views.arts, name='arts'),
    path('clothes/', views.clothes, name='clothes'),
    path('faq/', views.faq, name='faq'),
]



#The product_id is a dynamic parameter that will be passed to the product_detail view.