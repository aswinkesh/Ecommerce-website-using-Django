# Generated by Django 5.1.7 on 2025-03-23 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_product_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.CharField(default='Other', max_length=200),
        ),
    ]
