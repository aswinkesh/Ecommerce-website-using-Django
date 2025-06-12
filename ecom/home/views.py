import os
import uuid
from django.contrib.auth import get_user_model
from django.forms import ValidationError
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.shortcuts import render, get_object_or_404
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from products.models import Product

User = get_user_model()

def home(request):
    # Fetch all products from the database
    products = Product.objects.all()
    return render(request, 'home/home.html', {'user_name': request.user.username,'products': products,})

def category(request):
    return render(request, 'home/category.html')
def contact(request):
    return render(request, 'home/contact.html')
def terms(request):
    return render(request, 'home/terms.html')
def about(request):
    return render(request, 'home/about.html')
def food(request):
    return render(request, 'home/food.html')
def arts(request):
    return render(request, 'home/arts.html')
def clothes(request):
    return render(request, 'home/clothes.html')
def faq(request):
    return render(request, 'home/faq.html')


@login_required
def profile(request):
    products = Product.objects.filter(user=request.user)#fetchingAllPrdsFromDbOfUser
    company_name = products[0].cmp_name if products else "No company name available"
    return render(request, 'home/profile.html', {'user': request.user,'products': products,'company_name': company_name,})

@login_required
@csrf_exempt
def update_profile(request):
    if request.method == 'POST':
        user = request.user
        data = request.POST
        print("Received Data:", data)


        # Update user fields
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.phone_number = data.get('phone', user.phone_number)
        user.address = data.get('address', user.address)
        
        # for debugging print statements
        print("Updated User Fields:")
        print("Username:", user.username)
        print("Email:", user.email)
        print("First Name:", user.first_name)
        print("Last Name:", user.last_name)
        print("Phone:", user.phone_number)
        print("Address:", user.address)

        # Check if username already exists
        if User.objects.exclude(pk=user.pk).filter(username=user.username).exists():
            return JsonResponse({'error': 'Username already exists.'}, status=400)

        # Update company name in the Product model
        new_company_name = data.get('company_name')
        print("New Company Name:", new_company_name)
        if new_company_name:
            # Update the company name for all products linked to the user
            products = Product.objects.filter(user=user)
            products.update(cmp_name=new_company_name)

        # Handle profile picture upload
        if 'imageUpload' in request.FILES:
            try:
                image = request.FILES['imageUpload']
                allowed_types = ['image/jpeg', 'image/png', 'image/gif']
                if image.content_type not in allowed_types:
                    raise ValidationError('Invalid file type. Only JPEG, PNG, and GIF are allowed.')
                file_ext = os.path.splitext(image.name)[1]  # Get file extension
                unique_name = f'{user.username}_{uuid.uuid4()}{file_ext}'
                file_path = f'profile_pictures/{unique_name}'

                # Delete the old profile picture if it exists
                if user.profile_picture:
                    if default_storage.exists(user.profile_picture.name):
                        default_storage.delete(user.profile_picture.name)

                # Save the new file
                file_name = default_storage.save(file_path, ContentFile(image.read()))

                # Update the user's profile picture
                user.profile_picture = file_name
            except ValidationError as e:
                return JsonResponse({'error': str(e)}, status=400)
            except Exception as e:
                return JsonResponse({'error': 'An error occurred while uploading the file.'}, status=500)
        user.save()
        print("User saved successfully!")

        return JsonResponse({'message': 'Profile updated successfully!'})
    return JsonResponse({'error': 'Invalid request method.'}, status=400)

@login_required
@csrf_exempt
def remove_profile_picture(request):
    if request.method == 'POST':
        try:
            user = request.user

            # Delete the profile picture if it exists
            if user.profile_picture:
                if default_storage.exists(user.profile_picture.name):
                    default_storage.delete(user.profile_picture.name)
                user.profile_picture = None
                user.save()

            return JsonResponse({'message': 'Profile picture removed successfully!'})
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=400)

def product_detail(request, product_id):
    # Fetch the product or return a 404 error if not found
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'home/product_detail.html', {
        'product': product,
    })

from urllib.parse import unquote

def category_view(request):
    # Get the category from the URL parameter and decode it
    category_name = unquote(request.GET.get('category', ''))
    print("Category Name:", category_name)  # Debugging
    
    # Filter products by category
    products = Product.objects.filter(category=category_name, delete_status=Product.LIVE)
    print("Filtered Products:", products)  # Debugging
    
    # Pass the category name and filtered products to the template
    context = {
        'category_name': category_name,
        'products': products,
    }
    return render(request, 'home/category.html', context)