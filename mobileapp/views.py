from django.shortcuts import render,redirect
from mobileapp.forms import userForm,userProfile
from django.http import HttpResponse
from django.contrib.auth import authenticate,login,logout 
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
import json
from django.http import JsonResponse
from .models import Review



def register(request):
    if request.method == 'POST':
        form  = userForm(request.POST)
        form1 = userProfile(request.POST,request.FILES)
        if form.is_valid() and form1.is_valid():
            user = form.save(commit=False)
            user.set_password(user.password)
            user.save()

            profile = form1.save(commit=False)
            profile.user = user
            profile.save()
        return redirect('/login')
    else:
        form = userForm()
        form1 = userProfile()
    context = {
        'form':form,
        'form1':form1
    }
    return render(request,'register.html',context)


def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user=authenticate(username= username,password = password)
        if user:
            if user.is_active:
                login(request,user)
                return (redirect('/index/'))
            else:
                return HttpResponse('user not active')
        else:
            return HttpResponse('Please Check Again')
    return render(request,'login.html')

def home(request):
    return render(request,'index.html')

def logout_view(request):
    logout(request)
    return redirect('/login/')

def submit_review(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            if not request.user.is_authenticated:
                return JsonResponse({'error':'Login required'},status=401)
            
            rating_value = data.get('rating')
            if rating_value in [None, '', 0]:
                    return JsonResponse({'error': 'Rating required'}, status=400)
            Review.objects.create(
                user = request.user,
                movie_title = data.get('movie_title',''),
                rating =int(rating_value),
                review =  data.get('review',''),
            )
            return JsonResponse({'status':'success'})
        except Exception as e:
            print("ERROR: ",e)
            return JsonResponse({'error':str(e)},status=500)
        

def get_reviews(request):
    movie_title = request.GET.get('movie_title')

    reviews = Review.objects.filter(
        movie_title=movie_title
    ).order_by('-id')[:5]

    data = []

    for review in reviews:
        data.append({
            'user': review.user.username,
            'rating': review.rating,
            'review': review.review
        })

    return JsonResponse(data, safe=False)

# Create your views here.
