from rest_framework import serializers
from .models import FoodItem

class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'vendor', 'name', 'description', 'price', 'image']
        read_only_fields = ['id', 'vendor']

    def create(self, validated_data):
        validated_data['vendor'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, data):
        if data.get('price', 0) <= 0:
            raise serializers.ValidationError({'price': 'Price must be greater than zero.'})
        return data
