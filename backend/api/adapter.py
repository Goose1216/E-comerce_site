from allauth.account.adapter import DefaultAccountAdapter
from django.contrib.auth.models import AbstractUser


class MyDefaultAccountAdapter(DefaultAccountAdapter):
    error_messages = {
        "username_blacklisted": (
            "Username can not be used. Please use other username."
        ),
        "username_taken": AbstractUser.meta.get_field("username").error_messages[
            "unique"
        ],
        "too_many_login_attempts": (
            "Too many failed login attempts. Try again later."
        ),
        "email_taken": ("A user is already registered with this email address."),
        "enter_current_password": ("Please type your current password."),
        "incorrect_password": ("Incorrect password."),
        "unknown_email": ("The email address is not assigned to any user account"),
    }
