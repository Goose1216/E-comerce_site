from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers
from django.core.validators import RegexValidator

from dj_rest_auth.registration.serializers import RegisterSerializer


class CustomRegisterSerializer(RegisterSerializer):
    phone_regex = RegexValidator(regex=r'^(?:\+7|8)\d{10}$',
                                 message="Телефонный номер должен иметь вид: '(+7/8)1234567890'")
    phone_number = serializers.CharField(validators=[phone_regex], required=False, max_length=12)

    def get_cleaned_data(self):
        data_dict = super().get_cleaned_data()
        data_dict['phone_number'] = self.validated_data.get('phone_number', '')
        return data_dict


class CustomUserDetailsSerializer(UserDetailsSerializer):

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + \
            ('phone_number', 'date_joined')
        read_only_fields = UserDetailsSerializer.Meta.read_only_fields + \
           ('date_joined',)