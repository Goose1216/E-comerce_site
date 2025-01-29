from django_opensearch_dsl import Document, fields
from django_opensearch_dsl.registries import registry
from opensearchpy import analyzer
from .models import Product, Category, Brand

russian_analyzer = analyzer(
    'russian',
    tokenizer="standard",
    filter=["lowercase"]
)


@registry.register_document
class ProductDocument(Document):
    category = fields.ObjectField(properties={
        'name': fields.TextField(analyzer=russian_analyzer),
    })
    brand = fields.ObjectField(properties={
        'name': fields.TextField(analyzer=russian_analyzer),
    })

    class Index:
        name = 'products'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
            'analysis': {
                'analyzer': {
                    'russian': russian_analyzer
                },
            }
        }

        auto_refresh = False

    class Django:
        model = Product
        fields = {
            'name': fields.TextField(analyzer=russian_analyzer)
        }
        related_models = [Category, Brand]

    def get_instances_from_related(self, related_instance):
        """Обновление индекса при изменении связанных моделей."""
        if isinstance(related_instance, Category):
            return related_instance.products.all()