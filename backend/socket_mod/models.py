from django.db import models

# Create your models here.
class DataBase(models.Model):
    group_name=models.CharField(max_length=400);
    channel_name=models.CharField(max_length=400);
    

