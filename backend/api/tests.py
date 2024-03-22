from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse


class CustomUserTest(APITestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            username='test',
            email='test@mail.ru',
            password='test1234'
        )
        self.assertEqual(user.username, 'test')
        self.assertEqual(user.email, 'test@mail.ru')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        User = get_user_model()
        user = User.objects.create_superuser(
            username='test',
            email='test@mail.ru',
            password='test1234'
        )
        self.assertEqual(user.username, 'test')
        self.assertEqual(user.email, 'test@mail.ru')
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)


class Authenthication(APITestCase):

    def test_login(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="testUser",
            email="test@Mail.ru",
            password='test1234'
        )
        response_name = self.client.post(reverse('rest_login'), {"username": "testUser",
                                                                 "password": "test1234"})
        self.assertEqual(response_name.status_code, 200)
        self.assertIn("key", response_name.json().keys())
        self.assertTrue(user.is_authenticated)

        response_email = self.client.post(reverse("rest_login"), {"username": "test@Mail.ru",
                                                                  "password": "test1234"})
        self.assertEqual(response_email.status_code, 200)
        self.assertIn("key", response_name.json().keys())

        response_wrong_data = self.client.post(reverse('rest_login'), {"username": "testUser",
                                                                       "password": "WrongPassword"})
        self.assertEqual(response_wrong_data.status_code, 400)
        self.assertEqual(response_wrong_data.json()["non_field_errors"][0],
                         "Невозможно войти в систему с указанными учётными данными.")

    def test_registration(self):
        User = get_user_model()
        url = reverse("rest_register")
        data = {"username": "testUser",
                "email": "testMail@mail.ru",
                "password1": "qwasxcvrtfg",
                "password2": "qwasxcvrtfg"
                }
        wrong_data = {"username": "testUser2",
                      "email": "testMail2@mail.ru",
                      "password1": "qwasxcvrtfg",
                      "password2": "test"
                      }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(User.objects.all().count(), 1)
        response_wrong = self.client.post(url, wrong_data)
        self.assertEqual(response_wrong.status_code, 400)
        self.assertEqual(User.objects.all().count(), 1)
        response_login = self.client.post(reverse('rest_login'), {"username": "testUser",
                                                                  "password": "qwasxcvrtfg"})
        self.assertEqual(response_login.status_code, 200)
        self.assertIn("key", response_login.json().keys())

    def test_email(self):
        pass
        # не получилось реализовать

    def test_password_change(self):
        User = get_user_model()
        user = User.objects.create_user(
            username="testUser",
            email="test@Mail.ru",
            password='test1234'
        )
        response_login = self.client.post(reverse('rest_login'), {"username": "testUser",
                                                                  "password": "test1234"})
        self.assertEqual(response_login.status_code, 200)
        response_password_change = self.client.post(reverse("rest_password_change"), {"new_password1": "qwasxcvrtfg",
                                                                                      "new_password2": "qwasxcvrtfg"})
        self.assertEqual(response_password_change.status_code, 200)
        response_login_new = self.client.post(reverse('rest_login'), {"username": "testUser",
                                                                      "password": "qwasxcvrtfg"})
        self.assertEqual(response_login_new.status_code, 200)
        response_login_old = self.client.post(reverse('rest_login'), {"username": "testUser",
                                                                      "password": "test1234"})
        self.assertEqual(response_login_old.status_code, 400)

    def test_password_reset(self):
        pass
