from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class userDetails(models.Model):
    user = models.OneToOneField(User,on_delete = models.CASCADE)

    age = models.IntegerField()
    userpic = models.ImageField(upload_to = 'userimg',blank = True)

class Review(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    movie_title =models.CharField(max_length=200)
    rating = models.IntegerField()
    review  = models.TextField()

    def __str__(self):
        return self.movie_title
