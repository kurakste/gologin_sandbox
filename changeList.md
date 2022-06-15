1. Даты создания и обновления везде приведены к названиям и единому формату createdAt, updatedAt
2. Product checkedat => checkedAt paidat => paidAt supplier => suppliersIds currentSupplier => currentSupplierId

Выборка всех продуктов при пустом результате выдает пустой массив вместо 404

3. Order updatedAt product => product, productId images - [<String>] or Null (раньше пустой массив отдавал всегда)
4. Payment recipient => recipient, recipientId

5. Box items.product => (productId, product)
   items.order => (orderId, order)
   images: - было всегда [], теперь: [] или Null

BOX SPLIT Было:

```js
{
  "guid"
:
  "4380c71c-9d48-4519-8edc-b797a06aa4e8",
    "itemsBoxSet"
:
  [
    [
      {
        "product": "0516bcf0-641f-4c07-980b-b98b16071e81",
        "amount": "100",
        "order": "b4250fe1-a743-4d25-ba5d-a113250c027e"
      }
    ],
    [
      {
        "product": "0516bcf0-641f-4c07-980b-b98b16071e81",
        "amount": "320",
        "order": "b4250fe1-a743-4d25-ba5d-a113250c027e"
      }
    ]
  ]
}
```

Стало:

```js
{
  "guid":"4380c71c-9d48-4519-8edc-b797a06aa4e8",
    "itemsBoxSet":
  [
    [
      {
        "productId": "0516bcf0-641f-4c07-980b-b98b16071e81",
        "amount": "100",
        "orderId": "b4250fe1-a743-4d25-ba5d-a113250c027e"
      }
    ],
    [
      {
        "productId": "0516bcf0-641f-4c07-980b-b98b16071e81",
        "amount": "320",
        "orderId": "b4250fe1-a743-4d25-ba5d-a113250c027e"
      }
    ]
  ]
}
```

POST /admins/make_payment
recipient = > recipientId
