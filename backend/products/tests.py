from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Brand, Category, Product
from django.template.defaultfilters import slugify


import json


class ProductTest(APITestCase):

    @classmethod
    def setUpTestData(cls):
        cls.brand = Brand.objects.create(
            name="testBrand"
        )
        cls.category1 = Category.objects.create(
            name="Новинка"
        )
        cls.category2 = Category.objects.create(
            name="Прочный",
        )
        cls.product = Product.objects.create(
            name="testProduct",
            price_standart=100,
            brand=cls.brand,
        )
        cls.product2 = Product.objects.create(
            name="testProduct2",
            price_standart=200,
            brand=cls.brand,
        )
        cls.product_discount = Product.objects.create(
            name="testProduct3",
            price_standart=200,
            discount=10,
            brand=cls.brand,
        )
        cls.product.category.add(cls.category1)
        cls.product.category.add(cls.category2)
        cls.product_discount.category.add(cls.category1)
        cls.product_discount.category.add(cls.category2)
        cls.product2.category.add(cls.category1)

    def test_information(self):
        self.assertEqual(Product.objects.all().count(), 3)
        self.assertEqual(self.product.pk, 1)
        self.assertEqual(self.product.name, "testProduct")
        self.assertEqual(self.product.slug, slugify(self.product.name))
        self.assertEqual(self.product.brand.name, self.brand.name)
        self.assertEqual(self.product.price, 100)
        self.assertEqual(self.product.price, self.product.price_standart)
        self.assertEqual(self.product.discount, 0)

    def test_serializer_list(self):
        response = self.client.get(reverse("product_list"))
        result = response.json()['results']
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 3)
        self.assertEqual(len(result[0].keys()), 9)
        self.assertEqual(result[0]["name"], self.product.name)
        self.assertEqual(result[0]["slug"], self.product.slug)
        self.assertEqual(result[0]["price"], self.product.price)
        self.assertEqual(result[0]["price_standart"], self.product.price)
        self.assertEqual(result[2]["price_standart"], self.product_discount.price_standart)
        self.assertEqual(result[2]["discount"], self.product_discount.discount)
        self.assertEqual(result[2]["price"],
                         self.product_discount.price * (1 - self.product_discount.discount // 100))
        self.assertEqual(result[0]["brand"], self.brand.name)
        self.assertEqual(result[0]["category"][0]["name"], self.category1.name)
        self.assertEqual(result[0]["category"][1]["name"], self.category2.name)
        self.assertEqual(len(result[0]["category"]), 2)
        self.assertEqual(len(result[1]["category"]), 1)

    def test_serializer_detail(self):
        response = self.client.get(reverse("product_detail", kwargs={"slug": slugify(self.product_discount.name)}))
        response_fake = self.client.get(reverse("product_detail", kwargs={"slug": "NOSLUG"}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_fake.status_code, 404)
        self.assertEqual(len(response.json()), 12)
        self.assertEqual(response.json()["name"], self.product_discount.name)
        self.assertEqual(response.json()["slug"], self.product_discount.slug)
        self.assertEqual(response.json()["price"], self.product_discount.price)
        self.assertEqual(response.json()["price_standart"], self.product_discount.price_standart)
        self.assertEqual(response.json()["discount"], self.product_discount.discount)
        self.assertEqual(response.json()["brand"], self.brand.name)
        self.assertEqual(response.json()["category"][0]["name"], self.category1.name)
        self.assertEqual(len(response.json()["category"]), 2)

    def test_get_requests_to_list(self):
        response_sort = self.client.get(reverse("product_list") + "?sort=price")
        response_brand = self.client.get(reverse("product_list") + "?brand=xiaomi")
        response_brand_many = self.client.get(reverse("product_list") + "?brand=xiaomi-apple")
        response_price = self.client.get(reverse("product_list") + "?price=100000-140000")
        response_many = self.client.get(reverse("product_list") + "?brand=xiaomi-apple&price=100000-140000&sort=price")
        response_group = self.client.get(reverse("product_list") + "?group=brand&sort=price")
        self.assertEqual(response_sort.status_code, 200)
        self.assertEqual(response_brand.status_code, 200)
        self.assertEqual(response_brand_many.status_code, 200)
        self.assertEqual(response_price.status_code, 200)
        self.assertEqual(response_many.status_code, 200)
        self.assertEqual(response_group.status_code, 200)
        price1 = 0
        test_request = False
        for product in response_many.json()['results']:
            if product["price"] not in range(100000, 140000 + 1) \
                    or product["brand"].lower not in ("xiamoi", 'apple') \
                    or product['price'] < price1:
                break
            price1 = product['price']
        else:
            test_request = True
        self.assertEqual(test_request, True)

    def test_search(self):
        response1 = self.client.get(reverse("product_list") + "?q=Смартфон+Apple+Iphone+13")
        response2 = self.client.get(reverse("product_list") + "?q=cмартфон+apple+iphone+13")
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response1.json(), response2.json())

    def test_add_to_cart(self):
        response1 = self.client.post(reverse('add_to_cart'), data={'product': 1, 'count': 1}, format='json')
        response2 = self.client.post(reverse('add_to_cart'), data={'product': 1, 'count': 1}, format='json')
        response3 = self.client.post(reverse('add_to_cart'), data={'product': 2, 'count': 1}, format='json')
        cart_cookie = json.loads(response3.cookies['cart'].value)
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 204)
        self.assertEqual(response3.status_code, 200)
        self.assertEqual(len(cart_cookie), 2)
        self.assertEqual(cart_cookie[0]['count'], 2)
        self.assertEqual(cart_cookie[1]['count'], 1)
        response4 = self.client.post(reverse('add_to_cart'), data={})
        self.assertEqual(response4.status_code, 400)

    def test_delete_from_cart(self):
        self.client.post(reverse('add_to_cart'), data={'product': 1, 'count': 1}, format='json')
        self.client.post(reverse('add_to_cart'), data={'product': 1, 'count': 1}, format='json')
        response = self.client.post(reverse('add_to_cart'), data={'product': 2, 'count': 1}, format='json')
        cart_cookie = json.loads(response.cookies['cart'].value)
        self.assertEqual(len(cart_cookie), 2)
        self.assertEqual(cart_cookie[0]['count'], 2)
        self.assertEqual(cart_cookie[1]['count'], 1)
        response = self.client.delete(reverse("delete_from_cart"), data={'product': 1}, format='json')
        self.assertEqual(response.status_code, 200)
        cart_cookie = json.loads(response.cookies['cart'].value)
        self.assertEqual(len(cart_cookie), 1)
        self.assertEqual(cart_cookie[0]['count'], 1)
        response = self.client.delete(reverse("delete_from_cart"), data={'product': 9999999}, format='json')
        self.assertEqual(response.status_code, 204)

    def test_update_cart(self):
        self.client.post(reverse('add_to_cart'), data={'product': 1, 'count': 1}, format='json')
        self.client.post(reverse('add_to_cart'), data={'product': 2, 'count': 1}, format='json')
        response = self.client.put(reverse('update_cart'), data={'product': 2, 'new_count': 3}, format='json')
        self.assertEqual(response.status_code, 200)
        cart_cookie = json.loads(response.cookies['cart'].value)
        self.assertEqual(len(cart_cookie), 2)
        self.assertEqual(cart_cookie[0]['count'], 1)
        self.assertEqual(cart_cookie[1]['count'], 3)
        response = self.client.put(reverse('update_cart'), data={'product': 999999, 'new_count': 3}, format='json')
        self.assertEqual(response.status_code, 204)
        response = self.client.put(reverse('update_cart'), data={'product': 2, 'new_count': -4}, format='json')
        self.assertEqual(response.status_code, 400)
        response = self.client.put(reverse('update_cart'), data={'product': 2}, format='json')
        self.assertEqual(response.status_code, 400)