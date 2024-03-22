from rest_framework.test import APITestCase
from django.urls import reverse
from .models import Brand, Category, Product
from django.template.defaultfilters import slugify


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
            price=100,
            brand=cls.brand,
        )
        cls.product2 = Product.objects.create(
            name="testProduct2",
            price=200,
            brand=cls.brand,
        )
        cls.product.category.add(cls.category1)
        cls.product.category.add(cls.category2)
        cls.product2.category.add(cls.category1)

    def test_information(self):
        self.assertEqual(Product.objects.all().count(), 2)
        self.assertEqual(self.product.pk, 1)
        self.assertEqual(self.product.name, "testProduct")
        self.assertEqual(self.product.slug, slugify(self.product.name))
        self.assertEqual(self.product.brand.name, self.brand.name)
        self.assertEqual(self.product.price, 100)

    def test_serializer_list(self):
        response = self.client.get(reverse("product_list"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(len(response.json()[0].keys()), 6)
        self.assertEqual(response.json()[0]["name"], self.product.name)
        self.assertEqual(response.json()[0]["slug"], self.product.slug)
        self.assertEqual(response.json()[0]["price"], self.product.price)
        self.assertEqual(response.json()[0]["brand"], self.brand.name)
        self.assertEqual(response.json()[0]["category"][0]["name"], self.category1.name)
        self.assertEqual(response.json()[0]["category"][1]["name"], self.category2.name)
        self.assertEqual(len(response.json()[0]["category"]), 2)
        self.assertEqual(len(response.json()[1]["category"]), 1)

    def test_serializer_detail(self):
        response = self.client.get(reverse("product_detail", kwargs={"slug": slugify(self.product.name)}))
        response_fake = self.client.get(reverse("product_detail", kwargs={"slug": "NOSLUG"}))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_fake.status_code, 404)
        self.assertEqual(len(response.json()), 9)
        self.assertEqual(response.json()["name"], self.product.name)
        self.assertEqual(response.json()["slug"], self.product.slug)
        self.assertEqual(response.json()["price"], self.product.price)
        self.assertEqual(response.json()["brand"], self.brand.name)
        self.assertEqual(response.json()["category"][0]["name"], self.category1.name)
        self.assertEqual(len(response.json()["category"]), 2)
